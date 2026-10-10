import os
from pathlib import Path
from typing import List, Union
from urllib.parse import quote_plus
from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


BASE_DIR = Path(__file__).resolve().parent.parent.parent.parent
BACKEND_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    PROJECT_NAME: str = "CarePulse AI - Human-Centered Elderly Care"
    VERSION: str = "2.0.0"
    API_V1_STR: str = "/api/v1"

    # Security
    SECRET_KEY: str = os.getenv("SECRET_KEY", "carepulse_elderly_care_ai_secret_key_2026_secure_default")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 7  # 7 days for elderly accessibility

    # MySQL Database Configuration
    MYSQL_HOST: str = os.getenv("MYSQL_HOST", "localhost")
    MYSQL_PORT: int = int(os.getenv("MYSQL_PORT", "3306"))
    MYSQL_USER: str = os.getenv("MYSQL_USER", "elderly_care_user")
    MYSQL_PASSWORD: str = os.getenv("MYSQL_PASSWORD", "ElderlyCare@2026")
    MYSQL_DB: str = os.getenv("MYSQL_DB", "elderly_care_db")
    
    # Optional direct DATABASE_URL override
    DATABASE_URL_OVERRIDE: str = os.getenv("DATABASE_URL", "")

    # CORS
    ALLOWED_ORIGINS: str = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000"
    )

    # ML Paths
    ML_BASE_DIR: Path = BACKEND_DIR / "ml"
    ML_MODELS_DIR: Path = BACKEND_DIR / "ml" / "models"
    ML_PREPROCESSING_DIR: Path = BACKEND_DIR / "ml" / "preprocessing"

    @property
    def get_database_url(self) -> str:
        if self.DATABASE_URL_OVERRIDE:
            return self.DATABASE_URL_OVERRIDE
        # Safely URL-encode password containing special characters like '@'
        encoded_password = quote_plus(self.MYSQL_PASSWORD)
        return f"mysql+pymysql://{self.MYSQL_USER}:{encoded_password}@{self.MYSQL_HOST}:{self.MYSQL_PORT}/{self.MYSQL_DB}?charset=utf8mb4"

    @property
    def cors_origins(self) -> List[str]:
        return [origin.strip() for origin in self.ALLOWED_ORIGINS.split(",") if origin.strip()]

    model_config = SettingsConfigDict(
        env_file=str(BASE_DIR / ".env"),
        env_file_encoding="utf-8",
        extra="ignore"
    )


settings = Settings()
