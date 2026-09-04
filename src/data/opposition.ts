import type { PitchPlayer } from '../types/match';
import type { MatchSummary } from '../types/match';
import type {
  OppositionCompetitionId,
  OppositionFixturePack,
  OppositionOpponent,
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

export function placeholderPlayersForSystem(
  system: string,
  teamId: string
): PitchPlayer[] {
  const key = system.trim().replace(/–/g, '-');
  if (key === '1-4-2-3-1' || key === '4-2-3-1') {
    return placeholder14231(teamId);
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
  club('ascoli', 'Ascoli', ['primavera2']),
  club('avellino', 'Avellino', ['primavera2'], '1-4-3-3', ['1-4-2-3-1']),
  club('bari', 'Bari', ['primavera2']),
  club('benevento', 'Benevento', ['primavera2']),
  club('catanzaro', 'Catanzaro', ['primavera2']),
  club('cosenza', 'Cosenza', ['primavera2']),
  club('frosinone', 'Frosinone', ['primavera2']),
  club('latina', 'Latina', ['primavera2']),
  club('monopoli', 'Monopoli', ['primavera2']),
  club('palermo', 'Palermo', ['primavera2']),
  club('perugia', 'Perugia', ['primavera2']),
  club('pescara', 'Pescara', ['primavera2']),
  club('pisa', 'Pisa', ['primavera2']),
  club('salernitana', 'Salernitana', ['primavera2']),
  club('spezia', 'Spezia', ['primavera2', 'coppaItalia']),
  club('arsenal', 'Arsenal', ['uefaYouthLeague'], '1-4-2-3-1'),
  club('villarreal', 'Villarreal', ['uefaYouthLeague']),
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

attachReferencePack('catanzaro', '2026-09-12_campionato-u19-vs-catanzaro', [
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
]);

attachReferencePack('arsenal', '2026-09-09_uyl-u19-vs-arsenal', [
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
]);

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
