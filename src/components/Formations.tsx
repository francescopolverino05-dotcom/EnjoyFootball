import { Formation } from '../types/match';
import { useLanguage } from '../i18n/LanguageContext';

interface FormationsProps {
  formations: Formation[];
}

export default function Formations({ formations }: FormationsProps) {
  const { t, L } = useLanguage();

  return (
    <>
      <div className="section-title">{t('tacticalSetup')}</div>
      <div className="formations-grid">
        {formations.map((formation) => (
          <div className="tactical-pitch-card" key={formation.teamId}>
            <div className="pitch-header">
              {L(formation.label)} ({formation.system})
            </div>
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
