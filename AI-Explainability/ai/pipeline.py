# ai/pipeline.py
import pandas as pd
from ai.model import load_model, predict
from ai.explain import explain
from ai.rag import generate_narrative
from ai.features import build_feature_vector

model = load_model()

def run_pipeline(application: dict):
    application_id = application["applicationId"]

    X = build_feature_vector(application)

    decision, confidence = predict(model, X)
    reasons = explain(model, X)
    narrative = generate_narrative(decision, confidence, reasons)

    # ✅ Convert numpy types to native Python types
    return {
        "applicationId": application_id,
        "decision": str(decision),  # Ensure it's a string
        "confidence": float(confidence),  # Convert numpy.float32 to float
        "reasons": [
            {
                "feature": str(r["feature"]),
                "impact": float(r["impact"]),  # Convert numpy types
                "explanation": str(r["explanation"])
            }
            for r in reasons
        ],
        "explanation": str(narrative)
    }