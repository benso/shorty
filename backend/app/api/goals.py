"""
Goals, Projects, and Daily Levers routes for gamification
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, desc
from typing import List
from datetime import datetime
from ..core.database import get_db
from ..models import User, Goal, Project, DailyLever, GoalStatus
from ..schemas import (
    GoalCreate, GoalUpdate, GoalResponse,
    ProjectCreate, ProjectUpdate, ProjectResponse,
    DailyLeverCreate, DailyLeverUpdate, DailyLeverResponse
)
from .auth import get_current_user_dependency

router = APIRouter(prefix="/goals", tags=["Goals & Gamification"])


# ============ GOALS (1-Year Mission) ============
@router.post("/", response_model=GoalResponse, status_code=status.HTTP_201_CREATED)
async def create_goal(
    goal_data: GoalCreate,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Create a new 1-year goal (The Mission)"""
    new_goal = Goal(
        user_id=current_user.id,
        title=goal_data.title,
        description=goal_data.description,
        vision_alignment=goal_data.vision_alignment
    )

    db.add(new_goal)
    await db.commit()
    await db.refresh(new_goal)

    return new_goal


@router.get("/", response_model=List[GoalResponse])
async def get_goals(
    status_filter: GoalStatus = None,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Get all goals for the current user"""
    query = select(Goal).where(Goal.user_id == current_user.id)

    if status_filter:
        query = query.where(Goal.status == status_filter)

    query = query.order_by(desc(Goal.created_at))

    result = await db.execute(query)
    goals = result.scalars().all()
    return goals


@router.get("/{goal_id}", response_model=GoalResponse)
async def get_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific goal"""
    result = await db.execute(
        select(Goal).where(Goal.id == goal_id, Goal.user_id == current_user.id)
    )
    goal = result.scalar_one_or_none()

    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")

    return goal


@router.put("/{goal_id}", response_model=GoalResponse)
async def update_goal(
    goal_id: int,
    goal_data: GoalUpdate,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Update a goal"""
    result = await db.execute(
        select(Goal).where(Goal.id == goal_id, Goal.user_id == current_user.id)
    )
    goal = result.scalar_one_or_none()

    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")

    update_data = goal_data.model_dump(exclude_unset=True)

    # Handle status change to completed
    if "status" in update_data and update_data["status"] == GoalStatus.COMPLETED:
        update_data["completed_at"] = datetime.utcnow()

    for field, value in update_data.items():
        setattr(goal, field, value)

    await db.commit()
    await db.refresh(goal)

    return goal


@router.delete("/{goal_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_goal(
    goal_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Delete a goal"""
    result = await db.execute(
        select(Goal).where(Goal.id == goal_id, Goal.user_id == current_user.id)
    )
    goal = result.scalar_one_or_none()

    if not goal:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Goal not found")

    await db.delete(goal)
    await db.commit()
    return None


# ============ PROJECTS (1-Month Boss Fight) ============
@router.post("/projects/", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
async def create_project(
    project_data: ProjectCreate,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Create a new 1-month project (The Boss Fight)"""
    new_project = Project(
        user_id=current_user.id,
        goal_id=project_data.goal_id,
        title=project_data.title,
        description=project_data.description,
        deadline=project_data.deadline
    )

    db.add(new_project)
    await db.commit()
    await db.refresh(new_project)

    return new_project


@router.get("/projects/", response_model=List[ProjectResponse])
async def get_projects(
    goal_id: int = None,
    status_filter: GoalStatus = None,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Get all projects for the current user"""
    query = select(Project).where(Project.user_id == current_user.id)

    if goal_id:
        query = query.where(Project.goal_id == goal_id)

    if status_filter:
        query = query.where(Project.status == status_filter)

    query = query.order_by(desc(Project.created_at))

    result = await db.execute(query)
    projects = result.scalars().all()
    return projects


@router.get("/projects/{project_id}", response_model=ProjectResponse)
async def get_project(
    project_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific project"""
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    return project


@router.put("/projects/{project_id}", response_model=ProjectResponse)
async def update_project(
    project_id: int,
    project_data: ProjectUpdate,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Update a project"""
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    update_data = project_data.model_dump(exclude_unset=True)

    if "status" in update_data and update_data["status"] == GoalStatus.COMPLETED:
        update_data["completed_at"] = datetime.utcnow()

    for field, value in update_data.items():
        setattr(project, field, value)

    await db.commit()
    await db.refresh(project)

    return project


@router.delete("/projects/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_project(
    project_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Delete a project"""
    result = await db.execute(
        select(Project).where(Project.id == project_id, Project.user_id == current_user.id)
    )
    project = result.scalar_one_or_none()

    if not project:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Project not found")

    await db.delete(project)
    await db.commit()
    return None


# ============ DAILY LEVERS (The Quests) ============
@router.post("/daily-levers/", response_model=DailyLeverResponse, status_code=status.HTTP_201_CREATED)
async def create_daily_lever(
    lever_data: DailyLeverCreate,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Create a new daily lever (The Quest)"""
    new_lever = DailyLever(
        user_id=current_user.id,
        project_id=lever_data.project_id,
        title=lever_data.title,
        description=lever_data.description,
        due_date=lever_data.due_date
    )

    db.add(new_lever)
    await db.commit()
    await db.refresh(new_lever)

    return new_lever


@router.get("/daily-levers/", response_model=List[DailyLeverResponse])
async def get_daily_levers(
    project_id: int = None,
    completed: bool = None,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Get all daily levers for the current user"""
    query = select(DailyLever).where(DailyLever.user_id == current_user.id)

    if project_id:
        query = query.where(DailyLever.project_id == project_id)

    if completed is not None:
        query = query.where(DailyLever.is_completed == completed)

    query = query.order_by(DailyLever.due_date.asc().nullslast(), desc(DailyLever.created_at))

    result = await db.execute(query)
    levers = result.scalars().all()
    return levers


@router.get("/daily-levers/{lever_id}", response_model=DailyLeverResponse)
async def get_daily_lever(
    lever_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Get a specific daily lever"""
    result = await db.execute(
        select(DailyLever).where(DailyLever.id == lever_id, DailyLever.user_id == current_user.id)
    )
    lever = result.scalar_one_or_none()

    if not lever:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Daily lever not found")

    return lever


@router.put("/daily-levers/{lever_id}", response_model=DailyLeverResponse)
async def update_daily_lever(
    lever_id: int,
    lever_data: DailyLeverUpdate,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Update a daily lever"""
    result = await db.execute(
        select(DailyLever).where(DailyLever.id == lever_id, DailyLever.user_id == current_user.id)
    )
    lever = result.scalar_one_or_none()

    if not lever:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Daily lever not found")

    update_data = lever_data.model_dump(exclude_unset=True)

    if "is_completed" in update_data and update_data["is_completed"] and not lever.is_completed:
        update_data["completed_at"] = datetime.utcnow()

    for field, value in update_data.items():
        setattr(lever, field, value)

    await db.commit()
    await db.refresh(lever)

    return lever


@router.post("/daily-levers/{lever_id}/complete", response_model=DailyLeverResponse)
async def complete_daily_lever(
    lever_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Mark a daily lever as completed"""
    result = await db.execute(
        select(DailyLever).where(DailyLever.id == lever_id, DailyLever.user_id == current_user.id)
    )
    lever = result.scalar_one_or_none()

    if not lever:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Daily lever not found")

    lever.is_completed = True
    lever.completed_at = datetime.utcnow()

    await db.commit()
    await db.refresh(lever)

    return lever


@router.delete("/daily-levers/{lever_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_daily_lever(
    lever_id: int,
    current_user: User = Depends(get_current_user_dependency),
    db: AsyncSession = Depends(get_db)
):
    """Delete a daily lever"""
    result = await db.execute(
        select(DailyLever).where(DailyLever.id == lever_id, DailyLever.user_id == current_user.id)
    )
    lever = result.scalar_one_or_none()

    if not lever:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Daily lever not found")

    await db.delete(lever)
    await db.commit()
    return None
