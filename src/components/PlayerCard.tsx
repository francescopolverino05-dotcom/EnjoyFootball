import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import {
  playerInitials,
  playerPhotoUrl,
} from '../data/players';
import type { Player } from '../types/player';

interface PlayerCardProps {
  player: Player;
}

export default function PlayerCard({ player }: PlayerCardProps) {
  const { t } = useLanguage();
  const photo = playerPhotoUrl(player.photoPath);
  const squadClass =
    player.squad === 'U18'
      ? 'u18'
      : player.squad === 'Primavera'
        ? 'primavera'
        : player.squad === 'Trialist'
          ? 'trialist'
          : '';
  const squadLabel =
    player.squad == null
      ? t('playerValueTbd')
      : player.squad === 'U18'
        ? t('squadU18')
        : player.squad === 'Primavera'
          ? t('squadPrimavera')
          : player.squad === 'Trialist'
            ? t('squadTrialist')
            : player.squad;

  return (
    <Link to={`/players/${player.slug}`} className="match-card player-card">
      <div className="player-card-top">
        {photo ? (
          <img
            src={photo}
            alt={player.displayName}
            className="player-avatar"
            loading="lazy"
          />
        ) : (
          <div className="player-avatar player-avatar-initials" aria-hidden>
            {playerInitials(player.displayName)}
          </div>
        )}
        <div className="player-card-info">
          <div className="match-card-title notranslate" translate="no">
            {player.displayName}
          </div>
          <div className="player-card-position notranslate" translate="no">
            {player.positionShort}
          </div>
        </div>
      </div>
      <div className="match-card-meta">
        <span className={`squad-badge ${squadClass}`}>{squadLabel}</span>
      </div>
    </Link>
  );
}
