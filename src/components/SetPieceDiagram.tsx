import { useId } from 'react';
import { useLanguage } from '../i18n/LanguageContext';
import type { UiKey } from '../i18n/translations';
import type { SpDiagram, SpZoneId } from '../data/setPieces';

const ZONE_COLOR: Record<SpZoneId, string> = {
  area: '#14201a',
  near: '#e67e22',
  far: '#2a6fdb',
  short: '#8e44ad',
  edge: '#c0392b',
};
const ZONE_KEY: Record<SpZoneId, UiKey> = {
  area: 'spZoneArea',
  near: 'spZoneNear',
  far: 'spZoneFar',
  short: 'spZoneShort',
  edge: 'spZoneEdge',
};
const ZONE_ORDER: SpZoneId[] = ['area', 'near', 'far', 'short', 'edge'];
const LINE = { fill: 'none', stroke: '#fff', strokeWidth: 2 };

const card: React.CSSProperties = { background: 'var(--card-bg, rgba(255,255,255,0.04))', border: '1px solid rgba(127,127,127,0.25)', borderRadius: 10, padding: 14 };
const noteStyle: React.CSSProperties = { marginTop: 8, padding: 8, borderLeft: '3px solid #2e9e5b', background: 'rgba(46,158,91,0.1)', fontSize: 13 };
const th: React.CSSProperties = { padding: '4px 6px', textAlign: 'left', borderBottom: '1px solid rgba(127,127,127,0.4)', fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.5, opacity: 0.7 };
const td: React.CSSProperties = { padding: '4px 6px', borderBottom: '1px solid rgba(127,127,127,0.2)', fontSize: 12.5, verticalAlign: 'top' };

function Pitch({ data, label, foot }: { data: SpDiagram; label: string; foot: string }) {
  const uid = useId().replace(/:/g, '');
  const colors = Array.from(new Set(data.arrows.map((a) => ZONE_COLOR[a.zone])));
  return (
    <svg viewBox="0 0 320 190" role="img" aria-label={label} style={{ width: '100%', display: 'block', borderRadius: 8 }}>
      <defs>
        {colors.map((c) => (
          <marker key={c} id={`ah-${uid}-${c.slice(1)}`} markerWidth={6} markerHeight={6} refX={5} refY={3} orient="auto">
            <path d="M0 0L6 3L0 6Z" fill={c} />
          </marker>
        ))}
      </defs>
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <rect key={i} x={0} y={i * 32} width={320} height={32} fill={i % 2 ? '#7cc48a' : '#86cc93'} />
      ))}
      {/* delivery zones */}
      <rect x={72} y={30} width={176} height={44} fill="#14201a" opacity={0.16} />
      <rect x={120} y={8} width={80} height={22} fill="#14201a" opacity={0.1} />
      <rect x={116} y={8} width={26} height={22} fill={ZONE_COLOR.near} opacity={0.28} />
      <rect x={178} y={8} width={26} height={22} fill={ZONE_COLOR.near} opacity={0.28} />
      <rect x={12} y={8} width={46} height={40} fill={ZONE_COLOR.short} opacity={0.2} />
      <rect x={72} y={58} width={176} height={16} fill={ZONE_COLOR.edge} opacity={0.14} strokeDasharray="4 3" stroke={ZONE_COLOR.edge} />
      <rect x={10} y={6} width={300} height={170} {...LINE} />
      <rect x={70} y={6} width={180} height={70} {...LINE} />
      <rect x={120} y={6} width={80} height={22} {...LINE} />
      <rect x={146} y={1} width={28} height={5} fill="#fff" />
      <path d="M125 76 A40 30 0 0 0 195 76" {...LINE} />
      <circle cx={160} cy={54} r={1.5} fill="#fff" />
      <line x1={10} y1={176} x2={310} y2={176} stroke="#fff" strokeDasharray="8 5" strokeWidth={2} />
      <text x={160} y={187} fill="#fff" fontSize={7.5} textAnchor="middle" fontWeight="bold">{foot}</text>
      {/* zone count chips (near/far/short counts sit on their arrows) */}
      <g fontWeight="bold" textAnchor="middle">
        <rect x={146} y={42} width={28} height={18} rx={9} fill={ZONE_COLOR.area} />
        <text x={160} y={55} fontSize={12} fill="#fff">{data.counts.area}</text>
        <rect x={76} y={63} width={20} height={11} rx={5.5} fill={ZONE_COLOR.edge} />
        <text x={86} y={71.5} fontSize={8.5} fill="#fff">{data.counts.edge}</text>
      </g>
      {/* arrows */}
      {data.arrows.map((a, i) => {
        const c = ZONE_COLOR[a.zone];
        const mx = 0.25 * a.x1 + 0.5 * a.cx + 0.25 * a.x2;
        const my = 0.25 * a.y1 + 0.5 * a.cy + 0.25 * a.y2;
        return (
          <g key={i}>
            <path
              d={`M${a.x1} ${a.y1} Q${a.cx} ${a.cy} ${a.x2} ${a.y2}`}
              fill="none"
              stroke={c}
              strokeWidth={a.zone === 'area' ? 2.4 : 1.8}
              strokeDasharray={a.kind === 'freeKick' ? '5 3' : undefined}
              markerEnd={`url(#ah-${uid}-${c.slice(1)})`}
            />
            <circle cx={mx} cy={my} r={6.5} fill="#fff" stroke={c} strokeWidth={1.5} />
            <text x={mx} y={my + 3.2} fontSize={9} textAnchor="middle" fontWeight="bold" fill="#000">{a.n}</text>
          </g>
        );
      })}
    </svg>
  );
}

