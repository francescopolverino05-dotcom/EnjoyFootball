import type { TrainingSummary } from '../types/training';

/** Monday of Sett. 1 / Week 1 (27 Jul 2026). Later weeks are +7 days. */
export const TRAINING_SEASON_WEEK1_MONDAY = '2026-07-27';

export interface TrainingWeekGroup {
  /** ISO Monday YYYY-MM-DD */
  weekStart: string;
  /** ISO Friday YYYY-MM-DD (Mon–Fri training week) */
  weekEnd: string;
  /** 1-based week index from season Week 1 */
  weekNumber: number;
  sessions: TrainingSummary[];
}

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

function toIsoDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function addUtcDays(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date);
}

/** Monday (UTC) of the calendar week containing `isoDate` (Mon–Sun). */
export function getWeekStartMonday(isoDate: string): string {
  const date = parseIsoDate(isoDate);
  const day = date.getUTCDay(); // 0 Sun … 6 Sat
  const offsetToMonday = day === 0 ? -6 : 1 - day;
  date.setUTCDate(date.getUTCDate() + offsetToMonday);
  return toIsoDate(date);
}

export function getTrainingWeekNumber(weekStartMonday: string): number {
  const seasonStart = parseIsoDate(TRAINING_SEASON_WEEK1_MONDAY);
  const weekStart = parseIsoDate(weekStartMonday);
  const diffDays = Math.round(
    (weekStart.getTime() - seasonStart.getTime()) / (24 * 60 * 60 * 1000)
  );
  return Math.floor(diffDays / 7) + 1;
}

/**
 * Group sessions into Mon–Fri training weeks derived from each session `date`.
 * Weeks are ordered chronologically (Week 1 → Week 2 → …).
 * Sessions within a week are oldest-first (Mon → Fri).
 */
export function groupTrainingsByWeek(
  sessions: TrainingSummary[]
): TrainingWeekGroup[] {
  const byWeek = new Map<string, TrainingSummary[]>();

  for (const session of sessions) {
    const weekStart = getWeekStartMonday(session.date);
    const list = byWeek.get(weekStart);
    if (list) list.push(session);
    else byWeek.set(weekStart, [session]);
  }

  return [...byWeek.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([weekStart, weekSessions]) => ({
      weekStart,
      weekEnd: addUtcDays(weekStart, 4),
      weekNumber: getTrainingWeekNumber(weekStart),
      sessions: [...weekSessions].sort((a, b) => a.date.localeCompare(b.date)),
    }));
}
