import { Formation } from '../types/match';
import { useLanguage } from '../i18n/LanguageContext';
import { mediaUrl } from '../utils/mediaUrl';
import { withGoalkeeperInSystem } from '../utils/formationSystem';

interface FormationsProps {
  formations: Formation[];
  matchSlug?: string;
}

export default function Formations({ formations, matchSlug }: FormationsProps) {
  const { t, L } = useLanguage();

  return (
    <>
      <div className="section-title">{t('tacticalSetup')}</div>
      <div className="formations-grid">
        {formations.map((formation) => (
          <div className="tactical-pitch-card" key={formation.teamId}>
            <div className="pitch-header">
              {L(formation.label)} ({withGoalkeeperInSystem(formation.system)})
            </div>
            {formation.image && matchSlug ? (
              <div className="formation-image-wrap">
                <img
                  className="formation-image"
                  src={mediaUrl(matchSlug, formation.image)}
                  alt={`${L(formation.label)} ${withGoalkeeperInSystem(formation.system)}`}
                />
              </div>
            ) : null}
            <div className="pitch-canvas">
              <div className="pitch-center-line" />
              <div className="pitch-center-circle" />
              <div className="pitch-penalty-area bottom" />
              <div className="pitch-penalty-area top" />
              {formation.players.map((player) => (
                <div
                  key={`${player.number}-${player.name}-${player.left}`}
                  className={`pitch-player ${player.isGk ? 'gk' : player.teamId}`}
                  style={{
                    top: player.top,
                    bottom: player.bottom,
                    left: player.left,
                  }}
                >
                  <span className="pitch-player-name">
                    {player.name} ({player.number})
                  </span>
                  {player.number}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
