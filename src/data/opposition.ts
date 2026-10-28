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

/** Empty 1-5-3-2 slots (wing-backs, back three, mid three, two strikers).
 * Pitch attacks downward: team-left = screen-right.
 */
export function placeholder532(teamId: string): PitchPlayer[] {
  return [
    { number: 1, name: 'GK', role: 'GK', teamId, isGk: true, top: '8%', left: '50%' },
    { number: 2, name: 'RWB', role: 'RWB', teamId, top: '32%', left: '10%' },
    { number: 5, name: 'RCB', role: 'RCB', teamId, top: '20%', left: '30%' },
    { number: 6, name: 'CB', role: 'CB', teamId, top: '18%', left: '50%' },
    { number: 4, name: 'LCB', role: 'LCB', teamId, top: '20%', left: '70%' },
    { number: 3, name: 'LWB', role: 'LWB', teamId, top: '32%', left: '90%' },
    { number: 8, name: 'RCM', role: 'RCM', teamId, top: '48%', left: '30%' },
    { number: 7, name: 'CM', role: 'CM', teamId, top: '44%', left: '50%' },
    { number: 10, name: 'LCM', role: 'LCM', teamId, top: '48%', left: '70%' },
    { number: 9, name: 'RS', role: 'RS', teamId, top: '74%', left: '40%' },
    { number: 11, name: 'LS', role: 'LS', teamId, top: '74%', left: '60%' },
  ];
}

/** Empty 1-3-5-2 slots (back three, wing-backs, mid three, two strikers).
 * Pitch attacks downward: team-left = screen-right.
 */
