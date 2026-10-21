import { Link, useParams } from 'react-router-dom';
import AppearancesPanel from '../components/AppearancesPanel';
import Formations from '../components/Formations';
import ReportHeader from '../components/ReportHeader';
import Scoreboard from '../components/Scoreboard';
import StatsDashboard from '../components/StatsDashboard';
import Timeline from '../components/Timeline';
import { getMatchBySlug } from '../data/matches';
import {
  getLeagueMatchStats,
  isLeagueMatchCompetitionId,
} from '../data/leagueMatchStats';
import {
  mapLeagueDynamics,
  mapLeagueGoalkeepers,
  mapLeagueTeamStats,
} from '../data/leagueMatchStatsMap';
import { getOpponentBySlug } from '../data/opposition';
import {
  getPrimavera2Standings,
  getUefaYouthLeagueStandings,
} from '../data/standings';
import { useLanguage } from '../i18n/LanguageContext';
import { localize, type Localized } from '../i18n/translations';
import type { Formation, MatchData, TimelineEvent } from '../types/match';

function timelinePercent(minute: number): number {
  if (minute <= 45) return Math.max(2, Math.min(48, (minute / 45) * 50));
  return Math.max(52, Math.min(98, 50 + ((minute - 45) / 45) * 50));
}

function labelText(value: Localized): string {
  return localize(value, 'en').toLowerCase();
}

function formationMatchesOpponent(
  formationId: string,
  label: Localized,
  opponentId: string,
  opponentName: string
): boolean {
  const needle = opponentName.toLowerCase();
  return (
    formationId.includes(opponentId) || labelText(label).includes(needle)
  );
}

function buildMatchView(pack: NonNullable<ReturnType<typeof getLeagueMatchStats>>): MatchData {
  const [homeScore, awayScore] = pack.score
    .replace('–', '-')
    .split('-')
    .map((n) => Number(n.trim()));

  const homeOpp = getOpponentBySlug(pack.home.teamId);
  const awayOpp = getOpponentBySlug(pack.away.teamId);

  const homeTeam = {
    id: pack.home.teamId,
    name: { en: pack.home.name, it: pack.home.name },
    shortName: pack.home.name,
    colorClass:
      pack.home.teamId === 'napoli' ? ('u19' as const) : ('opponent' as const),
    logo:
      homeOpp?.logo ??
      (pack.home.teamId === 'napoli'
        ? 'napoli-logo.png'
        : `logos/${pack.home.teamId}.png`),
  };
  const awayTeam = {
    id: pack.away.teamId,
    name: { en: pack.away.name, it: pack.away.name },
    shortName: pack.away.name,
    colorClass: 'opponent' as const,
    logo: awayOpp?.logo ?? `logos/${pack.away.teamId}.png`,
  };

  const goals = pack.goals.map((g) => ({
    minute: g.minute,
    scorer: g.scorer,
    teamId: g.teamId,
  }));

  let timeline: TimelineEvent[] = pack.goals.map((g) => {
    const side =
      g.teamId === pack.home.teamId ? pack.home.name : pack.away.name;
    return {
      minute: g.minute,
      type: 'goal' as const,
      teamId: g.teamId,
      positionPercent: timelinePercent(g.minute),
      label: {
        en: `${g.scorer} (${side})`,
        it: `${g.scorer} (${side})`,
      },
    };
  });

  // Prefer full match-report timeline (subs + goals) when fixture is linked.
  if (pack.competitionId === 'primavera2') {
    for (const md of getPrimavera2Standings().matchdays) {
      const fx = md.fixtures.find((f) => f.statsSlug === pack.id);
      if (fx?.matchSlug) {
        const report = getMatchBySlug(fx.matchSlug);
        if (report?.timeline?.length) {
          timeline = report.timeline;
        }
        break;
      }
    }
  }

  let uylReport: MatchData | undefined;
  if (pack.competitionId === 'uefaYouthLeague') {
    for (const md of getUefaYouthLeagueStandings().groupTable?.matchdays ?? []) {
      const fx = md.fixtures.find((f) => f.statsSlug === pack.id);
      if (fx?.matchSlug) {
        uylReport = getMatchBySlug(fx.matchSlug);
        if (uylReport?.timeline?.length) {
          timeline = uylReport.timeline;
        }
        break;
      }
    }
  }

  const formations: Formation[] = [];
  if (uylReport?.formations?.length) formations.push(...uylReport.formations);
  const homeScout = homeOpp?.scoutedFormations?.find((f) =>
    formationMatchesOpponent(f.id, f.label, pack.away.teamId, pack.away.name)
  );
  if (homeScout && formations.length === 0) {
    formations.push({
      teamId: `${pack.home.teamId}-xi`,
      label: { en: pack.home.name, it: pack.home.name },
      system: homeScout.system,
      players: homeScout.players.map((p) => ({
        ...p,
        teamId: pack.home.teamId,
      })),
    });
  }

  const awayScout = awayOpp?.scoutedFormations?.find((f) =>
    formationMatchesOpponent(f.id, f.label, pack.home.teamId, pack.home.name)
  );
  if (awayScout && !uylReport?.formations?.length) {
    formations.push({
      teamId: `${pack.away.teamId}-xi`,
      label: { en: pack.away.name, it: pack.away.name },
      system: awayScout.system,
      players: awayScout.players.map((p) => ({
        ...p,
        teamId: pack.away.teamId,
      })),
    });
  }

  const compName =
    pack.competitionId === 'uefaYouthLeague' ? 'UEFA Youth League' : 'Primavera 2';

  return {
    id: pack.id,
    slug: pack.id,
    title: {
      en: `${pack.home.name} vs ${pack.away.name}`,
      it: `${pack.home.name} vs ${pack.away.name}`,
    },
    subtitle: {
      en:
        pack.matchday != null
          ? `${compName} · Matchday ${pack.matchday}`
          : compName,
      it:
        pack.matchday != null
          ? `${compName} · Giornata ${pack.matchday}`
          : compName,
    },
    date: pack.date,
    competitionId: pack.competitionId,
    competition: { en: compName, it: compName },
    status: 'published',
    homeTeam,
    awayTeam,
    score: {
      home: Number.isFinite(homeScore) ? homeScore : 0,
      away: Number.isFinite(awayScore) ? awayScore : 0,
    },
    goals,
    timeline,
    formations,
    dynamics: mapLeagueDynamics(pack),
    teamStats: mapLeagueTeamStats(pack),
    goalkeepers: mapLeagueGoalkeepers(pack),
    clips: [],
    analysisVideos: [],
    appearances: uylReport?.appearances,
  };
}

