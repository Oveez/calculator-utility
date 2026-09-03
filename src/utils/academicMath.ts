export interface AttendanceResult {
  currentPercentage: number;
  attended: number;
  total: number;
  targetPercentage: number;
  classesCanMiss: number;
  classesMustAttend: number;
  projectedNextAttended: number;
  projectedNextMissed: number;
  scenarios: Array<{
    target: number;
    classesCanMiss: number;
    classesMustAttend: number;
    status: 'met' | 'shortage';
  }>;
}

export function calculateAttendance(attended: number, total: number, targetPercentage = 75): AttendanceResult {
  const safeAttended = Math.max(0, Math.floor(attended || 0));
  const safeTotal = Math.max(safeAttended, Math.floor(total || 0));
  const target = Math.min(100, Math.max(1, targetPercentage || 75));
  const targetFraction = target / 100;

  const currentPercentage = safeTotal === 0 ? 100 : (safeAttended / safeTotal) * 100;

  // Classes can miss while staying >= target%:
  // safeAttended / (safeTotal + Y) >= targetFraction => safeTotal + Y <= safeAttended / targetFraction => Y <= (safeAttended / targetFraction) - safeTotal
  let classesCanMiss = 0;
  if (currentPercentage >= target) {
    classesCanMiss = Math.max(0, Math.floor((safeAttended / targetFraction) - safeTotal));
  }

  // Classes must attend sequentially to reach target%:
  // (safeAttended + X) / (safeTotal + X) >= targetFraction => safeAttended + X >= targetFraction * safeTotal + targetFraction * X
  // X * (1 - targetFraction) >= targetFraction * safeTotal - safeAttended
  // X >= (targetFraction * safeTotal - safeAttended) / (1 - targetFraction)
  let classesMustAttend = 0;
  if (currentPercentage < target) {
    if (targetFraction >= 1) {
      classesMustAttend = safeTotal - safeAttended > 0 ? 999 : 0; // Impossible if any missed class
    } else {
      const needed = Math.ceil((targetFraction * safeTotal - safeAttended) / (1 - targetFraction));
      classesMustAttend = Math.max(0, needed);
    }
  }

  const projectedNextAttended = safeTotal === 0 ? 100 : ((safeAttended + 1) / (safeTotal + 1)) * 100;
  const projectedNextMissed = safeTotal === 0 ? 0 : (safeAttended / (safeTotal + 1)) * 100;

  const targetList = [75, 80, 85, 90];
  const scenarios = targetList.map((t) => {
    const tFraction = t / 100;
    let canMiss = 0;
    let mustAttend = 0;

    if (currentPercentage >= t) {
      canMiss = Math.max(0, Math.floor((safeAttended / tFraction) - safeTotal));
    } else {
      if (tFraction >= 1) {
        mustAttend = safeTotal - safeAttended > 0 ? 999 : 0;
      } else {
        mustAttend = Math.max(0, Math.ceil((tFraction * safeTotal - safeAttended) / (1 - tFraction)));
      }
    }

    return {
      target: t,
      classesCanMiss: canMiss,
      classesMustAttend: mustAttend,
      status: currentPercentage >= t ? ('met' as const) : ('shortage' as const),
    };
  });

  return {
    currentPercentage: Math.round(currentPercentage * 100) / 100,
    attended: safeAttended,
    total: safeTotal,
    targetPercentage: target,
    classesCanMiss,
    classesMustAttend,
    projectedNextAttended: Math.round(projectedNextAttended * 100) / 100,
    projectedNextMissed: Math.round(projectedNextMissed * 100) / 100,
    scenarios,
  };
}

export interface BunkResult {
  attended: number;
  total: number;
  targetPercentage: number;
  currentPercentage: number;
  safeBunksRemaining: number;
  classesToRecover: number;
  status: 'safe' | 'warning' | 'danger';
  statusText: string;
  nextBunkPercentage: number;
}

