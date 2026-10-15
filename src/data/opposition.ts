import type { PitchPlayer } from '../types/match';
import type { MatchSummary } from '../types/match';
import type {
  OppositionCompetitionId,
  OppositionFixturePack,
  OppositionOpponent,
} from '../types/opposition';
import {
  OPPOSITION_BASE_REFERENCE_MATCHES,
  OPPOSITION_MAX_REFERENCE_MATCHES,
} from '../types/opposition';
import { EMPTY_STRENGTHS_WEAKNESSES } from '../types/scoutNotes';
import { getAllMatches } from './matches';
import {
  OPPOSITION_CLIP_SECTION_LABELS,
  type OppositionClipSectionId,
} from '../i18n/oppositionClipSections';

export const OPPOSITION_COMPETITION_ORDER: OppositionCompetitionId[] = [
  'primavera2',
  'coppaItalia',
  'uefaYouthLeague',
];

/** Empty 1-4-3-3 slots so the pitch is visible before a scouted XI exists. */
export function placeholder1433(teamId: string): PitchPlayer[] {
  return [
    { number: 1, name: 'GK', teamId, isGk: true, top: '8%', left: '50%' },
    { number: 2, name: 'RB', teamId, top: '22%', left: '18%' },
    { number: 4, name: 'CB', teamId, top: '20%', left: '38%' },
    { number: 5, name: 'CB', teamId, top: '20%', left: '62%' },
    { number: 3, name: 'LB', teamId, top: '22%', left: '82%' },
    { number: 6, name: 'CM', teamId, top: '42%', left: '28%' },
    { number: 8, name: 'CM', teamId, top: '40%', left: '50%' },
    { number: 10, name: 'CM', teamId, top: '42%', left: '72%' },
    { number: 7, name: 'RW', teamId, top: '68%', left: '22%' },
    { number: 9, name: 'ST', teamId, top: '78%', left: '50%' },
    { number: 11, name: 'LW', teamId, top: '68%', left: '78%' },
  ];
}

/** Empty 1-4-1-2-3 (4-3-3 with a holding midfielder). */
export function placeholder14123(teamId: string): PitchPlayer[] {
  return [
    { number: 1, name: 'GK', teamId, isGk: true, top: '8%', left: '50%' },
    { number: 2, name: 'LB', teamId, top: '22%', left: '18%' },
    { number: 5, name: 'CB', teamId, top: '20%', left: '38%' },
    { number: 6, name: 'CB', teamId, top: '20%', left: '62%' },
    { number: 3, name: 'RB', teamId, top: '22%', left: '82%' },
    { number: 4, name: 'CDM', teamId, top: '38%', left: '50%' },
    { number: 10, name: 'CM', teamId, top: '50%', left: '32%' },
    { number: 8, name: 'CM', teamId, top: '50%', left: '68%' },
    { number: 7, name: 'LW', teamId, top: '68%', left: '18%' },
    { number: 9, name: 'ST', teamId, top: '78%', left: '50%' },
    { number: 11, name: 'RW', teamId, top: '68%', left: '82%' },
  ];
}

/** Empty 1-4-2-3-1 slots (double pivot + attacking mid three). */
export function placeholder14231(teamId: string): PitchPlayer[] {
  return [
    { number: 1, name: 'GK', teamId, isGk: true, top: '8%', left: '50%' },
    { number: 2, name: 'RB', teamId, top: '22%', left: '18%' },
    { number: 4, name: 'CB', teamId, top: '20%', left: '38%' },
    { number: 5, name: 'CB', teamId, top: '20%', left: '62%' },
    { number: 3, name: 'LB', teamId, top: '22%', left: '82%' },
    { number: 6, name: 'CDM', teamId, top: '40%', left: '36%' },
    { number: 8, name: 'CDM', teamId, top: '40%', left: '64%' },
    { number: 7, name: 'RW', teamId, top: '60%', left: '20%' },
    { number: 10, name: 'CAM', teamId, top: '58%', left: '50%' },
    { number: 11, name: 'LW', teamId, top: '60%', left: '80%' },
    { number: 9, name: 'ST', teamId, top: '78%', left: '50%' },
  ];
}

/** Empty 4-4-2 slots. */
export function placeholder442(teamId: string): PitchPlayer[] {
  return [
    { number: 1, name: 'GK', teamId, isGk: true, top: '8%', left: '50%' },
    { number: 2, name: 'LB', teamId, top: '22%', left: '18%' },
    { number: 4, name: 'CB', teamId, top: '20%', left: '38%' },
    { number: 5, name: 'CB', teamId, top: '20%', left: '62%' },
    { number: 3, name: 'RB', teamId, top: '22%', left: '82%' },
    { number: 7, name: 'LM', teamId, top: '48%', left: '18%' },
    { number: 6, name: 'CM', teamId, top: '45%', left: '38%' },
    { number: 8, name: 'CM', teamId, top: '45%', left: '62%' },
    { number: 11, name: 'RM', teamId, top: '48%', left: '82%' },
    { number: 9, name: 'ST', teamId, top: '75%', left: '38%' },
    { number: 10, name: 'ST', teamId, top: '75%', left: '62%' },
  ];
}

/** Empty 4-3-1-2 slots (back four, mid three, 10, two strikers).
 * Pitch attacks downward: team-left = screen-right. #2 RB, #3 LB.
 */
export function placeholder4312(teamId: string): PitchPlayer[] {
  return [
    { number: 1, name: 'GK', teamId, isGk: true, top: '8%', left: '50%' },
    { number: 2, name: 'RB', teamId, top: '22%', left: '18%' },
    { number: 5, name: 'RCB', teamId, top: '20%', left: '38%' },
    { number: 6, name: 'LCB', teamId, top: '20%', left: '62%' },
    { number: 3, name: 'LB', teamId, top: '22%', left: '82%' },
    { number: 7, name: 'RCM', teamId, top: '42%', left: '28%' },
    { number: 4, name: 'CDM', teamId, top: '38%', left: '50%' },
    { number: 8, name: 'LCM', teamId, top: '42%', left: '72%' },
    { number: 10, name: 'CAM', teamId, top: '58%', left: '50%' },
    { number: 9, name: 'RST', teamId, top: '75%', left: '38%' },
    { number: 11, name: 'LST', teamId, top: '75%', left: '62%' },
  ];
}

/**
 * Empty 1-3-4-2-1 (back three + wing-backs, double pivot, two 10s, 9).
 * Pitch attacks downward: team-left = screen-right.
 */
export function placeholder13421(teamId: string): PitchPlayer[] {
  return [
    { number: 1, name: 'GK', teamId, isGk: true, top: '8%', left: '50%' },
    { number: 2, name: 'RCB', teamId, top: '20%', left: '28%' },
    { number: 4, name: 'CB', teamId, top: '18%', left: '50%' },
    { number: 5, name: 'LCB', teamId, top: '20%', left: '72%' },
    { number: 11, name: 'RWB', teamId, top: '38%', left: '12%' },
    { number: 16, name: 'LWB', teamId, top: '38%', left: '88%' },
    { number: 8, name: 'RCM', teamId, top: '42%', left: '38%' },
    { number: 6, name: 'LCM', teamId, top: '42%', left: '62%' },
    { number: 28, name: 'RW', teamId, top: '62%', left: '28%' },
    { number: 15, name: 'LW', teamId, top: '62%', left: '72%' },
    { number: 9, name: 'ST', teamId, top: '78%', left: '50%' },
  ];
}

export function placeholderPlayersForSystem(
  system: string,
  teamId: string
): PitchPlayer[] {
  const key = system.trim().replace(/–/g, '-');
  if (key === '1-4-2-3-1' || key === '4-2-3-1') {
    return placeholder14231(teamId);
  }
  if (key === '1-4-1-2-3' || key === '4-1-2-3' || key === '4-3-3') {
    return placeholder14123(teamId);
  }
  if (key === '1-4-3-1-2' || key === '4-3-1-2') {
    return placeholder4312(teamId);
  }
  if (key === '1-4-4-2' || key === '4-4-2') {
    return placeholder442(teamId);
  }
  if (key === '1-3-4-2-1' || key === '3-4-2-1') {
    return placeholder13421(teamId);
  }
  return placeholder1433(teamId);
}

export function formationSystemsFor(opponent: OppositionOpponent): string[] {
  const alts = opponent.alternateFormationSystems ?? [];
  return [opponent.formationSystem, ...alts].filter(Boolean);
}

function club(
  id: string,
  shortName: string,
  competitions: OppositionCompetitionId[],
  formationSystem = '1-4-3-3',
  alternateFormationSystems?: string[]
): OppositionOpponent {
  return {
    id,
    slug: id,
    name: { en: shortName, it: shortName },
    shortName,
    logo: `logos/${id}.png`,
    competitions,
    formationSystem,
    ...(alternateFormationSystems?.length
      ? { alternateFormationSystems }
      : {}),
    starters: [],
    substitutes: [],
    squad: [],
    clips: [],
    gkStrikers: [],
    fixturePacks: {},
  };
}

export const EMPTY_FIXTURE_PACK: OppositionFixturePack = {
  referenceMatches: [],
  reportItems: [],
  strengthsWeaknesses: EMPTY_STRENGTHS_WEAKNESSES,
};

export function getFixturePack(
  opponent: OppositionOpponent,
  matchSlug: string | null
): OppositionFixturePack {
  if (!matchSlug) return EMPTY_FIXTURE_PACK;
  const pack = opponent.fixturePacks[matchSlug];
  if (!pack) return EMPTY_FIXTURE_PACK;
  return {
    ...pack,
    strengthsWeaknesses:
      pack.strengthsWeaknesses ?? EMPTY_STRENGTHS_WEAKNESSES,
  };
}

export function oppositionClipSectionLabel(id: OppositionClipSectionId) {
  return OPPOSITION_CLIP_SECTION_LABELS[id];
}

/** Primavera 2 Girone B + Coppa Italia Spezia + UYL league-phase opponents. */
const OPPONENTS: OppositionOpponent[] = [
  club('ascoli', 'Ascoli', ['primavera2'], '1-4-1-2-3'),
  club('avellino', 'Avellino', ['primavera2'], '1-4-3-3', ['1-4-2-3-1']),
  club('bari', 'Bari', ['primavera2'], '1-4-3-1-2'),
  club('benevento', 'Benevento', ['primavera2']),
  club('catanzaro', 'Catanzaro', ['primavera2']),
  club('cosenza', 'Cosenza', ['primavera2']),
  club('frosinone', 'Frosinone', ['primavera2']),
  club('latina', 'Latina', ['primavera2']),
  club('monopoli', 'Monopoli', ['primavera2']),
  club('palermo', 'Palermo', ['primavera2']),
  club('perugia', 'Perugia', ['primavera2']),
  club('pescara', 'Pescara', ['primavera2']),
  club('pisa', 'Pisa', ['primavera2'], '4-4-2'),
  club('salernitana', 'Salernitana', ['primavera2']),
  club('spezia', 'Spezia', ['primavera2', 'coppaItalia']),
  club('arsenal', 'Arsenal', ['uefaYouthLeague'], '1-4-2-3-1'),
  club('villarreal', 'Villarreal', ['uefaYouthLeague'], '1-3-4-2-1'),
  club('bodo-glimt', 'Bodø/Glimt', ['uefaYouthLeague']),
  club('porto', 'Porto', ['uefaYouthLeague']),
  club('man-city', 'Manchester City', ['uefaYouthLeague']),
  club('club-brugge', 'Club Brugge', ['uefaYouthLeague']),
];

