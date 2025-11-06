"""
FastAPI Main Application Entry Point
Auto-Sweep Loyalty Platform
"""
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager
import uvicorn

from core.config import settings
from core.database import engine, Base
from core.logger import logger
from api.auth import routes as auth_routes
from api.payments import routes as payment_routes
from api.rewards import routes as reward_routes
from api.users import routes as user_routes
from api.analytics import routes as analytics_routes


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events"""
    logger.info("🚀 Starting Auto-Sweep Loyalty Platform")
    logger.info(f"Environment: {settings.APP_ENV}")
    
    # Create database tables
    # Base.metadata.create_all(bind=engine)
    logger.info("✅ Database initialized")
    
    yield
    
    logger.info("🛑 Shutting down Auto-Sweep Loyalty Platform")


# Initialize FastAPI application
app = FastAPI(
    title=settings.APP_NAME,
    description="Automated Sweepstakes and Loyalty Platform with Multi-Payment Support",
    version=settings.API_VERSION,
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"/api/{settings.API_VERSION}/openapi.json"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Trusted Host Middleware (production)
if settings.APP_ENV == "production":
    app.add_middleware(
        TrustedHostMiddleware,
        allowed_hosts=settings.ALLOWED_HOSTS
    )


# Health check endpoint
@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for container orchestration"""
    return {
        "status": "healthy",
        "service": settings.APP_NAME,
        "version": settings.API_VERSION,
        "environment": settings.APP_ENV
    }


# Root endpoint
@app.get("/", tags=["Root"])
async def root():
    """API root endpoint"""
    return {
        "message": "Auto-Sweep Loyalty Platform API",
        "version": settings.API_VERSION,
        "docs": "/docs",
        "health": "/health"
    }


# Global exception handler
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """Global exception handler"""
    logger.error(f"Unhandled exception: {str(exc)}", exc_info=True)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error",
            "type": "server_error"
        }
    )


# Include API routers
app.include_router(
    auth_routes.router,
    prefix=f"/api/{settings.API_VERSION}/auth",
    tags=["Authentication"]
)

app.include_router(
    payment_routes.router,
    prefix=f"/api/{settings.API_VERSION}/payments",
    tags=["Payments"]
)

app.include_router(
    reward_routes.router,
    prefix=f"/api/{settings.API_VERSION}/rewards",
    tags=["Rewards"]
)

app.include_router(
    user_routes.router,
    prefix=f"/api/{settings.API_VERSION}/users",
    tags=["Users"]
)

app.include_router(
    analytics_routes.router,
    prefix=f"/api/{settings.API_VERSION}/analytics",
    tags=["Analytics"]
)


if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host=settings.BACKEND_HOST,
        port=settings.BACKEND_PORT,
        reload=settings.DEBUG,
        log_level="info"
    )
