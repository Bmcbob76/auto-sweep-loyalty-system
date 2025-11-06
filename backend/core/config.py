"""
Application Configuration
Loads settings from environment variables
"""
from pydantic_settings import BaseSettings
from typing import List
from functools import lru_cache


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""
    
    # Application
    APP_NAME: str = "auto-sweep-loyalty-platform"
    APP_ENV: str = "development"
    DEBUG: bool = True
    API_VERSION: str = "v1"
    SECRET_KEY: str
    
    # Server
    BACKEND_HOST: str = "0.0.0.0"
    BACKEND_PORT: int = 8000
    CORS_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:3001"]
    ALLOWED_HOSTS: List[str] = ["*"]
    
    # JWT
    JWT_SECRET_KEY: str
    JWT_ALGORITHM: str = "HS256"
    JWT_ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    JWT_REFRESH_TOKEN_EXPIRE_DAYS: int = 7
    
    # Database
    DATABASE_URL: str
    DB_POOL_SIZE: int = 10
    DB_MAX_OVERFLOW: int = 20
    
    # Redis
    REDIS_URL: str = "redis://localhost:6379/0"
    
    # Stripe
    STRIPE_SECRET_KEY: str = ""
    STRIPE_PUBLIC_KEY: str = ""
    STRIPE_WEBHOOK_SECRET: str = ""
    
    # PayPal
    PAYPAL_MODE: str = "sandbox"
    PAYPAL_CLIENT_ID: str = ""
    PAYPAL_CLIENT_SECRET: str = ""
    PAYPAL_WEBHOOK_ID: str = ""
    
    # Venmo (via Braintree)
    VENMO_MERCHANT_ID: str = ""
    VENMO_PUBLIC_KEY: str = ""
    VENMO_PRIVATE_KEY: str = ""
    
    # Cash App
    CASHAPP_CLIENT_ID: str = ""
    CASHAPP_CLIENT_SECRET: str = ""
    CASHAPP_WEBHOOK_SECRET: str = ""
    
    # Chime
    CHIME_CLIENT_ID: str = ""
    CHIME_SECRET: str = ""
    
    # Zelle
    ZELLE_PARTNER_ID: str = ""
    ZELLE_API_KEY: str = ""
    
    # Cryptocurrency
    CRYPTO_API_KEY: str = ""
    CRYPTO_WEBHOOK_SECRET: str = ""
    CRYPTO_SUPPORTED: str = "BTC,ETH,USDC,USDT"
    
    # Facebook
    FB_PAGE_ACCESS_TOKEN: str = ""
    FB_APP_ID: str = ""
    FB_APP_SECRET: str = ""
    FB_VERIFY_TOKEN: str = ""
    
    # Email (SendGrid)
    SENDGRID_API_KEY: str = ""
    SENDGRID_FROM_EMAIL: str = ""
    SENDGRID_FROM_NAME: str = "Auto-Sweep Loyalty"
    
    # SMS (Twilio)
    TWILIO_ACCOUNT_SID: str = ""
    TWILIO_AUTH_TOKEN: str = ""
    TWILIO_PHONE_NUMBER: str = ""
    
    # AI Services
    ELEVENLABS_API_KEY: str = ""
    ELEVENLABS_VOICE_ID: str = ""
    OPENAI_API_KEY: str = ""
    OPENAI_MODEL: str = "gpt-4"
    
    # Security
    ENCRYPTION_KEY: str = ""
    PASSWORD_MIN_LENGTH: int = 8
    MAX_LOGIN_ATTEMPTS: int = 5
    LOGIN_LOCKOUT_DURATION_MINUTES: int = 15
    
    # Rewards Configuration
    POINTS_PER_DOLLAR: int = 10
    TIER_BRONZE_THRESHOLD: int = 0
    TIER_SILVER_THRESHOLD: int = 1000
    TIER_GOLD_THRESHOLD: int = 5000
    TIER_PLATINUM_THRESHOLD: int = 10000
    REFERRAL_BONUS_POINTS: int = 500
    
    # Rate Limiting
    RATE_LIMIT_PER_MINUTE: int = 60
    RATE_LIMIT_PER_HOUR: int = 1000
    
    # Logging
    LOG_LEVEL: str = "INFO"
    LOG_FILE_PATH: str = "/var/log/loyalty-platform/app.log"
    
    class Config:
        env_file = ".env"
        case_sensitive = True


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance"""
    return Settings()


settings = get_settings()
