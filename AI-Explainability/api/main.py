from fastapi import FastAPI
from pydantic import BaseModel
from typing import Dict
from ai.pipeline import run_pipeline

app = FastAPI()

class FinancialInfo(BaseModel):
    monthlyIncome: float
    totalCommitments: float
    savingsAmount: float

class CreditInfo(BaseModel):
    ctosScore: int
    creditScoreCategory: int
    creditUtilization: float
    latePayments: int

class EmploymentInfo(BaseModel):
    tenureMonths: int
    stabilityScore: float

class LoanDetails(BaseModel):
    loanAmount: float

class CalculatedMetrics(BaseModel):
    debtServiceRatio: float
    newDebtServiceRatio: float
    cashReserveMonths: float
    instalmentToIncomeRatio: float

class Application(BaseModel):
    applicationId: str
    financialInformation: FinancialInfo
    creditInformation: CreditInfo
    employmentInformation: EmploymentInfo
    loanDetails: LoanDetails
    calculatedMetrics: CalculatedMetrics

@app.post("/predict")
def predict(application: Application):
    # Convert Pydantic model to dict
    return run_pipeline(application.dict())