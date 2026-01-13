class BlackBoxModel:
    def predict_proba(self, features: dict) -> float:
        score = (
            features["monthly_net_income"] / 10000
            - features["new_debt_service_ratio"]
            + features["employment_stability_score"]
            - features["overall_risk_score"]
        )

        return max(min(score, 0.95), 0.05)
