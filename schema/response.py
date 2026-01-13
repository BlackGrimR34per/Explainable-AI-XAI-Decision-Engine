from pydantic import BaseModel
from datetime import datetime
from typing import List
from .common import DecisionReason

class DecisionResponse(BaseModel):
    decisionId: str
    applicationId: str
    decision: str  # APPROVED | REJECTED | MANUAL_REVIEW
    riskCategory: str  # low | medium | high
    confidence: float  # 0-1
    reasons: List[DecisionReason]
    createdAt: datetime
