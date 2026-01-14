import pandas as pd

FEATURE_COLUMNS = [
    'totalMonthlyIncome',
    'totalCommitments',
    'debtServiceRatio',
    'newDebtServiceRatio',
    'savingsAmount',
    'cashReserveMonths',
    'ctosScore',
    'creditScoreCategory',
    'totalCreditUtilization',
    'numberOfLatePayments',
    'employmentTenureMonths',
    'employmentStabilityScore',
    'loanAmount',
    'instalmentToIncomeRatio'
]

def build_feature_vector(application: dict) -> pd.DataFrame:
    """
    Converts nested application JSON into a flat feature vector
    with ALL 14 features the model expects
    """
    features = {
        # Financial Information
        "totalMonthlyIncome": application["financialInformation"]["monthlyIncome"],
        "totalCommitments": application["financialInformation"]["totalCommitments"],
        "savingsAmount": application["financialInformation"]["savingsAmount"],

        # Credit Information
        "ctosScore": application["creditInformation"]["ctosScore"],
        "creditScoreCategory": application["creditInformation"]["creditScoreCategory"],
        "totalCreditUtilization": application["creditInformation"]["creditUtilization"],
        "numberOfLatePayments": application["creditInformation"]["latePayments"],

        # Employment Information
        "employmentTenureMonths": application["employmentInformation"]["tenureMonths"],
        "employmentStabilityScore": application["employmentInformation"]["stabilityScore"],

        # Loan Details
        "loanAmount": application["loanDetails"]["loanAmount"],

        # Calculated Metrics
        "debtServiceRatio": application["calculatedMetrics"]["debtServiceRatio"],
        "newDebtServiceRatio": application["calculatedMetrics"]["newDebtServiceRatio"],
        "cashReserveMonths": application["calculatedMetrics"]["cashReserveMonths"],
        "instalmentToIncomeRatio": application["calculatedMetrics"]["instalmentToIncomeRatio"]
    }

    # Return DataFrame with columns in the exact order the model expects
    return pd.DataFrame([features])[FEATURE_COLUMNS]