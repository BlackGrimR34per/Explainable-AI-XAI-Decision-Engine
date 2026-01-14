import json
import random
from datetime import datetime, timedelta
import numpy as np

class LoanDataGenerator:
    def __init__(self, seed=42):
        random.seed(seed)
        np.random.seed(seed)

        # Reference data
        self.names = [
            "Ahmad Bin Abdullah", "Siti Binti Hassan", "Tan Wei Ming",
            "Kumar A/L Rajesh", "Wong Mei Ling", "Fatimah Binti Ibrahim",
            "Lim Chee Keong", "Priya A/P Shankar", "Muhammad Bin Ismail"
        ]

        self.cities = ["Petaling Jaya", "Kuala Lumpur", "Shah Alam", "Subang Jaya", "Johor Bahru"]
        self.states = ["Selangor", "Kuala Lumpur", "Johor", "Penang"]

        self.industries = ["information_technology", "finance", "healthcare", "education",
                          "manufacturing", "retail", "construction", "government"]

        self.loan_purposes = ["home_renovation", "education", "medical", "debt_consolidation",
                             "wedding", "business", "car_purchase", "travel"]

        self.education_levels = ["spm", "diploma", "bachelor_degree", "master_degree", "phd"]

    def generate_risk_profile(self):
        """Generate a risk profile that determines approval likelihood"""
        profile = random.choice(["low_risk", "medium_risk", "high_risk", "very_high_risk"])

        if profile == "low_risk":
            return {
                "profile": profile,
                "income_range": (7000, 15000),
                "ctos_range": (720, 850),
                "dsr_range": (0.2, 0.4),
                "employment_months": (24, 120),
                "approval_prob": 0.92
            }
        elif profile == "medium_risk":
            return {
                "profile": profile,
                "income_range": (4000, 8000),
                "ctos_range": (650, 720),
                "dsr_range": (0.35, 0.55),
                "employment_months": (12, 36),
                "approval_prob": 0.65
            }
        elif profile == "high_risk":
            return {
                "profile": profile,
                "income_range": (2500, 5000),
                "ctos_range": (550, 650),
                "dsr_range": (0.50, 0.70),
                "employment_months": (6, 18),
                "approval_prob": 0.25
            }
        else:  # very_high_risk
            return {
                "profile": profile,
                "income_range": (1500, 3500),
                "ctos_range": (300, 550),
                "dsr_range": (0.65, 0.90),
                "employment_months": (1, 12),
                "approval_prob": 0.05
            }

    def calculate_approval(self, data, risk_profile):
        """Determine approval based on multiple factors"""
        score = 0
        reasons = []

        # Credit score check
        if data["creditInformation"]["ctosScore"] >= 720:
            score += 30
        elif data["creditInformation"]["ctosScore"] >= 650:
            score += 20
        elif data["creditInformation"]["ctosScore"] >= 550:
            score += 10
        else:
            reasons.append("Low credit score")

        # DSR check
        if data["calculatedMetrics"]["newDebtServiceRatio"] <= 0.4:
            score += 25
        elif data["calculatedMetrics"]["newDebtServiceRatio"] <= 0.6:
            score += 15
        else:
            reasons.append("High debt service ratio")

        # Income stability
        if data["employmentInformation"]["employmentTenureMonths"] >= 24:
            score += 15
        elif data["employmentInformation"]["employmentTenureMonths"] >= 12:
            score += 8
        else:
            reasons.append("Short employment tenure")

        # Banking relationship
        if data["existingBankingRelationship"]["isExistingCustomer"]:
            if data["existingBankingRelationship"]["loanRepaymentHistory"] == "excellent":
                score += 15
            elif data["existingBankingRelationship"]["loanRepaymentHistory"] == "good":
                score += 10

        # Asset coverage
        if data["financialInformation"]["savingsAmount"] >= data["loanDetails"]["loanAmount"] * 0.3:
            score += 10

        # Red flags
        if data["creditInformation"]["previousBankruptcy"]:
            score -= 50
            reasons.append("Previous bankruptcy")

        if data["creditInformation"]["activeJudgements"]:
            score -= 30
            reasons.append("Active legal judgements")

        if data["existingBankingRelationship"]["numberOfLatePayments"] > 3:
            score -= 20
            reasons.append("Multiple late payments")

        # Final decision
        base_prob = risk_profile["approval_prob"]
        final_prob = min(0.95, max(0.05, base_prob + (score - 50) / 100))

        approved = random.random() < final_prob

        return {
            "approved": approved,
            "confidence": final_prob,
            "score": score,
            "reasons": reasons if not approved else []
        }

    def generate_application(self, application_id):
        """Generate a single loan application"""
        risk_profile = self.generate_risk_profile()

        # Basic info
        age = random.randint(21, 65)
        marital_status = random.choice(["single", "married", "divorced"])
        dependents = random.randint(0, 4) if marital_status == "married" else random.randint(0, 2)

        # Employment
        employment_months = random.randint(*risk_profile["employment_months"])
        industry = random.choice(self.industries)

        # Financial
        gross_income = random.uniform(*risk_profile["income_range"])
        net_income = gross_income * random.uniform(0.75, 0.85)
        other_income = random.uniform(0, gross_income * 0.3) if random.random() > 0.6 else 0

        # Existing commitments
        housing_loan = random.uniform(800, 2500) if random.random() > 0.4 else 0
        car_loan = random.uniform(500, 1500) if random.random() > 0.5 else 0
        credit_card = random.uniform(200, 800) if random.random() > 0.3 else 0
        other_commitments = random.uniform(0, 500)

        total_commitments = housing_loan + car_loan + credit_card + other_commitments
        dsr = total_commitments / gross_income

        # Loan details
        loan_amount = random.uniform(5000, 100000)
        tenure = random.choice([12, 24, 36, 48, 60, 72, 84])

        # Calculate monthly instalment (simplified)
        interest_rate = random.uniform(3.5, 8.5) / 100
        monthly_rate = interest_rate / 12
        n_payments = tenure
        monthly_instalment = loan_amount * (monthly_rate * (1 + monthly_rate)**n_payments) / ((1 + monthly_rate)**n_payments - 1)

        new_dsr = (total_commitments + monthly_instalment) / gross_income

        # Credit info
        ctos_score = int(random.uniform(*risk_profile["ctos_range"]))
        ccris_score = 1 if ctos_score >= 650 else random.randint(2, 5)

        # Banking relationship
        is_existing = random.random() > 0.3
        customer_months = random.randint(6, 120) if is_existing else 0

        if is_existing:
            if ctos_score >= 700:
                repayment_history = "excellent"
                late_payments = 0
            elif ctos_score >= 600:
                repayment_history = "good"
                late_payments = random.randint(0, 2)
            else:
                repayment_history = "fair"
                late_payments = random.randint(1, 5)
        else:
            repayment_history = "no_history"
            late_payments = 0

        # Assets
        savings = random.uniform(1000, loan_amount * 0.8)
        property_value = random.uniform(200000, 800000) if housing_loan > 0 else 0

        # Risk scores
        geographic_risk = random.uniform(0.1, 0.3)
        industry_risk = random.uniform(0.15, 0.35)
        overall_risk = (new_dsr * 0.3 + (1 - ctos_score/850) * 0.3 +
                       geographic_risk * 0.2 + industry_risk * 0.2)

        data = {
            "applicationId": f"LA-2026-{application_id:06d}",
            "applicationDate": (datetime.now() - timedelta(days=random.randint(0, 30))).isoformat(),
            "applicationType": "personal_loan",

            "loanDetails": {
                "loanAmount": round(loan_amount, 2),
                "currency": "MYR",
                "requestedTenure": tenure,
                "tenureUnit": "months",
                "purpose": random.choice(self.loan_purposes),
                "loanToIncomeRatio": round(loan_amount / (gross_income * 12), 2)
            },

            "personalInformation": {
                "age": age,
                "gender": random.choice(["male", "female"]),
                "maritalStatus": marital_status,
                "numberOfDependents": dependents,
                "educationLevel": random.choice(self.education_levels)
            },

            "contactInformation": {
                "residentialAddress": {
                    "city": random.choice(self.cities),
                    "state": random.choice(self.states),
                    "residencyType": random.choice(["owned", "rented", "parents"]),
                    "yearsAtAddress": random.randint(1, 20)
                }
            },

            "employmentInformation": {
                "employmentStatus": "permanent_employee",
                "industry": industry,
                "employmentTenureMonths": employment_months,
                "employmentStabilityScore": round(min(1.0, employment_months / 60), 2)
            },

            "financialInformation": {
                "monthlyGrossIncome": round(gross_income, 2),
                "monthlyNetIncome": round(net_income, 2),
                "otherMonthlyIncome": round(other_income, 2),
                "totalMonthlyIncome": round(net_income + other_income, 2),
                "monthlyCommitments": {
                    "housingLoan": round(housing_loan, 2),
                    "carLoan": round(car_loan, 2),
                    "creditCardPayments": round(credit_card, 2),
                    "otherCommitments": round(other_commitments, 2),
                    "totalCommitments": round(total_commitments, 2)
                },
                "debtServiceRatio": round(dsr, 3),
                "savingsAmount": round(savings, 2),
                "existingPropertyValue": round(property_value, 2)
            },

            "existingBankingRelationship": {
                "isExistingCustomer": is_existing,
                "customerTenureMonths": customer_months,
                "hasCreditCard": random.random() > 0.4,
                "creditCardUtilization": round(random.uniform(0.05, 0.8), 2),
                "loanRepaymentHistory": repayment_history,
                "numberOfLatePayments": late_payments
            },

            "creditInformation": {
                "ctosScore": ctos_score,
                "ccrisScore": ccris_score,
                "creditScoreCategory": "excellent" if ctos_score >= 750 else "good" if ctos_score >= 650 else "fair" if ctos_score >= 550 else "poor",
                "previousBankruptcy": random.random() < 0.02,
                "activeJudgements": random.random() < 0.03,
                "numberOfCreditEnquiries": random.randint(0, 8),
                "totalCreditAccounts": random.randint(2, 10),
                "totalCreditUtilization": round(random.uniform(0.1, 0.7), 2)
            },

            "riskIndicators": {
                "geographicRiskScore": round(geographic_risk, 2),
                "industryRiskScore": round(industry_risk, 2),
                "overallRiskScore": round(overall_risk, 2)
            },

            "calculatedMetrics": {
                "monthlyLoanInstalment": round(monthly_instalment, 2),
                "instalmentToIncomeRatio": round(monthly_instalment / gross_income, 3),
                "totalCommitmentsAfterLoan": round(total_commitments + monthly_instalment, 2),
                "newDebtServiceRatio": round(new_dsr, 3),
                "cashReserveMonths": round(savings / (total_commitments + monthly_instalment), 1) if (total_commitments + monthly_instalment) > 0 else 999
            }
        }

        # Determine approval
        approval_result = self.calculate_approval(data, risk_profile)

        data["targetVariable"] = {
            "approvalDecision": "approved" if approval_result["approved"] else "rejected",
            "approvalConfidence": round(approval_result["confidence"], 3),
            "riskCategory": risk_profile["profile"].replace("_risk", ""),
            "rejectionReasons": approval_result["reasons"]
        }

        return data

    def generate_dataset(self, n_samples=1000):
        """Generate complete dataset"""
        dataset = []
        for i in range(1, n_samples + 1):
            dataset.append(self.generate_application(i))
        return dataset

    def save_dataset(self, dataset, filename="loan_applications.json"):
        """Save dataset to JSON file"""
        with open(filename, 'w') as f:
            json.dump(dataset, f, indent=2)
        print(f"Generated {len(dataset)} applications and saved to {filename}")

        # Print statistics
        approved = sum(1 for d in dataset if d["targetVariable"]["approvalDecision"] == "approved")
        print(f"\nDataset Statistics:")
        print(f"Total applications: {len(dataset)}")
        print(f"Approved: {approved} ({approved/len(dataset)*100:.1f}%)")
        print(f"Rejected: {len(dataset) - approved} ({(len(dataset)-approved)/len(dataset)*100:.1f}%)")

# Usage example
if __name__ == "__main__":
    generator = LoanDataGenerator(seed=123)

    # Generate dataset
    dataset = generator.generate_dataset(n_samples=5000)

    # Save to file
    generator.save_dataset(dataset, "synthetic_loan_data.json")

    # Print sample
    print("\n" + "="*60)
    print("Sample Application:")
    print("="*60)
    print(json.dumps(dataset[0], indent=2))