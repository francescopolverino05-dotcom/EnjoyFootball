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
  club('arsenal', 'Arsenal', ['uefaYouthLeague']),
  club('villarreal', 'Villarreal', ['uefaYouthLeague']),
  club('bodo-glimt', 'Bodø/Glimt', ['uefaYouthLeague']),
  club('porto', 'Porto', ['uefaYouthLeague']),
  club('man-city', 'Manchester City', ['uefaYouthLeague']),
  club('club-brugge', 'Club Brugge', ['uefaYouthLeague']),
];

/** Reference tapes from Vimeo Avversari folders (synced manually from folder uploads). */
function attachReferencePack(
  opponentId: string,
  matchSlug: string,
  references: OppositionOpponent['fixturePacks'][string]['referenceMatches']
) {
  const opponent = OPPONENTS.find((o) => o.id === opponentId);
  if (!opponent) return;
  opponent.fixturePacks[matchSlug] = {
    referenceMatches: references,
    reportItems: opponent.fixturePacks[matchSlug]?.reportItems ?? [],
    strengthsWeaknesses:
      opponent.fixturePacks[matchSlug]?.strengthsWeaknesses ??
      EMPTY_STRENGTHS_WEAKNESSES,
  };
}

attachReferencePack('avellino', '2026-09-05_campionato-avellino-vs-u19', [
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
]);

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
