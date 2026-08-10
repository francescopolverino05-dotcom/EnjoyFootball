import type { Localized } from '../i18n/translations';
import type { TrainingSessionType } from '../types/training';

export type { TrainingSessionType };

export const TRAINING_SESSION_TYPE_LABELS: Record<
  TrainingSessionType,
  Localized
> = {
  strength: { en: 'Strength', it: 'Forza' },
  metabolic: { en: 'Metabolic', it: 'Metabolica' },
  activation: { en: 'Activation', it: 'Attivazione' },
  'match-practice': { en: 'Match Practice', it: 'Partitella' },
};

/** Default Mon–Fri session types (UTC weekday: Mon=1 … Fri=5). */
const WEEKDAY_SESSION_TYPE: Partial<Record<number, TrainingSessionType>> = {
  1: 'strength',
  2: 'metabolic',
  3: 'activation',
  4: 'activation',
  5: 'match-practice',
};

export const DEFAULT_TRAINING_START_TIME = '09:00';
export const DEFAULT_TRAINING_END_TIME = '11:00';

function utcWeekday(isoDate: string): number {
  const [y, m, d] = isoDate.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay(); // 0 Sun … 6 Sat
}

/** Resolve session type from explicit field, else weekday default. */
export function resolveTrainingSessionType(
  date: string,
  sessionType?: TrainingSessionType | null
): TrainingSessionType | null {
  if (sessionType) return sessionType;
  return WEEKDAY_SESSION_TYPE[utcWeekday(date)] ?? null;
}

export function formatTrainingTimeRange(
  startTime?: string | null,
  endTime?: string | null
): string {
  const start = startTime || DEFAULT_TRAINING_START_TIME;
  const end = endTime || DEFAULT_TRAINING_END_TIME;
  return `${start}–${end}`;
}
