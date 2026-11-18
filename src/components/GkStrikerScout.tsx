import { useMemo, useState } from 'react';
import MatchMedia from './MatchMedia';
import { useLanguage } from '../i18n/LanguageContext';
import type { UiKey } from '../i18n/translations';
import type {
  GkFootSide,
  GkFootZone,
  GkShot,
  GkShotOutcome,
  GkShotType,
  GkStrikerProfile,
} from '../types/opposition';

const SHOT_COLORS: Record<GkShotType, string> = {
  'outside-box': '#2f9e44',
  'inside-box': '#0054a6',
  penalty: '#6b7280',
  'free-kick': '#e8590c',
};

const FOOT_ZONES: GkFootZone[] = ['inside', 'laces', 'toe', 'outside'];

const FOOT_ZONE_KEYS: Record<GkFootZone, UiKey> = {
  inside: 'oppositionGkFootInside',
  laces: 'oppositionGkFootLaces',
  toe: 'oppositionGkFootToe',
  outside: 'oppositionGkFootOutside',
};

const OUTCOMES: GkShotOutcome[] = ['goal', 'saved', 'off-target', 'woodwork'];

const OUTCOME_KEYS: Record<GkShotOutcome, UiKey> = {
  goal: 'oppositionGkOutcomeGoal',
  saved: 'oppositionGkOutcomeSaved',
  'off-target': 'oppositionGkOutcomeOffTarget',
  woodwork: 'oppositionGkOutcomeWoodwork',
};

/** Clamp off-frame goal coordinates into a visible margin around the mouth. */
const GOAL_MARGIN_X = 16;
const GOAL_MARGIN_Y_TOP = 20;
const GOAL_MARGIN_Y_BOTTOM = 10;

function shotColor(type: GkShotType): string {
  return SHOT_COLORS[type];
}

function countZones(shots: GkShot[], side: GkFootSide): Record<GkFootZone, number> {
  const counts: Record<GkFootZone, number> = { inside: 0, laces: 0, toe: 0, outside: 0 };
  for (const shot of shots) {
    if (shot.foot === side && shot.footZone) counts[shot.footZone] += 1;
  }
  return counts;
}