/** Arsenal UEFA U19 squad — Transfermarkt verein/41571 (season 26/27). */
const arsenal = OPPONENTS.find((o) => o.id === 'arsenal');
if (arsenal) {
  arsenal.starters = placeholder14231('arsenal').map((p) =>
    p.isGk ? { ...p, name: 'Porter', number: 1 } : p
  );
  arsenal.substitutes = [
    { name: 'Jack Talbot', position: 'GK', isGk: true },
  ];
  arsenal.squad = [
    { name: 'Jack Porter', position: 'GK', isGk: true },
    { name: 'Jack Talbot', position: 'GK', isGk: true },
    { name: 'Charlie Phillips', position: 'GK', isGk: true },
    { name: 'Marli Salmon', position: 'CB' },
    { name: 'Brayden Clarke', position: 'CB' },
    { name: 'Marcell Washington', position: 'LB' },
    { name: 'Josh Ogunnaike', position: 'LB' },
    { name: 'Joshua Tahou', position: 'LB' },
    { name: 'Callan Hamill', position: 'RB' },
    { name: 'Abraham Owusu-Gyasi', position: 'RB' },
    { name: 'Josiah King', position: 'RB' },
    { name: 'Ife Ibrahim', position: 'CDM' },
    { name: 'Teshaun Murisa', position: 'CDM' },
    { number: 97, name: 'Mikael Yetna', position: 'CM' },
    { name: 'Theo Julienne', position: 'CM' },
    { name: 'Maalik Hashi', position: 'CM' },
    { name: 'Demiane Agustien', position: 'CAM' },
    { number: 98, name: 'Luis Muñoz', position: 'CAM' },
    { name: 'Brando Bailey-Joseph', position: 'LW' },
    { name: 'Max Dowman', position: 'RW' },
    { name: 'Louis Zečević-John', position: 'RW' },
    { name: 'Andre Harriman-Annous', position: 'ST' },
    { name: "Ceadach O'Neill", position: 'ST' },
    { name: 'Marley Frohock', position: 'ST' },
    { number: 95, name: 'Jaden Maghoma', position: 'ST' },
  ];
}

