from schemas.loan_application_raw import LoanApplicationRaw
from schemas.model_feature import ModelFeatures


class FeatureExtractor:
    @staticmethod
    def extract(raw: LoanApplicationRaw) -> ModelFeatures:
        return ModelFeatures(
            monthly_net_income=raw.financialInformation.monthlyNetIncome,
            debt_service_ratio=raw.financialInformation.debtServiceRatio,
            new_debt_service_ratio=raw.calculatedMetrics.newDebtServiceRatio,
            credit_score=raw.creditInformation.ctosScore,
            credit_utilization=raw.creditInformation.totalCreditUtilization,
            employment_stability_score=raw.employmentInformation.employmentStabilityScore,
            cash_reserve_months=raw.calculatedMetrics.cashReserveMonths,
            overall_risk_score=raw.riskIndicators.overallRiskScore,
        )
