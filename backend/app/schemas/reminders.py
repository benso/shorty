"""
Reminder and Reflection schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# Reminder Schemas
class ReminderBase(BaseModel):
    question: str


class ReminderCreate(ReminderBase):
    triggered_at: Optional[datetime] = None


class ReminderUpdate(BaseModel):
    answered: Optional[bool] = None
    answer: Optional[str] = None


class ReminderResponse(ReminderBase):
    id: int
    user_id: int
    triggered_at: Optional[datetime] = None
    answered: bool
    answer: Optional[str] = None
    created_at: datetime

    class Config:
        from_attributes = True


# Reflection Schemas
class ReflectionBase(BaseModel):
    current_phase: Optional[str] = None
    identity_notes: Optional[str] = None
    wins: Optional[str] = None
    challenges: Optional[str] = None
    lessons: Optional[str] = None
    tomorrow_focus: Optional[str] = None


class ReflectionCreate(ReflectionBase):
    pass


class ReflectionUpdate(ReflectionBase):
    pass


class ReflectionResponse(ReflectionBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
