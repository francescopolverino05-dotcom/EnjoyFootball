import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import type {
  TrainingGoalkeepersBlock,
  TrainingMediaBlock,
  TrainingSession,
} from '../types/training';
import { EMPTY_TRAINING_GOALKEEPERS } from '../types/training';
import type { AnalysisVideo, VideoClip } from '../types/match';
import { useLanguage } from '../i18n/LanguageContext';
import { getGaconSessionByTrainingSlug } from '../data/gaconLoad';
import { getRpeSessionByTrainingSlug } from '../data/rpeLoad';
import { getTqrSessionByTrainingSlug } from '../data/tqrLoad';
import MatchMedia from './MatchMedia';
import PhaseClipsPanel from './PhaseClipsPanel';
import PhysicalLoadPanel from './PhysicalLoadPanel';

type RoleView = 'team' | 'gk';

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

/** Resolved media for the active Team / Goalkeepers mode */
type ContentSource = {
  video?: TrainingMediaBlock;
  clips: VideoClip[];
  analysisVideos: AnalysisVideo[];
  trainingDesign?: AnalysisVideo[] | null;
};

function resolveGkBlock(
  block: TrainingGoalkeepersBlock | undefined
): TrainingGoalkeepersBlock {
  return block ?? EMPTY_TRAINING_GOALKEEPERS;
}

function contentForRole(
  session: TrainingSession,
  role: RoleView
): ContentSource {
  if (role === 'gk') {
    const gk = resolveGkBlock(session.goalkeepers);
    return {
      video: gk.video,
      clips: gk.clips ?? [],
      analysisVideos: gk.analysisVideos ?? [],
      trainingDesign: gk.trainingDesign,
    };
  }
  return {
    video: session.video,
    clips: session.clips ?? [],
    analysisVideos: session.analysisVideos ?? [],
    trainingDesign: session.trainingDesign,
  };
}

export default function TrainingDashboard({
  session,
}: {
  session: TrainingSession;
}) {
  const [searchParams, setSearchParams] = useSearchParams();
  const role: RoleView = searchParams.get('view') === 'gk' ? 'gk' : 'team';
  const [activeTab, setActiveTab] = useState<TabId>('fullsession');
  const { t } = useLanguage();
  const rpeSession = getRpeSessionByTrainingSlug(session.slug);
  const tqrSession = getTqrSessionByTrainingSlug(session.slug);
  const gaconSession = getGaconSessionByTrainingSlug(session.slug);
  const hasPhysicalLoad =
    role === 'team' && Boolean(rpeSession || tqrSession || gaconSession);

  const content = contentForRole(session, role);
  const emptyKey = role === 'gk' ? 'noGkContent' : undefined;

  const setRole = (next: RoleView) => {
    setSearchParams(
      (prev) => {
        const params = new URLSearchParams(prev);
        if (next === 'gk') params.set('view', 'gk');
        else params.delete('view');
        return params;
      },
      { replace: true }
    );
  };

  useEffect(() => {
    if (role === 'gk' && activeTab === 'physicalload') {
      setActiveTab('fullsession');
    }
  }, [role, activeTab]);

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
      <div
        className="tabs-header training-role-tabs"
        role="tablist"
        aria-label={t('trainingViewAria')}
      >
        <button
          type="button"
          role="tab"
          aria-selected={role === 'team'}
          className={`tab-button ${role === 'team' ? 'active' : ''}`}
          onClick={() => setRole('team')}
        >
          {t('trainingViewTeam')}
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={role === 'gk'}
          className={`tab-button ${role === 'gk' ? 'active' : ''}`}
          onClick={() => setRole('gk')}
        >
          {t('trainingViewGoalkeepers')}
        </button>
      </div>

      <div
        className="tabs-header"
        role="tablist"
        aria-label={t('trainingContentAria')}
      >
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
        <FullSessionPanel
          slug={session.slug}
          video={content.video}
          emptyKey={emptyKey ?? 'noTrainingVideo'}
        />
      </div>
      <div className={`tab-content ${activeTab === 'clips' ? 'active' : ''}`}>
        <PhaseClipsPanel
          slug={session.slug}
          clips={content.clips}
          library="trainings"
          includeOtherSection
          emptyMessage={t(emptyKey ?? 'noTrainingClips').replace(
            /\{slug\}/g,
            session.slug
          )}
        />
      </div>
      <div
        className={`tab-content ${activeTab === 'trainingdesign' ? 'active' : ''}`}
      >
        <TrainingDesignPanel
          slug={session.slug}
          trainingDesign={content.trainingDesign}
          analysisVideos={content.analysisVideos}
          emptyKey={emptyKey ?? 'noTrainingDesign'}
        />
      </div>
      <div
        className={`tab-content ${activeTab === 'videoanalysis' ? 'active' : ''}`}
      >
        <TrainingAnalysisPanel
          slug={session.slug}
          analysisVideos={content.analysisVideos}
          emptyKey={emptyKey ?? 'noTrainingAnalysis'}
        />
      </div>
      {hasPhysicalLoad ? (
        <div
          className={`tab-content ${activeTab === 'physicalload' ? 'active' : ''}`}
        >
          <PhysicalLoadPanel
            session={rpeSession ?? null}
            tqrSession={tqrSession ?? null}
            gaconSession={gaconSession ?? null}
          />
        </div>
      ) : null}
    </>
  );
}