export default function LeagueMatchStatsPage() {
  const { competitionId = '', slug = '' } = useParams<{
    competitionId: string;
    slug: string;
  }>();
  const { t, L } = useLanguage();

  const pack =
    isLeagueMatchCompetitionId(competitionId) && slug
      ? getLeagueMatchStats(competitionId, slug)
      : undefined;

  if (!pack) {
    return (
      <div className="app-shell">
        <Link to="/table" className="back-link">
          {t('backToTable')}
        </Link>
        <div className="report-page">
          <p>{t('leagueMatchStatsNotFound')}</p>
        </div>
      </div>
    );
  }

  const match = buildMatchView(pack);
  const scoreLine = `${match.homeTeam.shortName} ${match.score!.home} – ${match.score!.away} ${match.awayTeam.shortName}`;

  const missingFormationSide =
    match.formations.length === 0
      ? `${pack.home.name} & ${pack.away.name}`
      : match.formations.length === 1
        ? match.formations[0].teamId.startsWith(pack.home.teamId)
          ? pack.away.name
          : pack.home.name
        : null;

  return (
    <div className="app-shell">
      <Link to="/table" className="back-link">
        {t('backToTable')}
      </Link>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('teamSheet')}
          matchTitle={scoreLine}
          matchDate={match.date}
          competition={L(match.subtitle)}
        />
        <Scoreboard match={match} />
        <Timeline events={match.timeline} />
        {match.formations.length > 0 ? (
          <Formations formations={match.formations} />
        ) : null}
        {match.appearances ? (
          <AppearancesPanel
            appearances={match.appearances}
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
          />
        ) : null}
        {missingFormationSide ? (
          <p className="home-section-hint">
            {t('leagueMatchStatsFormationMissing').replace(
              '{teams}',
              missingFormationSide
            )}
          </p>
        ) : null}
      </div>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('tacticalDashboard')}
          matchTitle={scoreLine}
          matchDate={match.date}
          competition={L(match.subtitle)}
        />
        <StatsDashboard
          match={match}
          hideEmptyTabs
          playerStats={{
            homeName: pack.home.name,
            awayName: pack.away.name,
            players: pack.playerStats,
          }}
        />

        {pack.note ? (
          <p className="home-section-hint league-match-note">{L(pack.note)}</p>
        ) : null}
      </div>
    </div>
  );
}
