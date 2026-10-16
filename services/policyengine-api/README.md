# ToolCastle PolicyEngine US API Microservice

A production-ready FastAPI microservice wrapping **PolicyEngine US** (`policyengine-us==2.44.0`) to provide authoritative US federal and state tax calculations for ToolCastle.

---

## 1. Architectural Overview

ToolCastle is an Astro static/SSR web application deployed on Cloudflare Pages. Cloudflare's edge runtime runs on Google V8 JavaScript isolates, which cannot execute CPython binary packages (NumPy, PyTables, HDF5, Blosc2).

This service isolates the heavy scientific Python runtime in an independent, containerized microservice:

```
+--------------------------+           HTTPS / JSON          +------------------------------+
|   ToolCastle Frontend    | -----------------------------> |  PolicyEngine API (FastAPI)  |
| (Cloudflare Pages / DOM) | <----------------------------- |     (Docker / 1 GB RAM)      |
+--------------------------+    Debounced precision queries +------------------------------+
            |                                                               |
            v                                                               v
  Instant Optimistic Render                                     Authoritative Simulation
    (us-engine.ts fallback)                                    (policyengine-us == 2.44.0)
```

### Key Architectural Safeguards:
1. **Zero Disruption to Astro Static Build:** Astro compiles all 212 pages locally and in Cloudflare Pages CI without requiring Python during build time.
2. **Instant UI Responsiveness:** Sliders and inputs calculate instantly (<1ms) via `us-engine.ts`, while precision calculations debounce asynchronously to this service.
3. **Resilience & Fallback:** If this service experiences a cold start or temporary network partition, the frontend continues to display verified statutory calculations without blocking the user.
4. **Pre-Warmed Lifespan:** On container boot, the application executes a warm-up simulation to compile PolicyEngine's JIT graph into memory, reducing initial request latency from ~7 seconds down to <200ms.

---

## 2. Cost Analysis & Hosting Strategies

PolicyEngine US requires **~350–450 MB RSS** during active calculation and **~1.0 GB RAM** limit to prevent Out-Of-Memory (OOM) kills during graph initialization.

| Hosting Provider | Plan / Tier | Memory Allocation | Estimated Cost | Cold-Start Behavior | Recommended For |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Google Cloud Run** | Serverless Container | 1024 MB RAM, 1 vCPU | **$0.00 / month** (within 2M free requests/mo) | 4–6s if scaled to zero (mitigated by min-instances=1 for ~$5/mo) | Production (Lowest Cost) |
| **Fly.io** | Shared CPU 1x | 1024 MB RAM | **~$3.19 / month** (or free allowance credit) | Auto-sleeps after idle; fast resume | Staging & Production |
| **Render** | Starter Web Service | 1024 MB RAM, 0.5 CPU | **$7.00 / month** | Always warm, zero cold starts | Production (Turnkey) |
| **Self-Hosted VPS** | Hetzner / DigitalOcean | 2048 MB RAM | **$4.00 / month** | Always warm, full control | Self-hosted Infra |

---

## 3. Environment Configuration

Copy `.env.example` to `.env`:

```bash
PORT=8000
ENVIRONMENT=production
ALLOWED_ORIGINS=["https://toolcastle.app","https://www.toolcastle.app","http://localhost:4321"]
REQUIRE_API_KEY=false
API_SECRET_KEY=generate_random_secret_here
RATE_LIMIT_PER_MINUTE=60
DEFAULT_TAX_YEAR=2026
```

---

## 4. Local Development

### Option A: Using Local Python (Recommended for fast dev)
```bash
# Navigate to microservice directory
cd services/policyengine-api

# Create and activate virtual environment
python -m venv .venv
source .venv/bin/activate  # Or on Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run development server with auto-reload
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

### Option B: Using Docker
```bash
cd services/policyengine-api
docker compose up --build
```

Test the health endpoint:
```bash
curl http://localhost:8000/health
```

---

## 5. Production Deployment Instructions

### Deploy to Fly.io
```bash
cd services/policyengine-api
fly launch --config fly.toml --copy-config
fly deploy
```

### Deploy to Google Cloud Run
```bash
cd services/policyengine-api
gcloud run deploy toolcastle-policyengine-api \
  --source . \
  --platform managed \
  --region us-central1 \
  --memory 1024Mi \
  --cpu 1 \
  --min-instances 0 \
  --max-instances 5 \
  --allow-unauthenticated
```

---

## 6. Open Source & AGPL-3.0 License Notice

This service incorporates and executes **PolicyEngine US**, which is licensed under the **GNU Affero General Public License v3.0 (AGPL-3.0)**.
Under AGPL-3.0 Section 13 (Remote Network Interaction), the complete corresponding source code of this adapter service and its calculation schemas are made publicly available at:
`https://github.com/toolcastle/calculator-utility/tree/main/services/policyengine-api`

