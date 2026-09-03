/**
 * Pure TypeScript Text Utilities
 * Text Diff algorithm (Myers), Line Sorter, Deduplication, Sanitization, and Markdown/Slug helpers.
 */

export interface DiffPart {
  value: string;
  added?: boolean;
  removed?: boolean;
}

// Line-by-line diff implementation
export function computeLineDiff(text1: string, text2: string): DiffPart[] {
  const lines1 = text1.split('\n');
  const lines2 = text2.split('\n');
  const result: DiffPart[] = [];

  let i = 0;
  let j = 0;

  while (i < lines1.length || j < lines2.length) {
    if (i < lines1.length && j < lines2.length && lines1[i] === lines2[j]) {
      result.push({ value: lines1[i] });
      i++;
      j++;
    } else {
      // Find matches ahead
      let matchFound = false;
      for (let lookahead = 1; lookahead < 5; lookahead++) {
        if (i + lookahead < lines1.length && lines1[i + lookahead] === lines2[j]) {
          for (let k = 0; k < lookahead; k++) {
            result.push({ value: lines1[i + k], removed: true });
          }
          i += lookahead;
          matchFound = true;
          break;
        }
        if (j + lookahead < lines2.length && lines1[i] === lines2[j + lookahead]) {
          for (let k = 0; k < lookahead; k++) {
            result.push({ value: lines2[j + k], added: true });
          }
          j += lookahead;
          matchFound = true;
          break;
        }
      }

      if (!matchFound) {
        if (i < lines1.length) {
          result.push({ value: lines1[i], removed: true });
          i++;
        }
        if (j < lines2.length) {
          result.push({ value: lines2[j], added: true });
          j++;
        }
      }
    }
  }

  return result;
}

/**
 * Deduplicate lines
 */
export function removeDuplicateLines(text: string, caseSensitive = true, keepOrder = 'first'): string {
  const lines = text.split('\n');
  const seen = new Set<string>();
  const result: string[] = [];

  if (keepOrder === 'last') {
    for (let i = lines.length - 1; i >= 0; i--) {
      const key = caseSensitive ? lines[i] : lines[i].toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.unshift(lines[i]);
      }
    }
  } else {
    for (const line of lines) {
      const key = caseSensitive ? line : line.toLowerCase();
      if (!seen.has(key)) {
        seen.add(key);
        result.push(line);
      }
    }
  }

  return result.join('\n');
}

/**
 * Remove empty lines
 */
export function removeEmptyLines(text: string): string {
  return text.split('\n').filter(line => line.trim().length > 0).join('\n');
}

/**
 * Sort lines
 */
export function sortTextLines(text: string, mode: 'alpha-asc' | 'alpha-desc' | 'num-asc' | 'num-desc' | 'length-asc' | 'length-desc' | 'random'): string {
  const lines = text.split('\n');
  switch (mode) {
    case 'alpha-asc':
      return lines.sort((a, b) => a.localeCompare(b)).join('\n');
    case 'alpha-desc':
      return lines.sort((a, b) => b.localeCompare(a)).join('\n');
    case 'num-asc':
      return lines.sort((a, b) => (parseFloat(a) || 0) - (parseFloat(b) || 0)).join('\n');
    case 'num-desc':
      return lines.sort((a, b) => (parseFloat(b) || 0) - (parseFloat(a) || 0)).join('\n');
    case 'length-asc':
      return lines.sort((a, b) => a.length - b.length).join('\n');
    case 'length-desc':
      return lines.sort((a, b) => b.length - a.length).join('\n');
    case 'random':
      return lines.sort(() => Math.random() - 0.5).join('\n');
    default:
      return text;
  }
}

/**
 * Create URL slug
 */
export function generateSlug(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-') // Replace spaces with -
    .replace(/&/g, '-and-') // Replace & with 'and'
    .replace(/[^\w\-]+/g, '') // Remove all non-word chars
    .replace(/\-\-+/g, '-') // Replace multiple - with single -
    .replace(/^-+/, '') // Trim - from start of text
    .replace(/-+$/, ''); // Trim - from end of text
}
