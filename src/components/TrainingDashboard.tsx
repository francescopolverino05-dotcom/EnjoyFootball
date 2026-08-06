import { useMemo, useState } from 'react';
import type { TrainingSession } from '../types/training';
import type { AnalysisVideo, VideoClip } from '../types/match';
import { useLanguage } from '../i18n/LanguageContext';
import {
  CLIP_LABELS,
  ANALYSIS_SECTION_ORDER,
  type ClipLabelId,
} from '../i18n/clipLabels';
import { getRpeSessionByTrainingSlug } from '../data/rpeLoad';
import { getTqrSessionByTrainingSlug } from '../data/tqrLoad';
import MatchMedia from './MatchMedia';
import PhysicalLoadPanel from './PhysicalLoadPanel';

type TabId =
  | 'fullsession'
  | 'clips'
  | 'trainingdesign'
  | 'videoanalysis'
  | 'physicalload';

type TabLabelKey =
  | 'tabFullSession'
  | 'tabClips'
  | 'tabTrainingDesign'
  | 'tabVideoAnalysis'
  | 'tabPhysicalLoad';

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
  const rpeSession = getRpeSessionByTrainingSlug(session.slug);
  const tqrSession = getTqrSessionByTrainingSlug(session.slug);
  const hasPhysicalLoad = Boolean(rpeSession || tqrSession);

  const tabs: [TabId, TabLabelKey][] = [
    ['fullsession', 'tabFullSession'],
    ['clips', 'tabClips'],
    ['trainingdesign', 'tabTrainingDesign'],
    ['videoanalysis', 'tabVideoAnalysis'],
    ...(hasPhysicalLoad
      ? ([['physicalload', 'tabPhysicalLoad']] as [TabId, TabLabelKey][])
      : []),
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
        className={`tab-content ${activeTab === 'trainingdesign' ? 'active' : ''}`}
      >
        <TrainingDesignPanel session={session} />
      </div>
      <div
        className={`tab-content ${activeTab === 'videoanalysis' ? 'active' : ''}`}
      >
        <TrainingAnalysisPanel session={session} />
      </div>
      {hasPhysicalLoad ? (
        <div
          className={`tab-content ${activeTab === 'physicalload' ? 'active' : ''}`}
        >
          <PhysicalLoadPanel
            session={rpeSession ?? null}
            tqrSession={tqrSession ?? null}
          />
        </div>
      ) : null}
    </>
  );
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

/** Training Vimeo sync defaults uncategorized clips to `other`; match UI hides that section. */
const TRAINING_CLIP_SECTION_ORDER: ClipLabelId[] = [
  ...ANALYSIS_SECTION_ORDER,
  'other',
];

function TrainingClipsPanel({ session }: { session: TrainingSession }) {
  const { t, L } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const sections = useMemo(() => {
    const map = new Map<ClipLabelId, VideoClip[]>();
    for (const clip of session.clips) {
      const key = (clip.section ?? clip.labels[0] ?? 'other') as ClipLabelId;
      // Match Clips tab hides `goal`/`other`; training Vimeo sync defaults to `other`.
      if (key === 'goal') continue;
      const list = map.get(key) ?? [];
      list.push(clip);
      map.set(key, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => clipSortKey(a) - clipSortKey(b));
    }
    return TRAINING_CLIP_SECTION_ORDER.filter((id) => (map.get(id)?.length ?? 0) > 0).map(
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

function DocMediaGrid({
  session,
  items,
  hintKey,
  emptyKey,
}: {
  session: TrainingSession;
  items: AnalysisVideo[];
  hintKey: 'videoAnalysisHint' | 'trainingDesignHint';
  emptyKey: 'noTrainingAnalysis' | 'noTrainingDesign';
}) {
  const { t, L } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="empty-clips">
        {t(emptyKey).replace(/\{slug\}/g, session.slug)}
      </div>
    );
  }

  return (
    <div className="video-section">
      <p className="video-hint">{t(hintKey)}</p>
      <div className="analysis-grid">
        {items.map((item: AnalysisVideo) => (
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

function isSessionPlanDoc(item: AnalysisVideo): boolean {
  if ((item.tags || []).includes('session-plan')) return true;
  const src = item.videoFile || '';
  return /session[_-]?plan/i.test(item.id) || /Session_Plan/i.test(src);
}

function TrainingDesignPanel({ session }: { session: TrainingSession }) {
  // Prefer explicit trainingDesign; fall back to tagged session plans still in analysisVideos.
  const fromField = session.trainingDesign ?? [];
  const fromAnalysis = (session.analysisVideos ?? []).filter(isSessionPlanDoc);
  const items = fromField.length > 0 ? fromField : fromAnalysis;

  return (
    <DocMediaGrid
      session={session}
      items={items}
      hintKey="trainingDesignHint"
      emptyKey="noTrainingDesign"
    />
  );
}

function TrainingAnalysisPanel({ session }: { session: TrainingSession }) {
  // Analyst videos + remaining docs (Vimeo analysis, md/docx). Session-plan PDFs → Training Design.
  const videos = (session.analysisVideos ?? []).filter((item) => !isSessionPlanDoc(item));

  return (
    <DocMediaGrid
      session={session}
      items={videos}
      hintKey="videoAnalysisHint"
      emptyKey="noTrainingAnalysis"
    />
  );
}
