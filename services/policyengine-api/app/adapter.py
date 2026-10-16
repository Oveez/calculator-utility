import time
from typing import Dict, Any, List
from policyengine_us import Simulation

from app.schemas.request import TaxCalculationRequest, FilingStatusEnum, DeductionModeEnum
from app.schemas.response import (
    TaxCalculationResponse,
    PaycheckBreakdown,
    TaxBracketBreakdown,
    CalculationMetadata,
)

# State Name Mapping for Display
STATE_NAMES: Dict[str, str] = {
    "AL": "Alabama", "AK": "Alaska", "AZ": "Arizona", "AR": "Arkansas", "CA": "California",
    "CO": "Colorado", "CT": "Connecticut", "DE": "Delaware", "FL": "Florida", "GA": "Georgia",
    "HI": "Hawaii", "ID": "Idaho", "IL": "Illinois", "IN": "Indiana", "IA": "Iowa",
    "KS": "Kansas", "KY": "Kentucky", "LA": "Louisiana", "ME": "Maine", "MD": "Maryland",
    "MA": "Massachusetts", "MI": "Michigan", "MN": "Minnesota", "MS": "Mississippi", "MO": "Missouri",
    "MT": "Montana", "NE": "Nebraska", "NV": "Nevada", "NH": "New Hampshire", "NJ": "New Jersey",
    "NM": "New Mexico", "NY": "New York", "NC": "North Carolina", "ND": "North Dakota", "OH": "Ohio",
    "OK": "Oklahoma", "OR": "Oregon", "PA": "Pennsylvania", "RI": "Rhode Island", "SC": "South Carolina",
    "SD": "South Dakota", "TN": "Tennessee", "TX": "Texas", "UT": "Utah", "VT": "Vermont",
    "VA": "Virginia", "WA": "Washington", "WV": "West Virginia", "WI": "Wisconsin", "WY": "Wyoming",
    "DC": "District of Columbia"
}

# PolicyEngine Filing Status Mapping
FILING_STATUS_MAP: Dict[FilingStatusEnum, str] = {
    FilingStatusEnum.SINGLE: "SINGLE",
    FilingStatusEnum.MARRIED_JOINT: "JOINT",
    FilingStatusEnum.MARRIED_SEPARATE: "SEPARATE",
    FilingStatusEnum.HEAD_OF_HOUSEHOLD: "HEAD_OF_HOUSEHOLD",
    FilingStatusEnum.QUALIFYING_WIDOW: "SURVIVING_SPOUSE",
}


