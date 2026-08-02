import { useState } from 'react';
import { MatchData } from '../types/match';
import { useLanguage } from '../i18n/LanguageContext';

interface StatsDashboardProps {
  match: MatchData;
}

type TabId = 'dynamics' | 'teamstats' | 'gkanalysis' | 'video';

export default function StatsDashboard({ match }: StatsDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('dynamics');
  const { t, L } = useLanguage();

  const tabs: [TabId, 'tabDynamics' | 'tabTeamStats' | 'tabGk' | 'tabVideo'][] = [
    ['dynamics', 'tabDynamics'],
    ['teamstats', 'tabTeamStats'],
    ['gkanalysis', 'tabGk'],
    ['video', 'tabVideo'],
  ];

  return (
    <>
      <div className="tabs-header" role="tablist">
        {tabs.map(([id, labelKey]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            className={`tab-button ${activeTab === id ? 'active' : ''}`}
            onClick={() => setActiveTab(id)}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      <div
        className={`tab-content ${activeTab === 'dynamics' ? 'active' : ''}`}
        role="tabpanel"
      >
        <div className="dynamics-panel">
          {match.dynamics.map((metric) => (
            <div
              className="dynamic-metric-card"
              key={typeof metric.name === 'string' ? metric.name : metric.name.en}
            >
              <div className="dynamic-metric-header">{L(metric.name)}</div>
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
                <span style={{ color: 'var(--away-green)' }}>
                  {metric.awayValue}
                  {metric.unit ?? ''} {match.awayTeam.shortName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`tab-content ${activeTab === 'teamstats' ? 'active' : ''}`}
        role="tabpanel"
      >
        {match.teamStats.map((stat) => (
          <div
            className="stats-comparison-row"
            key={typeof stat.name === 'string' ? stat.name : `${stat.name.en}-${stat.name.it}`}
          >
            <span className="stats-val-home">{L(stat.home)}</span>
            <span className="stats-label">{L(stat.name)}</span>
            <span className="stats-val-away">{L(stat.away)}</span>
          </div>
        ))}
      </div>

      <div
        className={`tab-content ${activeTab === 'gkanalysis' ? 'active' : ''}`}
        role="tabpanel"
      >
        <div className="gk-grid">
          {match.goalkeepers.map((gk) => (
            <div className={`gk-log-item ${gk.colorClass}`} key={gk.name}>
              <div className="gk-log-header">
                <span>{gk.name}</span>
                <span className="gk-val-pill">
                  {gk.minutes}&apos; {t('minutes')}
                </span>
              </div>
              <div className="gk-log-meta">
                <strong>{t('team')}:</strong> {L(gk.team)}
                <br />
                <strong>{t('jerseyColour')}:</strong> {L(gk.jerseyColor)}
                <br />
                <strong>{t('shotsFaced')}:</strong> {gk.shotsFaced}
                <br />
                <strong>{t('saves')}:</strong> {gk.saves}
                <br />
                <strong>{t('goalsConceded')}:</strong> {gk.goalsConceded}
                {gk.notes ? (
                  <>
                    <br />
                    <em>{L(gk.notes)}</em>
                  </>
                ) : null}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`tab-content ${activeTab === 'video' ? 'active' : ''}`}
        role="tabpanel"
      >
        <VideoSection match={match} />
      </div>
    </>
  );
}

function VideoSection({ match }: { match: MatchData }) {
  const { t } = useLanguage();
  const fullMatchSrc = match.video?.fullMatch
    ? `/matches/${match.slug}/${match.video.fullMatch}`
    : null;

  return (
    <div className="video-section">
      <div className="section-title">{t('fullMatchVideo')}</div>
      {fullMatchSrc ? (
        <div className="video-player-wrap">
          <video controls playsInline preload="metadata" src={fullMatchSrc}>
            {t('videoUnsupported')}
          </video>
        </div>
      ) : (
        <div className="video-placeholder">
          {t('noVideo').replace('{slug}', match.slug)}
        </div>
      )}

      <div className="section-title" style={{ marginTop: 24 }}>
        {t('analysisClips')}
      </div>
      {match.clips.length === 0 ? (
        <div className="empty-clips">
          {t('noClips').replace(/\{slug\}/g, match.slug)}
        </div>
      ) : (
        <div className="clips-grid">
          {match.clips.map((clip) => (
            <div className="clip-card" key={clip.id}>
              <video
                controls
                playsInline
                preload="metadata"
                src={`/matches/${match.slug}/clips/${clip.videoFile}`}
              />
              <div className="clip-card-body">
                <div className="clip-card-title">
                  <ClipTitle clip={clip} />
                </div>
                <div className="clip-card-desc">
                  <ClipDesc clip={clip} />
                </div>
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

function ClipTitle({ clip }: { clip: MatchData['clips'][number] }) {
  const { L } = useLanguage();
  return (
    <>
      {L(clip.title)}
      {clip.minute != null ? ` (${clip.minute}')` : ''}
    </>
  );
}

function ClipDesc({ clip }: { clip: MatchData['clips'][number] }) {
  const { L } = useLanguage();
  return <>{L(clip.description)}</>;
}
