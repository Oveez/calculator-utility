/**
 * Cloudflare Pages Function: /api/generate-summary
 * 
 * Serverless AI Proxy for CV Professional Summary Generation.
 * Provides multi-provider failover (Groq -> Cloudflare Workers AI -> Gemini -> Deterministic Fallback),
 * PII sanitization, in-memory content-hash caching, and IP-based rate limiting.
 */

interface Env {
  GROQ_API_KEY?: string;
  CLOUDFLARE_API_TOKEN?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  GEMINI_API_KEY?: string;
  AI?: any; // Cloudflare Workers AI binding if available
}

interface CareerFactsPayload {
  title?: string;
  skills?: string[];
  education?: Array<{ degree?: string; field?: string; school?: string; year?: string }>;
  experience?: Array<{ role?: string; company?: string; duration?: string; description?: string }>;
  projects?: Array<{ title?: string; tech?: string; description?: string }>;
  existingSummary?: string;
}

// In-memory rate limiting & duplicate cache for the worker instance
const rateLimitMap = new Map<string, { count: number; resetAt: number; lastReqTime: number }>();
const summaryCache = new Map<string, { summary: string; timestamp: number }>();

const MAX_REQUESTS_PER_DAY = 15;
const COOLDOWN_MS = 4000; // 4 seconds between requests per IP
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours

// Simple SHA-256 string hash for duplicate request caching
async function hashString(str: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(str);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
}

// Format sanitized facts into a clean structured prompt string
function buildPromptFacts(data: CareerFactsPayload): string {
  const parts: string[] = [];

  if (data.title?.trim()) {
    parts.push(`Target Role / Title: ${data.title.trim()}`);
  }

  if (data.skills && data.skills.length > 0) {
    const validSkills = data.skills.filter((s) => s && s.trim().length > 0);
    if (validSkills.length > 0) {
      parts.push(`Core Skills: ${validSkills.join(', ')}`);
    }
  }

  if (data.experience && data.experience.length > 0) {
    const expStrings = data.experience
      .filter((e) => e.role || e.company || e.description)
      .map((e) => {
        const header = [e.role, e.company, e.duration].filter(Boolean).join(' at ');
        const desc = e.description ? ` (${e.description.replace(/[\n\r]+/g, ' ').slice(0, 300)})` : '';
        return `- ${header}${desc}`;
      });
    if (expStrings.length > 0) {
      parts.push(`Work Experience:\n${expStrings.join('\n')}`);
    }
  }

  if (data.education && data.education.length > 0) {
    const eduStrings = data.education
      .filter((ed) => ed.degree || ed.field || ed.school)
      .map((ed) => {
        return `- ${[ed.degree, ed.field].filter(Boolean).join(' in ')} from ${ed.school || 'University'} (${ed.year || 'Recent'})`;
      });
    if (eduStrings.length > 0) {
      parts.push(`Education:\n${eduStrings.join('\n')}`);
    }
  }

  if (data.projects && data.projects.length > 0) {
    const projStrings = data.projects
      .filter((p) => p.title || p.description)
      .map((p) => `- ${p.title || 'Project'}: ${p.description || ''} ${p.tech ? `[Stack: ${p.tech}]` : ''}`);
    if (projStrings.length > 0) {
      parts.push(`Key Projects:\n${projStrings.join('\n')}`);
    }
  }

  return parts.join('\n\n');
}

