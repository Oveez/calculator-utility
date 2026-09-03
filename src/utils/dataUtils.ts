/**
 * Pure TypeScript Data & CSV Utility Functions
 * Zero-dependency, client-side algorithms for CSV/JSON conversion, column extraction, deduplication, sorting, filtering, and Markdown tables.
 */

export interface CsvParseResult {
  headers: string[];
  rows: string[][];
  delimiter: string;
}

export function autoDetectDelimiter(csvText: string): string {
  const firstLines = csvText.split('\n').slice(0, 5).join('\n');
  const counts = {
    ',': (firstLines.match(/,/g) || []).length,
    ';': (firstLines.match(/;/g) || []).length,
    '\t': (firstLines.match(/\t/g) || []).length,
    '|': (firstLines.match(/\|/g) || []).length,
  };
  let maxDelim = ',';
  let maxCount = -1;
  for (const [delim, count] of Object.entries(counts)) {
    if (count > maxCount) {
      maxCount = count;
      maxDelim = delim;
    }
  }
  return maxDelim;
}

export function parseCsv(csvText: string, customDelimiter?: string): CsvParseResult {
  const delimiter = customDelimiter || autoDetectDelimiter(csvText);
  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentVal = '';
  let inQuotes = false;

  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    const nextChar = csvText[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === delimiter && !inQuotes) {
      currentRow.push(currentVal);
      currentVal = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      currentRow.push(currentVal);
      if (currentRow.some(c => c.trim().length > 0)) {
        rows.push(currentRow);
      }
      currentRow = [];
      currentVal = '';
    } else {
      currentVal += char;
    }
  }

  if (currentVal.length > 0 || currentRow.length > 0) {
    currentRow.push(currentVal);
    if (currentRow.some(c => c.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  const headers = rows.length > 0 ? rows[0] : [];
  const dataRows = rows.length > 1 ? rows.slice(1) : [];

  return { headers, rows: dataRows, delimiter };
}

export function csvToJson(csvText: string, customDelimiter?: string): any[] {
  const { headers, rows } = parseCsv(csvText, customDelimiter);
  if (!headers || headers.length === 0) return [];

  return rows.map(row => {
    const obj: Record<string, any> = {};
    headers.forEach((h, idx) => {
      const val = row[idx] !== undefined ? row[idx].trim() : '';
      if (/^-?\d+(\.\d+)?$/.test(val)) {
        obj[h] = parseFloat(val);
      } else if (val.toLowerCase() === 'true') {
        obj[h] = true;
      } else if (val.toLowerCase() === 'false') {
        obj[h] = false;
      } else {
        obj[h] = val;
      }
    });
    return obj;
  });
}

export function jsonToCsv(jsonArray: any[], delimiter = ','): string {
  if (!Array.isArray(jsonArray) || jsonArray.length === 0) return '';
  const keys = Array.from(
    new Set(jsonArray.flatMap(item => (typeof item === 'object' && item !== null ? Object.keys(item) : [])))
  );

  const escapeVal = (v: any) => {
    if (v === null || v === undefined) return '';
    const str = typeof v === 'object' ? JSON.stringify(v) : String(v);
    if (str.includes(delimiter) || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = keys.map(escapeVal).join(delimiter);
  const rowLines = jsonArray.map(item => {
    return keys.map(k => escapeVal(item[k])).join(delimiter);
  });

  return [headerLine, ...rowLines].join('\n');
}

export function csvToMarkdown(csvText: string, customDelimiter?: string): string {
  const { headers, rows } = parseCsv(csvText, customDelimiter);
  if (headers.length === 0) return '';

  const headerLine = `| ${headers.join(' | ')} |`;
  const separatorLine = `| ${headers.map(() => '---').join(' | ')} |`;
  const dataLines = rows.map(r => `| ${r.map(c => c.replace(/\|/g, '\\|')).join(' | ')} |`);

  return [headerLine, separatorLine, ...dataLines].join('\n');
}
