import { useMemo, useState } from 'react';
import { MatchData, VideoClip, AnalysisVideo } from '../types/match';
import { useLanguage } from '../i18n/LanguageContext';
import { CLIP_LABELS, ANALYSIS_SECTION_ORDER, HIDDEN_CLIP_SECTIONS, type ClipLabelId } from '../i18n/clipLabels';
import type { Localized } from '../i18n/translations';
import MatchMedia from './MatchMedia';

interface StatsDashboardProps {
  match: MatchData;
}

type TabId =
  | 'dynamics'
  | 'teamstats'
  | 'gkanalysis'
  | 'fullmatch'
  | 'clips'
  | 'trainingdesign'
  | 'videoanalysis';

export default function StatsDashboard({ match }: StatsDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('dynamics');
  const { t, L } = useLanguage();

  const tabs: [
    TabId,
    (
      | 'tabDynamics'
      | 'tabTeamStats'
      | 'tabGk'
      | 'tabFullMatch'
      | 'tabClips'
      | 'tabTrainingDesign'
      | 'tabVideoAnalysis'
    ),
  ][] = [
    ['dynamics', 'tabDynamics'],
    ['teamstats', 'tabTeamStats'],
    ['gkanalysis', 'tabGk'],
    ['fullmatch', 'tabFullMatch'],
    ['clips', 'tabClips'],
    ['trainingdesign', 'tabTrainingDesign'],
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
        className={`tab-content ${activeTab === 'trainingdesign' ? 'active' : ''}`}
        role="tabpanel"
      >
        <TrainingDesignPanel match={match} />
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

function localizedText(value: Localized | undefined): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return `${value.en} ${value.it}`;
}

type ClipTimeFilter =
  | { kind: 'minute'; minute: number }
  | { kind: 'point'; totalSeconds: number }
  | { kind: 'range'; fromMinute: number; toMinute: number };

/** Parse queries like `10`, `10'`, `10:12`, `10-20`, `10'-20'`. */
function parseClipTimeQuery(raw: string): ClipTimeFilter | null {
  const q = raw.trim();
  const range = q.match(
    /^(\d+)\s*['′]?(?::(\d{1,2}))?\s*[-–—]\s*(\d+)\s*['′]?(?::(\d{1,2}))?\s*['′"]?$/
  );
  if (range) {
    const fromMinute = Number(range[1]);
    const toMinute = Number(range[3]);
    if (Number.isFinite(fromMinute) && Number.isFinite(toMinute)) {
      return {
        kind: 'range',
        fromMinute: Math.min(fromMinute, toMinute),
        toMinute: Math.max(fromMinute, toMinute),
      };
    }
  }

  const withSeconds = q.match(/^(\d+)\s*[:'′]\s*(\d{1,2})\s*["″]?$/);
  if (withSeconds) {
    const minute = Number(withSeconds[1]);
    const second = Number(withSeconds[2]);
    if (Number.isFinite(minute) && Number.isFinite(second) && second < 60) {
      return { kind: 'point', totalSeconds: minute * 60 + second };
    }
  }

  const minuteOnly = q.match(/^(\d+)\s*['′]?$/);
  if (minuteOnly) {
    const minute = Number(minuteOnly[1]);
    if (Number.isFinite(minute)) return { kind: 'minute', minute };
  }

  return null;
}

function clipMatchesTime(clip: VideoClip, filter: ClipTimeFilter): boolean {
  if (filter.kind === 'minute') return clip.minute === filter.minute;
  if (filter.kind === 'point') return clipSortKey(clip) === filter.totalSeconds;
  return clip.minute >= filter.fromMinute && clip.minute <= filter.toMinute;
}

function clipSearchHaystack(clip: VideoClip, sectionId: ClipLabelId): string {
  const sectionLabel = CLIP_LABELS[sectionId];
  const labelTexts = clip.labels
    .map((id) => {
      const label = CLIP_LABELS[id];
      return label ? `${id} ${localizedText(label)}` : id;
    })
    .join(' ');

  return [
    sectionId,
    localizedText(sectionLabel),
    localizedText(clip.title),
    localizedText(clip.comments),
    labelTexts,
    ...(clip.tags ?? []),
    formatClipTimestamp(clip),
    String(clip.minute),
    clip.second != null ? `${clip.minute}:${String(clip.second).padStart(2, '0')}` : '',
  ]
    .join(' ')
    .toLowerCase();
}

function clipMatchesSearch(
  clip: VideoClip,
  sectionId: ClipLabelId,
  query: string
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const timeFilter = parseClipTimeQuery(q);
  if (timeFilter?.kind === 'range') {
    return clipMatchesTime(clip, timeFilter);
  }
  if (timeFilter && clipMatchesTime(clip, timeFilter)) {
    return true;
  }

  return clipSearchHaystack(clip, sectionId).includes(q);
}

function FullMatchPanel({ match }: { match: MatchData }) {
  const { t } = useLanguage();
  const src = match.video?.fullMatch ?? null;

  return (
    <div className="video-section">
      <div className="section-title">{t('fullMatchVideo')}</div>
      <p className="video-hint">{t('fullMatchHint')}</p>
      {src ? (
        <MatchMedia
          slug={match.slug}
          src={src}
          kind={null}
          unsupportedLabel={t('videoUnsupported')}
          playLabel={t('playVideo')}
          fullHeight
          autoload
          title={t('fullMatchVideo')}
        />
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
  const [searchQuery, setSearchQuery] = useState('');

  const sections = useMemo(() => {
    const map = new Map<ClipLabelId, VideoClip[]>();
    for (const clip of match.clips) {
      const key = (clip.section ?? clip.labels[0] ?? 'other') as ClipLabelId;
      if (HIDDEN_CLIP_SECTIONS.has(key)) continue;
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

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return sections;
    return sections
      .map((section) => ({
        ...section,
        clips: section.clips.filter((clip) =>
          clipMatchesSearch(clip, section.id, q)
        ),
      }))
      .filter((section) => section.clips.length > 0);
  }, [sections, searchQuery]);

  if (sections.length === 0) {
    return (
      <div className="empty-clips">
        {t('noClips').replace(/\{slug\}/g, match.slug)}
      </div>
    );
  }

  return (
    <div className="video-section">
      <p className="video-hint">{t('clipsHint')}</p>

      <div className="clips-search">
        <label className="clips-search-label" htmlFor="clips-search-input">
          {t('clipsSearchAria')}
        </label>
        <input
          id="clips-search-input"
          type="search"
          className="clips-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('clipsSearchPlaceholder')}
          aria-label={t('clipsSearchAria')}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {filteredSections.length === 0 ? (
        <div className="clips-search-empty">{t('clipsSearchEmpty')}</div>
      ) : (
        filteredSections.map((section) => (
          <section className="analysis-section" key={section.id} id={`clips-${section.id}`}>
            <div className="analysis-section-header">
              <h3 className="analysis-section-title">
                {L(CLIP_LABELS[section.id] ?? { en: section.id, it: section.id })}
              </h3>
              <span className="analysis-section-count">{section.clips.length}</span>
            </div>
            <div className="analysis-grid">
              {section.clips.map((clip) => (
                <article className="analysis-card" key={clip.id}>
                  <MatchMedia
                    slug={match.slug}
                    src={clip.videoFile}
                    kind="clips"
                    unsupportedLabel={t('videoUnsupported')}
                    playLabel={t('playVideo')}
                    title={L(clip.title)}
                  />
                  <div className="clip-card-body">
                    <div className="clip-card-time">{formatClipTimestamp(clip)}</div>
                    <div className="clip-card-title">{L(clip.title)}</div>
                    <div className="clip-card-desc">{L(clip.comments)}</div>
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
                </article>
              ))}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function isSessionPlanDoc(item: AnalysisVideo): boolean {
  if ((item.tags || []).includes('session-plan')) return true;
  const src = item.videoFile || '';
  return /session[_-]?plan/i.test(item.id) || /Session_Plan/i.test(src);
}

function TrainingDesignPanel({ match }: { match: MatchData }) {
  const { t, L } = useLanguage();
  // Prefer explicit trainingDesign; fall back to tagged session plans still in analysisVideos.
  const fromField = match.trainingDesign ?? [];
  const fromAnalysis = (match.analysisVideos ?? []).filter(isSessionPlanDoc);
  const items = fromField.length > 0 ? fromField : fromAnalysis;

  if (items.length === 0) {
    return (
      <div className="empty-clips">
        {t('noMatchTrainingDesign').replace(/\{slug\}/g, match.slug)}
      </div>
    );
  }

  return (
    <div className="video-section">
      <p className="video-hint">{t('trainingDesignHint')}</p>
      <div className="analysis-grid">
        {items.map((item: AnalysisVideo) => (
          <article className="analysis-card" key={item.id}>
            <MatchMedia
              slug={match.slug}
              src={item.videoFile}
              kind="analysis"
              unsupportedLabel={t('videoUnsupported')}
              playLabel={t('playVideo')}
              openPdfLabel={t('openPdf')}
              downloadPdfLabel={t('downloadPdf')}
              openReportLabel={t('openReport')}
              openDocLabel={t('openDoc')}
              title={L(item.title)}
              autoload
            />
            <div className="clip-card-body">
              <div className="clip-card-title">{L(item.title)}</div>
              <div className="clip-card-desc">{L(item.description)}</div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function VideoAnalysisPanel({ match }: { match: MatchData }) {
  const { t, L } = useLanguage();
  // Analyst videos + remaining docs. Session-plan PDFs → Training Design.
  const videos = (match.analysisVideos ?? []).filter((item) => !isSessionPlanDoc(item));

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
            <MatchMedia
              slug={match.slug}
              src={item.videoFile}
              kind="analysis"
              unsupportedLabel={t('videoUnsupported')}
              playLabel={t('playVideo')}
              openPdfLabel={t('openPdf')}
              downloadPdfLabel={t('downloadPdf')}
              openReportLabel={t('openReport')}
              openDocLabel={t('openDoc')}
              title={L(item.title)}
              autoload
            />
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
