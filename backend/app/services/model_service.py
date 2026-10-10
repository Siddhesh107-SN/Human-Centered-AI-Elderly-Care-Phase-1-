import logging
import os
import sys
from pathlib import Path
from typing import Any, Dict, List, Optional
import joblib
import pandas as pd
from backend.app.core.config import settings

logger = logging.getLogger("carepulse.ml.model_service")

# Ensure backward compatibility for unpickling custom preprocessors from original project
try:
    import backend.ml.utils.preprocessing as ml_prep
    sys.modules["backend.utils.preprocessing"] = ml_prep
except Exception as e:
    logger.warning("Could not register preprocessor alias: %s", str(e))


class ModelService:
    """
    Singleton service managing the machine learning artifacts.
    Loads models, preprocessors, scalers, and encoders once at application startup.
    """
    _instance: Optional["ModelService"] = None

    def __init__(self):
        self.models: Dict[str, Any] = {}
        self.encoder: Any = None
        self.scaler: Any = None
        self.preprocessor: Any = None
        self.background_sample: Optional[pd.DataFrame] = None
        self._is_loaded: bool = False

    @classmethod
    def get_instance(cls) -> "ModelService":
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    @property
    def is_loaded(self) -> bool:
        return self._is_loaded

    def load_artifacts(self) -> None:
        """Load all model files and preprocessing artifacts."""
        if self._is_loaded:
            return

        models_dir = settings.ML_MODELS_DIR
        prep_dir = settings.ML_PREPROCESSING_DIR

        logger.info("Loading ML models from: %s", models_dir)
        logger.info("Loading preprocessing artifacts from: %s", prep_dir)

        # 1. Load trained classification models
        model_files = {
            "logistic_regression": models_dir / "logistic_regression.pkl",
            "decision_tree": models_dir / "decision_tree.pkl",
            "random_forest": models_dir / "random_forest.pkl",
            "xgboost": models_dir / "xgboost.pkl",
        }

        for model_name, path in model_files.items():
            if not path.exists():
                raise FileNotFoundError(f"Model artifact not found: {path}")
            self.models[model_name] = joblib.load(path)
            logger.info("Loaded ML model: %s", model_name)

        # 2. Load preprocessing artifacts
        encoder_path = prep_dir / "encoder.pkl"
        scaler_path = prep_dir / "scaler.pkl"
        preprocessor_path = prep_dir / "preprocessor.pkl"
        bg_path = prep_dir / "background_sample.pkl"

        if not encoder_path.exists():
            raise FileNotFoundError(f"Encoder artifact not found: {encoder_path}")
        self.encoder = joblib.load(encoder_path)

        if not scaler_path.exists():
            raise FileNotFoundError(f"Scaler artifact not found: {scaler_path}")
        self.scaler = joblib.load(scaler_path)

        if preprocessor_path.exists():
            try:
                self.preprocessor = joblib.load(preprocessor_path)
            except Exception as e:
                logger.warning("Loading custom preprocessor via fallback: %s", str(e))

        if bg_path.exists():
            self.background_sample = joblib.load(bg_path)

        self._is_loaded = True
        logger.info("All ML artifacts successfully initialized.")

    def get_model(self, model_name: str) -> Any:
        if not self._is_loaded:
            self.load_artifacts()
        normalized_name = model_name.lower().strip()
        if normalized_name not in self.models:
            raise ValueError(
                f"Unknown model: '{model_name}'. Available models: {list(self.models.keys())}"
            )
        return self.models[normalized_name]

    def get_available_models(self) -> List[str]:
        if not self._is_loaded:
            self.load_artifacts()
        return list(self.models.keys())