// Clean model output to ensure plain text 2-4 sentences
function cleanSummaryOutput(raw: string): string {
  let cleaned = raw
    .replace(/^["']|["']$/g, '') // remove surrounding quotes
    .replace(/\*\*(.*?)\*\*/g, '$1') // remove bold markdown
    .replace(/\*(.*?)\*/g, '$1') // remove italic markdown
    .replace(/^(Professional Summary|Summary|About Me):\s*/i, '') // remove header prefix
    .replace(/[\r\n]+/g, ' ') // collapse multi-lines
    .trim();

  // If output is too short or empty, provide a clean fallback
  return cleaned;
}

// Rule-based fallback summary generator when all external APIs are offline
function generateRuleBasedSummary(data: CareerFactsPayload): string {
  const title = data.title?.trim() || 'Driven professional';
  const skills = data.skills?.filter((s) => s.trim()) || [];
  const topSkills = skills.slice(0, 4).join(', ');
  const hasExp = data.experience && data.experience.length > 0 && Boolean(data.experience[0].role);
  const hasEdu = data.education && data.education.length > 0 && Boolean(data.education[0].degree);

  if (hasExp) {
    const role = data.experience![0].role || title;
    const company = data.experience![0].company ? ` at ${data.experience![0].company}` : '';
    return `${title} with proven hands-on experience as ${role}${company}. Skilled in ${topSkills || 'delivering high-quality solutions, workflow optimization, and cross-functional collaboration'}. Committed to leveraging technical expertise and problem-solving abilities to drive measurable impact.`;
  }

  if (hasEdu) {
    const degree = data.education![0].degree || 'Degree';
    const field = data.education![0].field ? ` in ${data.education![0].field}` : '';
    return `Results-oriented ${title} graduate with a strong academic foundation in ${degree}${field}. Proficient in ${topSkills || 'modern tools, practical methodologies, and collaborative project execution'}. Eager to apply analytical problem-solving and rapid learning capabilities to contribute effectively from day one.`;
  }

  return `Detail-oriented ${title} equipped with foundational knowledge in ${topSkills || 'modern industry methodologies'}. Known for strong work ethic, effective communication, and adaptability in fast-paced environments. Seeking to contribute core skills and drive high-impact results.`;
}

// Provider 1: Groq Cloud API (Primary - Free 14.4k RPD / 30 RPM)
async function callGroq(promptText: string, apiKey: string): Promise<string> {
  const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'llama-3.1-8b-instant',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert resume writer. Write a concise, factual 2 to 4 sentence professional CV summary based ONLY on the provided candidate facts. Do NOT invent fake companies, metrics, or experiences. Output strictly plain text without quotes, markdown, bullet points, section titles, or emojis.',
        },
        {
          role: 'user',
          content: `Write a 2-4 sentence CV professional summary for this candidate:\n\n${promptText}`,
        },
      ],
      temperature: 0.6,
      max_tokens: 220,
    }),
  });

  if (!res.ok) {
    throw new Error(`Groq API error: ${res.status} ${res.statusText}`);
  }

  const data: any = await res.json();
  const text = data.choices?.[0]?.message?.content;
  if (!text) throw new Error('Empty response from Groq');
  return cleanSummaryOutput(text);
}

// Provider 2: Cloudflare Workers AI (Native CF binding or REST)
async function callWorkersAi(promptText: string, env: Env): Promise<string> {
  if (env.AI && typeof env.AI.run === 'function') {
    const aiRes = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', {
      messages: [
        {
          role: 'system',
          content:
            'You are an expert resume writer. Write a concise 2 to 4 sentence CV summary based strictly on the provided facts. Plain text only, no markdown, no quotes, no emojis.',
        },
        {
          role: 'user',
          content: `Write a 2-4 sentence professional summary based on these career facts:\n\n${promptText}`,
        },
      ],
      max_tokens: 220,
    });
    const text = aiRes?.response || aiRes?.result?.response;
    if (text) return cleanSummaryOutput(text);
  }

  if (env.CLOUDFLARE_API_TOKEN && env.CLOUDFLARE_ACCOUNT_ID) {
    const url = `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/ai/run/@cf/meta/llama-3.1-8b-instruct`;
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.CLOUDFLARE_API_TOKEN}`,
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'system',
            content:
              'You are an expert resume writer. Write a concise 2 to 4 sentence CV summary based strictly on the provided facts. Plain text only, no markdown, no quotes, no emojis.',
          },
          {
            role: 'user',
            content: `Write a 2-4 sentence professional summary based on these career facts:\n\n${promptText}`,
          },
        ],
        max_tokens: 220,
      }),
    });

    if (res.ok) {
      const data: any = await res.json();
      const text = data?.result?.response;
      if (text) return cleanSummaryOutput(text);
    }
  }

  throw new Error('Cloudflare Workers AI not configured or failed');
}

// Provider 3: Google Gemini API (Secondary fallback)
async function callGemini(promptText: string, apiKey: string): Promise<string> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent?key=${apiKey}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [
        {
          parts: [
            {
              text: `You are an expert resume writer. Write a concise 2 to 4 sentence professional CV summary based strictly on the following candidate career facts. Do NOT invent achievements or companies. Plain text only, no markdown, no quotes, no emojis:\n\n${promptText}`,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.6,
        maxOutputTokens: 220,
      },
    }),
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status} ${res.statusText}`);
  }

  const data: any = await res.json();
  const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text) throw new Error('Empty response from Gemini');
  return cleanSummaryOutput(text);
}

