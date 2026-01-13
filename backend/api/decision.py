from fastapi import APIRouter
from schemas.loan_application_raw import LoanApplicationRaw
from schemas.decision import DecisionResponse
from services.feature_extractor import FeatureExtractor
from services.decision_engine import DecisionEngine

router = APIRouter()
engine = DecisionEngine()

@router.post("/decision", response_model=DecisionResponse)
def make_decision(application: LoanApplicationRaw):
    features = FeatureExtractor.extract(application)
    return engine.decide(features.dict())
