import { Link } from 'react-router-dom';
import MatchMedia from './MatchMedia';
import { getCoachBriefing } from '../data/coachBriefing';
import { CLIP_LABELS, type ClipLabelId } from '../i18n/clipLabels';
import { useLanguage } from '../i18n/LanguageContext';
import type { MatchData } from '../types/match';

interface CoachBriefingPanelProps {
  match: MatchData;
}

function formatClipTimestamp(minute: number, second?: number): string {
  if (second == null) return `${minute}'`;
  return `${minute}'${String(second).padStart(2, '0')}`;
}

export default function CoachBriefingPanel({ match }: CoachBriefingPanelProps) {
  const { t, L } = useLanguage();
  const resolved = getCoachBriefing(match);

  if (!resolved) return null;

  const { briefing, isDraft, keyClips } = resolved;

  return (
    <section className="coach-briefing" aria-labelledby="coach-briefing-heading">
      <div className="coach-briefing-head">
        <div>
          <h2 id="coach-briefing-heading" className="section-title">
            {t('coachBriefingTitle')}
          </h2>
          <p className="coach-briefing-hint">{t('coachBriefingHint')}</p>
        </div>
        {isDraft ? (
          <span className="coach-draft-badge">{t('coachBriefingDraft')}</span>
        ) : null}
      </div>

      <div className="coach-briefing-hero">
        <p className="coach-briefing-kicker">{t('coachBriefingForStaff')}</p>
        <h3 className="coach-briefing-headline">{L(briefing.headline)}</h3>
        {briefing.summary ? (
          <p className="coach-briefing-summary">{L(briefing.summary)}</p>
        ) : null}
      </div>

      <div className="coach-briefing-grid">
        <div className="coach-briefing-col">
          <h4>{t('coachBriefingTakeaways')}</h4>
          <ol>
            {briefing.takeaways.map((item, index) => (
              <li key={`takeaway-${index}`}>{L(item)}</li>
            ))}
          </ol>
        </div>
        <div className="coach-briefing-col">
          <h4>{t('coachBriefingPriorities')}</h4>
          <ol>
            {briefing.priorities.map((item, index) => (
              <li key={`priority-${index}`}>{L(item)}</li>
            ))}
          </ol>
        </div>
      </div>

      {keyClips.length > 0 ? (
        <div className="coach-briefing-clips">
          <div className="coach-briefing-clips-head">
            <h4>{t('coachBriefingKeyClips')}</h4>
            <span>
              {t('coachBriefingClipCount').replace(
                '{n}',
                String(keyClips.length)
              )}
            </span>
          </div>
          <div className="coach-briefing-clip-grid">
            {keyClips.map((clip) => {
              const labelId = clip.labels[0] as ClipLabelId | undefined;
              const label = labelId
                ? L(CLIP_LABELS[labelId] ?? { en: labelId, it: labelId })
                : null;
              return (
                <article className="coach-briefing-clip-card" key={clip.id}>
                  <MatchMedia
                    slug={match.slug}
                    src={clip.videoFile}
                    kind="clips"
                    unsupportedLabel={t('videoUnsupported')}
                    playLabel={t('playVideo')}
                    title={L(clip.title)}
                  />
                  <div className="clip-card-body">
                    <div className="clip-card-time">
                      {formatClipTimestamp(clip.minute, clip.second)}
                      {label ? ` · ${label}` : ''}
                    </div>
                    <div className="clip-card-title">{L(clip.title)}</div>
                    <Link
                      to={`/match/${match.slug}?tab=clips&clip=${encodeURIComponent(clip.id)}`}
                      className="coach-briefing-link"
                    >
                      {t('coachBriefingOpenClip')}
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="coach-briefing-actions">
        <Link
          to={`/match/${match.slug}?tab=clips`}
          className="coach-briefing-cta"
        >
          {t('coachBriefingReviewAllClips')}
        </Link>
        <Link
          to={`/match/${match.slug}?tab=dynamics`}
          className="coach-briefing-secondary"
        >
          {t('coachBriefingOpenDashboard')}
        </Link>
      </div>
    </section>
  );
}
