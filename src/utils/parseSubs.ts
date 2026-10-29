import type { PitchPlayer } from '../types/match';

export interface ParsedSub {
  name: string;
  minute?: string;
  replaced?: string;
  role?: string;
}

const norm = (s: string) =>
  s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z']/g, ' ').trim();

/** Role from pitch coordinates (team attacks downward: team-left = screen-right). */
export function inferRole(p: PitchPlayer): string | undefined {
  if (p.role) return p.role;
  if (p.isGk) return 'GK';
  const top = parseFloat(p.top ?? '');
  const left = parseFloat(p.left);
  if (!Number.isFinite(top) || !Number.isFinite(left)) return undefined;
  const side = left >= 70 ? 'L' : left <= 30 ? 'R' : left > 55 ? 'LC' : left < 45 ? 'RC' : 'C';
  if (top < 30) return side === 'L' ? 'LB' : side === 'R' ? 'RB' : side === 'C' ? 'CB' : `${side[0]}CB`;
  if (top < 42) return side === 'C' ? 'CDM' : side.length === 2 ? `${side[0]}DM` : `${side}WB`;
  if (top < 64) return side === 'L' ? 'LM' : side === 'R' ? 'RM' : side === 'C' ? (top < 55 ? 'CM' : 'CAM') : `${side[0]}CM`;
  return side === 'L' ? 'LW' : side === 'R' ? 'RW' : side === 'C' ? 'ST' : `${side[0]}ST`;
}

function findRole(name: string | undefined, pools: { name: string; role?: string; position?: string }[]) {
  if (!name) return undefined;
  const n = norm(name);
  const hit = pools.find((p) => norm(p.name) === n) ?? pools.find((p) => {
    const pn = norm(p.name);
    return pn === n || pn.endsWith(` ${n}`) || n.endsWith(` ${pn}`) || pn.split(' ').pop() === n.split(' ').pop();
  });
  if (!hit) return undefined;
  return 'left' in hit ? inferRole(hit as PitchPlayer) : hit.position;
}

/**
 * Parse the "Subs: …" part of scouted-formation notes into structured subs.
 * Supports "X for Y 51'", "X 57′ (Y)" and plain "A, B, C" lists. The sub's
 * position is the replaced starter's role; otherwise the squad position.
 */
export function parseSubs(
  notes: string | undefined,
  starters: PitchPlayer[],
  squad: { name: string; position?: string }[],
): ParsedSub[] {
  if (!notes) return [];
  const m = notes.match(/Subs(?: used)?:\s*([^]*?)(?:(?<!\b[A-Z])\.\s|\.$|\s\(switch|$)/);
  if (!m) return [];
  const out: ParsedSub[] = [];
  for (const raw of m[1].split(/,\s*/)) {
    const part = raw.trim().replace(/\.$/, '');
    if (!part) continue;
    let name: string | undefined, minute: string | undefined, replaced: string | undefined;
    let r = part.match(/^(.+?)\s+for\s+(.+?)\s+(HT|[~\d+–-]+\s*['′]?)$/);
    if (r) [name, replaced, minute] = [r[1], r[2], r[3]];
    else if ((r = part.match(/^(.*?)\s*([~\d+–-]+\s*['′])\s*\((.+)\)$/))) [name, minute, replaced] = [r[1], r[2], r[3]];
    else name = part;
    name = name?.trim();
    if (!name) continue;
    minute = minute?.replace(/\s/g, '').replace(/'/g, '′');
    if (minute && minute !== 'HT' && !minute.endsWith('′')) minute += '′';
    const role = findRole(replaced, starters) ?? findRole(name, squad);
    out.push({ name, minute, replaced: replaced?.trim(), role });
  }
  return out;
}
