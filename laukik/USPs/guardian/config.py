from pydantic_settings import BaseSettings
from functools import lru_cache
from typing import Optional

class Settings(BaseSettings):
    # Google Gemini
    gemini_api_key: Optional[str] = "dev_gemini_key"

    # TruGen AI (Live Video Avatar)
    trugen_api_key: Optional[str] = "dev_trugen_key"
    trugen_agent_id: Optional[str] = "8700376f-dd31-4ae6-b890-59b4c22f0aab"

    # Vapi AI (Emergency Voice Caller)
    vapi_api_key: Optional[str] = "dev_vapi_key"
    vapi_phone_number_id: Optional[str] = "dev_phone_id"
    vapi_assistant_id: Optional[str] = "eeec707c-8499-4b0b-b81e-e9e3d08742e8"

    # Upstash Redis
    redis_url: Optional[str] = "dev_redis_url"
    redis_token: Optional[str] = "dev_redis_token"

    # Upstash Kafka
    kafka_bootstrap_servers: Optional[str] = "dev_kafka_server"
    kafka_username: Optional[str] = "dev_kafka_user"
    kafka_password: Optional[str] = "dev_kafka_pass"

    # Database
    database_url: Optional[str] = "dev_db_url"
    supabase_url: Optional[str] = "dev_supabase_url"
    supabase_anon_key: Optional[str] = "dev_supabase_key"

    # App
    app_env: str = "development"
    cors_origin: str = "http://localhost:5173"

    class Config:
        env_file = ".env"
        extra = "ignore"

@lru_cache()
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
