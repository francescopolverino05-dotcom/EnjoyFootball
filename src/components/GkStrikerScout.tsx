import { useMemo, useState } from 'react';
import MatchMedia from './MatchMedia';
import { useLanguage } from '../i18n/LanguageContext';
import type {
  GkFootSide,
  GkFootZone,
  GkShot,
  GkShotType,
  GkStrikerProfile,
} from '../types/opposition';

const SHOT_COLORS: Record<GkShotType, string> = {
  'outside-box': '#2f9e44',
  'inside-box': '#0054a6',
  penalty: '#6b7280',
  'free-kick': '#e8590c',
};

const FOOT_ZONES: GkFootZone[] = ['inside', 'toe', 'outside'];

function shotColor(type: GkShotType): string {
  return SHOT_COLORS[type];
}

function countZones(shots: GkShot[], side: GkFootSide): Record<GkFootZone, number> {
  const counts: Record<GkFootZone, number> = { inside: 0, toe: 0, outside: 0 };
  for (const shot of shots) {
    if (shot.foot === side) counts[shot.footZone] += 1;
  }
  return counts;
}

function zoneFill(count: number, max: number): string {
  if (max <= 0 || count <= 0) return 'rgba(0, 84, 166, 0.08)';
  const t = count / max;
  return `rgba(0, 84, 166, ${0.18 + t * 0.72})`;
}

function FootGraphic({
  side,
  counts,
  max,
}: {
  side: GkFootSide;
  counts: Record<GkFootZone, number>;
  max: number;
}) {
  const { t } = useLanguage();
  const flip = side === 'left';
  return (
    <div className="gk-foot">
      <div className="gk-foot-label">
        {side === 'left' ? t('oppositionGkFootLeft') : t('oppositionGkFootRight')}
      </div>
      <svg
        className="gk-foot-svg"
        viewBox="0 0 120 200"
        role="img"
        aria-label={side === 'left' ? t('oppositionGkFootLeft') : t('oppositionGkFootRight')}
      >
        <g transform={flip ? 'translate(120,0) scale(-1,1)' : undefined}>
          <path
            d="M38 18 C58 8 88 14 96 42 C104 72 102 108 92 138 C86 158 78 176 62 188 C48 196 36 190 32 176 C26 152 24 118 26 86 C28 54 30 28 38 18 Z"
            fill="#f3f4f6"
            stroke="#9ca3af"
            strokeWidth="2"
          />
          <path
            d="M40 22 C56 14 82 20 90 44 C86 70 70 78 52 72 C40 66 34 48 40 22 Z"
            fill={zoneFill(counts.toe, max)}
            stroke="#fff"
            strokeWidth="1.5"
          />
          <path
            d="M32 78 C36 58 48 70 58 88 C70 112 74 148 62 176 C50 188 38 178 34 160 C28 132 28 100 32 78 Z"
            fill={zoneFill(counts.inside, max)}
            stroke="#fff"
            strokeWidth="1.5"
          />
          <path
            d="M62 76 C78 70 96 78 98 108 C100 136 92 160 80 176 C72 168 70 140 64 112 C60 96 58 84 62 76 Z"
            fill={zoneFill(counts.outside, max)}
            stroke="#fff"
            strokeWidth="1.5"
          />
        </g>
      </svg>
      <ul className="gk-foot-legend">
        {FOOT_ZONES.map((zone) => (
          <li key={zone}>
            <span
              className="gk-foot-swatch"
              style={{ background: zoneFill(counts[zone], Math.max(max, 1)) }}
            />
            {t(
              zone === 'inside'
                ? 'oppositionGkFootInside'
                : zone === 'toe'
                  ? 'oppositionGkFootToe'
                  : 'oppositionGkFootOutside'
            )}
            {` · ${counts[zone]}`}
          </li>
        ))}
      </ul>
    </div>
  );
}