export function calculateBunk(attended: number, total: number, targetPercentage = 75): BunkResult {
  const att = calculateAttendance(attended, total, targetPercentage);
  const nextBunkPercentage = att.projectedNextMissed;

  let status: 'safe' | 'warning' | 'danger' = 'safe';
  let statusText = 'Safe to bunk! You are well above your target.';

  if (att.currentPercentage < targetPercentage) {
    status = 'danger';
    statusText = `Attendance shortage! You need to attend ${att.classesMustAttend} consecutive class${att.classesMustAttend === 1 ? '' : 'es'} without missing.`;
  } else if (att.classesCanMiss === 0) {
    status = 'warning';
    statusText = 'On the edge! Bunking the next class will drop you below your target.';
  } else if (att.classesCanMiss <= 2) {
    status = 'warning';
    statusText = `Caution: You have only ${att.classesCanMiss} bunk${att.classesCanMiss === 1 ? '' : 's'} available before entering shortage.`;
  }

  return {
    attended: att.attended,
    total: att.total,
    targetPercentage,
    currentPercentage: att.currentPercentage,
    safeBunksRemaining: att.classesCanMiss,
    classesToRecover: att.classesMustAttend,
    status,
    statusText,
    nextBunkPercentage,
  };
}

export interface FinalGradeResult {
  currentGrade: number;
  targetGrade: number;
  finalExamWeight: number;
  requiredScore: number;
  isPossible: boolean;
  difficulty: 'Very Easy' | 'Manageable' | 'Challenging' | 'Extreme (>95%)' | 'Impossible (>100%)';
  whatIfTable: Array<{ examScore: number; finalCourseGrade: number }>;
}

export function calculateFinalGrade(currentGrade: number, targetGrade: number, finalExamWeight: number): FinalGradeResult {
  const current = Math.max(0, currentGrade || 0);
  const target = Math.max(0, targetGrade || 0);
  const weight = Math.min(100, Math.max(1, finalExamWeight || 1));
  const weightFraction = weight / 100;
  const currentWeightFraction = 1 - weightFraction;

  // target = (current * (1 - w)) + (required * w)
  // required * w = target - (current * (1 - w))
  // required = (target - (current * (1 - w))) / w
  const required = (target - (current * currentWeightFraction)) / weightFraction;
  const roundedRequired = Math.round(required * 100) / 100;

  let difficulty: FinalGradeResult['difficulty'] = 'Manageable';
  if (roundedRequired <= 50) difficulty = 'Very Easy';
  else if (roundedRequired <= 80) difficulty = 'Manageable';
  else if (roundedRequired <= 95) difficulty = 'Challenging';
  else if (roundedRequired <= 100) difficulty = 'Extreme (>95%)';
  else difficulty = 'Impossible (>100%)';

  const whatIfScores = [50, 60, 70, 80, 90, 100];
  const whatIfTable = whatIfScores.map((score) => {
    const courseGrade = (current * currentWeightFraction) + (score * weightFraction);
    return {
      examScore: score,
      finalCourseGrade: Math.round(courseGrade * 100) / 100,
    };
  });

  return {
    currentGrade: current,
    targetGrade: target,
    finalExamWeight: weight,
    requiredScore: roundedRequired,
    isPossible: roundedRequired <= 100,
    difficulty,
    whatIfTable,
  };
}

export interface GradeNeededResult {
  currentScore: number;
  currentWeight: number;
  targetGrade: number;
  remainingWeight: number;
  requiredPercentage: number;
  pointsNeeded: number;
  letterEquivalent: string;
}

