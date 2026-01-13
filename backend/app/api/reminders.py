"""
Reminders and Reflections routes
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
from datetime import datetime
from ..core.database import get_db
from ..models import User, Reminder, Reflection
from ..schemas import (
    ReminderCreate, ReminderUpdate, ReminderResponse,
    ReflectionCreate, ReflectionUpdate, ReflectionResponse
)
from ..services.ai_service import ai_service
from .auth import get_current_user_dependency

router = APIRouter(prefix="/reminders", tags=["Reminders & Reflections"])


# ============ REMINDERS ============
@router.post("/", response_model=ReminderResponse, status_code=status.HTTP_201_CREATED)
async def create_reminder(
    reminder_data: ReminderCreate,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Create a new reminder"""
    new_reminder = Reminder(
        user_id=current_user.id,
        question=reminder_data.question,
        triggered_at=reminder_data.triggered_at or datetime.utcnow()
    )

    db.add(new_reminder)
    await db.commit()
    await db.refresh(new_reminder)

    return new_reminder


@router.get("/", response_model=List[ReminderResponse])
async def get_reminders(
    answered: bool = None,
    limit: int = 50,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Get all reminders for the current user"""
    query = select(Reminder).where(Reminder.user_id == current_user.id)

    if answered is not None:
        query = query.where(Reminder.answered == answered)

    query = query.order_by(desc(Reminder.triggered_at)).limit(limit)

    result = await db.execute(query)
    reminders = result.scalars().all()
    return reminders


@router.get("/generate", response_model=List[str])
async def generate_questions(
    count: int = 5,
    current_user: User = Depends(get_current_user_dependency)
):
    """Generate AI-powered self-inquiry questions"""
    questions = await ai_service.generate_self_inquiry_questions(count)
    return questions


@router.get("/{reminder_id}", response_model=ReminderResponse)
async def get_reminder(
    reminder_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific reminder"""
    result = await db.execute(
        select(Reminder).where(Reminder.id == reminder_id, Reminder.user_id == current_user.id)
    )
    reminder = result.scalar_one_or_none()

    if not reminder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")

    return reminder


@router.put("/{reminder_id}", response_model=ReminderResponse)
async def update_reminder(
    reminder_id: int,
    reminder_data: ReminderUpdate,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Update a reminder (typically to answer it)"""
    result = await db.execute(
        select(Reminder).where(Reminder.id == reminder_id, Reminder.user_id == current_user.id)
    )
    reminder = result.scalar_one_or_none()

    if not reminder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")

    update_data = reminder_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(reminder, field, value)

    await db.commit()
    await db.refresh(reminder)

    return reminder


@router.delete("/{reminder_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reminder(
    reminder_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Delete a reminder"""
    result = await db.execute(
        select(Reminder).where(Reminder.id == reminder_id, Reminder.user_id == current_user.id)
    )
    reminder = result.scalar_one_or_none()

    if not reminder:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reminder not found")

    await db.delete(reminder)
    await db.commit()
    return None


# ============ REFLECTIONS ============
@router.post("/reflections/", response_model=ReflectionResponse, status_code=status.HTTP_201_CREATED)
async def create_reflection(
    reflection_data: ReflectionCreate,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Create a new evening reflection"""
    new_reflection = Reflection(
        user_id=current_user.id,
        current_phase=reflection_data.current_phase,
        identity_notes=reflection_data.identity_notes,
        wins=reflection_data.wins,
        challenges=reflection_data.challenges,
        lessons=reflection_data.lessons,
        tomorrow_focus=reflection_data.tomorrow_focus
    )

    db.add(new_reflection)
    await db.commit()
    await db.refresh(new_reflection)

    return new_reflection


@router.get("/reflections/", response_model=List[ReflectionResponse])
async def get_reflections(
    limit: int = 30,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Get all reflections for the current user"""
    result = await db.execute(
        select(Reflection)
        .where(Reflection.user_id == current_user.id)
        .order_by(desc(Reflection.created_at))
        .limit(limit)
    )
    reflections = result.scalars().all()
    return reflections


@router.get("/reflections/latest", response_model=ReflectionResponse)
async def get_latest_reflection(
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Get the latest reflection"""
    result = await db.execute(
        select(Reflection)
        .where(Reflection.user_id == current_user.id)
        .order_by(desc(Reflection.created_at))
        .limit(1)
    )
    reflection = result.scalar_one_or_none()

    if not reflection:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No reflections found"
        )

    return reflection


@router.get("/reflections/{reflection_id}", response_model=ReflectionResponse)
async def get_reflection(
    reflection_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific reflection"""
    result = await db.execute(
        select(Reflection).where(Reflection.id == reflection_id, Reflection.user_id == current_user.id)
    )
    reflection = result.scalar_one_or_none()

    if not reflection:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reflection not found")

    return reflection


@router.put("/reflections/{reflection_id}", response_model=ReflectionResponse)
async def update_reflection(
    reflection_id: int,
    reflection_data: ReflectionUpdate,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Update a reflection"""
    result = await db.execute(
        select(Reflection).where(Reflection.id == reflection_id, Reflection.user_id == current_user.id)
    )
    reflection = result.scalar_one_or_none()

    if not reflection:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reflection not found")

    update_data = reflection_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(reflection, field, value)

    await db.commit()
    await db.refresh(reflection)

    return reflection


@router.delete("/reflections/{reflection_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_reflection(
    reflection_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Delete a reflection"""
    result = await db.execute(
        select(Reflection).where(Reflection.id == reflection_id, Reflection.user_id == current_user.id)
    )
    reflection = result.scalar_one_or_none()

    if not reflection:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Reflection not found")

    await db.delete(reflection)
    await db.commit()
    return None


# ============ AI INSIGHTS ============
@router.post("/insights/alignment")
async def get_alignment_insights(
    vision: str,
    anti_vision: str,
    current_actions: str,
    current_user: User = Depends(get_current_user_dependency)
):
    """Get AI insights on vision alignment"""
    insights = await ai_service.analyze_vision_alignment(vision, anti_vision, current_actions)
    return {"insights": insights}


@router.post("/insights/levers")
async def get_lever_suggestions(
    goal: str,
    project: str = None,
    current_user: User = Depends(get_current_user_dependency)
):
    """Get AI suggestions for daily levers"""
    suggestions = await ai_service.suggest_daily_levers(goal, project)
    return {"suggestions": suggestions}


@router.post("/insights/reflection")
async def get_reflection_insights(
    wins: str,
    challenges: str,
    phase: str = "Uncertainty",
    current_user: User = Depends(get_current_user_dependency)
):
    """Get AI insights from daily reflection"""
    insights = await ai_service.generate_reflection_insights(wins, challenges, phase)
    return {"insights": insights}