/** Villarreal scouted XI — 3-4-2-1 / out-of-possession 5-3-2 vs Borussia Dortmund. */
const villarreal = OPPONENTS.find((o) => o.id === 'villarreal');
if (villarreal) {
  const dortmund = [
    {
      number: 1,
      name: 'Polo',
      teamId: 'villarreal',
      isGk: true,
      top: '8%',
      left: '50%',
    },
    {
      number: 2,
      name: 'Toni',
      teamId: 'villarreal',
      top: '20%',
      left: '28%',
    },
    {
      number: 4,
      name: 'Vergun',
      teamId: 'villarreal',
      top: '18%',
      left: '50%',
    },
    {
      number: 5,
      name: 'Anadon',
      teamId: 'villarreal',
      top: '20%',
      left: '72%',
    },
    {
      number: 11,
      name: 'Vivo',
      teamId: 'villarreal',
      top: '38%',
      left: '12%',
    },
    {
      number: 16,
      name: 'Llopis',
      teamId: 'villarreal',
      top: '38%',
      left: '88%',
    },
    {
      number: 8,
      name: 'Traore',
      teamId: 'villarreal',
      top: '42%',
      left: '38%',
    },
    {
      number: 6,
      name: 'Alcaide',
      teamId: 'villarreal',
      top: '42%',
      left: '62%',
    },
    {
      number: 28,
      name: 'Iker',
      teamId: 'villarreal',
      top: '62%',
      left: '28%',
    },
    {
      number: 15,
      name: 'Edu',
      teamId: 'villarreal',
      top: '62%',
      left: '72%',
    },
    {
      number: 9,
      name: 'Raul',
      teamId: 'villarreal',
      top: '78%',
      left: '50%',
    },
  ];
  villarreal.starters = dortmund;
  const elche = [
    {
      number: 1,
      name: 'Ursu',
      teamId: 'villarreal',
      isGk: true,
      top: '8%',
      left: '50%',
    },
    {
      number: 28,
      name: 'Luengo',
      teamId: 'villarreal',
      top: '22%',
      left: '18%',
    },
    {
      number: 2,
      name: 'Toni',
      teamId: 'villarreal',
      top: '20%',
      left: '38%',
    },
    {
      number: 24,
      name: 'Vergun',
      teamId: 'villarreal',
      top: '20%',
      left: '62%',
    },
    {
      number: 3,
      name: 'Pilili',
      teamId: 'villarreal',
      top: '22%',
      left: '82%',
    },
    {
      number: 7,
      name: 'Vivo',
      teamId: 'villarreal',
      top: '48%',
      left: '18%',
    },
    {
      number: 6,
      name: 'Ioan',
      teamId: 'villarreal',
      top: '45%',
      left: '38%',
    },
    {
      number: 22,
      name: 'Koné',
      teamId: 'villarreal',
      top: '45%',
      left: '62%',
    },
    {
      number: 10,
      name: 'Edu',
      teamId: 'villarreal',
      top: '48%',
      left: '82%',
    },
    {
      number: 19,
      name: 'Iker',
      teamId: 'villarreal',
      top: '75%',
      left: '38%',
    },
    {
      number: 20,
      name: 'Yuri',
      teamId: 'villarreal',
      top: '75%',
      left: '62%',
    },
  ];
  /**
   * Latest DH starting XI (broadcast graphic). 4-4-2 —
   * pitch attacks downward; team-right = screen-left.
   * Nicknames on pitch; full names in squad table.
   */
  const latest = [
    {
      number: 1,
      name: 'Ursu',
      teamId: 'villarreal',
      isGk: true,
      top: '8%',
      left: '50%',
    },
    {
      number: 28,
      name: 'Luengo',
      teamId: 'villarreal',
      top: '22%',
      left: '18%',
    },
    {
      number: 2,
      name: 'Toni',
      teamId: 'villarreal',
      top: '20%',
      left: '38%',
    },
    {
      number: 5,
      name: 'Juanma',
      teamId: 'villarreal',
      top: '20%',
      left: '62%',
    },
    {
      number: 23,
      name: 'Iván',
      teamId: 'villarreal',
      top: '22%',
      left: '82%',
    },
    {
      number: 7,
      name: 'Vivo',
      teamId: 'villarreal',
      top: '48%',
      left: '18%',
    },
    {
      number: 6,
      name: 'Ioan',
      teamId: 'villarreal',
      top: '45%',
      left: '38%',
    },
    {
      number: 22,
      name: 'Koné',
      teamId: 'villarreal',
      top: '45%',
      left: '62%',
    },
    {
      number: 11,
      name: 'Carrasco',
      teamId: 'villarreal',
      top: '48%',
      left: '82%',
    },
    {
      number: 9,
      name: 'Raul',
      teamId: 'villarreal',
      top: '75%',
      left: '38%',
    },
    {
      number: 17,
      name: 'Fode',
      teamId: 'villarreal',
      top: '75%',
      left: '62%',
    },
  ];
  /** 4-4-2 vs Murcia — pitch attacks downward; team-right = screen-left. */
  const murcia = [
    {
      number: 1,
      name: 'Ursu',
      teamId: 'villarreal',
      isGk: true,
      top: '8%',
      left: '50%',
    },
    {
      number: 28,
      name: 'Luengo',
      teamId: 'villarreal',
      top: '22%',
      left: '18%',
    },
    {
      number: 2,
      name: 'Toni',
      teamId: 'villarreal',
      top: '20%',
      left: '38%',
    },
    {
      number: 5,
      name: 'Juanma',
      teamId: 'villarreal',
      top: '20%',
      left: '62%',
    },
    {
      number: 24,
      name: 'Iván',
      teamId: 'villarreal',
      top: '22%',
      left: '82%',
    },
    {
      number: 7,
      name: 'Vivo',
      teamId: 'villarreal',
      top: '48%',
      left: '18%',
    },
    {
      number: 8,
      name: 'Jairo',
      teamId: 'villarreal',
      top: '45%',
      left: '38%',
    },
    {
      number: 6,
      name: 'Ioan',
      teamId: 'villarreal',
      top: '45%',
      left: '62%',
    },
    {
      number: 10,
      name: 'Edu',
      teamId: 'villarreal',
      top: '48%',
      left: '82%',
    },
    {
      number: 9,
      name: 'Raul',
      teamId: 'villarreal',
      top: '75%',
      left: '38%',
    },
    {
      number: 17,
      name: 'Fode',
      teamId: 'villarreal',
      top: '75%',
      left: '62%',
    },
  ];
  villarreal.alternateFormationSystems = ['1-4-4-2'];
  villarreal.starters = latest;
  /**
   * Depth = Castellón + Dortmund (mapped) + Elche + Murcia onto 4-4-2.
   * vs BVB: out-of-possession 5-3-2 (Toni RCB); when Vivo stepped up Toni slid to RB —
   * so Vivo’s Dortmund app counted at RM, and 1 of Toni’s 4 RCB apps moved to RB.
   * Elche ST: Iker (RST), Yuri (LST). Dortmund ST: Raul only (RST).
   * Vergun: 1× RCB (Dortmund CB) + 1× LCB (Elche).
   */
  villarreal.squadDepth = {
    system: '1-4-4-2',
    note: {
      en: 'Last 4 starting XIs (Castellón 4-4-2, Dortmund 3-4-2-1 / defensive 5-3-2, Elche 4-4-2, Murcia 4-4-2) mapped onto 4-4-2. vs BVB Toni stayed RCB in the back five; when Vivo stepped into midfield Toni covered RB — Vivo’s Dortmund start counted at RM, one Toni start at RB. Order = most starts in that slot. Short display names on pitch; full names in the squad table.',
      it: 'Ultime 4 formazioni (Castellón 4-4-2, Dortmund 3-4-2-1 / 5-3-2 in non possesso, Elche 4-4-2, Murcia 4-4-2) mappate sul 4-4-2. vs BVB Toni restava RCB nel 5; quando Vivo saliva Toni copriva da RB — la partenza Dortmund di Vivo è contata da RM, una di Toni da RB. Ordine = più partite in quel ruolo. Nomi corti sul campo; nomi completi in tabella rosa.',
    },
    slots: [
      {
        role: 'GK',
        top: '10%',
        left: '50%',
        players: [
          { name: 'Ursu', starts: 3 },
          { name: 'Pablo Polo', starts: 1 },
        ],
      },
      {
        role: 'RB',
        top: '26%',
        left: '18%',
        players: [
          { name: 'Luengo', starts: 3 },
          { name: 'Falcó Montanet', starts: 1 },
        ],
      },
      {
        role: 'RCB',
        top: '24%',
        left: '38%',
        players: [
          { name: 'Falcó Montanet', starts: 3 },
          { name: 'Vergún', starts: 1 },
        ],
      },
      {
        role: 'LCB',
        top: '24%',
        left: '62%',
        players: [
          { name: 'Juanma Barrios', starts: 2 },
          { name: 'Vergún', starts: 1 },
          { name: 'Anadón', starts: 1 },
        ],
      },
      {
        role: 'LB',
        top: '26%',
        left: '82%',
        players: [
          { name: 'Iván', starts: 2 },
          { name: 'Pilili', starts: 1 },
          { name: 'Llopis', starts: 1 },
        ],
      },
      {
        role: 'RM',
        top: '48%',
        left: '18%',
        players: [
          { name: 'Vivó Guillamón', starts: 4 },
          { name: 'Iker Pérez', starts: 1 },
        ],
      },
      {
        role: 'RCM',
        top: '45%',
        left: '38%',
        players: [
          { name: 'Ioan Precup', starts: 2 },
          { name: 'Moussa Traoré', starts: 1 },
          { name: 'Jairo', starts: 1 },
        ],
      },
      {
        role: 'LCM',
        top: '45%',
        left: '62%',
        players: [
          { name: 'Moussa Koné', starts: 2 },
          { name: 'Álvaro Alcaide', starts: 1 },
          { name: 'Ioan Precup', starts: 1 },
        ],
      },
      {
        role: 'LM',
        top: '48%',
        left: '82%',
        players: [
          { name: 'González García', starts: 3 },
          { name: 'Jorge Carrasco', starts: 1 },
        ],
      },
      {
        role: 'RST',
        top: '75%',
        left: '38%',
        players: [
          { name: 'García Palomar (c)', starts: 3 },
          { name: 'Iker Pérez', starts: 1 },
        ],
      },
      {
        role: 'LST',
        top: '75%',
        left: '62%',
        players: [
          { name: 'Fode', starts: 2 },
          { name: 'Yurii Kisak', starts: 1 },
        ],
      },
    ],
  };
  villarreal.scoutedFormations = [
    {
      id: 'villarreal-vs-castellon',
      label: {
        en: 'vs Castellón',
        it: 'vs Castellón',
      },
      system: '1-4-4-2',
      players: latest,
    },
    {
      id: 'villarreal-vs-dortmund',
      label: {
        en: 'vs Borussia Dortmund',
        it: 'vs Borussia Dortmund',
      },
      system: '1-3-4-2-1',
      notes: {
        en: 'Out of possession often 5-3-2: Toni as RCB; when Vivo stepped up Toni slid across to RB.',
        it: 'In non possesso spesso 5-3-2: Toni da RCB; quando Vivo saliva Toni scivolava a RB.',
      },
      players: dortmund,
    },
    {
      id: 'villarreal-vs-elche',
      label: {
        en: 'vs Elche',
        it: 'vs Elche',
      },
      system: '1-4-4-2',
      players: elche,
    },
    {
      id: 'villarreal-vs-murcia',
      label: {
        en: 'vs Murcia',
        it: 'vs Murcia',
      },
      system: '1-4-4-2',
      players: murcia,
    },
  ];
  villarreal.squad = [
    {
      number: 1,
      name: 'Pablo Polo Ortiz (Polo)',
      position: 'GK',
      isGk: true,
      heightCm: 194,
      preferredFoot: 'Destro',
    },
    {
      number: 13,
      name: 'Eduard Ursu (Ursu)',
      position: 'GK',
      isGk: true,
      heightCm: 192,
      preferredFoot: 'Destro',
    },
    {
      number: 2,
      name: 'Antoni Falcó Montanet (Toni)',
      position: 'RCB',
      preferredFoot: 'Destro',
    },
    {
      name: 'Lucas Pilili Rodríguez (Pilili)',
      position: 'LB',
      heightCm: 183,
      preferredFoot: 'Sinistro',
    },
    {
      number: 4,
      name: 'Román Martín Vergún (Vergun)',
      position: 'CB',
      heightCm: 196,
      preferredFoot: 'Destro',
    },
    {
      number: 5,
      name: 'Guillermo Anadón Angulo (Anadon)',
      position: 'LCB',
      heightCm: 179,
      preferredFoot: 'Destro',
    },
    {
      name: 'Juan Manuel Borrero Barrios (Juanma)',
      position: 'LCB',
      preferredFoot: 'Destro',
    },
    {
      name: 'Iván Jiménez Soriano (Iván)',
      position: 'LB',
      preferredFoot: 'Destro',
    },
    {
      number: 20,
      name: 'Álvaro Alcaide Valls (Alcaide)',
      position: 'LCM',
      heightCm: 183,
      preferredFoot: 'Destro',
    },
    {
      name: 'Ioan Precup (Ioan)',
      position: 'CM',
      heightCm: 180,
      preferredFoot: 'Destro',
    },
    {
      name: 'Adrián Vivó Guillamón (Vivo)',
      position: 'RW',
      heightCm: 175,
      preferredFoot: 'Destro',
    },
    {
      number: 21,
      name: 'Moussa Traoré Camara (Traore)',
      position: 'RCM',
      heightCm: 165,
      preferredFoot: 'Destro',
    },
    {
      name: 'Jairo Trujillo Molina (Jairo)',
      position: 'RCM',
      heightCm: 182,
      preferredFoot: 'Destro',
    },
    {
      number: 9,
      name: 'Raúl García Palomar (Raul)',
      position: 'ST',
      preferredFoot: 'Destro',
    },
    {
      number: 15,
      name: 'Eduardo González García (Edu)',
      position: 'LW',
      preferredFoot: 'Sinistro',
    },
    {
      name: 'Seydou Llopis Gandia (Llopis)',
      position: 'LWB',
      heightCm: 177,
      preferredFoot: 'Destro',
    },
    {
      number: 27,
      name: 'Fode Minite Sabater (Fode)',
      position: 'ST / RW',
      heightCm: 185,
      preferredFoot: 'Destro',
    },
    {
      number: 19,
      name: 'Iker Pérez Espinosa (Iker)',
      position: 'AM',
      preferredFoot: 'Sinistro',
    },
    {
      number: 29,
      name: 'Yurii Kisak (Yuri)',
      position: 'ST',
      preferredFoot: 'Sinistro',
    },
    {
      name: 'Moussa Koné Diabate (Koné)',
      position: 'LCM',
      preferredFoot: 'Destro',
    },
    {
      number: 28,
      name: 'Rubén Luengo Cordero (Luengo)',
      position: 'RB',
      preferredFoot: 'Destro',
    },
    /**
     * Appeared in Castellón XI (#11 mediapunta) + Elche/SF benches.
     * Foot: “juego a dos pies” (esportbase). Height not listed on BeSoccer/TM.
     */
    {
      number: 11,
      name: 'Jorge Carrasco González (Carrasco)',
      position: 'AM',
      preferredFoot: 'Ambidestro',
    },
    /**
     * Bench vs Elche + Castellón window (SF sub for Fode).
     * Height/foot from FM database only (BeSoccer/TM blank).
     */
    {
      name: 'Mario Barella Jiménez (Barella)',
      position: 'AM',
      heightCm: 174,
      preferredFoot: 'Destro',
    },
    /**
     * Bench vs Castellón + Elche; SF sub for Iván Jiménez (LB).
     * Full name as reported; height/foot not found.
     */
    {
      name: 'Alejandro A. Chavero (Chavero)',
      position: 'LB',
      preferredFoot: 'Destro',
    },
    /**
     * Bench vs Castellón (assist for Kisak). BeSoccer: ST, no height/foot.
     */
    {
      name: 'Sergio Serrano Acosta (Serrano)',
      position: 'ST',
      preferredFoot: 'Destro',
    },
  ];
}

/**
 * Bari XI — 4-3-1-2 rombo (shirt slots RTL: 1; 2-5-6-3; 7-4-8; 10; 9-11).
 * Sources: Salernitana tabellino · Latina distinta · TM 5014172 Ascoli · TM 5014185 Palermo MD3 · TM 4913072 Palermo Coppa.
 * (LCB is #6 De Lucia on sheets; CDM is #4 Mundo — not a second #4 in the back.)
 */
