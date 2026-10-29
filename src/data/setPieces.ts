/**
 * Set-piece data for one opposition (optional `setPieces` field on each
 * OppositionOpponent in src/data/opposition.ts). Missing data renders the
 * empty layout (blank pitches + "not filled in yet"). Coordinates use the
 * 320×190 pitch viewBox (goal at top). Arrows with `n` get a yellow number.
 */
export interface SpZone { x: number; y: number; width: number; height: number; opacity?: number }
export interface SpArrow { x1: number; y1: number; x2: number; y2: number; n?: number }
export interface SpTaker { player: string; foot: string; total: number; fromLeft: number; fromRight: number }
export interface SpPanel {
  zones?: SpZone[];
  arrows?: SpArrow[]; // arrows with `n` get a numbered yellow marker at the start
  note?: string;
  orderedNotesTitle?: string;
  orderedNotes?: string[];
}
export interface SpSection { left?: SpPanel; right?: SpPanel; takers?: SpTaker[] }
export type SpZoneId = 'area' | 'near' | 'far' | 'short' | 'edge';
export type SpLoc = { en: string; it: string };
/** One logged set piece. `side` is the side of the pitch it was taken from, goal at the top. */
export interface SpEvent {
  time: string;
  kind: 'corner' | 'freeKick';
  side: 'L' | 'R';
  zone: SpZoneId;
  delivery: SpLoc;
  outcome: SpLoc;
  goal?: boolean;
}
/** Curved arrow in the 320×190 pitch viewBox: start, control point, end. `n` = how many set pieces it stands for. */
export interface SpDiagramArrow { kind: 'corner' | 'freeKick'; zone: SpZoneId; x1: number; y1: number; cx: number; cy: number; x2: number; y2: number; n: number }
/** Delivery-zone diagram + full event list (all set pieces from the reference tape). */
export interface SpDiagram {
  counts: Record<SpZoneId, number>;
  arrows: SpDiagramArrow[];
  events: SpEvent[];
  notes: SpLoc[];
}
export interface OppositionSetPieces {
  source?: string;
  diagram?: SpDiagram;
  corners?: SpSection;
  freeKicks?: SpSection;
}

