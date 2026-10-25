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
export interface OppositionSetPieces {
  source?: string;
  corners?: SpSection;
  freeKicks?: SpSection;
}