def build_policyengine_situation(req: TaxCalculationRequest) -> Dict[str, Any]:
    """Construct a PolicyEngine topological situation dictionary from validated request."""
    year = req.tax_year
    people: Dict[str, Dict[str, Any]] = {}
    members: List[str] = ["taxpayer"]

    # 1. Primary Taxpayer
    taxpayer_age = 65 if req.taxpayer_age_65_or_over else 40
    taxpayer_data: Dict[str, Any] = {
        "age": {year: taxpayer_age},
        "is_blind": {year: req.taxpayer_blind},
        "employment_income": {year: req.primary_w2_income},
        "self_employment_income": {year: req.self_employment_income},
        "taxable_interest_income": {year: req.taxable_interest},
        "qualified_dividend_income": {year: req.qualified_dividends},
        "non_qualified_dividend_income": {year: max(0.0, req.ordinary_dividends - req.qualified_dividends)},
        "capital_gains": {year: req.long_term_capital_gains},
        "miscellaneous_income": {year: req.other_income},
        "traditional_ira_contributions": {year: req.traditional_ira_deduction},
        "pre_tax_contributions": {year: req.pre_tax_retirement_401k},
    }
    people["taxpayer"] = taxpayer_data

    # 2. Spouse (if Married Joint)
    if req.filing_status == FilingStatusEnum.MARRIED_JOINT:
        spouse_age = 65 if req.spouse_age_65_or_over else 38
        people["spouse"] = {
            "age": {year: spouse_age},
            "is_blind": {year: req.spouse_blind},
            "employment_income": {year: req.spouse_w2_income},
        }
        members.append("spouse")

    # 3. Children Under 17 (Qualifying for Child Tax Credit)
    for i in range(1, req.num_children_under_17 + 1):
        child_id = f"child_{i}"
        people[child_id] = {
            "age": {year: 10},
        }
        members.append(child_id)

    # 4. Other Dependents (Adult / Student Dependents)
    for i in range(1, req.num_other_dependents + 1):
        dep_id = f"dependent_{i}"
        people[dep_id] = {
            "age": {year: 19},
        }
        members.append(dep_id)

    # 5. Tax Unit
    pe_filing_status = FILING_STATUS_MAP[req.filing_status]
    tax_unit_data: Dict[str, Any] = {
        "members": members,
        "filing_status": {year: pe_filing_status},
    }

    # Itemized deductions
    total_itemized = (
        req.itemized_mortgage_interest +
        req.itemized_charitable_donations +
        req.itemized_real_estate_taxes +
        req.itemized_state_local_tax +
        req.itemized_medical_expenses
    )
    if total_itemized > 0:
        if req.itemized_mortgage_interest > 0:
            people["taxpayer"]["mortgage_interest"] = {year: req.itemized_mortgage_interest}
        if req.itemized_charitable_donations > 0:
            people["taxpayer"]["charitable_cash_donations"] = {year: req.itemized_charitable_donations}
        if req.itemized_real_estate_taxes > 0:
            people["taxpayer"]["real_estate_taxes"] = {year: req.itemized_real_estate_taxes}
        if req.itemized_medical_expenses > 0:
            people["taxpayer"]["other_medical_expenses"] = {year: req.itemized_medical_expenses}
        if req.itemized_state_local_tax > 0:
            people["taxpayer"]["state_withheld_income_tax"] = {year: req.itemized_state_local_tax}

    if req.deduction_mode == DeductionModeEnum.ITEMIZED:
        tax_unit_data["tax_unit_itemizes"] = {year: True}
    elif req.deduction_mode == DeductionModeEnum.STANDARD:
        tax_unit_data["tax_unit_itemizes"] = {year: False}

    return {
        "people": people,
        "tax_units": {"tax_unit": tax_unit_data},
        "families": {"family": {"members": members}},
        "spm_units": {"spm_unit": {"members": members}},
        "households": {
            "household": {
                "members": members,
                **({"state_code": {year: req.state_code}} if req.state_code else {}),
            }
        }
    }


def calculate_marginal_tax_rate(
    req: TaxCalculationRequest,
    base_total_tax: float,
    base_fed_tax: float,
    base_state_tax: float
) -> tuple[float, float, float]:
    """Calculate combined, federal, and state marginal tax rates using a +$100 wage increment."""
    year = req.tax_year
    delta = 100.0

    # Create perturbed request with +$100 primary wage
    perturbed_req = req.model_copy(update={"primary_w2_income": req.primary_w2_income + delta})
    situation = build_policyengine_situation(perturbed_req)
    sim = Simulation(situation=situation)

    fed_tax_delta = float(sim.calculate("income_tax", year)[0])
    state_tax_delta = float(sim.calculate("state_income_tax", year)[0]) if req.state_code else 0.0
    ss_tax_delta = float(sim.calculate("employee_social_security_tax", year).sum())
    med_tax_delta = float(sim.calculate("employee_medicare_tax", year).sum())
    se_tax_delta = float(sim.calculate("self_employment_tax", year).sum())

    new_total_tax = fed_tax_delta + state_tax_delta + ss_tax_delta + med_tax_delta + se_tax_delta
    marginal_combined = max(0.0, min(100.0, ((new_total_tax - base_total_tax) / delta) * 100.0))
    marginal_fed = max(0.0, min(100.0, ((fed_tax_delta - base_fed_tax) / delta) * 100.0))
    marginal_state = max(0.0, min(100.0, ((state_tax_delta - base_state_tax) / delta) * 100.0))

    return round(marginal_combined, 2), round(marginal_fed, 2), round(marginal_state, 2)


