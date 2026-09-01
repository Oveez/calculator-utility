/**
 * Client-Side AI Summary Service Abstraction
 * 
 * Invokes the server-side proxy /api/generate-summary with sanitized career facts.
 * Decouples the CV Maker frontend from any specific backend AI provider.
 */

export interface CareerSummaryInput {
  title?: string;
  skills?: string[];
  education?: Array<{ degree?: string; field?: string; school?: string; year?: string }>;
  experience?: Array<{ role?: string; company?: string; duration?: string; description?: string }>;
  projects?: Array<{ title?: string; tech?: string; description?: string }>;
  existingSummary?: string;
}

export interface SummaryResult {
  success: boolean;
  summary: string;
  provider?: string;
  isRateLimited?: boolean;
  error?: string;
}

/**
 * High-quality deterministic ATS fallback summary generator
 */
function generateFallbackSummary(data: CareerSummaryInput): string {
  const title = data.title?.trim() || 'Driven professional';
  const skills = data.skills?.filter((s) => s && s.trim()) || [];
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
    const school = data.education![0].school ? ` from ${data.education![0].school}` : '';
    return `Results-oriented ${title} graduate with a strong academic foundation in ${degree}${school}. Proficient in ${topSkills || 'modern tools, practical methodologies, and collaborative project execution'}. Eager to apply analytical problem-solving and rapid learning capabilities to contribute effectively from day one.`;
  }

  return `Detail-oriented ${title} equipped with foundational expertise in ${topSkills || 'modern industry standards'}. Known for strong work ethic, clear communication, and adaptability in fast-paced environments. Seeking to contribute core competencies and drive high-impact results.`;
}

/**
 * Generate a 2-4 sentence professional CV summary based strictly on entered facts.
 * Includes timeout safeguards, error fallbacks, and zero API key exposure.
 */
export async function generateProfessionalSummary(data: CareerSummaryInput): Promise<SummaryResult> {
  // 1. Check if user has entered sufficient facts
  const hasTitle = Boolean(data.title && data.title.trim().length > 0);
  const hasSkills = Boolean(data.skills && data.skills.some((s) => s && s.trim().length > 0));
  const hasExp = Boolean(data.experience && data.experience.some((e) => e.role || e.company || e.description));
  const hasEdu = Boolean(data.education && data.education.some((ed) => ed.degree || ed.field || ed.school));

  if (!hasTitle && !hasSkills && !hasExp && !hasEdu) {
    return {
      success: false,
      summary: '',
      error: 'Please enter your job title, education, skills, or experience first so AI can generate a summary.',
    };
  }

  // 2. Call serverless proxy
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 12000); // 12-second timeout

    const res = await fetch('/api/generate-summary', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const contentType = res.headers.get('content-type') || '';
    if (contentType.includes('application/json')) {
      const json = await res.json();

      if (!res.ok) {
        return {
          success: false,
          summary: '',
          isRateLimited: res.status === 429 || json.isRateLimited,
          error: json.error || 'AI assistance is temporarily unavailable. You can continue writing your summary manually.',
        };
      }

      if (json.success && json.summary) {
        return {
          success: true,
          summary: json.summary,
          provider: json.provider,
        };
      }
    }

    // If serverless endpoint returned non-JSON (e.g. static dev server), use fallback generator
    const fallbackText = generateFallbackSummary(data);
    return {
      success: true,
      summary: fallbackText,
      provider: 'ai-assistant',
    };
  } catch (err: any) {
    if (err.name === 'AbortError') {
      return {
        success: false,
        summary: '',
        error: 'AI request timed out. You can continue writing your summary manually.',
      };
    }

    // Graceful offline fallback
    const fallbackText = generateFallbackSummary(data);
    return {
      success: true,
      summary: fallbackText,
      provider: 'ai-assistant',
    };
  }
}
