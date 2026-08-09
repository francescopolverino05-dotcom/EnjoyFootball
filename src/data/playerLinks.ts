import draftClipMap from './playerClipDraft.json';
import { getAllPlayers, getPlayerBySlug } from './players';
import { getAllMatches, getMatchBySlug } from './matches';
import type { Locale, Localized } from '../i18n/translations';
import type {
  MatchData,
  PlayerAppearance,
  VideoClip,
} from '../types/match';
import type { Player } from '../types/player';

export type AppearanceSource = 'appearances' | 'formation' | 'goals';

export interface LinkedPlayerClip {
  clip: VideoClip;
  matchSlug: string;
  matchTitle: Localized;
  matchDate: string;
  /** true when tag comes from draft overlay, not clip.playerSlugs */
  draftTagged: boolean;
}

export interface PlayerMatchLink {
  matchSlug: string;
  matchTitle: Localized;
  matchDate: string;
  competition: Localized;
  score: { home: number; away: number };
  homeTeam: string;
  awayTeam: string;
  appearance: PlayerAppearance | null;
  source: AppearanceSource;
  goals: number[];
  assists: number[];
  clips: LinkedPlayerClip[];
}

interface DraftClipLink {
  matchSlug: string;
  clipId: string;
  playerSlugs: string[];
}

const draftLinks = (draftClipMap as { links: DraftClipLink[] }).links;

function normalizeKey(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '');
}

function tokens(value: string): string[] {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);
}

function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (!a.length) return b.length;
  if (!b.length) return a.length;
  const row = Array.from({ length: b.length + 1 }, (_, i) => i);
  for (let i = 1; i <= a.length; i += 1) {
    let prev = i - 1;
    row[0] = i;
    for (let j = 1; j <= b.length; j += 1) {
      const next = row[j];
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + cost);
      prev = next;
    }
  }
  return row[b.length];
}

/** Map free-text match names (appearances / goals / pitch) onto roster players. */
export function resolvePlayerFromMatchName(
  rawName: string,
  players: Player[] = getAllPlayers()
): Player | undefined {
  const name = rawName.trim();
  if (!name || /^u18/i.test(name) || name === 'GK') return undefined;

  const nameKey = normalizeKey(name);
  const nameTokens = tokens(name);
  if (!nameKey) return undefined;

  const exact = players.find((player) => {
    const displayKey = normalizeKey(player.displayName);
    if (displayKey === nameKey) return true;
    const parts = tokens(player.displayName);
    if (parts.length === 0) return false;
    // Roster is "Surname Firstnames…" — match surname or full surname phrase.
    if (parts[0] === nameTokens[0] && nameTokens.length === 1) return true;
    if (nameTokens.length > 1) {
      const surnamePhrase = nameTokens.join('');
      const playerSurname = parts.slice(0, nameTokens.length).join('');
      if (surnamePhrase === playerSurname) return true;
    }
    return parts.some((part) => part === nameKey);
  });
  if (exact) return exact;

  // Soft match for typos (e.g. Branchizzo → Branchizio)
  const fuzzy = players.filter((player) => {
    const surname = tokens(player.displayName)[0] ?? '';
    if (surname.length < 4 || nameKey.length < 4) return false;
    return editDistance(surname, nameKey) <= 1;
  });
  return fuzzy.length === 1 ? fuzzy[0] : undefined;
}

function napoliAppearanceRows(match: MatchData): {
  rows: PlayerAppearance[];
  source: AppearanceSource;
} {
  if (match.appearances?.home?.length) {
    const homeId = match.homeTeam.id;
    const rows = match.appearances.home.filter((row) => row.teamId === homeId);
    if (rows.length) return { rows, source: 'appearances' };
  }

  const formation = match.formations.find((f) => f.teamId === match.homeTeam.id);
  if (formation?.players?.length) {
    return {
      source: 'formation',
      rows: formation.players
        .filter((p) => p.name && p.name !== 'GK')
        .map((p) => ({
          name: p.name,
          teamId: match.homeTeam.id,
          number: p.number,
          starter: true,
          onMinute: 0,
        })),
    };
  }

  return { rows: [], source: 'goals' };
}

function draftSlugsForClip(matchSlug: string, clipId: string): string[] {
  return draftLinks
    .filter((link) => link.matchSlug === matchSlug && link.clipId === clipId)
    .flatMap((link) => link.playerSlugs);
}

function clipPlayerSlugs(matchSlug: string, clip: VideoClip): {
  slugs: string[];
  draftTagged: boolean;
} {
  const fromClip = clip.playerSlugs ?? [];
  const fromDraft = draftSlugsForClip(matchSlug, clip.id);
  const slugs = [...new Set([...fromClip, ...fromDraft])];
  return {
    slugs,
    draftTagged: fromDraft.length > 0 && fromClip.length === 0,
  };
}

