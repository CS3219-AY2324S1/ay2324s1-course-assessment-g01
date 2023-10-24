from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    mongodb_url: str | None = None
    questions_url: str | None = None
