from fastapi import APIRouter

# Create main API router
api_router = APIRouter()

# PM-AJAY GIA Voice Assistant & NSQF Livelihood Scoring Engine
# Vikalp AI | SIH 2026 | PS ID: 26097 | Team: BinaryDNF | Ministry: MoSJE, GoI
from app.api.v1.endpoints import pmajay
api_router.include_router(pmajay.router, prefix="/pmajay", tags=["pmajay"])

# Auth (used by admin dashboard login)
from app.api.v1.endpoints import auth
api_router.include_router(auth.router, prefix="/auth", tags=["auth"])
