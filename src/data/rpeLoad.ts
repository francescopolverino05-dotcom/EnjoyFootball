import raw from './rpe-load.json';
import type { RpeLoadDataset, RpePlayerEntry, RpeSession } from '../types/rpe';

const data = raw as RpeLoadDataset;

export function getRpeDataset(): RpeLoadDataset {
  return data;
}

export function getAllRpeSessions(): RpeSession[] {
  return data.sessions;
}

export function getRpeSessionByTrainingSlug(
  trainingSlug: string
): RpeSession | undefined {
  return data.sessions.find((s) => s.trainingSlug === trainingSlug);
}

export function getRpeSessionByMatchSlug(
  matchSlug: string
): RpeSession | undefined {
  return data.sessions.find((s) => s.matchSlug === matchSlug);
}

export function getRpeSessionByDate(date: string): RpeSession | undefined {
  return data.sessions.find((s) => s.date === date);
}

export interface PlayerRpePoint {
  date: string;
  kind: RpeSession['kind'];
  trainingSlug: string | null;
  matchSlug: string | null;
  rpe: number;
  sessionLoad: number | null;
  min: number | null;
  teamAvgRpe: number | null;
  teamAvgSessionLoad: number | null;
}

export function getPlayerRpeTimeline(playerSlug: string): PlayerRpePoint[] {
  const points: PlayerRpePoint[] = [];
  for (const session of data.sessions) {
    const entry = session.players.find((p) => p.playerSlug === playerSlug);
    if (!entry) continue;
    points.push({
      date: session.date,
      kind: session.kind,
      trainingSlug: session.trainingSlug,
      matchSlug: session.matchSlug,
      rpe: entry.rpe,
      sessionLoad: entry.sessionLoad,
      min: entry.min,
      teamAvgRpe: session.avgRpe,
      teamAvgSessionLoad: session.avgSessionLoad,
    });
  }
  return points;
}

export function sortPlayersBySessionLoad(
  players: RpePlayerEntry[]
): RpePlayerEntry[] {
  return [...players].sort(
    (a, b) =>
      (b.sessionLoad ?? 0) - (a.sessionLoad ?? 0) ||
      b.rpe - a.rpe ||
      a.playerSlug.localeCompare(b.playerSlug)
  );
}

export function formatRpe(value: number | null | undefined, digits = 1): string {
  if (value == null || Number.isNaN(value)) return '—';
  return Number.isInteger(value) ? String(value) : value.toFixed(digits);
}

export function formatSessionLoad(
  value: number | null | undefined
): string {
  if (value == null || Number.isNaN(value)) return '—';
  return Math.round(value).toLocaleString('it-IT');
}
