import type { Localized } from '../i18n/translations';

/**
 * Set-piece data for one opposition (optional `setPieces` field on each
 * OppositionOpponent in src/data/opposition.ts). Missing data renders the
 * empty layout (blank pitches + "not filled in yet"). Coordinates use the
 * 320×190 pitch viewBox (goal at top). Arrows with `n` get a yellow number.
 */
export interface SpZone { x: number; y: number; width: number; height: number; opacity?: number }
/** How the delivery ended (drawn as a coloured arrow plus a badge at the end; legend shown under the panels). */
export type SpOutcome = 'goal' | 'woodwork' | 'save' | 'cleared' | 'offTarget';
/** Delivery type: 'in' / 'out' curve the arrow (in = towards the goal, out = away); 'short' draws a dashed straight pass. Omitted = straight black arrow. */
export type SpSwing = 'in' | 'out' | 'short';
export interface SpArrow { x1: number; y1: number; x2: number; y2: number; n?: number; nAt?: 'start' | 'end'; swing?: SpSwing; outcome?: SpOutcome }
export interface SpTaker { player: SpText; foot: SpText; total: number; fromLeft: number; fromRight: number; fromCentre?: number }
/** Plain string (shown as-is in both languages) or {en,it}. */
export type SpText = Localized;
export interface SpPanel {
  zones?: SpZone[];
  arrows?: SpArrow[]; // arrows with `n` get a numbered yellow marker at the start (or at the end with nAt: 'end')
  note?: SpText;
  noteTitle?: SpText; // defaults to "Takers:"
  orderedNotesTitle?: SpText;
  orderedNotes?: SpText[];
}
export interface SpSection { left?: SpPanel; right?: SpPanel; /** Optional third panel (central free kicks). */ centre?: SpPanel; takers?: SpTaker[] }
export interface OppositionSetPieces {
  source?: SpText;
  /** Optional headline notes shown above the corner panels (same note style as the panels). */
  keyNotesTitle?: SpText;
  keyNotes?: SpText[];
  corners?: SpSection;
  freeKicks?: SpSection;
}

