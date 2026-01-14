from pydantic import BaseModel
from typing import List

class DecisionResponse(BaseModel):
    decision_id: str
    decision: str  # APPROVE | REJECT | REVIEW
    probability: float
    reason_codes: List[str]
    model_version: str
