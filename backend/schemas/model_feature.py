from pydantic import BaseModel


class ModelFeatures(BaseModel):
    monthly_net_income: float
    debt_service_ratio: float
    new_debt_service_ratio: float
    credit_score: int
    credit_utilization: float
    employment_stability_score: float
    cash_reserve_months: float
    overall_risk_score: float