function zoneFill(count: number, max: number): string {
  if (max <= 0 || count <= 0) return 'rgba(0, 84, 166, 0.08)';
  const t = count / max;
  return `rgba(0, 84, 166, ${0.18 + t * 0.72})`;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function isOffFrame(shot: GkShot): boolean {
  return (
    shot.goalX != null &&
    shot.goalY != null &&
    (shot.goalX < 0 || shot.goalX > 100 || shot.goalY < 0 || shot.goalY > 100)
  );
}

function goalDotPos(shot: GkShot): { left: number; top: number } {
  return {
    left: clamp(shot.goalX as number, -GOAL_MARGIN_X, 100 + GOAL_MARGIN_X),
    top: clamp(shot.goalY as number, -GOAL_MARGIN_Y_TOP, 100 + GOAL_MARGIN_Y_BOTTOM),
  };
}

function shotTitleText(shot: GkShot): string {
  return typeof shot.title === 'string' ? shot.title : shot.title.en;
}

function outcomeClass(shot: GkShot): string {
  const parts = ['gk-shot-dot'];
  if (shot.outcome) parts.push(`gk-shot-outcome-${shot.outcome}`);
  if (isOffFrame(shot) || shot.outcome === 'off-target') parts.push('gk-shot-dot-miss');
  return parts.join(' ');
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
            d="M40 20 C56 12 82 18 91 40 C86 54 72 60 52 58 C40 54 34 36 40 20 Z"
            fill={zoneFill(counts.toe, max)}
            stroke="#fff"
            strokeWidth="1.5"
          />
          <path
            d="M48 58 C64 52 84 60 90 82 C88 100 76 112 58 110 C46 108 42 80 48 58 Z"
            fill={zoneFill(counts.laces, max)}
            stroke="#fff"
            strokeWidth="1.5"
          />
          <path
            d="M30 82 C34 66 42 80 50 100 C60 126 66 156 58 176 C46 188 36 176 32 158 C26 130 26 102 30 82 Z"
            fill={zoneFill(counts.inside, max)}
            stroke="#fff"
            strokeWidth="1.5"
          />
          <path
            d="M72 78 C86 70 99 82 100 110 C102 138 92 162 80 178 C72 168 70 140 66 114 C64 96 66 84 72 78 Z"
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
            {t(FOOT_ZONE_KEYS[zone])}
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
        {shots
          .filter((shot) => shot.pitchX != null && shot.pitchY != null)
          .map((shot) => (
          <button
            key={shot.id}
            type="button"
            className={`${outcomeClass(shot)} ${activeId === shot.id ? 'active' : ''}`}
            style={{
              left: `${shot.pitchX}%`,
              top: `${100 - (shot.pitchY as number)}%`,
              background: shotColor(shot.type),
              borderColor: shotColor(shot.type),
            }}
            title={shotTitleText(shot)}
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
      <div className="gk-goal-pad">
        <div className="gk-goal-bar" />
        <div className="gk-goal-mouth">
          <div className="gk-goal-net" />
          {shots
            .filter((shot) => shot.goalX != null && shot.goalY != null)
            .map((shot) => {
              const pos = goalDotPos(shot);
              const miss = isOffFrame(shot) || shot.outcome === 'off-target';
              return (
                <button
                  key={shot.id}
                  type="button"
                  className={`gk-shot-dot-goal ${outcomeClass(shot)} ${activeId === shot.id ? 'active' : ''}`}
                  style={{
                    left: `${pos.left}%`,
                    top: `${pos.top}%`,
                    background: miss ? '#fff' : shotColor(shot.type),
                    borderColor: shotColor(shot.type),
                  }}
                  title={shotTitleText(shot)}
                  aria-label={
                    miss
                      ? `${shotTitleText(shot)} (${t('oppositionGkOutcomeOffTarget')})`
                      : shotTitleText(shot)
                  }
                  aria-pressed={activeId === shot.id}
                  onClick={() => onSelect(shot.id)}
                />
              );
            })}
        </div>
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
  const headCount = striker.shots.filter((s) => s.body === 'head').length;
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
  const byOutcome = striker.shots.reduce(
    (acc, shot) => {
      if (shot.outcome) acc[shot.outcome] += 1;
      return acc;
    },
    { goal: 0, saved: 0, 'off-target': 0, woodwork: 0 } as Record<GkShotOutcome, number>
  );
  const hasOutcomes = striker.shots.some((s) => s.outcome);

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
      {hasOutcomes ? (
        <div className="gk-shot-legend gk-outcome-legend" aria-label={t('oppositionGkOutcomeLegend')}>
          {OUTCOMES.filter((outcome) => byOutcome[outcome] > 0).map((outcome) => (
            <span key={outcome} className="gk-shot-legend-item">
              <span className={`gk-outcome-swatch gk-shot-outcome-${outcome}`} />
              {t(OUTCOME_KEYS[outcome])}
              {` (${byOutcome[outcome]})`}
            </span>
          ))}
        </div>
      ) : null}
      {headCount > 0 ? (
        <p className="gk-active-shot gk-header-note">
          {L({
            en: `Headers recorded: ${headCount} (not shaded on the feet).`,
            it: `Colpi di testa registrati: ${headCount} (non ombreggiati sui piedi).`,
          })}
        </p>
      ) : null}

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
          {active.outcome ? ` · ${t(OUTCOME_KEYS[active.outcome])}` : ''}
          {active.videoFile ? ` · ${t('oppositionGkHasVideo')}` : ''}
        </p>
      ) : null}

      <div className="gk-striker-clips">
        <div className="gk-graphic-title">{t('oppositionGkStrikerClips')}</div>
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
