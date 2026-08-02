import { MatchData, MatchSummary } from '../types/match';

const matchModules = import.meta.glob<{ default: MatchData }>(
  '../../matches/*/match.json',
  { eager: true }
);

function toSummary(match: MatchData): MatchSummary {
  return {
    id: match.id,
    slug: match.slug,
    title: match.title,
    date: match.date,
    competition: match.competition,
    status: match.status,
    homeTeam: match.homeTeam.shortName,
    awayTeam: match.awayTeam.shortName,
    score: match.score,
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
  return entry?.[1].default;
}

export function matchAssetUrl(slug: string, relativePath: string): string {
  return `/matches/${slug}/${relativePath}`;
}
