import { Link } from 'react-router-dom';
import { MatchSummary } from '../types/match';

interface MatchCardProps {
  match: MatchSummary;
}

export default function MatchCard({ match }: MatchCardProps) {
  return (
    <Link to={`/match/${match.slug}`} className="match-card">
      <div className="match-card-date">
        {formatDate(match.date)} · {match.competition}
      </div>
      <div className="match-card-title">{match.title}</div>
      <div className="match-card-score">
        {match.score.home} – {match.score.away}
      </div>
      <div className="match-card-meta">
        <span>
          {match.homeTeam} vs {match.awayTeam}
        </span>
        <span className={`status-badge ${match.status}`}>{statusLabel(match.status)}</span>
      </div>
    </Link>
  );
}

function formatDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

function statusLabel(status: MatchSummary['status']): string {
  switch (status) {
    case 'published':
      return 'Pubblicato';
    case 'in-review':
      return 'In revisione';
    case 'draft':
      return 'Bozza';
  }
}
