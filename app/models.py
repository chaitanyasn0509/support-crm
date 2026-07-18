from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.sql import func
from app.database import Base

class Ticket(Base):
    __tablename__ = "tickets"

    # The internal unique ID for the database
    id = Column(Integer, primary_key=True, index=True)
    
    # The user-friendly ticket ID, e.g., TKT-001
    ticket_id = Column(String, unique=True, index=True, nullable=False)
    
    customer_name = Column(String, index=True, nullable=False)
    customer_email = Column(String, index=True, nullable=False)
    subject = Column(String, index=True, nullable=False)
    description = Column(Text, nullable=False)
    
    # Status can be "Open", "In Progress", or "Closed"
    status = Column(String, default="Open", index=True)
    
    # Internal notes added by support staff
    notes = Column(Text, nullable=True)
    
    # Timestamps to track when the ticket was created and last updated
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
