import SetPiecePitch from '../components/SetPiecePitch';
import SetPieceDiagram from './SetPieceDiagram';
import type { OppositionSetPieces, SpPanel, SpSection } from '../data/setPieces';

const card: React.CSSProperties = { flex: 1, minWidth: 300, background: 'var(--card-bg, rgba(255,255,255,0.04))', border: '1px solid rgba(127,127,127,0.25)', borderRadius: 10, padding: 14 };
const noteStyle: React.CSSProperties = { marginTop: 8, padding: 8, borderLeft: '3px solid #2e9e5b', background: 'rgba(46,158,91,0.1)', fontSize: 13 };
const cell: React.CSSProperties = { padding: 5, borderBottom: '1px solid rgba(127,127,127,0.25)', textAlign: 'right' };
const first: React.CSSProperties = { ...cell, textAlign: 'left' };

function Panel({ title, panel }: { title: string; panel?: SpPanel }) {
  return (
    <div style={card}>
      <h4 style={{ margin: '0 0 8px', fontSize: 12, letterSpacing: 1, opacity: 0.7 }}>{title}</h4>
      <SetPiecePitch panel={panel} label={title} />
      {panel?.note && <div style={noteStyle}><b>Takers:</b> {panel.note}</div>}
      {panel?.orderedNotes?.length ? (
        <div style={noteStyle}>
          <b>{panel.orderedNotesTitle}</b>
          <ol style={{ margin: '4px 0 0 18px', padding: 0 }}>
            {panel.orderedNotes.map((n, i) => <li key={i}>{n}</li>)}
          </ol>
        </div>
      ) : null}
    </div>
  );
}

function Section({ title, kind, data }: { title: string; kind: string; data?: SpSection }) {
  return (
    <section style={{ marginTop: 24 }}>
      <div className="section-title">{title}</div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <Panel title={`LEFT ${title.toUpperCase()}`} panel={data?.left} />
        <Panel title={`RIGHT ${title.toUpperCase()}`} panel={data?.right} />
      </div>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, marginTop: 12 }}>
        <thead>
          <tr><th style={first}>{title} takers</th><th style={cell}>Foot</th><th style={cell}>{kind}</th><th style={cell}>From left</th><th style={cell}>From right</th></tr>
        </thead>
        <tbody>
          {data?.takers?.length ? data.takers.map((t) => (
            <tr key={t.player}><td style={first}>{t.player}</td><td style={cell}>{t.foot}</td><td style={cell}>{t.total}</td><td style={cell}>{t.fromLeft}</td><td style={cell}>{t.fromRight}</td></tr>
          )) : (
            <tr><td style={{ ...first, opacity: 0.6 }} colSpan={5}>Not filled in yet</td></tr>
          )}
        </tbody>
      </table>
    </section>
  );
}

export default function SetPiecesPanel({ data }: { data?: OppositionSetPieces }) {
  return (
    <div className="set-pieces-panel">
      {data?.source ? <p className="video-hint">{data.source}</p> : null}
      {data?.diagram ? <SetPieceDiagram data={data.diagram} /> : null}
      {data?.diagram && !data.corners && !data.freeKicks ? null : (
        <>
          <Section title="Corners" kind="Corners" data={data?.corners} />
          <Section title="Free kicks" kind="Free kicks" data={data?.freeKicks} />
        </>
      )}
    </div>
  );
}