const bari = OPPONENTS.find((o) => o.id === 'bari');
if (bari) {
  /**
   * Shared 4-3-1-2 slots. Pitch attacks downward: team-right = screen-left.
   * Back RTL: #2 RB, #5 RCB, #6 LCB, #3 LB. Mid RTL: #7 RCM, #4 CDM, #10 LCM.
   * #8 Scarano = CAM; #10 Campagna = LCM.
   */
  const bari4312 = (
    names: {
      gk: string;
      lb: string;
      lcb: string;
      rcb: string;
      rb: string;
      rcm: string;
      cdm: string;
      lcm: string;
      cam: string;
      lst: string;
      rst: string;
    },
    nums: {
      gk: number;
      lb: number;
      lcb: number;
      rcb: number;
      rb: number;
      rcm: number;
      cdm: number;
      lcm: number;
      cam: number;
      lst: number;
      rst: number;
    } = {
      gk: 1,
      rb: 2,
      rcb: 5,
      lcb: 6,
      lb: 3,
      rcm: 7,
      cdm: 4,
      lcm: 10,
      cam: 8,
      rst: 9,
      lst: 11,
    }
  ): PitchPlayer[] => [
    {
      number: nums.gk,
      name: names.gk,
      teamId: 'bari',
      isGk: true,
      top: '8%',
      left: '50%',
    },
    { number: nums.rb, name: names.rb, teamId: 'bari', top: '22%', left: '18%' },
    { number: nums.rcb, name: names.rcb, teamId: 'bari', top: '20%', left: '38%' },
    { number: nums.lcb, name: names.lcb, teamId: 'bari', top: '20%', left: '62%' },
    { number: nums.lb, name: names.lb, teamId: 'bari', top: '22%', left: '82%' },
    { number: nums.rcm, name: names.rcm, teamId: 'bari', top: '42%', left: '28%' },
    { number: nums.cdm, name: names.cdm, teamId: 'bari', top: '38%', left: '50%' },
    { number: nums.lcm, name: names.lcm, teamId: 'bari', top: '42%', left: '72%' },
    { number: nums.cam, name: names.cam, teamId: 'bari', top: '58%', left: '50%' },
    { number: nums.rst, name: names.rst, teamId: 'bari', top: '75%', left: '38%' },
    { number: nums.lst, name: names.lst, teamId: 'bari', top: '75%', left: '62%' },
  ];

  const vsSalernitana = bari4312({
    gk: 'Cipolla',
    rb: 'Emiliano',
    rcb: 'Dimonte',
    lcb: 'De Lucia',
    lb: 'Legrottaglie',
    rcm: 'Valoroso',
    cdm: 'Mundo',
    lcm: 'Alonso Cam.',
    cam: 'Scarano',
    rst: 'Scifoni',
    lst: 'Italia',
  });

  const vsAscoli = bari4312({
    gk: 'Mezzapesa',
    rb: 'Emiliano',
    rcb: 'Dimonte',
    lcb: 'De Lucia',
    lb: 'Spadavecchia',
    rcm: 'Valoroso',
    cdm: 'Mundo',
    lcm: 'Alonso Cam.',
    cam: 'Scarano',
    rst: 'Scifoni',
    lst: 'Italia',
  });

  /** Official shirts 1–11 map cleanly onto 4-3-1-2; TM labels 3-4-2-1. */
  const vsPalermo = bari4312({
    gk: 'Mezzapesa',
    rb: 'Emiliano',
    rcb: 'Dimonte',
    lcb: 'De Lucia',
    lb: 'Caputo',
    rcm: 'Vitale',
    cdm: 'Mundo',
    lcm: 'Alonso Cam.',
    cam: 'Scarano',
    rst: 'Leone',
    lst: 'Italia',
  });

  const vsPalermoCoppa = bari4312({
    gk: 'Mezzapesa',
    rb: 'Emiliano',
    rcb: 'Dimonte',
    lcb: 'De Lucia',
    lb: 'Legrottaglie',
    rcm: 'Vitale',
    cdm: 'Mundo',
    lcm: 'Alonso Cam.',
    cam: 'Grimaldi',
    rst: 'Leone',
    lst: 'Keita',
  });

  const vsLatina = bari4312({
    gk: 'Falbo',
    rb: 'Emiliano',
    rcb: 'Dimonte',
    lcb: 'De Lucia',
    lb: 'Legrottaglie',
    rcm: 'Vitale',
    cdm: 'Mundo',
    lcm: 'Alonso Cam.',
    cam: 'Scarano',
    rst: 'Leone',
    lst: 'Felice',
  });

  bari.formationSystem = '1-4-3-1-2';
  bari.starters = vsLatina;
  bari.scoutedFormations = [
    {
      id: 'bari-vs-salernitana',
      label: {
        en: 'vs Salernitana (4–0)',
        it: 'vs Salernitana (4–0)',
      },
      system: '4-3-1-2',
      players: vsSalernitana,
      notes: {
        en: 'Primavera 2 MD1, 5 Sep 2026 (tabellino). Cipolla in goal; Legrottaglie at LB. Goals: Dimonte, Italia, Campagna, Grimaldi. Subs: Grimaldi, Leone, Pietraniello, Felice, Vitale.',
        it: 'Primavera 2 gior. 1, 5 set 2026 (tabellino). Cipolla in porta; Legrottaglie terzino sinistro. Gol: Dimonte, Italia, Campagna, Grimaldi. Sub: Grimaldi, Leone, Pietraniello, Felice, Vitale.',
      },
    },
    {
      id: 'bari-vs-ascoli',
      label: {
        en: 'vs Ascoli (2–1)',
        it: 'vs Ascoli (2–1)',
      },
      system: '4-3-1-2',
      players: vsAscoli,
      notes: {
        en: 'Primavera 2 MD2, 12 Sep 2026 (TM 5014172). Spadavecchia at LB. TM lists 4-4-1-1 in error — same diamond shirts as other games. Subs: Vitale, Felice, Leone, Grimaldi.',
        it: 'Primavera 2 gior. 2, 12 set 2026 (TM 5014172). Spadavecchia terzino sinistro. TM riporta 4-4-1-1 per errore — stessi numeri a rombo. Sub: Vitale, Felice, Leone, Grimaldi.',
      },
    },
    {
      id: 'bari-vs-palermo',
      label: {
        en: 'vs Palermo (2–2)',
        it: 'vs Palermo (2–2)',
      },
      system: '4-3-1-2',
      players: vsPalermo,
      notes: {
        en: 'Primavera 2 MD3, 19 Sep 2026 (TM 5014185). Official shirts = diamond: Caputo (#3) LB, Vitale (#7) RCM, Campagna (#10) LCM, Scarano (#8) CAM; Leone–Italia. TM lists 3-4-2-1. Goals: Leone, Scarano. Subs: Felice, Barbera, Valoroso, Scifoni, Napoleone.',
        it: 'Primavera 2 gior. 3, 19 set 2026 (TM 5014185). Numeri ufficiali = rombo: Caputo (#3) TS, Vitale (#7) CC destro, Campagna (#10) CC sinistro, Scarano (#8) trequartista; Leone–Italia. TM riporta 3-4-2-1. Gol: Leone, Scarano. Sub: Felice, Barbera, Valoroso, Scifoni, Napoleone.',
      },
    },
    {
      id: 'bari-vs-palermo-coppa',
      label: {
        en: 'vs Palermo (Coppa 3–2)',
        it: 'vs Palermo (Coppa 3–2)',
      },
      system: '4-3-1-2',
      players: vsPalermoCoppa,
      notes: {
        en: 'Coppa Italia Primavera, 26 Sep 2026 (TM 4913072). Vitale (#7) RCM / Campagna (#10) LCM; Grimaldi at CAM; Leone–Keita up top. Subs: Scarano, Felice, Italia, Valoroso, Caputo.',
        it: 'Coppa Italia Primavera, 26 set 2026 (TM 4913072). Vitale (#7) CC destro / Campagna (#10) CC sinistro; Grimaldi trequartista; Leone–Keita davanti. Sub: Scarano, Felice, Italia, Valoroso, Caputo.',
      },
    },
    {
      id: 'bari-vs-latina',
      label: {
        en: 'vs Latina (0–0)',
        it: 'vs Latina (0–0)',
      },
      system: '4-3-1-2',
      players: vsLatina,
      notes: {
        en: 'Primavera 2 MD4, 10 Oct 2026 (distinta). Falbo in goal; Vitale (#7) RCM, Campagna (#10) LCM, Scarano (#8) CAM; Leone–Felice. Most recent scouted XI.',
        it: 'Primavera 2 gior. 4, 10 ott 2026 (distinta). Falbo in porta; Vitale (#7) CC destro, Campagna (#10) CC sinistro, Scarano (#8) trequartista; Leone–Felice. XI scoutata più recente.',
      },
    },
  ];
  /** Depth = all 5 scouted XIs onto 4-3-1-2 diamond. */
  bari.squadDepth = {
    system: '1-4-3-1-2',
    note: {
      en: 'Last 5 scouted XIs (Salernitana, Ascoli, Palermo MD3, Palermo Coppa, Latina) mapped onto 4-3-1-2. Scarano (#8) at CAM; Campagna (#10) at LCM. Order = most starts in that slot.',
      it: 'Ultime 5 formazioni scoutate (Salernitana, Ascoli, Palermo gior. 3, Palermo Coppa, Latina) mappate sul 4-3-1-2. Scarano (#8) trequartista; Campagna (#10) CC sinistro. Ordine = più partite in quel ruolo.',
    },
    slots: [
      {
        role: 'GK',
        top: '10%',
        left: '50%',
        players: [
          { name: 'Mezzapesa', starts: 3 },
          { name: 'Cipolla', starts: 1 },
          { name: 'Falbo', starts: 1 },
        ],
      },
      {
        role: 'RB',
        top: '26%',
        left: '18%',
        players: [{ name: 'Emiliano', starts: 5 }],
      },
      {
        role: 'RCB',
        top: '24%',
        left: '38%',
        players: [{ name: 'Dimonte', starts: 5 }],
      },
      {
        role: 'LCB',
        top: '24%',
        left: '62%',
        players: [{ name: 'De Lucia', starts: 5 }],
      },
      {
        role: 'LB',
        top: '26%',
        left: '82%',
        players: [
          { name: 'Legrottaglie', starts: 3 },
          { name: 'Spadavecchia', starts: 1 },
          { name: 'Caputo', starts: 1 },
        ],
      },
      {
        role: 'RCM',
        top: '45%',
        left: '28%',
        players: [
          { name: 'Vitale', starts: 3 },
          { name: 'Valoroso', starts: 2 },
        ],
      },
      {
        role: 'CDM',
        top: '42%',
        left: '50%',
        players: [{ name: 'Mundo', starts: 5 }],
      },
      {
        role: 'LCM',
        top: '45%',
        left: '72%',
        players: [{ name: 'Alonso Cam.', starts: 5 }],
      },
      {
        role: 'CAM',
        top: '60%',
        left: '50%',
        players: [
          { name: 'Scarano', starts: 4 },
          { name: 'Grimaldi', starts: 1 },
        ],
      },
      {
        role: 'RST',
        top: '75%',
        left: '38%',
        players: [
          { name: 'Leone', starts: 3 },
          { name: 'Scifoni', starts: 2 },
        ],
      },
      {
        role: 'LST',
        top: '75%',
        left: '62%',
        players: [
          { name: 'Italia', starts: 3 },
          { name: 'Felice', starts: 1 },
          { name: 'Keita', starts: 1 },
        ],
      },
    ],
  };
  /** Squad bios from staff list (no shirt numbers — pitch uses role slots only). */
  bari.squad = [
    {
      name: 'Francesco Cipolla',
      position: 'GK',
      isGk: true,
      birthYear: 2009,
      heightCm: 182,
      preferredFoot: 'Destro',
    },
    {
      name: 'Francesco Falbo',
      position: 'GK',
      isGk: true,
      birthYear: 2009,
    },
    {
      name: 'Alessandro Mezzapesa',
      position: 'GK',
      isGk: true,
      birthYear: 2008,
      heightCm: 190,
      preferredFoot: 'Destro',
    },
    {
      name: 'Giovanni Scattarelli',
      position: 'GK',
      isGk: true,
      birthYear: 2009,
      heightCm: 183,
      preferredFoot: 'Sinistro',
    },
    {
      name: 'Leonardo Caputo',
      position: 'CB',
      birthYear: 2009,
      heightCm: 181,
      preferredFoot: 'Sinistro',
    },
    {
      name: 'Mattia De Lucia',
      position: 'CB',
      birthYear: 2008,
      preferredFoot: 'Ambidestro',
    },
    {
      name: 'Paolo Dimonte',
      position: 'CB',
      birthYear: 2008,
      preferredFoot: 'Destro',
    },
    {
      name: 'Francesco Napoleone',
      position: 'CB',
      birthYear: 2009,
      preferredFoot: 'Destro',
    },
    {
      name: 'Karlis Vilums',
      position: 'CB',
      birthYear: 2009,
      heightCm: 194,
      preferredFoot: 'Sinistro',
    },
    {
      name: 'Pantaleo Spadavecchia',
      position: 'RB',
      birthYear: 2007,
      heightCm: 180,
      preferredFoot: 'Destro',
    },
    {
      name: 'Gianmarco Emiliano',
      position: 'RB',
      birthYear: 2008,
    },
    {
      name: 'Cristian Valoroso',
      position: 'LB',
      birthYear: 2009,
      preferredFoot: 'Sinistro',
    },
    {
      name: 'Nicola Barbera',
      position: 'CM',
      birthYear: 2009,
    },
    {
      name: 'Leonardo Alonso Campagna',
      position: 'CM',
      birthYear: 2008,
      heightCm: 176,
      preferredFoot: 'Destro',
    },
    {
      name: 'Vincenzo Grimaldi',
      position: 'CDM',
      birthYear: 2009,
      preferredFoot: 'Destro',
    },
    {
      name: 'Umberto Legrottaglie',
      position: 'LM',
      birthYear: 2008,
      heightCm: 175,
      preferredFoot: 'Sinistro',
    },
    {
      name: 'Nicolò Mundo',
      position: 'CM',
      birthYear: 2008,
      preferredFoot: 'Sinistro',
    },
    {
      name: 'Alessandro Pietraniello',
      position: 'CM',
      birthYear: 2009,
      heightCm: 178,
      preferredFoot: 'Ambidestro',
    },
    {
      name: 'Benedetto Pizzo',
      position: 'CM',
      birthYear: 2008,
      heightCm: 186,
      preferredFoot: 'Destro',
    },
    {
      name: 'Giuseppe Scarano',
      position: 'CAM',
      birthYear: 2008,
      preferredFoot: 'Destro',
    },
    {
      name: 'Riccardo Vitale',
      position: 'CAM',
      birthYear: 2009,
      preferredFoot: 'Destro',
    },
    {
      name: 'Sakoba Keita',
      position: 'LW',
      birthYear: 2008,
      preferredFoot: 'Destro',
    },
    {
      name: 'Cristian Scifoni',
      position: 'RW',
      birthYear: 2008,
      preferredFoot: 'Destro',
    },
    {
      name: 'Giuseppe Felice',
      position: 'ST',
      birthYear: 2009,
      heightCm: 180,
      preferredFoot: 'Destro',
    },
    {
      name: 'Matteo Italia',
      position: 'ST',
      birthYear: 2008,
      heightCm: 175,
      preferredFoot: 'Destro',
    },
    {
      name: 'Gaetano Leone',
      position: 'ST',
      birthYear: 2009,
    },
    {
      name: 'Amara Kader Sanogo',
      position: 'ST',
      birthYear: 2010,
    },
  ];
}

