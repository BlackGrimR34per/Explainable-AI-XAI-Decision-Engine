from fastapi import APIRouter
from schemas.loan_application_raw import LoanApplicationRaw
from schemas.decision import DecisionResponse
from services.feature_extractor import FeatureExtractor
from services.decision_engine import DecisionEngine
from services.audit_logger import AuditLogger
from services.explainability import ExplainabilityEngine
from services.rag_engine import RAGEngine

router = APIRouter()
engine = DecisionEngine()

@router.post("/decision", response_model=DecisionResponse)
def make_decision(application: LoanApplicationRaw):
    features = FeatureExtractor.extract(application)
    
    decision_result = engine.decide(features.dict())
    explanation = ExplainabilityEngine.explain(features.dict(), decision_result["decision_id"])
    policy_refs = RAGEngine.retrieve(explanation["reason_codes"])

    AuditLogger.log_decision(
        input_data=application.dict(),
        decision_output=decision_result,
        explanation=explanation,
        policy_refs=policy_refs
    )

    return decision_result
