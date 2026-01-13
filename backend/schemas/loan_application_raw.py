from pydantic import BaseModel
from typing import Optional, Dict, Any


class LoanDetails(BaseModel):
    loanAmount: float
    requestedTenure: int
    loanToIncomeRatio: float


class EmploymentInformation(BaseModel):
    employmentTenureMonths: int
    employmentStabilityScore: float


class FinancialInformation(BaseModel):
    monthlyNetIncome: float
    totalMonthlyIncome: float
    debtServiceRatio: float
    savingsAmount: float


class CreditInformation(BaseModel):
    ctosScore: int
    totalCreditUtilization: float
    numberOfCreditEnquiries: int


class RiskIndicators(BaseModel):
    overallRiskScore: float


class CalculatedMetrics(BaseModel):
    newDebtServiceRatio: float
    cashReserveMonths: float


class LoanApplicationRaw(BaseModel):
    applicationId: str
    loanDetails: LoanDetails
    employmentInformation: EmploymentInformation
    financialInformation: FinancialInformation
    creditInformation: CreditInformation
    riskIndicators: RiskIndicators
    calculatedMetrics: CalculatedMetrics

    # Anything extra (including targetVariable) is ignored but preserved for audit
    extra_payload: Optional[Dict[str, Any]] = None

    class Config:
        extra = "ignore"