/** Ascoli scouted XI — 4-3-3 with holding mid (sheet 15 Sep 2026). */
const ascoli = OPPONENTS.find((o) => o.id === 'ascoli');
if (ascoli) {
  ascoli.starters = [
    {
      number: 1,
      name: 'Angeletti',
      teamId: 'ascoli',
      isGk: true,
      top: '8%',
      left: '50%',
    },
    { number: 2, name: 'Zampardi', teamId: 'ascoli', top: '22%', left: '18%' },
    { number: 5, name: 'Tocchi', teamId: 'ascoli', top: '20%', left: '38%' },
    { number: 6, name: 'Curzi', teamId: 'ascoli', top: '20%', left: '62%' },
    { number: 3, name: 'Bruni', teamId: 'ascoli', top: '22%', left: '82%' },
    { number: 4, name: 'Russo', teamId: 'ascoli', top: '38%', left: '50%' },
    { number: 10, name: 'Angelino', teamId: 'ascoli', top: '50%', left: '32%' },
    { number: 8, name: 'Dente', teamId: 'ascoli', top: '50%', left: '68%' },
    { number: 7, name: 'Suzzi', teamId: 'ascoli', top: '68%', left: '18%' },
    { number: 9, name: 'Raimondo', teamId: 'ascoli', top: '78%', left: '50%' },
    { number: 11, name: 'Aloisi', teamId: 'ascoli', top: '68%', left: '82%' },
  ];
  ascoli.substitutes = [
    { number: 12, name: 'Ferrazzoli', position: 'GK', isGk: true },
    { number: 13, name: 'Diamanti', position: 'RB' },
    { number: 14, name: 'Parente', position: 'CB' },
    { number: 15, name: 'Cicchitti', position: 'CDM' },
    { number: 16, name: 'Perrulli', position: 'ST' },
    { number: 17, name: 'Leonori', position: 'CB' },
    { number: 18, name: 'Balducci', position: 'ST' },
    { number: 19, name: 'Boete', position: 'Winger' },
    { number: 20, name: 'Martinelli' },
    { number: 21, name: 'Di Mattia', position: 'CM' },
    { number: 22, name: 'Cantini', position: 'Winger' },
    { number: 23, name: 'Rossi', position: 'Winger' },
    { name: 'Dente', position: 'GK', isGk: true },
    { name: 'De Rossi', position: 'CM' },
    { name: 'Mancini', position: 'CM' },
  ];
  ascoli.squad = [
    { number: 1, name: 'Angeletti', position: 'GK', isGk: true },
    { number: 2, name: 'Zampardi', position: 'LB' },
    { number: 3, name: 'Bruni', position: 'RB' },
    { number: 4, name: 'Russo', position: 'CDM' },
    { number: 5, name: 'Tocchi', position: 'CB' },
    { number: 6, name: 'Curzi', position: 'CB' },
    { number: 7, name: 'Suzzi', position: 'LW' },
    { number: 8, name: 'Dente', position: 'CM' },
    { number: 9, name: 'Raimondo', position: 'ST' },
    { number: 10, name: 'Angelino', position: 'CM' },
    { number: 11, name: 'Aloisi', position: 'RW' },
    { number: 12, name: 'Ferrazzoli', position: 'GK', isGk: true },
    { number: 13, name: 'Diamanti', position: 'RB' },
    { number: 14, name: 'Parente', position: 'CB' },
    { number: 15, name: 'Cicchitti', position: 'CDM' },
    { number: 16, name: 'Perrulli', position: 'ST' },
    { number: 17, name: 'Leonori', position: 'CB' },
    { number: 18, name: 'Balducci', position: 'ST' },
    { number: 19, name: 'Boete', position: 'Winger' },
    { number: 20, name: 'Martinelli' },
    { number: 21, name: 'Di Mattia', position: 'CM' },
    { number: 22, name: 'Cantini', position: 'Winger' },
    { number: 23, name: 'Rossi', position: 'Winger' },
    { name: 'Dente', position: 'GK', isGk: true },
    { name: 'De Rossi', position: 'CM' },
    { name: 'Mancini', position: 'CM' },
  ];
}

/** Flat 4-4-2 named XI. Pitch attacks downward: team-left = screen-right. */
function pisa442(names: {
  gk: string;
  lb: string;
  lcb: string;
  rcb: string;
  rb: string;
  lm: string;
  lcm: string;
  rcm: string;
  rm: string;
  lst: string;
  rst: string;
}): PitchPlayer[] {
  const teamId = 'pisa';
  return [
    { number: 0, name: names.gk, teamId, isGk: true, top: '8%', left: '50%' },
    { number: 0, name: names.lb, teamId, top: '22%', left: '82%' },
    { number: 0, name: names.lcb, teamId, top: '20%', left: '62%' },
    { number: 0, name: names.rcb, teamId, top: '20%', left: '38%' },
    { number: 0, name: names.rb, teamId, top: '22%', left: '18%' },
    { number: 0, name: names.lm, teamId, top: '48%', left: '82%' },
    { number: 0, name: names.lcm, teamId, top: '45%', left: '62%' },
    { number: 0, name: names.rcm, teamId, top: '45%', left: '38%' },
    { number: 0, name: names.rm, teamId, top: '48%', left: '18%' },
    { number: 0, name: names.lst, teamId, top: '75%', left: '62%' },
    { number: 0, name: names.rst, teamId, top: '75%', left: '38%' },
  ];
}

/** 4-1-4-1 named XI. Pitch attacks downward: team-left = screen-right. */
function perugia4141(names: {
  gk: string;
  lb: string;
  lcb: string;
  rcb: string;
  rb: string;
  cdm: string;
  lm: string;
  lcm: string;
  rcm: string;
  rm: string;
  st: string;
}): PitchPlayer[] {
  const teamId = 'perugia';
  return [
    { number: 0, name: names.gk, teamId, isGk: true, top: '8%', left: '50%' },
    { number: 0, name: names.lb, teamId, top: '22%', left: '82%' },
    { number: 0, name: names.lcb, teamId, top: '20%', left: '62%' },
    { number: 0, name: names.rcb, teamId, top: '20%', left: '38%' },
    { number: 0, name: names.rb, teamId, top: '22%', left: '18%' },
    { number: 0, name: names.cdm, teamId, top: '38%', left: '50%' },
    { number: 0, name: names.lm, teamId, top: '58%', left: '82%' },
    { number: 0, name: names.lcm, teamId, top: '52%', left: '62%' },
    { number: 0, name: names.rcm, teamId, top: '52%', left: '38%' },
    { number: 0, name: names.rm, teamId, top: '58%', left: '18%' },
    { number: 0, name: names.st, teamId, top: '78%', left: '50%' },
  ];
}

/**
 * Pisa scout pack — notebook “Profili giocatori” + last 3 XIs + Combined XI.
 * On the sheet, “//” = same starter as the previous match in that slot.
 */
