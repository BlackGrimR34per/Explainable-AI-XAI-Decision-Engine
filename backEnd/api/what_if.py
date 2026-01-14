from fastapi import APIRouter
from pydantic import BaseModel
from typing import Dict
from services.what_if_engine import WhatIfEngine
from schemas.loan_application_raw import LoanApplicationRaw
from services.audit_logger import AuditLogger

router = APIRouter()
engine = WhatIfEngine()

class WhatIfRequest(BaseModel):
    application: LoanApplicationRaw
    modifications: Dict

@router.post("/what-if")
def simulate_what_if(req: WhatIfRequest):
    result = engine.simulate(req.application, req.modifications)
    AuditLogger.log_decision(
        input_data=req.application.dict(),
        decision_output={"decision_id": result["decision_id"], "new_decision": result["new_decision"]},
        explanation=None,
        policy_refs=None
    )

    return result
