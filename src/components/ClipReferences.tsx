import { useLanguage } from '../i18n/LanguageContext';
import type { MatchClipReferences } from '../types/match';
import MatchMedia from './MatchMedia';

interface ClipReferencesProps {
  slug: string;
  data: MatchClipReferences;
}

/** Curated reference clips grouped into named sections (match page). */
export default function ClipReferences({ slug, data }: ClipReferencesProps) {
  const { t, L } = useLanguage();
  return (
    <section className="first-leg-reference clip-references" aria-labelledby="clip-references-title">
      <h2 className="section-title" id="clip-references-title">
        {L(data.title)}
      </h2>
      {data.hint ? <p className="video-hint">{L(data.hint)}</p> : null}
      {data.sections.map((section) => (
        <div className="first-leg-block" key={section.id}>
          <h3 className="team-stats-section-title">
            {L(section.title)} ({section.clips.length})
          </h3>
          <div className="clip-grid">
            {section.clips.map((clip) => (
              <div className="clip-card" key={clip.id}>
                <div className="clip-card-title">
                  <strong>{L(clip.title)}</strong>
                  {clip.minute != null ? ` · ${clip.minute}'` : ''}
                </div>
                {clip.comments ? <p className="clip-card-comments">{L(clip.comments)}</p> : null}
                <MatchMedia
                  slug={slug}
                  src={clip.videoFile}
                  kind="clips"
                  title={L(clip.title)}
                  unsupportedLabel={t('videoUnsupported')}
                  playLabel={t('playVideo')}
                />
              </div>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}
