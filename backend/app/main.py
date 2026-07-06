from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter
from slowapi.middleware import SlowAPIMiddleware
from slowapi.util import get_remote_address
from app.api.routes import admin, ai, auth, pantry, planner, recipes, shopping
from app.core.config import settings
from app.core.database import Base, engine
from app import models


Base.metadata.create_all(bind=engine)

limiter = Limiter(key_func=get_remote_address, default_limits=["200/minute"])

app = FastAPI(title=settings.app_name, version="1.0.0", openapi_url="/api/v1/openapi.json")
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "healthy", "service": settings.app_name}


app.include_router(auth.router, prefix="/api/v1")
app.include_router(recipes.router, prefix="/api/v1")
app.include_router(ai.router, prefix="/api/v1")
app.include_router(pantry.router, prefix="/api/v1")
app.include_router(planner.router, prefix="/api/v1")
app.include_router(shopping.router, prefix="/api/v1")
app.include_router(admin.router, prefix="/api/v1")

