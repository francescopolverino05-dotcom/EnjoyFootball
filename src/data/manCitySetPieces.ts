import type { OppositionSetPieces, SpText } from './setPieces';

/**
 * DRAFT — Manchester City (UYL) attacking set pieces.
 *
 * Source: Hudl export `/Users/francopolv/Downloads/PIAZZATI_17.11.2026/Actions`
 * (28 clips, all tagged "Squadra di casa", 17 Nov 2026).
 *
 * Side rule (Francesco, 18 Nov 2026): infer side from the taker's preferred
 * foot plus the swing. A right-footer's inswinger is from the LEFT and his
 * outswinger from the RIGHT; a left-footer's inswinger is from the RIGHT and
 * his outswinger from the LEFT. Short deliveries stay unassigned, labelled
 * Short, until sides and pass directions are confirmed from the clips —
 * except where Francesco has already given the pattern (corner #14).
 *
 * Feet: squad preferredFoot on the man-city entry (Transfermarkt / Sofascore
 * lookups already in the repo — never FM). Francesco confirmed McAidoo's
 * corners were all from the right, which matches a left-footer; and that
 * Felix Samba is right-footed, so his outswinging free kick #27 is from the
 * right. He also said Gorman took one outswinger corner from the left with
 * the rest from the right; the filenames have two Gorman outswinger corners
 * (#2 and #12), so both are placed on the left by the same left-foot +
 * outswinger rule.
 *
 * Arrow recipe (320×190 pitch, goal at the top; arrows black; `swing` set;
 * no outcome colours):
 *   left corner start (12, 8)    right corner start (308, 8)
 *   n = Hudl clip sequence, nAt: 'end'
 *   landings are conventional zone spots from the filename (near / far /
 *   6-yard / penalty area), slightly fanned when several share a zone —
 *   exact coordinates remain approximate.
 *   Free-kick starts are unknown: swinging FKs sit wide on the inferred
 *   side, with a note that the position is approximate.
 */

const LEFT: SpText = { en: 'Left', it: 'Sinistro' };
const RIGHT: SpText = { en: 'Right', it: 'Destro' };
const SIDE_TODO =
  'TODO: side not inferred — short delivery (or foot unknown).';
const SIDE_TODO_IT =
  'TODO: lato non dedotto — battuta corta (o piede sconosciuto).';

function note(
  time: string,
  seq: number,
  taker: string,
  deliveryEn: string,
  deliveryIt: string,
  opts?: { favorite?: boolean; timeFlag?: boolean; sideTodo?: boolean; approxFk?: boolean },
): SpText {
  const favEn = opts?.favorite ? ' (favorite)' : '';
  const favIt = opts?.favorite ? ' (preferito)' : '';
  const extraEn = [
    opts?.sideTodo ? SIDE_TODO : '',
    opts?.approxFk ? 'Start position is approximate (side inferred, distance unknown).' : '',
    opts?.timeFlag ? 'WARNING: timestamp is over 90:00 and may be video time, not match minute.' : '',
  ].filter(Boolean).join(' ');
  const extraIt = [
    opts?.sideTodo ? SIDE_TODO_IT : '',
    opts?.approxFk ? 'La posizione di partenza è approssimativa (lato dedotto, distanza sconosciuta).' : '',
    opts?.timeFlag ? 'ATTENZIONE: il timestamp è oltre 90:00 e potrebbe essere il tempo del video, non il minuto di gara.' : '',
  ].filter(Boolean).join(' ');
  const tailEn = extraEn ? ` ${extraEn}` : '';
  const tailIt = extraIt ? ` ${extraIt}` : '';
  return {
    en: `${time} — #${seq} ${taker} — ${deliveryEn}${favEn}.${tailEn}`,
    it: `${time} — #${seq} ${taker} — ${deliveryIt}${favIt}.${tailIt}`,
  };
}

