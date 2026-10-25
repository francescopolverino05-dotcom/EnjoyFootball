/**
 * Stats leaderboards computed from data recorded on the site:
 * tagged match sheets (src/data/leagueMatchStats/*.json) + our match reports
 * (matches/*\/match.json, only those with a result). Nothing is estimated here:
 * a metric only appears when at least one game recorded it.
 */
import type { Localized } from '../i18n/translations';
import type { StatsCompetitionId } from '../types/statsRankings';
import type { MatchData } from '../types/match';
import { getAllLeagueMatchStats } from './leagueMatchStats';
import { getAllMatches, getMatchBySlug, hasMatchScore } from './matches';

export type LeaderboardCategory = 'general' | 'attacking' | 'defensive' | 'passing' | 'setPieces';
export const LEADERBOARD_CATEGORIES: LeaderboardCategory[] = ['general', 'attacking', 'defensive', 'passing', 'setPieces'];

export interface LeaderRow { key: string; name: string; team?: string; teamId: string; value: number; played?: number; isUs: boolean }
export interface Leaderboard { id: string; label: Localized; unit?: 'perGame' | '%' | 'total'; rows: LeaderRow[] }

const US = 'napoli';
const normTeam = (id: string) => (id === 'u19' ? US : id);

interface TeamGame { teamId: string; team: string; gf: number; ga: number; stats: Record<string, string> }
interface Game { key: string; competitionId: string; teams: [TeamGame, TeamGame]; goals: { scorer: string; teamId: string; assist?: string | null }[] }

function parseScore(s: string): [number, number] | null {
  const m = s.match(/(\d+)\s*[–-]\s*(\d+)/);
  return m ? [Number(m[1]), Number(m[2])] : null;
}

function collectGames(): Game[] {
  const games = new Map<string, Game>();
  const key = (date: string, a: string, b: string) => `${date}|${[a, b].sort().join('|')}`;
  // Our match reports first (they carry assists).
  for (const sum of getAllMatches()) {
    if (sum.status !== 'published' || !hasMatchScore(sum.score)) continue;
    const m = getMatchBySlug(sum.slug) as MatchData | undefined;
    if (!m || !m.score) continue;
    const h = normTeam(m.homeTeam.id), a = normTeam(m.awayTeam.id);
    const stats = (side: 'home' | 'away') => {
      const out: Record<string, string> = {};
      for (const r of (m.teamStats ?? []) as unknown as { name?: Localized; stat?: string; home: string; away: string }[]) {
        const n = typeof r.name === 'string' ? r.name : r.name?.en ?? r.stat ?? '';
        out[n] = r[side];
      }
      return out;
    };
    games.set(key(m.date, h, a), {
      key: key(m.date, h, a),
      competitionId: sum.competitionId,
      teams: [
        { teamId: h, team: h === US ? 'Napoli' : m.homeTeam.shortName, gf: m.score.home, ga: m.score.away, stats: stats('home') },
        { teamId: a, team: a === US ? 'Napoli' : m.awayTeam.shortName, gf: m.score.away, ga: m.score.home, stats: stats('away') },
      ],
      goals: (m.goals ?? []).map((g) => ({ scorer: g.scorer, teamId: normTeam(g.teamId), assist: g.assist })),
    });
  }
  for (const p of getAllLeagueMatchStats()) {
    const sc = parseScore(p.score);
    if (!sc) continue;
    const k = key(p.date, p.home.teamId, p.away.teamId);
    const side = (s: 'home' | 'away') => Object.fromEntries(p.teamStats.map((r) => [r.stat, r[s]]));
    const existing = games.get(k);
    if (existing) {
      // Prefer the tagged sheet's team stats; keep our report's goals/assists.
      existing.teams[0].stats = { ...existing.teams[0].stats, ...side(existing.teams[0].teamId === p.home.teamId ? 'home' : 'away') };
      existing.teams[1].stats = { ...existing.teams[1].stats, ...side(existing.teams[1].teamId === p.home.teamId ? 'home' : 'away') };
      continue;
    }
    games.set(k, {
      key: k,
      competitionId: p.competitionId,
      teams: [
        { teamId: p.home.teamId, team: p.home.name, gf: sc[0], ga: sc[1], stats: side('home') },
        { teamId: p.away.teamId, team: p.away.name, gf: sc[1], ga: sc[0], stats: side('away') },
      ],
      goals: p.goals.map((g) => ({ scorer: g.scorer, teamId: g.teamId })),
    });
  }
  return [...games.values()];
}

interface MetricDef {
  id: string;
  cat: Exclude<LeaderboardCategory, 'general'>;
  label: Localized;
  names: RegExp;
  avg?: boolean; // percentages / rates: average instead of per-game total
  lowerIsBetter?: boolean;
}

