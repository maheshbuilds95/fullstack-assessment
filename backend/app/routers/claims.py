from datetime import date

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Claim
from ..schemas import (ClaimCreate, ClaimOut, AssignRequest, InfoRequest,
                       InfoResponse, ApproveRequest, RejectRequest)

router = APIRouter(prefix="/api/claims", tags=["Claims"])


def get_claim_or_404(claim_id: int, db: Session) -> Claim:
    claim = db.get(Claim, claim_id)
    if claim is None:
        raise HTTPException(status_code=404, detail="Claim not found")
    return claim


def require_status(claim: Claim, expected: str):
    if claim.status != expected:
        raise HTTPException(status_code=400,
                            detail=f"Claim must be {expected}, but it is {claim.status}")


def save(claim: Claim, db: Session) -> Claim:
    db.commit()
    db.refresh(claim) 
    return claim


# The person who submits claims
@router.post("", response_model=ClaimOut, status_code=201)
def create_claim(payload: ClaimCreate, db: Session = Depends(get_db)):
    if payload.incident_date > date.today():
        raise HTTPException(status_code=400, detail="Incident date cannot be in the future")
    claim = Claim(**payload.model_dump(), status="SUBMITTED")
    db.add(claim)
    return save(claim, db)


@router.get("", response_model=list[ClaimOut])
def list_claims(claimant_email: str | None = None, status: str | None = None,
                db: Session = Depends(get_db)):
    query = db.query(Claim)
    if claimant_email:
        query = query.filter(Claim.claimant_email == claimant_email)
    if status:
        query = query.filter(Claim.status == status)
    return query.order_by(Claim.id.desc()).all()


@router.get("/{claim_id}", response_model=ClaimOut)
def get_claim(claim_id: int, db: Session = Depends(get_db)):
    return get_claim_or_404(claim_id, db)


@router.post("/{claim_id}/respond", response_model=ClaimOut)
def respond_to_request(claim_id: int, payload: InfoResponse, db: Session = Depends(get_db)):
    claim = get_claim_or_404(claim_id, db)
    require_status(claim, "AWAITING_INFORMATION")
    claim.information_response = payload.response
    claim.status = "UNDER_REVIEW"
    return save(claim, db)


# Claim Officer actions
@router.post("/{claim_id}/assign", response_model=ClaimOut)
def assign_claim(claim_id: int, payload: AssignRequest, db: Session = Depends(get_db)):
    claim = get_claim_or_404(claim_id, db)
    require_status(claim, "SUBMITTED")
    claim.assigned_officer = payload.officer_name
    claim.status = "UNDER_REVIEW"
    return save(claim, db)


@router.post("/{claim_id}/request-info", response_model=ClaimOut)
def request_info(claim_id: int, payload: InfoRequest, db: Session = Depends(get_db)):
    claim = get_claim_or_404(claim_id, db)
    require_status(claim, "UNDER_REVIEW")
    claim.information_request = payload.message
    claim.information_response = None
    claim.status = "AWAITING_INFORMATION"
    return save(claim, db)


@router.post("/{claim_id}/approve", response_model=ClaimOut)
def approve_claim(claim_id: int, payload: ApproveRequest, db: Session = Depends(get_db)):
    claim = get_claim_or_404(claim_id, db)
    require_status(claim, "UNDER_REVIEW")
    if payload.approved_amount > float(claim.estimated_amount):
        raise HTTPException(status_code=400, detail="Approved amount cannot exceed the estimated amount")
    claim.approved_amount = payload.approved_amount
    claim.decision_reason = payload.reason
    claim.status = "APPROVED"
    return save(claim, db)


@router.post("/{claim_id}/reject", response_model=ClaimOut)
def reject_claim(claim_id: int, payload: RejectRequest, db: Session = Depends(get_db)):
    claim = get_claim_or_404(claim_id, db)
    require_status(claim, "UNDER_REVIEW")
    claim.decision_reason = payload.reason
    claim.status = "REJECTED"
    return save(claim, db)


@router.post("/{claim_id}/settle", response_model=ClaimOut)
def settle_claim(claim_id: int, db: Session = Depends(get_db)):
    claim = get_claim_or_404(claim_id, db)
    require_status(claim, "APPROVED")
    claim.status = "SETTLED"
    return save(claim, db)