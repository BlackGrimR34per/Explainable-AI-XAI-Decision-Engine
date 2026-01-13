from fastapi import APIRouter

from schemas.request import DecisionRequest
from schemas.response import DecisionResponse
from services.decision_service import evaluate_application

router = APIRouter()

@router.post(
    "/v1/decision",
    response_model=DecisionResponse,
    summary="Evaluate a loan application and return a decision"
)
def create_decision(payload: DecisionRequest) -> DecisionResponse:
    return evaluate_application(payload)