export function calculateGradeNeeded(
  currentScore: number,
  currentWeight: number,
  targetGrade: number,
  remainingWeight?: number
): GradeNeededResult {
  const currScore = Math.max(0, currentScore || 0);
  const currWeight = Math.min(100, Math.max(1, currentWeight || 50));
  const remWeight = remainingWeight ?? Math.max(1, 100 - currWeight);
  const target = Math.max(0, targetGrade || 90);

  const currentPointsEarned = (currScore / 100) * currWeight;
  const totalTargetPoints = (target / 100) * (currWeight + remWeight);
  const pointsNeeded = Math.max(0, totalTargetPoints - currentPointsEarned);
  const requiredPercentage = remWeight > 0 ? (pointsNeeded / remWeight) * 100 : 0;

  let letterEquivalent = 'F';
  if (requiredPercentage >= 93) letterEquivalent = 'A';
  else if (requiredPercentage >= 90) letterEquivalent = 'A-';
  else if (requiredPercentage >= 87) letterEquivalent = 'B+';
  else if (requiredPercentage >= 83) letterEquivalent = 'B';
  else if (requiredPercentage >= 80) letterEquivalent = 'B-';
  else if (requiredPercentage >= 77) letterEquivalent = 'C+';
  else if (requiredPercentage >= 73) letterEquivalent = 'C';
  else if (requiredPercentage >= 70) letterEquivalent = 'C-';
  else if (requiredPercentage >= 60) letterEquivalent = 'D';

  return {
    currentScore: currScore,
    currentWeight: currWeight,
    targetGrade: target,
    remainingWeight: remWeight,
    requiredPercentage: Math.round(requiredPercentage * 100) / 100,
    pointsNeeded: Math.round(pointsNeeded * 100) / 100,
    letterEquivalent,
  };
}

export interface CourseGradeEntry {
  name: string;
  credits: number;
  gradePoints: number; // 4.0, 3.7, etc.
}

export const GRADE_POINT_MAP: Record<string, number> = {
  'A+': 4.0,
  A: 4.0,
  'A-': 3.7,
  'B+': 3.3,
  B: 3.0,
  'B-': 2.7,
  'C+': 2.3,
  C: 2.0,
  'C-': 1.7,
  'D+': 1.3,
  D: 1.0,
  F: 0.0,
};

export interface SemesterGpaResult {
  semesterGpa: number;
  totalSemesterCredits: number;
  totalQualityPoints: number;
  cumulativeGpa?: number;
  totalCumulativeCredits?: number;
}

export function calculateSemesterGpa(
  courses: CourseGradeEntry[],
  priorCredits = 0,
  priorGpa = 0
): SemesterGpaResult {
  let totalCredits = 0;
  let totalQualityPoints = 0;

  courses.forEach((c) => {
    const cred = Math.max(0, c.credits || 0);
    const pts = Math.max(0, c.gradePoints || 0);
    totalCredits += cred;
    totalQualityPoints += cred * pts;
  });

  const semesterGpa = totalCredits > 0 ? totalQualityPoints / totalCredits : 0;

  let cumulativeGpa: number | undefined;
  let totalCumulativeCredits: number | undefined;

  if (priorCredits > 0) {
    const priorQualityPoints = priorCredits * priorGpa;
    const combinedCredits = priorCredits + totalCredits;
    const combinedPoints = priorQualityPoints + totalQualityPoints;
    cumulativeGpa = combinedCredits > 0 ? combinedPoints / combinedCredits : 0;
    totalCumulativeCredits = combinedCredits;
  }

  return {
    semesterGpa: Math.round(semesterGpa * 100) / 100,
    totalSemesterCredits: totalCredits,
    totalQualityPoints: Math.round(totalQualityPoints * 100) / 100,
    cumulativeGpa: cumulativeGpa !== undefined ? Math.round(cumulativeGpa * 100) / 100 : undefined,
    totalCumulativeCredits,
  };
}

export interface CreditHourResult {
  totalCredits: number;
  lectureHoursPerWeek: number;
  labHoursPerWeek: number;
  outsideStudyHoursPerWeek: number;
  totalWeeklyAcademicTime: number;
  degreeCompletionPercentage: number;
  remainingCredits: number;
  estimatedSemestersRemaining: number;
}

