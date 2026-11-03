/**
 * "SURNAME Given" formatting for names on the opposition pitch graphics.
 *
 * Squad names are stored as "Given Surname" (sometimes several given names, particles,
 * double surnames, an "(alias)", or a bare surname). Pitch labels use short names
 * ("Capanna", "T. Silva", "Alonso Cam."), resolved here against the squad list.
 * Nothing is invented: when a short name cannot be resolved to exactly one squad
 * player, only what the label itself says is shown (e.g. "SILVA T.").
 */

const PARTICLES = new Set([
  'de', 'di', 'da', 'del', 'della', 'dei', 'degli', 'dal', 'dos', 'das', 'do', 'du',
  'van', 'von', 'der', 'den', 'ter', 'ten', 'la', 'le', 'lo', 'el', 'al', 'bin', 'ben', 'st',
]);

/** Clubs whose players carry two surnames (Iberian naming). */
const TWO_SURNAME_TEAMS = new Set(['villarreal', 'porto']);

export interface SplitName {
  surname: string;
  given: string;
  /** How the split was decided; anything other than 'rule' / 'single' is worth reviewing. */
  basis: 'single' | 'rule' | 'iberian-two-surnames' | 'anchor' | 'label';
}

export interface ResolvedPitchName extends SplitName {
  /** The squad entry this label was resolved to (null when unresolved/ambiguous). */
  squadName: string | null;
  status: 'resolved' | 'unresolved' | 'ambiguous';
  /** Captain marker "(c)" carried over from the label. */
  captain: boolean;
}

export function stripDiacritics(s: string): string {
  return s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/ø/gi, 'o').replace(/æ/gi, 'ae');
}

const norm = (s: string) => stripDiacritics(s).toLowerCase().replace(/[().,]/g, '').trim();

function stripAlias(full: string): { name: string; alias: string | null } {
  const m = full.match(/^(.*?)\s*\(([^)]+)\)\s*$/);
  if (!m) return { name: full.trim(), alias: null };
  return { name: m[1].trim(), alias: m[2].trim() };
}

/** Group tokens into units: a particle joins the token(s) that follow it ("De" + "Michele"). */
function toUnits(tokens: string[]): string[][] {
  const units: string[][] = [];
  let pending: string[] = [];
  tokens.forEach((t, i) => {
    const isLast = i === tokens.length - 1;
    if (!isLast && PARTICLES.has(norm(t)) && i > 0) {
      pending.push(t);
      return;
    }
    // A leading particle on the very first token ("De Rossi") also joins the next one.
    if (!isLast && i === 0 && PARTICLES.has(norm(t))) {
      pending.push(t);
      return;
    }
    units.push([...pending, t]);
    pending = [];
  });
  if (pending.length) units.push(pending);
  return units;
}

/**
 * Split a stored full name into surname + given names.
 * `anchors` are other squad entries (bare surnames such as "Blix Olsen"); one that is a
 * strict suffix of this name overrides the rule, because the squad data itself says so.
 */
export function splitFullName(
  full: string,
  teamId: string,
  anchors: string[] = [],
  labelHint?: string[]
): SplitName {
  const { name } = stripAlias(full);
  const tokens = name.split(/\s+/).filter(Boolean);
  if (tokens.length <= 1) return { surname: name, given: '', basis: 'single' };

  const units = toUnits(tokens);
  let surnameTokenCount: number;
  let basis: SplitName['basis'] = 'rule';
  // (A dotted middle initial, as in "Alejandro A. Chavero", is a given name, never half a surname.)
  const penultimateIsInitial = units.length >= 2 && /^[A-Za-zÀ-ÿ]\.$/.test(units[units.length - 2][0]);
  if (TWO_SURNAME_TEAMS.has(teamId) && units.length >= 3 && !penultimateIsInitial) {
    surnameTokenCount = units[units.length - 1].length + units[units.length - 2].length;
    basis = 'iberian-two-surnames';
  } else {
    surnameTokenCount = units[units.length - 1].length;
  }

  // Anchors from the squad list itself (bare multi-word surnames).
  const normTokens = tokens.map(norm);
  for (const a of anchors) {
    const at = a.trim().split(/\s+/).map(norm);
    if (at.length <= surnameTokenCount || at.length >= tokens.length) continue;
    const tail = normTokens.slice(tokens.length - at.length);
    if (tail.every((t, i) => t === at[i])) {
      surnameTokenCount = at.length;
      basis = 'anchor';
    }
  }
  // Anchor from the pitch label ("Alonso Cam." → Alonso Campagna).
  if (labelHint && labelHint.length > 1 && labelHint.length < tokens.length) {
    const tail = tokens.slice(tokens.length - labelHint.length).map(norm);
    const ok = labelHint.every((h, i) => {
      const hn = norm(h);
      return h.endsWith('.') && hn.length > 1 ? tail[i].startsWith(hn) : tail[i] === hn;
    });
    if (ok && labelHint.length > surnameTokenCount) {
      surnameTokenCount = labelHint.length;
      basis = 'anchor';
    }
  }

  const cut = tokens.length - surnameTokenCount;
  return {
    surname: tokens.slice(cut).join(' '),
    given: tokens.slice(0, cut).join(' '),
    basis,
  };
}

interface SquadEntry {
  name: string;
}

