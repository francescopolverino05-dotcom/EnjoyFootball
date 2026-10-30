import SetPiecePitch from '../components/SetPiecePitch';
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

function Section({ kind, data }: { kind: 'corners' | 'freeKicks'; data?: SpSection }) {
  const { t, L } = useLanguage();
  const corners = kind === 'corners';
  const title = t(corners ? 'spCorners' : 'spFreeKicks');
  return (
    <section style={{ marginTop: 24 }}>
      <div className="section-title">{title}</div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Panel title={t(corners ? 'spLeftCorners' : 'spLeftFreeKicks')} panel={data?.left} />
        <Panel title={t(corners ? 'spRightCorners' : 'spRightFreeKicks')} panel={data?.right} />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 12 }}>
        <thead>
          <tr><th style={first}>{t(corners ? 'spCornersTakers' : 'spFreeKicksTakers')}</th><th style={cell}>{t('spFoot')}</th><th style={cell}>{title}</th><th style={cell}>{t('spFromLeft')}</th><th style={cell}>{t('spFromRight')}</th></tr>
        </thead>
        <tbody>
          {data?.takers?.length ? data.takers.map((tk) => (
            <tr key={tk.player}><td style={first}>{tk.player}</td><td style={cell}>{L(tk.foot)}</td><td style={cell}>{tk.total}</td><td style={cell}>{tk.fromLeft}</td><td style={cell}>{tk.fromRight}</td></tr>
          )) : (
            <tr><td style={{ ...first, opacity: 0.6 }} colSpan={5}>{t('spNotFilled')}</td></tr>
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
