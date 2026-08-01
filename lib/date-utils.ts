/**
 * Utility functions for Close Ones & Important Dates calculations
 */

export interface DaysLeftResult {
  daysLeft: number;
  isToday: boolean;
  isTomorrow: boolean;
  nextOccurrenceDate: Date;
  formattedNextOccurrence: string;
  formattedOriginalDate: string;
  turningAge?: number;
  badgeText: string;
}

/**
 * Calculates days left until the next occurrence of an annual recurring date (e.g., birthday or anniversary)
 * @param dateStr Date string formatted as YYYY-MM-DD or ISO string
 */
export function calculateDaysLeft(dateStr: string): DaysLeftResult {
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

  // Parse input date
  const [yearStr, monthStr, dayStr] = dateStr.split("-");
  const origYear = parseInt(yearStr, 10);
  const origMonth = parseInt(monthStr, 10) - 1; // 0-indexed month
  const origDay = parseInt(dayStr, 10);

  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", 
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  
  const formattedOriginalDate = !isNaN(origYear) && origYear > 1900 && origYear < 2100
    ? `${monthNames[origMonth]} ${origDay}, ${origYear}`
    : `${monthNames[origMonth]} ${origDay}`;

  // Next occurrence in current year
  let targetYear = today.getFullYear();
  let nextOccurrence = new Date(targetYear, origMonth, origDay);

  // If next occurrence has already passed this year, move to next year
  if (nextOccurrence.getTime() < today.getTime()) {
    targetYear += 1;
    nextOccurrence = new Date(targetYear, origMonth, origDay);
  }

  // Calculate difference in days
  const diffTime = nextOccurrence.getTime() - today.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const isToday = daysLeft === 0;
  const isTomorrow = daysLeft === 1;

  let badgeText = "";
  if (isToday) {
    badgeText = "Today! 🎉";
  } else if (isTomorrow) {
    badgeText = "Tomorrow! ⚡";
  } else if (daysLeft < 30) {
    badgeText = `In ${daysLeft} days`;
  } else if (daysLeft < 60) {
    badgeText = `In ~1 month (${daysLeft}d)`;
  } else {
    const months = Math.floor(daysLeft / 30);
    badgeText = `In ~${months} months (${daysLeft}d)`;
  }

  const formattedNextOccurrence = `${monthNames[origMonth]} ${origDay}, ${targetYear}`;

  let turningAge: number | undefined;
  if (!isNaN(origYear) && origYear > 1900 && origYear <= targetYear) {
    turningAge = targetYear - origYear;
  }

  return {
    daysLeft,
    isToday,
    isTomorrow,
    nextOccurrenceDate: nextOccurrence,
    formattedNextOccurrence,
    formattedOriginalDate,
    turningAge,
    badgeText,
  };
}

export function getRelationColor(relation: string): string {
  const rel = relation.toLowerCase();
  if (rel.includes("mother") || rel.includes("mom") || rel.includes("father") || rel.includes("dad") || rel.includes("parent") || rel.includes("family")) {
    return "bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20";
  }
  if (rel.includes("spouse") || rel.includes("partner") || rel.includes("wife") || rel.includes("husband") || rel.includes("love")) {
    return "bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20";
  }
  if (rel.includes("friend") || rel.includes("bestie") || rel.includes("bff")) {
    return "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20";
  }
  if (rel.includes("sibling") || rel.includes("brother") || rel.includes("sister")) {
    return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
  }
  if (rel.includes("colleague") || rel.includes("work") || rel.includes("boss")) {
    return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
  }
  return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
}
