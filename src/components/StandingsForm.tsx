import type { StandingFormResult } from '../data/standings';
import { useLanguage } from '../i18n/LanguageContext';

interface StandingsFormProps {
  results: StandingFormResult[];
  /** Show up to this many slots (empty trailing slots omitted). */
  slots?: number;
}

const RESULT_LABEL: Record<StandingFormResult, { en: string; it: string }> = {
  W: { en: 'Win', it: 'Vittoria' },
  D: { en: 'Draw', it: 'Pareggio' },
  L: { en: 'Loss', it: 'Sconfitta' },
};

/** FM-style last-N form: green up = win, red down = loss, grey mid = draw. */
export default function StandingsForm({
  results,
  slots = 5,
}: StandingsFormProps) {
  const { locale } = useLanguage();
  const shown = results.slice(-slots);

  if (shown.length === 0) {
    return <span className="standings-form standings-form--empty">—</span>;
  }

  return (
    <span className="standings-form" role="img" aria-label={formAria(shown, locale)}>
      {shown.map((result, i) => (
        <span
          key={`${result}-${i}`}
          className={`standings-form-pip standings-form-pip--${result.toLowerCase()}`}
          title={RESULT_LABEL[result][locale]}
        />
      ))}
    </span>
  );
}

function formAria(
  results: StandingFormResult[],
  locale: 'en' | 'it'
): string {
  return results.map((r) => RESULT_LABEL[r][locale]).join(', ');
}
