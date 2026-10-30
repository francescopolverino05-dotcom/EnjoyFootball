import type { Localized } from '../i18n/translations';

/**
 * Set-piece data for one opposition (optional `setPieces` field on each
 * OppositionOpponent in src/data/opposition.ts). Missing data renders the
 * empty layout (blank pitches + "not filled in yet"). Coordinates use the
 * 320×190 pitch viewBox (goal at top). Arrows with `n` get a yellow number.
 */
export interface SpZone { x: number; y: number; width: number; height: number; opacity?: number }
export interface SpArrow { x1: number; y1: number; x2: number; y2: number; n?: number; nAt?: 'start' | 'end' }
export interface SpTaker { player: string; foot: SpText; total: number; fromLeft: number; fromRight: number }
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
export interface SpSection { left?: SpPanel; right?: SpPanel; takers?: SpTaker[] }
export interface OppositionSetPieces {
  source?: SpText;
  /** Optional headline notes shown above the corner panels (same note style as the panels). */
  keyNotesTitle?: SpText;
  keyNotes?: SpText[];
  corners?: SpSection;
  freeKicks?: SpSection;
}