function estimatedMinutes(
  appearance: PlayerAppearance | null
): number | null {
  if (!appearance) return null;
  const on = appearance.onMinute ?? (appearance.starter ? 0 : null);
  if (on == null) return null;
  const off = appearance.offMinute ?? 90;
  return Math.max(0, off - on);
}

export function getPlayerMatchLinks(playerSlug: string): PlayerMatchLink[] {
  const player = getPlayerBySlug(playerSlug);
  if (!player) return [];

  const matches = getAllMatches()
    .map((summary) => getMatchBySlug(summary.slug))
    .filter((match): match is MatchData => Boolean(match))
    .sort((a, b) => b.date.localeCompare(a.date));

  const links: PlayerMatchLink[] = [];

  for (const match of matches) {
    const { rows, source } = napoliAppearanceRows(match);
    const appearance =
      rows.find((row) => resolvePlayerFromMatchName(row.name)?.slug === playerSlug) ??
      null;

    const goals = match.goals
      .filter(
        (goal) =>
          goal.teamId === match.homeTeam.id &&
          resolvePlayerFromMatchName(goal.scorer)?.slug === playerSlug
      )
      .map((goal) => goal.minute);

    const assists = match.goals
      .filter(
        (goal) =>
          goal.teamId === match.homeTeam.id &&
          goal.assist &&
          resolvePlayerFromMatchName(goal.assist)?.slug === playerSlug
      )
      .map((goal) => goal.minute);

    const appearanceGoals = appearance?.goals ?? [];
    const appearanceAssists = appearance?.assists ?? [];
    const allGoals = [...new Set([...goals, ...appearanceGoals])].sort(
      (a, b) => a - b
    );
    const allAssists = [...new Set([...assists, ...appearanceAssists])].sort(
      (a, b) => a - b
    );

    const clips: LinkedPlayerClip[] = [];
    for (const clip of match.clips ?? []) {
      const { slugs, draftTagged } = clipPlayerSlugs(match.slug, clip);
      if (!slugs.includes(playerSlug)) continue;
      clips.push({
        clip,
        matchSlug: match.slug,
        matchTitle: match.title,
        matchDate: match.date,
        draftTagged,
      });
    }
    clips.sort(
      (a, b) =>
        a.clip.minute - b.clip.minute ||
        (a.clip.second ?? 0) - (b.clip.second ?? 0)
    );

    if (!appearance && allGoals.length === 0 && clips.length === 0) {
      continue;
    }

    const resolvedAppearance: PlayerAppearance | null = appearance
      ? {
          ...appearance,
          goals: allGoals.length ? allGoals : appearance.goals,
          assists: allAssists.length ? allAssists : appearance.assists,
        }
      : allGoals.length || allAssists.length
        ? {
            name: player.displayName,
            teamId: match.homeTeam.id,
            goals: allGoals,
            assists: allAssists,
          }
        : null;

    links.push({
      matchSlug: match.slug,
      matchTitle: match.title,
      matchDate: match.date,
      competition: match.competition,
      score: match.score,
      homeTeam: match.homeTeam.shortName,
      awayTeam: match.awayTeam.shortName,
      appearance: resolvedAppearance,
      source: appearance ? source : 'goals',
      goals: allGoals,
      assists: allAssists,
      clips,
    });
  }

  return links;
}

export function getPlayerSlugForAppearanceName(
  name: string
): string | undefined {
  return resolvePlayerFromMatchName(name)?.slug;
}

export function getPlayersForClip(
  matchSlug: string,
  clip: VideoClip
): { player: Player; draftTagged: boolean }[] {
  const { slugs, draftTagged } = clipPlayerSlugs(matchSlug, clip);
  return slugs
    .map((slug) => {
      const player = getPlayerBySlug(slug);
      return player ? { player, draftTagged } : null;
    })
    .filter((row): row is { player: Player; draftTagged: boolean } =>
      Boolean(row)
    );
}

export function formatAppearanceMinutes(
  appearance: PlayerAppearance | null,
  locale: Locale
): string {
  if (!appearance) return locale === 'it' ? '—' : '—';
  const on = appearance.onMinute;
  const off = appearance.offMinute;
  if (appearance.starter && off != null) {
    return locale === 'it' ? `Titolare · OUT ${off}'` : `Started · OFF ${off}'`;
  }
  if (appearance.starter) {
    return locale === 'it' ? 'Titolare' : 'Started';
  }
  if (on != null && off != null) {
    return `IN ${on}' · OUT ${off}'`;
  }
  if (on != null) {
    return `IN ${on}'`;
  }
  return '—';
}

export function appearanceMinutesPlayed(
  appearance: PlayerAppearance | null
): number | null {
  return estimatedMinutes(appearance);
}
