import type { OppositionClipSectionId } from '../i18n/oppositionClipSections';
import type { Localized } from '../i18n/translations';
import type { AnalysisVideo, PitchPlayer } from './match';
import type { MatchCompetitionId } from './match';

/** Competitions that have an Opposition directory (no Friendlies). */
export type OppositionCompetitionId = Extract<
  MatchCompetitionId,
  'primavera2' | 'coppaItalia' | 'uefaYouthLeague'
>;

/** 3 of theirs + optional 4th later = how we played them last time. */
export const OPPOSITION_MAX_REFERENCE_MATCHES = 4;

export interface OppositionSquadPlayer {
  number?: number | null;
  name: string;
  position?: string;
  isGk?: boolean;
}

export interface OppositionReferenceMatch {
  id: string;
  date?: string;
  title: Localized;
  competition?: Localized;
  score?: string;
  notes?: Localized;
  videoFile?: string;
}

export type GkShotType = 'outside-box' | 'inside-box' | 'penalty' | 'free-kick';
export type GkFootSide = 'left' | 'right';
export type GkFootZone = 'inside' | 'toe' | 'outside';

/** One finishing action, plotted on the pitch and the goal. */
export interface GkShot {
  id: string;
  title: Localized;
  videoFile?: string;
  type: GkShotType;
  /** 0 = left touchline, 100 = right, attacking toward the goal at the top. */
  pitchX: number;
  /** 0 = far from goal, 100 = goal line. */
  pitchY: number;
  /** 0 = left post, 100 = right post. */
  goalX: number;
  /** 0 = crossbar, 100 = ground. */
  goalY: number;
  foot: GkFootSide;
  footZone: GkFootZone;
}

export interface GkStrikerClip {
  id: string;
  title: Localized;
  videoFile: string;
  comments?: Localized;
}

export interface GkStrikerProfile {
  id: string;
  name: string;
  number?: number | null;
  /** Visual draft only — not a real scouted player. */
  isSample?: boolean;
  shots: GkShot[];
  /** Individual finishing / movement clips for this striker. */
  clips: GkStrikerClip[];
}

/** Phase clip in the opposition library (tactical labels). */
export interface OppositionPhaseClip {
  id: string;
  title: Localized;
  comments?: Localized;
  videoFile: string;
  section: OppositionClipSectionId;
  tags?: string[];
}

/** Scout pack tied to one of *our* fixtures vs this club. */
export interface OppositionFixturePack {
  referenceMatches: OppositionReferenceMatch[];
  /** Written notes and/or video reports for this fixture. */
  reportItems: AnalysisVideo[];
}

export interface OppositionOpponent {
  id: string;
  slug: string;
  name: Localized;
  shortName: string;
  logo: string;
  competitions: OppositionCompetitionId[];
  formationSystem: string;
  starters: PitchPlayer[];
  substitutes: OppositionSquadPlayer[];
  squad: OppositionSquadPlayer[];
  /** Club clip library (tactical phases). Not copied per fixture. */
  clips: OppositionPhaseClip[];
  /** Individual strikers for shot maps and finishing analysis. */
  gkStrikers: GkStrikerProfile[];
  /** Keyed by our match slug (e.g. campionato-avellino-vs-u19). */
  fixturePacks: Record<string, OppositionFixturePack>;
}
