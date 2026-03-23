"""FastAPI application bootstrap and router registration."""

from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth_routes import router as auth_router
from app.api.routes.chat_routes import router as chat_router
from app.api.routes.memory_routes import router as memory_router
from app.api.routes.syllabus_routes import router as syllabus_router
from app.api.routes.system_routes import router as system_router
from app.core.db_init import init_db


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan events."""
    # Startup
    init_db()
    yield
    # Shutdown (no cleanup needed currently)


def create_app() -> FastAPI:
    """Create and configure the FastAPI application instance."""

    app = FastAPI(
        title="JWT Authentication System",
        description="FastAPI with JWT token-based authentication",
        version="1.0.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    app.include_router(auth_router)
    app.include_router(chat_router)
    app.include_router(memory_router)
    app.include_router(syllabus_router)
    app.include_router(system_router)

    return app


app = create_app()
