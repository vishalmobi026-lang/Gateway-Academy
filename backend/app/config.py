from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    DATABASE_URL: str
    GEMINI_API_KEY: str
    SECRET_KEY: str
    ALGORITHM: str
    ACCESS_TOKEN_EXPIRE_MINUTE: int

    model_config = SettingsConfigDict(env_file=".env")
    
settings = Settings()