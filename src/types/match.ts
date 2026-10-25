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
  /** Omit / null when the minute is unknown. */
  minute?: number | null;
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
  /** Optional role label, e.g. "RCB". */
  role?: string;
  /** Starter whose pitch position is not known: listed under the pitch instead of placed. */
  positionUnknown?: boolean;
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
  /** Optional in-game shape changes, ordered by minute. */
  changes?: FormationChange[];
}

export interface FormationChange {
  minute: number;
  system: string;
  players: PitchPlayer[];
  note?: Localized;
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

/** Individual player row from K-SPORT GPS match report. */
export interface GpsPlayerRow {
  player: string;
  totalDistanceM: number;
  distancePerMin: number;
  distanceOver16KmhM: number;
  distance20to24KmhM: number;
  distanceOver24KmhM: number;
  metabolicPowerWkg: number;
  accelerationsOver3: number;
  decelerationsUnder3: number;
  maxSpeedKmh: number;
  recoveryPct: number;
}

export interface GpsHalfReport {
  half: Localized;
  players: GpsPlayerRow[];
  summary?: Localized;
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
   * Slug of the first-phase match against the same opponent.
   * A pointer only — the return fixture reads that report, it does not copy it.
   */
  firstLegSlug?: string;
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
  /** Final score, or null when the fixture has not been played yet. */
  score: { home: number; away: number } | null;
  goals: Goal[];
  timeline: TimelineEvent[];
  formations: Formation[];
  dynamics: DynamicMetric[];
  teamStats: TeamStat[];
  /** Optional K-SPORT GPS reports by half (fitness coach). */
  gpsStats?: GpsHalfReport[];
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
  /** Optional curated clip-reference area (e.g. set pieces from a previous meeting). */
  clipReferences?: MatchClipReferences;
  /** Per-match override of the Clips section tabs (replaces the default phase tabs). */
  clipTabs?: MatchClipTabs;
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
  /** Final score, or null when the fixture has not been played yet. */
  score: { home: number; away: number } | null;
  /** Pre-season microcycle label for friendlies (Day 1, Day 2, …). */
  microcycleDay?: number | null;
  /** First-phase match slug, when this fixture reuses that report. */
  firstLegSlug?: string;
}

export interface MatchClipReference {
  id: string;
  title: Localized;
  comments?: Localized;
  minute?: number;
  videoFile: string;
}

export interface MatchClipReferenceSection {
  id: string;
  title: Localized;
  clips: MatchClipReference[];
}

export interface MatchClipReferences {
  /** Optional wrapper title; omit to show section boxes only. */
  title?: Localized;
  hint?: Localized;
  sections: MatchClipReferenceSection[];
}

export interface MatchClipTabGroup {
  id: string;
  title: Localized;
  clips: MatchClipReference[];
}

export interface MatchClipTab {
  id: string;
  label: Localized;
  groups: MatchClipTabGroup[];
}

export interface MatchClipTabs {
  hint?: Localized;
  tabs: MatchClipTab[];
}
