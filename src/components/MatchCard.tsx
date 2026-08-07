import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import { teamCrestUrl } from '../data/teamLogos';
import { MatchSummary } from '../types/match';

interface MatchCardProps {
  match: MatchSummary;
}

export default function MatchCard({ match }: MatchCardProps) {
  const { t, L, formatDate } = useLanguage();

  return (
    <Link to={`/match/${match.slug}`} className="match-card">
      <div className="match-card-date">
        {formatDate(match.date)} · {L(match.competition)}
      </div>
      <div className="match-card-title">{L(match.title)}</div>
      <div className="match-card-scoreline">
        <div className={`match-card-team ${match.homeColorClass}`}>
          <img
            src={teamCrestUrl({ logo: match.homeLogo }, 'onLight')}
            alt={match.homeTeam}
            className="match-card-crest"
          />
          <span>{match.homeTeam}</span>
        </div>
        <div className="match-card-score">
          {match.score.home} – {match.score.away}
        </div>
        <div className={`match-card-team match-card-team-away ${match.awayColorClass}`}>
          <span>{match.awayTeam}</span>
          <img
            src={teamCrestUrl({ logo: match.awayLogo }, 'onLight')}
            alt={match.awayTeam}
            className="match-card-crest"
          />
        </div>
      </div>
      <div className="match-card-meta">
        <span>
          {match.homeTeam} vs {match.awayTeam}
        </span>
        <span className={`status-badge ${match.status}`}>
          {statusLabel(match.status, t)}
        </span>
      </div>
    </Link>
  );
}

function statusLabel(
  status: MatchSummary['status'],
  t: (key: 'statusPublished' | 'statusInReview' | 'statusDraft') => string
): string {
  switch (status) {
    case 'published':
      return t('statusPublished');
    case 'in-review':
      return t('statusInReview');
    case 'draft':
      return t('statusDraft');
  }
}
