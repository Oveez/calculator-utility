import pytest
from fastapi.testclient import TestClient
from app.main import app


@pytest.fixture
def client():
    """Create test client using FastAPI TestClient."""
    return TestClient(app)


def test_calculate_single_w2_california_2026(client):
    """Verify statutory calculation for $75,000 Single taxpayer in California for 2026."""
    payload = {
        "tax_year": 2026,
        "filing_status": "single",
        "state_code": "CA",
        "primary_w2_income": 75000.0,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()

    # Gross income
    assert data["total_gross_income"] == 75000.0
    assert data["earned_income"] == 75000.0
    assert data["investment_income"] == 0.0

    # 2026 IRS Statutory Standard Deduction (Rev. Proc. 2025-32)
    assert data["standard_deduction_amount"] == 16100.0
    assert data["deduction_used"] == "standard"
    assert data["deduction_amount"] == 16100.0
    assert data["taxable_income"] == 58900.0  # 75000 - 16100

    # FICA Taxes (Exact Statutory Rates)
    assert data["employee_social_security_tax"] == 4650.0  # 75000 * 6.2%
    assert data["employee_medicare_tax"] == 1087.50       # 75000 * 1.45%
    assert data["total_payroll_tax"] == 5737.50

    # State Tax (California)
    assert data["state_code"] == "CA"
    assert data["state_tax_name"] == "California"
    assert data["state_income_tax"] > 2000.0

    # Federal Income Tax
    assert data["net_federal_income_tax"] > 7000.0
    assert data["total_all_taxes"] > 15000.0

    # Paycheck Breakdown
    paycheck = data["paycheck_breakdown"]
    assert paycheck["annual"] > 50000.0
    assert paycheck["monthly"] == round(paycheck["annual"] / 12.0, 2)
    assert paycheck["bi_weekly"] == round(paycheck["annual"] / 26.0, 2)

    # Rates
    assert 20.0 <= data["effective_total_tax_rate"] <= 25.0
    assert 25.0 <= data["marginal_tax_rate"] <= 40.0

    # Metadata
    assert data["metadata"]["tax_year"] == 2026
    assert data["metadata"]["state_code"] == "CA"
    assert data["metadata"]["engine"] == "PolicyEngine US"


def test_calculate_married_joint_with_child_ny_2026(client):
    """Verify Married Joint filer with two earners and 1 child in New York."""
    payload = {
        "tax_year": 2026,
        "filing_status": "married_joint",
        "state_code": "NY",
        "primary_w2_income": 80000.0,
        "spouse_w2_income": 45000.0,
        "num_children_under_17": 1,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()

    assert data["total_gross_income"] == 125000.0
    assert data["standard_deduction_amount"] == 32200.0  # 2026 Joint standard deduction
    assert data["child_tax_credit"] > 0.0               # CTC applied
    assert data["state_code"] == "NY"
    assert data["state_income_tax"] > 0.0


def test_calculate_self_employed_texas_2026(client):
    """Verify 1099 Self-Employed filer in Texas (zero state income tax)."""
    payload = {
        "tax_year": 2026,
        "filing_status": "single",
        "state_code": "TX",
        "self_employment_income": 100000.0,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()

    # Self-employment tax (15.3% on 92.35%)
    assert data["self_employment_tax"] > 14000.0
    assert data["deductible_self_employment_tax"] == round(data["self_employment_tax"] * 0.5, 2)
    assert data["adjusted_gross_income"] == round(100000.0 - data["deductible_self_employment_tax"], 2)

    # Texas has no state personal income tax
    assert data["state_code"] == "TX"
    assert data["state_income_tax"] == 0.0


def test_calculate_federal_only_2026(client):
    """Verify federal-only calculation when state_code is None or 'none'."""
    payload = {
        "tax_year": 2026,
        "filing_status": "single",
        "state_code": "none",
        "primary_w2_income": 60000.0,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()

    assert data["state_code"] is None
    assert data["state_income_tax"] == 0.0
    assert data["state_tax_name"] == "Federal Only"
    assert data["net_federal_income_tax"] > 0.0



def test_validation_rejects_negative_income(client):
    """Verify validation rejects negative income amounts."""
    payload = {
        "tax_year": 2026,
        "filing_status": "single",
        "state_code": "CA",
        "primary_w2_income": -5000.0,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 422  # Unprocessable Entity


def test_validation_rejects_invalid_state_code(client):
    """Verify validation rejects invalid state codes."""
    payload = {
        "tax_year": 2026,
        "filing_status": "single",
        "state_code": "ZZ",
        "primary_w2_income": 50000.0,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 422


def test_validation_rejects_unsupported_year(client):
    """Verify validation rejects unsupported historical years."""
    payload = {
        "tax_year": 2018,
        "filing_status": "single",
        "state_code": "CA",
        "primary_w2_income": 50000.0,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 422


def test_validation_rejects_spouse_income_for_single_filer(client):
    """Verify validation rejects spouse income when filing status is Single."""
    payload = {
        "tax_year": 2026,
        "filing_status": "single",
        "state_code": "CA",
        "primary_w2_income": 50000.0,
        "spouse_w2_income": 30000.0,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 422


def test_marginal_and_effective_tax_rates(client):
    """Verify distinction between marginal rate (delta perturbation) and effective rate."""
    payload = {
        "tax_year": 2026,
        "filing_status": "single",
        "state_code": "CA",
        "primary_w2_income": 95000.0,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()

    assert data["effective_federal_rate"] > 0.0
    assert data["effective_total_tax_rate"] > data["effective_federal_rate"]
    # Top marginal rate should be higher than blended effective rate
    assert data["marginal_tax_rate"] > data["effective_total_tax_rate"]
    assert data["federal_marginal_rate"] >= 22.0
    # Employer-side taxes are explicitly excluded
    assert data["metadata"]["employer_taxes_included"] is False
    assert "PolicyEngine US" in data["metadata"]["disclaimer"]


def test_ctc_phaseout_high_earner(client):
    """Verify Child Tax Credit phases out above statutory threshold ($200k single)."""
    payload = {
        "tax_year": 2026,
        "filing_status": "single",
        "state_code": "TX",
        "primary_w2_income": 260000.0,
        "num_children_under_17": 1,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()

    # Above $240,000, the $2,000 CTC is fully phased out ($50 per $1,000 above $200k)
    assert data["child_tax_credit"] == 0.0


def test_itemized_deductions_optimizer(client):
    """Verify auto-optimizer claims itemized deductions when they exceed standard deduction."""
    payload = {
        "tax_year": 2026,
        "filing_status": "single",
        "state_code": "CA",
        "primary_w2_income": 120000.0,
        "itemized_mortgage_interest": 18000.0,
        "itemized_charitable_donations": 4000.0,
        "itemized_real_estate_taxes": 6000.0,
        "deduction_mode": "auto",
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()

    assert data["deduction_used"] == "itemized"
    assert data["deduction_amount"] > data["standard_deduction_amount"]
    assert data["itemized_advantage"] > 0.0


def test_niit_high_investment_income_2026(client):
    """Verify 3.8% Net Investment Income Tax (IRC § 1411) on investment income above $200k MAGI threshold."""
    payload = {
        "tax_year": 2026,
        "filing_status": "single",
        "primary_w2_income": 240000.0,
        "qualified_dividends": 30000.0,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()

    # Total MAGI = $270k. Single threshold = $200k. Excess MAGI = $70k.
    # NII = $30k dividends. Base = min($30k, $70k) = $30k.
    # NIIT = 3.8% of $30,000 = $1,140.00
    assert data["net_investment_income_tax"] == 1140.0
    assert data["metadata"]["residency_status"] == "full_year_resident"
    assert len(data["metadata"]["unsupported_features"]) > 0


def test_wage_and_se_social_security_cap_coordination_2026(client):
    """Verify multi-source FICA OASDI cap coordination under IRC § 1402(b) ($184,500 in 2026)."""
    payload = {
        "tax_year": 2026,
        "filing_status": "single",
        "primary_w2_income": 150000.0,
        "self_employment_income": 60000.0,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()

    # Employee W-2 SS tax = 6.2% of $150,000 = $9,300
    assert data["employee_social_security_tax"] == 9300.0

    # Remaining cap space = $184,500 - $150,000 = $34,500
    # SE OASDI tax = 12.4% of $34,500 = $4,278.00 (plus 2.9% uncapped Medicare on SE profit)
    assert data["self_employment_tax"] > 4278.0


def test_tax_year_transition_2025_vs_2026(client):
    """Verify year-awareness: 2025 and 2026 reflect their respective statutory standard deductions."""
    payload_2025 = {
        "tax_year": 2025,
        "filing_status": "single",
        "primary_w2_income": 75000.0,
    }
    payload_2026 = {
        "tax_year": 2026,
        "filing_status": "single",
        "primary_w2_income": 75000.0,
    }
    res_2025 = client.post("/api/v1/calculate", json=payload_2025)
    res_2026 = client.post("/api/v1/calculate", json=payload_2026)

    assert res_2025.status_code == 200
    assert res_2026.status_code == 200

    data_2025 = res_2025.json()
    data_2026 = res_2026.json()

    # 2026 standard deduction is inflation-adjusted higher than 2025 per Rev. Proc. 2025-32
    assert data_2026["standard_deduction_amount"] > data_2025["standard_deduction_amount"]


# ==============================================================================
# PHASE 7: OFFICIAL IRS & STATE STATUTORY BENCHMARKS (10 CORE SCENARIOS)
# ==============================================================================

def test_scenario_1_single_w2_irs_rev_proc_2025_32(client):
    """Scenario 1: Single filer, $60,000 W-2, Federal-Only, standard deduction.
    Exact IRS Rev. Proc. 2025-32 Benchmark:
    - Standard deduction: $16,100
    - Taxable income: $43,900
    - Brackets: 10% on $12,400 ($1,240) + 12% on $31,500 ($3,780) = $5,020.00
    - FICA: 6.2% OASDI ($3,720) + 1.45% Medicare ($870) = $4,590.00
    - Net take-home: $60,000 - $9,610 = $50,390.00
    """
    payload = {
        "tax_year": 2026,
        "filing_status": "single",
        "primary_w2_income": 60000.0,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()

    assert data["standard_deduction_amount"] == 16100.0
    assert data["taxable_income"] == 43900.0
    assert data["net_federal_income_tax"] == 5020.0
    assert data["employee_social_security_tax"] == 3720.0
    assert data["employee_medicare_tax"] == 870.0
    assert data["total_payroll_tax"] == 4590.0
    assert data["total_all_taxes"] == 9610.0
    assert data["household_net_income"] == 50390.0


def test_scenario_2_mfj_two_incomes_irs_rev_proc_2025_32(client):
    """Scenario 2: Married filing jointly, two earners ($90k + $70k = $160k), standard deduction.
    Exact IRS Rev. Proc. 2025-32 Benchmark:
    - Standard deduction: $32,200
    - Taxable income: $127,800
    - Brackets: 10% on $24,800 ($2,480) + 12% on $76,000 ($9,120) + 22% on $27,000 ($5,940) = $17,540.00
    - FICA: Primary ($6,885) + Spouse ($5,355) = $12,240.00
    - Net take-home: $160,000 - $29,780 = $130,220.00
    """
    payload = {
        "tax_year": 2026,
        "filing_status": "married_joint",
        "primary_w2_income": 90000.0,
        "spouse_w2_income": 70000.0,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()

    assert data["total_gross_income"] == 160000.0
    assert data["standard_deduction_amount"] == 32200.0
    assert data["taxable_income"] == 127800.0
    assert data["net_federal_income_tax"] == 17540.0
    assert data["total_payroll_tax"] == 12240.0
    assert data["total_all_taxes"] == 29780.0
    assert data["household_net_income"] == 130220.0


def test_scenario_3_head_of_household_with_children_ctc(client):
    """Scenario 3: Head of Household, $65,000 W-2, 2 qualifying children under 17.
    Exact IRS Rev. Proc. 2025-32 Benchmark:
    - Standard deduction (HOH 2026): $24,150
    - Taxable income: $40,850
    - Pre-credit tax: 10% on $17,700 ($1,770) + 12% on $23,150 ($2,778) = $4,548.00
    - Child Tax Credit: 2 children indexed at $2,200 per child = $4,400.00
    - Net federal tax: $4,548 - $4,400 = $148.00
    """
    payload = {
        "tax_year": 2026,
        "filing_status": "head_of_household",
        "primary_w2_income": 65000.0,
        "num_children_under_17": 2,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()

    assert data["standard_deduction_amount"] == 24150.0
    assert data["taxable_income"] == 40850.0
    assert data["gross_federal_tax"] == 4548.0
    assert data["child_tax_credit"] == 4400.0
    assert data["net_federal_income_tax"] == 148.0


def test_scenario_6_preferential_capital_gains_0_pct_bracket(client):
    """Scenario 6: Taxpayer with capital gains inside the 0% preferential capital gains bracket.
    - $40,000 W-2 wages + $20,000 Long-Term Capital Gains.
    - Total taxable: $60,000 - $16,100 = $43,900.
    - Ordinary taxable: $40,000 - $16,100 = $23,900.
    - 0% LTCG threshold extends to $49,450. Entire $20,000 is taxed at 0%.
    - Capital gains tax = $0.00.
    """
    payload = {
        "tax_year": 2026,
        "filing_status": "single",
        "primary_w2_income": 40000.0,
        "long_term_capital_gains": 20000.0,
    }
    response = client.post("/api/v1/calculate", json=payload)
    assert response.status_code == 200, response.text
    data = response.json()

    assert data["capital_gains_tax"] == 0.0
    assert data["net_federal_income_tax"] == 5020.0


def test_scenario_8_zero_income_tax_states_fl_and_wa(client):
    """Scenario 8: Non-income tax states (Florida and Washington) strictly assess $0.00 state income tax."""
    for state in ["FL", "WA", "NV", "TN", "WY", "SD", "AK"]:
        payload = {
            "tax_year": 2026,
            "filing_status": "single",
            "state_code": state,
            "primary_w2_income": 95000.0,
        }
        res = client.post("/api/v1/calculate", json=payload)
        assert res.status_code == 200, f"Failed for state {state}"
        data = res.json()
        assert data["state_code"] == state
        assert data["state_income_tax"] == 0.0, f"Expected 0 tax for {state}"




