import { Link, useParams } from 'react-router-dom';
import { getMatchBySlug } from '../data/matches';
import { getLeagueMatchStatsForMatchSlug } from '../data/leagueMatchStats';
import {
  mapLeagueDynamics,
  mapLeagueGoalkeepers,
  mapLeagueTeamStats,
} from '../data/leagueMatchStatsMap';
import { getMicrocycleDay } from '../data/microcycleDays';
import ReportHeader from '../components/ReportHeader';
import Scoreboard from '../components/Scoreboard';
import Timeline from '../components/Timeline';
import Formations from '../components/Formations';
import AppearancesPanel from '../components/AppearancesPanel';
import StatsDashboard from '../components/StatsDashboard';
import MicrocycleDayBadge from '../components/MicrocycleDayBadge';
import { useLanguage } from '../i18n/LanguageContext';

export default function MatchPage() {
  const { slug } = useParams<{ slug: string }>();
  const match = slug ? getMatchBySlug(slug) : undefined;
  const { t, L } = useLanguage();

  if (!match) {
    return (
      <div className="app-shell">
        <Link to="/matches" className="back-link">
          {t('backToMatches')}
        </Link>
        <div className="report-page">
          <p>{t('matchNotFound')}</p>
        </div>
      </div>
    );
  }

  const scoreLine =
    match.score == null
      ? `${match.homeTeam.shortName} vs ${match.awayTeam.shortName}`
      : `${match.homeTeam.shortName} ${match.score.home} – ${match.score.away} ${match.awayTeam.shortName}`;
  const microcycleDay = getMicrocycleDay(match.slug);
  const leagueSheet = getLeagueMatchStatsForMatchSlug(match.slug);
  const statsMatch =
    leagueSheet && match.teamStats.length === 0
      ? {
          ...match,
          teamStats: mapLeagueTeamStats(leagueSheet.pack),
          dynamics:
            match.dynamics.length > 0
              ? match.dynamics
              : mapLeagueDynamics(leagueSheet.pack),
          goalkeepers:
            match.goalkeepers.length > 0
              ? match.goalkeepers
              : mapLeagueGoalkeepers(leagueSheet.pack),
        }
      : match;

  return (
    <div className="app-shell">
      <Link to="/matches" className="back-link">
        {t('backToMatches')}
      </Link>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('teamSheet')}
          matchTitle={scoreLine}
          matchDate={match.date}
          competition={L(match.subtitle)}
        />
        {microcycleDay ? (
          <div className="match-microcycle-day">
            <MicrocycleDayBadge day={microcycleDay} className="microcycle-day-badge--hero" />
          </div>
        ) : null}
        <Scoreboard match={match} />
        <Timeline events={match.timeline} />
        <Formations formations={match.formations} matchSlug={match.slug} />
        {match.appearances ? (
          <AppearancesPanel
            appearances={match.appearances}
            homeTeam={match.homeTeam}
            awayTeam={match.awayTeam}
          />
        ) : null}
      </div>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('tacticalDashboard')}
          matchTitle={scoreLine}
          matchDate={match.date}
          competition={L(match.subtitle)}
        />
        {leagueSheet ? (
          <p className="home-section-hint">
            <Link to={`/stats/${leagueSheet.competitionId}/${leagueSheet.slug}`}>
              {t('matchOpenLeagueStats')}
            </Link>
          </p>
        ) : null}
        <StatsDashboard
          match={statsMatch}
          playerStats={
            leagueSheet
              ? {
                  homeName: leagueSheet.pack.home.name,
                  awayName: leagueSheet.pack.away.name,
                  players: leagueSheet.pack.playerStats,
                }
              : undefined
          }
        />
      </div>
    </div>
  );
}
