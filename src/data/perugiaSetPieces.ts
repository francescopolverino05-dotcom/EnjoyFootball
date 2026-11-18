import type { OppositionSetPieces } from './setPieces';

/**
 * DRAFT — Perugia (Primavera 2) attacking set pieces.
 *
 * GENERATED from StatMan tags. Do not edit by hand — re-run
 *   python3 scripts/buildPerugiaSetPieces.py [path/to/statman_tags.csv]
 * after the CSV changes (StatMan may still revise free-kick sides
 * for p03–p23). Default CSV: /workspace/perugia_piazzati/statman_tags.csv
 *
 * Excluded: p00, p01, p02, p14 kick-offs; p09 defensive own-half free
 * kick; p26 throw-in; p29 Pescara (not Perugia) free kick (type other).
 *
 * Side rule: a right-footer’s inswinger comes from the LEFT and his
 * outswinger from the RIGHT; the reverse for a left-footer. Feet are
 * the kicking foot in the CSV, not invented from the squad sheet.
 * Short / driven / direct shots do not use that swing-side rule.
 *
 * Takers: a name or shirt is used only when the CSV `taker` field is
 * filled (readable on video). Official squad numbers are not mapped,
 * because they are not the 1–11 match shirts. Filename hints that
 * were not confirmed on the video stay in the notes.
 *
 * Arrow recipe (320×190, goal at the top; black arrows; short =
 * dashed teal; outcomes coloured when mapped):
 *   left corner (12, 8)    right corner (308, 8)
 *   n = clip sequence, nAt end unless a start number is clearer.
 *   Landings are conventional zone spots, auto-fanned when several
 *   share a zone. FK starts use the tagged distance
 *   (y ≈ 6 + yards×3.879, clipped to the final-third edge) and channel.
 */

const LEFT = { en: 'Left', it: 'Sinistro' } as const;
const RIGHT = { en: 'Right', it: 'Destro' } as const;
const UNID_RF = { en: 'Unidentified (right foot)', it: 'Non identificato (destro)' } as const;
const UNID_LF = { en: 'Unidentified (left foot)', it: 'Non identificato (sinistro)' } as const;

