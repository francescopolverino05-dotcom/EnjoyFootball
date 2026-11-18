import type { GkStrikerProfile } from '../types/opposition';

/**
 * Perugia (Primavera 2) goalkeeper-area shot maps.
 *
 * GENERATED from StatMan tags. Do not edit by hand — re-run
 *   python3 scripts/buildPerugiaGkStrikers.py [path/to/statman_shots.csv]
 * after the CSV changes. Default CSV: /workspace/gk_shots/statman_shots.csv
 *
 * Dropped: s11 (duplicate of s05); s09 shot 1 (Pescara opponent shot).
 * Kept: 11 Perugia shots (Merico 3, Agnissan 5, Ciani 3).
 *
 * Shirt numbers: Merico 7 and Ciani 11 from the official squad.
 * Agnissan’s number is left null — it is not fixed on the squad
 * list (#9 is Sheji; Agnissan wore 9 when starting, and Iachini
 * also wears 9 as the starting striker).
 *
 * Coordinates, foot, foot part, body and outcome are copied from
 * the CSV only. Blank foot parts stay omitted (s03, s05, s09).
 * Clips are not attached: opposition videos on this site are
 * Vimeo URLs, and these files have not been uploaded.
 */

export const perugiaGkStrikers: GkStrikerProfile[] = [
  {
    id: 'perugia-gk-merico',
    name: 'Merico',
    number: 7,
    clips: [],
    shots: [
        {
          id: 'perugia-gk-s00',
          title: { en: 'Inside the box, right laces', it: 'In area, collo destro' },
          type: 'inside-box',
          pitchX: 37,
          pitchY: 86,
          goalX: 80,
          goalY: 85,
          outcome: 'saved',
          foot: 'right',
          footZone: 'laces',
        },
        {
          id: 'perugia-gk-s01',
          title: { en: '10’ · Penalty, right inside', it: '10′ · Rigore, interno destro' },
          type: 'penalty',
          pitchX: 50,
          pitchY: 89,
          goalX: 92,
          goalY: 92,
          outcome: 'saved',
          foot: 'right',
          footZone: 'inside',
        },
        {
          id: 'perugia-gk-s02',
          title: { en: '27’ · Outside the box, right laces', it: '27′ · Fuori area, collo destro' },
          type: 'outside-box',
          pitchX: 28,
          pitchY: 78,
          goalX: -20,
          goalY: -15,
          outcome: 'off-target',
          foot: 'right',
          footZone: 'laces',
        }
    ],
  },
  {
    id: 'perugia-gk-agnissan',
    name: 'Agnissan',
    number: null,
    clips: [],
    shots: [
        {
          id: 'perugia-gk-s03',
          title: { en: '17’ · Inside the box, left foot', it: '17′ · In area, sinistro' },
          type: 'inside-box',
          pitchX: 40,
          pitchY: 87,
          goalX: 80,
          goalY: 85,
          outcome: 'saved',
          foot: 'left',
        },
        {
          id: 'perugia-gk-s04',
          title: { en: '24’ · Inside the box, right inside', it: '24′ · In area, interno destro' },
          type: 'inside-box',
          pitchX: 51,
          pitchY: 88,
          goalX: 80,
          goalY: 85,
          outcome: 'goal',
          foot: 'right',
          footZone: 'inside',
        },
        {
          id: 'perugia-gk-s05',
          title: { en: '29’ · Inside the box, right foot', it: '29′ · In area, destro' },
          type: 'inside-box',
          pitchX: 56,
          pitchY: 91,
          goalX: 20,
          goalY: 85,
          outcome: 'goal',
          foot: 'right',
        },
        {
          id: 'perugia-gk-s06',
          title: { en: '37’ · Inside the box, header', it: '37′ · In area, di testa' },
          type: 'inside-box',
          pitchX: 50,
          pitchY: 97,
          goalX: 65,
          goalY: 50,
          outcome: 'goal',
          body: 'head',
        },
        {
          id: 'perugia-gk-s07',
          title: { en: '47’ · Inside the box, left inside', it: '47′ · In area, interno sinistro' },
          type: 'inside-box',
          pitchX: 40,
          pitchY: 86,
          goalX: 85,
          goalY: 85,
          outcome: 'goal',
          foot: 'left',
          footZone: 'inside',
        }
    ],
  },
  {
    id: 'perugia-gk-ciani',
    name: 'Ciani',
    number: 11,
    clips: [],
    shots: [
        {
          id: 'perugia-gk-s08',
          title: { en: '30’ · Inside the box, left laces', it: '30′ · In area, collo sinistro' },
          type: 'inside-box',
          pitchX: 38,
          pitchY: 88,
          goalX: -8,
          goalY: 90,
          outcome: 'off-target',
          foot: 'left',
          footZone: 'laces',
        },
        {
          id: 'perugia-gk-s09-2',
          title: { en: '37’ · Inside the box, right foot', it: '37′ · In area, destro' },
          type: 'inside-box',
          pitchX: 54,
          pitchY: 88,
          goalX: 108,
          goalY: 90,
          outcome: 'off-target',
          foot: 'right',
        },
        {
          id: 'perugia-gk-s10',
          title: { en: 'Outside the box, right laces', it: 'Fuori area, collo destro' },
          type: 'outside-box',
          pitchX: 46,
          pitchY: 76,
          goalX: 20,
          goalY: 10,
          outcome: 'saved',
          foot: 'right',
          footZone: 'laces',
        }
    ],
  },
];
