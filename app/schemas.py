from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

# Base schema with common attributes
class TicketBase(BaseModel):
    customer_name: str
    customer_email: EmailStr
    subject: str
    description: str

# Schema for creating a new ticket
class TicketCreate(TicketBase):
    pass

# Schema for updating a ticket (only status and notes can be updated usually)
class TicketUpdate(BaseModel):
    status: Optional[str] = None
    notes: Optional[str] = None

# Schema for reading a ticket (includes all fields from database)
class TicketResponse(TicketBase):
    id: int
    ticket_id: str
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True  # Allows Pydantic to read data from SQLAlchemy models

# Schema for a summarized response used in the list view
class TicketListResponse(BaseModel):
    ticket_id: str
    customer_name: str
    subject: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True
