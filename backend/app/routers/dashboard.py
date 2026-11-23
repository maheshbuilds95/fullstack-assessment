from fastapi import APIRouter, Depends
from sqlalchemy import func
from sqlalchemy.orm import Session

from ..database import get_db
from ..models import Claim

router = APIRouter(prefix="/api/dashboard", tags=["Dashboard"])

OPEN_STATUSES = ["SUBMITTED", "UNDER_REVIEW", "AWAITING_INFORMATION"]
ACTIVE_STATUSES = ["UNDER_REVIEW", "AWAITING_INFORMATION", "APPROVED"]


@router.get("")
def get_dashboard(db: Session = Depends(get_db)):
    status_counts = dict(
        db.query(Claim.status, func.count(Claim.id)).group_by(Claim.status).all()
    )

    open_estimate = db.query(func.coalesce(func.sum(Claim.estimated_amount), 0)) \
        .filter(Claim.status.in_(OPEN_STATUSES)).scalar()
    approved_unpaid = db.query(func.coalesce(func.sum(Claim.approved_amount), 0)) \
        .filter(Claim.status == "APPROVED").scalar()


    workload = db.query(Claim.assigned_officer, func.count(Claim.id)) \
        .filter(Claim.assigned_officer.isnot(None), Claim.status.in_(ACTIVE_STATUSES)) \
        .group_by(Claim.assigned_officer).all()

    return {
        "status_counts": status_counts,
        "unassigned": status_counts.get("SUBMITTED", 0),
        "outstanding_liability": float(open_estimate + approved_unpaid),
        "workload": [{"officer": name, "open_claims": count} for name, count in workload],
    }