import draftMap from './coachBriefingDraft.json';
import type { CoachBriefing, MatchData, VideoClip } from '../types/match';

interface DraftFile {
  briefings: Record<string, CoachBriefing>;
}

const draftBriefings = (draftMap as DraftFile).briefings;

export interface ResolvedCoachBriefing {
  briefing: CoachBriefing;
  /** true when content comes from draft overlay, not match.json */
  isDraft: boolean;
  keyClips: VideoClip[];
}

/** Resolve match.coachBriefing or the draft overlay for this slug. */
export function getCoachBriefing(
  match: MatchData
): ResolvedCoachBriefing | null {
  const fromMatch = match.coachBriefing;
  const fromDraft = draftBriefings[match.slug];
  const briefing = fromMatch ?? fromDraft;
  if (!briefing) return null;

  const clipById = new Map((match.clips ?? []).map((clip) => [clip.id, clip]));
  const keyClips = (briefing.keyClipIds ?? [])
    .map((id) => clipById.get(id))
    .filter((clip): clip is VideoClip => Boolean(clip));

  return {
    briefing,
    isDraft: !fromMatch && Boolean(fromDraft),
    keyClips,
  };
}
