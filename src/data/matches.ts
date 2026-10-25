import { resolveMatchCompetitionId } from './matchCompetitions';
import { MatchData, MatchSummary } from '../types/match';
import { sessionMediaUrl } from '../utils/mediaUrl';
import { getMicrocycleDay } from './microcycleDays';

const matchModules = import.meta.glob<{ default: MatchData }>(
  '../../matches/*/match.json',
  { eager: true }
);

/** A match counts as published only when it has a recorded result. */
function withEffectiveStatus(match: MatchData): MatchData {
  if (match.status === 'published' && !hasMatchScore(match.score)) {
    return { ...match, status: 'draft' };
  }
  return match;
}

function toSummary(raw: MatchData): MatchSummary {
  const match = withEffectiveStatus(raw);
  const competitionId = resolveMatchCompetitionId(match);
  return {
    id: match.id,
    slug: match.slug,
    title: match.title,
    date: match.date,
    competitionId,
    competition: match.competition,
    status: match.status,
    homeTeam: match.homeTeam.shortName,
    awayTeam: match.awayTeam.shortName,
    homeLogo: match.homeTeam.logo,
    awayLogo: match.awayTeam.logo,
    homeColorClass: match.homeTeam.colorClass,
    awayColorClass: match.awayTeam.colorClass,
    score: match.score,
    microcycleDay: getMicrocycleDay(match.slug),
    firstLegSlug: match.firstLegSlug,
  };
}

export function getAllMatches(): MatchSummary[] {
  return Object.values(matchModules)
    .map((mod) => toSummary(mod.default))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getMatchBySlug(slug: string): MatchData | undefined {
  const entry = Object.entries(matchModules).find(([path]) =>
    path.includes(`/${slug}/`)
  );
  return entry ? withEffectiveStatus(entry[1].default) : undefined;
}

/** First-phase report linked from a return fixture. Undefined when the pointer is missing or broken. */
export function getFirstLegMatch(match: {
  slug: string;
  firstLegSlug?: string;
}): MatchData | undefined {
  const slug = match.firstLegSlug?.trim();
  if (!slug || slug === match.slug) return undefined;
  return getMatchBySlug(slug);
}

export function matchAssetUrl(slug: string, relativePath: string): string {
  return sessionMediaUrl('matches', slug, relativePath);
}

/** True when a final score is recorded. */
export function hasMatchScore(
  score: { home: number; away: number } | null | undefined
): score is { home: number; away: number } {
  return score != null && Number.isFinite(score.home) && Number.isFinite(score.away);
}

/** Display scoreline, or an em dash when the fixture is still blank. */
export function formatMatchScore(
  score: { home: number; away: number } | null | undefined,
  sep = '–'
): string {
  if (!hasMatchScore(score)) return '—';
  return `${score.home}${sep}${score.away}`;
}
