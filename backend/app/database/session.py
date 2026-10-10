import logging
from typing import Generator
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from backend.app.core.config import settings

logger = logging.getLogger("carepulse.database")

# Explicit MySQL database engine
# Strict MySQL enforcement as per project architecture
engine = create_engine(
    settings.get_database_url,
    pool_pre_ping=True,
    pool_recycle=3600,
    pool_size=10,
    max_overflow=20,
    echo=False,
)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    FastAPI database session dependency.
    Yields a MySQL session and guarantees closing on completion.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


def check_database_connection() -> dict:
    """
    Direct health check for MySQL connection and schema readiness.
    """
    try:
        with engine.connect() as conn:
            result = conn.execute(text("SELECT 1")).scalar()
            return {
                "connected": True,
                "database": settings.MYSQL_DB,
                "host": settings.MYSQL_HOST,
                "port": settings.MYSQL_PORT,
                "user": settings.MYSQL_USER,
                "driver": "pymysql",
                "status": "ready" if result == 1 else "unexpected_result",
            }
    except OperationalError as e:
        logger.error("MySQL OperationalError: %s", str(e))
        return {
            "connected": False,
            "error": f"Could not connect to MySQL Server at {settings.MYSQL_HOST}:{settings.MYSQL_PORT}. Ensure MySQL service is running.",
            "detail": str(e),
        }
    except SQLAlchemyError as e:
        logger.error("Database connection error: %s", str(e))
        return {
            "connected": False,
            "error": "Database error occurred while testing MySQL connection.",
            "detail": str(e),
        }
