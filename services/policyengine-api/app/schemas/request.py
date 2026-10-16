import math
from enum import Enum
from typing import Optional, Set
from pydantic import BaseModel, Field, field_validator, model_validator


class FilingStatusEnum(str, Enum):
    SINGLE = "single"
    MARRIED_JOINT = "married_joint"
    MARRIED_SEPARATE = "married_separate"
    HEAD_OF_HOUSEHOLD = "head_of_household"
    QUALIFYING_WIDOW = "qualifying_widow"


class DeductionModeEnum(str, Enum):
    AUTO = "auto"
    STANDARD = "standard"
    ITEMIZED = "itemized"


class PayFrequencyEnum(str, Enum):
    ANNUALLY = "annually"
    MONTHLY = "monthly"
    SEMI_MONTHLY = "semi_monthly"
    BI_WEEKLY = "bi_weekly"
    WEEKLY = "weekly"


VALID_US_STATES: Set[str] = {
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY", "DC"
}


class TaxCalculationRequest(BaseModel):
    """Statutory tax calculation request payload matching ToolCastle Form 1040 schema."""

    # Jurisdiction and Filing Profile
    tax_year: int = Field(default=2026, description="Tax year (2025 or 2026)")
    filing_status: FilingStatusEnum = Field(default=FilingStatusEnum.SINGLE, description="IRS filing status")
    state_code: Optional[str] = Field(default=None, description="Two-letter US state code, DC, or None for Federal only")

    # Incomes (Annual Amounts in USD)
    primary_w2_income: float = Field(default=0.0, ge=0.0, le=100_000_000.0, description="Taxpayer Box 1 W-2 wages")
    spouse_w2_income: float = Field(default=0.0, ge=0.0, le=100_000_000.0, description="Spouse Box 1 W-2 wages")
    self_employment_income: float = Field(default=0.0, ge=0.0, le=100_000_000.0, description="Schedule C net profit")
    taxable_interest: float = Field(default=0.0, ge=0.0, le=100_000_000.0, description="Taxable interest income (1099-INT)")
    ordinary_dividends: float = Field(default=0.0, ge=0.0, le=100_000_000.0, description="Ordinary dividend income (1099-DIV)")
    qualified_dividends: float = Field(default=0.0, ge=0.0, le=100_000_000.0, description="Qualified preferential dividends")
    long_term_capital_gains: float = Field(default=0.0, ge=0.0, le=100_000_000.0, description="Schedule D long-term capital gains")
    other_income: float = Field(default=0.0, ge=0.0, le=100_000_000.0, description="Other miscellaneous taxable income")

    # Household & Dependents Profile
    num_children_under_17: int = Field(default=0, ge=0, le=15, description="Qualifying children for Child Tax Credit")
    num_other_dependents: int = Field(default=0, ge=0, le=15, description="Other qualifying dependents")
    taxpayer_age_65_or_over: bool = Field(default=False, description="Taxpayer is age 65 or older")
    spouse_age_65_or_over: bool = Field(default=False, description="Spouse is age 65 or older")
    taxpayer_blind: bool = Field(default=False, description="Taxpayer is legally blind")
    spouse_blind: bool = Field(default=False, description="Spouse is legally blind")

    # Adjustments & Pre-Tax Deductions
    pre_tax_retirement_401k: float = Field(default=0.0, ge=0.0, le=100_000.0, description="Pre-tax 401(k)/403(b) contributions")
    traditional_ira_deduction: float = Field(default=0.0, ge=0.0, le=50_000.0, description="Deductible Traditional IRA contributions")
    hsa_deduction: float = Field(default=0.0, ge=0.0, le=30_000.0, description="Health Savings Account contributions")
    student_loan_interest: float = Field(default=0.0, ge=0.0, le=10_000.0, description="Deductible student loan interest")

    # Deductions (Standard vs. Itemized)
    deduction_mode: DeductionModeEnum = Field(default=DeductionModeEnum.AUTO, description="Deduction selection mode")
    itemized_mortgage_interest: float = Field(default=0.0, ge=0.0, le=5_000_000.0, description="Schedule A mortgage interest")
    itemized_charitable_donations: float = Field(default=0.0, ge=0.0, le=50_000_000.0, description="Schedule A charitable donations")
    itemized_real_estate_taxes: float = Field(default=0.0, ge=0.0, le=5_000_000.0, description="Schedule A real estate taxes")
    itemized_state_local_tax: float = Field(default=0.0, ge=0.0, le=5_000_000.0, description="Schedule A state/local income tax")
    itemized_medical_expenses: float = Field(default=0.0, ge=0.0, le=5_000_000.0, description="Schedule A medical & dental expenses")

    # Withholdings (for Refund/Owed calculation)
    federal_tax_withheld: float = Field(default=0.0, ge=0.0, le=100_000_000.0, description="Total federal tax withheld")
    state_tax_withheld: float = Field(default=0.0, ge=0.0, le=100_000_000.0, description="Total state tax withheld")

    @field_validator("tax_year")
    @classmethod
    def validate_tax_year(cls, v: int) -> int:
        if v not in (2025, 2026):
            raise ValueError(f"Tax year {v} is not supported. Supported years are 2025 and 2026.")
        return v

    @field_validator("state_code")
    @classmethod
    def validate_state_code(cls, v: Optional[str]) -> Optional[str]:
        if v is None or v == "" or v.strip().lower() in ("none", "fed", "federal", "null"):
            return None
        upper_code = v.strip().upper()
        if upper_code not in VALID_US_STATES:
            raise ValueError(f"Invalid state code '{v}'. Must be a valid 2-letter US state code or DC.")
        return upper_code

    @field_validator(
        "primary_w2_income", "spouse_w2_income", "self_employment_income",
        "taxable_interest", "ordinary_dividends", "qualified_dividends",
        "long_term_capital_gains", "other_income", "pre_tax_retirement_401k",
        "traditional_ira_deduction", "hsa_deduction", "student_loan_interest",
        "itemized_mortgage_interest", "itemized_charitable_donations",
        "itemized_real_estate_taxes", "itemized_state_local_tax",
        "itemized_medical_expenses", "federal_tax_withheld", "state_tax_withheld"
    )
    @classmethod
    def validate_finite_numbers(cls, v: float) -> float:
        if not math.isfinite(v):
            raise ValueError("Numeric fields must be finite numbers (cannot be NaN or Infinity).")
        return v

    @model_validator(mode="after")
    def validate_household_coherence(self) -> "TaxCalculationRequest":
        # Disallow spouse income when filing status is not married
        if self.filing_status != FilingStatusEnum.MARRIED_JOINT and self.spouse_w2_income > 0:
            raise ValueError("spouse_w2_income can only be included when filing status is 'married_joint'.")
        # Ensure qualified dividends do not exceed ordinary dividends if both are specified
        if self.qualified_dividends > self.ordinary_dividends and self.ordinary_dividends > 0:
            raise ValueError("qualified_dividends cannot exceed ordinary_dividends.")
        return self

