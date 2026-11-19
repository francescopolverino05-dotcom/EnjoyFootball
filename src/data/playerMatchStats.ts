/**
 * Season technical stats per Napoli player, aggregated at build time from the
 * `appearances` block of every match.json (Primavera 2, UEFA Youth League,
 * Coppa Italia). Nothing is hardcoded: new match sheets update the numbers.
 *
 * Rules
 * - Only matches with a recorded score count as played.
 * - Appearance: in the starting XI, or came on (numeric onMinute), or has a
 *   goal / assist / card recorded.
 * - Minutes: match length 90 (no stoppage is recorded on any sheet).
 *   Starter = 0 → offMinute (or red-card minute, else 90).
 *   Sub = onMinute → offMinute (or red-card minute, else 90).
 *   Unknown when the sheet has no substitution data at all, or when a bench
 *   player appears through an event without an entry minute.
 */
import type { MatchCompetitionId, MatchData, PlayerAppearance } from '../types/match';
import { resolveMatchCompetitionId } from './matchCompetitions';
import { getAllMatchData, hasMatchScore } from './matches';
import { getAllPlayers } from './players';
import type { Player } from '../types/player';

export const TECH_STATS_COMPETITIONS = [
  'primavera2',
  'uefaYouthLeague',
  'coppaItalia',
] as const satisfies readonly MatchCompetitionId[];

export type TechStatsCompetition = (typeof TECH_STATS_COMPETITIONS)[number];

const MATCH_LENGTH = 90;
const NAPOLI_TEAM_ID = 'u19';

/** Spellings found on sources that differ from the squad list. */
const NAME_ALIASES: Record<string, string> = {
  anich: 'anic',
  rovettini: 'rovetini',
  pereira: 'pereyra',
  cumariello: 'chiummariello',
};

export interface TechStatLine {
  appearances: number;
  starts: number;
  /** Minutes from appearances where they can be computed. */
  minutes: number;
  /** Appearances whose minutes cannot be computed from the data. */
  minutesUnknown: number;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
}

export interface MissingMatch {
  slug: string;
  competitionId: TechStatsCompetition;
  label: string;
}

export interface PlayerTechStats {
  byCompetition: Record<TechStatsCompetition, TechStatLine>;
  total: TechStatLine;
  /** Matches this player appeared in where minutes could not be computed. */
  minutesUnknownIn: MissingMatch[];
}

export interface TechStatsCoverage {
  played: Record<TechStatsCompetition, number>;
  withLineups: Record<TechStatsCompetition, number>;
  /** Played matches with no line-up data (not counted). */
  missing: MissingMatch[];
}

function emptyLine(): TechStatLine {
  return {
    appearances: 0,
    starts: 0,
    minutes: 0,
    minutesUnknown: 0,
    goals: 0,
    assists: 0,
    yellowCards: 0,
    redCards: 0,
  };
}

function addLine(into: TechStatLine, from: TechStatLine) {
  (Object.keys(into) as Array<keyof TechStatLine>).forEach((k) => {
    into[k] += from[k];
  });
}

