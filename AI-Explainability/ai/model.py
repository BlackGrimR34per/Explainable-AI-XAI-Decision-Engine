import pandas as pd
from xgboost import XGBClassifier
import json
from ai.features import FEATURE_COLUMNS

FEATURE_COLUMNS = [
    "totalMonthlyIncome",
    "totalCommitments",
    "debtServiceRatio",
    "newDebtServiceRatio",
    "savingsAmount",
    "cashReserveMonths",
    "ctosScore",
    "creditScoreCategory",
    "totalCreditUtilization",
    "numberOfLatePayments",
    "employmentTenureMonths",
    "employmentStabilityScore",
    "loanAmount",
    "instalmentToIncomeRatio",
]

MODEL_PATH = "ai/xgboost_model.json"

def load_model():
    model = XGBClassifier()
    model.load_model(MODEL_PATH)  # XGBoost's native JSON loader
    return model

# ai/model.py
def predict(model, X: pd.DataFrame):
    prob = model.predict_proba(X)[0][1]
    decision = "APPROVED" if prob >= 0.5 else "REJECTED"

    return decision, float(prob)  # ✅ Already converting to float - good!