def execute_policyengine_calculation(req: TaxCalculationRequest) -> TaxCalculationResponse:
    """Execute authoritative tax calculation using policyengine-us and return structured response."""
    t0 = time.time()
    year = req.tax_year

    situation = build_policyengine_situation(req)
    sim = Simulation(situation=situation)

    # Calculate authoritative output metrics
    net_fed_tax = max(0.0, float(sim.calculate("income_tax", year)[0]))
    state_tax = max(0.0, float(sim.calculate("state_income_tax", year)[0])) if req.state_code else 0.0
    ss_tax = max(0.0, float(sim.calculate("employee_social_security_tax", year).sum()))
    med_tax = max(0.0, float(sim.calculate("employee_medicare_tax", year).sum()))
    addl_med_tax = max(0.0, float(sim.calculate("additional_medicare_tax", year).sum()))
    se_tax = max(0.0, float(sim.calculate("self_employment_tax", year).sum()))
    net_household_income = float(sim.calculate("household_net_income", year)[0])

    # Deductions & Incomes
    agi = float(sim.calculate("adjusted_gross_income", year)[0])
    taxable_income = max(0.0, float(sim.calculate("taxable_income", year)[0]))
    std_deduction = float(sim.calculate("standard_deduction", year)[0])

    # Credits
    try:
        ctc = float(sim.calculate("ctc", year)[0])
    except Exception:
        ctc = 0.0

    try:
        eitc = float(sim.calculate("eitc", year)[0])
    except Exception:
        eitc = 0.0

    # Special Taxes & Preferential Rates (Phase 6)
    try:
        amt = max(0.0, float(sim.calculate("alternative_minimum_tax", year)[0]))
    except Exception:
        amt = 0.0

    try:
        niit = max(0.0, float(sim.calculate("net_investment_income_tax", year)[0]))
    except Exception:
        niit = 0.0

    try:
        cap_gains_tax = max(0.0, float(sim.calculate("capital_gains_tax", year)[0]))
    except Exception:
        cap_gains_tax = 0.0

    # Gross income calculations
    earned_income = req.primary_w2_income + req.spouse_w2_income + req.self_employment_income
    investment_income = (
        req.taxable_interest + req.ordinary_dividends +
        req.qualified_dividends + req.long_term_capital_gains
    )
    total_gross = earned_income + investment_income + req.other_income

    # Deductions analysis
    total_itemized = (
        req.itemized_mortgage_interest +
        req.itemized_charitable_donations +
        req.itemized_real_estate_taxes +
        req.itemized_state_local_tax +
        req.itemized_medical_expenses
    )

    if req.deduction_mode == DeductionModeEnum.ITEMIZED:
        deduction_used = "itemized"
        deduction_amount = total_itemized
    elif req.deduction_mode == DeductionModeEnum.STANDARD:
        deduction_used = "standard"
        deduction_amount = std_deduction
    else:
        # Auto selection
        if total_itemized > std_deduction:
            deduction_used = "itemized"
            deduction_amount = total_itemized
        else:
            deduction_used = "standard"
            deduction_amount = std_deduction

    itemized_advantage = max(0.0, total_itemized - std_deduction)

    # Payroll totals
    total_payroll_tax = ss_tax + med_tax + addl_med_tax + se_tax
    deductible_se_tax = round(se_tax * 0.5, 2)
    adjustments_to_income = (
        deductible_se_tax + req.pre_tax_retirement_401k +
        req.traditional_ira_deduction + req.hsa_deduction +
        req.student_loan_interest
    )

    # Total combined tax
    total_all_taxes = net_fed_tax + state_tax + total_payroll_tax

    # Calculate Marginal Rates
    marginal_combined, marginal_fed, marginal_state = calculate_marginal_tax_rate(
        req, total_all_taxes, net_fed_tax, state_tax
    )

    # Effective tax rates
    effective_fed_rate = round((net_fed_tax / total_gross * 100.0) if total_gross > 0 else 0.0, 2)
    effective_total_rate = round((total_all_taxes / total_gross * 100.0) if total_gross > 0 else 0.0, 2)

    # Paycheck breakdown
    take_home = max(0.0, total_gross - total_all_taxes)
    paycheck = PaycheckBreakdown(
        annual=round(take_home, 2),
        monthly=round(take_home / 12.0, 2),
        semi_monthly=round(take_home / 24.0, 2),
        bi_weekly=round(take_home / 26.0, 2),
        weekly=round(take_home / 52.0, 2),
    )

    # Payments and Refund / Owed
    total_withholdings = req.federal_tax_withheld + req.state_tax_withheld
    fed_refund_or_owed = round(req.federal_tax_withheld - net_fed_tax, 2)
    state_refund_or_owed = round(req.state_tax_withheld - state_tax, 2)
    combined_refund_or_owed = round(fed_refund_or_owed + state_refund_or_owed, 2)

    calc_duration = (time.time() - t0) * 1000

    metadata = CalculationMetadata(
        tax_year=year,
        state_code=req.state_code,
        filing_status=req.filing_status.value,
        calculation_duration_ms=round(calc_duration, 2),
    )

    state_name = STATE_NAMES.get(req.state_code, req.state_code or "Federal Only") if req.state_code else "Federal Only"

    return TaxCalculationResponse(
        total_gross_income=round(total_gross, 2),
        earned_income=round(earned_income, 2),
        investment_income=round(investment_income, 2),
        self_employment_tax=round(se_tax, 2),
        deductible_self_employment_tax=round(deductible_se_tax, 2),
        total_adjustments_to_income=round(adjustments_to_income, 2),
        adjusted_gross_income=round(agi, 2),
        standard_deduction_amount=round(std_deduction, 2),
        itemized_deductions_total=round(total_itemized, 2),
        deduction_used=deduction_used,
        deduction_amount=round(deduction_amount, 2),
        itemized_advantage=round(itemized_advantage, 2),
        taxable_income=round(taxable_income, 2),
        gross_federal_tax=round(net_fed_tax + ctc + eitc, 2),
        child_tax_credit=round(ctc, 2),
        other_dependent_credit=0.0,
        earned_income_credit=round(eitc, 2),
        total_tax_credits=round(ctc + eitc, 2),
        alternative_minimum_tax=round(amt, 2),
        net_investment_income_tax=round(niit, 2),
        capital_gains_tax=round(cap_gains_tax, 2),
        net_federal_income_tax=round(net_fed_tax, 2),
        employee_social_security_tax=round(ss_tax, 2),
        employee_medicare_tax=round(med_tax, 2),
        additional_medicare_tax=round(addl_med_tax, 2),
        total_payroll_tax=round(total_payroll_tax, 2),
        state_code=req.state_code,
        state_tax_name=state_name,
        state_income_tax=round(state_tax, 2),
        total_all_taxes=round(total_all_taxes, 2),
        household_net_income=round(take_home, 2),
        effective_federal_rate=effective_fed_rate,
        effective_total_tax_rate=effective_total_rate,
        marginal_tax_rate=marginal_combined,
        federal_marginal_rate=marginal_fed,
        state_marginal_rate=marginal_state,
        paycheck_breakdown=paycheck,
        total_withholdings=round(total_withholdings, 2),
        federal_refund_or_owed=fed_refund_or_owed,
        state_refund_or_owed=state_refund_or_owed,
        combined_refund_or_owed=combined_refund_or_owed,
        bracket_breakdown=None,
        metadata=metadata,
    )

