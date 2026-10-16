/**
 * Cloudflare Pages Function: /api/us-tax-calc
 * 
 * Edge proxy routing US tax calculation requests to the PolicyEngine US microservice.
 * Handles timeouts, upstream failure detection, header forwarding, CORS, and optional API key security.
 */

interface Env {
  POLICYENGINE_API_URL?: string;
  POLICYENGINE_API_KEY?: string;
}

const DEFAULT_UPSTREAM_URL = 'http://127.0.0.1:8000';
const TIMEOUT_MS = 10000; // 10-second request timeout for cold starts
const MAX_PAYLOAD_BYTES = 65536; // 64 KB limit

const ALLOWED_ORIGINS = [
  'https://toolcastle.app',
  'https://www.toolcastle.app',
  'http://localhost:4321',
  'http://localhost:3000',
];

function getCorsHeaders(request: Request): Record<string, string> {
  const origin = request.headers.get('Origin') || '';
  const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : 'https://toolcastle.app';
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, X-API-Key',
    'Content-Type': 'application/json',
  };
}

export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;
  const corsHeaders = getCorsHeaders(request);

  // 1. Enforce payload size limit (64 KB)
  const contentLength = request.headers.get('content-length');
  if (contentLength && parseInt(contentLength, 10) > MAX_PAYLOAD_BYTES) {
    return new Response(
      JSON.stringify({ success: false, error: 'Request payload exceeds 64KB limit.' }),
      { status: 413, headers: corsHeaders }
    );
  }

  let payload: any;
  try {
    payload = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid JSON calculation payload.' }),
      { status: 400, headers: corsHeaders }
    );
  }

  // 2. Basic sanity validation
  if (!payload || typeof payload !== 'object') {
    return new Response(
      JSON.stringify({ success: false, error: 'Request body must be a JSON object.' }),
      { status: 400, headers: corsHeaders }
    );
  }

  const upstreamBase = env.POLICYENGINE_API_URL || DEFAULT_UPSTREAM_URL;
  const upstreamUrl = `${upstreamBase.replace(/\/+$/, '')}/api/v1/calculate`;

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'User-Agent': 'ToolCastle-Cloudflare-Proxy/1.0',
  };

  if (env.POLICYENGINE_API_KEY) {
    headers['X-API-Key'] = env.POLICYENGINE_API_KEY;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  try {
    const upstreamRes = await fetch(upstreamUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await upstreamRes.json();
    return new Response(JSON.stringify(data), {
      status: upstreamRes.status,
      headers: corsHeaders,
    });
  } catch (err: any) {
    clearTimeout(timeoutId);

    const isAbort = err.name === 'AbortError';
    const errorMessage = isAbort
      ? 'PolicyEngine calculation service timed out (10s limit exceeded).'
      : 'PolicyEngine microservice is temporarily unavailable. Local calculation fallback active.';

    return new Response(
      JSON.stringify({
        success: false,
        fallback_required: true,
        error: errorMessage,
      }),
      {
        status: 503,
        headers: corsHeaders,
      }
    );
  }
}

export async function onRequestOptions(context: { request: Request }): Promise<Response> {
  const corsHeaders = getCorsHeaders(context.request);
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}