const pisa = OPPONENTS.find((o) => o.id === 'pisa');
if (pisa) {
  const combined = pisa442({
    gk: 'Paolini',
    lb: 'Minisini',
    lcb: 'Bendinelli',
    rcb: 'Miglianti',
    rb: 'Ietro',
    lm: 'Landucci',
    lcm: 'Lucarelli',
    rcm: 'Saviozzi',
    rm: 'Ribechini',
    lst: 'Paoletti',
    rst: 'Ghizzani',
  });
  // Combined mid stagger: wide mids higher, central pair slightly deeper.
  combined[5] = { ...combined[5], top: '52%', left: '82%' }; // Landucci (LM)
  combined[6] = { ...combined[6], top: '42%', left: '62%' }; // Lucarelli (LCM)
  combined[7] = { ...combined[7], top: '42%', left: '38%' }; // Saviozzi (RCM)
  combined[8] = { ...combined[8], top: '52%', left: '18%' }; // Ribechini (RM)

  pisa.starters = combined;
  pisa.scoutedFormations = [
    {
      id: 'pisa-vs-perugia',
      label: { en: 'vs Perugia', it: 'vs Perugia' },
      system: '4-4-2',
      players: pisa442({
        gk: 'Paolini',
        lb: 'Serafini',
        lcb: 'Bendinelli',
        rcb: 'Lenzoni',
        rb: 'Bernardini',
        lm: 'Lucarelli',
        lcm: 'Menicucci',
        rcm: 'Saviozzi',
        rm: 'Ribechini',
        lst: 'Mocanu',
        rst: 'Ghizzani',
      }),
      notes: {
        en: 'Subs: Mainardi 57′ (Lucarelli), Landucci 57′ (Menicucci), Paoletti 71′ (Ghizzani), Masini 82′ (Lenzoni), Neri 82′ (Ribechini).',
        it: 'Sub: Mainardi 57′ (Lucarelli), Landucci 57′ (Menicucci), Paoletti 71′ (Ghizzani), Masini 82′ (Lenzoni), Neri 82′ (Ribechini).',
      },
    },
    {
      id: 'pisa-vs-frosinone',
      label: { en: 'vs Frosinone', it: 'vs Frosinone' },
      system: '4-4-2',
      players: pisa442({
        gk: 'Paolini', // // from Perugia
        lb: 'Minisini', // X (was Serafini)
        lcb: 'Bendinelli', // //
        rcb: 'Miglianti', // X (was Lenzoni)
        rb: 'Ietro', // X (was Bernardini)
        lm: 'Lucarelli', // //
        lcm: 'Landucci', // X (was Menicucci)
        rcm: 'Saviozzi', // //
        rm: 'Ribechini', // //
        lst: 'Paoletti', // X (was Mocanu)
        rst: 'Ghizzani', // //
      }),
      notes: {
        en: 'Subs: Menicucci 55′ (Paoletti), Mainardi ~53–55′ (Ribechini), Serafini 65′ (Minisini), Masini 65′ (Ghizzani), Haidara 75′ (Landucci).',
        it: 'Sub: Menicucci 55′ (Paoletti), Mainardi ~53–55′ (Ribechini), Serafini 65′ (Minisini), Masini 65′ (Ghizzani), Haidara 75′ (Landucci).',
      },
    },
    {
      id: 'pisa-vs-spezia',
      label: { en: 'vs Spezia', it: 'vs Spezia' },
      system: '4-4-2',
      players: pisa442({
        gk: 'Paolini', // // from Frosinone
        lb: 'Minisini', // //
        lcb: 'Bendinelli', // //
        rcb: 'Miglianti', // //
        rb: 'Ietro', // //
        lm: 'Ribechini', // X (was Lucarelli; Ribechini shifts left)
        lcm: 'Landucci', // // (started Frosinone instead of Menicucci)
        rcm: 'Saviozzi', // // (all three games)
        rm: 'Mainardi', // X (was Ribechini on the right)
        lst: 'Paoletti', // //
        rst: 'Ghizzani', // //
      }),
      notes: {
        en: 'Subs: Menicucci 46′ (Landucci), Haidara 56′ (Paoletti), ~58′ (Ribechini), Masini 72′ (Mainardi), Neri 75′ (Bendinelli).',
        it: 'Sub: Menicucci 46′ (Landucci), Haidara 56′ (Paoletti), ~58′ (Ribechini), Masini 72′ (Mainardi), Neri 75′ (Bendinelli).',
      },
    },
    {
      id: 'pisa-combined-xi',
      label: {
        en: 'Combined XI (appearances)',
        it: 'Combined XI (presenze)',
      },
      system: '4-4-2',
      players: combined,
      notes: {
        en: 'Built from minutes / starts across Perugia, Frosinone, Spezia.',
        it: 'Costruita su minuti / titolarità contro Perugia, Frosinone, Spezia.',
      },
    },
  ];
  pisa.substitutes = [
    { name: 'Masini', position: 'Difensore / utilità' },
    { name: 'Mainardi', position: 'Esterno', birthYear: 2008, preferredFoot: 'Destro', heightCm: 187 },
    { name: 'Haidara', position: 'Attaccante', birthYear: 2009, preferredFoot: 'Destro' },
    { name: 'Neri', position: 'Difensore', birthYear: 2009, preferredFoot: 'Destro', heightCm: 187 },
  ];
  pisa.squad = [
    {
      name: 'Marini',
      position: 'Attaccante',
      birthYear: 2009,
      preferredFoot: 'Ambidestro',
      heightCm: 192,
    },
    {
      name: 'Mocanu',
      position: 'Attaccante',
      birthYear: 2008,
      preferredFoot: 'Destro',
      heightCm: 187,
    },
    {
      name: 'Paolini',
      position: 'Portiere',
      birthYear: 2009,
      preferredFoot: 'Destro',
      heightCm: 184,
      isGk: true,
    },
    {
      name: 'Ietro',
      position: 'Terzino Dx',
      birthYear: 2009,
      preferredFoot: 'Ambi',
      heightCm: 178,
    },
    {
      name: 'Bernardini',
      position: 'Terzino Dx',
      birthYear: 2009,
      preferredFoot: 'Destro',
    },
    {
      name: 'Miglianti',
      position: 'Difensore',
      birthYear: 2008,
      preferredFoot: 'Destro',
      heightCm: 181,
    },
    {
      name: 'Lenzoni',
      position: 'Difensore',
      birthYear: 2008,
      preferredFoot: 'Destro',
      heightCm: 184,
    },
    {
      name: 'Bendinelli',
      position: 'Difensore',
      birthYear: 2008,
      preferredFoot: 'Destro',
      heightCm: 187,
    },
    {
      name: 'Neri',
      position: 'Difensore',
      birthYear: 2009,
      preferredFoot: 'Destro',
      heightCm: 187,
    },
    {
      name: 'Serafini',
      position: 'Terzino Sx',
      birthYear: 2009,
      preferredFoot: 'Sinistro',
      heightCm: 182,
    },
    {
      name: 'Minisini',
      position: 'Terzino Sx',
      birthYear: 2009,
      preferredFoot: 'Sinistro',
      heightCm: 182,
    },
    {
      name: 'Menicucci',
      position: 'Centrocampista',
      birthYear: 2008,
      preferredFoot: 'Destro',
      heightCm: 174,
    },
    {
      name: 'Landucci',
      position: 'Centrocampista',
      birthYear: 2008,
      preferredFoot: 'Destro',
      heightCm: 184,
    },
    {
      name: 'Saviozzi',
      position: 'Centrocampista',
      birthYear: 2009,
      preferredFoot: 'Destro',
      heightCm: 180,
    },
    {
      name: 'Lucarelli',
      position: 'Esterno',
      birthYear: 2009,
      preferredFoot: 'Destro',
    },
    {
      name: 'Ribechini',
      position: 'Esterno',
      birthYear: 2008,
      preferredFoot: 'Destro',
      heightCm: 170,
    },
    {
      name: 'Mainardi',
      position: 'Esterno',
      birthYear: 2008,
      preferredFoot: 'Destro',
      heightCm: 187,
    },
    {
      name: 'Haidara',
      position: 'Attaccante',
      birthYear: 2009,
      preferredFoot: 'Destro',
    },
    {
      name: 'Ghizzani',
      position: 'Attaccante',
      birthYear: 2009,
      preferredFoot: 'Destro',
      heightCm: 174,
    },
    {
      name: 'Paoletti',
      position: 'Attaccante',
      birthYear: 2009,
      preferredFoot: 'Destro',
      heightCm: 181,
    },
  ];
}

/** Perugia XI vs Pisa — team sheet 04.09.2026 (Alfredo Pagni). */
const perugia = OPPONENTS.find((o) => o.id === 'perugia');
if (perugia) {
  const vsPisa = perugia4141({
    gk: 'Strappini',
    lb: 'Bevanati',
    lcb: 'Peruzzi',
    rcb: 'Cesarini',
    rb: 'Buonafede',
    cdm: 'Malfatti',
    lm: 'Ciani',
    lcm: 'Perugini',
    rcm: 'Vanni',
    rm: 'Merico',
    st: 'Sheji',
  });
  perugia.formationSystem = '1-4-1-4-1';
  perugia.starters = vsPisa;
  perugia.scoutedFormations = [
    {
      id: 'perugia-vs-pisa',
      label: { en: 'vs Pisa', it: 'vs Pisa' },
      system: '4-1-4-1',
      players: vsPisa,
      notes: {
        en: 'Subs: Raffaelli 65′ (Merico), Ximenez 65′ (Vanni), Giambarveri 74′ (Buonafede), Calva 89′ (Sheji), Pierangelini 89′ (Perugini).',
        it: 'Sub: Raffaelli 65′ (Merico), Ximenez 65′ (Vanni), Giambarveri 74′ (Buonafede), Calva 89′ (Sheji), Pierangelini 89′ (Perugini).',
      },
    },
  ];
  perugia.squad = [
    { number: 1, name: 'Strappini', position: 'GK', isGk: true, birthYear: 2008 },
    { number: 2, name: 'Buonafede', position: 'RB', birthYear: 2008 },
    { number: 3, name: 'Bevanati', position: 'LB', birthYear: 2008 },
    { number: 4, name: 'Malfatti', position: 'CDM', birthYear: 2008 },
    { number: 5, name: 'Peruzzi', position: 'CB', birthYear: 2008 },
    { number: 6, name: 'Cesarini', position: 'CB', birthYear: 2008 },
    { number: 7, name: 'Merico', position: 'RW', birthYear: 2008 },
    { number: 8, name: 'Perugini', position: 'CM', birthYear: 2008 },
    { number: 9, name: 'Sheji', position: 'ST', birthYear: 2008 },
    { number: 10, name: 'Vanni', position: 'CM', birthYear: 2008 },
    { number: 11, name: 'Ciani', position: 'LW', birthYear: 2008 },
    { number: 12, name: 'Piccini', position: 'GK', isGk: true, birthYear: 2009 },
    { number: 13, name: 'Ragni', birthYear: 2009 },
    { number: 14, name: 'Olimpieri', birthYear: 2009 },
    { number: 15, name: 'Pierangelini', birthYear: 2009 },
    { number: 16, name: 'Iachini', birthYear: 2009 },
    { number: 17, name: 'Giambarveri', birthYear: 2008 },
    { number: 18, name: 'Ximenez', birthYear: 2008 },
    { number: 19, name: 'Raffaelli', birthYear: 2009 },
    { number: 20, name: 'Calva', birthYear: 2009 },
    { number: 21, name: 'Di Salvatore', birthYear: 2008 },
    { number: 22, name: 'Organai', position: 'GK', isGk: true, birthYear: 2010 },
    { number: 23, name: 'Ciarapica', birthYear: 2009 },
  ];
}