function FullSessionPanel({
  slug,
  video,
  emptyKey,
}: {
  slug: string;
  video?: TrainingMediaBlock;
  emptyKey: 'noTrainingVideo' | 'noGkContent';
}) {
  const { t, L } = useLanguage();
  const parts = video?.parts ?? [];
  const src = video?.fullSession ?? null;

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
                  slug={slug}
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
      {emptyKey === 'noGkContent' ? null : (
        <p className="video-hint">{t('fullSessionHint')}</p>
      )}
      {src ? (
        <MatchMedia
          library="trainings"
          slug={slug}
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
          {t(emptyKey).replace(/\{slug\}/g, slug)}
        </div>
      )}
    </div>
  );
}

function DocMediaGrid({
  slug,
  items,
  hintKey,
  emptyKey,
}: {
  slug: string;
  items: AnalysisVideo[];
  hintKey: 'videoAnalysisHint' | 'trainingDesignHint';
  emptyKey: 'noTrainingAnalysis' | 'noTrainingDesign' | 'noGkContent';
}) {
  const { t, L } = useLanguage();

  if (items.length === 0) {
    return (
      <div className="empty-clips">
        {t(emptyKey).replace(/\{slug\}/g, slug)}
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
              slug={slug}
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

function TrainingDesignPanel({
  slug,
  trainingDesign,
  analysisVideos,
  emptyKey,
}: {
  slug: string;
  trainingDesign?: AnalysisVideo[] | null;
  analysisVideos: AnalysisVideo[];
  emptyKey: 'noTrainingDesign' | 'noGkContent';
}) {
  // Prefer explicit trainingDesign; fall back to tagged session plans still in analysisVideos.
  const fromField = trainingDesign ?? [];
  const fromAnalysis = analysisVideos.filter(isSessionPlanDoc);
  const items = fromField.length > 0 ? fromField : fromAnalysis;

  return (
    <DocMediaGrid
      slug={slug}
      items={items}
      hintKey="trainingDesignHint"
      emptyKey={emptyKey}
    />
  );
}

function TrainingAnalysisPanel({
  slug,
  analysisVideos,
  emptyKey,
}: {
  slug: string;
  analysisVideos: AnalysisVideo[];
  emptyKey: 'noTrainingAnalysis' | 'noGkContent';
}) {
  // Analyst videos + remaining docs (Vimeo analysis, md/docx). Session-plan PDFs → Training Design.
  const videos = analysisVideos.filter((item) => !isSessionPlanDoc(item));

  return (
    <DocMediaGrid
      slug={slug}
      items={videos}
      hintKey="videoAnalysisHint"
      emptyKey={emptyKey}
    />
  );
}
