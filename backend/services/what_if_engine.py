from services.feature_extractor import FeatureExtractor
from services.decision_engine import DecisionEngine

class WhatIfEngine:
    def __init__(self):
        self.decision_engine = DecisionEngine()

    def simulate(self, raw_application, modifications: dict) -> dict:
        # create a copy of the raw application
        modified_application = raw_application.copy()
        for field, value in modifications.items():
            # apply allowed modifications only
            if hasattr(modified_application, field):
                setattr(modified_application, field, value)

        # extract features
        features = FeatureExtractor.extract(modified_application)

        # run decision engine
        result = self.decision_engine.decide(features.dict())

        # compute delta for mock purposes
        # Here we just show a deterministic delta example
        delta = round(result["probability"] * 100 - 50, 1)
        suggestion_text = f"Modification increases approval likelihood by {delta}%"

        return {
            "decision_id": result["decision_id"],
            "new_decision": result["decision"],
            "confidence_change": f"{delta:+}%",
            "suggestion": suggestion_text
        }
