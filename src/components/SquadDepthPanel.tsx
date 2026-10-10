import { useLanguage } from '../i18n/LanguageContext';
import type { OppositionSquadDepth } from '../types/opposition';
import { withGoalkeeperInSystem } from '../utils/formationSystem';

interface SquadDepthPanelProps {
  depth: OppositionSquadDepth;
  teamId: string;
}

export default function SquadDepthPanel({ depth, teamId }: SquadDepthPanelProps) {
  const { t, L } = useLanguage();

  return (
    <div className="squad-depth-panel">
      <div className="section-title">{t('oppositionSquadDepth')}</div>
      <p className="video-hint">
        {depth.note ? L(depth.note) : t('oppositionSquadDepthHint')}
      </p>

      <div className="tactical-pitch-card squad-depth-pitch-card">
        <div className="pitch-header">
          {t('oppositionSquadDepthFirstXi')} (
          {withGoalkeeperInSystem(depth.system)})
        </div>
        <div className="pitch-canvas squad-depth-canvas">
          <div className="pitch-center-line" />
          <div className="pitch-center-circle" />
          <div className="pitch-penalty-area bottom" />
          <div className="pitch-penalty-area top" />
          {depth.slots.map((slot) => (
            <div
              key={slot.role}
              className={`squad-depth-slot ${slot.role === 'GK' ? 'is-gk' : ''}`}
              style={{ top: slot.top, left: slot.left }}
            >
              <div
                className={`pitch-player ${slot.role === 'GK' ? 'gk' : teamId}`}
                title={slot.role}
              />
              <div className="squad-depth-stack">
                {slot.players.map((p, index) => (
                  <div
                    key={`${slot.role}-${p.name}`}
                    className={`squad-depth-stack-name ${index === 0 ? 'primary' : ''}`}
                  >
                    <span className="squad-depth-stack-label">{p.name}</span>
                    <span className="squad-depth-starts">{p.starts}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