/** Reference tapes from Vimeo Avversari folders (synced manually from folder uploads). */
function attachReferencePack(
  opponentId: string,
  matchSlug: string,
  references: OppositionOpponent['fixturePacks'][string]['referenceMatches'],
  reportItems: OppositionOpponent['fixturePacks'][string]['reportItems'] = []
) {
  const opponent = OPPONENTS.find((o) => o.id === opponentId);
  if (!opponent) return;
  const prev = opponent.fixturePacks[matchSlug];
  opponent.fixturePacks[matchSlug] = {
    referenceMatches: references,
    reportItems: reportItems.length
      ? reportItems
      : prev?.reportItems ?? [],
    strengthsWeaknesses:
      prev?.strengthsWeaknesses ?? EMPTY_STRENGTHS_WEAKNESSES,
  };
}

attachReferencePack(
  'avellino',
  '2026-09-05_campionato-avellino-vs-u19',
  [
    {
      id: 'avellino-ref-canosa',
      title: {
        en: 'Canosa vs Avellino 7–1',
        it: 'Canosa vs Avellino 7–1',
      },
      competition: {
        en: 'Friendly',
        it: 'Amichevole',
      },
      score: '7–1',
      videoFile: 'https://vimeo.com/1221765516/20c5bc9e45',
    },
    {
      id: 'avellino-ref-napoli-first-team',
      title: {
        en: 'Napoli vs Avellino 0–2',
        it: 'Napoli vs Avellino 0–2',
      },
      competition: {
        en: 'First-team friendly',
        it: 'Amichevole prima squadra',
      },
      score: '0–2',
      videoFile: 'https://vimeo.com/1232592955/7d4705db6b',
    },
  ],
  [
    {
      id: 'avellino-studio-report',
      title: {
        en: 'Studio Avellino SSCN',
        it: 'Studio Avellino SSCN',
      },
      description: {
        en: 'Opposition studio report (Avversari → Studio Report).',
        it: 'Studio report avversario (Avversari → Studio Report).',
      },
      videoFile: 'https://vimeo.com/1223960715/f04ae7a909',
      tags: ['vimeo', 'opposition', 'studio-report'],
    },
  ]
);

attachReferencePack(
  'catanzaro',
  '2026-09-12_campionato-u19-vs-catanzaro',
  [
  {
    id: 'catanzaro-ref-latina',
    title: {
      en: 'Catanzaro vs Latina 2–0',
      it: 'Catanzaro vs Latina 2–0',
    },
    competition: {
      en: 'Primavera 2 · Matchday 1',
      it: 'Primavera 2 · Giornata 1',
    },
    score: '2–0',
    date: '2026-09-05',
    videoFile: 'https://vimeo.com/1224461888/2521a1a4f1',
  },
  {
    id: 'catanzaro-ref-salernitana',
    title: {
      en: 'Salernitana vs Catanzaro U19 3–0',
      it: 'Salernitana vs Catanzaro U19 3–0',
    },
    competition: {
      en: 'U19 reference',
      it: 'Riferimento U19',
    },
    score: '3–0',
    videoFile: 'https://vimeo.com/1218053897/6fa1a75c8c',
  },
  {
    id: 'catanzaro-ref-avellino',
    title: {
      en: 'Catanzaro vs Avellino 1–3',
      it: 'Catanzaro vs Avellino 1–3',
    },
    competition: {
      en: 'Primavera 2 · Matchday 24 (Girone C)',
      it: 'Primavera 2 · Giornata 24 (Girone C)',
    },
    score: '1–3',
    videoFile: 'https://vimeo.com/1218078567/7be6470e66',
  },
  ],
  [
    {
      id: 'catanzaro-studio-report',
      title: {
        en: 'Studio Catanzaro',
        it: 'Studio Catanzaro',
      },
      description: {
        en: 'Opposition studio report (Avversari → Studio Report).',
        it: 'Studio report avversario (Avversari → Studio Report).',
      },
      videoFile: 'https://vimeo.com/1225651608/524a5457e3',
      tags: ['vimeo', 'opposition', 'studio-report'],
    },
  ]
);

{
  const catanzaro = OPPONENTS.find((o) => o.id === 'catanzaro');
  if (catanzaro) {
    catanzaro.clips = [
      {
        id: 'catanzaro-pellegrini-attacco',
        title: {
          en: 'Pellegrini — Attack',
          it: 'Pellegrini — Attacco',
        },
        videoFile: 'https://vimeo.com/1225440473/c8f92a4e75',
        section: 'last-30m',
        tags: ['vimeo', 'opposition', 'individual'],
      },
      {
        id: 'catanzaro-pio-greco-attacco',
        title: {
          en: 'Pio Greco — Attack',
          it: 'Pio Greco — Attacco',
        },
        videoFile: 'https://vimeo.com/1225440474/30b43e7036',
        section: 'last-30m',
        tags: ['vimeo', 'opposition', 'individual'],
      },
      {
        id: 'catanzaro-cesnauskis-report',
        title: {
          en: 'Cesnauskis — Individual report',
          it: 'Cesnauskis — Report individuale',
        },
        videoFile: 'https://vimeo.com/1225440475/eb642e5f69',
        section: 'last-30m',
        tags: ['vimeo', 'opposition', 'individual'],
      },
    ];
  }
}

attachReferencePack('pisa', '2026-10-10_campionato-u19-vs-pisa', [
  {
    id: 'pisa-ref-perugia',
    title: {
      en: 'Pisa vs Perugia 2–3',
      it: 'Pisa vs Perugia 2–3',
    },
    competition: {
      en: 'Reference',
      it: 'Riferimento',
    },
    score: '2–3',
    videoFile: 'https://vimeo.com/1224195986/18554068c6',
  },
  {
    id: 'pisa-ref-frosinone',
    title: {
      en: 'Frosinone vs Pisa 2–3',
      it: 'Frosinone vs Pisa 2–3',
    },
    competition: {
      en: 'Primavera 2 · Matchday 2',
      it: 'Primavera 2 · Giornata 2',
    },
    score: '2–3',
    videoFile: 'https://vimeo.com/1228617722/57b07ab4e9',
  },
  {
    id: 'pisa-ref-spezia',
    title: {
      en: 'Pisa vs Spezia 0–3',
      it: 'Pisa vs Spezia 0–3',
    },
    competition: {
      en: 'Primavera 2 · Matchday 3',
      it: 'Primavera 2 · Giornata 3',
    },
    score: '0–3',
    videoFile: 'https://vimeo.com/1228617723/8be1a3eb32',
  },
], [
  {
    id: 'pisa-studio-report',
    title: {
      en: 'Studio Pisa',
      it: 'Studio Pisa',
    },
    description: {
      en: 'Opposition studio report (Avversari → Studio Report).',
      it: 'Studio report avversario (Avversari → Studio Report).',
    },
    videoFile: 'https://vimeo.com/1233725684/232bbbd0f3',
    tags: ['vimeo', 'opposition', 'studio-report'],
  },
]);

/** First-leg (campionato) Spezia pack only — not Coppa / return. */
attachReferencePack('spezia', '2026-10-24_campionato-u19-vs-spezia', [
  {
    id: 'spezia-ref-pisa',
    title: {
      en: 'Pisa vs Spezia 0–3',
      it: 'Pisa vs Spezia 0–3',
    },
    competition: {
      en: 'Primavera 2 · Matchday 3',
      it: 'Primavera 2 · Giornata 3',
    },
    score: '0–3',
    videoFile: 'https://vimeo.com/1228617723/8be1a3eb32',
  },
  {
    id: 'spezia-ref-monopoli',
    title: {
      en: 'Spezia vs Monopoli 0–2',
      it: 'Spezia vs Monopoli 0–2',
    },
    competition: {
      en: 'Primavera 2 · Matchday 4',
      it: 'Primavera 2 · Giornata 4',
    },
    score: '0–2',
    videoFile: 'https://vimeo.com/1235994929/30860268db',
  },
]);

attachReferencePack('monopoli', '2026-10-31_campionato-monopoli-vs-u19', [
  {
    id: 'monopoli-ref-spezia',
    title: {
      en: 'Spezia vs Monopoli 0–2',
      it: 'Spezia vs Monopoli 0–2',
    },
    competition: {
      en: 'Primavera 2 · Matchday 4',
      it: 'Primavera 2 · Giornata 4',
    },
    score: '0–2',
    videoFile: 'https://vimeo.com/1235994929/30860268db',
  },
]);

attachReferencePack(
  'bari',
  '2026-10-17_campionato-bari-vs-u19',
  [
    {
      id: 'bari-ref-salernitana',
      title: {
        en: 'Salernitana vs Bari 0–4',
        it: 'Salernitana vs Bari 0–4',
      },
      competition: {
        en: 'Reference',
        it: 'Riferimento',
      },
      score: '0–4',
      videoFile: 'https://vimeo.com/1235611592/1c16123127',
    },
    {
      id: 'bari-ref-palermo',
      title: {
        en: 'Palermo vs Bari 2–2',
        it: 'Palermo vs Bari 2–2',
      },
      competition: {
        en: 'Primavera 2 · Matchday 3',
        it: 'Primavera 2 · Giornata 3',
      },
      score: '2–2',
      videoFile: 'https://vimeo.com/1235614846/7346b8ba76',
    },
    {
      id: 'bari-ref-palermo-coppa',
      title: {
        en: 'Bari vs Palermo 3–2',
        it: 'Bari vs Palermo 3–2',
      },
      competition: {
        en: 'Coppa Italia Primavera',
        it: 'Coppa Italia Primavera',
      },
      score: '3–2',
      videoFile: 'https://vimeo.com/1230878196/46f5b3f40c',
    },
    {
      id: 'bari-ref-ascoli',
      title: {
        en: 'Bari vs Ascoli 2–1',
        it: 'Bari vs Ascoli 2–1',
      },
      competition: {
        en: 'Primavera 2 · Matchday 2',
        it: 'Primavera 2 · Giornata 2',
      },
      score: '2–1',
      videoFile: 'https://vimeo.com/1226442948/3870ec7bac',
    },
  ],
  [
    {
      id: 'bari-studio-report',
      title: {
        en: 'Studio Bari',
        it: 'Studio Bari',
      },
      description: {
        en: 'Opposition studio report (Avversari → Studio Report).',
        it: 'Studio report avversario (Avversari → Studio Report).',
      },
      videoFile: 'https://vimeo.com/1236350398/bbbe7d7a75',
      tags: ['vimeo', 'opposition', 'studio-report'],
    },
  ]
);

