import type { Localized } from '../i18n/translations';

export type { Localized };

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

export interface VideoClip {
  id: string;
  title: Localized;
  description: Localized;
  minute?: number;
  videoFile: string;
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
  clips: VideoClip[];
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
