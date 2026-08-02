import { useState } from 'react';
import { MatchData } from '../types/match';

interface StatsDashboardProps {
  match: MatchData;
}

type TabId = 'dynamics' | 'teamstats' | 'gkanalysis' | 'video';

export default function StatsDashboard({ match }: StatsDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('dynamics');

  return (
    <>
      <div className="tabs-header">
        {(
          [
            ['dynamics', 'Dinamiche di Gara'],
            ['teamstats', 'Statistiche Squadra'],
            ['gkanalysis', 'Analisi Portieri'],
            ['video', 'Video & Clip'],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            className={`tab-button ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className={`tab-content ${activeTab === 'dynamics' ? 'active' : ''}`}>
        <div className="dynamics-panel">
          {match.dynamics.map((metric) => (
            <div className="dynamic-metric-card" key={metric.name}>
              <div className="dynamic-metric-header">{metric.name}</div>
              <div className="dynamic-bar-container">
                <div
                  className="dynamic-bar-fill home"
                  style={{ width: `${metric.homeValue}%` }}
                />
                <div
                  className="dynamic-bar-fill away"
                  style={{ width: `${metric.awayValue}%` }}
                />
              </div>
              <div className="dynamic-labels-footer">
                <span style={{ color: 'var(--napoli-blue-dark)' }}>
                  {metric.homeValue}
                  {metric.unit ?? ''} {match.homeTeam.shortName}
                </span>
                <span style={{ color: 'var(--u18-green)' }}>
                  {metric.awayValue}
                  {metric.unit ?? ''} {match.awayTeam.shortName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`tab-content ${activeTab === 'teamstats' ? 'active' : ''}`}>
        {match.teamStats.map((stat) => (
          <div className="stats-comparison-row" key={stat.name}>
            <span className="stats-val-home">{stat.home}</span>
            <span className="stats-label">{stat.name}</span>
            <span className="stats-val-away">{stat.away}</span>
          </div>
        ))}
      </div>

      <div className={`tab-content ${activeTab === 'gkanalysis' ? 'active' : ''}`}>
        <div className="gk-grid">
          {match.goalkeepers.map((gk) => (
            <div className={`gk-log-item ${gk.colorClass}`} key={gk.name}>
              <div className="gk-log-header">
                <span>{gk.name}</span>
                <span className="gk-val-pill">{gk.minutes}&apos; minuti</span>
              </div>
              <div className="gk-log-meta">
                <strong>Squadra:</strong> {gk.team}
                <br />
                <strong>Colore Maglia:</strong> {gk.jerseyColor}
                <br />
                <strong>Tiri Subiti:</strong> {gk.shotsFaced}
                <br />
                <strong>Parate:</strong> {gk.saves}
                <br />
                <strong>Gol Subiti:</strong> {gk.goalsConceded}
                {gk.notes ? (
                  <>
                    <br />
                    <em>{gk.notes}</em>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className={`tab-content ${activeTab === 'video' ? 'active' : ''}`}>
        <VideoSection match={match} />
      </div>
    </>
  );
}

function VideoSection({ match }: { match: MatchData }) {
  const fullMatchSrc = match.video?.fullMatch
    ? `/matches/${match.slug}/${match.video.fullMatch}`
    : null;

  return (
    <div className="video-section">
      <div className="section-title">Video Partita Completa</div>
      {fullMatchSrc ? (
        <div className="video-player-wrap">
          <video controls preload="metadata" src={fullMatchSrc}>
            Il browser non supporta la riproduzione video.
          </video>
        </div>
      ) : (
        <div className="video-placeholder">
          Nessun video caricato. Aggiungi il file MP4 in{' '}
          <code>matches/{match.slug}/video/match.mp4</code>
        </div>
      )}

      <div className="section-title" style={{ marginTop: 24 }}>
        Clip di Analisi
      </div>
      {match.clips.length === 0 ? (
        <div className="empty-clips">
          Nessuna clip ancora. Aggiungi file MP4 in{' '}
          <code>matches/{match.slug}/clips/</code> e registra i metadata in{' '}
          <code>match.json</code>.
        </div>
      ) : (
        <div className="clips-grid">
          {match.clips.map((clip) => (
            <div className="clip-card" key={clip.id}>
              <video
                controls
                preload="metadata"
                src={`/matches/${match.slug}/clips/${clip.videoFile}`}
              />
              <div className="clip-card-body">
                <div className="clip-card-title">
                  {clip.title}
                  {clip.minute != null ? ` (${clip.minute}')` : ''}
                </div>
                <div className="clip-card-desc">{clip.description}</div>
                {clip.tags && clip.tags.length > 0 ? (
                  <div className="clip-tags">
                    {clip.tags.map((tag) => (
                      <span className="clip-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
