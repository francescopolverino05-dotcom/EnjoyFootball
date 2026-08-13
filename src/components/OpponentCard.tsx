import { Link } from 'react-router-dom';
import { teamCrestUrl } from '../data/teamLogos';
import { useLanguage } from '../i18n/LanguageContext';
import type { OppositionOpponent } from '../types/opposition';

interface OpponentCardProps {
  opponent: OppositionOpponent;
  isNext?: boolean;
  nextDate?: string;
}

export default function OpponentCard({
  opponent,
  isNext,
  nextDate,
}: OpponentCardProps) {
  const { t, L, formatDate } = useLanguage();

  return (
    <Link
      to={`/opposition/${opponent.slug}`}
      className={`match-card opponent-card ${isNext ? 'opponent-card--next' : ''}`}
    >
      {isNext ? (
        <div className="opponent-next-badge">{t('oppositionNextBadge')}</div>
      ) : null}
      <img
        src={teamCrestUrl({ logo: opponent.logo }, 'onLight')}
        alt={L(opponent.name)}
        className="opponent-card-crest"
      />
      <div className="match-card-title notranslate" translate="no">
        {L(opponent.name)}
      </div>
      {isNext && nextDate ? (
        <div className="opponent-card-next-date">{formatDate(nextDate)}</div>
      ) : null}
    </Link>
  );
}
