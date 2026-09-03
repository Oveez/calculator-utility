/**
 * Pure TypeScript Education & Classroom Utilities
 * Random student selection, group partitioning, team formation, and seating chart grid matrix.
 */

export function shuffleArray<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function divideIntoGroups(names: string[], groupCount: number): string[][] {
  const shuffled = shuffleArray(names.filter(n => n.trim().length > 0));
  const groups: string[][] = Array.from({ length: Math.max(1, groupCount) }, () => []);
  
  shuffled.forEach((name, idx) => {
    groups[idx % groupCount].push(name);
  });

  return groups;
}

export function divideByGroupSize(names: string[], sizePerGroup: number): string[][] {
  const shuffled = shuffleArray(names.filter(n => n.trim().length > 0));
  const size = Math.max(1, sizePerGroup);
  const groups: string[][] = [];
  
  for (let i = 0; i < shuffled.length; i += size) {
    groups.push(shuffled.slice(i, i + size));
  }
  return groups;
}

export interface SeatingCell {
  row: number;
  col: number;
  studentName?: string;
  isBlocked?: boolean;
  isFixed?: boolean;
}

export function generateSeatingChart(
  students: string[],
  rows: number,
  cols: number,
  blockedCoords: { row: number; col: number }[] = [],
  fixedStudents: { name: string; row: number; col: number }[] = []
): SeatingCell[][] {
  const grid: SeatingCell[][] = [];
  const blockedSet = new Set(blockedCoords.map(c => `${c.row},${c.col}`));
  const fixedMap = new Map(fixedStudents.map(f => [`${f.row},${f.col}`, f.name]));
  const fixedNameSet = new Set(fixedStudents.map(f => f.name));

  const availableStudents = shuffleArray(
    students.filter(s => s.trim().length > 0 && !fixedNameSet.has(s))
  );

  let studentIdx = 0;

  for (let r = 0; r < rows; r++) {
    const rowCells: SeatingCell[] = [];
    for (let c = 0; c < cols; c++) {
      const key = `${r},${c}`;
      if (blockedSet.has(key)) {
        rowCells.push({ row: r, col: c, isBlocked: true });
      } else if (fixedMap.has(key)) {
        rowCells.push({ row: r, col: c, studentName: fixedMap.get(key), isFixed: true });
      } else if (studentIdx < availableStudents.length) {
        rowCells.push({ row: r, col: c, studentName: availableStudents[studentIdx++] });
      } else {
        rowCells.push({ row: r, col: c });
      }
    }
    grid.push(rowCells);
  }

  return grid;
}