export function calculateCreditHours(
  _coursesCount: number,
  lectureCredits: number,
  labCredits = 0,
  degreeTotal = 120,
  completedCredits = 0
): CreditHourResult {
  const totalSemesterCredits = Math.max(0, lectureCredits + labCredits);
  const lectureHours = lectureCredits; // 1 credit = 1 contact hour/week
  const labHours = labCredits * 2.5; // Standard lab = 2-3 hours per credit
  const studyHours = lectureCredits * 2.5; // Carnegie unit standard: 2-3 hours outside study per lecture credit
  const totalWeeklyTime = lectureHours + labHours + studyHours;

  const totalDeg = Math.max(1, degreeTotal || 120);
  const completed = Math.max(0, Math.min(totalDeg, completedCredits || 0));
  const remaining = Math.max(0, totalDeg - completed);
  const completionPct = (completed / totalDeg) * 100;
  const semPace = Math.max(1, totalSemesterCredits || 15);
  const semRemaining = Math.ceil(remaining / semPace);

  return {
    totalCredits: totalSemesterCredits,
    lectureHoursPerWeek: Math.round(lectureHours * 10) / 10,
    labHoursPerWeek: Math.round(labHours * 10) / 10,
    outsideStudyHoursPerWeek: Math.round(studyHours * 10) / 10,
    totalWeeklyAcademicTime: Math.round(totalWeeklyTime * 10) / 10,
    degreeCompletionPercentage: Math.round(completionPct * 10) / 10,
    remainingCredits: remaining,
    estimatedSemestersRemaining: semRemaining,
  };
}

export interface StudyHoursResult {
  recommendedWeeklyStudyHours: number;
  recommendedDailyStudyHours: number;
  weekdayStudyHours: number;
  weekendDailyStudyHours: number;
  totalCommittedHours: number;
  freeHoursRemaining: number;
  feasibilityRating: 'Balanced' | 'Busy' | 'Heavy / High Stress' | 'Unsustainable (>168 hrs)';
}

export function calculateStudyHours(
  enrolledCredits: number,
  difficultyLevel: 'intro' | 'moderate' | 'challenging' | 'stem_heavy' = 'moderate',
  targetGpa: 'pass' | 'b_average' | 'a_average' = 'b_average',
  workHoursPerWeek = 0,
  sleepHoursPerDay = 8,
  commuteAndChoresWeekly = 10
): StudyHoursResult {
  const credits = Math.max(1, enrolledCredits || 15);

  let difficultyMultiplier = 2.0; // 2 hrs per credit
  if (difficultyLevel === 'intro') difficultyMultiplier = 1.5;
  else if (difficultyLevel === 'moderate') difficultyMultiplier = 2.0;
  else if (difficultyLevel === 'challenging') difficultyMultiplier = 2.75;
  else if (difficultyLevel === 'stem_heavy') difficultyMultiplier = 3.5;

  let gpaMultiplier = 1.0;
  if (targetGpa === 'pass') gpaMultiplier = 0.8;
  else if (targetGpa === 'b_average') gpaMultiplier = 1.0;
  else if (targetGpa === 'a_average') gpaMultiplier = 1.25;

  const weeklyStudy = Math.round(credits * difficultyMultiplier * gpaMultiplier * 10) / 10;
  const dailyAverage = Math.round((weeklyStudy / 7) * 10) / 10;
  const weekdayHours = Math.round(((weeklyStudy * 0.7) / 5) * 10) / 10;
  const weekendDaily = Math.round(((weeklyStudy * 0.3) / 2) * 10) / 10;

  const weeklySleep = Math.max(0, sleepHoursPerDay || 8) * 7;
  const weeklyClassContact = credits; // ~1 hr per credit in class
  const totalCommitments = weeklyStudy + weeklyClassContact + Math.max(0, workHoursPerWeek) + weeklySleep + Math.max(0, commuteAndChoresWeekly);
  const freeHours = Math.max(0, 168 - totalCommitments);

  let feasibilityRating: StudyHoursResult['feasibilityRating'] = 'Balanced';
  if (totalCommitments > 168) feasibilityRating = 'Unsustainable (>168 hrs)';
  else if (freeHours < 15) feasibilityRating = 'Heavy / High Stress';
  else if (freeHours < 35) feasibilityRating = 'Busy';
  else feasibilityRating = 'Balanced';

  return {
    recommendedWeeklyStudyHours: weeklyStudy,
    recommendedDailyStudyHours: dailyAverage,
    weekdayStudyHours: weekdayHours,
    weekendDailyStudyHours: weekendDaily,
    totalCommittedHours: Math.round(totalCommitments * 10) / 10,
    freeHoursRemaining: Math.round(freeHours * 10) / 10,
    feasibilityRating,
  };
}
