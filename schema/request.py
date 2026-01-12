from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime

class LoanDetails(BaseModel):
	loan_amount: float = Field(..., gt=0)
	currency: str
	requested_tenure: int
	tenure_unit: str
	purpose: str
	loan_to_income_ratio: str
 
class PersonalInformation(BaseModel):
    age: int = Field(..., ge=18)
    gender: str
    marital_status: str
    number_of_dependence: str
    education_level: str
    
