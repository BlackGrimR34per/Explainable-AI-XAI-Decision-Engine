from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class LoanDetails(BaseModel):
    loan_amount: float = Field(..., gt=0, alias="loanAmount")
    currency: str
    requested_tenure: int = Field(..., gt=0, alias="requestedTenure")
    tenure_unit: str = Field(..., alias="tenureUnit")
    purpose: str
    loan_to_income_ratio: float = Field(..., ge=0, le=1, alias="loanToIncomeRatio")

    class Config:
        allow_population_by_field_name = True
 
class PersonalInformation(BaseModel):
    age: int = Field(..., ge=18)
    gender: str
    marital_status: str = Field(..., alias="maritalStatus")
    number_of_dependents: int = Field(..., ge=0, alias="numberOfDependents")
    education_level: str = Field(..., alias="educationLevel")

    class Config:
        allow_population_by_field_name = True
    
class ResidentialAddress(BaseModel):
    city: str
    state: str
    residency_type: str = Field(..., alias="residencyType")
    years_at_address: int = Field(..., ge=0, alias="yearsAtAddress")

    class Config:
        allow_population_by_field_name = True

class ContactInformation(BaseModel):
    residential_address: ResidentialAddress = Field(
        ..., alias="residentialAddress"
    )

    class Config:
        allow_population_by_field_name = True
    
class EmploymentInformation(BaseModel):
    employment_status: str = Field(..., alias="employmentStatus")
    industry: str
    employment_tenure_months: int = Field(
        ..., ge=0, alias="employmentTenureMonths"
    )
    employment_stability_score: float = Field(
        ..., ge=0, le=1, alias="employmentStabilityScore"
    )

    class Config:
        allow_population_by_field_name = True
    
class MonthlyCommitments(BaseModel):
    housing_loan: float = Field(..., ge=0, alias="housingLoan")
    car_loan: float = Field(..., ge=0, alias="carLoan")
    credit_card_payments: float = Field(..., ge=0, alias="creditCardPayments")
    other_commitments: float = Field(..., ge=0, alias="otherCommitments")
    total_commitments: float = Field(..., ge=0, alias="totalCommitments")

    class Config:
        allow_population_by_field_name = True

class FinancialInformation(BaseModel):
    monthly_gross_income: float = Field(
        ..., gt=0, alias="monthlyGrossIncome"
    )
    monthly_net_income: float = Field(
        ..., gt=0, alias="monthlyNetIncome"
    )
    other_monthly_income: float = Field(
        ..., ge=0, alias="otherMonthlyIncome"
    )
    total_monthly_income: float = Field(
        ..., gt=0, alias="totalMonthlyIncome"
    )

    monthly_commitments: MonthlyCommitments = Field(
        ..., alias="monthlyCommitments"
    )

    debt_service_ratio: float = Field(
        ..., ge=0, le=1, alias="debtServiceRatio"
    )
    savings_amount: float = Field(
        ..., ge=0, alias="savingsAmount"
    )
    existing_property_value: float = Field(
        ..., ge=0, alias="existingPropertyValue"
    )

    class Config:
        allow_population_by_field_name = True
	
class ExistingBankingRelationship(BaseModel):
    is_existing_customer: bool = Field(..., alias="isExistingCustomer")
    customer_tenure_months: int = Field(
        ..., ge=0, alias="customerTenureMonths"
    )
    has_credit_card: bool = Field(..., alias="hasCreditCard")
    credit_card_utilization: float = Field(
        ..., ge=0, le=1, alias="creditCardUtilization"
    )
    loan_repayment_history: str = Field(
        ..., alias="loanRepaymentHistory"
    )
    number_of_late_payments: int = Field(
        ..., ge=0, alias="numberOfLatePayments"
    )

    class Config:
        allow_population_by_field_name = True

class CreditInformation(BaseModel):
    ctos_score: int = Field(..., ge=300, le=900, alias="ctosScore")
    ccris_score: int = Field(..., ge=0, alias="ccrisScore")
    credit_score_category: str = Field(
        ..., alias="creditScoreCategory"
    )
    previous_bankruptcy: bool = Field(
        ..., alias="previousBankruptcy"
    )
    active_judgements: bool = Field(
        ..., alias="activeJudgements"
    )
    number_of_credit_enquiries: int = Field(
        ..., ge=0, alias="numberOfCreditEnquiries"
    )
    total_credit_accounts: int = Field(
        ..., ge=0, alias="totalCreditAccounts"
    )
    total_credit_utilization: float = Field(
        ..., ge=0, le=1, alias="totalCreditUtilization"
    )

    class Config:
        allow_population_by_field_name = True

class RiskIndicators(BaseModel):
    geographic_risk_score: float = Field(
        ..., ge=0, le=1, alias="geographicRiskScore"
    )
    industry_risk_score: float = Field(
        ..., ge=0, le=1, alias="industryRiskScore"
    )
    overall_risk_score: float = Field(
        ..., ge=0, le=1, alias="overallRiskScore"
    )

    class Config:
        allow_population_by_field_name = True

class CalculatedMetrics(BaseModel):
    monthly_loan_instalment: float = Field(
        ..., ge=0, alias="monthlyLoanInstalment"
    )
    instalment_to_income_ratio: float = Field(
        ..., ge=0, le=1, alias="instalmentToIncomeRatio"
    )
    total_commitments_after_loan: float = Field(
        ..., ge=0, alias="totalCommitmentsAfterLoan"
    )
    new_debt_service_ratio: float = Field(
        ..., ge=0, le=1, alias="newDebtServiceRatio"
    )
    cash_reserve_months: float = Field(
        ..., ge=0, alias="cashReserveMonths"
    )

    class Config:
        allow_population_by_field_name = True

class DecisionRequest(BaseModel):
    application_id: str = Field(..., alias="applicationId")
    application_date: datetime = Field(..., alias="applicationDate")
    application_type: str = Field(..., alias="applicationType")

    loan_details: LoanDetails = Field(..., alias="loanDetails")
    personal_information: PersonalInformation = Field(
        ..., alias="personalInformation"
    )
    contact_information: ContactInformation = Field(
        ..., alias="contactInformation"
    )
    employment_information: EmploymentInformation = Field(
        ..., alias="employmentInformation"
    )
    financial_information: FinancialInformation = Field(
        ..., alias="financialInformation"
    )
    existing_banking_relationship: ExistingBankingRelationship = Field(
        ..., alias="existingBankingRelationship"
    )
    credit_information: CreditInformation = Field(
        ..., alias="creditInformation"
    )
    risk_indicators: RiskIndicators = Field(
        ..., alias="riskIndicators"
    )
    calculated_metrics: Optional[CalculatedMetrics] = Field(
        None, alias="calculatedMetrics"
    )

    class Config:
        allow_population_by_field_name = True
