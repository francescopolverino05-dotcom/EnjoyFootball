import raw from './gacon-load.json';
import type {
  GaconLoadDataset,
  GaconPlayerEntry,
  GaconSession,
} from '../types/gacon';

const data = raw as GaconLoadDataset;

export function getGaconDataset(): GaconLoadDataset {
  return data;
}

export function getAllGaconSessions(): GaconSession[] {
  return data.sessions;
}

export function getGaconSessionByTrainingSlug(
  trainingSlug: string
): GaconSession | undefined {
  return data.sessions.find((s) => s.trainingSlug === trainingSlug);
}

export function getGaconSessionByMatchSlug(
  matchSlug: string
): GaconSession | undefined {
  return data.sessions.find((s) => s.matchSlug === matchSlug);
}

export function getGaconSessionByDate(date: string): GaconSession | undefined {
  return data.sessions.find((s) => s.date === date);
}

export interface PlayerGaconPoint {
  date: string;
  kind: GaconSession['kind'];
  trainingSlug: string | null;
  matchSlug: string | null;
  vamKmh: number;
  teamAvgVamKmh: number | null;
}

export function getPlayerGaconTimeline(playerSlug: string): PlayerGaconPoint[] {
  const points: PlayerGaconPoint[] = [];
  for (const session of data.sessions) {
    const entry = session.players.find((p) => p.playerSlug === playerSlug);
    if (!entry) continue;
    points.push({
      date: session.date,
      kind: session.kind,
      trainingSlug: session.trainingSlug,
      matchSlug: session.matchSlug,
      vamKmh: entry.vamKmh,
      teamAvgVamKmh: session.avgVamKmh,
    });
  }
  return points;
}

export function sortPlayersByVam(
  players: GaconPlayerEntry[]
): GaconPlayerEntry[] {
  return [...players].sort(
    (a, b) => b.vamKmh - a.vamKmh || a.playerSlug.localeCompare(b.playerSlug)
  );
}

export function formatVam(
  value: number | null | undefined,
  digits = 1
): string {
  if (value == null || Number.isNaN(value)) return '—';
  return Number.isInteger(value) ? String(value) : value.toFixed(digits);
}
