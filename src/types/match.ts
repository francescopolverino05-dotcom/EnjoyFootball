import type { Localized } from '../i18n/translations';
import type { ClipLabelId } from '../i18n/clipLabels';

export type { Localized };
export type { ClipLabelId };

export interface TeamInfo {
  id: string;
  name: Localized;
  shortName: string;
  colorClass: 'u19' | 'u18' | 'opponent';
}

export interface Goal {
  minute: number;
  scorer: string;
  position?: string;
  teamId: string;
}

export interface TimelineEvent {
  minute: number;
  label: Localized;
  type: 'goal' | 'substitution' | 'gk-entry' | 'other';
  teamId?: string;
  positionPercent: number;
  markerColor?: string;
}

export interface PitchPlayer {
  number: number;
  name: string;
  teamId: string;
  isGk?: boolean;
  top?: string;
  bottom?: string;
  left: string;
}

export interface Formation {
  teamId: string;
  label: Localized;
  system: string;
  players: PitchPlayer[];
}

export interface DynamicMetric {
  name: Localized;
  homeValue: number;
  awayValue: number;
  unit?: '%';
}

export interface TeamStat {
  category: Localized;
  name: Localized;
  home: Localized;
  away: Localized;
}

export interface GoalkeeperLog {
  name: string;
  minutes: number;
  team: Localized;
  jerseyColor: Localized;
  shotsFaced: number;
  saves: number;
  goalsConceded: number;
  notes?: Localized;
  colorClass: 'blue' | 'orange' | 'green';
}

/** Match clip with controlled labels + analyst comments (tags). */
export interface VideoClip {
  id: string;
  /** Short title shown in the clip list */
  title: Localized;
  /** Analyst comments — free text from the analyst */
  comments: Localized;
  /** Match minute (and optional seconds) for chronological sorting */
  minute: number;
  second?: number;
  /** Path relative to matches/<slug>/clips/ (or absolute https URL after publish) */
  videoFile: string;
  /** Original relative path on disk — kept so re-publish can find the file after videoFile becomes a URL */
  localFile?: string;
  /** Section id used to group on Video Analysis (usually same as primary label) */
  section?: ClipLabelId;
  /** Controlled labels from CLIP_LABEL_IDS */
  labels: ClipLabelId[];
  /**
   * Analyst tags (shown as comment chips).
   * Prefer `comments` for prose; use tags for short keywords.
   */
  tags?: string[];
}

/** Longer analyst video breakdowns (not raw match clips). */
export interface AnalysisVideo {
  id: string;
  title: Localized;
  description: Localized;
  videoFile: string;
  createdAt?: string;
  tags?: string[];
}

export interface MatchData {
  id: string;
  slug: string;
  title: Localized;
  subtitle: Localized;
  date: string;
  competition: Localized;
  status: 'draft' | 'in-review' | 'published';
  homeTeam: TeamInfo;
  awayTeam: TeamInfo;
  score: { home: number; away: number };
  goals: Goal[];
  timeline: TimelineEvent[];
  formations: Formation[];
  dynamics: DynamicMetric[];
  teamStats: TeamStat[];
  goalkeepers: GoalkeeperLog[];
  video?: {
    fullMatch?: string;
    notes?: Localized;
  };
  /** Vimeo hosting for this match (folder preferred). */
  vimeo?: {
    folderId?: string;
    folderUrl?: string;
    showcaseId?: string;
  };
  clips: VideoClip[];
  analysisVideos: AnalysisVideo[];
}

export interface MatchSummary {
  id: string;
  slug: string;
  title: Localized;
  date: string;
  competition: Localized;
  status: MatchData['status'];
  homeTeam: string;
  awayTeam: string;
  score: { home: number; away: number };
}
