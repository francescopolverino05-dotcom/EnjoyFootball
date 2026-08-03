import { useMemo, useState } from 'react';
import type { TrainingSession } from '../types/training';
import type { AnalysisVideo, VideoClip } from '../types/match';
import { useLanguage } from '../i18n/LanguageContext';
import {
  CLIP_LABELS,
  ANALYSIS_SECTION_ORDER,
  HIDDEN_CLIP_SECTIONS,
  type ClipLabelId,
} from '../i18n/clipLabels';
import MatchMedia from './MatchMedia';

type TabId = 'fullsession' | 'clips' | 'videoanalysis';

function clipSortKey(clip: VideoClip): number {
  return clip.minute * 60 + (clip.second ?? 0);
}

function formatClipTimestamp(clip: VideoClip): string {
  const s = clip.second ?? 0;
  return s > 0
    ? `${clip.minute}'${String(s).padStart(2, '0')}"`
    : `${clip.minute}'`;
}

export default function TrainingDashboard({
  session,
}: {
  session: TrainingSession;
}) {
  const [activeTab, setActiveTab] = useState<TabId>('fullsession');
  const { t } = useLanguage();

  const tabs: [TabId, 'tabFullSession' | 'tabClips' | 'tabVideoAnalysis'][] = [
    ['fullsession', 'tabFullSession'],
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

      <div className={`tab-content ${activeTab === 'fullsession' ? 'active' : ''}`}>
        <FullSessionPanel session={session} />
      </div>
      <div className={`tab-content ${activeTab === 'clips' ? 'active' : ''}`}>
        <TrainingClipsPanel session={session} />
      </div>
      <div
        className={`tab-content ${activeTab === 'videoanalysis' ? 'active' : ''}`}
      >
        <TrainingAnalysisPanel session={session} />
      </div>
    </>
  );
}

function isDocAnalysis(item: AnalysisVideo): boolean {
  if (item.kind === 'pdf' || item.kind === 'markdown') return true;
  const src = item.videoFile || '';
  return /\.pdf($|\?)/i.test(src) || /\.md($|\?)/i.test(src);
}

function FullSessionPanel({ session }: { session: TrainingSession }) {
  const { t, L } = useLanguage();
  const parts = session.video?.parts ?? [];
  const src = session.video?.fullSession ?? null;

  if (parts.length > 0) {
    return (
      <div className="video-section">
        <div className="section-title">{t('fullSessionVideo')}</div>
        <p className="video-hint">{t('fullSessionHint')}</p>
        <div className="analysis-grid">
          {parts.map((item) => {
            const src = item.videoFile || '';
            const remote = /^https?:\/\//i.test(src);
            // Local session parts live under analysis/ (paths often omit the prefix).
            const kind =
              remote || /^(analysis|clips|video)\//i.test(src) ? null : 'analysis';
            return (
              <article className="analysis-card" key={item.id}>
                <MatchMedia
                  library="trainings"
                  slug={session.slug}
                  src={src}
                  kind={kind}
                  unsupportedLabel={t('videoUnsupported')}
                  playLabel={t('playVideo')}
                  title={L(item.title)}
                  autoload
                />
                <div className="clip-card-body">
                  <div className="clip-card-title">{L(item.title)}</div>
                  {item.description ? (
                    <div className="clip-card-desc">{L(item.description)}</div>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="video-section">
      <div className="section-title">{t('fullSessionVideo')}</div>
      <p className="video-hint">{t('fullSessionHint')}</p>
      {src ? (
        <MatchMedia
          library="trainings"
          slug={session.slug}
          src={src}
          kind={null}
          unsupportedLabel={t('videoUnsupported')}
          playLabel={t('playVideo')}
          fullHeight
          autoload
          title={t('fullSessionVideo')}
        />
      ) : (
        <div className="video-placeholder">
          {t('noTrainingVideo').replace(/\{slug\}/g, session.slug)}
        </div>
      )}
    </div>
  );
}

function TrainingClipsPanel({ session }: { session: TrainingSession }) {
  const { t, L } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const sections = useMemo(() => {
    const map = new Map<ClipLabelId, VideoClip[]>();
    for (const clip of session.clips) {
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
  }, [session.clips]);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return sections;
    return sections
      .map((section) => ({
        ...section,
        clips: section.clips.filter((clip) => {
          const hay = [
            section.id,
            L(CLIP_LABELS[section.id] ?? { en: section.id, it: section.id }),
            L(clip.title),
            L(clip.comments),
            ...(clip.tags || []),
            formatClipTimestamp(clip),
            String(clip.minute),
          ]
            .join(' ')
            .toLowerCase();
          return hay.includes(q);
        }),
      }))
      .filter((s) => s.clips.length > 0);
  }, [sections, searchQuery, L]);

  if (sections.length === 0) {
    return (
      <div className="empty-clips">
        {t('noTrainingClips').replace(/\{slug\}/g, session.slug)}
      </div>
    );
  }

  return (
    <div className="video-section">
      <p className="video-hint">{t('clipsHint')}</p>
      <div className="clips-search">
        <label className="clips-search-label" htmlFor="training-clips-search">
          {t('clipsSearchAria')}
        </label>
        <input
          id="training-clips-search"
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
          <section
            className="analysis-section"
            key={section.id}
            id={`training-clips-${section.id}`}
          >
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
                    library="trainings"
                    slug={session.slug}
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

function TrainingAnalysisPanel({ session }: { session: TrainingSession }) {
  const { t, L } = useLanguage();
  // Session recordings live under Full Session (`video.parts`); this tab is for docs / analysis.
  const videos = (session.analysisVideos ?? []).filter(isDocAnalysis);

  if (videos.length === 0) {
    return (
      <div className="empty-clips">
        {t('noTrainingAnalysis').replace(/\{slug\}/g, session.slug)}
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
              library="trainings"
              slug={session.slug}
              src={item.videoFile}
              kind="analysis"
              unsupportedLabel={t('videoUnsupported')}
              playLabel={t('playVideo')}
              openPdfLabel={t('openPdf')}
              downloadPdfLabel={t('downloadPdf')}
              openReportLabel={t('openReport')}
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
