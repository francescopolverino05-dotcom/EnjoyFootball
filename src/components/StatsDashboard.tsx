import { useEffect, useMemo, useState } from 'react';
import { MatchData, VideoClip, AnalysisVideo } from '../types/match';
import { useLanguage } from '../i18n/LanguageContext';
import { CLIP_LABELS, ANALYSIS_SECTION_ORDER, type ClipLabelId } from '../i18n/clipLabels';
import { mediaUrl } from '../utils/mediaUrl';

interface StatsDashboardProps {
  match: MatchData;
}

type TabId =
  | 'dynamics'
  | 'teamstats'
  | 'gkanalysis'
  | 'fullmatch'
  | 'clips'
  | 'videoanalysis';

export default function StatsDashboard({ match }: StatsDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('dynamics');
  const { t, L } = useLanguage();

  const tabs: [TabId, 'tabDynamics' | 'tabTeamStats' | 'tabGk' | 'tabFullMatch' | 'tabClips' | 'tabVideoAnalysis'][] = [
    ['dynamics', 'tabDynamics'],
    ['teamstats', 'tabTeamStats'],
    ['gkanalysis', 'tabGk'],
    ['fullmatch', 'tabFullMatch'],
    ['clips', 'tabClips'],
    ['videoanalysis', 'tabVideoAnalysis'],
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
        className={`tab-content ${activeTab === 'fullmatch' ? 'active' : ''}`}
        role="tabpanel"
      >
        <FullMatchPanel match={match} />
      </div>

      <div
        className={`tab-content ${activeTab === 'clips' ? 'active' : ''}`}
        role="tabpanel"
      >
        <ClipsPanel match={match} />
      </div>

      <div
        className={`tab-content ${activeTab === 'videoanalysis' ? 'active' : ''}`}
        role="tabpanel"
      >
        <VideoAnalysisPanel match={match} />
      </div>
    </>
  );
}

function formatClipTimestamp(clip: VideoClip): string {
  const m = clip.minute;
  const s = clip.second ?? 0;
  if (s > 0) {
    return `${m}'${String(s).padStart(2, '0')}"`;
  }
  return `${m}'`;
}

function clipSortKey(clip: VideoClip): number {
  return clip.minute * 60 + (clip.second ?? 0);
}

function FullMatchPanel({ match }: { match: MatchData }) {
  const { t } = useLanguage();
  const src = match.video?.fullMatch
    ? mediaUrl(match.slug, match.video.fullMatch)
    : null;

  return (
    <div className="video-section">
      <div className="section-title">{t('fullMatchVideo')}</div>
      <p className="video-hint">{t('fullMatchHint')}</p>
      {src ? (
        <div className="video-player-wrap video-player-wrap--full">
          <video controls playsInline preload="metadata" src={src}>
            {t('videoUnsupported')}
          </video>
        </div>
      ) : (
        <div className="video-placeholder">
          {t('noVideo').replace('{slug}', match.slug)}
        </div>
      )}
    </div>
  );
}

