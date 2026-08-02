export interface TeamInfo {
  id: string;
  name: string;
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
  label: string;
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
  label: string;
  system: string;
  players: PitchPlayer[];
}

export interface DynamicMetric {
  name: string;
  homeValue: number;
  awayValue: number;
  unit?: '%';
}

export interface TeamStat {
  category: string;
  name: string;
  home: string;
  away: string;
}

export interface GoalkeeperLog {
  name: string;
  minutes: number;
  team: string;
  jerseyColor: string;
  shotsFaced: number;
  saves: number;
  goalsConceded: number;
  notes?: string;
  colorClass: 'blue' | 'orange' | 'green';
}

export interface VideoClip {
  id: string;
  title: string;
  description: string;
  minute?: number;
  videoFile: string;
  tags?: string[];
}

export interface MatchData {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  date: string;
  competition: string;
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
    notes?: string;
  };
  clips: VideoClip[];
}

export interface MatchSummary {
  id: string;
  slug: string;
  title: string;
  date: string;
  competition: string;
  status: MatchData['status'];
  homeTeam: string;
  awayTeam: string;
  score: { home: number; away: number };
}
