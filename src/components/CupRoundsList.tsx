import { Link } from 'react-router-dom';
import type { CupFixture, CupRound } from '../data/standings';
import { useLanguage } from '../i18n/LanguageContext';

/** "Winner Ro32 4" → previous round id + 1-based fixture number. */
const PLACEHOLDER_ROUND: Record<string, string> = {
  ro32: 'SZ',
  ro16: 'AF',
  qf: 'VF',
  sf: 'HF',
};

const PLACEHOLDER_RE = /^(?:winner|vincitore)\s+(\S+)\s+(\d+)$/i;

function isTbd(name: string): boolean {
  return !name.trim() || /^tbd$/i.test(name.trim());
}

function parsePlaceholder(
  name: string
): { roundId: string; index: number; label: string } | null {
  const m = name.trim().match(PLACEHOLDER_RE);
  if (!m) return null;
  const roundId = PLACEHOLDER_ROUND[m[1].toLowerCase()];
  if (!roundId) return null;
  return { roundId, index: Number(m[2]) - 1, label: `${m[1]} ${m[2]}` };
}

/** Readable team name; "Winner Ro32 4" becomes "Napoli / Bari" once known. */
function resolveTeam(name: string, rounds: CupRound[]): string {
  if (isTbd(name)) return '—';
  const ph = parsePlaceholder(name);
  if (!ph) return name;
  const prev = rounds.find((r) => r.id === ph.roundId)?.fixtures[ph.index];
  if (
    prev &&
    ![prev.home, prev.away].some((n) => isTbd(n) || parsePlaceholder(n))
  ) {
    return `${prev.home} / ${prev.away}`;
  }
  return `W ${ph.label}`;
}

function isNapoliName(name: string): boolean {
  return /napoli/i.test(name);
}

function isOurs(fx: CupFixture, rounds: CupRound[]): boolean {
  return (
    Boolean(fx.us) ||
    fx.ourClub === 'napoli' ||
    isNapoliName(resolveTeam(fx.home, rounds)) ||
    isNapoliName(resolveTeam(fx.away, rounds))
  );
}

function formatDate(iso: string, locale: 'en' | 'it'): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

function scoreText(fx: CupFixture): string {
  if (!fx.score) return '–';
  const s = fx.score.replace(/-/g, ':');
  return fx.penalties ? `${s} (p. ${fx.penalties.replace(/-/g, ':')})` : s;
}

/** Did Napoli (home or away) win this completed tie? */
function napoliWon(fx: CupFixture): boolean | null {
  const m = fx.score?.match(/^(\d+)\s*-\s*(\d+)$/);
  if (!m) return null;
  let h = Number(m[1]);
  let a = Number(m[2]);
  if (h === a && fx.penalties) {
    const p = fx.penalties.match(/^(\d+)\s*-\s*(\d+)$/);
    if (p) {
      h = Number(p[1]);
      a = Number(p[2]);
    }
  }
  if (h === a) return null;
  const napoliHome = isNapoliName(fx.home);
  return napoliHome ? h > a : a > h;
}

interface JourneyStep {
  round: CupRound;
  fx: CupFixture;
  kind: 'done' | 'next' | 'ifWin';
}

