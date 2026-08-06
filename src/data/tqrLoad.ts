import raw from './tqr-load.json';
import type { TqrLoadDataset, TqrPlayerEntry, TqrSession } from '../types/tqr';

const data = raw as TqrLoadDataset;

export function getTqrDataset(): TqrLoadDataset {
  return data;
}

export function getAllTqrSessions(): TqrSession[] {
  return data.sessions;
}

export function getTqrSessionByTrainingSlug(
  trainingSlug: string
): TqrSession | undefined {
  return data.sessions.find((s) => s.trainingSlug === trainingSlug);
}

export function getTqrSessionByMatchSlug(
  matchSlug: string
): TqrSession | undefined {
  return data.sessions.find((s) => s.matchSlug === matchSlug);
}

export function getTqrSessionByDate(date: string): TqrSession | undefined {
  return data.sessions.find((s) => s.date === date);
}

export interface PlayerTqrPoint {
  date: string;
  kind: TqrSession['kind'];
  trainingSlug: string | null;
  matchSlug: string | null;
  tqr: number;
  teamAvgTqr: number | null;
}

export function getPlayerTqrTimeline(playerSlug: string): PlayerTqrPoint[] {
  const points: PlayerTqrPoint[] = [];
  for (const session of data.sessions) {
    const entry = session.players.find((p) => p.playerSlug === playerSlug);
    if (!entry) continue;
    points.push({
      date: session.date,
      kind: session.kind,
      trainingSlug: session.trainingSlug,
      matchSlug: session.matchSlug,
      tqr: entry.tqr,
      teamAvgTqr: session.avgTqr,
    });
  }
  return points;
}

export function sortPlayersByTqr(players: TqrPlayerEntry[]): TqrPlayerEntry[] {
  return [...players].sort(
    (a, b) => b.tqr - a.tqr || a.playerSlug.localeCompare(b.playerSlug)
  );
}

export function formatTqr(value: number | null | undefined, digits = 1): string {
  if (value == null || Number.isNaN(value)) return '—';
  return Number.isInteger(value) ? String(value) : value.toFixed(digits);
}
