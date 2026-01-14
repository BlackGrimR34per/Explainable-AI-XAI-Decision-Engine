import pandas as pd
import json

customer_data = {}
important_columns = [
	"applicationId",
	"financialInformation.totalMonthlyIncome",
	"financialInformation.monthlyCommitments.totalCommitments",
	"financialInformation.debtServiceRatio",
	"calculatedMetrics.newDebtServiceRatio",
	"financialInformation.savingsAmount",
	"calculatedMetrics.cashReserveMonths",
	"creditInformation.ctosScore",
	"creditInformation.creditScoreCategory",
	"creditInformation.totalCreditUtilization",
	"existingBankingRelationship.numberOfLatePayments",
	"employmentInformation.employmentTenureMonths",
	"employmentInformation.employmentStabilityScore",
	"loanDetails.loanAmount",
	"calculatedMetrics.instalmentToIncomeRatio",
	"targetVariable.approvalDecision"
]

new_columns = [
	"applicationId",
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
	"approvalDecision"
]

try:
	with open("synthetic_loan_data.json", 'r') as file:
		data = json.load(file)
	df = pd.json_normalize(data)
	df["targetVariable.approvalDecision"].replace(['approved', 'rejected'], [1, 0], inplace=True)
	df["creditInformation.creditScoreCategory"] = df["creditInformation.creditScoreCategory"].replace(
    {'excellent': 3, 'good': 2, 'fair': 1, 'poor':0})
	df["targetVariable.approvalDecision"] = df["targetVariable.approvalDecision"].replace(
    {'approved': 1, 'rejected': 0})
	new_df = df[important_columns]
	new_df.columns = new_columns
	new_df.to_csv('output_file.csv', index=False)
except	FileNotFoundError:
	print("Error: The file 'data.json' was not found.")
except json.JSONDecodeError:
	print("Error: Failed to decode JSON from the file (invalid format).")