/** Parse a pitch label like "T. Silva", "Alonso Cam.", "García Palomar (c)" or "Pablo Polo". */
function parseLabel(raw: string) {
  let s = raw.replace(/^\d+\.\s*/, '').trim();
  const captain = /\(c\)\s*$/i.test(s);
  s = s.replace(/\(c\)\s*$/i, '').trim();
  const tokens = s.split(/\s+/).filter(Boolean);
  const initials = tokens.filter((t) => /^[A-Za-zÀ-ÿ]\.$/.test(t)).map((t) => norm(t));
  const words = tokens.filter((t) => !/^[A-Za-zÀ-ÿ]\.$/.test(t));
  return { tokens, words, initials, captain };
}

function entryTokens(full: string) {
  const { name, alias } = stripAlias(full);
  const toks = name.split(/\s+/).filter(Boolean).map(norm);
  const aliasToks = alias ? alias.split(/\s+/).map(norm) : [];
  return { toks, aliasToks };
}

/** Resolve a pitch label to a squad player and split it. */
export function resolvePitchName(
  label: string,
  squad: SquadEntry[],
  teamId: string
): ResolvedPitchName {
  const { words, initials, captain, tokens } = parseLabel(label);
  const anchors = squad.map((p) => p.name);

  const matches = squad.filter((p) => {
    const { toks, aliasToks } = entryTokens(p.name);
    const all = [...toks, ...aliasToks];
    const wordsOk = words.every((w) => {
      const wn = norm(w);
      if (w.endsWith('.') && wn.length > 1) return all.some((t) => t.startsWith(wn)); // "Cam."
      return all.includes(wn);
    });
    if (!wordsOk) return false;
    if (!initials.length) return true;
    // Initial must be the first letter of the player's first given name.
    return initials.every((i) => toks.length > 1 && toks[0].startsWith(i));
  });

  // Prefer entries that carry a given name; the same player may also appear as a bare surname.
  // (Abbreviated entries such as "D. Cunha" are not full names.)
  const hasInitial = (n: string) => /(^|\s)[A-Za-zÀ-ÿ]\.(\s|$)/.test(n);
  const full = matches.filter((p) => p.name.trim().split(/\s+/).length > 1 && !hasInitial(p.name));
  const pool = full.length ? full : matches;
  const unique = Array.from(new Map(pool.map((p) => [norm(p.name), p])).values());

  if (unique.length === 1) {
    const split = splitFullName(unique[0].name, teamId, anchors, words);
    return { ...split, squadName: unique[0].name, status: 'resolved', captain };
  }

  // Unresolved / ambiguous: show only what the label says. Last word is the surname.
  const status = unique.length === 0 ? 'unresolved' : 'ambiguous';
  if (initials.length && words.length) {
    return { surname: words.join(' '), given: initials.map((i) => i.toUpperCase() + '.').join(' '), basis: 'label', squadName: null, status, captain };
  }
  return { surname: tokens.join(' ').replace(/\s*\(c\)$/i, ''), given: '', basis: 'label', squadName: null, status, captain };
}

/** Initials of the given names: "Angelo Michele" → "A. M." */
export function givenInitials(given: string): string {
  return given
    .split(/\s+/)
    .filter(Boolean)
    .map((g) => (/^[A-Za-zÀ-ÿ]\.$/.test(g) ? g : `${g[0].toUpperCase()}.`))
    .join(' ');
}

/** Rough text width in px at the pitch label font (≈8.5–9.5pt bold/regular sans). */
export function estimateWidthPx(text: string, fontPx = 11.5): number {
  let w = 0;
  for (const ch of text) {
    if (/[A-ZÀ-ÖØ-Þ]/.test(ch)) w += fontPx * 0.68;
    else if (/[ .,\-]/.test(ch)) w += fontPx * 0.3;
    else w += fontPx * 0.53;
  }
  return w;
}

export interface SquadListName {
  surname: string;
  given: string;
  /** "(Polo)"-style nickname stored with the entry, shown after the name. */
  alias: string | null;
  basis: SplitName['basis'] | 'bare-surname';
}

/**
 * Split one squad-table entry for the "SURNAME, Given" display.
 *  - "T. Silva" → SILVA, T.   ·   "De Michele"-style particles stay with the surname
 *  - a bare entry that another, longer entry ends with ("Fajardo Duarte" vs "Leonardo Manuel
 *    Fajardo Duarte") is a surname as stored, so it is kept whole
 *  - nothing is added: a single word is shown as stored.
 */
export function splitSquadListName(full: string, squad: SquadEntry[], teamId: string): SquadListName {
  const { name, alias } = stripAlias(full);
  const toks = name.split(/\s+/).filter(Boolean);
  if (toks.length <= 1) return { surname: name, given: '', alias, basis: 'single' };

  const ntoks = toks.map(norm);
  const isBareSurname = squad.some((p) => {
    if (p.name === full) return false;
    const o = stripAlias(p.name).name.split(/\s+/).filter(Boolean).map(norm);
    return o.length > ntoks.length && ntoks.every((t, i) => o[o.length - ntoks.length + i] === t);
  });
  if (isBareSurname) return { surname: name, given: '', alias, basis: 'bare-surname' };

  const anchors = squad.map((p) => p.name);
  const s = splitFullName(full, teamId, anchors);
  // An alias already visible in the name ("Iván Jiménez Soriano (Iván)") adds nothing: drop it.
  const shown = new Set(`${s.surname} ${s.given}`.split(/\s+/).map(norm));
  const redundant = alias != null && alias.split(/\s+/).every((t) => shown.has(norm(t)));
  return { surname: s.surname, given: s.given, alias: redundant ? null : alias, basis: s.basis };
}
