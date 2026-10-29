import { useId } from 'react';
import type { SpPanel } from '../data/setPieces';
import { useLanguage } from '../i18n/LanguageContext';

const W = { fill: 'none', stroke: '#fff', strokeWidth: 2 };

export default function SetPiecePitch({ panel, label }: { panel?: SpPanel; label: string }) {
  const { t } = useLanguage();
  const mid = `ah-${useId().replace(/:/g, '')}`;
  return (
    <svg viewBox="0 0 320 190" role="img" aria-label={label} style={{ width: '100%', display: 'block', borderRadius: 8 }}>
      <defs>
        <marker id={mid} markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
          <path d="M0 0L6 3L0 6Z" fill="#000" />
        </marker>
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
      {panel?.arrows?.map((a, i) => (
        <g key={i}>
          <line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke="#000" strokeWidth={1.6} markerEnd={`url(#${mid})`} />
          {a.n != null && (
            <>
              <circle cx={a.nAt === 'end' ? a.x2 : a.x1} cy={a.nAt === 'end' ? a.y2 : a.y1} r={6} fill="#ffd34d" stroke="#000" />
              <text x={a.nAt === 'end' ? a.x2 : a.x1} y={(a.nAt === 'end' ? a.y2 : a.y1) + 3} fontSize={8} textAnchor="middle" fontWeight="bold">{a.n}</text>
            </>
          )}
        </g>
      ))}
      {!panel && (
        <text x={160} y={120} fill="#1d3324" fontSize={11} textAnchor="middle" fontWeight="bold">{t('spNotFilled')}</text>
      )}
    </svg>
  );
}
