import type { Formation } from '../types/match';

export interface MostSubRow {
  name: string;
  count: number;
  role?: string;
}

/** Players who came on most often across the given formations' subs. */
export function computeMostSubs(formations: Pick<Formation, 'subs'>[]): MostSubRow[] {
  const m = new Map<string, { name: string; count: number; roles: Record<string, number> }>();
  for (const f of formations) {
    for (const sub of f.subs ?? []) {
      const k = sub.name.trim().toLowerCase();
      const e = m.get(k) ?? { name: sub.name.trim(), count: 0, roles: {} };
      e.count += 1;
      if (sub.role) e.roles[sub.role] = (e.roles[sub.role] ?? 0) + 1;
      m.set(k, e);
    }
  }
  return [...m.values()]
    .map((e) => ({ name: e.name, count: e.count, role: Object.entries(e.roles).sort((a, b) => b[1] - a[1])[0]?.[0] }))
    .sort((a, b) => b.count - a.count || a.name.localeCompare(b.name));
}

const nameTokens = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z. ]/g, ' ')
    .split(/\s+/)
    .filter(Boolean);

/**
 * Replace each row's role with the player's own squad position (their usual role),
 * matching the short sub name ("D. Cunha", "Fajardo Duarte", "Oliveira") to one squad
 * player. Rows with no unique match keep the role they already have.
 */
export function withSquadRoles(
  rows: MostSubRow[],
  squad: { name: string; position?: string | null }[]
): MostSubRow[] {
  return rows.map((row) => {
    const rt = nameTokens(row.name);
    const initial = rt.length > 1 && /^[a-z]\.$/.test(rt[0]) ? rt[0][0] : null;
    const need = initial ? rt.slice(1) : rt;
    const hits = squad.filter((p) => {
      if (!p.position) return false;
      const pt = nameTokens(p.name);
      if (!need.every((t) => pt.includes(t))) return false;
      return initial ? pt[0][0] === initial : true;
    });
    return hits.length === 1 ? { ...row, role: hits[0].position ?? row.role } : row;
  });
}
