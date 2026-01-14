from typing import Dict, List

# Simple mock SHAP-style contribution mapping
REASON_CODE_MAPPING = {
    "new_debt_service_ratio": "HIGH_DTI_RATIO",
    "cash_reserve_months": "LOW_CASH_BUFFER",
    "debt_service_ratio": "HIGH_TOTAL_DSR",
    "credit_utilization": "HIGH_CREDIT_USAGE"
}

class ExplainabilityEngine:
    @staticmethod
    def explain(features: Dict, decision_id: str) -> Dict:
        contributions = {}
        reason_codes: List[str] = []

        for feature, value in features.items():
            if isinstance(value, (int, float)):
                contribution = value * 0.01
                contributions[feature] = round(contribution, 3)

                if feature in REASON_CODE_MAPPING and contribution > 0:
                    reason_codes.append(REASON_CODE_MAPPING[feature])
            else:
                continue

        summary = "; ".join([REASON_CODE_MAPPING.get(f, f) for f in reason_codes]) \
                  or "No significant factors"

        return {
            "decision_id": decision_id,
            "feature_contributions": contributions,
            "reason_codes": reason_codes,
            "summary": summary
        }