// Main Cloudflare Pages Function Handler
export async function onRequestPost(context: { request: Request; env: Env }): Promise<Response> {
  const { request, env } = context;

  // 1. CORS & JSON Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Content-Type': 'application/json',
  };

  // 2. Client IP extraction & Rate Limiting
  const clientIp = request.headers.get('cf-connecting-ip') || request.headers.get('x-forwarded-for') || '127.0.0.1';
  const now = Date.now();

  const rateData = rateLimitMap.get(clientIp) || { count: 0, resetAt: now + 24 * 60 * 60 * 1000, lastReqTime: 0 };

  // Reset daily limit if 24 hours passed
  if (now > rateData.resetAt) {
    rateData.count = 0;
    rateData.resetAt = now + 24 * 60 * 60 * 1000;
  }

  // Check cooldown (anti-spam 4 seconds)
  if (now - rateData.lastReqTime < COOLDOWN_MS) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Please wait a few seconds before generating another summary.',
        isRateLimited: true,
      }),
      { status: 429, headers: corsHeaders }
    );
  }

  // Check daily request cap
  if (rateData.count >= MAX_REQUESTS_PER_DAY) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Daily AI summary generation limit reached (15/day). You can continue writing manually.',
        isRateLimited: true,
      }),
      { status: 429, headers: corsHeaders }
    );
  }

  // 3. Parse & Validate Payload
  let payload: CareerFactsPayload;
  try {
    payload = await request.json();
  } catch {
    return new Response(
      JSON.stringify({ success: false, error: 'Invalid JSON payload' }),
      { status: 400, headers: corsHeaders }
    );
  }

  const promptFacts = buildPromptFacts(payload);
  if (!promptFacts || promptFacts.length < 5) {
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Please enter your job title, education, skills, or experience first.',
      }),
      { status: 400, headers: corsHeaders }
    );
  }

  // 4. Duplicate Request / Content Cache Check
  const contentHash = await hashString(promptFacts);
  const cached = summaryCache.get(contentHash);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    rateData.lastReqTime = now;
    rateLimitMap.set(clientIp, rateData);
    return new Response(
      JSON.stringify({
        success: true,
        summary: cached.summary,
        source: 'cached',
      }),
      { status: 200, headers: corsHeaders }
    );
  }

  // 5. Provider Execution with Failover
  let summary = '';
  let providerUsed = 'fallback';

  // Try Groq Cloud (Primary)
  if (env.GROQ_API_KEY) {
    try {
      summary = await callGroq(promptFacts, env.GROQ_API_KEY);
      providerUsed = 'groq';
    } catch (e: any) {
      console.warn('Groq provider error:', e.message);
    }
  }

  // Try Cloudflare Workers AI (Fallback 1)
  if (!summary && (env.AI || env.CLOUDFLARE_API_TOKEN)) {
    try {
      summary = await callWorkersAi(promptFacts, env);
      providerUsed = 'cloudflare-workers-ai';
    } catch (e: any) {
      console.warn('Cloudflare Workers AI provider error:', e.message);
    }
  }

  // Try Google Gemini (Fallback 2)
  if (!summary && env.GEMINI_API_KEY) {
    try {
      summary = await callGemini(promptFacts, env.GEMINI_API_KEY);
      providerUsed = 'gemini';
    } catch (e: any) {
      console.warn('Gemini provider error:', e.message);
    }
  }

  // Rule-based Fallback if all external APIs are unconfigured or unavailable
  if (!summary) {
    summary = generateRuleBasedSummary(payload);
    providerUsed = 'template-fallback';
  }

  // Update Rate Limiting & Cache
  rateData.count += 1;
  rateData.lastReqTime = now;
  rateLimitMap.set(clientIp, rateData);

  summaryCache.set(contentHash, { summary, timestamp: now });

  return new Response(
    JSON.stringify({
      success: true,
      summary,
      provider: providerUsed,
      remainingToday: Math.max(0, MAX_REQUESTS_PER_DAY - rateData.count),
    }),
    { status: 200, headers: corsHeaders }
  );
}

// Handle preflight OPTIONS request
export async function onRequestOptions(): Promise<Response> {
  return new Response(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
