from fastapi import APIRouter, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
import os

router = APIRouter(tags=["views"])

# Setup Jinja2 templates directory
# The path is relative to the root directory where run.py is executed
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
templates_dir = os.path.join(base_dir, "app", "templates")
templates = Jinja2Templates(directory=templates_dir)

@router.get("/", response_class=HTMLResponse)
async def dashboard(request: Request):
    """
    Render the main dashboard page.
    """
    return templates.TemplateResponse("index.html", {"request": request})

@router.get("/ticket/{ticket_id}", response_class=HTMLResponse)
async def ticket_detail(request: Request, ticket_id: str):
    """
    Render the ticket detail page.
    """
    return templates.TemplateResponse("detail.html", {"request": request, "ticket_id": ticket_id})
