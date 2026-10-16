from typing import List, Optional, Literal
from pydantic import BaseModel, Field


class PaycheckBreakdown(BaseModel):
    """Periodic take-home pay breakdowns."""
    annual: float = Field(..., description="Annual take-home pay")
    monthly: float = Field(..., description="Monthly take-home pay (12 periods)")
    semi_monthly: float = Field(..., description="Semi-monthly take-home pay (24 periods)")
    bi_weekly: float = Field(..., description="Bi-weekly take-home pay (26 periods)")
    weekly: float = Field(..., description="Weekly take-home pay (52 periods)")


class TaxBracketBreakdown(BaseModel):
    """Calculation detail for an individual progressive tax bracket."""
    bracket_rate: float = Field(..., description="Marginal rate in decimal (e.g. 0.22)")
    bracket_label: str = Field(..., description="Bracket label (e.g. '22%')")
    taxable_in_bracket: float = Field(..., description="Taxable income subject to this bracket")
    tax_in_bracket: float = Field(..., description="Tax liability generated in this bracket")


class CalculationMetadata(BaseModel):
    """Engine metadata and timing information."""
    engine: str = "PolicyEngine US"
    engine_version: str = "2.44.0"
    tax_year: int
    state_code: Optional[str] = None
    filing_status: str
    cutoff_date: str = "2026-10-01"
    employer_taxes_included: bool = False
    residency_status: str = "full_year_resident"
    unsupported_features: List[str] = [
        "Form 1040-NR (non-resident alien returns)",
        "Part-year resident state returns",
        "Form 2555 (Foreign Earned Income Exclusion)",
        "Form 1116 (Foreign Tax Credit)",
        "Local/City income taxes (NYC, Yonkers, Philadelphia, Ohio RITA) unless incorporated into state rules",
    ]
    disclaimer: str = "Calculations are statutory estimates modeled via PolicyEngine US and do not constitute formal tax or legal advice."
    calculation_duration_ms: float


class TaxCalculationResponse(BaseModel):
    """Structured calculation result matching ToolCastle's AdvancedTaxResult contract."""

    # 1. Gross Income Breakdown
    total_gross_income: float = Field(..., description="Total gross income across all modeled sources")
    earned_income: float = Field(..., description="W-2 and self-employment earned income")
    investment_income: float = Field(..., description="Interest, dividend, and capital gains income")

    # 2. Adjustments & Deductions
    self_employment_tax: float = Field(..., description="Schedule SE payroll tax on self-employment profit")
    deductible_self_employment_tax: float = Field(..., description="Above-the-line 50% deduction for SE tax")
    total_adjustments_to_income: float = Field(..., description="Total adjustments reducing gross income to AGI")
    adjusted_gross_income: float = Field(..., description="Adjusted Gross Income (AGI)")

    # 3. Deduction Comparison
    standard_deduction_amount: float = Field(..., description="Statutory standard deduction for filing status and age")
    itemized_deductions_total: float = Field(..., description="Total allowable itemized deductions")
    deduction_used: Literal["standard", "itemized"] = Field(..., description="Deduction type actually utilized")
    deduction_amount: float = Field(..., description="Final deduction subtracted from AGI")
    itemized_advantage: float = Field(..., description="Difference between itemized and standard deduction")

    # 4. Taxable Income
    taxable_income: float = Field(..., description="Final taxable income (AGI minus deduction)")

    # 5. Federal Tax Liability & Credits
    gross_federal_tax: float = Field(..., description="Federal income tax before nonrefundable and refundable credits")
    child_tax_credit: float = Field(..., description="Child Tax Credit (CTC) and Additional Child Tax Credit")
    other_dependent_credit: float = Field(..., description="Credit for Other Dependents (ODC)")
    earned_income_credit: float = Field(..., description="Earned Income Tax Credit (EITC)")
    total_tax_credits: float = Field(..., description="Total tax credits offsetting tax liability")
    alternative_minimum_tax: float = Field(default=0.0, description="Alternative Minimum Tax (Form 6251) liability")
    net_investment_income_tax: float = Field(default=0.0, description="3.8% Net Investment Income Tax (Form 8960) under IRC § 1411")
    capital_gains_tax: float = Field(default=0.0, description="Federal tax on net capital gains and qualified dividends at preferential rates")
    net_federal_income_tax: float = Field(..., description="Net federal income tax liability after credits")

    # 6. FICA & Payroll Taxes
    employee_social_security_tax: float = Field(..., description="Employee FICA Old-Age and Disability tax (6.2%)")
    employee_medicare_tax: float = Field(..., description="Employee FICA Hospital Insurance tax (1.45%)")
    additional_medicare_tax: float = Field(..., description="0.9% Additional Medicare Tax on high earners")
    total_payroll_tax: float = Field(..., description="Combined FICA employee payroll taxes")

    # 7. State Tax Liability
    state_code: Optional[str] = Field(default=None, description="State jurisdiction code")
    state_tax_name: str = Field(..., description="Name of state income tax jurisdiction")
    state_income_tax: float = Field(..., description="Total state income tax liability")

    # 8. Combined Totals
    total_all_taxes: float = Field(..., description="Combined Federal Income, State Income, FICA, and SE taxes")
    household_net_income: float = Field(..., description="Annual after-tax disposable household income")

    # 9. Rates
    effective_federal_rate: float = Field(..., description="Net federal tax as a percentage of gross income")
    effective_total_tax_rate: float = Field(..., description="Total taxes as a percentage of gross income")
    marginal_tax_rate: float = Field(..., description="Combined marginal tax rate for next dollar of income")
    federal_marginal_rate: float = Field(..., description="Federal marginal tax rate")
    state_marginal_rate: float = Field(..., description="State marginal tax rate")

    # 10. Paycheck Table
    paycheck_breakdown: PaycheckBreakdown = Field(..., description="Take-home pay across pay frequencies")

    # 11. Payments & Refund / Owed
    total_withholdings: float = Field(..., description="Total federal and state tax withheld")
    federal_refund_or_owed: float = Field(..., description="Federal tax refund (positive) or amount owed (negative)")
    state_refund_or_owed: float = Field(..., description="State tax refund (positive) or amount owed (negative)")
    combined_refund_or_owed: float = Field(..., description="Combined net refund or balance due")

    # 12. Federal Brackets
    bracket_breakdown: Optional[List[TaxBracketBreakdown]] = Field(default=None, description="Progressive brackets breakdown")

    # 13. Engine Metadata
    metadata: CalculationMetadata = Field(..., description="Execution duration and engine metadata")

