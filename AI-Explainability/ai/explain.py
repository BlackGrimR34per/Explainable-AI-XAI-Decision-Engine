# ai/explain.py
import shap
import numpy as np

REASON_MAP = {
    "ctosScore": "Strong credit history",
    "newDebtServiceRatio": "High debt burden after loan",
    "employmentTenureMonths": "Stable employment history",
    "cashReserveMonths": "Healthy cash reserves",
    "instalmentToIncomeRatio": "Loan instalment is manageable"
}

def explain(model, X):
    explainer = shap.TreeExplainer(model)
    shap_values = explainer.shap_values(X)

    impacts = shap_values[0]
    features = X.columns

    top_idx = np.argsort(abs(impacts))[::-1][:3]

    reasons = []
    for i in top_idx:
        reasons.append({
            "feature": str(features[i]),  # ✅ Convert to string
            "impact": float(impacts[i]),   # ✅ Convert to float
            "explanation": REASON_MAP.get(features[i], str(features[i]))
        })

    return reasons