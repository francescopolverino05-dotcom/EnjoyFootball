import type { CupFixture, CupRound } from '../data/standings';
import { useLanguage } from '../i18n/LanguageContext';

/** Knockout rounds shown as bracket columns (TM turnierbaum-style). */
const BRACKET_ROUND_IDS = ['1R', 'SZ', 'AF', 'VF', 'HF', 'FF'] as const;

function displayTeam(name: string): string {
  const trimmed = name.trim();
  if (!trimmed || /^tbd$/i.test(trimmed) || /^sconosciuto$/i.test(trimmed)) {
    return '—';
  }
  if (/^winner\b/i.test(trimmed) || /^vincitore\b/i.test(trimmed)) {
    return trimmed.replace(/^winner\s+/i, 'W ').replace(/^vincitore\s+/i, 'V ');
  }
  return trimmed;
}

function displayScore(score: string | null | undefined): string {
  if (!score) return '–';
  return score.replace(/-/g, ':');
}

function MatchCard({ fx }: { fx: CupFixture }) {
  const home = displayTeam(fx.home);
  const away = displayTeam(fx.away);
  const parsed = fx.score?.match(/^(\d+)\s*[-–:]\s*(\d+)$/);
  const homeGoals = parsed?.[1] ?? null;
  const awayGoals = parsed?.[2] ?? null;
  const us =
    fx.us ||
    /napoli/i.test(fx.home) ||
    /napoli/i.test(fx.away) ||
    fx.ourClub === 'napoli';

  return (
    <article
      className={
        us ? 'cup-bracket-match cup-bracket-match--us' : 'cup-bracket-match'
      }
    >
      <div
        className={
          us && /napoli/i.test(fx.home)
            ? 'cup-bracket-team cup-bracket-team--us'
            : 'cup-bracket-team'
        }
      >
        <span className="cup-bracket-team-name">{home}</span>
        <span className="cup-bracket-team-score">
          {homeGoals ?? displayScore(null)}
        </span>
      </div>
      <div
        className={
          us && /napoli/i.test(fx.away)
            ? 'cup-bracket-team cup-bracket-team--away cup-bracket-team--us'
            : 'cup-bracket-team cup-bracket-team--away'
        }
      >
        <span className="cup-bracket-team-name">{away}</span>
        <span className="cup-bracket-team-score">
          {awayGoals ?? displayScore(null)}
        </span>
      </div>
    </article>
  );
}

interface CupKnockoutBracketProps {
  rounds: CupRound[];
}

export default function CupKnockoutBracket({ rounds }: CupKnockoutBracketProps) {
  const { L, t } = useLanguage();

  const byId = new Map(rounds.map((r) => [r.id, r]));
  const columns = BRACKET_ROUND_IDS.map((id) => byId.get(id)).filter(
    (r): r is CupRound => Boolean(r)
  );

  if (columns.length === 0) return null;

  return (
    <div className="cup-bracket" role="region" aria-label={t('tableCupBracketAria')}>
      <div className="cup-bracket-scroll">
        <div className="cup-bracket-track">
          {columns.map((round) => (
            <div key={round.id} className="cup-bracket-round">
              <h4 className="cup-bracket-round-title">{L(round.name)}</h4>
              <div
                className={`cup-bracket-matches cup-bracket-matches--${round.fixtures.length}`}
              >
                {round.fixtures.map((fx, i) => (
                  <MatchCard key={`${round.id}-${i}`} fx={fx} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function cupPreliminaryRounds(rounds: CupRound[]): CupRound[] {
  return rounds.filter((r) => r.id === '1VR' || r.id === '2VR');
}

export function cupHasKnockoutBracket(rounds: CupRound[]): boolean {
  return rounds.some((r) =>
    (BRACKET_ROUND_IDS as readonly string[]).includes(r.id)
  );
}