function ShotPitch({
  shots,
  activeId,
  onSelect,
}: {
  shots: GkShot[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="gk-shot-pitch" aria-label={t('oppositionGkPitchTitle')}>
      <div className="gk-shot-pitch-field">
        <div className="gk-shot-box gk-shot-box-18" />
        <div className="gk-shot-box gk-shot-box-6" />
        <div className="gk-shot-spot" />
        <div className="gk-shot-goal-line" />
        {shots.map((shot) => (
          <button
            key={shot.id}
            type="button"
            className={`gk-shot-dot ${activeId === shot.id ? 'active' : ''}`}
            style={{
              left: `${shot.pitchX}%`,
              top: `${100 - shot.pitchY}%`,
              background: shotColor(shot.type),
            }}
            title={typeof shot.title === 'string' ? shot.title : shot.title.en}
            aria-pressed={activeId === shot.id}
            onClick={() => onSelect(shot.id)}
          />
        ))}
      </div>
    </div>
  );
}

function GoalFrame({
  shots,
  activeId,
  onSelect,
}: {
  shots: GkShot[];
  activeId: string | null;
  onSelect: (id: string) => void;
}) {
  const { t } = useLanguage();
  return (
    <div className="gk-goal" aria-label={t('oppositionGkGoalTitle')}>
      <div className="gk-goal-bar" />
      <div className="gk-goal-mouth">
        <div className="gk-goal-net" />
        {shots.map((shot) => (
          <button
            key={shot.id}
            type="button"
            className={`gk-shot-dot gk-shot-dot-goal ${activeId === shot.id ? 'active' : ''}`}
            style={{
              left: `${shot.goalX}%`,
              top: `${shot.goalY}%`,
              background: shotColor(shot.type),
            }}
            title={typeof shot.title === 'string' ? shot.title : shot.title.en}
            aria-pressed={activeId === shot.id}
            onClick={() => onSelect(shot.id)}
          />
        ))}
      </div>
    </div>
  );
}

export default function GkStrikerScout({
  striker,
  mediaSlug,
}: {
  striker: GkStrikerProfile;
  mediaSlug: string;
}) {
  const { t, L } = useLanguage();
  const [activeId, setActiveId] = useState<string | null>(striker.shots[0]?.id ?? null);
  const left = useMemo(() => countZones(striker.shots, 'left'), [striker.shots]);
  const right = useMemo(() => countZones(striker.shots, 'right'), [striker.shots]);
  const maxZone = Math.max(
    ...FOOT_ZONES.map((z) => left[z]),
    ...FOOT_ZONES.map((z) => right[z]),
    1
  );
  const active = striker.shots.find((s) => s.id === activeId) ?? null;
  const byType = striker.shots.reduce(
    (acc, shot) => {
      acc[shot.type] += 1;
      return acc;
    },
    { 'outside-box': 0, 'inside-box': 0, penalty: 0, 'free-kick': 0 } as Record<
      GkShotType,
      number
    >
  );

  return (
    <article className="gk-striker-card">
      <header className="gk-striker-head">
        <h3 className="gk-striker-name">
          {striker.number != null ? `${striker.number} ` : ''}
          {striker.name}
        </h3>
        {striker.isSample ? (
          <span className="gk-sample-badge">{t('oppositionGkSampleBadge')}</span>
        ) : null}
        <span className="gk-striker-count">
          {t('oppositionGkShotCount').replace('{n}', String(striker.shots.length))}
        </span>
      </header>

      <div className="gk-shot-legend" aria-label={t('oppositionGkLegend')}>
        {(
          [
            ['outside-box', 'oppositionGkShotOutside'],
            ['inside-box', 'oppositionGkShotInside'],
            ['penalty', 'oppositionGkShotPenalty'],
            ['free-kick', 'oppositionGkShotFreeKick'],
          ] as const
        ).map(([type, key]) => (
          <span key={type} className="gk-shot-legend-item">
            <span className="gk-shot-swatch" style={{ background: shotColor(type) }} />
            {t(key)}
            {` (${byType[type]})`}
          </span>
        ))}
      </div>

      <div className="gk-striker-graphics">
        <div>
          <div className="gk-graphic-title">{t('oppositionGkPitchTitle')}</div>
          <ShotPitch shots={striker.shots} activeId={activeId} onSelect={setActiveId} />
        </div>
        <div>
          <div className="gk-graphic-title">{t('oppositionGkGoalTitle')}</div>
          <GoalFrame shots={striker.shots} activeId={activeId} onSelect={setActiveId} />
        </div>
        <div className="gk-feet-row">
          <div className="gk-graphic-title">{t('oppositionGkFeetTitle')}</div>
          <div className="gk-feet">
            <FootGraphic side="left" counts={left} max={maxZone} />
            <FootGraphic side="right" counts={right} max={maxZone} />
          </div>
        </div>
      </div>

      {active ? (
        <p className="gk-active-shot">
          {L(active.title)}
          {active.videoFile ? ` · ${t('oppositionGkHasVideo')}` : ''}
        </p>
      ) : null}

      <div className="gk-striker-clips">
        <div className="gk-graphic-title">{t('oppositionGkStrikerClips')}</div>
        <p className="video-hint">{t('oppositionGkStrikerClipsHint')}</p>
        {striker.clips.length === 0 ? (
          <p className="home-empty">{t('oppositionGkStrikerClipsEmpty')}</p>
        ) : (
          <div className="analysis-grid">
            {striker.clips.map((clip) => (
              <article className="analysis-card" key={clip.id}>
                <MatchMedia
                  slug={mediaSlug}
                  src={clip.videoFile}
                  kind="clips"
                  unsupportedLabel={t('videoUnsupported')}
                  playLabel={t('playVideo')}
                  title={L(clip.title)}
                />
                <div className="clip-card-body">
                  <div className="clip-card-title">{L(clip.title)}</div>
                  {clip.comments ? (
                    <div className="clip-card-desc">{L(clip.comments)}</div>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </article>
  );
}
