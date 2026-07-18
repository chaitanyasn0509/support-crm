from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os

from app import models
from app.database import engine
from app.api import router as api_router
from app.views import router as views_router

# Create the database tables if they don't exist yet
models.Base.metadata.create_all(bind=engine)

# Initialize the FastAPI application
app = FastAPI(
    title="Customer Support CRM",
    description="A beginner-friendly CRM built with FastAPI and Tailwind CSS",
    version="1.0.0"
)

# Enable CORS for all origins (useful during development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the static directory to serve CSS and JS files
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
static_dir = os.path.join(base_dir, "app", "static")
os.makedirs(static_dir, exist_ok=True)
os.makedirs(os.path.join(static_dir, "css"), exist_ok=True)
os.makedirs(os.path.join(static_dir, "js"), exist_ok=True)
os.makedirs(os.path.join(base_dir, "app", "templates"), exist_ok=True)

app.mount("/static", StaticFiles(directory=static_dir), name="static")

# Include the routers
app.include_router(api_router)
app.include_router(views_router)
