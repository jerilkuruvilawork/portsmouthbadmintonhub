import { DAY_ORDER, type DayOfWeek } from "../data/sessions";

/** Minutes after midnight for the first clock time in a free-text time, or null if none. */
export function startMinutes(time: string): number | null {
  const match = time.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!match) return null;
  const hour12 = Number(match[1]) % 12;
  const minutes = match[2] ? Number(match[2]) : 0;
  const isPm = match[3].toUpperCase() === "PM";
  return (isPm ? hour12 + 12 : hour12) * 60 + minutes;
}

/** Sessions with a parseable start time come first, earliest to latest; the rest keep name order. */
export function compareByStartTime(a: { time: string; name: string }, b: { time: string; name: string }) {
  const aStart = startMinutes(a.time);
  const bStart = startMinutes(b.time);
  if (aStart !== bStart) {
    if (aStart === null) return 1;
    if (bStart === null) return -1;
    return aStart - bStart;
  }
  return a.name.localeCompare(b.name);
}

export function firstDayIndex(days: DayOfWeek[]): number {
  return Math.min(...days.map((day) => DAY_ORDER.indexOf(day)));
}
