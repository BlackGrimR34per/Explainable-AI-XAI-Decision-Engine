from fastapi import APIRouter
from schemas.decision import DecisionResponse
from services.explainability import ExplainabilityEngine
from services.rag_engine import RAGEngine
from services.audit_logger import AuditLogger
from schemas.loan_application_raw import LoanApplicationRaw

router = APIRouter()

@router.post("/explanation")
def get_explanation(decision_id: str, application: LoanApplicationRaw):
    # Extract features
    features = application.dict()  # raw dict for now
    # Explain
    explanation = ExplainabilityEngine.explain(features, decision_id)
    # Attach policy references
    policy_refs = RAGEngine.retrieve(explanation["reason_codes"])
    explanation["policy_references"] = policy_refs

    # Log to audit
    AuditLogger.log_decision(input_data=features, decision_output={"decision_id": decision_id}, explanation=explanation, policy_refs=policy_refs)

    return explanation