export const manCitySetPiecesDraft: OppositionSetPieces = {
  source: {
    en: 'DRAFT — Hudl folder PIAZZATI_17.11.2026 / Actions (28 home-team clips, tagged 17 Nov 2026). Sides inferred from squad preferred foot + swing, then corrected from Francesco’s clip notes. Remaining Shorts are unassigned until he sends sides and pass directions. Shirt numbers (except where he named a shirt in a pattern) and most outcomes are still TODO. Not for push until reviewed.',
    it: 'BOZZA — cartella Hudl PIAZZATI_17.11.2026 / Actions (28 clip della squadra di casa, taggate il 17 nov 2026). Lati dedotti da piede preferito in rosa + traiettoria, poi corretti dalle note di Francesco sulle clip. Gli Short rimanenti non sono assegnati finché non arrivano lati e direzioni del passaggio. I numeri di maglia (salvo dove ha indicato un numero in uno schema) e la maggior parte degli esiti sono ancora TODO. Non pubblicare finché non è stato rivisto.',
  },
  keyNotesTitle: {
    en: 'Key notes — DRAFT: 28 City attacking set pieces (20 corners, 8 free kicks)',
    it: 'Note chiave — BOZZA: 28 palle inattive offensive del City (20 calci d’angolo, 8 punizioni)',
  },
  keyNotes: [
    {
      en: 'Side rule: a right-footer’s inswinger is taken from the LEFT and his outswinger from the RIGHT; a left-footer’s inswinger from the RIGHT and his outswinger from the LEFT. Feet are the squad preferredFoot (Transfermarkt / Sofascore, already in the repo). Francesco confirmed McAidoo’s corners were all from the right, matching a left-footer. He recalled Gorman taking one outswinger corner from the left and the rest from the right; the filenames have two Gorman outswinger corners (#2 and #12), both placed on the left by that same rule, and his two inswingers (#4, #8) on the right.',
      it: 'Regola sul lato: la rientrante di un destro si batte da SINISTRA e l’uscente da DESTRA; la rientrante di un sinistro da DESTRA e l’uscente da SINISTRA. I piedi sono il preferredFoot in rosa (Transfermarkt / Sofascore, già in archivio). Francesco ha confermato che gli angoli di McAidoo erano tutti da destra, coerente con un sinistro. Ricordava un angolo uscente di Gorman da sinistra e il resto da destra; nei nomi dei file ci sono due angoli uscenti di Gorman (#2 e #12), entrambi piazzati a sinistra con la stessa regola, e le due rientranti (#4, #8) a destra.',
    },
    {
      en: 'Shorts corrected from Francesco’s first-hand view (overrides the earlier video-review paths). There is no right-sided short corner — both are from the LEFT: #11 Parker (favorite) to the left edge / left corner of the penalty box; #14 Tyrone Samba a much shorter pass ending around the end of the 6-yard box, near the byline on the touchline side. All three short free kicks are on the RIGHT, short pass only (follow-up crosses removed): #24 Braithwaite (favorite) starts wide on the right flank and is played to the right edge of the penalty box; #26 Braithwaite is less wide, a tiny 1–2 m pass to the taker’s right (teammate next to him); #21 Gorman (favorite) starts ~8–10 m outside the box, slightly right of centre (in line with the right post / right edge of the 6-yard box), with a dashed short pass to a receiver just outside the right corner of the box.',
      it: 'Short corretti dalla visione in prima persona di Francesco (hanno la precedenza sui percorsi della revisione video). Non c’è nessun angolo corto da destra — tutti e due sono da SINISTRA: #11 Parker (preferito) verso il lato / angolo sinistro dell’area di rigore; #14 Tyrone Samba, passaggio molto più corto che finisce all’altezza della fine dei 6 metri, vicino alla linea di fondo sul lato laterale. Tutte e tre le punizioni corte sono a DESTRA, solo passaggio corto (cross di continuazione rimossi): #24 Braithwaite (preferito) parte largo sulla fascia destra e va verso il lato destro dell’area; #26 Braithwaite è meno largo, un passaggio di appena 1–2 m alla sua destra (compagno accanto a lui); #21 Gorman (preferito) parte a circa 8–10 m fuori dall’area, leggermente a destra del centro (in linea con il palo destro / il lato destro dei 6 metri), con un passaggio corto a un ricevitore appena fuori dall’angolo destro dell’area.',
    },
    {
      en: 'Still TODO on every clip: shirt number (the UYL squad sheet has no fixed numbers; scouted XI numbers change by match, so none were pinned) and outcome (goal / save / cleared / etc.). Landing coordinates are conventional spots for the named zone, slightly fanned where several share a zone — not measured from the video. Free-kick start positions are wide on the inferred side and approximate (distance unknown). In the taker tables, totals include Short deliveries; the From left / From right columns only count deliveries whose side could be inferred. Francesco confirmed Felix Samba is right-footed, so free kick #27 (outswinger, far post) is placed on the right. Free kick #25 (filename: Gorman — outswinger, penalty area, 51:49) was reassigned to Dexter Oliver, a right-footer; right-footer outswinger → right side. Start is the right corner of the penalty box moved 3.5 m upfield. The squad has two Olivers: Dexter Oliver (CAM, already right-footed; the XIs call him “Oliver”) and Oliver Houlihan (LB, listed left-footed, already used for corner #19). #25 is tagged Dexter Oliver, not Houlihan — say if that should be Houlihan instead. Houlihan’s listed foot was not changed.',
      it: 'Ancora TODO su ogni clip: numero di maglia (la rosa UYL non ha numeri fissi; nei XI scoutati i numeri cambiano partita per partita, quindi nessuno è stato fissato) ed esito (gol / parata / respinto / ecc.). Le coordinate di atterraggio sono punti convenzionali della zona nominata, leggermente distanziati quando più frecce condividono la zona — non misurate dal video. Le partenze delle punizioni sono larghe sul lato dedotto e approssimative (distanza sconosciuta). Nelle tabelle battitori i totali includono le battute Short; le colonne Da sinistra / Da destra contano solo le battute di cui si è potuto dedurre il lato. Francesco ha confermato che Felix Samba è destro, quindi la punizione #27 (uscente, secondo palo) è piazzata a destra. La punizione #25 (nome del file: Gorman — uscente, area di rigore, 51:49) è stata riassegnata a Dexter Oliver, destro; uscente di destro → lato destro. La partenza è l’angolo destro dell’area di rigore, spostato di 3,5 m verso il centrocampo. In rosa ci sono due Oliver: Dexter Oliver (trequartista, già destro; nei XI è chiamato “Oliver”) e Oliver Houlihan (terzino sinistro, in rosa come sinistro, già usato per l’angolo #19). La #25 è intestata a Dexter Oliver, non a Houlihan — dire se invece è Houlihan. Il piede in rosa di Houlihan non è stato cambiato.',
    },
    {
      en: 'Timestamp warning: three clips are stamped past 90:00 — free kick #27 Felix Samba 111:21, corner #18 Wain 111:39, corner #19 Houlihan 112:46. These may be video time on a concatenated recording, not match minutes.',
      it: 'Attenzione sui tempi: tre clip hanno un timestamp oltre 90:00 — punizione #27 Felix Samba 111:21, angolo #18 Wain 111:39, angolo #19 Houlihan 112:46. Potrebbero essere il tempo del video su una registrazione concatenata, non i minuti di gara.',
    },
    {
      en: 'Corners by delivery (from filenames): inswinger near post 10 · inswinger far post 3 · inswinger 6-yard box 2 · inswinger penalty area 1 · outswinger near post 2 · short 2. Inswingers are the main delivery (16/20). By side: 12 from the left (including Shorts #11 and #14), 8 from the right. No short corner was taken from the right.',
      it: 'Angoli per battuta (dai nomi dei file): rientrante primo palo 10 · rientrante secondo palo 3 · rientrante 6 metri 2 · rientrante area di rigore 1 · uscente primo palo 2 · corto 2. La rientrante è la battuta principale (16/20). Per lato: 12 da sinistra (inclusi gli Short #11 e #14), 8 da destra. Nessun angolo corto è stato battuto da destra.',
    },
    {
      en: 'Free kicks by delivery: short 3 · inswinger penalty area 2 · inswinger far post 1 · outswinger penalty area 1 · outswinger far post 1. By side: 0 from the left, 8 from the right (Shorts #21, #24 and #26, plus #20, #22, #23, #25 and #27). Gorman’s free kicks are both from the right: #21 Short (~8–10 m outside the box, slightly right of centre, short to a receiver just outside the right corner of the box) and #22 inswinger far post. Dexter Oliver stays on #25.',
      it: 'Punizioni per battuta: corto 3 · rientrante area di rigore 2 · rientrante secondo palo 1 · uscente area di rigore 1 · uscente secondo palo 1. Per lato: 0 da sinistra, 8 da destra (Short #21, #24 e #26, più #20, #22, #23, #25 e #27). Le punizioni di Gorman sono tutte da destra: #21 Short (a circa 8–10 m fuori dall’area, leggermente a destra del centro, corto a un ricevitore appena fuori dall’angolo destro dell’area) e #22 rientrante sul secondo palo. Dexter Oliver resta sulla #25.',
    },
    {
      en: 'Tagged favorites (good_favorite in the filename): corner #4 Gorman inswinger 6-yard box (right); corner #7 McAidoo inswinger near post (right); corner #11 Parker Short (left, to the left edge of the box); free kick #20 McAidoo inswinger penalty area (right, start approximate); free kick #21 Gorman Short (right, ~8–10 m outside the box slightly right of centre, short to the right corner of the box); free kick #24 Braithwaite Short (right, wide flank to the right edge of the box).',
      it: 'Preferiti taggati (good_favorite nel nome del file): angolo #4 Gorman rientrante 6 metri (destra); angolo #7 McAidoo rientrante primo palo (destra); angolo #11 Parker Short (sinistra, verso il lato sinistro dell’area); punizione #20 McAidoo rientrante area di rigore (destra, partenza approssimativa); punizione #21 Gorman Short (destra, a circa 8–10 m fuori dall’area leggermente a destra del centro, corto verso l’angolo destro dell’area); punizione #24 Braithwaite Short (destra, dalla fascia larga verso il lato destro dell’area).',
    },
  ],
  corners: {
    left: {
      arrows: [
        // Near-post fan on the left of the 6-yard box; 6-yard central; pen. area; far post on the right.
        { x1: 12, y1: 8, x2: 160, y2: 52, n: 0, nAt: 'end', swing: 'in' },
        { x1: 12, y1: 8, x2: 118, y2: 10, n: 2, nAt: 'end', swing: 'out' },
        { x1: 12, y1: 8, x2: 170, y2: 26, n: 3, nAt: 'end', swing: 'in' },
        { x1: 12, y1: 8, x2: 146, y2: 10, n: 9, nAt: 'end', swing: 'in' },
        { x1: 12, y1: 8, x2: 198, y2: 13, n: 10, nAt: 'end', swing: 'in' },
        { x1: 12, y1: 8, x2: 132, y2: 10, n: 12, nAt: 'end', swing: 'out' },
        { x1: 12, y1: 8, x2: 118, y2: 22, n: 13, nAt: 'end', swing: 'in' },
        { x1: 12, y1: 8, x2: 132, y2: 22, n: 16, nAt: 'end', swing: 'in' },
        { x1: 12, y1: 8, x2: 146, y2: 22, n: 17, nAt: 'end', swing: 'in' },
        { x1: 12, y1: 8, x2: 138, y2: 32, n: 18, nAt: 'end', swing: 'in' },
        // #11 Short: to the left edge / left corner of the penalty box (~70, 76).
        { x1: 12, y1: 8, x2: 70, y2: 76, n: 11, nAt: 'end', swing: 'short' },
        // #14 Short: much shorter, ending around the end of the 6-yard box (left edge is x=120, y=28), on the touchline/byline side.
        { x1: 12, y1: 8, x2: 102, y2: 28, n: 14, nAt: 'end', swing: 'short' },
      ],
      noteTitle: { en: 'Takers (left):', it: 'Battitori (sinistra):' },
      note: {
        en: 'Tyrone Samba (right foot) ×4 (3 inswingers + 1 much shorter Short ending around the end of the 6-yard box). Xavier Parker (right foot) ×4 (3 inswingers + 1 Short to the left edge of the penalty box). Finlay Gorman (left foot) ×2, both outswingers. Kylan Midwood (right foot) ×1. Jake Wain (right foot) ×1. Both short corners are from the left — there is no right-sided short corner.',
        it: 'Tyrone Samba (destro) ×4 (3 rientranti + 1 Short molto più corto che finisce all’altezza della fine dei 6 metri). Xavier Parker (destro) ×4 (3 rientranti + 1 Short verso il lato sinistro dell’area di rigore). Finlay Gorman (sinistro) ×2, entrambi uscenti. Kylan Midwood (destro) ×1. Jake Wain (destro) ×1. Tutti e due gli angoli corti sono da sinistra — non c’è nessun angolo corto da destra.',
      },
      orderedNotesTitle: { en: 'In order (yellow numbers on the pitch):', it: 'In ordine (numeri gialli sul campo):' },
      orderedNotes: [
        note('8:21', 0, 'Tyrone Samba', 'inswinger to the penalty area', 'traiettoria rientrante in area di rigore'),
        note('22:00', 2, 'Finlay Gorman', 'outswinger to the near post', 'traiettoria uscente sul primo palo'),
        note('23:27', 3, 'Xavier Parker', 'inswinger to the 6-yard box', 'traiettoria rientrante nei 6 metri'),
        note('48:32', 9, 'Tyrone Samba', 'inswinger to the near post', 'traiettoria rientrante sul primo palo'),
        note('48:45', 10, 'Xavier Parker', 'inswinger to the far post', 'traiettoria rientrante sul secondo palo'),
        note('51:09', 11, 'Xavier Parker', 'Short — short pass to the left edge of the penalty box', 'Short — passaggio corto verso il lato sinistro dell’area di rigore', { favorite: true }),
        note('54:59', 12, 'Finlay Gorman', 'outswinger to the near post', 'traiettoria uscente sul primo palo'),
        note('57:15', 13, 'Tyrone Samba', 'inswinger to the near post', 'traiettoria rientrante sul primo palo'),
        note('66:07', 14, 'Tyrone Samba', 'Short — much shorter pass, ending around the end of the 6-yard box near the goal line / byline on the touchline side', 'Short — passaggio molto più corto, che finisce all’altezza della fine dei 6 metri vicino alla linea di porta / fondo sul lato laterale'),
        note('78:21', 16, 'Kylan Midwood', 'inswinger to the near post', 'traiettoria rientrante sul primo palo'),
        note('83:11', 17, 'Xavier Parker', 'inswinger to the near post', 'traiettoria rientrante sul primo palo'),
        note('111:39', 18, 'Jake Wain', 'inswinger to the near post', 'traiettoria rientrante sul primo palo', { timeFlag: true }),
      ],
    },
    right: {
      arrows: [
        // Far-post fan on the left of the 6-yard box; 6-yard central; near-post fan on the right.
        { x1: 308, y1: 8, x2: 118, y2: 12, n: 1, nAt: 'end', swing: 'in' },
        { x1: 308, y1: 8, x2: 160, y2: 22, n: 4, nAt: 'end', swing: 'in' },
        { x1: 308, y1: 8, x2: 198, y2: 11, n: 5, nAt: 'end', swing: 'in' },
        { x1: 308, y1: 8, x2: 184, y2: 11, n: 6, nAt: 'end', swing: 'in' },
        { x1: 308, y1: 8, x2: 198, y2: 22, n: 7, nAt: 'end', swing: 'in' },
        { x1: 308, y1: 8, x2: 184, y2: 22, n: 8, nAt: 'end', swing: 'in' },
        { x1: 308, y1: 8, x2: 174, y2: 32, n: 15, nAt: 'end', swing: 'in' },
        { x1: 308, y1: 8, x2: 132, y2: 24, n: 19, nAt: 'end', swing: 'in' },
      ],
      noteTitle: { en: 'Takers (right):', it: 'Battitori (destra):' },
      note: {
        en: 'Ryan McAidoo (left foot) ×5, all inswingers — Francesco confirmed these were all from the right. Finlay Gorman (left foot) ×2, both inswingers. Oliver Houlihan (left foot) ×1. No short corner from this side.',
        it: 'Ryan McAidoo (sinistro) ×5, tutte rientranti — Francesco ha confermato che erano tutte da destra. Finlay Gorman (sinistro) ×2, entrambe rientranti. Oliver Houlihan (sinistro) ×1. Nessun angolo corto da questo lato.',
      },
      orderedNotesTitle: { en: 'In order (yellow numbers on the pitch):', it: 'In ordine (numeri gialli sul campo):' },
      orderedNotes: [
        note('14:17', 1, 'Ryan McAidoo', 'inswinger to the far post', 'traiettoria rientrante sul secondo palo'),
        note('30:22', 4, 'Finlay Gorman', 'inswinger to the 6-yard box', 'traiettoria rientrante nei 6 metri', { favorite: true }),
        note('31:58', 5, 'Ryan McAidoo', 'inswinger to the near post', 'traiettoria rientrante sul primo palo'),
        note('32:05', 6, 'Ryan McAidoo', 'inswinger to the near post', 'traiettoria rientrante sul primo palo'),
        note('32:43', 7, 'Ryan McAidoo', 'inswinger to the near post', 'traiettoria rientrante sul primo palo', { favorite: true }),
        note('41:28', 8, 'Finlay Gorman', 'inswinger to the near post', 'traiettoria rientrante sul primo palo'),
        note('68:03', 15, 'Ryan McAidoo', 'inswinger to the near post', 'traiettoria rientrante sul primo palo'),
        note('112:46', 19, 'Oliver Houlihan', 'inswinger to the far post', 'traiettoria rientrante sul secondo palo', { timeFlag: true }),
      ],
    },
    takers: [
      { player: 'Ryan McAidoo', foot: LEFT, total: 5, fromLeft: 0, fromRight: 5 },
      { player: 'Finlay Gorman', foot: LEFT, total: 4, fromLeft: 2, fromRight: 2 },
      { player: 'Tyrone Samba', foot: RIGHT, total: 4, fromLeft: 4, fromRight: 0 }, // all four from the left, including Short #14
      { player: 'Xavier Parker', foot: RIGHT, total: 4, fromLeft: 4, fromRight: 0 }, // includes Short #11 on the left
      { player: 'Kylan Midwood', foot: RIGHT, total: 1, fromLeft: 1, fromRight: 0 },
      { player: 'Jake Wain', foot: RIGHT, total: 1, fromLeft: 1, fromRight: 0 },
      { player: 'Oliver Houlihan', foot: LEFT, total: 1, fromLeft: 0, fromRight: 1 },
    ],
  },
  freeKicks: {
    left: {
      noteTitle: { en: 'Takers (left):', it: 'Battitori (sinistra):' },
      note: {
        en: 'No free kicks are assigned to the left. All three shorts (#21 Gorman, #24 and #26 Braithwaite) were moved to the right from Francesco’s first-hand view.',
        it: 'Nessuna punizione è assegnata a sinistra. Tutte e tre le corte (#21 Gorman, #24 e #26 Braithwaite) sono state spostate a destra dalla visione in prima persona di Francesco.',
      },
    },
    right: {
      arrows: [
        // Wide right, starts approximate. Pen. area ~(160, 50); far post from the right ~(136, 15).
        { x1: 284, y1: 128, x2: 148, y2: 42, n: 20, nAt: 'end', swing: 'in' },
        { x1: 278, y1: 142, x2: 134, y2: 16, n: 22, nAt: 'end', swing: 'in' },
        { x1: 286, y1: 150, x2: 170, y2: 58, n: 23, nAt: 'end', swing: 'in' },
        // #25: right corner of the penalty box (250, 76) + 3.5 m upfield.
        // Box depth 16.5 m = 70 viewBox units (y=6..76) → 3.5 m ≈ 15 units. Start (250, 91).
        { x1: 250, y1: 91, x2: 158, y2: 50, n: 25, nAt: 'end', swing: 'out' },
        { x1: 292, y1: 136, x2: 120, y2: 22, n: 27, nAt: 'end', swing: 'out' },
        // Shorts — Francesco first-hand: all three on the right, short pass only (no follow-up crosses).
        // #24 starts wide on the right flank, short to the right edge / corner of the penalty box (250, 76).
        { x1: 302, y1: 148, x2: 250, y2: 76, n: 24, nAt: 'start', swing: 'short' },
        // #26 less wide than #24; tiny 1–2 m pass to the taker’s right (2 m ≈ 8.5 viewBox units at 70 units = 16.5 m).
        { x1: 274, y1: 154, x2: 283, y2: 154, n: 26, nAt: 'start', swing: 'short' },
        // #21 from Francesco’s stills (vs AEK, 35:23): start ~8–10 m outside the box
        // (9 m = 38 units; y=76+38=114), slightly right of centre, in line with the
        // right post (~x=176) / right edge of the 6-yard box (x=200). Receiver just
        // outside the right corner of the box, a little wider than x=250, level with
        // the box line (~x=258–265, y=74–80).
        { x1: 190, y1: 114, x2: 262, y2: 76, n: 21, nAt: 'start', swing: 'short' },
      ],
      noteTitle: { en: 'Takers (right):', it: 'Battitori (destra):' },
      note: {
        en: 'Ryan McAidoo (left foot) ×2, both inswingers. Finlay Gorman (left foot) ×2: #22 inswinger to the far post, and #21 Short (favorite) starting ~8–10 m outside the box, slightly right of centre, short to a receiver just outside the right corner of the box. Kaden Braithwaite (right foot) ×2 Short: #24 (favorite) starts wide on the right flank and is played to the right edge of the penalty box; #26 is less wide, a tiny 1–2 m pass to his right (teammate next to him). Dexter Oliver (right foot) ×1, outswinger to the penalty area — start at the right corner of the box, 3.5 m upfield (filename had Gorman; reassigned). Felix Samba (right foot, confirmed) ×1, outswinger to the far post.',
        it: 'Ryan McAidoo (sinistro) ×2, entrambe rientranti. Finlay Gorman (sinistro) ×2: #22 rientrante sul secondo palo, e #21 Short (preferito) che parte a circa 8–10 m fuori dall’area, leggermente a destra del centro, corto a un ricevitore appena fuori dall’angolo destro dell’area. Kaden Braithwaite (destro) ×2 Short: #24 (preferito) parte largo sulla fascia destra e va verso il lato destro dell’area; #26 è meno largo, un passaggio di appena 1–2 m alla sua destra (compagno accanto a lui). Dexter Oliver (destro) ×1, uscente in area di rigore — partenza dall’angolo destro dell’area, 3,5 m verso il centrocampo (nel file c’era Gorman; riassegnata). Felix Samba (destro, confermato) ×1, uscente sul secondo palo.',
      },
      orderedNotesTitle: { en: 'In order (yellow numbers on the pitch):', it: 'In ordine (numeri gialli sul campo):' },
      orderedNotes: [
        note('31:47', 20, 'Ryan McAidoo', 'inswinger to the penalty area', 'traiettoria rientrante in area di rigore', { favorite: true, approxFk: true }),
        note('35:23', 21, 'Finlay Gorman', 'Short — starts ~8–10 m outside the box, slightly right of centre (in line with the right post / right edge of the 6-yard box); short pass to a receiver just outside the right corner of the box', 'Short — parte a circa 8–10 m fuori dall’area, leggermente a destra del centro (in linea con il palo destro / il lato destro dei 6 metri); passaggio corto a un ricevitore appena fuori dall’angolo destro dell’area', { favorite: true }),
        note('40:35', 22, 'Finlay Gorman', 'inswinger to the far post', 'traiettoria rientrante sul secondo palo', { approxFk: true }),
        note('47:49', 23, 'Ryan McAidoo', 'inswinger to the penalty area', 'traiettoria rientrante in area di rigore', { approxFk: true }),
        note('47:52', 24, 'Kaden Braithwaite', 'Short — starts wide on the right flank; short pass towards the right edge of the penalty box', 'Short — parte largo sulla fascia destra; passaggio corto verso il lato destro dell’area di rigore', { favorite: true }),
        note('51:49', 25, 'Dexter Oliver', 'outswinger to the penalty area, from the right corner of the box 3.5 m upfield (filename had Gorman; Francesco reassigned to Oliver)', 'traiettoria uscente in area di rigore, dall’angolo destro dell’area 3,5 m verso il centrocampo (nel file c’era Gorman; Francesco l’ha riassegnata a Oliver)'),
        note('62:42', 26, 'Kaden Braithwaite', 'Short — on the right, less wide than #24; tiny 1–2 m pass to his right, to a teammate next to him', 'Short — a destra, meno largo della #24; passaggio di appena 1–2 m alla sua destra, a un compagno accanto a lui'),
        note('111:21', 27, 'Felix Samba', 'outswinger to the far post', 'traiettoria uscente sul secondo palo', { approxFk: true, timeFlag: true }),
      ],
    },
    takers: [
      { player: 'Finlay Gorman', foot: LEFT, total: 2, fromLeft: 0, fromRight: 2 }, // #21 Short right, #22 inswinger right
      { player: 'Ryan McAidoo', foot: LEFT, total: 2, fromLeft: 0, fromRight: 2 },
      { player: 'Kaden Braithwaite', foot: RIGHT, total: 2, fromLeft: 0, fromRight: 2 }, // #24 and #26 Short right
      { player: 'Felix Samba', foot: RIGHT, total: 1, fromLeft: 0, fromRight: 1 },
      { player: 'Dexter Oliver', foot: RIGHT, total: 1, fromLeft: 0, fromRight: 1 },
    ],
  },
};
