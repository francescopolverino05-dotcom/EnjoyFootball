import SetPiecePitch, { SP_OUTCOME_COLOR } from '../components/SetPiecePitch';
import type { OppositionSetPieces, SpPanel, SpSection } from '../data/setPieces';
import { useLanguage } from '../i18n/LanguageContext';

const card: React.CSSProperties = { flex: 1, minWidth: 300, background: 'var(--card-bg, rgba(255,255,255,0.04))', border: '1px solid rgba(127,127,127,0.25)', borderRadius: 10, padding: 14 };
const noteStyle: React.CSSProperties = { marginTop: 8, padding: 8, borderLeft: '3px solid #2e9e5b', background: 'rgba(46,158,91,0.1)', fontSize: 13 };
const cell: React.CSSProperties = { padding: 5, borderBottom: '1px solid rgba(127,127,127,0.25)', textAlign: 'right' };
const first: React.CSSProperties = { ...cell, textAlign: 'left' };

function Panel({ title, panel }: { title: string; panel?: SpPanel }) {
  const { t, L } = useLanguage();
  return (
    <div style={card}>
      <h4 style={{ margin: '0 0 8px', fontSize: 12, letterSpacing: 1, opacity: 0.7 }}>{title}</h4>
      <SetPiecePitch panel={panel} label={title} />
      {panel?.note && <div style={noteStyle}><b>{panel.noteTitle ? L(panel.noteTitle) : t('spTakers')}</b> {L(panel.note)}</div>}
      {panel?.orderedNotes?.length ? (
        <div style={noteStyle}>
          <b>{L(panel.orderedNotesTitle)}</b>
          <ol style={{ margin: '4px 0 0 18px', padding: 0 }}>
            {panel.orderedNotes.map((n, i) => <li key={i}>{L(n)}</li>)}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

const legendChip: React.CSSProperties = { display: 'inline-flex', alignItems: 'center', gap: 5, marginRight: 14, whiteSpace: 'nowrap' };

/** Colour key for the outcome arrows; only rendered when a section's arrows carry outcomes. */
function Legend({ data }: { data?: SpSection }) {
  const { t } = useLanguage();
  const arrows = [data?.left, data?.right, data?.centre].flatMap((p) => p?.arrows ?? []);
  if (!arrows.some((a) => a.outcome || a.swing)) return null;
  const items: [string, string, string][] = [
    ['goal', SP_OUTCOME_COLOR.goal, t('spLegendGoal')],
    ['woodwork', SP_OUTCOME_COLOR.woodwork, t('spLegendWoodwork')],
    ['save', SP_OUTCOME_COLOR.save, t('spLegendSave')],
    ['cleared', SP_OUTCOME_COLOR.cleared, t('spLegendCleared')],
    ['offTarget', SP_OUTCOME_COLOR.offTarget, t('spLegendOff')],
    ['short', '#00796b', t('spLegendShort')],
  ].filter(([k]) => k === 'short' ? arrows.some((a) => a.swing === 'short') : arrows.some((a) => a.outcome === k)) as [string, string, string][];
  return (
    <div style={{ ...noteStyle, marginTop: 12 }}>
      <b>{t('spLegend')}</b>{' '}
      {items.map(([k, c, label]) => (
        <span key={k} style={legendChip}>
          <span style={{ width: 18, height: 0, borderTop: `3px ${k === 'short' ? 'dashed' : 'solid'} ${c}`, display: 'inline-block' }} />
          {label}
        </span>
      ))}
      <div style={{ marginTop: 4, opacity: 0.8 }}>{t('spLegendIn')}</div>
    </div>
  );
}

function Section({ kind, data }: { kind: 'corners' | 'freeKicks'; data?: SpSection }) {
  const { t, L } = useLanguage();
  const corners = kind === 'corners';
  const title = t(corners ? 'spCorners' : 'spFreeKicks');
  const showCentre = !!data?.takers?.some((tk) => tk.fromCentre != null);
  return (
    <section style={{ marginTop: 24 }}>
      <div className="section-title">{title}</div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Panel title={t(corners ? 'spLeftCorners' : 'spLeftFreeKicks')} panel={data?.left} />
        <Panel title={t(corners ? 'spRightCorners' : 'spRightFreeKicks')} panel={data?.right} />
        {data?.centre && <Panel title={t('spCentreFreeKicks')} panel={data.centre} />}
      </div>
      <Legend data={data} />
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 12 }}>
        <thead>
          <tr><th style={first}>{t(corners ? 'spCornersTakers' : 'spFreeKicksTakers')}</th><th style={cell}>{t('spFoot')}</th><th style={cell}>{title}</th><th style={cell}>{t('spFromLeft')}</th><th style={cell}>{t('spFromRight')}</th>{showCentre && <th style={cell}>{t('spFromCentre')}</th>}</tr>
        </thead>
        <tbody>
          {data?.takers?.length ? data.takers.map((tk, i) => (
            <tr key={i}><td style={first}>{L(tk.player)}</td><td style={cell}>{L(tk.foot)}</td><td style={cell}>{tk.total}</td><td style={cell}>{tk.fromLeft}</td><td style={cell}>{tk.fromRight}</td>{showCentre && <td style={cell}>{tk.fromCentre ?? 0}</td>}</tr>
          )) : (
            <tr><td style={{ ...first, opacity: 0.6 }} colSpan={showCentre ? 6 : 5}>{t('spNotFilled')}</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default function SetPiecesPanel({ data }: { data?: OppositionSetPieces }) {
  const { L } = useLanguage();
  return (
    <div className="set-pieces-panel">
      {data?.source ? <p className="video-hint">{L(data.source)}</p> : null}
      {data?.keyNotes?.length ? (
        <section style={{ marginTop: 16 }}>
          <div className="section-title">{L(data.keyNotesTitle)}</div>
          {data.keyNotes.map((n, i) => <div key={i} style={noteStyle}>{L(n)}</div>)}
        </section>
      ) : null}
      <Section kind="corners" data={data?.corners} />
      <Section kind="freeKicks" data={data?.freeKicks} />
    </div>
  );
}
