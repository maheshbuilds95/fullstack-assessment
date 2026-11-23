from sqlalchemy import Column, Integer, String, Float, Date, DateTime, Text, func
from .database import Base

class Claim(Base):
    __tablename__ = "claims"

    id = Column(Integer, primary_key=True, index=True)
    claimant_name = Column(String(120), nullable=False)
    claimant_email = Column(String(160), nullable=False)
    claim_type = Column(String(20), nullable=False) 
    description = Column(Text, nullable=False)
    incident_date = Column(Date, nullable=False)
    estimated_amount = Column(Float, nullable=False)
    status = Column(String(30), nullable=False, default="SUBMITTED")
    assigned_officer = Column(String(120), nullable=True)
    information_request = Column(Text, nullable=True)
    information_response = Column(Text, nullable=True)
    decision_reason = Column(Text, nullable=True)
    approved_amount = Column(Float, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