attachReferencePack('villarreal', '2026-10-13_uyl-villarreal-vs-u19', [
  {
    id: 'villarreal-ref-castellon',
    title: {
      en: 'Villarreal vs Castellón 4–1',
      it: 'Villarreal vs Castellón 4–1',
    },
    competition: {
      en: 'Reference',
      it: 'Riferimento',
    },
    score: '4–1',
    videoFile: 'https://vimeo.com/1234860406/e1b875d5e4',
  },
  {
    id: 'villarreal-ref-murcia',
    title: {
      en: 'Villarreal vs Murcia 2–1',
      it: 'Villarreal vs Murcia 2–1',
    },
    competition: {
      en: 'Reference',
      it: 'Riferimento',
    },
    score: '2–1',
    videoFile: 'https://vimeo.com/1230868725/0e86e46065',
  },
  {
    id: 'villarreal-ref-elche',
    title: {
      en: 'Villarreal vs Elche 0–3',
      it: 'Villarreal vs Elche 0–3',
    },
    competition: {
      en: 'Reference',
      it: 'Riferimento',
    },
    score: '0–3',
    videoFile: 'https://vimeo.com/1230868731/d15bad2661',
  },
  {
    id: 'villarreal-ref-dortmund',
    title: {
      en: 'Borussia Dortmund vs Villarreal 2–3',
      it: 'Borussia Dortmund vs Villarreal 2–3',
    },
    competition: {
      en: 'Reference',
      it: 'Riferimento',
    },
    score: '2–3',
    videoFile: 'https://vimeo.com/1230868736/4cb23ac504',
  },
], [
  {
    id: 'villarreal-studio-report',
    title: {
      en: 'Studio Villarreal',
      it: 'Studio Villarreal',
    },
    description: {
      en: 'Opposition studio report (Avversari → Studio Report).',
      it: 'Studio report avversario (Avversari → Studio Report).',
    },
    videoFile: 'https://vimeo.com/1235111245/81b9fadd69',
    tags: ['vimeo', 'opposition', 'studio-report'],
  },
]);

attachReferencePack('bodo-glimt', '2026-10-20_uyl-u19-vs-bodo-glimt', [
  {
    id: 'bodo-ref-bayern',
    title: {
      en: 'Bayern Munich vs Bodø/Glimt 5–1',
      it: 'Bayern Monaco vs Bodø/Glimt 5–1',
    },
    competition: {
      en: 'Reference',
      it: 'Riferimento',
    },
    score: '5–1',
    videoFile: 'https://vimeo.com/1233037991/104b28fbfe',
  },
  {
    id: 'bodo-ref-bvb',
    title: {
      en: 'Bodø/Glimt vs Borussia Dortmund 0–5',
      it: 'Bodø/Glimt vs Borussia Dortmund 0–5',
    },
    competition: {
      en: 'Reference',
      it: 'Riferimento',
    },
    score: '0–5',
    videoFile: 'https://vimeo.com/1236007680/e9ec2c549c',
  },
]);

attachReferencePack(
  'ascoli',
  '2026-09-19_campionato-ascoli-vs-u19',
  [
    {
      id: 'ascoli-ref-spezia',
      title: {
        en: 'Ascoli vs Spezia',
        it: 'Ascoli vs Spezia',
      },
      competition: {
        en: 'Reference · First leg',
        it: 'Riferimento · Andata',
      },
      videoFile: 'https://vimeo.com/1225049015/95b818e419',
    },
    {
      id: 'ascoli-ref-bari',
      title: {
        en: 'Bari vs Ascoli',
        it: 'Bari vs Ascoli',
      },
      competition: {
        en: 'Primavera 2 · Matchday 2',
        it: 'Primavera 2 · Giornata 2',
      },
      videoFile: 'https://vimeo.com/1226442948/3870ec7bac',
    },
  ],
  [
    {
      id: 'ascoli-studio-report',
      title: {
        en: 'Studio Ascoli',
        it: 'Studio Ascoli',
      },
      description: {
        en: 'Opposition studio report (Avversari → Studio Report).',
        it: 'Studio report avversario (Avversari → Studio Report).',
      },
      videoFile: 'https://vimeo.com/1228007586/b5ac126223',
      tags: ['vimeo', 'opposition', 'studio-report'],
    },
  ]
);

attachReferencePack('porto', '2026-11-04_uyl-porto-vs-u19', [
  {
    id: 'porto-ref-man-city',
    title: {
      en: 'Porto vs Manchester City 3–1',
      it: 'Porto vs Manchester City 3–1',
    },
    competition: {
      en: 'UEFA Youth League reference',
      it: 'Riferimento UEFA Youth League',
    },
    score: '3–1',
    videoFile: 'https://vimeo.com/1225051128/cd33c8c29e',
  },
  {
    id: 'porto-ref-braga',
    title: {
      en: 'SC Braga vs Porto 2–4',
      it: 'SC Braga vs Porto 2–4',
    },
    competition: {
      en: 'UEFA Youth League reference',
      it: 'Riferimento UEFA Youth League',
    },
    score: '2–4',
    videoFile: 'https://vimeo.com/1235987474/ada586d7c0',
  },
]);

attachReferencePack('club-brugge', '2026-12-08_uyl-u19-vs-club-brugge', [
  {
    id: 'brugge-ref-inter',
    title: {
      en: 'Inter vs Club Brugge 1–1',
      it: 'Inter vs Club Brugge 1–1',
    },
    competition: {
      en: 'UEFA Youth League reference',
      it: 'Riferimento UEFA Youth League',
    },
    score: '1–1',
    videoFile: 'https://vimeo.com/1235985370/b1003a19f9',
  },
]);

attachReferencePack(
  'arsenal',
  '2026-09-09_uyl-u19-vs-arsenal',
  [
    {
      id: 'arsenal-ref-palace',
      title: {
        en: 'Arsenal vs Crystal Palace 1–1',
        it: 'Arsenal vs Crystal Palace 1–1',
      },
      competition: {
        en: 'Premier League 2',
        it: 'Premier League 2',
      },
      score: '1–1',
      videoFile: 'https://vimeo.com/1224049897/cdb30b3351',
    },
    {
      id: 'arsenal-ref-barnet',
      title: {
        en: 'Barnet vs Arsenal 5–1',
        it: 'Barnet vs Arsenal 5–1',
      },
      competition: {
        en: 'Reference',
        it: 'Riferimento',
      },
      score: '5–1',
      videoFile: 'https://vimeo.com/1223839016/ff3b231d33',
    },
    {
      id: 'arsenal-ref-bayern',
      title: {
        en: 'Arsenal vs Bayern 4–2',
        it: 'Arsenal vs Bayern 4–2',
      },
      competition: {
        en: 'Reference',
        it: 'Riferimento',
      },
      score: '4–2',
      videoFile: 'https://vimeo.com/1223838643/18bc3e6c10',
    },
  ],
  [
    {
      id: 'arsenal-studio-attacco-piazzati',
      title: {
        en: 'Arsenal Studio — Attack & Set Pieces',
        it: 'Arsenal Studio — Attacco e Piazzati',
      },
      description: {
        en: 'Opposition studio report: attacking phase and set pieces.',
        it: 'Studio report avversario: fase offensiva e palle inattive.',
      },
      videoFile: 'https://vimeo.com/1224890071/72edc06eb5',
      tags: ['vimeo', 'opposition', 'studio-report'],
    },
    {
      id: 'arsenal-studio-gk',      title: {
        en: 'Team Studio Arsenal (GK)',
        it: 'Team Studio Arsenal (GK)',
      },
      description: {
        en: 'Goalkeeper opposition studio.',
        it: 'Studio avversario portieri.',
      },
      videoFile: 'https://vimeo.com/1224464415/28961f4b09',
      tags: ['vimeo', 'opposition', 'studio-report', 'goalkeeper'],
    },
    {
      id: 'arsenal-annous-rigori',
      title: {
        en: 'Annous — Penalties',
        it: 'Annous — Rigori',
      },
      description: {
        en: 'Penalty clips (Annous).',
        it: 'Clip sui rigori (Annous).',
      },
      videoFile: 'https://vimeo.com/1224464440/56bc805fef',
      tags: ['vimeo', 'opposition', 'set-piece'],
    },
  ]
);

export function getAllOpponents(): OppositionOpponent[] {
  return [...OPPONENTS].sort((a, b) => a.shortName.localeCompare(b.shortName));
}

export function getOpponentsByCompetition(
  competitionId: OppositionCompetitionId
): OppositionOpponent[] {
  return getAllOpponents().filter((o) => o.competitions.includes(competitionId));
}

export function getOpponentBySlug(slug: string): OppositionOpponent | undefined {
  return OPPONENTS.find((o) => o.slug === slug);
}

export function getOurFixturesVsOpponent(opponent: OppositionOpponent) {
  const needle = opponent.shortName.toLowerCase();
  return getAllMatches()
    .filter(
      (m) =>
        m.homeTeam.toLowerCase() === needle ||
        m.awayTeam.toLowerCase() === needle
    )
    .sort((a, b) => a.date.localeCompare(b.date));
}

/**
 * How many reference-match slots to show for a fixture.
 * UYL + first 15 Primavera 2 games: 3 (theirs only).
 * Later Primavera 2 (return) / Coppa: 4 (includes “how we played them” slot).
 */
export function referenceMatchSlotLimit(
  match: Pick<MatchSummary, 'competitionId' | 'slug'> | null
): number {
  if (!match) return OPPOSITION_BASE_REFERENCE_MATCHES;
  if (match.competitionId === 'uefaYouthLeague') {
    return OPPOSITION_BASE_REFERENCE_MATCHES;
  }
  if (match.competitionId === 'primavera2') {
    const firstFifteen = getAllMatches()
      .filter((m) => m.competitionId === 'primavera2')
      .sort((a, b) => a.date.localeCompare(b.date) || a.slug.localeCompare(b.slug))
      .slice(0, 15);
    if (firstFifteen.some((m) => m.slug === match.slug)) {
      return OPPOSITION_BASE_REFERENCE_MATCHES;
    }
    return OPPOSITION_MAX_REFERENCE_MATCHES;
  }
  return OPPOSITION_MAX_REFERENCE_MATCHES;
}

export function isNapoliHomeVsOpponent(
  match: MatchSummary,
  opponent: OppositionOpponent
): boolean {
  return match.homeTeam.toLowerCase() !== opponent.shortName.toLowerCase();
}

export function todayIsoDate(): string {
  return new Date().toISOString().slice(0, 10);
}

/** Earliest upcoming official fixture vs a listed opponent. */
export function getNextOppositionTarget(today = todayIsoDate()): {
  opponent: OppositionOpponent;
  match: MatchSummary;
} | null {
  let best: { opponent: OppositionOpponent; match: MatchSummary } | null = null;
  for (const opponent of getAllOpponents()) {
    for (const match of getOurFixturesVsOpponent(opponent)) {
      if (match.date < today) continue;
      if (!best || match.date < best.match.date) {
        best = { opponent, match };
      }
    }
  }
  return best;
}
