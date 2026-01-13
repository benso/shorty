"""
Reminder and Reflection models
"""
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..core.database import Base


class Reminder(Base):
    """Random reminders with self-inquiry questions"""
    __tablename__ = "reminders"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    question = Column(Text, nullable=False)
    triggered_at = Column(DateTime(timezone=True))
    answered = Column(Boolean, default=False)
    answer = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    # Relationships
    user = relationship("User", back_populates="reminders")


class Reflection(Base):
    """Evening reflections and insights"""
    __tablename__ = "reflections"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    # Identity Loop tracking
    current_phase = Column(String, nullable=True)  # Dissonance, Uncertainty, Discovery
    identity_notes = Column(Text, nullable=True)

    # What worked today
    wins = Column(Text, nullable=True)

    # What didn't work
    challenges = Column(Text, nullable=True)

    # Lessons learned
    lessons = Column(Text, nullable=True)

    # Tomorrow's focus
    tomorrow_focus = Column(Text, nullable=True)

    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    user = relationship("User", back_populates="reflections")
