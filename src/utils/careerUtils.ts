/**
 * Pure TypeScript Career & Resume Utilities
 * Local ATS keyword extraction, tokenization, frequency analysis, and resume match scoring.
 */

const STOP_WORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are',
  'as', 'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but',
  'by', 'could', 'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from',
  'further', 'had', 'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him',
  'himself', 'his', 'how', 'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me',
  'more', 'most', 'my', 'myself', 'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or',
  'other', 'ought', 'our', 'ours', 'ourselves', 'out', 'over', 'own', 'same', 'she', 'should',
  'so', 'some', 'such', 'than', 'that', 'the', 'their', 'theirs', 'them', 'themselves', 'then',
  'there', 'these', 'they', 'this', 'those', 'through', 'to', 'too', 'under', 'until', 'up',
  'very', 'was', 'we', 'were', 'what', 'when', 'where', 'which', 'while', 'who', 'whom', 'why',
  'with', 'would', 'you', 'your', 'yours', 'yourself', 'yourselves', 'will', 'can', 'must'
]);

export function extractKeywords(text: string): { word: string; count: number }[] {
  const clean = text.toLowerCase().replace(/[^\w\s\-\+\#\.]/g, ' ');
  const tokens = clean.split(/\s+/).filter(t => t.length > 2 && !STOP_WORDS.has(t));
  
  const freqMap: Record<string, number> = {};
  tokens.forEach(t => {
    freqMap[t] = (freqMap[t] || 0) + 1;
  });

  return Object.entries(freqMap)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);
}

export function matchResumeKeywords(resumeText: string, jobText: string) {
  const jobKeywords = extractKeywords(jobText).slice(0, 40);
  const resumeLower = resumeText.toLowerCase();

  const matched: { word: string; countInJob: number; countInResume: number }[] = [];
  const missing: { word: string; countInJob: number }[] = [];

  jobKeywords.forEach(({ word, count }) => {
    const regex = new RegExp(`\\b${word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    const matchesInResume = (resumeLower.match(regex) || []).length;

    if (matchesInResume > 0) {
      matched.push({ word, countInJob: count, countInResume: matchesInResume });
    } else {
      missing.push({ word, countInJob: count });
    }
  });

  const matchPercentage = jobKeywords.length > 0 
    ? Math.round((matched.length / jobKeywords.length) * 100) 
    : 0;

  return {
    matched,
    missing,
    matchPercentage,
    totalJobKeywords: jobKeywords.length,
  };
}