export default function SetPieceDiagram({ data }: { data: SpDiagram }) {
  const { t, L } = useLanguage();
  const corners = data.events.filter((e) => e.kind === 'corner').length;
  const fks = data.events.filter((e) => e.kind === 'freeKick').length;
  const title = t('spDiagTitle');
  return (
    <section style={{ marginTop: 24 }}>
      <div className="section-title">{title}</div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'flex-start' }}>
        <div style={{ ...card, flex: '1 1 340px', minWidth: 300, maxWidth: 560 }}>
          <Pitch data={data} label={title} foot={t('spPitchFoot')} />
          <p style={{ margin: '8px 0 0', fontSize: 12, opacity: 0.75 }}>{t('spDiagSub')}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 12px', marginTop: 8, fontSize: 12 }}>
            {ZONE_ORDER.map((z) => (
              <span key={z} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 9px 3px 4px', borderRadius: 14, border: `1.5px solid ${ZONE_COLOR[z]}`, fontSize: 12.5 }}>
                <span style={{ minWidth: 20, height: 20, borderRadius: 10, background: ZONE_COLOR[z], color: '#fff', fontWeight: 700, fontSize: 12, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>{data.counts[z]}</span>
                {t(ZONE_KEY[z])}
              </span>
            ))}
          </div>
          <div style={{ marginTop: 8, fontSize: 12, opacity: 0.85 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width={28} height={6}><line x1={0} y1={3} x2={28} y2={3} stroke="#333" strokeWidth={2} /></svg>{t('spLegendCorner')}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <svg width={28} height={6}><line x1={0} y1={3} x2={28} y2={3} stroke="#333" strokeWidth={2} strokeDasharray="5 3" /></svg>{t('spLegendFk')}
            </div>
            <div style={{ marginTop: 4 }}>
              <b>{t('spCorners')}</b> {corners} · <b>{t('spFreeKicks')}</b> {fks} · <b>{t('spTotal')}</b> {data.events.length}
            </div>
          </div>
        </div>
        <div style={{ flex: '1 1 300px', minWidth: 280 }}>
          <div className="section-title" style={{ marginBottom: 4 }}>{t('spKeyNotes')}</div>
          {data.notes.map((n, i) => (
            <div key={i} style={noteStyle}>{L(n)}</div>
          ))}
        </div>
      </div>
      <div className="section-title" style={{ marginTop: 20 }}>{t('spAllTitle')} ({data.events.length})</div>
      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              <th style={th}>{t('spColMin')}</th>
              <th style={th}>{t('spColType')}</th>
              <th style={th}>{t('spColSide')}</th>
              <th style={th}>{t('spColDelivery')}</th>
              <th style={th}>{t('spColZone')}</th>
              <th style={th}>{t('spColOutcome')}</th>
            </tr>
          </thead>
          <tbody>
            {data.events.map((e, i) => (
              <tr key={i} style={e.goal ? { background: 'rgba(46,158,91,0.18)', fontWeight: 700 } : undefined}>
                <td style={{ ...td, whiteSpace: 'nowrap' }}>{e.time}′</td>
                <td style={{ ...td, whiteSpace: 'nowrap' }}>{t(e.kind === 'corner' ? 'spTypeCorner' : 'spTypeFreeKick')}</td>
                <td style={td}>{t(e.side === 'L' ? 'spSideL' : 'spSideR')}</td>
                <td style={td}>{L(e.delivery)}</td>
                <td style={td}>
                  <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: 4, background: ZONE_COLOR[e.zone], marginRight: 5 }} />
                  {t(ZONE_KEY[e.zone])}
                </td>
                <td style={td}>{L(e.outcome)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
