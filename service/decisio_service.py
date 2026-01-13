from uuid import uuid4
from datetime import datetime
from schemas.request import DecisionRequest
from schemas.response import DecisionResponse, DecisionReason
from domain.decision_engine import DecisionEngine

def evaluate_application(request: DecisionRequest) -> DecisionResponse:
    """
    Orchestrates the decision process:
    1. Calls the decision engine
    2. Wraps results in a DecisionResponse
    """
    engine = DecisionEngine()
    result = engine.evaluate(request)

    # Convert internal reasons to response reasons
    reasons = [
        DecisionReason(
            code=reason["code"],
            description=reason["description"],
            impact=reason["impact"]
        )
        for reason in result.reasons
    ]

    # Build the final response
    response = DecisionResponse(
        decisionId=str(uuid4()),
        applicationId=request.application_id,
        decision=result.decision,
        riskCategory=result.risk_category,
        confidence=result.confidence,
        reasons=reasons,
        createdAt=datetime.utcnow()
    )

    return response
