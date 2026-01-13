"""
Goal, Project, and DailyLever schemas
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from ..models.goals import GoalStatus


# Goal Schemas
class GoalBase(BaseModel):
    title: str
    description: Optional[str] = None
    vision_alignment: Optional[str] = None


class GoalCreate(GoalBase):
    pass


class GoalUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    vision_alignment: Optional[str] = None
    status: Optional[GoalStatus] = None


class GoalResponse(GoalBase):
    id: int
    user_id: int
    status: GoalStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# Project Schemas
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None
    goal_id: Optional[int] = None
    deadline: Optional[datetime] = None


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    goal_id: Optional[int] = None
    deadline: Optional[datetime] = None
    status: Optional[GoalStatus] = None


class ProjectResponse(ProjectBase):
    id: int
    user_id: int
    status: GoalStatus
    created_at: datetime
    updated_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None

    class Config:
        from_attributes = True


# DailyLever Schemas
class DailyLeverBase(BaseModel):
    title: str
    description: Optional[str] = None
    project_id: Optional[int] = None
    due_date: Optional[datetime] = None


class DailyLeverCreate(DailyLeverBase):
    pass


class DailyLeverUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    project_id: Optional[int] = None
    is_completed: Optional[bool] = None
    due_date: Optional[datetime] = None


class DailyLeverResponse(DailyLeverBase):
    id: int
    user_id: int
    is_completed: bool
    completed_at: Optional[datetime] = None
    created_at: datetime
    updated_at: Optional[datetime] = None

    class Config:
        from_attributes = True
