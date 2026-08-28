from pydantic_settings import BaseSettings
from functools import lru_cache
from pathlib import Path


class Settings(BaseSettings):
    cognodb_uri: str
    cognodb_username: str
    cognodb_password: str
    openai_api_key: str = ""
    cors_origins: str = "*"
    
    class Config:
        env_file = Path(__file__).parent.parent.parent / ".env"
        case_sensitive = False


@lru_cache()
def get_settings() -> Settings:
    return Settings()
