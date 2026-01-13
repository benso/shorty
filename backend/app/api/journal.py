"""
Journal routes for Vision and Anti-Vision tracking
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
from ..core.database import get_db
from ..models import User, JournalEntry
from ..schemas import JournalEntryCreate, JournalEntryUpdate, JournalEntryResponse
from .auth import get_current_user_dependency

router = APIRouter(prefix="/journal", tags=["Journal"])


@router.post("/", response_model=JournalEntryResponse, status_code=status.HTTP_201_CREATED)
async def create_journal_entry(
    entry_data: JournalEntryCreate,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Create a new journal entry"""
    new_entry = JournalEntry(
        user_id=current_user.id,
        type=entry_data.type,
        vision=entry_data.vision,
        anti_vision=entry_data.anti_vision,
        enemy=entry_data.enemy,
        notes=entry_data.notes
    )

    db.add(new_entry)
    await db.commit()
    await db.refresh(new_entry)

    return new_entry


@router.get("/", response_model=List[JournalEntryResponse])
async def get_journal_entries(
    skip: int = 0,
    limit: int = 50,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Get all journal entries for the current user"""
    result = await db.execute(
        select(JournalEntry)
        .where(JournalEntry.user_id == current_user.id)
        .order_by(desc(JournalEntry.created_at))
        .offset(skip)
        .limit(limit)
    )
    entries = result.scalars().all()
    return entries


@router.get("/latest", response_model=JournalEntryResponse)
async def get_latest_entry(
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Get the latest journal entry"""
    result = await db.execute(
        select(JournalEntry)
        .where(JournalEntry.user_id == current_user.id)
        .order_by(desc(JournalEntry.created_at))
        .limit(1)
    )
    entry = result.scalar_one_or_none()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No journal entries found"
        )

    return entry


@router.get("/{entry_id}", response_model=JournalEntryResponse)
async def get_journal_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific journal entry"""
    result = await db.execute(
        select(JournalEntry)
        .where(JournalEntry.id == entry_id, JournalEntry.user_id == current_user.id)
    )
    entry = result.scalar_one_or_none()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )

    return entry


@router.put("/{entry_id}", response_model=JournalEntryResponse)
async def update_journal_entry(
    entry_id: int,
    entry_data: JournalEntryUpdate,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Update a journal entry"""
    result = await db.execute(
        select(JournalEntry)
        .where(JournalEntry.id == entry_id, JournalEntry.user_id == current_user.id)
    )
    entry = result.scalar_one_or_none()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )

    # Update fields
    update_data = entry_data.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(entry, field, value)

    await db.commit()
    await db.refresh(entry)

    return entry


@router.delete("/{entry_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_journal_entry(
    entry_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Delete a journal entry"""
    result = await db.execute(
        select(JournalEntry)
        .where(JournalEntry.id == entry_id, JournalEntry.user_id == current_user.id)
    )
    entry = result.scalar_one_or_none()

    if not entry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Journal entry not found"
        )

    await db.delete(entry)
    await db.commit()

    return None
