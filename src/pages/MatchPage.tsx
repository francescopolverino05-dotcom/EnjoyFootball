import { Link, useParams } from 'react-router-dom';
import { getMatchBySlug } from '../data/matches';
import ReportHeader from '../components/ReportHeader';
import Scoreboard from '../components/Scoreboard';
import Timeline from '../components/Timeline';
import Formations from '../components/Formations';
import StatsDashboard from '../components/StatsDashboard';

export default function MatchPage() {
  const { slug } = useParams<{ slug: string }>();
  const match = slug ? getMatchBySlug(slug) : undefined;

  if (!match) {
    return (
      <div className="app-shell">
        <Link to="/" className="back-link">
          ← Torna alle partite
        </Link>
        <div className="report-page">
          <p>Partita non trovata.</p>
        </div>
      </div>
    );
  }

  const scoreLine = `${match.homeTeam.shortName} ${match.score.home} – ${match.score.away} ${match.awayTeam.shortName}`;

  return (
    <div className="app-shell">
      <Link to="/" className="back-link">
        ← Torna alle partite
      </Link>

      <div className="report-page">
        <ReportHeader
          pageTitle="DISTINTA DI GARA"
          matchTitle={scoreLine}
          matchDate={match.date}
          competition={match.subtitle}
        />
        <Scoreboard match={match} />
        <Timeline events={match.timeline} />
        <Formations formations={match.formations} />
      </div>

      <div className="report-page">
        <ReportHeader
          pageTitle="DASHBOARD TATTICA"
          matchTitle={scoreLine}
          matchDate={match.date}
          competition={match.subtitle}
        />
        <StatsDashboard match={match} />
      </div>
    </div>
  );
}
