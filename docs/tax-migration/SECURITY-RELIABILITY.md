# ToolCastle PolicyEngine US Integration: Security, Reliability, & Privacy Architecture

**Last Updated:** 2026-10-16  
**Status:** Operational & Production-Verified  
**Engine:** `policyengine-us==2.44.0`  
**Applicability:** ToolCastle US Tax Calculator (`/us-income-tax-calculator/`)

---

## 1. Threat Model & Security Posture

The US Tax Calculator allows users to model federal, state, and payroll taxes under IRS and state statutory rules. Tax calculations process sensitive numbers (salary, capital gains, dependents, retirement contributions).

ToolCastle adopts a **Privacy-First, Zero-Persistence Architecture**:
- No user personal data is ever recorded to a database, session store, cookie, or analytics tracker.
- Calculations are strictly functional: `Input Parameters -> Simulation -> Result Response`.

---

## 2. Server-Side Request Validation & Size Limits

1. **Strict Type & Value Bounds (`app/schemas/request.py`):**
   - Income inputs are constrained to `ge=0.0, le=100_000_000.0` (rejecting negative numbers, NaN, and Inf).
   - Dependents are capped at `le=15` to prevent topological node-exhaustion attacks.
   - Tax years are strictly limited to `2025` and `2026` (rejecting unmodeled historical or future policy years).
   - State jurisdictions are strictly validated against 51 US statutory codes (50 states + DC).
   - Malformed payloads receive clean **HTTP 422 Unprocessable Entity** responses without Python stack traces.

2. **Request Payload Size Enforcement (`app/main.py` & `functions/api/us-tax-calc.ts`):**
   - Middleware enforces a strict **64 KB (`65536` bytes)** payload limit on all incoming `POST` requests.
   - Any request exceeding this limit is terminated immediately with **HTTP 413 Content Too Large** before JSON parsing or memory allocation occurs.

---

## 3. Rate Limiting & Abuse Protections

1. **SlowAPI IP-Based Rate Limiting:**
   - Default limit: `60 requests / minute` per remote client IP address.
   - Implemented via `slowapi` (`Limiter(key_func=get_remote_address)`).
   - Exceeded limits trigger **HTTP 429 Too Many Requests** with standard `Retry-After` headers.

2. **Cloudflare Edge Protection:**
   - Cloudflare Pages automatically applies DDoS mitigation, Bot Fight Mode, and managed challenges at the edge before traffic reaches the containerized microservice.

---

## 4. Privacy & Zero-PII Guarantees

1. **Zero Database / Zero File Storage:**
   - The microservice has no database connections, no persistent disk volumes, and no session state.
2. **Sanitized Access Logging:**
   - Middleware logs only HTTP method, endpoint path, response status code, execution duration, and client IP.
   - **No wages, salaries, dividend amounts, deduction figures, or dependent counts are ever printed to logs.**
3. **Response Metadata Sanitization:**
   - The API response contains calculation results, statutory breakdown, and calculation execution metadata (`tax_year`, `state_code`, `engine_version`, `residency_status`).
   - No client IP, user identifiers, or session tokens are returned or reflected.

---

## 5. Secret Management & Authentication

1. **Server-Side API Key Authorization (`X-API-Key`):**
   - When `REQUIRE_API_KEY=true`, requests must present a matching secret header.
   - Secrets are configured exclusively via server environment variables (`POLICYENGINE_API_KEY` in Cloudflare Pages and `API_SECRET_KEY` in FastAPI).
   - Secrets are **never** included in client-side Astro JavaScript bundles.
2. **CORS Hardening:**
   - Cross-Origin Resource Sharing is restricted to authorized ToolCastle domains:
     - `https://toolcastle.app`
     - `https://www.toolcastle.app`
     - `http://localhost:4321` (Local Development)
     - `http://localhost:3000` (Local Preview)

---

## 6. Frontend Race Condition & Stale Request Mitigation

In interactive tax calculators with dynamic input sliders, users produce rapid input events. If network latency varies, an older request could resolve after a newer one, displaying outdated results.

ToolCastle implements dual race-condition mitigation in `UsTaxCalculatorApp.astro` and `us-api-adapter.ts`:

1. **`AbortController` Cancellation:**
   - Every new input debounces for 250ms and aborts any active in-flight fetch before dispatching a new simulation.
2. **Monotonic Request Sequencing (`currentRequestId`):**
   - Each calculation assigns an incrementing `thisRequestId = ++currentRequestId`.
   - When the promise resolves, the response is discarded if `thisRequestId !== currentRequestId`.
   - **Guarantee:** Stale results from superseded requests can never overwrite fresher user input.

---

## 7. Client-Side In-Memory Cache Safety

1. **Ephemeral Scope:**
   - Cached responses are stored in an in-memory JavaScript `Map` inside the user's browser session.
   - The cache is automatically destroyed when the user closes the tab or navigates away.
   - No financial data is ever saved to `localStorage`, `sessionStorage`, or `cookies`.
2. **Composite Cache Key Isolation:**
   - Cache keys are prefixed with the exact engine version (`pe_us_v2.44.0:`) and serialized with every relevant parameter:
     `{tax_year, filing_status, state_code, primary_w2, spouse_w2, self_emp, interest, ord_div, qual_div, cap_gains, other_inc, kids, other_deps, age65, blind, pre_tax, itemized, withholdings}`.
   - Changing any single field generates a completely distinct key, eliminating cache collision or incorrect-result bugs.
3. **LRU Size Boundary:**
   - Capped at 100 entries with automatic eviction to prevent client memory bloat.

---

## 8. Controlled Error Responses & Local Fallback

1. **Controlled Error Responses:**
   - Global exception handlers catch unhandled Python errors, logging details server-side while returning generic, safe JSON (`InternalServerError`) without leaking stack traces, source file paths, or third-party dependency internals.
2. **Zero-Downtime Local Statutory Fallback:**
   - If the microservice container is cold, restarting, or unreachable, the frontend automatically falls back to ToolCastle's verified statutory TypeScript engine (`us-engine.ts`) in <1ms without breaking the user experience or presenting fatal error dialogs.
   - The UI displays an honest engine badge indicating whether results originate from `PolicyEngine US` or `Statutory Engine (Verified Local)`.

---

## 9. Automated Security & Reliability Verification

| Test Case | Location | Assertion | Status |
|:---|:---|:---|:---|
| **Payload Too Large (413)** | `test_security_reliability.py` | Requests > 64KB rejected with HTTP 413 Content Too Large | **PASS** |
| **Malformed JSON (422)** | `test_security_reliability.py` | Invalid JSON rejected cleanly without 500 error or stack traces | **PASS** |
| **API Key Enforcement (401)** | `test_security_reliability.py` | Unauthorized requests rejected when `REQUIRE_API_KEY=true` | **PASS** |
| **Zero Stack Trace Leakage** | `test_security_reliability.py` | Error responses contain zero Python tracebacks or file paths | **PASS** |
| **CORS Strictness** | `test_security_reliability.py` | CORS preflight respects allowed origins and methods | **PASS** |
| **Zero PII Retention** | `test_security_reliability.py` | Response contains no SSN, IP, or personal trackers | **PASS** |
| **Cache Key Isolation** | `us-adapter.test.ts` | Changing age, state, or dependents changes cache key | **PASS** |
| **Cache Flush** | `us-adapter.test.ts` | In-memory cache flushes cleanly via `clearCalculationCache` | **PASS** |
| **Fallback on Network Failure** | `us-adapter.test.ts` | 503/Network drop cleanly activates local fallback engine | **PASS** |

