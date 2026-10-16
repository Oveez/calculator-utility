# PolicyEngine US Microservice Dockerfile
# Base Image: Python 3.12 Slim (Debian Bookworm)
FROM python:3.12-slim AS base

# System configuration
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=off \
    PIP_DISABLE_PIP_VERSION_CHECK=on \
    PORT=8000 \
    ENVIRONMENT=production

# Install essential system dependencies for HDF5, Blosc2, and health checks
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    libgomp1 \
    && rm -rf /var/lib/apt/lists/*

# Create application directory and non-privileged user
WORKDIR /app
RUN groupadd -g 10001 appgroup && \
    useradd -u 10000 -g appgroup -s /bin/bash -m appuser

# Install Python dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy application source code
COPY app/ ./app/

# Pre-compile Python bytecode and initialize PolicyEngine cache directory
RUN python -m compileall app/ && \
    mkdir -p /home/appuser/.cache && \
    chown -R appuser:appgroup /app /home/appuser/.cache

# Switch to non-privileged user
USER appuser

# Expose HTTP port
EXPOSE 8000

# Container healthcheck
HEALTHCHECK --interval=30s --timeout=5s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8000/health || exit 1

# Production server execution using Uvicorn
# 1 worker per container is optimal for memory management (requires ~1GB RAM)
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000", "--timeout-keep-alive", "65"]

