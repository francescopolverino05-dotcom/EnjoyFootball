import { useMemo, useState } from 'react';
import type { VideoClip } from '../types/match';
import { useLanguage } from '../i18n/LanguageContext';
import {
  ANALYSIS_SECTION_ORDER,
  CLIP_LABELS,
  HIDDEN_CLIP_SECTIONS,
  MATCH_CLIP_GROUP_IDS,
  MATCH_CLIP_GROUP_LABEL_KEYS,
  matchClipGroupFor,
  type ClipLabelId,
  type MatchClipGroupId,
} from '../i18n/clipLabels';
import MatchMedia from './MatchMedia';

function clipSortKey(clip: VideoClip): number {
  return clip.minute * 60 + (clip.second ?? 0);
}

type MediaLibrary = 'matches' | 'trainings';

/**
 * Clips library with Opposition-style phase toggles
 * (Attack / Defence / Transition / Set pieces).
 */
export default function PhaseClipsPanel({
  slug,
  clips,
  library = 'matches',
  emptyMessage,
  includeOtherSection = false,
}: {
  slug: string;
  clips: VideoClip[];
  library?: MediaLibrary;
  emptyMessage: string;
  /** Training often syncs uncategorized clips as `other`. */
  includeOtherSection?: boolean;
}) {
  const { t, L } = useLanguage();
  const [activeGroups, setActiveGroups] = useState<Set<MatchClipGroupId>>(
    () => new Set<MatchClipGroupId>(['attack'])
  );

  const sectionOrder = useMemo(() => {
    const order = [...ANALYSIS_SECTION_ORDER];
    if (includeOtherSection) order.push('other');
    return order;
  }, [includeOtherSection]);

  const clipsBySectionId = useMemo(() => {
    const map = new Map<ClipLabelId, VideoClip[]>();
    for (const clip of clips) {
      const key = (clip.section ?? clip.labels[0] ?? 'other') as ClipLabelId;
      if (key === 'goal') continue;
      if (!includeOtherSection && HIDDEN_CLIP_SECTIONS.has(key)) continue;
      if (key === 'other' && !includeOtherSection) continue;
      const list = map.get(key) ?? [];
      list.push(clip);
      map.set(key, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => clipSortKey(a) - clipSortKey(b));
    }
    return map;
  }, [clips, includeOtherSection]);

  const hasAnyClips = clipsBySectionId.size > 0;

  const sectionsToShow = useMemo(() => {
    return sectionOrder
      .filter((id) => {
        if (id === 'other') return includeOtherSection && activeGroups.has('attack');
        // Generic catch-all — only show when clips were tagged `set-piece`.
        if (
          id === 'set-piece' &&
          (clipsBySectionId.get(id)?.length ?? 0) === 0
        ) {
          return false;
        }
        return activeGroups.has(matchClipGroupFor(id));
      })
      .map((id) => ({
        id,
        clips: clipsBySectionId.get(id) ?? [],
      }));
  }, [sectionOrder, activeGroups, clipsBySectionId, includeOtherSection]);

  function toggleGroup(groupId: MatchClipGroupId) {
    setActiveGroups((prev) => {
      const next = new Set(prev);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  if (!hasAnyClips) {
    return <div className="empty-clips">{emptyMessage}</div>;
  }

  return (
    <div className="video-section">
      <p className="video-hint">{t('clipsHint')}</p>

      <div
        className="opposition-clip-toggles"
        role="group"
        aria-label={t('oppositionClipFilterAria')}
      >
        {MATCH_CLIP_GROUP_IDS.map((groupId) => {
          const on = activeGroups.has(groupId);
          return (
            <button
              key={groupId}
              type="button"
              aria-pressed={on}
              className={`opposition-clip-toggle ${on ? 'active' : ''}`}
              onClick={() => toggleGroup(groupId)}
            >
              {t(MATCH_CLIP_GROUP_LABEL_KEYS[groupId])}
            </button>
          );
        })}
      </div>

      {sectionsToShow.length === 0 ? (
        <p className="home-empty">{t('oppositionClipFilterEmpty')}</p>
      ) : (
        sectionsToShow.map((section) => (
          <div className="opposition-clip-section" key={section.id}>
            <div className="section-title">
              {L(CLIP_LABELS[section.id] ?? { en: section.id, it: section.id })}
            </div>
            {section.clips.length === 0 ? (
              <p className="home-empty">{t('oppositionClipSectionEmpty')}</p>
            ) : (
              <div className="analysis-grid">
                {section.clips.map((clip) => (
                  <article className="analysis-card" key={clip.id}>
                    <MatchMedia
                      library={library}
                      slug={slug}
                      src={clip.videoFile}
                      kind="clips"
                      unsupportedLabel={t('videoUnsupported')}
                      playLabel={t('playVideo')}
                      title={L(clip.title)}
                    />
                    <div className="clip-card-body">
                      <div className="clip-card-title">{L(clip.title)}</div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
