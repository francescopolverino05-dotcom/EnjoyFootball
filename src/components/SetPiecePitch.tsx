import { useId } from 'react';
import type { SpArrow, SpOutcome, SpPanel } from '../data/setPieces';
import { useLanguage } from '../i18n/LanguageContext';

const W = { fill: 'none', stroke: '#fff', strokeWidth: 2 };

/** Arrow colour per outcome (no outcome / cleared = black, as before). */
export const SP_OUTCOME_COLOR: Record<SpOutcome, string> = {
  goal: '#d6001c',
  woodwork: '#ff8c00',
  save: '#0050ff',
  cleared: '#000000',
  offTarget: '#6b6b6b',
};
const SHORT_COLOR = '#00796b';
const GOAL_CENTRE = { x: 160, y: 6 };

/** Quadratic path: an inswinger ends heading towards the goal, so its bulge is on the side away from the goal centre; an outswinger bulges towards it. */
function arrowPath(a: SpArrow): string {
  if (a.swing !== 'in' && a.swing !== 'out') return `M${a.x1} ${a.y1} L${a.x2} ${a.y2}`;
  const dx = a.x2 - a.x1;
  const dy = a.y2 - a.y1;
  const len = Math.hypot(dx, dy) || 1;
  // A delivery from (almost) the centre line has no meaningful bend side: keep it straight.
  if (Math.abs(a.x1 - GOAL_CENTRE.x) < 20) return `M${a.x1} ${a.y1} L${a.x2} ${a.y2}`;
  const mx = (a.x1 + a.x2) / 2;
  const my = (a.y1 + a.y2) / 2;
  const nx = -dy / len;
  const ny = dx / len;
  const towardGoal = (mx + nx - GOAL_CENTRE.x) ** 2 + (my + ny - GOAL_CENTRE.y) ** 2 < (mx - nx - GOAL_CENTRE.x) ** 2 + (my - ny - GOAL_CENTRE.y) ** 2;
  const sign = (a.swing === 'in') === towardGoal ? -1 : 1;
  const off = Math.min(18, len * 0.14);
  return `M${a.x1} ${a.y1} Q${mx + sign * nx * off} ${Math.max(3, my + sign * ny * off)} ${a.x2} ${a.y2}`;
}

function Badge({ outcome, x, y }: { outcome: SpOutcome; x: number; y: number }) {
  const c = SP_OUTCOME_COLOR[outcome];
  const stroke = { stroke: '#fff', strokeWidth: 1 };
  if (outcome === 'goal') {
    return (
      <g>
        <circle cx={x} cy={y} r={5.5} fill={c} {...stroke} />
        <path d={`M${x - 2.6} ${y} L${x - 0.6} ${y + 2.2} L${x + 2.8} ${y - 2.4}`} fill="none" stroke="#fff" strokeWidth={1.5} />
      </g>
    );
  }
  if (outcome === 'woodwork') return <path d={`M${x} ${y - 6} L${x + 6} ${y} L${x} ${y + 6} L${x - 6} ${y}Z`} fill={c} {...stroke} />;
  if (outcome === 'save') return <rect x={x - 5} y={y - 5} width={10} height={10} fill={c} {...stroke} />;
  if (outcome === 'offTarget') return <circle cx={x} cy={y} r={5} fill="none" stroke={c} strokeWidth={2} />;
  return <path d={`M${x - 4} ${y - 4} L${x + 4} ${y + 4} M${x + 4} ${y - 4} L${x - 4} ${y + 4}`} stroke="#fff" strokeWidth={3.4} />;
}

export default function SetPiecePitch({ panel, label }: { panel?: SpPanel; label: string }) {
  const { t } = useLanguage();
  const mid = `ah-${useId().replace(/:/g, '')}`;
  return (
    <svg viewBox="0 0 320 190" role="img" aria-label={label} style={{ width: '100%', display: 'block', borderRadius: 8 }}>
      <defs>
        {[['', '#000'], ...Object.entries(SP_OUTCOME_COLOR), ['short', SHORT_COLOR]].map(([k, c]) => (
          <marker key={k} id={`${mid}${k}`} markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
            <path d="M0 0L6 3L0 6Z" fill={c} />
          </marker>
        ))}
      </defs>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={0} y={i * 32} width={320} height={32} fill={i % 2 ? '#7cc48a' : '#86cc93'} />
      ))}
      {panel?.zones?.map((z, i) => (
        <rect key={i} x={z.x} y={z.y} width={z.width} height={z.height} fill="#2f4a36" opacity={z.opacity ?? 0.85} />
      ))}
      <rect x={10} y={6} width={300} height={170} {...W} />
      <rect x={70} y={6} width={180} height={70} {...W} />
      <rect x={120} y={6} width={80} height={22} {...W} />
      <path d="M125 76 A40 30 0 0 0 195 76" {...W} />
      <circle cx={160} cy={54} r={1.5} fill="#fff" />
      <line x1={10} y1={176} x2={310} y2={176} stroke="#fff" strokeDasharray="8 5" strokeWidth={2} />
      <text x={160} y={187} fill="#fff" fontSize={8} textAnchor="middle" fontWeight="bold">{t('spFinalThird')}</text>
      {panel?.arrows?.map((a, i) => {
        const color = a.swing === 'short' ? SHORT_COLOR : a.outcome ? SP_OUTCOME_COLOR[a.outcome] : '#000';
        const markerKey = a.swing === 'short' ? 'short' : a.outcome && a.outcome !== 'cleared' ? a.outcome : '';
        const nx = a.nAt === 'end' ? a.x2 : a.x1;
        const ny = a.nAt === 'end' ? a.y2 : a.y1;
        return (
          <g key={i}>
            <path
              d={arrowPath(a)}
              fill="none"
              stroke={color}
              strokeWidth={a.outcome && a.outcome !== 'cleared' ? 2 : 1.6}
              strokeDasharray={a.swing === 'short' ? '4 3' : undefined}
              markerEnd={`url(#${mid}${markerKey})`}
            />
            {a.n != null && (
              <>
                <circle cx={nx} cy={ny} r={6} fill="#ffd34d" stroke="#000" />
                <text x={nx} y={ny + 3} fontSize={8} textAnchor="middle" fontWeight="bold">{a.n}</text>
              </>
            )}
            {a.outcome && (
              <Badge outcome={a.outcome} x={Math.min(312, a.x2 + (a.n != null && a.nAt === 'end' ? 10 : 0))} y={a.y2 + (a.n != null && a.nAt === 'end' ? 9 : 0)} />
            )}
          </g>
        );
      })}
      {!panel && (
        <text x={160} y={120} fill="#1d3324" fontSize={11} textAnchor="middle" fontWeight="bold">{t('spNotFilled')}</text>
      )}
    </svg>
  );
}
