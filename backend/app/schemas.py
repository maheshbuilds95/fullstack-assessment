from datetime import date, datetime
from typing import Literal, Optional
from pydantic import BaseModel, ConfigDict, Field


class ClaimCreate(BaseModel):
    claimant_name: str = Field(min_length=2, max_length=120)
    claimant_email: str = Field(min_length=5, max_length=160)
    claim_type: Literal["MOTOR", "PROPERTY"]
    description: str = Field(min_length=5)
    incident_date: date
    estimated_amount: float = Field(gt=0)


class AssignRequest(BaseModel):
    officer_name: str = Field(min_length=2)


class InfoRequest(BaseModel):
    message: str = Field(min_length=3)


class InfoResponse(BaseModel):
    response: str = Field(min_length=3)


class ApproveRequest(BaseModel):
    approved_amount: float = Field(gt=0)
    reason: str = Field(min_length=3)


class RejectRequest(BaseModel):
    reason: str = Field(min_length=3)


class ClaimOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)  

    id: int
    claimant_name: str
    claimant_email: str
    claim_type: str
    description: str
    incident_date: date
    estimated_amount: float
    status: str
    assigned_officer: Optional[str] = None
    information_request: Optional[str] = None
    information_response: Optional[str] = None
    decision_reason: Optional[str] = None
    approved_amount: Optional[float] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None


    