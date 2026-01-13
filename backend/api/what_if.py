from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict
from services.what_if_engine import WhatIfEngine
from schemas.loan_application_raw import LoanApplicationRaw

router = APIRouter()
engine = WhatIfEngine()

class WhatIfRequest(BaseModel):
    application: LoanApplicationRaw
    modifications: Dict

@router.post("/what-if")
def simulate_what_if(req: WhatIfRequest):
    return engine.simulate(req.application, req.modifications)