/** Napoli's route: played ties, the upcoming tie, and the next one if we win. */
function buildJourney(rounds: CupRound[]): JourneyStep[] {
  const steps: JourneyStep[] = [];
  let prevNapoliIdx: { roundId: string; index: number } | null = null;
  for (const round of rounds) {
    if (round.id === '1VR' || round.id === '2VR') continue;
    let idx = round.fixtures.findIndex(
      (fx) =>
        fx.us ||
        fx.ourClub === 'napoli' ||
        isNapoliName(fx.home) ||
        isNapoliName(fx.away)
    );
    let kind: JourneyStep['kind'] | null = null;
    if (idx >= 0) {
      kind = round.fixtures[idx].score ? 'done' : 'next';
    } else if (prevNapoliIdx) {
      const { roundId, index } = prevNapoliIdx;
      idx = round.fixtures.findIndex((fx) =>
        [fx.home, fx.away].some((n) => {
          const ph = parsePlaceholder(n);
          return ph && ph.roundId === roundId && ph.index === index;
        })
      );
      if (idx >= 0) kind = 'ifWin';
    }
    if (idx < 0 || !kind) {
      if (steps.length > 0) break;
      continue;
    }
    steps.push({ round, fx: round.fixtures[idx], kind });
    if (kind === 'done' && napoliWon(round.fixtures[idx]) === false) break;
    if (kind === 'ifWin') break;
    prevNapoliIdx = { roundId: round.id, index: idx };
  }
  return steps;
}

export function CupOurPath({ rounds }: { rounds: CupRound[] }) {
  const { L, t, locale } = useLanguage();
  const steps = buildJourney(rounds);
  if (steps.length === 0) return null;

  return (
    <div className="standings-our-path">
      <div className="section-title">{t('tableOurPath')}</div>
      <ol className="standings-path-steps">
        {steps.map(({ round, fx, kind }) => {
          const home = resolveTeam(fx.home, rounds);
          const away = resolveTeam(fx.away, rounds);
          const napoliIsHome = isNapoliName(home);
          const opponent = napoliIsHome ? away : home;
          const line =
            kind === 'ifWin'
              ? `${t('tableCupIfWin')}: ${t('tableCupVs')} ${opponent}`
              : kind === 'next'
                ? `${home} ${t('tableCupVs')} ${away}`
                : `${home} ${scoreText(fx)} ${away}`;
          const won = kind === 'done' ? napoliWon(fx) : null;
          const href = fx.matchSlug ? `/match/${fx.matchSlug}` : null;
          const body = (
            <>
              <strong>{L(round.name)}</strong>
              {' · '}
              {formatDate(fx.date, locale)}
              {' · '}
              {line}
              {won === true ? ' ✔' : won === false ? ' ✘' : ''}
            </>
          );
          return (
            <li
              key={round.id}
              className={`standings-path-step standings-path-step--${kind}`}
            >
              {href ? <Link to={href}>{body}</Link> : body}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export function CupRoundsList({ rounds }: { rounds: CupRound[] }) {
  const { L, locale } = useLanguage();

  return (
    <>
      {rounds.map((round) => {
        // Napoli's tie first; everything else keeps its original order.
        const ordered = round.fixtures
          .map((fx, i) => ({ fx, i, ours: isOurs(fx, rounds) }))
          .sort((a, b) => Number(b.ours) - Number(a.ours) || a.i - b.i);
        return (
          <div key={round.id} className="standings-cup-round">
            <h4 className="standings-matchday-title">{L(round.name)}</h4>
            <ul className="standings-fixture-list">
              {ordered.map(({ fx, i, ours }) => {
                const href = fx.matchSlug ? `/match/${fx.matchSlug}` : null;
                const className = [
                  'standings-fixture',
                  ours ? 'standings-fixture--us' : '',
                  href ? 'standings-fixture--has-stats' : '',
                ]
                  .filter(Boolean)
                  .join(' ');
                const body = (
                  <>
                    <span className="standings-fixture-date">
                      {formatDate(fx.date, locale)}
                    </span>
                    <span className="standings-fixture-home">
                      {resolveTeam(fx.home, rounds)}
                    </span>
                    <span className="standings-fixture-sep">
                      {scoreText(fx)}
                    </span>
                    <span className="standings-fixture-away">
                      {resolveTeam(fx.away, rounds)}
                    </span>
                  </>
                );
                return (
                  <li key={`${round.id}-${i}`} className={className}>
                    {href ? (
                      <Link className="standings-fixture-link" to={href}>
                        {body}
                      </Link>
                    ) : (
                      body
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </>
  );
}