export function placeholder352(teamId: string): PitchPlayer[] {
  return [
    { number: 1, name: 'GK', role: 'GK', teamId, isGk: true, top: '8%', left: '50%' },
    { number: 5, name: 'RCB', role: 'RCB', teamId, top: '20%', left: '30%' },
    { number: 6, name: 'CB', role: 'CB', teamId, top: '18%', left: '50%' },
    { number: 4, name: 'LCB', role: 'LCB', teamId, top: '20%', left: '70%' },
    { number: 2, name: 'RWB', role: 'RWB', teamId, top: '44%', left: '10%' },
    { number: 3, name: 'LWB', role: 'LWB', teamId, top: '44%', left: '90%' },
    { number: 8, name: 'RCM', role: 'RCM', teamId, top: '50%', left: '32%' },
    { number: 7, name: 'CM', role: 'CM', teamId, top: '40%', left: '50%' },
    { number: 10, name: 'LCM', role: 'LCM', teamId, top: '50%', left: '68%' },
    { number: 9, name: 'RS', role: 'RS', teamId, top: '74%', left: '40%' },
    { number: 11, name: 'LS', role: 'LS', teamId, top: '74%', left: '60%' },
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
  if (key === '1-5-3-2' || key === '5-3-2') {
    return placeholder532(teamId);
  }
  if (key === '1-3-5-2' || key === '3-5-2') {
    return placeholder352(teamId);
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
  club('frosinone', 'Frosinone', ['primavera2'], '1-3-5-2'),
  club('latina', 'Latina', ['primavera2']),
  club('monopoli', 'Monopoli', ['primavera2'], '1-5-3-2'),
  club('palermo', 'Palermo', ['primavera2']),
  club('perugia', 'Perugia', ['primavera2']),
  club('pescara', 'Pescara', ['primavera2']),
  club('pisa', 'Pisa', ['primavera2'], '4-4-2'),
  club('salernitana', 'Salernitana', ['primavera2']),
  club('spezia', 'Spezia', ['primavera2', 'coppaItalia']),
  club('arsenal', 'Arsenal', ['uefaYouthLeague'], '1-4-2-3-1'),
  club('villarreal', 'Villarreal', ['uefaYouthLeague'], '1-3-4-2-1'),
  club('bodo-glimt', 'Bodø/Glimt', ['uefaYouthLeague'], '1-4-3-3'),
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

/**
 * Bodø/Glimt UEFA U19 — UEFA club squad + UYL MD1 Bayern / MD2 Dortmund XIs.
 * System 4-3-3; pitch attacks downward (team-right = screen-left).
 * Heights / preferred feet: video scouting (Bayern / BVB) + user notes where published.
 */
const bodo = OPPONENTS.find((o) => o.id === 'bodo-glimt');
if (bodo) {
  const bodo433 = (names: {
    gk: string;
    rb: string;
    rcb: string;
    lcb: string;
    lb: string;
    rcm: string;
    cm: string;
    lcm: string;
    rw: string;
    st: string;
    lw: string;
  }, nums: {
    gk: number;
    rb: number;
    rcb: number;
    lcb: number;
    lb: number;
    rcm: number;
    cm: number;
    lcm: number;
    rw: number;
    st: number;
    lw: number;
  }): PitchPlayer[] => [
    {
      number: nums.gk,
      name: names.gk,
      teamId: 'bodo-glimt',
      isGk: true,
      top: '8%',
      left: '50%',
    },
    { number: nums.rb, name: names.rb, teamId: 'bodo-glimt', top: '22%', left: '18%' },
    { number: nums.rcb, name: names.rcb, teamId: 'bodo-glimt', top: '20%', left: '38%' },
    { number: nums.lcb, name: names.lcb, teamId: 'bodo-glimt', top: '20%', left: '62%' },
    { number: nums.lb, name: names.lb, teamId: 'bodo-glimt', top: '22%', left: '82%' },
    { number: nums.rcm, name: names.rcm, teamId: 'bodo-glimt', top: '42%', left: '28%' },
    { number: nums.cm, name: names.cm, teamId: 'bodo-glimt', top: '40%', left: '50%' },
    { number: nums.lcm, name: names.lcm, teamId: 'bodo-glimt', top: '42%', left: '72%' },
    { number: nums.rw, name: names.rw, teamId: 'bodo-glimt', top: '68%', left: '18%' },
    { number: nums.st, name: names.st, teamId: 'bodo-glimt', top: '78%', left: '50%' },
    { number: nums.lw, name: names.lw, teamId: 'bodo-glimt', top: '68%', left: '82%' },
  ];

  const vsBayern = bodo433(
    {
      gk: 'Andersen',
      rb: 'Kolstad',
      rcb: 'Jenssen',
      lcb: 'Jaiteh',
      lb: 'Solbakken',
      rcm: 'Eliassen',
      cm: 'Yeboah',
      lcm: 'Ingilæ',
      rw: 'Leirvik',
      st: 'Strand',
      lw: 'Chooly',
    },
    {
      gk: 1,
      rb: 2,
      rcb: 3,
      lcb: 4,
      lb: 5,
      rcm: 18,
      cm: 7,
      lcm: 11,
      rw: 17,
      st: 9,
      lw: 21,
    }
  );

  /** MD2 Aspmyra — Käld at RW instead of Leirvik. */
  const vsDortmund = bodo433(
    {
      gk: 'Andersen',
      rb: 'Kolstad',
      rcb: 'Jenssen',
      lcb: 'Jaiteh',
      lb: 'Solbakken',
      rcm: 'Eliassen',
      cm: 'Yeboah',
      lcm: 'Ingilæ',
      rw: 'Käld',
      st: 'Strand',
      lw: 'Chooly',
    },
    {
      gk: 1,
      rb: 2,
      rcb: 3,
      lcb: 4,
      lb: 5,
      rcm: 18,
      cm: 7,
      lcm: 11,
      rw: 10,
      st: 9,
      lw: 21,
    }
  );

  bodo.formationSystem = '1-4-3-3';
  bodo.starters = vsDortmund;
  bodo.scoutedFormations = [
    {
      id: 'bodo-vs-bayern',
      label: {
        en: 'vs Bayern Munich (1–6)',
        it: 'vs Bayern Monaco (1–6)',
      },
      system: '4-3-3',
      players: vsBayern,
      notes: {
        en: 'UYL MD1, 10 Sep 2026 (UEFA 2049817 / TM 5047588). 4-3-3; Leirvik at RW. Goal: Chooly. Subs used: Alvsen, Setvik, Blix Olsen, Rasen, Remmen.',
        it: 'UYL gior. 1, 10 set 2026 (UEFA 2049817 / TM 5047588). 4-3-3; Leirvik a destra. Gol: Chooly. Sub: Alvsen, Setvik, Blix Olsen, Rasen, Remmen.',
      },
    },
    {
      id: 'bodo-vs-dortmund',
      label: {
        en: 'vs Borussia Dortmund (0–5)',
        it: 'vs Borussia Dortmund (0–5)',
      },
      system: '4-3-3',
      players: vsDortmund,
      notes: {
        en: 'UYL MD2, 14 Oct 2026 (UEFA 2049837 / TM 5047627). Same back five + mid three; Käld (#10) at RW. Most recent scouted XI.',
        it: 'UYL gior. 2, 14 ott 2026 (UEFA 2049837 / TM 5047627). Stessa difesa e mediani; Käld (#10) a destra. XI scoutata più recente.',
      },
    },
  ];
  bodo.squadDepth = {
    system: '1-4-3-3',
    note: {
      en: 'Last 2 UYL XIs (Bayern MD1, Dortmund MD2) mapped onto 4-3-3. Order = most starts in that slot. Short names on pitch; full names in the squad table. Heights/feet from video scouting (Bayern–Bodø / BVB) and confirmed notes — see squad table.',
      it: 'Ultime 2 formazioni UYL (Bayern gior. 1, Dortmund gior. 2) mappate sul 4-3-3. Ordine = più partite in quel ruolo. Nomi corti sul campo; nomi completi in tabella. Altezze/piede da scouting video (Bayern–Bodø / BVB) e note confermate — vedi tabella rosa.',
    },
    slots: [
      {
        role: 'GK',
        top: '10%',
        left: '50%',
        players: [{ name: 'Andersen', starts: 2 }],
      },
      {
        role: 'RB',
        top: '26%',
        left: '18%',
        players: [{ name: 'Kolstad', starts: 2 }],
      },
      {
        role: 'RCB',
        top: '24%',
        left: '38%',
        players: [{ name: 'Jenssen', starts: 2 }],
      },
      {
        role: 'LCB',
        top: '24%',
        left: '62%',
        players: [{ name: 'Jaiteh', starts: 2 }],
      },
      {
        role: 'LB',
        top: '26%',
        left: '82%',
        players: [{ name: 'Solbakken', starts: 2 }],
      },
      {
        role: 'RCM',
        top: '45%',
        left: '28%',
        players: [{ name: 'Eliassen', starts: 2 }],
      },
      {
        role: 'CM',
        top: '42%',
        left: '50%',
        players: [{ name: 'Yeboah', starts: 2 }],
      },
      {
        role: 'LCM',
        top: '45%',
        left: '72%',
        players: [{ name: 'Ingilæ', starts: 2 }],
      },
      {
        role: 'RW',
        top: '70%',
        left: '18%',
        players: [
          { name: 'Leirvik', starts: 1 },
          { name: 'Käld', starts: 1 },
        ],
      },
      {
        role: 'ST',
        top: '78%',
        left: '50%',
        players: [{ name: 'Strand', starts: 2 }],
      },
      {
        role: 'LW',
        top: '70%',
        left: '82%',
        players: [{ name: 'Chooly', starts: 2 }],
      },
    ],
  };
  /**
   * UEFA Youth League club squad (it.uefa.com/…/2611772) + TM match sheets.
   * Heights / preferred feet: rosa_piede_video.csv (video Bayern–Bodø / BVB + notes).
   */
  bodo.squad = [
    {
      number: 1,
      name: 'Martin Lund Andersen',
      position: 'GK',
      isGk: true,
      birthYear: 2008,
      preferredFoot: 'Destro',
    },
    {
      number: 12,
      name: 'Petter Østensen Griegel',
      position: 'GK',
      isGk: true,
      birthYear: 2009,
    },
    {
      number: 2,
      name: 'Sivert Kolstad',
      position: 'RB',
      birthYear: 2007,
      heightCm: 177,
      preferredFoot: 'Destro',
    },
    {
      number: 3,
      name: 'Johannes Linaker Jenssen',
      position: 'CB',
      birthYear: 2009,
      heightCm: 186,
      preferredFoot: 'Destro',
    },
    {
      number: 4,
      name: 'Matias Bobo Høgsæt Jaiteh',
      position: 'CB',
      birthYear: 2008,
      preferredFoot: 'Ambidestro',
    },
    {
      number: 5,
      name: 'Tobias Solbakken',
      position: 'LB',
      birthYear: 2009,
      heightCm: 179,
      preferredFoot: 'Destro',
    },
    {
      number: 15,
      name: 'Mathias Blix Olsen',
      position: 'CB',
      birthYear: 2007,
      heightCm: 185,
      preferredFoot: 'Destro',
    },
    {
      number: 25,
      name: 'Isak Bakke Gusjås',
      position: 'CB',
      birthYear: 2010,
      preferredFoot: 'Destro',
    },
    {
      number: 24,
      name: 'Jonathan Karlsen Almås',
      position: 'DF',
      birthYear: 2010,
    },
    {
      number: 7,
      name: 'Levi Monsen Yeboah',
      position: 'CM',
      birthYear: 2010,
      preferredFoot: 'Destro',
    },
    {
      number: 10,
      name: 'Milton Käld',
      position: 'RW',
      birthYear: 2010,
      preferredFoot: 'Destro',
    },
    {
      number: 11,
      name: 'Teo Ingilæ',
      position: 'CM',
      birthYear: 2007,
      heightCm: 170,
      preferredFoot: 'Ambidestro',
    },
    {
      number: 16,
      name: 'Martin Dobloug Rasen',
      position: 'ST',
      birthYear: 2008,
      preferredFoot: 'Destro',
    },
    {
      number: 18,
      name: 'Erling Eliassen',
      position: 'CM',
      birthYear: 2009,
      preferredFoot: 'Destro',
    },
    {
      number: 34,
      name: 'Sahad Sami Salih',
      position: 'CM',
    },
    {
      number: 23,
      name: 'Romario Franco Remmen',
      position: 'CM',
      birthYear: 2010,
      preferredFoot: 'Destro',
    },
    {
      number: 36,
      name: 'William Myre Theting',
      position: 'CM',
      birthYear: 2010,
    },
    {
      number: 9,
      name: 'Jakob Strand',
      position: 'ST',
      birthYear: 2009,
      heightCm: 199,
      preferredFoot: 'Destro',
    },
    {
      number: 17,
      name: 'Lucas Leirvik',
      position: 'RW',
      birthYear: 2009,
      preferredFoot: 'Destro',
    },
    {
      number: 19,
      name: 'Isak Erlend Alvsen',
      position: 'RW',
      birthYear: 2008,
      heightCm: 171,
      preferredFoot: 'Destro',
    },
    {
      number: 20,
      name: 'Mathias Nikolai Setvik',
      position: 'ST',
      birthYear: 2010,
      preferredFoot: 'Destro',
    },
    {
      number: 21,
      name: 'Hindrin Najah Chooly',
      position: 'LW',
      birthYear: 2008,
      heightCm: 169,
      preferredFoot: 'Destro',
    },
    {
      number: 30,
      name: 'Matheo Martins',
      position: 'ST',
      birthYear: 2009,
    },
  ];
}

/** Porto UEFA U19 — UEFA Youth League club squad (it.uefa.com/…/2605454). */
const porto = OPPONENTS.find((o) => o.id === 'porto');
if (porto) {
  porto.squad = [
    {
      name: 'Francisco Mendes',
      position: 'GK',
      isGk: true,
      birthYear: 2009,
      heightCm: 180,
      preferredFoot: 'Destro',
    },
    {
      name: 'Antoni Nikolov',
      position: 'GK',
      isGk: true,
      birthYear: 2008,
      preferredFoot: 'Destro',
    },
    {
      name: 'Hjalte Froholdt',
      position: 'DF',
      birthYear: 2008,
      heightCm: 183,
      preferredFoot: 'Destro',
    },
    {
      name: 'Rodrigo Teixeira',
      position: 'DF',
      birthYear: 2009,
      preferredFoot: 'Sinistro',
    },
    {
      name: 'José Domingues',
      position: 'DF',
      birthYear: 2008,
      heightCm: 172,
      preferredFoot: 'Sinistro',
    },
    {
      name: 'Rodrigo Morais',
      position: 'DF',
      birthYear: 2009,
      heightCm: 185,
      preferredFoot: 'Ambidestro',
    },
    {
      name: 'Salvador Gomes',
      position: 'DF',
      birthYear: 2008,
      heightCm: 186,
      preferredFoot: 'Destro',
    },
    {
      name: 'Martim Cunha',
      position: 'DF',
      birthYear: 2007,
      heightCm: 182,
      preferredFoot: 'Sinistro',
    },
    {
      name: 'Eirik Granaas',
      position: 'MF',
      birthYear: 2010,
      heightCm: 178,
      preferredFoot: 'Destro',
    },
    {
      name: 'Tiago Silva',
      position: 'MF',
      birthYear: 2007,
      heightCm: 180,
      preferredFoot: 'Destro',
    },
    {
      name: 'Bernardo Lima',
      position: 'MF',
      birthYear: 2008,
      heightCm: 182,
      preferredFoot: 'Destro',
    },
    {
      name: 'João Abreu',
      position: 'MF',
      birthYear: 2008,
      heightCm: 168,
      preferredFoot: 'Destro',
    },
    {
      name: 'Gonçalo Oliveira',
      position: 'MF',
      birthYear: 2008,
      heightCm: 170,
      preferredFoot: 'Destro',
    },
    {
      name: 'Duarte Cunha',
      position: 'FW',
      birthYear: 2008,
      heightCm: 175,
      preferredFoot: 'Destro',
    },
    {
      name: 'Eduardo Ferreira',
      position: 'FW',
      birthYear: 2008,
      heightCm: 185,
      preferredFoot: 'Destro',
    },
    {
      name: 'Cardoso Varela',
      position: 'FW',
      birthYear: 2008,
      heightCm: 183,
      preferredFoot: 'Destro',
    },
    {
      name: 'André Miranda',
      position: 'FW',
      birthYear: 2007,
      heightCm: 180,
      preferredFoot: 'Sinistro',
    },
    {
      name: 'Tcherno Jamanca',
      position: 'FW',
      birthYear: 2009,
      heightCm: 179,
      preferredFoot: 'Destro',
    },
    {
      name: 'Gabriel Ferreira De Carvalho',
      position: 'FW',
      birthYear: 2008,
      heightCm: 173,
      preferredFoot: 'Ambidestro',
    },
    {
      name: 'Mateus Mide',
      position: 'FW',
      birthYear: 2008,
      heightCm: 176,
      preferredFoot: 'Ambidestro',
    },
    { name: 'Francisco Ferreira', position: 'DF', birthYear: 2009 },
    { name: 'Martim Chelmik', position: 'DF', birthYear: 2008 },
    { name: 'Domingos Muxito', position: 'FW', birthYear: 2009 },
    { name: 'Gonçalo Ribeiro', position: 'GK', isGk: true, birthYear: 2006 },
    { name: 'Marco Silva', position: 'DF', birthYear: 2008 },
    { name: 'Filipe Sousa', position: 'DF', birthYear: 2007 },
    { name: 'Yoan Pereira', position: 'DF', birthYear: 2008 },
    { name: 'Rafael Magalhães', position: 'DF', birthYear: 2008 },
    { name: 'Tomás Peixoto', position: 'FW', birthYear: 2008 },
    { name: 'Rúben Sousa Barbosa', position: 'FW', birthYear: 2008 },
    { name: 'Leonardo Manuel Fajardo Duarte', position: 'FW', birthYear: 2007 },
  ];
  const vsPsv: PitchPlayer[] = [
    { number: 1, name: 'Nikolov', teamId: 'porto', role: 'GK', isGk: true, top: '8%', left: '50%' },
    { number: 2, name: 'Froholdt', teamId: 'porto', role: 'RB', top: '24%', left: '20%' },
    { number: 4, name: 'Teixeira', teamId: 'porto', role: 'RCB', top: '24%', left: '40%' },
    { number: 3, name: 'Gomes', teamId: 'porto', role: 'LCB', top: '24%', left: '60%' },
    { number: 5, name: 'Domingues', teamId: 'porto', role: 'LB', top: '24%', left: '80%' },
    { number: 7, name: 'Carvalho', teamId: 'porto', role: 'RCM', top: '46%', left: '30%' },
    { number: 8, name: 'Lima', teamId: 'porto', role: 'CM', top: '46%', left: '50%' },
    { number: 6, name: 'T. Silva', teamId: 'porto', role: 'LCM', top: '46%', left: '70%' },
    { number: 10, name: 'Mide', teamId: 'porto', role: 'RW', top: '72%', left: '30%' },
    { number: 9, name: 'E. Ferreira', teamId: 'porto', role: 'ST', top: '72%', left: '50%' },
    { number: 11, name: 'D. Cunha', teamId: 'porto', role: 'LW', top: '72%', left: '70%' },
  ];
  const vsManCity: PitchPlayer[] = [
    { number: 1, name: 'Nikolov', teamId: 'porto', role: 'GK', isGk: true, top: '8%', left: '50%' },
    { number: 2, name: 'F. Ferreira', teamId: 'porto', role: 'RB', top: '24%', left: '20%' },
    { number: 4, name: 'Gomes', teamId: 'porto', role: 'RCB', top: '24%', left: '40%' },
    { number: 3, name: 'Chelmik', teamId: 'porto', role: 'LCB', top: '24%', left: '60%' },
    { number: 5, name: 'M. Cunha', teamId: 'porto', role: 'LB', top: '24%', left: '80%' },
    { number: 11, name: 'Granaas', teamId: 'porto', role: 'RM', top: '46%', left: '20%' },
    { number: 8, name: 'Lima', teamId: 'porto', role: 'RCM', top: '46%', left: '40%' },
    { number: 6, name: 'T. Silva', teamId: 'porto', role: 'LCM', top: '46%', left: '60%' },
    { number: 10, name: 'Mide', teamId: 'porto', role: 'LM', top: '46%', left: '80%' },
    { number: 7, name: 'Varela', teamId: 'porto', role: 'RS', top: '72%', left: '40%' },
    { number: 9, name: 'E. Ferreira', teamId: 'porto', role: 'LS', top: '72%', left: '60%' },
  ];
  const vsBetis: PitchPlayer[] = [
    { number: 1, name: 'Ribeiro', teamId: 'porto', role: 'GK', isGk: true, top: '8%', left: '50%' },
    { number: 2, name: 'M. Silva', teamId: 'porto', role: 'RB', top: '24%', left: '20%' },
    { number: 3, name: 'F. Sousa', teamId: 'porto', role: 'RCB', top: '24%', left: '40%' },
    { number: 4, name: 'Chelmik', teamId: 'porto', role: 'LCB', top: '24%', left: '60%' },
    { number: 5, name: 'Pereira', teamId: 'porto', role: 'LB', top: '24%', left: '80%' },
    { number: 8, name: 'Lima', teamId: 'porto', role: 'RCM', top: '46%', left: '30%' },
    { number: 6, name: 'T. Silva', teamId: 'porto', role: 'CM', top: '46%', left: '50%' },
    { number: 10, name: 'Mide', teamId: 'porto', role: 'LCM', top: '46%', left: '70%' },
    { number: 7, name: 'D. Cunha', teamId: 'porto', role: 'RW', top: '72%', left: '30%' },
    { number: 9, name: 'E. Ferreira', teamId: 'porto', role: 'ST', top: '72%', left: '50%' },
    { number: 11, name: 'Abreu', teamId: 'porto', role: 'LW', top: '72%', left: '70%' },
  ];
  porto.formationSystem = '1-4-3-3';
  porto.starters = vsPsv;
  porto.scoutedFormations = [
    {
      id: 'porto-vs-psv',
      label: { en: 'vs PSV (3–1)', it: 'vs PSV (3–1)' },
      system: '4-3-3',
      players: vsPsv,
      notes: {
        en: "UYL MD3, 20 Oct 2026, home, Porto 3–1 PSV (UEFA 2049845). UEFA 4-3-3: Carvalho (#7) RCM, Mide (#10) RW, D. Cunha (#11) LW. Goals: E. Ferreira 33', Mide 49', E. Ferreira 90+3'; PSV: Ostrander 72' (pen.). Subs: Varela for Carvalho HT, Oliveira for Froholdt 61', Miranda for D. Cunha 72', Abreu for Mide 72', M. Cunha for Domingues 77'.",
        it: "UYL gior. 3, 20 ott 2026, casa, Porto 3–1 PSV (UEFA 2049845). 4-3-3 UEFA: Carvalho (#7) CC destro, Mide (#10) ala destra, D. Cunha (#11) ala sinistra. Gol: E. Ferreira 33', Mide 49', E. Ferreira 90+3'; PSV: Ostrander 72' (rig.). Sub: Varela per Carvalho INT, Oliveira per Froholdt 61', Miranda per D. Cunha 72', Abreu per Mide 72', M. Cunha per Domingues 77'.",
      },
    },
    {
      id: 'porto-vs-man-city',
      label: { en: 'vs Man City (3–1)', it: 'vs Man City (3–1)' },
      system: '4-4-2',
      players: vsManCity,
      notes: {
        en: "UYL MD1, 8 Sep 2026, home, Porto 3–1 Manchester City (UEFA 2049807). UEFA 4-4-2: Granaas (#11) RM, Mide (#10) LM, Varela (#7) and E. Ferreira (#9) up front. Goals: T. Silva 17' (pen.), Mide 43', Jamanca 82'; City: Lamb 73'. Subs: D. Cunha for Varela 61', Jamanca for E. Ferreira 68', Froholdt for F. Ferreira 68', Oliveira for Granaas 76', Muxito for Mide 76'.",
        it: "UYL gior. 1, 8 set 2026, casa, Porto 3–1 Manchester City (UEFA 2049807). 4-4-2 UEFA: Granaas (#11) esterno destro, Mide (#10) esterno sinistro, Varela (#7) ed E. Ferreira (#9) punte. Gol: T. Silva 17' (rig.), Mide 43', Jamanca 82'; City: Lamb 73'. Sub: D. Cunha per Varela 61', Jamanca per E. Ferreira 68', Froholdt per F. Ferreira 68', Oliveira per Granaas 76', Muxito per Mide 76'.",
      },
    },
    {
      id: 'porto-vs-real-betis',
      label: { en: 'vs Real Betis (0–5, 2025/26)', it: 'vs Real Betis (0–5, 2025/26)' },
      system: '4-3-3',
      players: vsBetis,
      notes: {
        en: "UYL 2025/26, 10 Dec 2025, away, Real Betis 5–0 Porto (UEFA 2046518). UEFA 4-3-3: Mide (#10) LCM, D. Cunha (#7) RW, Abreu (#11) LW. Pereira sent off 45+2'. Betis: Marina 19', 34', De Sá 51', Cordón 70', Mora 90'. Subs: Domingues for E. Ferreira 45+4', Fajardo Duarte for Abreu HT, Peixoto for D. Cunha 57', Sousa Barbosa for Mide 57', Magalhães for M. Silva 71'.",
        it: "UYL 2025/26, 10 dic 2025, trasferta, Real Betis 5–0 Porto (UEFA 2046518). 4-3-3 UEFA: Mide (#10) CC sinistro, D. Cunha (#7) ala destra, Abreu (#11) ala sinistra. Pereira espulso 45+2'. Betis: Marina 19', 34', De Sá 51', Cordón 70', Mora 90'. Sub: Domingues per E. Ferreira 45+4', Fajardo Duarte per Abreu INT, Peixoto per D. Cunha 57', Sousa Barbosa per Mide 57', Magalhães per M. Silva 71'.",
      },
    },
  ];
  porto.squadDepth = {
    system: '1-4-3-3',
    note: {
      en: 'UYL: PSV (20 Oct 2026), Man City (8 Sep 2026), Real Betis (10 Dec 2025). Roles as reported by UEFA.',
      it: 'UYL: PSV (20 ott 2026), Man City (8 set 2026), Real Betis (10 dic 2025). Ruoli come da UEFA.',
    },
    slots: [
      { role: 'GK', top: '10%', left: '50%', players: [{ name: 'Nikolov', starts: 2 }, { name: 'Ribeiro', starts: 1 }] },
      { role: 'RB', top: '26%', left: '14%', players: [{ name: 'F. Ferreira', starts: 1 }, { name: 'Froholdt', starts: 1 }, { name: 'M. Silva', starts: 1 }] },
      { role: 'RCB', top: '24%', left: '38%', players: [{ name: 'Gomes', starts: 1 }, { name: 'Teixeira', starts: 1 }, { name: 'F. Sousa', starts: 1 }] },
      { role: 'LCB', top: '24%', left: '62%', players: [{ name: 'Chelmik', starts: 2 }, { name: 'Gomes', starts: 1 }] },
      { role: 'LB', top: '26%', left: '86%', players: [{ name: 'M. Cunha', starts: 1 }, { name: 'Domingues', starts: 1 }, { name: 'Pereira', starts: 1 }] },
      { role: 'RM', top: '46%', left: '10%', players: [{ name: 'Granaas', starts: 1 }] },
      { role: 'RCM', top: '48%', left: '30%', players: [{ name: 'Lima', starts: 2 }, { name: 'Carvalho', starts: 1 }] },
      { role: 'CM', top: '44%', left: '50%', players: [{ name: 'Lima', starts: 1 }, { name: 'T. Silva', starts: 1 }] },
      { role: 'LCM', top: '48%', left: '70%', players: [{ name: 'T. Silva', starts: 2 }, { name: 'Mide', starts: 1 }] },
      { role: 'LM', top: '46%', left: '90%', players: [{ name: 'Mide', starts: 1 }] },
      { role: 'RW', top: '68%', left: '14%', players: [{ name: 'Mide', starts: 1 }, { name: 'D. Cunha', starts: 1 }] },
      { role: 'RS', top: '78%', left: '38%', players: [{ name: 'Varela', starts: 1 }] },
      { role: 'ST', top: '82%', left: '50%', players: [{ name: 'E. Ferreira', starts: 2 }] },
      { role: 'LS', top: '78%', left: '62%', players: [{ name: 'E. Ferreira', starts: 1 }] },
      { role: 'LW', top: '68%', left: '86%', players: [{ name: 'D. Cunha', starts: 1 }, { name: 'Abreu', starts: 1 }] },
    ],
  };
  porto.substitutes = [
    { name: 'Gonçalo Oliveira', position: 'RB / RM' },
    { name: 'Cardoso Varela', position: 'RCM' },
    { name: 'Duarte Cunha', position: 'RS' },
    { name: 'Tcherno Jamanca', position: 'LS' },
    { name: 'Hjalte Froholdt', position: 'RB' },
    { name: 'Domingos Muxito', position: 'LM' },
    { name: 'André Miranda', position: 'LW' },
    { name: 'João Abreu', position: 'RW' },
    { name: 'Martim Cunha', position: 'LB' },
    { name: 'José Domingues', position: 'ST' },
    { name: 'Leonardo Manuel Fajardo Duarte', position: 'LW' },
    { name: 'Tomás Peixoto', position: 'RW' },
    { name: 'Rúben Sousa Barbosa', position: 'LCM' },
    { name: 'Rafael Magalhães', position: 'RB' },
  ];
}

/**
 * Spezia Primavera 2 — 4-3-3 with a single holding midfielder.
 * Shirt → role (starters 1–11): 1 GK; 2 RB, 5 LCB, 6 RCB, 3 LB; 4 CDM, 8 RCM, 10 LCM; 7 RW, 9 ST, 11 LW.
 * Sources: Ascoli–Spezia distinta (MD1) · Spezia–Palermo distinta (MD2) · Pisa–Spezia distinta (MD3) · Spezia–Monopoli TM screenshots + spezia1906 tabellino (MD4) · Spezia–Latina distinta (MD5).
 */
const spezia = OPPONENTS.find((o) => o.id === 'spezia');
if (spezia) {
  // Francesco's set-piece notes (5 corners, 3 Longhi free kicks).
  spezia.setPieces = {
    corners: {
      left: {
        arrows: [
          { x1: 12, y1: 8, x2: 205, y2: 22 },
          { x1: 12, y1: 8, x2: 212, y2: 26 },
          { x1: 12, y1: 8, x2: 200, y2: 20 },
        ],
        note: 'Maggiore (right foot) ×2 · Del Sante (left foot) ×1',
        orderedNotesTitle: 'Delivery:',
        orderedNotes: ['4 of 5 to the far post, 1 into the box'],
      },
      right: {
        arrows: [
          { x1: 308, y1: 8, x2: 110, y2: 22 },
          { x1: 308, y1: 8, x2: 160, y2: 45 },
        ],
        note: 'Del Sante (left foot) ×2',
        orderedNotesTitle: 'Delivery:',
        orderedNotes: ['4 of 5 to the far post, 1 into the box'],
      },
      takers: [
        { player: 'Del Sante', foot: 'Left', total: 3, fromLeft: 1, fromRight: 2 },
        { player: 'Maggiore', foot: 'Right', total: 2, fromLeft: 2, fromRight: 0 },
      ],
    },
    freeKicks: {
      left: {
        arrows: [{ x1: 30, y1: 150, x2: 205, y2: 22, n: 1 }],
        orderedNotesTitle: 'Left side:',
        orderedNotes: ['Del Sante (left foot), deep left, to the far post'],
      },
      right: {
        arrows: [
          { x1: 292, y1: 140, x2: 118, y2: 20, n: 1 },
          { x1: 278, y1: 104, x2: 124, y2: 26, n: 2 },
          { x1: 245, y1: 112, x2: 175, y2: 94, n: 3 },
        ],
        orderedNotesTitle: 'Right side, in order (yellow numbers on the pitch):',
        orderedNotes: [
          'Longhi (right foot), deep right at about 30 yards, to the far post',
          'Longhi (right foot), taken short, to the far post',
          'Longhi (right foot), taken near the edge of the box, finishing at the D (penalty arc). Poorly taken.',
        ],
      },
      takers: [
        { player: 'Longhi', foot: 'Right', total: 3, fromLeft: 0, fromRight: 3 },
        { player: 'Del Sante', foot: 'Left', total: 1, fromLeft: 1, fromRight: 0 },
      ],
    },
  };
  const spezia433 = (names: {
    gk: string;
    rb: string;
    rcb: string;
    lcb: string;
    lb: string;
    cdm: string;
    rcm: string;
    lcm: string;
    rw: string;
    st: string;
    lw: string;
  }): PitchPlayer[] => [
    { number: 1, name: names.gk, teamId: 'spezia', isGk: true, top: '8%', left: '50%' },
    { number: 2, name: names.rb, teamId: 'spezia', top: '22%', left: '18%' },
    { number: 6, name: names.rcb, teamId: 'spezia', top: '20%', left: '38%' },
    { number: 5, name: names.lcb, teamId: 'spezia', top: '20%', left: '62%' },
    { number: 3, name: names.lb, teamId: 'spezia', top: '22%', left: '82%' },
    { number: 4, name: names.cdm, teamId: 'spezia', top: '38%', left: '50%' },
    { number: 8, name: names.rcm, teamId: 'spezia', top: '50%', left: '32%' },
    { number: 10, name: names.lcm, teamId: 'spezia', top: '50%', left: '68%' },
    { number: 7, name: names.rw, teamId: 'spezia', top: '68%', left: '18%' },
    { number: 9, name: names.st, teamId: 'spezia', top: '78%', left: '50%' },
    { number: 11, name: names.lw, teamId: 'spezia', top: '68%', left: '82%' },
  ];

  const vsAscoli = spezia433({
    gk: 'Doretti',
    rb: 'Mazzanti',
    lcb: 'Francini',
    rcb: 'Gafuri',
    lb: 'Michelotti',
    cdm: 'Longhi',
    rcm: 'Vannucci',
    lcm: 'Carbone',
    rw: "D'Ambrosio",
    st: 'Camara',
    lw: 'Trentinella',
  });

  const vsPalermo = spezia433({
    gk: 'Doretti',
    rb: 'Mazzanti',
    lcb: 'Francini',
    rcb: 'Gafuri',
    lb: 'Michelotti',
    cdm: 'Longhi',
    rcm: 'Ghetti',
    lcm: 'Carbone',
    rw: 'Cassano',
    st: 'Camara',
    lw: 'Trentinella',
  });

  const vsPisa = spezia433({
    gk: 'Doretti',
    rb: 'Mazzanti',
    lcb: 'Vignali',
    rcb: 'Gafuri',
    lb: 'Michelotti',
    cdm: 'Vannucci',
    rcm: 'Berti',
    lcm: 'Carbone',
    rw: 'Cassano',
    st: 'Trentinella',
    lw: 'Maggiore',
  });

  const vsLatina = spezia433({
    gk: 'Guidi',
    rb: 'Mazzanti',
    lcb: 'Vignali',
    rcb: 'Francini',
    lb: 'Michelotti',
    cdm: 'Vannucci',
    rcm: 'Berti',
    lcm: 'Sartori',
    rw: 'Cassano',
    st: 'Trentinella',
    lw: 'Del Sante',
  });

  const vsMonopoli = spezia433({
    gk: 'Guidi',
    rb: 'Mazzanti',
    lcb: 'Vignali',
    rcb: 'Gafuri',
    lb: 'Ghetti',
    cdm: 'Longhi',
    rcm: 'Berti',
    lcm: 'Carbone',
    rw: 'Cassano',
    st: 'Camara',
    lw: 'Del Sante',
  });

  /** Coppa XI by shirt onto 5-3-2: 1 GK, 2 RWB, 5 RCB, 6 CB, 4 LCB, 3 LWB, 8 RCM, 7 CM, 10 LCM, 9 RS, 11 LS. */
  const vsNapoliCoppa = placeholder532('spezia').map((p) => ({ ...p, name: ['Guidi', 'Michelotti', 'Ghetti', "D'Auria", 'Vignali', 'Corallo', "D'Ambrosio", 'Di Emidio', 'Camara', 'Sartori', 'Trocino'][p.number - 1] }));

  const vsNapoli = spezia433({
    gk: 'Azzoni',
    rb: 'Mazzanti',
    lcb: 'Vignali',
    rcb: 'Francini',
    lb: 'Del Sante',
    cdm: 'Longhi',
    rcm: 'Vannucci',
    lcm: 'Carbone',
    rw: "D'Ambrosio",
    st: 'Trentinella',
    lw: 'Maggiore',
  });

  spezia.formationSystem = '1-5-3-2';
  spezia.alternateFormationSystems = ['1-4-3-3'];
  spezia.starters = vsNapoliCoppa;
  spezia.scoutedFormations = [
    {
      id: 'spezia-vs-napoli-coppa',
      label: { en: 'Starting XI vs Napoli (28 Oct, Coppa Italia)', it: 'Formazione iniziale vs Napoli (28 ott, Coppa Italia)' },
      system: '5-3-2',
      players: vsNapoliCoppa,
      notes: {
        en: 'Coppa Italia Primavera First Round, 28 Oct 2026, 15:00, Stadio G. Piccolo, Cercola (official team sheet). Guidi (VK) in goal; Vignali (K) at RCB. Mapped by shirt onto 5-3-2: 2 RWB, 5 RCB, 6 CB, 4 LCB, 3 LWB, 8 RCM, 7 CM, 10 LCM, 9 RS, 11 LS. Bench: Azzoni, Bertolone, Gafuri, Francini, Liguori, Del Sante, Enriquez Gonzalez, Bellacci, Ceccarelli. Coach Lupoli. No subs yet.',
        it: "Coppa Italia Primavera primo turno, 28 ott 2026, ore 15:00, Stadio G. Piccolo, Cercola (distinta ufficiale). Guidi (VK) in porta; Vignali (K) centrale destro. Mappata per numero sul 5-3-2: 2 esterno destro, 5 centrale destro, 6 centrale, 4 centrale sinistro, 3 esterno sinistro, 8 CC destro, 7 CC, 10 CC sinistro, 9 punta destra, 11 punta sinistra. Panchina: Azzoni, Bertolone, Gafuri, Francini, Liguori, Del Sante, Enriquez Gonzalez, Bellacci, Ceccarelli. Allenatore Lupoli. Nessun cambio finora.",
      },
    },
    {
      id: 'spezia-vs-napoli',
      label: { en: 'Starting XI vs Napoli (24 Oct, 3–1)', it: 'Formazione iniziale vs Napoli (24 ott, 3–1)' },
      system: '4-3-3',
      players: vsNapoli,
      notes: {
        en: "Primavera 2 MD6, 24 Oct 2026, Napoli 3–1 Spezia (our match). Azzoni in goal; Del Sante (#3) at LB, Vannucci (#8) RCM, Carbone (#10) LCM, Maggiore (#11) LW. Goal: Longhi 72'. Subs: Ghetti for Maggiore 51', D'Auria for D'Ambrosio 69', Sartori for Carbone 69', Camara for Vannucci 80' (switch to 4-4-2 at 80'). Reference XI for the Coppa Italia tie (28 Oct).",
        it: "Primavera 2 gior. 6, 24 ott 2026, Napoli 3–1 Spezia (nostra partita). Azzoni in porta; Del Sante (#3) terzino sinistro, Vannucci (#8) CC destro, Carbone (#10) CC sinistro, Maggiore (#11) ala sinistra. Gol: Longhi 72'. Sub: Ghetti per Maggiore 51', D'Auria per D'Ambrosio 69', Sartori per Carbone 69', Camara per Vannucci 80' (passaggio al 4-4-2 all'80'). XI di riferimento per la Coppa Italia (28 ott).",
      },
    },
    {
      id: 'spezia-vs-ascoli',
      label: { en: 'vs Ascoli (1–1)', it: 'vs Ascoli (1–1)' },
      system: '4-3-3',
      players: vsAscoli,
      notes: {
        en: "Primavera 2 MD1, 5 Sep 2026, away (distinta). Vannucci (C) at RCM, Longhi at CDM. Goal: Ghetti 84'. Subs: Ghetti for D'Ambrosio 52', Ceccarelli for Camara 63', Berti for Longhi 63', D'Auria for Vannucci 77'.",
        it: "Primavera 2 gior. 1, 5 set 2026, trasferta (distinta). Vannucci (C) CC destro, Longhi play. Gol: Ghetti 84'. Sub: Ghetti per D'Ambrosio 52', Ceccarelli per Camara 63', Berti per Longhi 63', D'Auria per Vannucci 77'.",
      },
    },
    {
      id: 'spezia-vs-palermo',
      label: { en: 'vs Palermo (2–3)', it: 'vs Palermo (2–3)' },
      system: '4-3-3',
      players: vsPalermo,
      notes: {
        en: "Primavera 2 MD2, 12 Sep 2026, home at Ferdeghini (distinta). HT 1–2. Cassano (C); Ghetti (#8) at RCM, Francini (#5) at LCB. Goals: Trentinella 4', 79'. Palermo: #10 14', #3 (marked A) 35', #9 54'. Subs: Vannucci for Ghetti HT, Sartori for Longhi 60', Vignali for Francini 60', Ceccarelli for Camara 68', Maggiore for Carbone 68'.",
        it: "Primavera 2 gior. 2, 12 set 2026, casa al Ferdeghini (distinta). Primo tempo 1–2. Cassano (C); Ghetti (#8) CC destro, Francini (#5) centrale sinistro. Gol: Trentinella 4'pt, 34'st. Palermo: #10 14'pt, #3 (A) 35'pt, #9 9'st. Sub: Vannucci per Ghetti INT, Sartori per Longhi 15'st, Vignali per Francini 15'st, Ceccarelli per Camara 23'st, Maggiore per Carbone 23'st.",
      },
    },
    {
      id: 'spezia-vs-pisa',
      label: { en: 'vs Pisa (3–0)', it: 'vs Pisa (3–0)' },
      system: '4-3-3',
      players: vsPisa,
      notes: {
        en: "Primavera 2 MD3, 19 Sep 2026, away at Peccioli (distinta). Vignali (C). Goals: Michelotti 9', Maggiore 25', Vannucci 76'. Subs: Ghetti for Mazzanti HT, Longhi for Berti 57', Camara for Trentinella 61', Sartori for Carbone 61', Di Emidio for Vannucci 81'.",
        it: "Primavera 2 gior. 3, 19 set 2026, trasferta a Peccioli (distinta). Vignali (C). Gol: Michelotti 9', Maggiore 25', Vannucci 76'. Sub: Ghetti per Mazzanti INT, Longhi per Berti 57', Camara per Trentinella 61', Sartori per Carbone 61', Di Emidio per Vannucci 81'.",
      },
    },
    {
      id: 'spezia-vs-monopoli',
      label: { en: 'vs Monopoli (0–2)', it: 'vs Monopoli (0–2)' },
      system: '4-3-3',
      players: vsMonopoli,
      notes: {
        en: "Primavera 2 MD4, 10 Oct 2026, home at Ferdeghini (TM line-up screenshots + spezia1906 tabellino). Mapped by shirt onto 4-3-3 (TM labels 4-3-1-2). Ghetti (#3) at LB. Monopoli goals: Illuzzi 12', Bottalico 90+2'. Subs: Trentinella for Cassano 46', Maggiore for Camara 46', Vannucci for Longhi 46', Sartori for Berti 65', D'Ambrosio for Carbone 83'.",
        it: "Primavera 2 gior. 4, 10 ott 2026, casa al Ferdeghini (screenshot formazioni TM + tabellino spezia1906). Mappata per numero sul 4-3-3 (TM indica 4-3-1-2). Ghetti (#3) terzino sinistro. Gol Monopoli: Illuzzi 12', Bottalico 90+2'. Sub: Trentinella per Cassano 46', Maggiore per Camara 46', Vannucci per Longhi 46', Sartori per Berti 65', D'Ambrosio per Carbone 83'.",
      },
    },
    {
      id: 'spezia-vs-latina',
      label: { en: 'vs Latina (1–5)', it: 'vs Latina (1–5)' },
      system: '4-3-3',
      players: vsLatina,
      notes: {
        en: "Primavera 2 MD5, 17 Oct 2026, home (distinta). HT 1–3. Guidi in goal; Vignali (C). Goal: Trentinella 9'. Subs: Di Emidio for Berti HT, Trocino for Del Sante 64', Camara for Sartori 71', Corallo for Francini 80'. Most recent scouted XI.",
        it: "Primavera 2 gior. 5, 17 ott 2026, casa (distinta). Primo tempo 1–3. Guidi in porta; Vignali (C). Gol: Trentinella 9'. Sub: Di Emidio per Berti INT, Trocino per Del Sante 19'st, Camara per Sartori 26'st, Corallo per Francini 35'st. XI scoutata più recente.",
      },
    },
  ];
  /** Depth = scouted XIs mapped by shirt number onto 5-3-2. */
  spezia.squadDepth = {
    system: '1-5-3-2',
    note: {
      en: 'Scouted XIs so far (Ascoli MD1, Palermo MD2, Pisa MD3, Monopoli MD4, Latina MD5, Napoli MD6, Napoli Coppa) mapped by shirt onto 5-3-2: 2 = RWB, 5 = RCB, 6 = CB, 4 = LCB, 3 = LWB, 8 = RCM, 7 = CM, 10 = LCM, 9 = RS, 11 = LS. Order = most starts in that slot.',
      it: 'Formazioni scoutate finora (Ascoli gior. 1, Palermo gior. 2, Pisa gior. 3, Monopoli gior. 4, Latina gior. 5, Napoli gior. 6, Napoli Coppa) mappate per numero sul 5-3-2: 2 = esterno destro, 5 = centrale destro, 6 = centrale, 4 = centrale sinistro, 3 = esterno sinistro, 8 = CC destro, 7 = CC, 10 = CC sinistro, 9 = punta destra, 11 = punta sinistra. Ordine = più partite in quel ruolo.',
    },
    slots: [
      { role: 'GK', top: '10%', left: '50%', players: [{ name: 'Guidi', starts: 3 }, { name: 'Doretti', starts: 3 }, { name: 'Azzoni', starts: 1 }] },
      { role: 'RWB', top: '34%', left: '10%', players: [{ name: 'Mazzanti', starts: 6 }, { name: 'Michelotti', starts: 1 }] },
      { role: 'RCB', top: '24%', left: '30%', players: [{ name: 'Vignali', starts: 5 }, { name: 'Francini', starts: 2 }] },
      { role: 'CB', top: '22%', left: '50%', players: [{ name: 'Gafuri', starts: 4 }, { name: 'Francini', starts: 2 }, { name: 'Corallo', starts: 1 }] },
      { role: 'LCB', top: '24%', left: '70%', players: [{ name: 'Longhi', starts: 4 }, { name: 'Vannucci', starts: 2 }, { name: "D'Auria", starts: 1 }] },
      { role: 'LWB', top: '34%', left: '90%', players: [{ name: 'Michelotti', starts: 4 }, { name: 'Ghetti', starts: 2 }, { name: 'Del Sante', starts: 1 }] },
      { role: 'RCM', top: '50%', left: '30%', players: [{ name: 'Berti', starts: 3 }, { name: 'Vannucci', starts: 2 }, { name: 'Di Emidio', starts: 1 }, { name: 'Ghetti', starts: 1 }] },
      { role: 'CM', top: '46%', left: '50%', players: [{ name: 'Cassano', starts: 4 }, { name: "D'Ambrosio", starts: 3 }] },
      { role: 'LCM', top: '50%', left: '70%', players: [{ name: 'Carbone', starts: 5 }, { name: 'Sartori', starts: 2 }] },
      { role: 'RS', top: '74%', left: '40%', players: [{ name: 'Camara', starts: 4 }, { name: 'Trentinella', starts: 3 }] },
      { role: 'LS', top: '74%', left: '60%', players: [{ name: 'Maggiore', starts: 2 }, { name: 'Del Sante', starts: 2 }, { name: 'Trentinella', starts: 2 }, { name: 'Trocino', starts: 1 }] },
    ],
  };
  /** Squad from distinte (no shirt numbers). Role = roles started in scouted XIs; bench-only = Transfermarkt profile position. Foot/height from Transfermarkt where listed (Tuttocampo roster empty); blanks = not published. */
  spezia.squad = [
    { name: 'Gabriele Doretti', position: 'GK', isGk: true, birthYear: 2010, heightCm: 184, preferredFoot: 'Destro' },
    { name: 'Enrico Sasha Guidi', position: 'GK', isGk: true, birthYear: 2008, heightCm: 191, preferredFoot: 'Destro' },
    { name: 'Matteo Azzoni', position: 'GK', isGk: true, birthYear: 2009, heightCm: 182, preferredFoot: 'Destro' },
    { name: 'Nicolò De Vita', position: 'GK (profile)', isGk: true, birthYear: 2009 },
    { name: 'Tommaso Mazzanti', position: 'RB', birthYear: 2009, preferredFoot: 'Destro' },
    { name: 'Diego Vignali', position: 'LCB', birthYear: 2008, heightCm: 184, preferredFoot: 'Sinistro' },
    { name: 'Orlando Francini', position: 'RCB / LCB', birthYear: 2010, heightCm: 183 },
    { name: 'Alen Gafuri', position: 'RCB', birthYear: 2008 },
    { name: 'Tommaso Michelotti', position: 'LB', birthYear: 2009, preferredFoot: 'Destro' },
    { name: 'Tommaso Vannucci', position: 'CDM / RCM', birthYear: 2008, heightCm: 169, preferredFoot: 'Destro' },
    { name: 'Tommaso Longhi', position: 'CDM', birthYear: 2009 },
    { name: 'Federico Berti', position: 'RCM', birthYear: 2009, preferredFoot: 'Destro' },
    { name: 'Christian Carbone', position: 'LCM', birthYear: 2009, heightCm: 179, preferredFoot: 'Sinistro' },
    { name: 'Giovanni Sartori', position: 'LCM', birthYear: 2008 },
    { name: 'Armando Cassano', position: 'RW', birthYear: 2008, heightCm: 184, preferredFoot: 'Sinistro' },
    { name: "Christian D'Ambrosio", position: 'RW', birthYear: 2009, heightCm: 175, preferredFoot: 'Sinistro' },
    { name: 'Marco Trentinella', position: 'ST / LW', birthYear: 2009, preferredFoot: 'Destro' },
    { name: 'Kabine Camara', position: 'ST', birthYear: 2007, heightCm: 197, preferredFoot: 'Destro' },
    { name: 'Antonino Maggiore', position: 'LW', birthYear: 2009 },
    { name: 'Davide Del Sante', position: 'LW / LB', birthYear: 2008, heightCm: 175, preferredFoot: 'Sinistro' },
    { name: 'Davide Ghetti', position: 'LB / RCM', birthYear: 2009, preferredFoot: 'Destro' },
    { name: 'Gianmarco Di Emidio', position: 'CM (profile)', birthYear: 2009 },
    { name: 'Nicolò Corallo', position: 'RB', birthYear: 2009 },
    { name: "Alessio D'Auria", position: 'CM (profile)', birthYear: 2009 },
    { name: 'Luca Trocino', position: 'CM (profile)', birthYear: 2008, heightCm: 188, preferredFoot: 'Destro' },
    { name: 'Mathias Liguori', position: 'CM', birthYear: 2010, heightCm: 176, preferredFoot: 'Ambidestro' },
    { name: 'Thomas Ceccarelli', position: 'ST (profile)', birthYear: 2009 },
    { name: 'Bertolone', position: 'CB', birthYear: 2010 },
    { name: 'Enriquez Gonzalez', position: 'ST', birthYear: 2009, preferredFoot: 'Destro' },
    { name: 'Giulio Bellacci', position: 'LW (profile)', birthYear: 2009, heightCm: 178, preferredFoot: 'Destro' },
  ];
}

const monopoli = OPPONENTS.find((o) => o.id === 'monopoli');
if (monopoli) {
  /** XIs by shirt onto 5-3-2: 1 GK, 2 RWB, 5 RCB, 6 CB, 4 LCB, 3 LWB, 8 RCM, 7 CM, 10 LCM, 9 RS, 11 LS. */
  const monopoli532 = (byShirt: string[]): PitchPlayer[] =>
    placeholder532('monopoli').map((p) => ({ ...p, name: byShirt[p.number - 1] }));
  const vs_cosenza = monopoli532(['De Michele', 'Paparella', 'Lanza', 'Di Bari', 'Turčinskas', 'Margheri', 'Ziedelis', 'Casillo', 'Tumminelli', 'Bennet', 'Illuzzi']);
  const vs_perugia = monopoli532(['De Michele', 'Paparella', 'Lanza', 'Montrone', 'Turčinskas', 'Margheri', 'Ziedelis', 'Casillo', 'Tumminelli', 'Bennet', 'Illuzzi']);
  const vs_pescara = monopoli532(['De Michele', 'Šedvartas', 'Lanza', 'Di Bari', 'Turčinskas', 'Margheri', 'Ziedelis', 'Casillo', 'Tumminelli', 'Positano', 'Illuzzi']);
  const vs_spezia = monopoli532(['De Michele', 'Šedvartas', 'Lanza', 'Di Bari', 'Turčinskas', 'Margheri', 'Ziedelis', 'Casillo', 'Tumminelli', 'Positano', 'Illuzzi']);
  const vs_benevento = monopoli532(['De Michele', 'Šedvartas', 'Lanza', 'Di Bari', 'Turčinskas', 'Cardinale', 'Ziedelis', 'Casillo', 'Tumminelli', 'Positano', 'Illuzzi']);
  const vs_ascoli = monopoli532(['De Michele', 'Šedvartas', 'Lanza', 'Di Bari', 'Turčinskas', 'Ziedelis', 'Errico', 'Casillo', 'Tumminelli', 'Positano', 'Illuzzi']);
  monopoli.formationSystem = '1-5-3-2';
  monopoli.starters = vs_ascoli;
  monopoli.scoutedFormations = [
    {
      id: 'monopoli-vs-ascoli',
      label: { en: 'vs Ascoli (2–0)', it: 'vs Ascoli (2–0)' },
      system: '5-3-2',
      players: vs_ascoli,
      notes: {
        en: 'Primavera 2 MD6, 24 Oct 2026, away at Picchio Village, Ascoli 0–2 Monopoli (distinta). Goals: Positano 38\', Bottalico 90+1\'. Subs: Bottalico for Tumminelli 68\', Manzari for Illuzzi 68\', Paparella for Errico 85\', Sette for Lanza 90+3\'.',
        it: 'Primavera 2 gior. 6, 24 ott 2026, trasferta al Picchio Village, Ascoli 0–2 Monopoli (distinta). Gol: Positano 38\', Bottalico 90+1\'. Sub: Bottalico per Tumminelli 23\'st, Manzari per Illuzzi 23\'st, Paparella per Errico 40\'st, Sette per Lanza 48\'st.',
      },
    },
    {
      id: 'monopoli-vs-benevento',
      label: { en: 'vs Benevento (2–2)', it: 'vs Benevento (2–2)' },
      system: '5-3-2',
      players: vs_benevento,
      notes: {
        en: 'Primavera 2 MD5, 17 Oct 2026, home at Gioia del Colle, Monopoli 2–2 Benevento (distinta; score and subs Transfermarkt). Goals: Casillo, Manzari. Subs: Bennet for Cardinale HT, Manzari for Positano 56\', Morrone for Illuzzi 72\', Bottalico for Tumminelli 72\'.',
        it: 'Primavera 2 gior. 5, 17 ott 2026, casa a Gioia del Colle, Monopoli 2–2 Benevento (distinta; risultato e cambi Transfermarkt). Gol: Casillo, Manzari. Sub: Bennet per Cardinale INT, Manzari per Positano 56\', Morrone per Illuzzi 72\', Bottalico per Tumminelli 72\'.',
      },
    },
    {
      id: 'monopoli-vs-spezia',
      label: { en: 'vs Spezia (2–0)', it: 'vs Spezia (2–0)' },
      system: '5-3-2',
      players: vs_spezia,
      notes: {
        en: 'Primavera 2 MD4, 10 Oct 2026, away at Ferdeghini, Spezia 0–2 Monopoli (Transfermarkt). Goals: Illuzzi 12\', Bottalico 90+2\'. Subs: Bottalico for Tumminelli 64\', Cardinale for Lanza 64\', Morrone for Illuzzi 73\', Bennet for Positano 73\'.',
        it: 'Primavera 2 gior. 4, 10 ott 2026, trasferta al Ferdeghini, Spezia 0–2 Monopoli (Transfermarkt). Gol: Illuzzi 12\', Bottalico 90+2\'. Sub: Bottalico per Tumminelli 64\', Cardinale per Lanza 64\', Morrone per Illuzzi 73\', Bennet per Positano 73\'.',
      },
    },
    {
      id: 'monopoli-vs-pescara',
      label: { en: 'vs Pescara (2–2)', it: 'vs Pescara (2–2)' },
      system: '5-3-2',
      players: vs_pescara,
      notes: {
        en: 'Primavera 2 MD3, 19 Sep 2026, home at Gioia del Colle, Monopoli 2–2 Pescara (distinta). Goals: Ziedelis 5\', Casillo 14\'. Subs: Morrone for Tumminelli 63\', Bennet for Positano 63\', Manzari for Illuzzi 76\', Ettorre for Casillo 85\'.',
        it: 'Primavera 2 gior. 3, 19 set 2026, casa a Gioia del Colle, Monopoli 2–2 Pescara (distinta). Gol: Ziedelis 5\', Casillo 14\'. Sub: Morrone per Tumminelli 18\'st, Bennet per Positano 18\'st, Manzari per Illuzzi 31\'st, Ettorre per Casillo 40\'st.',
      },
    },
    {
      id: 'monopoli-vs-perugia',
      label: { en: 'vs Perugia (0–3)', it: 'vs Perugia (0–3)' },
      system: '5-3-2',
      players: vs_perugia,
      notes: {
        en: 'Primavera 2 MD2, 12 Sep 2026, away at Perugia, Perugia 3–0 Monopoli (distinta). Subs: Manzari for Montrone HT, Šedvartas for Paparella HT, Positano for Bennet HT, Morrone for Casillo 70\', Bottalico for Tumminelli 75\'.',
        it: 'Primavera 2 gior. 2, 12 set 2026, trasferta a Perugia, Perugia 3–0 Monopoli (distinta). Sub: Manzari per Montrone INT, Šedvartas per Paparella INT, Positano per Bennet INT, Morrone per Casillo 25\'st, Bottalico per Tumminelli 30\'st.',
      },
    },
    {
      id: 'monopoli-vs-cosenza',
      label: { en: 'vs Cosenza (4–0)', it: 'vs Cosenza (4–0)' },
      system: '5-3-2',
      players: vs_cosenza,
      notes: {
        en: 'Primavera 2 MD1, 5 Sep 2026, home at Gioia del Colle, Monopoli 4–0 Cosenza (distinta; score and subs Transfermarkt). Goals: Casillo (pen.), Casillo, Illuzzi, Tumminelli. Subs: Positano for Bennet 59\', Morrone for Illuzzi 65\', Montrone for Tumminelli 65\', Bottalico for Tumminelli 78\', Ettorre for Casillo 78\'.',
        it: 'Primavera 2 gior. 1, 5 set 2026, casa a Gioia del Colle, Monopoli 4–0 Cosenza (distinta; risultato e cambi Transfermarkt). Gol: Casillo (rig.), Casillo, Illuzzi, Tumminelli. Sub: Positano per Bennet 59\', Morrone per Illuzzi 65\', Montrone per Tumminelli 65\', Bottalico per Tumminelli 78\', Ettorre per Casillo 78\'.',
      },
    },
  ];
  monopoli.squadDepth = {
    system: '1-5-3-2',
    note: {
      en: 'Primavera 2 MD1–MD6 (Cosenza, Perugia, Pescara, Spezia, Benevento, Ascoli).',
      it: 'Primavera 2 gior. 1–6 (Cosenza, Perugia, Pescara, Spezia, Benevento, Ascoli).',
    },
    slots: [
      { role: 'GK', top: '10%', left: '50%', players: [{ name: 'De Michele', starts: 6 }] },
      { role: 'RWB', top: '34%', left: '10%', players: [{ name: 'Šedvartas', starts: 4 }, { name: 'Paparella', starts: 2 }] },
      { role: 'RCB', top: '24%', left: '30%', players: [{ name: 'Turčinskas', starts: 6 }] },
      { role: 'CB', top: '22%', left: '50%', players: [{ name: 'Margheri', starts: 4 }, { name: 'Cardinale', starts: 1 }, { name: 'Ziedelis', starts: 1 }] },
      { role: 'LCB', top: '24%', left: '70%', players: [{ name: 'Di Bari', starts: 5 }, { name: 'Montrone', starts: 1 }] },
      { role: 'LWB', top: '34%', left: '90%', players: [{ name: 'Lanza', starts: 6 }] },
      { role: 'RCM', top: '50%', left: '30%', players: [{ name: 'Casillo', starts: 6 }] },
      { role: 'CM', top: '46%', left: '50%', players: [{ name: 'Ziedelis', starts: 5 }, { name: 'Errico', starts: 1 }] },
      { role: 'LCM', top: '50%', left: '70%', players: [{ name: 'Positano', starts: 4 }, { name: 'Bennet', starts: 2 }] },
      { role: 'RS', top: '74%', left: '40%', players: [{ name: 'Tumminelli', starts: 6 }] },
      { role: 'LS', top: '74%', left: '60%', players: [{ name: 'Illuzzi', starts: 6 }] },
    ],
  };
  monopoli.substitutes = [
    { name: 'Giuseppe Positano', position: 'LCM' },
    { name: 'Christian Morrone', position: 'LS / RS / RCM' },
    { name: 'Marco Antonio Bottalico', position: 'RS' },
    { name: 'Antonio Manzari', position: 'LS / LCB / LCM' },
    { name: 'Jesse Jay Bennet', position: 'LCM / CB' },
    { name: 'Angelo Ettorre', position: 'RCM' },
    { name: 'Gabrielius Šedvartas', position: 'RWB' },
    { name: 'Giuseppe Montrone', position: 'RS' },
    { name: 'Lorenzo Giuseppe Cardinale', position: 'LWB' },
    { name: 'Marco Paparella', position: 'CM' },
    { name: 'Gabriele Sette', position: 'LWB' },
  ];
  monopoli.squad = [
    { name: 'Angelo Michele De Michele', position: 'GK', isGk: true, birthYear: 2009, heightCm: 181, preferredFoot: 'Destro' },
    { name: 'Francesco Soldano', position: 'GK', isGk: true, birthYear: 2010 },
    { name: 'Alessandro Palazzo', position: 'GK', isGk: true, birthYear: 2009 },
    { name: 'Salvatore Filolungo', position: 'GK', isGk: true, birthYear: 2008, heightCm: 176, preferredFoot: 'Sinistro' },
    { name: 'Gabrielius Šedvartas', position: 'RWB', birthYear: 2008, preferredFoot: 'Ambidestro' },
    { name: 'Marco Paparella', position: 'RWB', birthYear: 2008, preferredFoot: 'Sinistro' },
    { name: 'Jugas Turčinskas', position: 'RCB', birthYear: 2008, heightCm: 179, preferredFoot: 'Ambidestro' },
    { name: 'Emanuele Margheri', position: 'CB', birthYear: 2008, heightCm: 185, preferredFoot: 'Destro' },
    { name: 'Lorenzo Giuseppe Cardinale', position: 'CB', birthYear: 2009, heightCm: 194, preferredFoot: 'Destro' },
    { name: 'Andrea Di Bari', position: 'LCB', birthYear: 2007 },
    { name: 'Giuseppe Montrone', position: 'LCB', birthYear: 2009, heightCm: 171, preferredFoot: 'Destro' },
    { name: 'Manuel Lanza', position: 'LWB', birthYear: 2009, heightCm: 183, preferredFoot: 'Sinistro' },
    { name: 'Luigi Casillo', position: 'RCM', birthYear: 2008, heightCm: 185, preferredFoot: 'Destro' },
    { name: 'Jokubas Ziedelis', position: 'CM / CB', birthYear: 2008, preferredFoot: 'Ambidestro' },
    { name: 'Claudio Maria Errico', position: 'CM', birthYear: 2009, preferredFoot: 'Sinistro' },
    { name: 'Giuseppe Positano', position: 'LCM', birthYear: 2008, heightCm: 176, preferredFoot: 'Ambidestro' },
    { name: 'Jesse Jay Bennet', position: 'LCM', birthYear: 2008 },
    { name: 'Daniel Tumminelli', position: 'RS', birthYear: 2008, heightCm: 190, preferredFoot: 'Ambidestro' },
    { name: 'Francesco Illuzzi', position: 'LS', birthYear: 2009, heightCm: 179, preferredFoot: 'Ambidestro' },
    { name: 'Marco Antonio Bottalico', position: 'RS', birthYear: 2009, preferredFoot: 'Sinistro' },
    { name: 'Christian Morrone', birthYear: 2009, preferredFoot: 'Ambidestro' },
    { name: 'Antonio Manzari', birthYear: 2008, preferredFoot: 'Destro' },
    { name: 'Angelo Ettorre', birthYear: 2009, heightCm: 178, preferredFoot: 'Destro' },
    { name: 'Gabriele Sette', birthYear: 2009, heightCm: 177, preferredFoot: 'Destro' },
    { name: 'Nicola Albergo', birthYear: 2008, preferredFoot: 'Sinistro' },
    { name: 'Gabriele Guerra', birthYear: 2009, preferredFoot: 'Destro' },
    { name: 'Nicolò Gora', birthYear: 2009, heightCm: 185, preferredFoot: 'Sinistro' },
  ];
}

const frosinone = OPPONENTS.find((o) => o.id === 'frosinone');
if (frosinone) {
  /** XIs by shirt onto 3-5-2: 1 GK, 5 RCB, 6 CB, 4 LCB, 2 RWB, 3 LWB, 8 RCM, 7 CM, 10 LCM, 9 RS, 11 LS. */
  const frosinone352 = (byShirt: string[]): PitchPlayer[] =>
    placeholder352('frosinone').map((p) => ({ ...p, name: byShirt[p.number - 1] }));
  const vs_perugia = frosinone352(["Capanna", "Mirenzi", "Colafrancesco", "Esposito", "Reali", "Bosi", "Taddei", "Millozzi", "Carpentieri", "Menghini", "Marchetti"]);
  const vs_cosenza = frosinone352(["Capanna", "Mirenzi", "Colafrancesco", "Esposito", "Reali", "Bosi", "Taddei", "Millozzi", "Carpentieri", "Menghini", "Marchetti"]);
  const vs_palermo = frosinone352(["Capanna", "Mirenzi", "Colafrancesco", "Esposito", "Grande", "Bosi", "Taddei", "Marchetti", "Carpentieri", "Menghini", "Castroreale"]);
  const vs_catanzaro = frosinone352(["Amato", "Anzidei", "Colafrancesco", "Esposito", "Reali", "Grande", "Mirenzi", "Marchetti", "Carpentieri", "Menghini", "Castroreale"]);
  const vs_pisa = frosinone352(["Amato", "Bosi", "Colafrancesco", "Esposito", "Reali", "Grande", "Mirenzi", "Marchetti", "Carpentieri", "Menghini", "Castroreale"]);
  const vs_benevento = frosinone352(["Amato", "Mirenzi", "Colafrancesco", "Esposito", "Grande", "Bosi", "Taddei", "Millozzi", "Carpentieri", "Menghini", "Carfagna"]);
  frosinone.formationSystem = '1-3-5-2';
  frosinone.starters = frosinone352(["Capanna", "Mirenzi", "Colafrancesco", "Esposito", "Reali", "Bosi", "Taddei", "Millozzi", "Carpentieri", "Menghini", "Castroreale"]);
  frosinone.scoutedFormations = [
    {
      id: 'frosinone-probable-xi',
      label: { en: 'Probable XI', it: 'Probabile XI' },
      system: '3-5-2',
      players: frosinone.starters,
      notes: {
        en: 'Most frequent starter per role, Primavera 2 MD1–MD6.',
        it: 'Titolare più frequente per ruolo, Primavera 2 gior. 1–6.',
      },
    },
    {
      id: 'frosinone-vs-perugia',
      label: { en: "vs Perugia (0–5)", it: "vs Perugia (0–5)" },
      system: '3-5-2',
      players: vs_perugia,
      notes: {
        en: "Primavera 2 MD6, 24 Oct 2026, away, Perugia 5–0 Frosinone (Transfermarkt). Perugia goals: Dottori 38' (pen.), Agnissan 69', Agnissan 73', Agnissan 82', Agnissan 90+3'. Subs: Ndao for Marchetti 58', Casagrande for Taddei 58', Polinari for Carpentieri 84', Castellani for Millozzi 84', Pantano for Bosi 84'.",
        it: "Primavera 2 gior. 6, 24 ott 2026, trasferta, Perugia 5–0 Frosinone (Transfermarkt). Gol Perugia: Dottori 38' (pen.), Agnissan 69', Agnissan 73', Agnissan 82', Agnissan 90+3'. Sub: Ndao per Marchetti 58', Casagrande per Taddei 58', Polinari per Carpentieri 84', Castellani per Millozzi 84', Pantano per Bosi 84'.",
      },
    },
    {
      id: 'frosinone-vs-cosenza',
      label: { en: "vs Cosenza (2–1)", it: "vs Cosenza (2–1)" },
      system: '3-5-2',
      players: vs_cosenza,
      notes: {
        en: "Primavera 2 MD5, 17 Oct 2026, away, Cosenza 1–2 Frosinone (distinta + Transfermarkt). Frosinone goals: Bosi 65', Carpentieri 69'. Cosenza goals: Mazzulla 38'. Subs: Castroreale for Marchetti 62', Casagrande for Taddei 62', Ndao for Colafrancesco 84', Pantano for Carpentieri 90', Castellani for Millozzi 90'.",
        it: "Primavera 2 gior. 5, 17 ott 2026, trasferta, Cosenza 1–2 Frosinone (distinta + Transfermarkt). Gol Frosinone: Bosi 65', Carpentieri 69'. Gol Cosenza: Mazzulla 38'. Sub: Castroreale per Marchetti 62', Casagrande per Taddei 62', Ndao per Colafrancesco 84', Pantano per Carpentieri 90', Castellani per Millozzi 90'.",
      },
    },
    {
      id: 'frosinone-vs-palermo',
      label: { en: "vs Palermo (0–0)", it: "vs Palermo (0–0)" },
      system: '3-5-2',
      players: vs_palermo,
      notes: {
        en: "Primavera 2 MD4, 10 Oct 2026, home, Frosinone 0–0 Palermo (distinta + Transfermarkt). Subs: Millozzi for Marchetti 65', Casagrande for Castroreale 65', Reali for Grande 65', Polinari for Carpentieri 84'. Cards: Yellow: Grande 55'.",
        it: "Primavera 2 gior. 4, 10 ott 2026, casa, Frosinone 0–0 Palermo (distinta + Transfermarkt). Sub: Millozzi per Marchetti 65', Casagrande per Castroreale 65', Reali per Grande 65', Polinari per Carpentieri 84'. Cartellini: Gialli: Grande 55'.",
      },
    },
    {
      id: 'frosinone-vs-catanzaro',
      label: { en: "vs Catanzaro (0–6)", it: "vs Catanzaro (0–6)" },
      system: '3-5-2',
      players: vs_catanzaro,
      notes: {
        en: "Primavera 2 MD3, 19 Sep 2026, away, Catanzaro 6–0 Frosinone (distinta + Transfermarkt). Catanzaro goals: Pellegrini 4', Pellegrini 14', Gjoka 38', Greco 60', Ciani 84', Vella 86'. Subs: Millozzi for Carpentieri 30', Taddei for Colafrancesco 45', Danieli for Anzidei 45', Polinari for Castroreale 61', Castellani for Esposito 66'. Cards: Yellow: Millozzi 31'.",
        it: "Primavera 2 gior. 3, 19 set 2026, trasferta, Catanzaro 6–0 Frosinone (distinta + Transfermarkt). Gol Catanzaro: Pellegrini 4', Pellegrini 14', Gjoka 38', Greco 60', Ciani 84', Vella 86'. Sub: Millozzi per Carpentieri 30', Taddei per Colafrancesco 45', Danieli per Anzidei 45', Polinari per Castroreale 61', Castellani per Esposito 66'. Cartellini: Gialli: Millozzi 31'.",
      },
    },
    {
      id: 'frosinone-vs-pisa',
      label: { en: "vs Pisa (2–3)", it: "vs Pisa (2–3)" },
      system: '3-5-2',
      players: vs_pisa,
      notes: {
        en: "Primavera 2 MD2, 12 Sep 2026, home, Frosinone 2–3 Pisa (distinta + Transfermarkt). Frosinone goals: Marchetti 70', Carpentieri 90+5'. Pisa goals: Ghizzani 6', Ghizzani 52', Ghizzani 60'. Subs: Anzidei for Bosi 66', Polinari for Castroreale 66', Valente for Marchetti 70', Ndao for Colafrancesco 86'. Cards: Yellow: Bosi.",
        it: "Primavera 2 gior. 2, 12 set 2026, casa, Frosinone 2–3 Pisa (distinta + Transfermarkt). Gol Frosinone: Marchetti 70', Carpentieri 90+5'. Gol Pisa: Ghizzani 6', Ghizzani 52', Ghizzani 60'. Sub: Anzidei per Bosi 66', Polinari per Castroreale 66', Valente per Marchetti 70', Ndao per Colafrancesco 86'. Cartellini: Gialli: Bosi.",
      },
    },
    {
      id: 'frosinone-vs-benevento',
      label: { en: "vs Benevento (0–3)", it: "vs Benevento (0–3)" },
      system: '3-5-2',
      players: vs_benevento,
      notes: {
        en: "Primavera 2 MD1, 5 Sep 2026, away, Benevento 3–0 Frosinone (distinta + Transfermarkt). Benevento goals: Giugliano 5', Lo Russo 30', Giugliano 64' (free kick). Subs: Castroreale for Millozzi 67', Reali for Grande 67', Marchetti for Colafrancesco 72', Valente for Carpentieri 72', Anzidei for Bosi 77'. Cards: Yellow: Mirenzi, Grande, Valente; Red (2nd yellow): Carfagna 79'.",
        it: "Primavera 2 gior. 1, 5 set 2026, trasferta, Benevento 3–0 Frosinone (distinta + Transfermarkt). Gol Benevento: Giugliano 5', Lo Russo 30', Giugliano 64' (punizione). Sub: Castroreale per Millozzi 67', Reali per Grande 67', Marchetti per Colafrancesco 72', Valente per Carpentieri 72', Anzidei per Bosi 77'. Cartellini: Gialli: Mirenzi, Grande, Valente; Rosso (doppio giallo): Carfagna 79'.",
      },
    },
  ];
  frosinone.squadDepth = {
    system: '1-3-5-2',
    note: {
      en: 'Primavera 2 MD1–MD6 (Benevento, Pisa, Catanzaro, Palermo, Cosenza, Perugia).',
      it: 'Primavera 2 gior. 1–6 (Benevento, Pisa, Catanzaro, Palermo, Cosenza, Perugia).',
    },
    slots: [
      { role: 'GK', top: '10%', left: '50%', players: [{ name: "Capanna", starts: 3 }, { name: "Amato", starts: 3 }] },
      { role: 'RCB', top: '24%', left: '30%', players: [{ name: "Reali", starts: 4 }, { name: "Grande", starts: 2 }] },
      { role: 'CB', top: '22%', left: '50%', players: [{ name: "Bosi", starts: 4 }, { name: "Grande", starts: 2 }] },
      { role: 'LCB', top: '24%', left: '70%', players: [{ name: "Esposito", starts: 6 }] },
      { role: 'RWB', top: '46%', left: '10%', players: [{ name: "Mirenzi", starts: 4 }, { name: "Bosi", starts: 1 }, { name: "Anzidei", starts: 1 }] },
      { role: 'LWB', top: '46%', left: '90%', players: [{ name: "Colafrancesco", starts: 6 }] },
      { role: 'RCM', top: '52%', left: '32%', players: [{ name: "Millozzi", starts: 3 }, { name: "Marchetti", starts: 3 }] },
      { role: 'CM', top: '42%', left: '50%', players: [{ name: "Taddei", starts: 4 }, { name: "Mirenzi", starts: 2 }] },
      { role: 'LCM', top: '52%', left: '68%', players: [{ name: "Menghini", starts: 6 }] },
      { role: 'RS', top: '74%', left: '40%', players: [{ name: "Carpentieri", starts: 6 }] },
      { role: 'LS', top: '74%', left: '60%', players: [{ name: "Castroreale", starts: 3 }, { name: "Marchetti", starts: 2 }, { name: "Carfagna", starts: 1 }] },
    ],
  };
  frosinone.substitutes = [
    { name: 'Fabio Polinari', position: 'LS / RS' },
    { name: 'Gianfilippo Casagrande', position: 'CM / LS' },
    { name: 'Andrea Castellani', position: 'RCM / LCB' },
    { name: 'Yankhoba Ndao', position: 'LWB / LS' },
    { name: 'Massimo Anzidei', position: 'CB' },
    { name: 'Alessandro Castroreale', position: 'RCM' },
    { name: 'Francesco Millozzi', position: 'RS / RCM' },
    { name: 'Cristian Pantano', position: 'RS / CB' },
    { name: 'Tommaso Reali', position: 'RCB' },
    { name: 'Gabriele Valente', position: 'RS / RCM' },
    { name: 'Alessio Danieli', position: 'RWB' },
    { name: 'Matteo Marchetti', position: 'LWB' },
    { name: 'Leonardo Taddei', position: 'LWB' },
  ];
  frosinone.squad = [
    { name: "Tommaso Capanna", position: 'GK', isGk: true, birthYear: 2008, preferredFoot: 'Destro' },
    { name: "Luca Amato", position: 'GK', isGk: true, birthYear: 2010 },
    { name: "Mohamed Serour", position: 'GK', isGk: true, birthYear: 2008 },
    { name: "Matias Monaldi", position: 'GK', isGk: true, birthYear: 2009 },
    { name: "Valerio Spirito", position: 'GK', isGk: true, birthYear: 2010 },
    { name: "Andrea Leonardi", position: 'GK', isGk: true, birthYear: 2010 },
    { name: "Cristian Pantano", position: 'RS / CB', birthYear: 2008, heightCm: 191, preferredFoot: 'Destro' },
    { name: "Alessandro Grande", position: 'RCB / CB', birthYear: 2009, preferredFoot: 'Destro' },
    { name: "Massimo Anzidei", position: 'RWB / CB', birthYear: 2009, preferredFoot: 'Destro' },
    { name: "Giorgio Bosi", position: 'CB / RWB', birthYear: 2009 },
    { name: "Francesco Molina", birthYear: 2008, preferredFoot: 'Sinistro' },
    { name: "Tommaso Reali", position: 'RCB', birthYear: 2008, heightCm: 186, preferredFoot: 'Destro' },
    { name: "Cristian Di Battista", birthYear: 2008 },
    { name: "Filippo Colafrancesco", position: 'LWB', birthYear: 2008, preferredFoot: 'Sinistro' },
    { name: "Yankhoba Ndao", position: 'LWB / LS', birthYear: 2009, heightCm: 182, preferredFoot: 'Sinistro' },
    { name: "Gabriele Valente", position: 'RS / RCM', birthYear: 2009 },
    { name: "Jacopo Couto Rissone", birthYear: 2009, preferredFoot: 'Sinistro' },
    { name: "Andrea Mirenzi", position: 'RWB / CM', birthYear: 2008, preferredFoot: 'Destro' },
    { name: "Andrea Castellani", position: 'RCM / LCB', birthYear: 2008, preferredFoot: 'Destro' },
    { name: "Domenico Agostini", birthYear: 2009, preferredFoot: 'Destro' },
    { name: "Francesco Millozzi", position: 'RCM / RS', birthYear: 2008, preferredFoot: 'Destro' },
    { name: "Lorenzo Menghini", position: 'LCM', birthYear: 2008, preferredFoot: 'Destro' },
    { name: "Valerio Esposito", position: 'LCB', birthYear: 2009, heightCm: 170, preferredFoot: 'Sinistro' },
    { name: "Matteo Marchetti", position: 'RCM / LS / LWB', birthYear: 2009 },
    { name: "Federico Montesano", birthYear: 2009, preferredFoot: 'Ambidestro' },
    { name: "Matteo Carfagna", position: 'LS', birthYear: 2008, preferredFoot: 'Destro' },
    { name: "Lorenzo Trulli", birthYear: 2009 },
    { name: "Leonardo Taddei", position: 'CM / LWB', birthYear: 2009 },
    { name: "Gianfilippo Casagrande", position: 'CM / LS', birthYear: 2009, heightCm: 172, preferredFoot: 'Ambidestro' },
    { name: "Lorenzo Giurdanella", birthYear: 2009 },
    { name: "Alessio Danieli", position: 'RWB', birthYear: 2008, preferredFoot: 'Sinistro' },
    { name: "Christian Carpentieri", position: 'RS', birthYear: 2008, preferredFoot: 'Ambidestro' },
    { name: "Fabio Polinari", position: 'LS / RS', birthYear: 2008, heightCm: 175, preferredFoot: 'Destro' },
    { name: "Manuel Silvestri", birthYear: 2009 },
    { name: "Alessandro Castroreale", position: 'LS / RCM', birthYear: 2009, heightCm: 184, preferredFoot: 'Destro' },
    { name: "Roberto Morra", birthYear: 2009 },
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
  {
    id: 'spezia-ref-latina',
    title: {
      en: 'Spezia vs Latina 1–5',
      it: 'Spezia vs Latina 1–5',
    },
    competition: {
      en: 'Primavera 2 · Matchday 5',
      it: 'Primavera 2 · Giornata 5',
    },
    score: '1–5',
    videoFile: 'https://vimeo.com/1236863969/e056daf97a',
  },
], [
  {
    id: 'spezia-studio-report',
    title: {
      en: 'Studio Spezia',
      it: 'Studio Spezia',
    },
    description: {
      en: 'Opposition studio report (Avversari → Studio Report).',
      it: 'Studio report avversario (Avversari → Studio Report).',
    },
    videoFile: 'https://vimeo.com/1238418484/eeb265e0bd',
    tags: ['vimeo', 'opposition', 'studio-report'],
  },
]);

{
  const sp = OPPONENTS.find((o) => o.id === 'spezia');
  const leaguePack = sp?.fixturePacks['2026-10-24_campionato-u19-vs-spezia'];
  attachReferencePack(
    'spezia',
    '2026-10-28_coppa-italia-u19-vs-spezia',
    leaguePack?.referenceMatches ?? [],
    [
      {
        id: 'spezia-coppa-studio-report',
        title: {
          en: 'Studio Spezia (Coppa Italia)',
          it: 'Studio Spezia (Coppa Italia)',
        },
        description: {
          en: 'Opposition studio report (Avversari → Coppa Italia → Spezia → Studio Report).',
          it: 'Studio report avversario (Avversari → Coppa Italia → Spezia → Studio Report).',
        },
        videoFile: 'https://vimeo.com/1239647055/2e68ba2908',
        tags: ['vimeo', 'opposition', 'studio-report'],
      },
    ]
  );
}

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
  {
    id: 'monopoli-ref-benevento',
    title: {
      en: 'Monopoli vs Benevento 2–2',
      it: 'Monopoli vs Benevento 2–2',
    },
    competition: {
      en: 'Primavera 2 · Matchday 5',
      it: 'Primavera 2 · Giornata 5',
    },
    score: '2–2',
    videoFile: 'https://vimeo.com/1237874247/1c2787edc8',
  },
]);

attachReferencePack('frosinone', '2026-11-07_campionato-u19-vs-frosinone', [
  {
    id: 'frosinone-ref-cosenza',
    title: {
      en: 'Cosenza vs Frosinone 1–2',
      it: 'Cosenza vs Frosinone 1–2',
    },
    competition: {
      en: 'Primavera 2 · Matchday 5',
      it: 'Primavera 2 · Giornata 5',
    },
    score: '1–2',
    videoFile: 'https://vimeo.com/1237876189/9c9f91db5c',
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

attachReferencePack(
  'bodo-glimt',
  '2026-10-20_uyl-u19-vs-bodo-glimt',
  [
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
  ],
  [
    {
      id: 'bodo-studio-report',
      title: {
        en: 'Studio Bodø/Glimt',
        it: 'Studio Bodø/Glimt',
      },
      description: {
        en: 'Opposition studio report (Avversari → Studio Report).',
        it: 'Studio report avversario (Avversari → Studio Report).',
      },
      videoFile: 'https://vimeo.com/1237225036/b2fc9bbaf5',
      tags: ['vimeo', 'opposition', 'studio-report'],
    },
  ]
);

attachReferencePack(
  'monopoli',
  '2026-10-31_campionato-monopoli-vs-u19',
  [
    {
      id: 'monopoli-ref-ascoli',
      title: {
        en: 'Ascoli vs Monopoli 0–2',
        it: 'Ascoli vs Monopoli 0–2',
      },
      competition: {
        en: 'Primavera 2 · Matchday 6',
        it: 'Primavera 2 · Giornata 6',
      },
      score: '0–2',
      date: '2026-10-24',
      videoFile: 'https://vimeo.com/1239270820/7b70199d35',
    },
    {
      id: 'monopoli-ref-benevento',
      title: {
        en: 'Monopoli vs Benevento 2–2',
        it: 'Monopoli vs Benevento 2–2',
      },
      competition: {
        en: 'Primavera 2 · Matchday 5',
        it: 'Primavera 2 · Giornata 5',
      },
      score: '2–2',
      date: '2026-10-17',
      videoFile: 'https://vimeo.com/1237874247/1c2787edc8',
    },
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
      date: '2026-10-10',
      videoFile: 'https://vimeo.com/1235994929/30860268db',
    },
  ]
);

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

/** Spezia set pieces (vs Napoli, 24 Oct 2026) — for Coppa Italia 28 Oct. Vimeo: Angoli / Punizioni / Falli Laterali Spezia. */
{
  const speziaSp = OPPONENTS.find((o) => o.id === "spezia");
  if (speziaSp) {
    speziaSp.clips = [
      ...speziaSp.clips,
      {
        id: "spezia-sp-corner-1239267842",
        title: { en: "Corner Spezia 1", it: "Angolo Spezia 1" },
        comments: { en: "Napoli vs Spezia, 24 Oct 2026", it: "Napoli vs Spezia, 24 ott 2026" },
        videoFile: "https://vimeo.com/1239267842/31ff3b9af6",
        section: "attacking-corners",
        tags: ["vimeo", "opposition", "set-piece"],
      },
      {
        id: "spezia-sp-corner-1239267966",
        title: { en: "Corner Spezia 2", it: "Angolo Spezia 2" },
        comments: { en: "Napoli vs Spezia, 24 Oct 2026", it: "Napoli vs Spezia, 24 ott 2026" },
        videoFile: "https://vimeo.com/1239267966/41d83a566f",
        section: "attacking-corners",
        tags: ["vimeo", "opposition", "set-piece"],
      },
      {
        id: "spezia-sp-corner-1239267844",
        title: { en: "Corner Spezia 3", it: "Angolo Spezia 3" },
        comments: { en: "Napoli vs Spezia, 24 Oct 2026", it: "Napoli vs Spezia, 24 ott 2026" },
        videoFile: "https://vimeo.com/1239267844/5bbfb662b6",
        section: "attacking-corners",
        tags: ["vimeo", "opposition", "set-piece"],
      },
      {
        id: "spezia-sp-corner-1239267841",
        title: { en: "Corner Spezia 4", it: "Angolo Spezia 4" },
        comments: { en: "Napoli vs Spezia, 24 Oct 2026", it: "Napoli vs Spezia, 24 ott 2026" },
        videoFile: "https://vimeo.com/1239267841/c860dbce6e",
        section: "attacking-corners",
        tags: ["vimeo", "opposition", "set-piece"],
      },
      {
        id: "spezia-sp-corner-1239267843",
        title: { en: "Corner Spezia 5", it: "Angolo Spezia 5" },
        comments: { en: "Napoli vs Spezia, 24 Oct 2026", it: "Napoli vs Spezia, 24 ott 2026" },
        videoFile: "https://vimeo.com/1239267843/0526e30b75",
        section: "attacking-corners",
        tags: ["vimeo", "opposition", "set-piece"],
      },
      {
        id: "spezia-sp-fk-1239268732",
        title: { en: "Free kick Spezia 1", it: "Punizione Spezia 1" },
        comments: { en: "9' · Napoli vs Spezia, 24 Oct 2026", it: "9' · Napoli vs Spezia, 24 ott 2026" },
        videoFile: "https://vimeo.com/1239268732/d66830c1c5",
        section: "attacking-free-kicks",
        tags: ["vimeo", "opposition", "set-piece"],
      },
      {
        id: "spezia-sp-fk-1239268774",
        title: { en: "Free kick Spezia 2", it: "Punizione Spezia 2" },
        comments: { en: "26' · Napoli vs Spezia, 24 Oct 2026", it: "26' · Napoli vs Spezia, 24 ott 2026" },
        videoFile: "https://vimeo.com/1239268774/b42862bb69",
        section: "attacking-free-kicks",
        tags: ["vimeo", "opposition", "set-piece"],
      },
      {
        id: "spezia-sp-fk-1239268729",
        title: { en: "Free kick Spezia 3", it: "Punizione Spezia 3" },
        comments: { en: "34' · Napoli vs Spezia, 24 Oct 2026", it: "34' · Napoli vs Spezia, 24 ott 2026" },
        videoFile: "https://vimeo.com/1239268729/677f287e32",
        section: "attacking-free-kicks",
        tags: ["vimeo", "opposition", "set-piece"],
      },
      {
        id: "spezia-sp-fk-1239268731",
        title: { en: "Free kick Spezia 4", it: "Punizione Spezia 4" },
        comments: { en: "44' · Napoli vs Spezia, 24 Oct 2026", it: "44' · Napoli vs Spezia, 24 ott 2026" },
        videoFile: "https://vimeo.com/1239268731/74279e1f57",
        section: "attacking-free-kicks",
        tags: ["vimeo", "opposition", "set-piece"],
      },
      {
        id: "spezia-sp-fk-1239268730",
        title: { en: "Free kick Spezia 5", it: "Punizione Spezia 5" },
        comments: { en: "47' · Napoli vs Spezia, 24 Oct 2026", it: "47' · Napoli vs Spezia, 24 ott 2026" },
        videoFile: "https://vimeo.com/1239268730/038607b5eb",
        section: "attacking-free-kicks",
        tags: ["vimeo", "opposition", "set-piece"],
      },
      {
        id: "spezia-sp-fk-1239268776",
        title: { en: "Free kick Spezia 6", it: "Punizione Spezia 6" },
        comments: { en: "48' · Napoli vs Spezia, 24 Oct 2026", it: "48' · Napoli vs Spezia, 24 ott 2026" },
        videoFile: "https://vimeo.com/1239268776/9e811f891a",
        section: "attacking-free-kicks",
        tags: ["vimeo", "opposition", "set-piece"],
      },
      {
        id: "spezia-sp-throw-1239268811",
        title: { en: "Throw-in Spezia 1", it: "Fallo laterale Spezia 1" },
        comments: { en: "49' · Napoli vs Spezia, 24 Oct 2026", it: "49' · Napoli vs Spezia, 24 ott 2026" },
        videoFile: "https://vimeo.com/1239268811/db0c10d810",
        section: "attacking-throw-ins",
        tags: ["vimeo", "opposition", "set-piece"],
      },
      {
        id: "spezia-sp-throw-1239268800",
        title: { en: "Throw-in Spezia 2", it: "Fallo laterale Spezia 2" },
        comments: { en: "60' · Napoli vs Spezia, 24 Oct 2026", it: "60' · Napoli vs Spezia, 24 ott 2026" },
        videoFile: "https://vimeo.com/1239268800/d70ed2a3fb",
        section: "attacking-throw-ins",
        tags: ["vimeo", "opposition", "set-piece"],
      },
      {
        id: "spezia-sp-throw-1239268799",
        title: { en: "Throw-in Spezia 3", it: "Fallo laterale Spezia 3" },
        comments: { en: "61' · Napoli vs Spezia, 24 Oct 2026", it: "61' · Napoli vs Spezia, 24 ott 2026" },
        videoFile: "https://vimeo.com/1239268799/badf1844ba",
        section: "attacking-throw-ins",
        tags: ["vimeo", "opposition", "set-piece"],
      },
    ];
  }
}
