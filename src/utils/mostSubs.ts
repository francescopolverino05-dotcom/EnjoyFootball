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
