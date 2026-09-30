from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.api.v1.router import api_router
from app.core.security_middleware import (
    limiter,
    security_headers_middleware,
    request_logging_middleware,
    rate_limit_exceeded_handler
)
from slowapi.errors import RateLimitExceeded
import logging
import os

# Configure logging
os.makedirs("logs", exist_ok=True)
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.StreamHandler()
    ]
)

logger = logging.getLogger(__name__)

# Create FastAPI app — Vikalp AI (SIH 2026 | PS ID: 26097)
app = FastAPI(
    title="Vikalp AI",
    version="1.0.0",
    description=(
        "AI-Driven Voice Assistant for Livelihood Mapping and NSQF-Aligned "
        "Skilling Recommendations for SC Communities under the GIA Component of PM-AJAY. "
        "SIH 2026 | PS ID: 26097 | Team: BinaryDNF | Ministry: MoSJE, GoI"
    )
)

# Add rate limiter state
app.state.limiter = limiter

# Add rate limit exceeded handler
app.add_exception_handler(RateLimitExceeded, rate_limit_exceeded_handler)

# Security Middleware (MUST be first)
app.middleware("http")(security_headers_middleware)
app.middleware("http")(request_logging_middleware)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:8080",
        "http://127.0.0.1:8080",
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://saathi-umber-seven.vercel.app",
    ],
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Include API router
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "project": "Vikalp AI",
        "description": "AI-Driven Voice Assistant for PM-AJAY GIA Skilling (SIH 2026 | PS ID: 26097)",
        "team": "BinaryDNF",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "app": "Vikalp AI",
        "version": "1.0.0"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )
