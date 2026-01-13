"""
Journal Entry model for Vision and Anti-Vision tracking
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Enum
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base
import enum


class JournalType(str, enum.Enum):
    MORNING = "morning"
    EVENING = "evening"


class JournalEntry(Base):
    __tablename__ = "journal_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    type = Column(Enum(JournalType), nullable=False)

    # Vision (life you want)
    vision = Column(Text, nullable=True)

    # Anti-Vision (life you hate/fear)
    anti_vision = Column(Text, nullable=True)

    # Enemy identification
    enemy = Column(String, nullable=True)

    # Additional notes
    notes = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="journal_entries")
