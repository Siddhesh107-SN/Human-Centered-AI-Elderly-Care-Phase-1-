"""
SmartHealth Stress Prediction - Data Preprocessing Utilities.

This module provides standard feature definitions, activity level cleaning,
and a scikit-learn compatible SmartHealthPreprocessor that encapsulates
the exact preprocessing pipeline used during model training.
"""

from typing import Any, Dict, List, Union
import numpy as np
import pandas as pd
from sklearn.base import BaseEstimator, TransformerMixin
from sklearn.preprocessing import OrdinalEncoder


# Exact feature column names expected by trained models
FEATURE_NAMES: List[str] = [
    "Heart Rate (BPM)",
    "Blood Oxygen Level (%)",
    "Step Count",
    "Sleep Duration (hours)",
    "Activity Level",
    "Stress Level",
]

# Standard target labels
LABEL_MAP: Dict[int, str] = {
    0: "Low Health Risk",
    1: "Elevated Health Risk",
}

# Supported activity level categories for ordinal encoding
ACTIVITY_CATEGORIES: List[str] = ["sedentary", "active", "highly active"]


def clean_activity_level(value: Union[str, int, float]) -> str:
    """
    Clean and standardize raw activity level input into valid category string.

    Handles string variations, typos, case sensitivity, underscores,
    and integer/float encodings (0 -> sedentary, 1 -> active, 2 -> highly active).
    """
    if isinstance(value, (int, float, np.integer, np.floating)):
        int_val = int(value)
        num_map = {0: "sedentary", 1: "active", 2: "highly active"}
        if int_val in num_map:
            return num_map[int_val]
        raise ValueError(
            f"Numeric activity level must be 0, 1, or 2. Received: {value}"
        )

    val_str = str(value).strip().lower().replace("_", " ")
    typo_corrections = {
        "actve": "active",
        "seddentary": "sedentary",
        "highly active": "highly active",
        "highlyactive": "highly active",
    }
    cleaned = typo_corrections.get(val_str, val_str)

    if cleaned not in ACTIVITY_CATEGORIES:
        raise ValueError(
            f"Invalid activity level '{value}'. Allowed values are: {ACTIVITY_CATEGORIES} or (0, 1, 2)."
        )
    return cleaned


class SmartHealthPreprocessor(BaseEstimator, TransformerMixin):
    """
    Production-ready preprocessor for SmartHealth stress prediction.

    Ensures that input dictionaries or DataFrames:
    1. Have all required columns mapped properly.
    2. Have Activity Level cleaned and encoded using the fitted OrdinalEncoder.
    3. Maintain the exact feature ordering and types expected by the ML models.
    """

    def __init__(self, encoder: OrdinalEncoder = None) -> None:
        self.encoder = encoder
        self.feature_names = FEATURE_NAMES

    def fit(self, X: Any, y: Any = None) -> "SmartHealthPreprocessor":
        """
        Fit the ordinal encoder on activity level categories if not already fitted.
        """
        if self.encoder is None:
            self.encoder = OrdinalEncoder(categories=[ACTIVITY_CATEGORIES])
            if isinstance(X, pd.DataFrame) and "Activity Level" in X.columns:
                cleaned_activity = (
                    X["Activity Level"].apply(clean_activity_level).to_frame()
                )
                self.encoder.fit(cleaned_activity)
            else:
                dummy_df = pd.DataFrame(
                    {"Activity Level": ["sedentary", "active", "highly active"]}
                )
                self.encoder.fit(dummy_df[["Activity Level"]])
        return self

    def transform(self, X: Union[pd.DataFrame, Dict[str, Any], List[Dict[str, Any]]]) -> pd.DataFrame:
        """
        Transform raw input data into a clean, model-ready Pandas DataFrame.
        DOES NOT refit anything. Pure inference transform.
        """
        if isinstance(X, dict):
            df = pd.DataFrame([X])
        elif isinstance(X, list):
            df = pd.DataFrame(X)
        elif isinstance(X, pd.DataFrame):
            df = X.copy()
        else:
            raise TypeError(
                f"Unsupported input type {type(X)}. Expected dict, list of dicts, or pandas DataFrame."
            )

        # Map common alias names if input uses snake_case or different key names
        alias_mapping = {
            "heart_rate_bpm": "Heart Rate (BPM)",
            "heart_rate": "Heart Rate (BPM)",
            "blood_oxygen_level": "Blood Oxygen Level (%)",
            "blood_oxygen": "Blood Oxygen Level (%)",
            "spo2": "Blood Oxygen Level (%)",
            "step_count": "Step Count",
            "steps": "Step Count",
            "sleep_duration_hours": "Sleep Duration (hours)",
            "sleep_duration": "Sleep Duration (hours)",
            "sleep_hours": "Sleep Duration (hours)",
            "activity_level": "Activity Level",
            "activity": "Activity Level",
            "stress_level": "Stress Level",
            "stress": "Stress Level",
        }

        # Rename columns if aliases are used
        df = df.rename(columns={col: alias_mapping[col] for col in df.columns if col in alias_mapping})

        # Check for missing required features
        missing_cols = [col for col in self.feature_names if col not in df.columns]
        if missing_cols:
            raise ValueError(
                f"Missing required feature columns: {missing_cols}. Required columns are: {self.feature_names}"
            )

        # Select columns in exact order
        df = df[self.feature_names].copy()

        # Clean and encode Activity Level
        # If Activity Level is already numeric float/int matching categories 0, 1, 2, check it
        activity_col = df["Activity Level"]
        if pd.api.types.is_numeric_dtype(activity_col) and set(activity_col.dropna().unique()).issubset({0, 1, 2, 0.0, 1.0, 2.0}):
            df["Activity Level"] = activity_col.astype(float)
        else:
            cleaned_series = activity_col.apply(clean_activity_level)
            cleaned_df = pd.DataFrame({"Activity Level": cleaned_series})
            if self.encoder is not None:
                encoded_values = self.encoder.transform(cleaned_df[["Activity Level"]])
                df["Activity Level"] = encoded_values[:, 0]
            else:
                cat_map = {"sedentary": 0.0, "active": 1.0, "highly active": 2.0}
                df["Activity Level"] = cleaned_series.map(cat_map).astype(float)

        # Convert numeric columns to float64
        numeric_cols = [
            "Heart Rate (BPM)",
            "Blood Oxygen Level (%)",
            "Step Count",
            "Sleep Duration (hours)",
            "Activity Level",
            "Stress Level",
        ]
        for col in numeric_cols:
            df[col] = pd.to_numeric(df[col], errors="raise").astype(float)

        return df
