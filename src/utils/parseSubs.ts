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

function starterUnplaced(name: string | undefined, starters: PitchPlayer[]): boolean {
  if (!name) return false;
  const n = norm(name);
  const hit = starters.find((p) => {
    const pn = norm(p.name);
    return pn === n || pn.endsWith(` ${n}`) || n.endsWith(` ${pn}`) || pn.split(' ').pop() === n.split(' ').pop();
  });
  return Boolean(hit?.positionUnknown);
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
 * Supports "X for Y 51'", "X for Y 21′ st (66′)", "Subs (distinta):", "X 57′ (Y)" and plain lists. The sub's
 * position is the replaced starter's role; otherwise the squad position.
 * A starter whose pitch position was not recorded does not lend a squad role.
 */
export function parseSubs(
  notes: string | undefined,
  starters: PitchPlayer[],
  squad: { name: string; position?: string }[],
): ParsedSub[] {
  if (!notes) return [];
  // "Subs:", "Subs used:", or "Subs (distinta):" / "Subs (club):"
  const m = notes.match(/Subs(?:\s*\([^)]*\))?(?: used)?:\s*([^]*?)(?:(?<!\b[A-Z])\.\s|\.$|\s\(switch|$)/);
  if (!m) return [];
  const out: ParsedSub[] = [];
  for (const raw of m[1].split(/,\s*/)) {
    const part = raw.trim().replace(/\.$/, '');
    if (!part) continue;
    let name: string | undefined, minute: string | undefined, replaced: string | undefined;
    // "X for Y 64′", "X for Y 21′ st (66′)", "X 19 for Y 15′ st"
    let r = part.match(/^(.+?)\s+for\s+(.+?)\s+(HT|[~\d+–-]+\s*['′]?)(?:\s*(pt|st))?(?:\s*\(([^)]+)\))?$/i);
    if (r) {
      name = stripShirt(r[1]);
      replaced = stripShirt(r[2]);
      minute = clockMinute(r[3], r[4], r[5]);
    } else if ((r = part.match(/^(.*?)\s*([~\d+–-]+\s*['′])\s*\((.+)\)$/))) {
      name = stripShirt(r[1]);
      minute = formatMinute(r[2]);
      replaced = stripShirt(r[3]);
    } else name = stripShirt(part);
    name = name?.trim();
    if (!name) continue;
    const role = starterUnplaced(replaced, starters)
      ? undefined
      : (findRole(replaced, starters) ?? findRole(name, squad));
    out.push({ name, minute, replaced: replaced?.trim(), role });
  }
  return out;
}

/** Drop trailing match-day shirts ("Iachini 19", "Iachini (#19)"). */
function stripShirt(s: string): string {
  return s.replace(/\s*\(#\d+\)/g, '').replace(/\s+#?\d+\s*$/g, '').replace(/\s+/g, ' ').trim();
}

function formatMinute(raw: string): string {
  const minute = raw.replace(/\s/g, '').replace(/'/g, '′');
  if (minute.toUpperCase() === 'HT') return 'HT';
  return minute.endsWith('′') ? minute : `${minute}′`;
}

/**
 * Prefer an explicit clock minute in parentheses ("21′ st (66′)").
 * A bare "15′ st" with no clock is treated as second-half 45+15.
 */
function clockMinute(raw: string, half?: string, paren?: string): string {
  if (paren) {
    const hit = paren.trim().match(/[~\d+–-]+\s*['′]?/);
    if (hit) return formatMinute(hit[0]);
  }
  if (/^HT$/i.test(raw.trim())) return 'HT';
  const formatted = formatMinute(raw);
  if (half && /^st$/i.test(half)) {
    const n = parseInt(formatted, 10);
    if (Number.isFinite(n) && n <= 45 && !formatted.includes('+')) return `${n + 45}′`;
  }
  return formatted;
}