const METRICS: MetricDef[] = [
  { id: 'xg', cat: 'attacking', label: { en: 'xG per game', it: 'xG a partita' }, names: /^(xG \(estimated|Expected Goals)/ },
  { id: 'shots', cat: 'attacking', label: { en: 'Shots per game', it: 'Tiri a partita' }, names: /^Shots( \(full match\))?$/ },
  { id: 'sot', cat: 'attacking', label: { en: 'Shots on target per game', it: 'Tiri in porta a partita' }, names: /^Shots on [Tt]arget/ },
  { id: 'inbox', cat: 'attacking', label: { en: 'Shots inside the box per game', it: 'Tiri in area a partita' }, names: /^Shots inside box$/ },
  { id: 'shotacc', cat: 'attacking', label: { en: 'Shot accuracy %', it: 'Precisione tiri %' }, names: /^Shot accuracy %$/, avg: true },
  { id: 'keypasses', cat: 'attacking', label: { en: 'Key passes per game', it: 'Passaggi chiave a partita' }, names: /^Key passes/ },
  { id: 'intobox', cat: 'attacking', label: { en: 'Passes into the box (completed) per game', it: 'Passaggi in area (riusciti) a partita' }, names: /^Into box/ },
  { id: 'foulswon', cat: 'attacking', label: { en: 'Fouls won per game', it: 'Falli subiti a partita' }, names: /^Fouls won$/ },
  { id: 'interceptions', cat: 'defensive', label: { en: 'Interceptions per game', it: 'Intercetti a partita' }, names: /^Interceptions/ },
  { id: 'clearances', cat: 'defensive', label: { en: 'Clearances per game', it: 'Spazzate a partita' }, names: /^Clearances$/ },
  { id: 'blocks', cat: 'defensive', label: { en: 'Blocks per game', it: 'Respinte a partita' }, names: /^Blocks$/ },
  { id: 'recoveries', cat: 'defensive', label: { en: 'Recoveries per game', it: 'Recuperi a partita' }, names: /^Recoveries$/ },
  { id: 'highrec', cat: 'defensive', label: { en: 'High recoveries per game', it: 'Recuperi alti a partita' }, names: /^High recoveries/ },
  { id: 'aerial', cat: 'defensive', label: { en: 'Aerial duels won per game', it: 'Duelli aerei vinti a partita' }, names: /^Aerial duels/ },
  { id: 'ground', cat: 'defensive', label: { en: 'Ground duels won per game', it: 'Duelli a terra vinti a partita' }, names: /^Ground duels/ },
  { id: 'ppda', cat: 'defensive', label: { en: 'PPDA (lower = more pressing)', it: 'PPDA (più basso = più pressing)' }, names: /^PPDA full match$/, avg: true, lowerIsBetter: true },
  { id: 'saves', cat: 'defensive', label: { en: 'GK saves per game', it: 'Parate a partita' }, names: /^GK saves$/ },
  { id: 'fouls', cat: 'defensive', label: { en: 'Fouls committed per game', it: 'Falli commessi a partita' }, names: /^Fouls committed/ },
  { id: 'passes', cat: 'passing', label: { en: 'Passes per game', it: 'Passaggi a partita' }, names: /^Passes$/ },
  { id: 'passescmp', cat: 'passing', label: { en: 'Passes completed per game', it: 'Passaggi riusciti a partita' }, names: /^Passes completed$/ },
  { id: 'passacc', cat: 'passing', label: { en: 'Pass accuracy %', it: 'Precisione passaggi %' }, names: /^Pass accuracy %( \(full match\))?$/, avg: true },
  { id: 'possession', cat: 'passing', label: { en: 'Possession %', it: 'Possesso %' }, names: /^Possession (estimate )?%( \(full match\)| \(share of passes attempted\))?$/, avg: true },
  { id: 'prog', cat: 'passing', label: { en: 'Progressive passes (completed) per game', it: 'Passaggi progressivi (riusciti) a partita' }, names: /^Progressive passes \(completed/ },
  { id: 'final3', cat: 'passing', label: { en: 'Passes into final third (completed) per game', it: 'Passaggi nell’ultimo terzo (riusciti) a partita' }, names: /^Into final third/ },
  { id: 'crosses', cat: 'passing', label: { en: 'Crosses completed per game', it: 'Cross riusciti a partita' }, names: /^Crosses \(completed/ },
  { id: 'long', cat: 'passing', label: { en: 'Long balls completed per game', it: 'Lanci lunghi riusciti a partita' }, names: /^Long balls \(completed/ },
  { id: 'through', cat: 'passing', label: { en: 'Through balls completed per game', it: 'Filtranti riusciti a partita' }, names: /^Through balls \(completed/ },
  { id: 'lost', cat: 'passing', label: { en: 'Balls lost per game', it: 'Palloni persi a partita' }, names: /^Balls lost/, lowerIsBetter: true },
  { id: 'corners', cat: 'setPieces', label: { en: 'Corners per game', it: 'Calci d’angolo a partita' }, names: /^Corners/ },
  { id: 'freekicks', cat: 'setPieces', label: { en: 'Free kicks per game', it: 'Calci di punizione a partita' }, names: /^Free [Kk]icks( \(excl\. goal kicks\)| \(all\))?$/ },
  { id: 'throwins', cat: 'setPieces', label: { en: 'Throw-ins per game', it: 'Rimesse laterali a partita' }, names: /^Throw-ins$/ },
  { id: 'goalkicks', cat: 'setPieces', label: { en: 'Goal kicks per game', it: 'Rinvii dal fondo a partita' }, names: /^Goal kicks$/ },
  { id: 'offsides', cat: 'setPieces', label: { en: 'Offsides per game', it: 'Fuorigioco a partita' }, names: /^Offsides/ },
];

function num(raw: string | undefined, pick: 'first' | 'last' = 'first'): number | null {
  if (raw == null) return null;
  const all = raw.match(/-?\d+(?:\.\d+)?/g);
  if (!all) return null;
  return Number(pick === 'last' ? all[all.length - 1] : all[0]);
}

function statFor(stats: Record<string, string>, re: RegExp): string | undefined {
  const k = Object.keys(stats).find((n) => re.test(n));
  if (!k) return undefined;
  // "(1H / 2H / total)" rows: keep only the total.
  return /total\)$/i.test(k) ? stats[k].split('/').pop() : stats[k];
}

const surname = (n: string) => n.replace(/\(.*?\)/g, '').trim().split(/\s+/).pop()!.toLowerCase();

function playerBoard(id: string, label: Localized, entries: { name: string; teamId: string; team: string }[]): Leaderboard {
  const m = new Map<string, LeaderRow>();
  for (const e of entries) {
    const k = `${e.teamId}|${surname(e.name)}`;
    const r = m.get(k) ?? { key: k, name: e.name, team: e.team, teamId: e.teamId, value: 0, isUs: e.teamId === US };
    r.value += 1;
    if (e.name.length > r.name.length) r.name = e.name;
    m.set(k, r);
  }
  return { id, label, unit: 'total', rows: [...m.values()].sort((a, b) => b.value - a.value || a.name.localeCompare(b.name)) };
}

export function getLeaderboards(competitionId: StatsCompetitionId): Record<LeaderboardCategory, Leaderboard[]> {
  const games = collectGames().filter((g) => g.competitionId === competitionId);
  const teamName = new Map<string, string>();
  games.forEach((g) => g.teams.forEach((t) => teamName.set(t.teamId, t.team)));
  const out: Record<LeaderboardCategory, Leaderboard[]> = { general: [], attacking: [], defensive: [], passing: [], setPieces: [] };
  if (games.length === 0) return out;

  const goals = games.flatMap((g) => g.goals.filter((x) => x.scorer && !/own goal|autogol/i.test(x.scorer)).map((x) => ({ name: x.scorer, teamId: x.teamId, team: teamName.get(x.teamId) ?? x.teamId })));
  const assists = games.flatMap((g) => g.goals.filter((x) => x.assist).map((x) => ({ name: x.assist!, teamId: x.teamId, team: teamName.get(x.teamId) ?? x.teamId })));

  const teamTotals = (f: (t: TeamGame) => number | null, lower = false, avg = false) => {
    const m = new Map<string, { sum: number; n: number }>();
    games.forEach((g) => g.teams.forEach((t) => {
      const v = f(t);
      if (v == null || !Number.isFinite(v)) return;
      const r = m.get(t.teamId) ?? { sum: 0, n: 0 };
      r.sum += v; r.n += 1; m.set(t.teamId, r);
    }));
    const rows: LeaderRow[] = [...m.entries()].map(([teamId, r]) => ({
      key: teamId, teamId, name: teamName.get(teamId) ?? teamId, played: r.n, isUs: teamId === US,
      value: avg ? Math.round((r.sum / r.n) * 100) / 100 : r.sum,
    }));
    return rows.sort((a, b) => (lower ? a.value - b.value : b.value - a.value) || a.name.localeCompare(b.name));
  };

  const general: Leaderboard[] = [
    playerBoard('scorers', { en: 'Top scorers', it: 'Capocannonieri' }, goals),
    playerBoard('assists', { en: 'Top assists (our match reports)', it: 'Assist (nostri report partita)' }, assists),
    { id: 'goalsfor', label: { en: 'Goals scored', it: 'Gol segnati' }, unit: 'total', rows: teamTotals((t) => t.gf) },
    { id: 'cleansheets', label: { en: 'Clean sheets', it: 'Porta inviolata' }, unit: 'total', rows: teamTotals((t) => (t.ga === 0 ? 1 : 0)) },
    { id: 'conceded', label: { en: 'Goals conceded', it: 'Gol subiti' }, unit: 'total', rows: teamTotals((t) => t.ga) },
    { id: 'yellow', label: { en: 'Yellow cards', it: 'Cartellini gialli' }, unit: 'total', rows: teamTotals((t) => num(statFor(t.stats, /^Yellow cards/))) },
    { id: 'red', label: { en: 'Red cards', it: 'Cartellini rossi' }, unit: 'total', rows: teamTotals((t) => num(statFor(t.stats, /^Red cards/))) },
  ];
  out.general = general.filter((b) => b.rows.length > 0);

  for (const d of METRICS) {
    const rows = teamTotals((t) => num(statFor(t.stats, d.names)), d.lowerIsBetter, true);
    if (rows.length === 0) continue;
    out[d.cat].push({ id: d.id, label: d.label, unit: d.avg && d.id !== 'ppda' ? '%' : 'perGame', rows });
  }
  return out;
}
