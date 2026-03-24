"""Application settings loaded from environment variables."""

import os
from pathlib import Path

from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(dotenv_path=BASE_DIR / ".env")

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-change-this-in-production")
ALGORITHM = os.getenv("ALGORITHM", "HS256")
ACCESS_TOKEN_EXPIRE_MINUTES = int(os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30"))

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_MODEL_NAME = os.getenv("GROQ_MODEL_NAME", "qwen/qwen3-32b")

HINDSIGHT_API_KEY = os.getenv("HINDSIGHT_API_KEY")
HINDSIGHT_BASE_URL = os.getenv(
    "HINDSIGHT_BASE_URL", "https://api.hindsight.vectorize.io"
)
HINDSIGHT_COLLECTION_NAME = os.getenv("HINDSIGHT_COLLECTION_NAME", "study_memory")

# Database configuration
DATABASE_URL = os.getenv(
    "DATABASE_URL",
    "postgresql://user:password@localhost:5432/ai_study_companion",
)


def _parse_cors_origins(raw_value: str) -> list[str]:
    return [item.strip() for item in raw_value.split(",") if item.strip()]


ALLOWED_CORS_ORIGINS = _parse_cors_origins(
    os.getenv("ALLOWED_CORS_ORIGINS", "http://localhost:5173")
)
