import roster from './players.json';
import type { Player, PlayersRoster } from '../types/player';

const data = roster as PlayersRoster;

export function getAllPlayers(): Player[] {
  return [...data.players].sort((a, b) =>
    a.displayName.localeCompare(b.displayName, 'it')
  );
}

export function getPlayerBySlug(slug: string): Player | undefined {
  return data.players.find((p) => p.slug === slug);
}

/** Resolve a public/ asset path with Vite base (e.g. /EnjoyFootball/ on Pages). */
export function playerPhotoUrl(photoPath: string | null | undefined): string | null {
  if (!photoPath) return null;
  if (/^https?:\/\//i.test(photoPath)) return photoPath;
  const cleaned = photoPath.replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${cleaned}`;
}

export function playerInitials(displayName: string): string {
  const parts = displayName.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return '?';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}
