import type { LeagueMatchStats } from '../types/leagueMatchStats';
import type {
  DynamicMetric,
  GoalkeeperLog,
  TeamStat,
} from '../types/match';
import type { Localized } from '../i18n/translations';

const CAT = {
  general: { en: 'General', it: 'Generale' },
  attack: { en: 'Attack', it: 'Attacco' },
  passes: { en: 'Passes', it: 'Passaggi' },
  defence: { en: 'Defence', it: 'Difesa' },
  duels: { en: 'Duels', it: 'Duelli' },
  pressing: { en: 'Pressing', it: 'Pressing' },
} as const;

type CatKey = keyof typeof CAT;

const CAT_ORDER: CatKey[] = [
  'general',
  'attack',
  'passes',
  'defence',
  'duels',
  'pressing',
];

function categoryKeyForStat(stat: string): CatKey {
  const s = stat.toLowerCase();
  if (s.includes('ppda')) return 'pressing';
  if (s.includes('duel')) return 'duels';
  if (
    s.includes('shot') ||
    s.includes('xg') ||
    s.includes('headed') ||
    s.includes('key pass') ||
    s.includes('into final') ||
    s.includes('into box')
  ) {
    return 'attack';
  }
  if (
    s.includes('pass') ||
    s.includes('long ball') ||
    s.includes('through ball') ||
    s.includes('cross')
  ) {
    return 'passes';
  }
  if (
    s.includes('intercept') ||
    s.includes('recover') ||
    s.includes('clearance') ||
    s === 'blocks' ||
    s.includes('gk save') ||
    s.includes('balls lost')
  ) {
    return 'defence';
  }
  return 'general';
}

/** Map league sheet rows into Napoli-style categorized team stats. */
export function mapLeagueTeamStats(
  pack: LeagueMatchStats
): TeamStat[] {
  return pack.teamStats
    .map((row, index) => {
      const key = categoryKeyForStat(row.stat);
      return {
        index,
        key,
        stat: {
          category: CAT[key] as Localized,
          name: { en: row.stat, it: row.stat },
          home: row.home,
          away: row.away,
        } satisfies TeamStat,
      };
    })
    .sort((a, b) => {
      const catDiff = CAT_ORDER.indexOf(a.key) - CAT_ORDER.indexOf(b.key);
      return catDiff !== 0 ? catDiff : a.index - b.index;
    })
    .map((row) => row.stat);
}

function findRow(pack: LeagueMatchStats, needle: string) {
  const n = needle.toLowerCase();
  return pack.teamStats.find((r) => r.stat.toLowerCase() === n);
}

function parseNumber(raw: string): number | null {
  const cleaned = raw.replace('%', '').trim();
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

function parseRatioPct(raw: string): number | null {
  const m = raw.match(/(\d+(?:\.\d+)?)\s*\/\s*(\d+(?:\.\d+)?)/);
  if (!m) return null;
  const won = Number(m[1]);
  const total = Number(m[2]);
  if (!Number.isFinite(won) || !Number.isFinite(total) || total <= 0) return null;
  return Math.round((won / total) * 1000) / 10;
}

/** Build dynamics bars from the strongest %-style league metrics. */
export function mapLeagueDynamics(pack: LeagueMatchStats): DynamicMetric[] {
  const out: DynamicMetric[] = [];

  const possession = findRow(pack, 'Possession estimate %');
  if (possession) {
    const home = parseNumber(possession.home);
    const away = parseNumber(possession.away);
    if (home != null && away != null) {
      out.push({
        name: { en: 'Possession %', it: 'Possesso Palla %' },
        homeValue: home,
        awayValue: away,
        unit: '%',
      });
    }
  }

  const passAcc = findRow(pack, 'Pass accuracy % (full match)');
  if (passAcc) {
    const home = parseNumber(passAcc.home);
    const away = parseNumber(passAcc.away);
    if (home != null && away != null) {
      out.push({
        name: { en: 'Pass Accuracy %', it: 'Precisione Passaggi %' },
        homeValue: home,
        awayValue: away,
        unit: '%',
      });
    }
  }

  const shotAcc = findRow(pack, 'Shot accuracy %');
  if (shotAcc) {
    const home = parseNumber(shotAcc.home);
    const away = parseNumber(shotAcc.away);
    if (home != null && away != null) {
      out.push({
        name: { en: 'Shot Accuracy %', it: 'Precisione Tiri %' },
        homeValue: home,
        awayValue: away,
        unit: '%',
      });
    }
  }

  const ground = findRow(pack, 'Ground duels (won / total)');
  if (ground) {
    const home = parseRatioPct(ground.home);
    const away = parseRatioPct(ground.away);
    if (home != null && away != null) {
      out.push({
        name: { en: 'Ground Duels Won %', it: 'Duelli a Terra Vinti %' },
        homeValue: home,
        awayValue: away,
        unit: '%',
      });
    }
  }

  const aerial = findRow(pack, 'Aerial duels (won / total)');
  if (aerial) {
    const home = parseRatioPct(aerial.home);
    const away = parseRatioPct(aerial.away);
    if (home != null && away != null) {
      out.push({
        name: { en: 'Aerial Duels Won %', it: 'Duelli Aerei Vinti %' },
        homeValue: home,
        awayValue: away,
        unit: '%',
      });
    }
  }

  return out;
}

function parseScore(score: string): { home: number; away: number } {
  const [h, a] = score
    .replace('–', '-')
    .split('-')
    .map((n) => Number(n.trim()));
  return {
    home: Number.isFinite(h) ? h : 0,
    away: Number.isFinite(a) ? a : 0,
  };
}

/** Map keepers with saves into the Napoli GK comparison panel. */
export function mapLeagueGoalkeepers(
  pack: LeagueMatchStats
): GoalkeeperLog[] {
  const score = parseScore(pack.score);
  const shotsOnTarget = findRow(pack, 'Shots on target');
  const homeSot = shotsOnTarget ? parseNumber(shotsOnTarget.home) : null;
  const awaySot = shotsOnTarget ? parseNumber(shotsOnTarget.away) : null;

  const keepers = pack.playerStats
    .filter((p) => p.saves > 0)
    .sort((a, b) => {
      const aHome = a.team.toLowerCase() === pack.home.name.toLowerCase() ? 0 : 1;
      const bHome = b.team.toLowerCase() === pack.home.name.toLowerCase() ? 0 : 1;
      return aHome - bHome;
    });
  if (keepers.length === 0) return [];

  return keepers.map((p) => {
    const isHome = p.team.toLowerCase() === pack.home.name.toLowerCase();
    const saves = p.saves;
    const goalsConceded = isHome ? score.away : score.home;
    const shotsOnTargetFaced = isHome ? awaySot : homeSot;
    const shotsFaced =
      shotsOnTargetFaced != null
        ? Math.max(shotsOnTargetFaced, saves)
        : saves + goalsConceded;
    const savePct =
      shotsFaced > 0
        ? `${Math.round((saves / shotsFaced) * 1000) / 10}%`
        : undefined;

    return {
      name: p.player,
      minutes: 90,
      team: { en: p.team, it: p.team },
      jerseyColor: { en: '—', it: '—' },
      shotsFaced,
      shotsOnTargetFaced: shotsOnTargetFaced ?? undefined,
      saves,
      goalsConceded,
      savePercentage: savePct,
      passes: `${p.passes} (${p.passAccPct}%)`,
      colorClass: isHome ? ('blue' as const) : ('green' as const),
    };
  });
}
