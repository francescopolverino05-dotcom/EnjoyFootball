import { Formation, PitchPlayer } from '../types/match';
import { useLanguage } from '../i18n/LanguageContext';
import { mediaUrl } from '../utils/mediaUrl';
import { withGoalkeeperInSystem } from '../utils/formationSystem';
import { localizePdfPosition } from '../i18n/positions';

interface FormationsProps {
  formations: Formation[];
  matchSlug?: string;
}

export default function Formations({ formations, matchSlug }: FormationsProps) {
  const { t, L, locale } = useLanguage();

  const renderPitch = (players: PitchPlayer[]) => {
    const placed = players.filter((player) => !player.positionUnknown);
    const unplaced = players.filter((player) => player.positionUnknown);
    const xiList = unplaced
      .map((player) => (player.number ? `${player.number} ${player.name}` : player.name))
      .join(', ');
    return (
      <>
            {placed.length > 0 ? (
            <div className="pitch-canvas">
              <div className="pitch-center-line" />
              <div className="pitch-center-circle" />
              <div className="pitch-penalty-area bottom" />
              <div className="pitch-penalty-area top" />
              {placed.map((player) => (
                <div
                  key={`${player.number}-${player.name}-${player.left}`}
                  className={`pitch-player ${player.isGk ? 'gk' : player.teamId}`}
                  style={{
                    top: player.top,
                    bottom: player.bottom,
                    left: player.left,
                  }}
                >
                  <span className="pitch-player-name">{player.name}</span>
                  {player.number != null && player.number > 0 ? player.number : ''}
                </div>
              ))}
            </div>
            ) : null}
            {xiList ? <div className="pitch-unplaced">{xiList}</div> : null}
      </>
    );
  };

  return (
    <>
      <div className="section-title">{t('tacticalSetup')}</div>
      <div className="formations-grid">
        {formations.map((formation) => (
          <div className="tactical-pitch-card" key={formation.teamId}>
            <div className="pitch-header">
              {L(formation.label)}
              {formation.system.trim()
                ? ` (${withGoalkeeperInSystem(formation.system)})`
                : ''}
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
            {renderPitch(formation.players)}
            {(formation.changes ?? []).map((change) => (
              <div className="formation-change" key={`${formation.teamId}-${change.minute}`}>
                <div className="pitch-header">
                  {change.minute}' · {withGoalkeeperInSystem(change.system)}
                  {change.note ? ` · ${L(change.note)}` : ''}
                </div>
                {renderPitch(change.players)}
              </div>
            ))}
            {formation.subs ? (
              <div className="formation-subs">
                <div className="formation-subs-title">{t('oppositionSubsCameOn')}</div>
                {formation.subs.length === 0 ? (
                  <div className="formation-subs-empty">—</div>
                ) : (
                  <ul>
                    {formation.subs.map((s, i) => (
                      <li key={`${s.name}-${i}`}>
                        <span className="formation-subs-role">{s.role ? localizePdfPosition(s.role, locale) : '–'}</span>
                        <span className="formation-subs-name">{s.name}</span>
                        {s.minute ? <span className="formation-subs-min">{s.minute}</span> : null}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ) : null}
          </div>
        ))}
      </div>
    </>
  );
}
