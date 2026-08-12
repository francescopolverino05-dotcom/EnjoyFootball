import { resolveMatchCompetitionId } from './matchCompetitions';
import type { MatchData } from '../types/match';
import type { TrainingSession } from '../types/training';

/**
 * Pre-season microcycle day labels (Day 1, Day 2, …).
 *
 * Only **training sessions** and **friendly matches** count — rest days
 * (e.g. Sun 2 Aug, Sun 9 Aug) are not numbered.
 *
 * Day 1 = Mon 27 Jul 2026. Day 18 = Mon 17 Aug 2026.
 * External friendlies before 17 Aug count (1 Aug, 8 Aug Portici).
 * The internal Primavera XI vs XI (14 Aug) is not numbered.
 * From 17 Aug onward, friendlies continue the sequence (22 Aug = Day 19, …).
 *
 * When training and a friendly share a date, training is numbered first.
 */

export const MICROCYCLE_START_DATE = '2026-07-27';

/** Internal scrimmage — not a microcycle day. */
const EXCLUDED_MATCH_SLUGS = new Set([
  '2026-08-14_amichevole-primavera-xi-vs-xi',
]);

const trainingModules = import.meta.glob<{ default: TrainingSession }>(
  '../../trainings/*/training.json',
  { eager: true }
);

const matchModules = import.meta.glob<{ default: MatchData }>(
  '../../matches/*/match.json',
  { eager: true }
);

type MicrocycleEntry = {
  slug: string;
  date: string;
  kind: 'training' | 'match';
};

function buildMicrocycleDayBySlug(): Record<string, number> {
  const entries: MicrocycleEntry[] = [];

  for (const mod of Object.values(trainingModules)) {
    const session = mod.default;
    if (session.date < MICROCYCLE_START_DATE) continue;
    entries.push({
      slug: session.slug,
      date: session.date,
      kind: 'training',
    });
  }

  for (const mod of Object.values(matchModules)) {
    const match = mod.default;
    if (match.date < MICROCYCLE_START_DATE) continue;
    if (resolveMatchCompetitionId(match) !== 'friendlies') continue;
    if (EXCLUDED_MATCH_SLUGS.has(match.slug)) continue;
    entries.push({ slug: match.slug, date: match.date, kind: 'match' });
  }

  entries.sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate !== 0) return byDate;
    return a.kind === 'training' ? -1 : 1;
  });

  const map: Record<string, number> = {};
  entries.forEach((entry, index) => {
    map[entry.slug] = index + 1;
  });
  return map;
}

const MICROCYCLE_DAY_BY_SLUG = buildMicrocycleDayBySlug();

/** Day number for a training slug or friendly match slug. */
export function getMicrocycleDay(slug: string): number | null {
  return MICROCYCLE_DAY_BY_SLUG[slug] ?? null;
}

export function formatMicrocycleDay(day: number, locale: 'en' | 'it'): string {
  return locale === 'it' ? `Giorno ${day}` : `Day ${day}`;
}