function ClipsPanel({ match }: { match: MatchData }) {
  const { t, L } = useLanguage();

  const sections = useMemo(() => {
    const map = new Map<ClipLabelId, VideoClip[]>();
    for (const clip of match.clips) {
      const key = (clip.section ?? clip.labels[0] ?? 'other') as ClipLabelId;
      const list = map.get(key) ?? [];
      list.push(clip);
      map.set(key, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => clipSortKey(a) - clipSortKey(b));
    }
    return ANALYSIS_SECTION_ORDER.filter((id) => (map.get(id)?.length ?? 0) > 0).map(
      (id) => ({ id, clips: map.get(id)! })
    );
  }, [match.clips]);

  const allSorted = useMemo(
    () => sections.flatMap((s) => s.clips),
    [sections]
  );

  const [selectedId, setSelectedId] = useState<string | null>(
    allSorted[0]?.id ?? null
  );

  useEffect(() => {
    if (!allSorted.some((c) => c.id === selectedId)) {
      setSelectedId(allSorted[0]?.id ?? null);
    }
  }, [allSorted, selectedId]);

  const selected = allSorted.find((c) => c.id === selectedId) ?? null;

  if (allSorted.length === 0) {
    return (
      <div className="empty-clips">
        {t('noClips').replace(/\{slug\}/g, match.slug)}
      </div>
    );
  }

  return (
    <div className="clips-layout">
      <aside className="clips-sidebar" aria-label={t('clipsSidebarTitle')}>
        <div className="clips-sidebar-title">{t('clipsSidebarTitle')}</div>
        <div className="clips-sidebar-sections">
          {sections.map((section) => (
            <div className="clips-sidebar-section" key={section.id}>
              <div className="clips-sidebar-section-title">
                <span>
                  {L(CLIP_LABELS[section.id] ?? { en: section.id, it: section.id })}
                </span>
                <span className="clips-sidebar-section-count">{section.clips.length}</span>
              </div>
              <ul className="clips-list">
                {section.clips.map((clip) => (
                  <li key={clip.id}>
                    <button
                      type="button"
                      className={`clips-list-item ${selectedId === clip.id ? 'active' : ''}`}
                      onClick={() => setSelectedId(clip.id)}
                    >
                      <span className="clips-list-time">
                        {formatClipTimestamp(clip)}
                      </span>
                      <span className="clips-list-body">
                        <span className="clips-list-title">{L(clip.title)}</span>
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>

      <div className="clips-detail">
        {selected ? (
          <>
            <div className="video-player-wrap">
              <video
                key={selected.id}
                controls
                playsInline
                preload="metadata"
                src={mediaUrl(match.slug, 'clips', selected.videoFile)}
              >
                {t('videoUnsupported')}
              </video>
            </div>
            <div className="clip-detail-meta">
              <div className="clip-detail-header">
                <h3 className="clip-detail-title">
                  {formatClipTimestamp(selected)} — {L(selected.title)}
                </h3>
                {(selected.section || selected.labels[0]) && (
                  <span className="clip-tag clip-tag--label">
                    {L(
                      CLIP_LABELS[
                        (selected.section ?? selected.labels[0]) as ClipLabelId
                      ] ?? {
                        en: String(selected.section ?? selected.labels[0]),
                        it: String(selected.section ?? selected.labels[0]),
                      }
                    )}
                  </span>
                )}
              </div>

              <div className="clip-meta-block">
                <div className="clip-meta-heading">{t('analystComments')}</div>
                <p className="clip-comments">{L(selected.comments)}</p>
                {selected.tags && selected.tags.length > 0 ? (
                  <div className="clip-tags" style={{ marginTop: 10 }}>
                    {selected.tags.map((tag) => (
                      <span className="clip-tag" key={tag}>
                        {tag}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>
            </div>
          </>
        ) : (
          <div className="empty-clips">{t('selectClip')}</div>
        )}
      </div>
    </div>
  );
}

function VideoAnalysisPanel({ match }: { match: MatchData }) {
  const { t, L } = useLanguage();
  const videos = match.analysisVideos ?? [];

  if (videos.length === 0) {
    return (
      <div className="empty-clips">
        {t('noAnalysis').replace(/\{slug\}/g, match.slug)}
      </div>
    );
  }

  return (
    <div className="video-section">
      <p className="video-hint">{t('videoAnalysisHint')}</p>
      <div className="analysis-grid">
        {videos.map((item: AnalysisVideo) => (
          <article className="analysis-card" key={item.id}>
            <div className="video-player-wrap">
              <video
                controls
                playsInline
                preload="metadata"
                src={mediaUrl(match.slug, 'analysis', item.videoFile)}
              >
                {t('videoUnsupported')}
              </video>
            </div>
            <div className="clip-card-body">
              <div className="clip-card-title">{L(item.title)}</div>
              <div className="clip-card-desc">{L(item.description)}</div>
              {item.tags && item.tags.length > 0 ? (
                <div className="clip-tags">
                  {item.tags.map((tag) => (
                    <span className="clip-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
