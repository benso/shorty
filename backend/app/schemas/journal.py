"""
Journal schemas for request/response validation
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.journal import JournalType


class JournalEntryBase(BaseModel):
    type: JournalType
    vision: Optional[str] = None
    anti_vision: Optional[str] = None
    enemy: Optional[str] = None
    notes: Optional[str] = None


class JournalEntryCreate(JournalEntryBase):
    pass


class JournalEntryUpdate(BaseModel):
    vision: Optional[str] = None
    anti_vision: Optional[str] = None
    enemy: Optional[str] = None
    notes: Optional[str] = None


class JournalEntryResponse(JournalEntryBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
