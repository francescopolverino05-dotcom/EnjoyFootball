import type { Localized } from '../i18n/translations';
import type { MatchCompetitionId, MatchSummary } from '../types/match';

export type { MatchCompetitionId };

/** Season competition buckets for the Matches list tabs. */
export const MATCH_COMPETITION_ORDER: MatchCompetitionId[] = [
  'friendlies',
  'primavera2',
  'uefaYouthLeague',
  'coppaItalia',
];

export const MATCH_COMPETITION_LABELS: Record<
  MatchCompetitionId,
  Localized
> = {
  friendlies: { en: 'Friendlies', it: 'Amichevoli' },
  primavera2: { en: 'Primavera 2', it: 'Primavera 2' },
  uefaYouthLeague: { en: 'UEFA Youth League', it: 'UEFA Youth League' },
  coppaItalia: { en: 'Coppa Italia', it: 'Coppa Italia' },
};

export type MatchCompetitionTabLabelKey =
  | 'competitionFriendlies'
  | 'competitionPrimavera2'
  | 'competitionUefaYouthLeague'
  | 'competitionCoppaItalia';

export const MATCH_COMPETITION_TAB_KEYS: Record<
  MatchCompetitionId,
  MatchCompetitionTabLabelKey
> = {
  friendlies: 'competitionFriendlies',
  primavera2: 'competitionPrimavera2',
  uefaYouthLeague: 'competitionUefaYouthLeague',
  coppaItalia: 'competitionCoppaItalia',
};

const COMPETITION_ID_SET = new Set<string>(MATCH_COMPETITION_ORDER);

function textBlob(...parts: Array<string | undefined>): string {
  return parts.filter(Boolean).join(' ').toLowerCase();
}

/**
 * Resolve a match into one of the four season competition tabs.
 * Prefer an explicit `competitionId`; otherwise infer from competition labels / slug.
 */
export function resolveMatchCompetitionId(input: {
  competitionId?: MatchCompetitionId | string;
  competition?: Localized;
  slug?: string;
  title?: Localized;
}): MatchCompetitionId {
  const raw = input.competitionId;
  if (typeof raw === 'string' && COMPETITION_ID_SET.has(raw)) {
    return raw as MatchCompetitionId;
  }

  const competitionText =
    typeof input.competition === 'string'
      ? input.competition
      : input.competition
        ? `${input.competition.en} ${input.competition.it}`
        : '';
  const titleText =
    typeof input.title === 'string'
      ? input.title
      : input.title
        ? `${input.title.en} ${input.title.it}`
        : '';
  const haystack = textBlob(competitionText, input.slug, titleText);

  if (
    /uefa|youth.?league|\buyl\b/.test(haystack)
  ) {
    return 'uefaYouthLeague';
  }
  if (/coppa/.test(haystack)) {
    return 'coppaItalia';
  }
  if (
    /primavera\s*2|campionato|league\s*match|\bserie\b/.test(haystack)
  ) {
    return 'primavera2';
  }
  if (/friend|amichevol/.test(haystack)) {
    return 'friendlies';
  }

  // Default bucket for unclassified / scaffolded matches
  return 'friendlies';
}

export interface MatchCompetitionGroup {
  id: MatchCompetitionId;
  matches: MatchSummary[];
}

/** Always returns all four competitions (empty arrays when none yet). */
export function groupMatchesByCompetition(
  matches: MatchSummary[]
): MatchCompetitionGroup[] {
  const buckets: Record<MatchCompetitionId, MatchSummary[]> = {
    friendlies: [],
    primavera2: [],
    uefaYouthLeague: [],
    coppaItalia: [],
  };

  for (const match of matches) {
    const id = resolveMatchCompetitionId(match);
    buckets[id].push(match);
  }

  return MATCH_COMPETITION_ORDER.map((id) => ({
    id,
    matches: buckets[id],
  }));
}

/**
 * Default tab: competition with the most recent match date.
 * Falls back to Friendlies when nothing is published yet.
 */
export function defaultMatchCompetitionId(
  groups: MatchCompetitionGroup[]
): MatchCompetitionId {
  let bestId: MatchCompetitionId = 'friendlies';
  let bestDate = '';

  for (const group of groups) {
    for (const match of group.matches) {
      if (match.date > bestDate) {
        bestDate = match.date;
        bestId = group.id;
      }
    }
  }

  return bestId;
}
