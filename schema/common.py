from pydantic import BaseModel
from typing import Optional

class DecisionReason(BaseModel):
    code: str
    description: str
    impact: str  # 'positive' or 'negative'
    value: Optional[float] = None  # optional numeric value for clarity
