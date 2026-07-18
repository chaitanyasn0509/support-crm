from sqlalchemy.orm import Session
from sqlalchemy import desc, or_
from app import models, schemas
import re

def get_next_ticket_id(db: Session) -> str:
    """
    Generates the next ticket ID in the format TKT-001.
    Finds the latest ticket and increments its number.
    """
    last_ticket = db.query(models.Ticket).order_by(desc(models.Ticket.id)).first()
    if not last_ticket:
        return "TKT-001"
    
    # Extract the number from the last ticket_id, e.g., "001" from "TKT-001"
    match = re.search(r'\d+', last_ticket.ticket_id)
    if match:
        last_number = int(match.group())
        next_number = last_number + 1
        return f"TKT-{next_number:03d}"
    return "TKT-001"

def create_ticket(db: Session, ticket: schemas.TicketCreate):
    """
    Creates a new ticket in the database.
    """
    new_ticket_id = get_next_ticket_id(db)
    
    # Convert Pydantic schema to SQLAlchemy model
    db_ticket = models.Ticket(
        ticket_id=new_ticket_id,
        customer_name=ticket.customer_name,
        customer_email=ticket.customer_email,
        subject=ticket.subject,
        description=ticket.description,
        status="Open"
    )
    
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def get_tickets(db: Session, skip: int = 0, limit: int = 100, search: str = None, status: str = None):
    """
    Retrieves a list of tickets, with optional search and status filtering.
    """
    query = db.query(models.Ticket)
    
    if search:
        search_filter = f"%{search}%"
        query = query.filter(
            or_(
                models.Ticket.ticket_id.ilike(search_filter),
                models.Ticket.customer_name.ilike(search_filter),
                models.Ticket.customer_email.ilike(search_filter),
                models.Ticket.description.ilike(search_filter)
            )
        )
        
    if status:
        query = query.filter(models.Ticket.status == status)
        
    return query.order_by(desc(models.Ticket.created_at)).offset(skip).limit(limit).all()

def get_ticket_by_ticket_id(db: Session, ticket_id: str):
    """
    Retrieves a single ticket by its formatted ticket_id (e.g., TKT-001).
    """
    return db.query(models.Ticket).filter(models.Ticket.ticket_id == ticket_id).first()

def update_ticket(db: Session, ticket_id: str, ticket_update: schemas.TicketUpdate):
    """
    Updates the status or notes of an existing ticket.
    """
    db_ticket = get_ticket_by_ticket_id(db, ticket_id)
    if not db_ticket:
        return None
        
    if ticket_update.status is not None:
        db_ticket.status = ticket_update.status
    if ticket_update.notes is not None:
        db_ticket.notes = ticket_update.notes
        
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

def get_ticket_stats(db: Session):
    """
    Returns the count of tickets grouped by status.
    """
    total = db.query(models.Ticket).count()
    open_count = db.query(models.Ticket).filter(models.Ticket.status == "Open").count()
    in_progress = db.query(models.Ticket).filter(models.Ticket.status == "In Progress").count()
    closed = db.query(models.Ticket).filter(models.Ticket.status == "Closed").count()
    
    return {
        "total": total,
        "open": open_count,
        "in_progress": in_progress,
        "closed": closed
    }
