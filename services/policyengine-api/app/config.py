import json
from typing import List, Union
from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Application configuration loaded from environment variables."""

    # Server Settings
    PORT: int = 8000
    HOST: str = "0.0.0.0"
    ENVIRONMENT: str = "production"
    DEBUG: bool = False

    # CORS Settings
    ALLOWED_ORIGINS: Union[List[str], str] = [
        "https://toolcastle.app",
        "https://www.toolcastle.app",
        "http://localhost:4321",
        "http://localhost:3000",
    ]

    # Security Settings
    REQUIRE_API_KEY: bool = False
    API_SECRET_KEY: str = "dev_secret_key"
    MAX_REQUEST_SIZE_BYTES: int = 65536  # 64 KB limit for JSON payloads

    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60

    # Engine Constraints
    DEFAULT_TAX_YEAR: int = 2026
    MAX_HOUSEHOLD_MEMBERS: int = 10

    @field_validator("ALLOWED_ORIGINS", mode="before")
    @classmethod
    def parse_allowed_origins(cls, v: Union[str, List[str]]) -> List[str]:
        if isinstance(v, str):
            try:
                parsed = json.loads(v)
                if isinstance(parsed, list):
                    return parsed
            except json.JSONDecodeError:
                return [origin.strip() for origin in v.split(",") if origin.strip()]
        return v

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()

