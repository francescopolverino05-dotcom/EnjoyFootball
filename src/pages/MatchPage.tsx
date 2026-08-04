import { Link, useParams } from 'react-router-dom';
import { getMatchBySlug } from '../data/matches';
import ReportHeader from '../components/ReportHeader';
import Scoreboard from '../components/Scoreboard';
import Timeline from '../components/Timeline';
import Formations from '../components/Formations';
import StatsDashboard from '../components/StatsDashboard';
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

  const scoreLine = `${match.homeTeam.shortName} ${match.score.home} – ${match.score.away} ${match.awayTeam.shortName}`;

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
        <Scoreboard match={match} />
        <Timeline events={match.timeline} />
        <Formations formations={match.formations} />
      </div>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('tacticalDashboard')}
          matchTitle={scoreLine}
          matchDate={match.date}
          competition={L(match.subtitle)}
        />
        <StatsDashboard match={match} />
      </div>
    </div>
  );
}
