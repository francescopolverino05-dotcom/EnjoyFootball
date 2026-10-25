/**
 * Opposition set pieces (corners + free kicks). One entry = one tab on
 * /opposition/set-pieces. To add an opposition, push `{ id, name }` — every
 * other field is optional and missing data renders an empty layout
 * (blank pitches + "not filled in yet" tables) until it is filled in.
 * Coordinates use the 320×190 pitch viewBox (goal at top).
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
  id: string;
  name: string;
  source?: string;
  corners?: SpSection;
  freeKicks?: SpSection;
}

export const SET_PIECES: OppositionSetPieces[] = [
  {
    id: 'asteras-tripolis-ii',
    name: 'Asteras Tripolis II',
    source: 'Wyscout team report p.15 · vs Panargiakos, AEK Athens B, Panachaiki (Mar 2025)',
    corners: {
      left: {
        zones: [
          { x: 10, y: 6, width: 60, height: 70, opacity: 0.6 },
          { x: 70, y: 6, width: 50, height: 70 },
          { x: 120, y: 6, width: 80, height: 22, opacity: 0.7 },
        ],
        arrows: [
          { x1: 12, y1: 8, x2: 160, y2: 18 },
          { x1: 12, y1: 8, x2: 52, y2: 52 },
          { x1: 12, y1: 8, x2: 110, y2: 52 },
        ],
      },
      right: {
        zones: [
          { x: 70, y: 6, width: 180, height: 70, opacity: 0.5 },
          { x: 120, y: 6, width: 80, height: 22 },
        ],
        arrows: [{ x1: 308, y1: 8, x2: 145, y2: 18 }],
      },
      takers: [
        { player: '37 G. Tourkochoritis', foot: 'Right', total: 4, fromLeft: 0, fromRight: 4 },
        { player: '73 K. Roumeliotis', foot: 'Unknown', total: 4, fromLeft: 3, fromRight: 1 },
        { player: '12 K. Bouloulis', foot: 'Right', total: 2, fromLeft: 0, fromRight: 2 },
        { player: '23 L. Frroku', foot: 'Right', total: 2, fromLeft: 0, fromRight: 2 },
        { player: '27 S. Faraj', foot: 'Right', total: 1, fromLeft: 1, fromRight: 0 },
      ],
    },
    freeKicks: {
      left: {
        arrows: [
          { x1: 35, y1: 170, x2: 140, y2: 72 },
          { x1: 105, y1: 170, x2: 165, y2: 62 },
        ],
        note: 'Maggiore (right foot) ×2 · Del Sante (left foot) ×1',
      },
      right: {
        arrows: [
          { x1: 235, y1: 125, x2: 150, y2: 30, n: 1 },
          { x1: 292, y1: 140, x2: 118, y2: 20, n: 2 },
          { x1: 278, y1: 104, x2: 124, y2: 26, n: 3 },
          { x1: 245, y1: 112, x2: 175, y2: 94, n: 4 },
          { x1: 225, y1: 135, x2: 160, y2: 48, n: 5 },
        ],
        orderedNotesTitle: 'Right side, in order (yellow numbers on the pitch):',
        orderedNotes: [
          'Del Sante (left foot), the first free kick',
          'Longhi (right foot), deep right at about 30 yards, to the far post',
          'Longhi (right foot), taken short, to the far post',
          'Longhi (right foot), taken near free kicks 1 and 5 at the edge of the box, finishing at the D (penalty arc). Poorly taken.',
          'Last free kick, played to the centre into the penalty box (taker not given)',
        ],
      },
      takers: [
        { player: '73 K. Roumeliotis', foot: 'Unknown', total: 3, fromLeft: 0, fromRight: 3 },
        { player: '32 F. Dettler', foot: 'Left', total: 2, fromLeft: 1, fromRight: 1 },
        { player: '37 G. Tourkochoritis', foot: 'Right', total: 1, fromLeft: 1, fromRight: 0 },
      ],
    },
  },
];
