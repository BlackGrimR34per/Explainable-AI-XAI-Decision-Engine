from fastapi import APIRouter
from services.explainability import ExplainabilityEngine
from services.rag_engine import RAGEngine
from services.audit_logger import AuditLogger
from schemas.loan_application_raw import LoanApplicationRaw

router = APIRouter()

@router.post("/explanation")
def get_explanation(application: LoanApplicationRaw, decision_id: str):
    features = application.dict()
    explanation = ExplainabilityEngine.explain(features, decision_id)
    policy_refs = RAGEngine.retrieve(explanation["reason_codes"])
    explanation["policy_references"] = policy_refs

    AuditLogger.log_decision(
        input_data=features,
        decision_output={"decision_id": decision_id},
        explanation=explanation,
        policy_refs=policy_refs
    )

    return explanation
