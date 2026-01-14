import uuid
from models.black_box_model import BlackBoxModel
from config import MODEL_VERSION


class DecisionEngine:
    def __init__(self):
        self.model = BlackBoxModel()

    def decide(self, features: dict) -> dict:
        probability = self.model.predict_proba(features)

        if probability >= 0.7:
            decision = "APPROVE"
            reasons = []
        elif probability >= 0.4:
            decision = "REVIEW"
            reasons = ["BORDERLINE_RISK"]
        else:
            decision = "REJECT"
            reasons = ["HIGH_RISK_PROFILE"]

        return {
            "decision_id": str(uuid.uuid4()),
            "decision": decision,
            "probability": round(probability, 3),
            "reason_codes": reasons,
            "model_version": MODEL_VERSION,
        }
