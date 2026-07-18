from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app import crud, schemas
from app.database import get_db

# Create a router for the API endpoints
router = APIRouter(prefix="/api/tickets", tags=["tickets"])

@router.post("/", response_model=schemas.TicketResponse)
def create_ticket(ticket: schemas.TicketCreate, db: Session = Depends(get_db)):
    """
    Create a new support ticket.
    """
    return crud.create_ticket(db=db, ticket=ticket)

@router.get("/", response_model=List[schemas.TicketResponse])
def read_tickets(skip: int = 0, limit: int = 100, search: str = None, status: str = None, db: Session = Depends(get_db)):
    """
    Retrieve all tickets. Can be filtered by search term and status.
    """
    tickets = crud.get_tickets(db, skip=skip, limit=limit, search=search, status=status)
    return tickets

@router.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    """
    Get summary statistics of tickets for the dashboard.
    """
    return crud.get_ticket_stats(db)

@router.get("/{ticket_id}", response_model=schemas.TicketResponse)
def read_ticket(ticket_id: str, db: Session = Depends(get_db)):
    """
    Retrieve a specific ticket by its ID (e.g., TKT-001).
    """
    db_ticket = crud.get_ticket_by_ticket_id(db, ticket_id=ticket_id)
    if db_ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return db_ticket

@router.put("/{ticket_id}", response_model=schemas.TicketResponse)
def update_ticket(ticket_id: str, ticket_update: schemas.TicketUpdate, db: Session = Depends(get_db)):
    """
    Update a ticket's status and/or notes.
    """
    db_ticket = crud.update_ticket(db, ticket_id=ticket_id, ticket_update=ticket_update)
    if db_ticket is None:
        raise HTTPException(status_code=404, detail="Ticket not found")
    return db_ticket
