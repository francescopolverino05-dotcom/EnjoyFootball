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
 * - Match log lists every competitive Napoli fixture in the season calendar
 *   (played + upcoming). Not called up / unused bench / upcoming are explicit.
 */
import type { Localized } from '../i18n/translations';
import type { MatchCompetitionId, MatchData, PlayerAppearance } from '../types/match';
import { resolveMatchCompetitionId } from './matchCompetitions';
import { getAllMatchData, getMatchBySlug, hasMatchScore } from './matches';
import { getAllPlayers } from './players';
import type { Player } from '../types/player';
import {
  getCoppaItaliaStandings,
  getPrimavera2Standings,
  getStandingsDataset,
  getUefaYouthLeagueStandings,
  teamNameById,
} from './standings';

export const TECH_STATS_COMPETITIONS = [
  'primavera2',
  'uefaYouthLeague',
  'coppaItalia',
] as const satisfies readonly MatchCompetitionId[];

export type TechStatsCompetition = (typeof TECH_STATS_COMPETITIONS)[number];

const MATCH_LENGTH = 90;
const NAPOLI_TEAM_ID = 'u19';
const NAPOLI_IDS = new Set(['napoli', 'u19']);

/** Spellings found on sources that differ from the squad list. */
const NAME_ALIASES: Record<string, string> = {
  anich: 'anic',
  rovettini: 'rovetini',
  pereira: 'pereyra',
  cumariello: 'chiummariello',
  'pepe simeone': 'pepe simone',
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

/** How the player featured on a single fixture. */
export type MatchLogStatus =
  | 'started'
  | 'startedOff'
  | 'subOn'
  | 'subOnOff'
  | 'bench'
  | 'notCalledUp'
  | 'noLineup'
  | 'upcoming';

/** Default reason column when no free-text note exists. */
export type MatchLogReasonKind =
  | 'notCalledUp'
  | 'noLineup'
  | 'upcoming'
  | 'subNote'
  | 'none';

export interface PlayerMatchLogEntry {
  /** Match report slug when available. */
  slug: string | null;
  /** Stable row id for React keys. */
  id: string;
  date: string;
  label: string;
  competitionId: TechStatsCompetition;
  status: MatchLogStatus;
  onMinute: number | null;
  offMinute: number | null;
  /** Minutes played when computable; null for unused bench / absence / upcoming. */
  minutes: number | null;
  /** Counted toward season appearances. */
  counted: boolean;
  goals: number;
  assists: number;
  yellowCards: number;
  redCards: number;
  reasonKind: MatchLogReasonKind;
  /** Source note when present (e.g. injury on a substitution). */
  notes?: Localized;
}

export interface PlayerTechStats {
  byCompetition: Record<TechStatsCompetition, TechStatLine>;
  total: TechStatLine;
  /** Matches this player appeared in where minutes could not be computed. */
  minutesUnknownIn: MissingMatch[];
  /** Full season fixture list for this player (chronological). */
  matchLog: PlayerMatchLogEntry[];
}

export interface TechStatsCoverage {
  played: Record<TechStatsCompetition, number>;
  withLineups: Record<TechStatsCompetition, number>;
  /** Played matches with no line-up data (not counted). */
  missing: MissingMatch[];
}

interface SeasonFixture {
  id: string;
  date: string;
  label: string;
  competitionId: TechStatsCompetition;
  matchSlug: string | null;
  played: boolean;
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

function isNapoliId(id: string | undefined | null): boolean {
  return !!id && NAPOLI_IDS.has(id);
}

function isNapoliCupSide(name: string | undefined | null): boolean {
  if (!name) return false;
  return /napoli/i.test(name);
}

function fixturePlayed(score: string | null | undefined, matchSlug: string | null): boolean {
  if (score != null && String(score).trim() !== '') return true;
  if (!matchSlug) return false;
  const m = getMatchBySlug(matchSlug);
  return !!m && hasMatchScore(m.score);
}

function normTeamId(id: string): string {
  return isNapoliId(id) ? 'napoli' : id;
}

/** Pair key so standings rows and match reports collapse to one fixture. */
function fixturePairKey(
  date: string,
  competitionId: TechStatsCompetition,
  homeId: string,
  awayId: string
): string {
  return `${competitionId}|${date}|${normTeamId(homeId)}|${normTeamId(awayId)}`;
}

function opponentIdFromCupName(name: string): string {
  const key = name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
  if (key.includes('napoli')) return 'napoli';
  if (key.includes('bodo')) return 'bodo-glimt';
  if (key.includes('man-city') || key.includes('manchester')) return 'man-city';
  if (key.includes('club-brugge') || key.includes('brugge')) return 'club-brugge';
  return key;
}

/**
 * Resolve a match report slug when standings omit it: same competition, date,
 * and opponents (u19 ↔ napoli).
 */
function resolveMatchSlug(options: {
  date: string;
  competitionId: TechStatsCompetition;
  homeId: string;
  awayId: string;
}): string | null {
  const home = normTeamId(options.homeId);
  const away = normTeamId(options.awayId);
  for (const match of getAllMatchData()) {
    if (match.date !== options.date) continue;
    if (resolveMatchCompetitionId(match) !== options.competitionId) continue;
    const mh = normTeamId(match.homeTeam.id);
    const ma = normTeamId(match.awayTeam.id);
    if (mh === home && ma === away) return match.slug;
  }
  // Date drift of ±1 day (UYL kick-off vs calendar day).
  for (const match of getAllMatchData()) {
    if (resolveMatchCompetitionId(match) !== options.competitionId) continue;
    const mh = normTeamId(match.homeTeam.id);
    const ma = normTeamId(match.awayTeam.id);
    if (mh !== home || ma !== away) continue;
    const d0 = Date.parse(options.date);
    const d1 = Date.parse(match.date);
    if (Number.isFinite(d0) && Number.isFinite(d1) && Math.abs(d0 - d1) <= 86400000) {
      return match.slug;
    }
  }
  return null;
}

/** Every competitive Napoli fixture on the season calendar (P2 + Coppa + UYL). */
export function listNapoliSeasonFixtures(): SeasonFixture[] {
  const byPair = new Map<string, SeasonFixture>();

  const upsert = (
    pairKey: string,
    fx: SeasonFixture,
    homeId: string,
    awayId: string
  ) => {
    const resolved =
      fx.matchSlug?.trim() ||
      resolveMatchSlug({
        date: fx.date,
        competitionId: fx.competitionId,
        homeId,
        awayId,
      });
    const report = resolved ? getMatchBySlug(resolved) : undefined;
    const next: SeasonFixture = {
      ...fx,
      matchSlug: resolved,
      label: report ? matchLabel(report) : fx.label,
      played: fx.played || (!!resolved && hasMatchScore(report?.score)),
    };
    const prev = byPair.get(pairKey);
    if (!prev) {
      byPair.set(pairKey, next);
      return;
    }
    byPair.set(pairKey, {
      id: prev.id,
      date: next.date || prev.date,
      competitionId: prev.competitionId,
      label: next.label || prev.label,
      matchSlug: next.matchSlug ?? prev.matchSlug,
      played: prev.played || next.played,
    });
  };

  const p2 = getPrimavera2Standings();
  for (const md of p2.matchdays) {
    for (const f of md.fixtures) {
      if (!isNapoliId(f.homeId) && !isNapoliId(f.awayId)) continue;
      const home = teamNameById(p2, f.homeId);
      const away = teamNameById(p2, f.awayId);
      const matchSlug = f.matchSlug?.trim() || null;
      upsert(
        fixturePairKey(md.date, 'primavera2', f.homeId, f.awayId),
        {
          id: `p2:${md.date}:${f.homeId}-${f.awayId}`,
          date: md.date,
          label: `${home}–${away}`,
          competitionId: 'primavera2',
          matchSlug,
          played: fixturePlayed(f.score, matchSlug),
        },
        f.homeId,
        f.awayId
      );
    }
  }

  const coppa = getCoppaItaliaStandings();
  for (const round of coppa.rounds) {
    for (const f of round.fixtures) {
      if (!f.us && !isNapoliCupSide(f.home) && !isNapoliCupSide(f.away)) continue;
      const matchSlug = f.matchSlug?.trim() || null;
      const homeId = opponentIdFromCupName(f.home);
      const awayId = opponentIdFromCupName(f.away);
      upsert(
        fixturePairKey(f.date, 'coppaItalia', homeId, awayId),
        {
          id: `coppa:${f.date}:${f.home}-${f.away}`,
          date: f.date,
          label: `${f.home}–${f.away}`,
          competitionId: 'coppaItalia',
          matchSlug,
          played: fixturePlayed(f.score, matchSlug),
        },
        homeId,
        awayId
      );
    }
  }

  const uyl = getUefaYouthLeagueStandings();
  const uylTable = uyl.groupTable ?? getStandingsDataset().competitions.uefaYouthLeague.groupTable;
  if (uylTable) {
    for (const md of uylTable.matchdays) {
      for (const f of md.fixtures) {
        if (!isNapoliId(f.homeId) && !isNapoliId(f.awayId)) continue;
        const home = teamNameById(uylTable, f.homeId);
        const away = teamNameById(uylTable, f.awayId);
        const matchSlug = f.matchSlug?.trim() || null;
        upsert(
          fixturePairKey(md.date, 'uefaYouthLeague', f.homeId, f.awayId),
          {
            id: `uyl:${md.date}:${f.homeId}-${f.awayId}`,
            date: md.date,
            label: `${home}–${away}`,
            competitionId: 'uefaYouthLeague',
            matchSlug,
            played: fixturePlayed(f.score, matchSlug),
          },
          f.homeId,
          f.awayId
        );
      }
    }
  }

  // Safety net: played reports still missing from the calendar.
  for (const match of getAllMatchData()) {
    if (!hasMatchScore(match.score)) continue;
    const competitionId = resolveMatchCompetitionId(match);
    if (!isTechComp(competitionId)) continue;
    upsert(
      fixturePairKey(match.date, competitionId, match.homeTeam.id, match.awayTeam.id),
      {
        id: `match:${match.slug}`,
        date: match.date,
        label: matchLabel(match),
        competitionId,
        matchSlug: match.slug,
        played: true,
      },
      match.homeTeam.id,
      match.awayTeam.id
    );
  }

  return [...byPair.values()].sort(
    (a, b) => a.date.localeCompare(b.date) || a.label.localeCompare(b.label)
  );
}

let cache:
  | {
      coverage: TechStatsCoverage;
      matches: CompetitiveMatch[];
      bySlug: Map<string, CompetitiveMatch>;
      fixtures: SeasonFixture[];
    }
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
  const bySlug = new Map<string, CompetitiveMatch>();

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
    const entry = { match, competitionId, rows, sheetHasSubs };
    matches.push(entry);
    bySlug.set(match.slug, entry);
  }
  cache = { coverage, matches, bySlug, fixtures: listNapoliSeasonFixtures() };
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

function logStatus(row: PlayerAppearance): MatchLogStatus {
  const didPlay = played(row);
  if (!didPlay) return 'bench';
  const hasOn = num(row.onMinute) && row.onMinute > 0;
  const hasOff = num(row.offMinute);
  if (row.starter) return hasOff ? 'startedOff' : 'started';
  if (hasOn && hasOff) return 'subOnOff';
  if (hasOn) return 'subOn';
  return 'subOn';
}

export function getPlayerTechStats(slug: string): PlayerTechStats {
  const { matches, bySlug, fixtures } = load();
  const players = getAllPlayers();
  const byCompetition = {
    primavera2: emptyLine(),
    uefaYouthLeague: emptyLine(),
    coppaItalia: emptyLine(),
  } as Record<TechStatsCompetition, TechStatLine>;
  const minutesUnknownIn: MissingMatch[] = [];

  // Season totals from sheets where the player actually featured.
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

  const matchLog: PlayerMatchLogEntry[] = fixtures.map((fx) => {
    const sheet = fx.matchSlug ? bySlug.get(fx.matchSlug) : undefined;
    const row = sheet?.rows.find((r) => resolvePlayerSlug(r.name, players) === slug);

    if (!fx.played) {
      return {
        id: fx.id,
        slug: fx.matchSlug,
        date: fx.date,
        label: fx.label,
        competitionId: fx.competitionId,
        status: 'upcoming',
        onMinute: null,
        offMinute: null,
        minutes: null,
        counted: false,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        reasonKind: 'upcoming',
      };
    }

    if (!sheet) {
      // Played but no Napoli appearance sheet yet — cannot claim non-call-up.
      return {
        id: fx.id,
        slug: fx.matchSlug,
        date: fx.date,
        label: fx.label,
        competitionId: fx.competitionId,
        status: 'noLineup',
        onMinute: null,
        offMinute: null,
        minutes: null,
        counted: false,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        reasonKind: 'noLineup',
      };
    }

    if (!row) {
      return {
        id: fx.id,
        slug: fx.matchSlug,
        date: fx.date,
        label: sheet ? matchLabel(sheet.match) : fx.label,
        competitionId: fx.competitionId,
        status: 'notCalledUp',
        onMinute: null,
        offMinute: null,
        minutes: null,
        counted: false,
        goals: 0,
        assists: 0,
        yellowCards: 0,
        redCards: 0,
        reasonKind: 'notCalledUp',
      };
    }

    const didPlay = played(row);
    const mins = didPlay ? minutesFor(row, sheet.sheetHasSubs) : null;
    const status = logStatus(row);
    return {
      id: fx.id,
      slug: fx.matchSlug,
      date: fx.date,
      label: matchLabel(sheet.match),
      competitionId: fx.competitionId,
      status,
      onMinute: num(row.onMinute) ? row.onMinute : null,
      offMinute: num(row.offMinute) ? row.offMinute : null,
      minutes: mins,
      counted: didPlay,
      goals: row.goals?.length ?? 0,
      assists: row.assists?.length ?? 0,
      yellowCards: row.yellowCards?.length ?? 0,
      redCards: row.redCards?.length ?? 0,
      reasonKind: row.notes ? 'subNote' : 'none',
      notes: row.notes,
    };
  });

  const total = emptyLine();
  TECH_STATS_COMPETITIONS.forEach((c) => addLine(total, byCompetition[c]));
  return { byCompetition, total, minutesUnknownIn, matchLog };
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