export function normalizeName(name: string): string {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[’'`.]/g, '')
    .toLowerCase()
    .replace(/^[a-z]\s+/, '') // "M. De Michele" → "de michele"
    .replace(/\s+/g, ' ')
    .trim();
}

function matchLabel(m: MatchData): string {
  return `${m.homeTeam.shortName}–${m.awayTeam.shortName}`;
}

function isNapoli(p: PlayerAppearance): boolean {
  return p.teamId === NAPOLI_TEAM_ID;
}

function napoliAppearances(m: MatchData): PlayerAppearance[] {
  const a = m.appearances;
  if (!a) return [];
  return [...(a.home ?? []), ...(a.away ?? [])].filter(isNapoli);
}

const num = (v: number | null | undefined): v is number =>
  typeof v === 'number' && Number.isFinite(v);

function hasEvents(p: PlayerAppearance): boolean {
  return (
    (p.goals?.length ?? 0) > 0 ||
    (p.assists?.length ?? 0) > 0 ||
    (p.yellowCards?.length ?? 0) > 0 ||
    (p.redCards?.length ?? 0) > 0
  );
}

function played(p: PlayerAppearance): boolean {
  return p.starter === true || (num(p.onMinute) && p.onMinute > 0) || hasEvents(p);
}

/** Minutes played, or null when the data cannot tell. */
function minutesFor(p: PlayerAppearance, sheetHasSubs: boolean): number | null {
  if (!sheetHasSubs) return null;
  const start = p.starter ? 0 : num(p.onMinute) ? p.onMinute : null;
  if (start == null) return null;
  const red = p.redCards?.find(num);
  const end = num(p.offMinute) ? p.offMinute : num(red) ? red : MATCH_LENGTH;
  return Math.max(0, end - start);
}

interface CompetitiveMatch {
  match: MatchData;
  competitionId: TechStatsCompetition;
  rows: PlayerAppearance[];
  sheetHasSubs: boolean;
}

function isTechComp(id: MatchCompetitionId): id is TechStatsCompetition {
  return (TECH_STATS_COMPETITIONS as readonly string[]).includes(id);
}

let cache:
  | { coverage: TechStatsCoverage; matches: CompetitiveMatch[] }
  | undefined;

function load() {
  if (cache) return cache;
  const played0 = () => ({ primavera2: 0, uefaYouthLeague: 0, coppaItalia: 0 });
  const coverage: TechStatsCoverage = {
    played: played0(),
    withLineups: played0(),
    missing: [],
  };
  const matches: CompetitiveMatch[] = [];

  const all = getAllMatchData().sort((a, b) => a.date.localeCompare(b.date));
  for (const match of all) {
    if (!hasMatchScore(match.score)) continue;
    const competitionId = resolveMatchCompetitionId(match);
    if (!isTechComp(competitionId)) continue;
    coverage.played[competitionId] += 1;
    const rows = napoliAppearances(match);
    if (rows.length === 0) {
      coverage.missing.push({ slug: match.slug, competitionId, label: matchLabel(match) });
      continue;
    }
    coverage.withLineups[competitionId] += 1;
    const sheetHasSubs = rows.some(
      (r) => num(r.offMinute) || (!r.starter && num(r.onMinute) && r.onMinute > 0)
    );
    matches.push({ match, competitionId, rows, sheetHasSubs });
  }
  cache = { coverage, matches };
  return cache;
}

export function getTechStatsCoverage(): TechStatsCoverage {
  return load().coverage;
}

/** Map an appearance name to a squad slug (unique prefix match on surname). */
export function resolvePlayerSlug(
  name: string,
  players: Player[] = getAllPlayers()
): string | undefined {
  let key = normalizeName(name);
  key = NAME_ALIASES[key] ?? key;
  const hits = players.filter((pl) => {
    const full = normalizeName(pl.displayName);
    return full === key || full.startsWith(`${key} `);
  });
  return hits.length === 1 ? hits[0].slug : undefined;
}

export function getPlayerTechStats(slug: string): PlayerTechStats {
  const { matches } = load();
  const players = getAllPlayers();
  const byCompetition = {
    primavera2: emptyLine(),
    uefaYouthLeague: emptyLine(),
    coppaItalia: emptyLine(),
  } as Record<TechStatsCompetition, TechStatLine>;
  const minutesUnknownIn: MissingMatch[] = [];

  for (const { match, competitionId, rows, sheetHasSubs } of matches) {
    const row = rows.find((r) => resolvePlayerSlug(r.name, players) === slug);
    if (!row || !played(row)) continue;
    const line = byCompetition[competitionId];
    line.appearances += 1;
    if (row.starter) line.starts += 1;
    const mins = minutesFor(row, sheetHasSubs);
    if (mins == null) {
      line.minutesUnknown += 1;
      minutesUnknownIn.push({ slug: match.slug, competitionId, label: matchLabel(match) });
    } else {
      line.minutes += mins;
    }
    line.goals += row.goals?.length ?? 0;
    line.assists += row.assists?.length ?? 0;
    line.yellowCards += row.yellowCards?.length ?? 0;
    line.redCards += row.redCards?.length ?? 0;
  }

  const total = emptyLine();
  TECH_STATS_COMPETITIONS.forEach((c) => addLine(total, byCompetition[c]));
  return { byCompetition, total, minutesUnknownIn };
}

/** Appearance names on Napoli sheets that match no squad profile (for audits). */
export function getUnmatchedAppearanceNames(): string[] {
  const players = getAllPlayers();
  const out = new Set<string>();
  for (const { rows } of load().matches) {
    for (const r of rows) {
      if (played(r) && !resolvePlayerSlug(r.name, players)) out.add(r.name);
    }
  }
  return [...out].sort();
}
