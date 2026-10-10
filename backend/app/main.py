import logging
import os
from contextlib import asynccontextmanager
from pathlib import Path
from fastapi import FastAPI, Request, status, HTTPException, Depends
from fastapi.responses import JSONResponse, FileResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError

from backend.app.core.config import settings
from backend.app.services.model_service import ModelService
from backend.app.database.session import check_database_connection
from backend.app.api.v1.endpoints import auth, predictions, medicines, activities, dashboard

logger = logging.getLogger("carepulse.api")
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")

BASE_DIR = Path(__file__).resolve().parent.parent.parent
FRONTEND_DIST_DIR = BASE_DIR / "frontend" / "dist"


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("Initializing CarePulse AI Backend Service...")
    try:
        model_service = ModelService.get_instance()
        model_service.load_artifacts()
        logger.info("ML Models initialized: %s", model_service.get_available_models())
    except Exception as e:
        logger.error("ML Model Initialization Warning: %s", str(e))

    # Test MySQL connectivity
    db_check = check_database_connection()
    if db_check.get("connected"):
        logger.info("MySQL Connection Established: %s@%s:%s/%s", settings.MYSQL_USER, settings.MYSQL_HOST, settings.MYSQL_PORT, settings.MYSQL_DB)
    else:
        logger.warning("MySQL Connection Check: %s (Ensure MySQL server is running for database persistence)", db_check.get("error"))

    yield
    logger.info("CarePulse AI Backend Shutdown complete.")


app = FastAPI(
    title="CarePulse AI — Human-Centered Elderly Care REST API",
    description="""
    Production-ready full-stack backend connecting React frontend, MySQL database, and physiological ML stress prediction.
    
    * **ML Models:** XGBoost, Random Forest, Decision Tree, Logistic Regression
    * **Physiological Features:** Heart Rate, SpO2, Step Count, Sleep Duration, Activity Level, Stress Biomarker
    * **Database:** MySQL with SQLAlchemy ORM & Alembic migrations
    * **Multilingual & Accessible:** Human-centered design for elderly users and caregivers
    """,
    version="2.0.0",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Validation Error Handler
@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = []
    for err in exc.errors():
        field = " -> ".join([str(loc) for loc in err.get("loc", []) if loc != "body"])
        msg = err.get("msg", "Invalid value")
        errors.append({"field": field or "payload", "message": msg})
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={"success": False, "error": "Validation Error: Biometric features or payload fields are invalid.", "detail": errors},
    )


# System & Health Check Endpoints
@app.get("/health", summary="Basic Health Check", tags=["System"])
def health_check():
    """Liveness probe."""
    return {"status": "healthy", "service": "carepulse-backend", "version": settings.VERSION}


@app.get("/health/ready", summary="Readiness Check (MySQL & ML)", tags=["System"])
def readiness_check():
    """Readiness probe checking both ML model service and MySQL connectivity."""
    model_service = ModelService.get_instance()
    ml_ready = model_service.is_loaded
    db_status = check_database_connection()

    is_ready = ml_ready and db_status.get("connected", False)
    status_code = status.HTTP_200_OK if is_ready else status.HTTP_503_SERVICE_UNAVAILABLE

    return JSONResponse(
        status_code=status_code,
        content={
            "ready": is_ready,
            "ml_models_loaded": ml_ready,
            "available_models": model_service.get_available_models() if ml_ready else [],
            "database": db_status,
        },
    )


# Mount API Routers
app.include_router(auth.router, prefix="/api/v1/auth", tags=["Authentication & Profile"])
app.include_router(predictions.router, prefix="/api/v1/predictions", tags=["ML Health Risk Predictions"])
app.include_router(medicines.router, prefix="/api/v1/medicines", tags=["Medications & Schedules"])
app.include_router(activities.router, prefix="/api/v1/activities", tags=["Activity Meter"])
app.include_router(dashboard.router, prefix="/api/v1/dashboard", tags=["Dashboard Aggregation"])

# Backward-compatibility alias requested in specifications: POST /api/predictions/stress
app.include_router(predictions.router, prefix="/api/predictions", tags=["Predictions Legacy Alias"])


# Serve Built React Frontend SPA if available
if FRONTEND_DIST_DIR.exists():
    app.mount("/assets", StaticFiles(directory=str(FRONTEND_DIST_DIR / "assets")), name="assets")

    @app.get("/{full_path:path}", include_in_schema=False)
    async def serve_spa(full_path: str):
        file_path = FRONTEND_DIST_DIR / full_path
        if file_path.exists() and file_path.is_file():
            return FileResponse(file_path)
        return FileResponse(FRONTEND_DIST_DIR / "index.html")


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.app.main:app", host="0.0.0.0", port=8000, reload=True)
