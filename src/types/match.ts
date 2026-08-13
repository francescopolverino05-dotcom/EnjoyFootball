import type { Localized } from '../i18n/translations';
import type { ClipLabelId } from '../i18n/clipLabels';
import type { MatchReflection } from './scoutNotes';

export type { Localized };
export type { ClipLabelId };

export interface TeamInfo {
  id: string;
  name: Localized;
  shortName: string;
  colorClass: 'u19' | 'u18' | 'opponent';
  /**
   * Crest under `public/` (e.g. `napoli-logo.png`, `logos/portici.png`).
   * UI picks the Napoli white variant on dark badge backgrounds.
   */
  logo?: string;
}

export interface Goal {
  minute: number;
  scorer: string;
  position?: string;
  /** Null/omitted = no assist recorded. */
  assist?: string | null;
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
  /** Optional pitch diagram under matches/<slug>/ (e.g. assets/formation-napoli.png). */
  image?: string;
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
  /** Short half/period label for table columns, e.g. "1° Tempo". */
  period?: Localized;
  jerseyColor: Localized;
  shotsFaced: number;
  shotsOnTargetFaced?: number;
  saves: number;
  reflexSaves?: number;
  goalsConceded: number;
  /** e.g. "50.0%" */
  savePercentage?: Localized;
  /** e.g. "1 / 1 (100%)" */
  aerialDuels?: Localized;
  exits?: number;
  /** e.g. "10 / 7 (70%)" */
  passes?: Localized;
  notes?: Localized;
  colorClass: 'blue' | 'orange' | 'green';
}

/** Squad appearance / substitution row for the match sheet. */
export interface PlayerAppearance {
  name: string;
  teamId: string;
  number?: number | null;
  /** True if in the starting XI. */
  starter?: boolean;
  /** Minute entered (0 for starters). Omit when unknown. */
  onMinute?: number | null;
  /** Minute left. Omit / null if finished or unknown. */
  offMinute?: number | null;
  /** Goal minutes scored by this player. */
  goals?: number[];
  /** Assist minutes. */
  assists?: number[];
  /** Yellow card minutes. */
  yellowCards?: number[];
  /** Red card minutes. */
  redCards?: number[];
  notes?: Localized;
}

export interface MatchAppearances {
  home: PlayerAppearance[];
  away: PlayerAppearance[];
  notes?: Localized;
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

/** Longer analyst video breakdowns or PDF documents (not raw match clips). */
export interface AnalysisVideo {
  id: string;
  title: Localized;
  description: Localized;
  /** Relative path under analysis/, absolute URL, Vimeo URL, or PDF path */
  videoFile: string;
  /** Optional; inferred from videoFile when omitted (e.g. .pdf → document). */
  kind?: 'video' | 'pdf' | 'markdown' | 'docx';
  createdAt?: string;
  tags?: string[];
}

/** Season bucket for Matches list tabs (see matchCompetitions.ts). */
export type MatchCompetitionId =
  | 'friendlies'
  | 'primavera2'
  | 'uefaYouthLeague'
  | 'coppaItalia';

export interface MatchData {
  id: string;
  slug: string;
  title: Localized;
  subtitle: Localized;
  date: string;
  /**
   * Machine-readable competition bucket for /matches tabs.
   * Prefer setting this explicitly; otherwise inferred from competition/slug.
   */
  competitionId?: MatchCompetitionId;
  /** Display label on cards / headers (localized). */
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
  /**
   * Individual GK review videos (shown on the Goalkeeper Analysis tab).
   * Separate from post-match Video Analysis.
   */
  goalkeeperAnalysisVideos?: AnalysisVideo[];
  /** Optional squad / substitution appearance lists (home + away). */
  appearances?: MatchAppearances;
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
  /** Post-match WWB/EBI (CAB/AMS) reflection notes. */
  reflection?: MatchReflection;
}

export interface MatchSummary {
  id: string;
  slug: string;
  title: Localized;
  date: string;
  competitionId: MatchCompetitionId;
  competition: Localized;
  status: MatchData['status'];
  homeTeam: string;
  awayTeam: string;
  homeLogo?: string;
  awayLogo?: string;
  homeColorClass: TeamInfo['colorClass'];
  awayColorClass: TeamInfo['colorClass'];
  score: { home: number; away: number };
  /** Pre-season microcycle label for friendlies (Day 1, Day 2, …). */
  microcycleDay?: number | null;
}