export const perugiaSetPiecesDraft: OppositionSetPieces = {
  source: { en: 'StatMan tags for clips p00–p36 (Perugia attacking set pieces).', it: 'Tag StatMan per le clip p00–p36 (palle inattive offensive del Perugia).' },
  keyNotesTitle: { en: 'Key notes — DRAFT: 30 Perugia attacking set pieces in p00–p36 (10 corners, 20 free kicks)', it: 'Note chiave — BOZZA: 30 palle inattive offensive del Perugia in p00–p36 (10 calci d’angolo, 20 punizioni)' },
  keyNotes: [
    { en: 'Coverage: this draft is built from the StatMan CSV for p00–p36. Excluded: p00, p01, p02, p09, p14, p26, p29. Re-run scripts/buildPerugiaSetPieces.py when the CSV is updated.', it: 'Copertura: questa bozza è costruita dal CSV StatMan per p00–p36. Esclusi: p00, p01, p02, p09, p14, p26, p29. Rilanciare scripts/buildPerugiaSetPieces.py quando il CSV viene aggiornato.' },
    { en: 'Side rule: a right-footer’s inswinger is taken from the LEFT and his outswinger from the RIGHT; the reverse for a left-footer. Short, driven and direct shots are placed from the tagged side. Flagged (drawn on the tagged side, swing kept as in the CSV, not moved to fit the rule): p03: tagged right, but right-foot inswinger should come from the left; p10: tagged left, but right-foot outswinger should come from the right; p12: tagged right, but right-foot inswinger should come from the left.', it: 'Regola del lato: la rientrante di un destro si batte da SINISTRA e l’uscente da DESTRA; il contrario per un sinistro. Le battute corte, tese e i tiri diretti sono piazzati dal lato taggato. Segnalate (disegnate sul lato taggato, traiettoria come nel CSV, non spostate per adattarle alla regola): p03: tagged right, but right-foot inswinger should come from the left; p10: tagged left, but right-foot outswinger should come from the right; p12: tagged right, but right-foot inswinger should come from the left.' },
    { en: 'Corners: 6 from the LEFT (6 right-foot, 0 left-foot), 4 from the RIGHT (0 right-foot, 3 left-foot, 1 unknown foot). p24 and p25 are the same 6-yard routine used twice vs Pescara (16:24 and 22:44), counted as two. p06 (right, foot blank) is drawn as unknown foot; inswing is kept only if the CSV still lists it; outcome is the defender header clearance in the outcome column. p13 still uses the rechecked note (defender heads clear) rather than the older “GK punch” value in the outcome column.', it: 'Angoli: 6 da SINISTRA (6 di destro, 0 di sinistro), 4 da DESTRA (0 di destro, 3 di sinistro, 1 piede sconosciuto). p24 e p25 sono la stessa routine sui 6 metri usata due volte vs Pescara (16:24 e 22:44), contate come due. p06 (destra, piede vuoto) è disegnato con piede sconosciuto; la rientrante si tiene solo se è ancora nel CSV; l’esito è la deviazione di testa del difensore nella colonna esito. p13 usa ancora la nota ricontrollata (il difensore respinge di testa) e non il vecchio “pugno del portiere” nella colonna esito.' },
    { en: 'Takers: a shirt is used only when the CSV records one (p20 #10, p23 #7). Official squad numbers are not mapped onto match shirts. Everyone else, including p36 (filename Iachini, not readable on video) and p15 (filename Dottori, not confirmed), is Unidentified. Feet are the kicking foot in the CSV.', it: 'Battitori: la maglia si usa solo se il CSV la registra (p20 #10, p23 #7). I numeri ufficiali in rosa non vengono mappati sulle maglie di gara. Tutti gli altri, compresi p36 (nome del file Iachini, non leggibile in video) e p15 (nome del file Dottori, non confermato), sono Non identificato. Il piede è quello di battuta nel CSV.' },
    { en: 'Goals: p08 left corner (inswinger) — Unidentified; p15 right free kick (outswinger) — Unidentified; p20 right free kick (direct shot) — #10; p30 right corner (inswinger) — Unidentified; p36 left free kick (direct shot) — Unidentified.', it: 'Gol: p08 angolo da sinistra (rientrante) — Non identificato; p15 punizione da destra (uscente) — Non identificato; p20 punizione da destra (tiro diretto) — #10; p30 angolo da destra (rientrante) — Non identificato; p36 punizione da sinistra (tiro diretto) — Non identificato.' },
    { en: 'Shots that were not goals: p10 (woodwork), p11 (off target), p19 (shot), p23 (off target), p32 (off target), p33 (saved), p34 (saved). Second-phase efforts described in the clip notes (blocked shots after p05, rebound after p06 / p35) are not given their own arrow.', it: 'Tiri che non sono gol: p10 (woodwork), p11 (fuori), p19 (tiro), p23 (fuori), p32 (fuori), p33 (parato), p34 (parato). Le conclusioni di seconda palla descritte nelle note di clip (tiri bloccati dopo p05, ribattuta dopo p06 / p35) non hanno una freccia propria.' },
  ],
  corners: {
    left: {
      arrows: [
        { x1: 12, y1: 8, x2: 117, y2: 6, n: 7, nAt: 'end', swing: 'in', outcome: 'cleared' },
        { x1: 12, y1: 8, x2: 131, y2: 27, n: 8, nAt: 'end', swing: 'in', outcome: 'goal' },
        { x1: 12, y1: 8, x2: 147, y2: 32, n: 17, nAt: 'end', swing: 'in', outcome: 'cleared' },
        { x1: 12, y1: 8, x2: 169, y2: 22, n: 24, nAt: 'end', swing: 'in', outcome: 'cleared' },
        { x1: 12, y1: 8, x2: 175, y2: 37, n: 25, nAt: 'end', swing: 'in', outcome: 'cleared' },
        { x1: 12, y1: 8, x2: 146, y2: 6, n: 28, nAt: 'end', swing: 'in', outcome: 'cleared' },
      ],
      noteTitle: { en: 'Takers (left):', it: 'Battitori (sinistra):' },
      note: { en: 'All unidentified in this batch.', it: 'Tutti non identificati in questo lotto.' },
      orderedNotesTitle: { en: 'In order (yellow numbers on the pitch):', it: 'In ordine (numeri gialli sul campo):' },
      orderedNotes: [
        { en: '15:53 — p07 Unidentified — inswinger, to the near post, cleared. StatMan confidence: medium.', it: '15:53 — p07 Non identificato — rientrante, verso il primo palo, respinto. Fiducia StatMan: media.' },
        { en: '17:38 — p08 Unidentified — inswinger, to the 6-yard box, GOAL. Scrambled in by a Perugia attacker.', it: '17:38 — p08 Non identificato — rientrante, verso i 6 metri, GOL. Ribadita dentro da un attaccante del Perugia.' },
        { en: '42:32 — p17 Unidentified — inswinger, to the 6-yard box, GK punches clear.', it: '42:32 — p17 Non identificato — rientrante, verso i 6 metri, il portiere respinge di pugno.' },
        { en: '16:24 — p24 Unidentified — inswinger, to the 6-yard box, GK punches clear. Same routine as p25 (one on the GK, four from a central cluster to the near post).', it: '16:24 — p24 Non identificato — rientrante, verso i 6 metri, il portiere respinge di pugno. Stessa routine di p25 (uno sul portiere, quattro da un raggruppamento centrale verso il primo palo).' },
        { en: '22:44 — p25 Unidentified — inswinger, to the 6-yard box, GK punches clear. Same routine as p24; GK punches to the edge of the box.', it: '22:44 — p25 Non identificato — rientrante, verso i 6 metri, il portiere respinge di pugno. Stessa routine di p24; il portiere respinge di pugno verso il limite dell’area.' },
        { en: '30:48 — p28 Unidentified — inswinger, to the near post, cleared.', it: '30:48 — p28 Non identificato — rientrante, verso il primo palo, respinto.' },
      ],
    },
    right: {
      arrows: [
        { x1: 308, y1: 8, x2: 175, y2: 6, n: 6, nAt: 'end', swing: 'in', outcome: 'cleared' },
        { x1: 308, y1: 8, x2: 154, y2: 18, n: 13, nAt: 'end', swing: 'in', outcome: 'cleared' },
        { x1: 308, y1: 8, x2: 182, y2: 9, n: 22, nAt: 'end', swing: 'in', outcome: 'cleared' },
        { x1: 308, y1: 8, x2: 211, y2: 6, n: 30, nAt: 'end', swing: 'in', outcome: 'goal', headerWon: 'confirmed' },
      ],
      noteTitle: { en: 'Takers (right):', it: 'Battitori (destra):' },
      note: { en: 'All unidentified in this batch.', it: 'Tutti non identificati in questo lotto.' },
      orderedNotesTitle: { en: 'In order (yellow numbers on the pitch):', it: 'In ordine (numeri gialli sul campo):' },
      orderedNotes: [
        { en: '14:38 — p06 Unidentified — inswinger, to the near post, defender wins first contact / heads clear. StatMan confidence: medium.', it: '14:38 — p06 Non identificato — rientrante, verso il primo palo, il difensore vince il primo contatto / respinge di testa. Fiducia StatMan: media.' },
        { en: '— — p13 Unidentified — left foot, inswinger, to the 6-yard box, defender heads clear at the near post (recheck; first pass was a GK punch). StatMan confidence: medium.', it: '— — p13 Non identificato — di sinistro, rientrante, verso i 6 metri, il difensore respinge di testa sul primo palo (ricontrollo; il primo passaggio era un pugno). Fiducia StatMan: media.' },
        { en: '08:12 — p22 Unidentified — left foot, inswinger, to the near post, cleared. StatMan confidence: medium.', it: '08:12 — p22 Non identificato — di sinistro, rientrante, verso il primo palo, respinto. Fiducia StatMan: media.' },
        { en: '37:29 — p30 Unidentified — left foot, inswinger, to the near post, GOAL. Near-post flick-on header at the front of the 6-yard box into the far corner, vs Frosinone (scoreboard then 4–0).', it: '37:29 — p30 Non identificato — di sinistro, rientrante, verso il primo palo, GOL. Deviazione di testa sul primo palo, dal fronte dei 6 metri, nell’angolo lontano, vs Frosinone (poi 4–0 sul tabellone).' },
      ],
    },
      takers: [
        { player: { en: 'Unidentified', it: 'Non identificato' }, foot: { en: 'Unknown', it: 'Sconosciuto' }, total: 1, fromLeft: 0, fromRight: 1 },
        { player: UNID_LF, foot: LEFT, total: 3, fromLeft: 0, fromRight: 3 },
        { player: UNID_RF, foot: RIGHT, total: 6, fromLeft: 6, fromRight: 0 },
      ],
  },
  freeKicks: {
    left: {
      arrows: [
        { x1: 53, y1: 126, x2: 139, y2: 46, n: 4, nAt: 'end', swing: 'in', outcome: 'cleared' },
        { x1: 62, y1: 137, x2: 78, y2: 118, n: 5, nAt: 'start', swing: 'short', outcome: 'cleared' },
        { x1: 52, y1: 147, x2: 157, y2: 62, n: 10, nAt: 'end', swing: 'out', outcome: 'woodwork' },
        { x1: 53, y1: 164, x2: 170, y2: 52, n: 11, nAt: 'end', swing: 'in', outcome: 'offTarget', headerWon: 'confirmed' },
        { x1: 28, y1: 142, x2: 198, y2: 15, n: 16, nAt: 'end', swing: 'in', outcome: 'cleared' },
        { x1: 28, y1: 161, x2: 162, y2: 77, n: 19, nAt: 'end', swing: 'in' },
        { x1: 56, y1: 103, x2: 208, y2: 30, n: 23, nAt: 'start', outcome: 'offTarget' },
        { x1: 64, y1: 156, x2: 190, y2: 63, n: 27, nAt: 'end', swing: 'in', outcome: 'cleared' },
        { x1: 56, y1: 84, x2: 131, y2: 11, n: 36, nAt: 'start', outcome: 'goal' },
      ],
      noteTitle: { en: 'Takers (left):', it: 'Battitori (sinistra):' },
      note: { en: '#7 (right) p23. The other 8 unidentified.', it: '#7 (destro) p23. Gli altri 8 non identificati.' },
      orderedNotesTitle: { en: 'In order (yellow numbers on the pitch):', it: 'In ordine (numeri gialli sul campo):' },
      orderedNotes: [
        { en: '15:29 — p04 Unidentified — about 35 yd / 32 m, left channel, inswinger, to the penalty spot, cleared.', it: '15:29 — p04 Non identificato — da circa 32 m, canale sinistro, rientrante, verso il dischetto, respinto.' },
        { en: '— — p05 Unidentified — about 35 yd / 32 m, left channel, played short, cleared. The second man crosses; defender heads clear, then two blocked shots. StatMan confidence: medium.', it: '— — p05 Non identificato — da circa 32 m, canale sinistro, giocata corta, respinto. Il secondo calcia in mezzo; un difensore respinge di testa, poi due tiri bloccati. Fiducia StatMan: media.' },
        { en: '21:09 — p10 Unidentified — about 35 yd / 32 m, left channel, outswinger, to the penalty spot, header hits the crossbar, then cleared. StatMan confidence: medium.', it: '21:09 — p10 Non identificato — da circa 32 m, canale sinistro, uscente, verso il dischetto, colpo di testa sulla traversa, poi respinto. Fiducia StatMan: media.' },
        { en: '— — p11 Unidentified — about 40 yd / 37 m, left channel, inswinger, to the penalty spot, attacker wins the header but glances it wide.', it: '— — p11 Non identificato — da circa 37 m, canale sinistro, rientrante, verso il dischetto, l’attaccante vince il colpo di testa ma lo devia largo.' },
        { en: '41:54 — p16 Unidentified — about 35 yd / 32 m, wide left, inswinger, to the far post, cleared.', it: '41:54 — p16 Non identificato — da circa 32 m, fascia sinistra, rientrante, verso il secondo palo, respinto.' },
        { en: '— — p19 Unidentified — about 40 yd / 37 m, wide left, inswinger, to the edge of the box, followed by a shot (on/off target not in the outcome field).', it: '— — p19 Non identificato — da circa 37 m, fascia sinistra, rientrante, verso il limite dell’area, seguito da un tiro (dentro/fuori non indicato nell’esito).' },
        { en: '15:46 — p23 #7 — about 25 yd / 23 m, left channel, direct shot, to the far post, shot wide. Filename tag: tiro - 7.', it: '15:46 — p23 #7 — da circa 23 m, canale sinistro, tiro diretto, verso il secondo palo, tiro largo. Tag nel nome del file: tiro - 7.' },
        { en: '30:19 — p27 Unidentified — about 35 yd / 32 m, left channel, inswinger, to the penalty spot, cleared.', it: '30:19 — p27 Non identificato — da circa 32 m, canale sinistro, rientrante, verso il dischetto, respinto.' },
        { en: '47:18 — p36 Unidentified — about 20 yd / 18 m, left channel, direct shot, to the near post, GOAL. Filename tag: Iachini (name not readable on video) — taker left unnamed. Low driven shot under the wall into the near corner, vs Pescara (3–2).', it: '47:18 — p36 Non identificato — da circa 18 m, canale sinistro, tiro diretto, verso il primo palo, GOL. Tag nel nome del file: Iachini (nome non leggibile in video) — battitore lasciato senza nome. Tiro rasoterra sotto la barriera nell’angolo vicino, vs Pescara (3–2).' },
      ],
    },
    right: {
      arrows: [
        { x1: 261, y1: 126, x2: 125, y2: 53, n: 3, nAt: 'end', swing: 'in', outcome: 'cleared' },
        { x1: 270, y1: 137, x2: 162, y2: 6, n: 12, nAt: 'end', swing: 'in', outcome: 'cleared' },
        { x1: 292, y1: 142, x2: 141, y2: 62, n: 15, nAt: 'end', swing: 'out', outcome: 'goal', headerWon: 'confirmed' },
        { x1: 292, y1: 174, x2: 146, y2: 78, n: 18, nAt: 'end', outcome: 'cleared' },
        { x1: 261, y1: 97, x2: 185, y2: 25, n: 20, nAt: 'start', outcome: 'goal' },
        { x1: 260, y1: 147, x2: 155, y2: 46, n: 21, nAt: 'end', swing: 'in', outcome: 'cleared' },
        { x1: 269, y1: 158, x2: 174, y2: 68, n: 31, nAt: 'end', swing: 'out', outcome: 'cleared' },
        { x1: 264, y1: 174, x2: 174, y2: 87, n: 32, nAt: 'end', outcome: 'offTarget' },
        { x1: 269, y1: 109, x2: 195, y2: 6, n: 33, nAt: 'start', outcome: 'save' },
        { x1: 264, y1: 84, x2: 214, y2: 14, n: 34, nAt: 'start', outcome: 'save' },
        { x1: 292, y1: 113, x2: 189, y2: 47, n: 35, nAt: 'end', swing: 'in', outcome: 'cleared' },
      ],
      noteTitle: { en: 'Takers (right):', it: 'Battitori (destra):' },
      note: { en: '#10 (right) p20. The other 10 unidentified.', it: '#10 (destro) p20. Gli altri 10 non identificati.' },
      orderedNotesTitle: { en: 'In order (yellow numbers on the pitch):', it: 'In ordine (numeri gialli sul campo):' },
      orderedNotes: [
        { en: '06:22 — p03 Unidentified — about 35 yd / 32 m, right channel, inswinger, to the penalty spot, cleared. StatMan confidence: medium.', it: '06:22 — p03 Non identificato — da circa 32 m, canale destro, rientrante, verso il dischetto, respinto. Fiducia StatMan: media.' },
        { en: '— — p12 Unidentified — about 35 yd / 32 m, right channel, inswinger, to the near post, defender wins first contact / heads clear. StatMan confidence: medium.', it: '— — p12 Non identificato — da circa 32 m, canale destro, rientrante, verso il primo palo, il difensore vince il primo contatto / respinge di testa. Fiducia StatMan: media.' },
        { en: '36:24 — p15 Unidentified — about 35 yd / 32 m, wide right, outswinger, to the penalty spot, GOAL. Filename said Dottori (taker not confirmed on video). Official tabellino lists Dottori 37′ as a penalty, which does not match this clip. StatMan confidence: low.', it: '36:24 — p15 Non identificato — da circa 32 m, fascia destra, uscente, verso il dischetto, GOL. Il nome del file diceva Dottori (battitore non confermato in video). Il tabellino ufficiale dà Dottori 37′ su rigore, che non corrisponde a questa clip. Fiducia StatMan: bassa.' },
        { en: '46:04 — p18 Unidentified — about 45 yd / 41 m, wide right, driven ball, to the edge of the box, cleared. StatMan confidence: medium.', it: '46:04 — p18 Non identificato — da circa 41 m, fascia destra, battuta tesa, verso il limite dell’area, respinto. Fiducia StatMan: media.' },
        { en: '10:56 — p20 #10 — about 25 yd / 23 m, right channel, direct shot, to the near post, GOAL. Filename said Merico; the shooter is Perugia #10 (#7 is nearby in the wall). StatMan confidence: medium.', it: '10:56 — p20 #10 — da circa 23 m, canale destro, tiro diretto, verso il primo palo, GOL. Il nome del file diceva Merico; a calciare è il #10 del Perugia (#7 è vicino, nella barriera). Fiducia StatMan: media.' },
        { en: '11:15 — p21 Unidentified — about 35 yd / 32 m, right channel, left foot, inswinger, to the penalty spot, cleared. A second-phase cross from the left is caught by the GK.', it: '11:15 — p21 Non identificato — da circa 32 m, canale destro, di sinistro, rientrante, verso il dischetto, respinto. Un cross di seconda palla da sinistra viene afferrato dal portiere.' },
        { en: '— — p31 Unidentified — about 35 yd / 32 m, right channel, outswinger, to the penalty spot, cleared.', it: '— — p31 Non identificato — da circa 32 m, canale destro, uscente, verso il dischetto, respinto.' },
        { en: '38:41 — p32 Unidentified — about 60 yd / 55 m, right channel, driven ball, to the edge of the box, off target. Second ball is shot wide of the near post from the right side of the box.', it: '38:41 — p32 Non identificato — da circa 55 m, canale destro, battuta tesa, verso il limite dell’area, fuori. La seconda palla è tirata larga sul primo palo dal lato destro dell’area.' },
        { en: '— — p33 Unidentified — about 25 yd / 23 m, right channel, direct shot, to the near post, saved by the GK.', it: '— — p33 Non identificato — da circa 23 m, canale destro, tiro diretto, verso il primo palo, parato dal portiere.' },
        { en: '41:49 — p34 Unidentified — about 20 yd / 18 m, right channel, direct shot, to the near post, saved by the GK.', it: '41:49 — p34 Non identificato — da circa 18 m, canale destro, tiro diretto, verso il primo palo, parato dal portiere.' },
        { en: '42:37 — p35 Unidentified — about 28 yd / 25 m, wide right, left foot, inswinger, to the penalty spot, cleared. Rebound volley blocked.', it: '42:37 — p35 Non identificato — da circa 25 m, fascia destra, di sinistro, rientrante, verso il dischetto, respinto. La volée di ribattuta viene bloccata.' },
      ],
    },
      takers: [
        { player: '#10', foot: RIGHT, total: 1, fromLeft: 0, fromRight: 1 },
        { player: '#7', foot: RIGHT, total: 1, fromLeft: 1, fromRight: 0 },
        { player: UNID_LF, foot: LEFT, total: 2, fromLeft: 0, fromRight: 2 },
        { player: UNID_RF, foot: RIGHT, total: 16, fromLeft: 8, fromRight: 8 },
      ],
  },
};
