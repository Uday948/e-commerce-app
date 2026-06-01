from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    database_url: str = "postgresql+asyncpg://ecom:ecom@localhost:5432/ecomdb"
    secret_key: str = "change-me"
    access_token_expire_minutes: int = 60
    algorithm: str = "HS256"

    class Config:
        env_file = ".env"


settings = Settings()
