import type {
  OppositionSquadDepth,
  OppositionSquadPlayer,
} from '../types/opposition';
import { useLanguage } from '../i18n/LanguageContext';
import {
  localizePosition,
  sortOppositionSquadByDepth,
} from '../i18n/positions';
import {
  localize,
  ui,
  type Locale,
} from '../i18n/translations';
import { openOppositionSquadPdf } from '../utils/oppositionSquadPdf';
import type { MostSubRow } from '../utils/mostSubs';

interface OppositionSquadTableProps {
  players: OppositionSquadPlayer[];
  /** Team display name used in the PDF title (e.g. Villarreal). */
  teamName: string;
  teamId?: string;
  /** When set, PDF also includes the last-4-XIs depth pitch. */
  depth?: OppositionSquadDepth;
  /** Most frequent substitutes (shown as a PDF section). */
  mostSubs?: MostSubRow[];
}

function cell(value: string | number | null | undefined): string {
  if (value == null || value === '') return '—';
  return String(value);
}

function pdfLabelsFor(locale: Locale, teamName: string, depth?: OppositionSquadDepth) {
  const pitchTitle =
    locale === 'it' ? `Rosa ${teamName}` : `${teamName} Squad`;
  return {
    title: ui(locale, 'oppositionSquad'),
    depthTitle: ui(locale, 'oppositionSquadDepth'),
    depthPitchTitle: pitchTitle,
    depthNote: depth?.note
      ? localize(depth.note, locale)
      : depth
        ? ui(locale, 'oppositionSquadDepthHint')
        : undefined,
    colNumber: ui(locale, 'oppositionSquadColNumber'),
    colPlayer: ui(locale, 'oppositionSquadColPlayer'),
    colRole: ui(locale, 'oppositionSquadColRole'),
    colHeight: ui(locale, 'oppositionSquadColHeight'),
    colFoot: ui(locale, 'oppositionSquadColFoot'),
    heightUnit: 'cm',
    generatedLabel: ui(locale, 'oppositionSquadPdfGenerated'),
    subsTitle: ui(locale, 'oppositionMostSubbedOn'),
    subsColPlayer: ui(locale, 'statsColPlayer'),
    subsColRole: ui(locale, 'oppositionUsualRole'),
    subsColApps: ui(locale, 'oppositionSubApps'),
  };
}

export default function OppositionSquadTable({
  players,
  teamName,
  teamId,
  depth,
  mostSubs,
}: OppositionSquadTableProps) {
  const { t, locale } = useLanguage();
  const ordered = sortOppositionSquadByDepth(players);

  const downloadPdf = (pdfLocale: Locale) => {
    openOppositionSquadPdf(
      teamName,
      players,
      pdfLabelsFor(pdfLocale, teamName, depth),
      {
        locale: pdfLocale,
        ...(depth && teamId ? { depth, teamId } : {}),
        mostSubs,
      }
    );
  };

  return (
    <div className="opposition-squad-table-wrap">
      <div className="opposition-squad-toolbar">
        <span className="opposition-squad-pdf-label">{t('oppositionSquadPdf')}</span>
        <div className="opposition-squad-pdf-langs" role="group" aria-label={t('oppositionSquadPdf')}>
          <button
            type="button"
            className="opposition-squad-pdf-btn"
            onClick={() => downloadPdf('en')}
          >
            {t('oppositionSquadPdfEn')}
          </button>
          <button
            type="button"
            className="opposition-squad-pdf-btn"
            onClick={() => downloadPdf('it')}
          >
            {t('oppositionSquadPdfIt')}
          </button>
        </div>
      </div>
      <table className="opposition-squad-table">
        <thead>
          <tr>
            <th scope="col">{t('oppositionSquadColNumber')}</th>
            <th scope="col">{t('oppositionSquadColPlayer')}</th>
            <th scope="col">{t('oppositionSquadColRole')}</th>
            <th scope="col">{t('oppositionSquadColHeight')}</th>
            <th scope="col">{t('oppositionSquadColFoot')}</th>
          </tr>
        </thead>
        <tbody>
          {ordered.map((p) => (
            <tr key={`squad-${p.number ?? 'x'}-${p.name}`}>
              <td className="opposition-squad-num">
                {p.number != null ? p.number : '—'}
              </td>
              <td className="opposition-squad-name">{p.name}</td>
              <td>{localizePosition(p.position, locale)}</td>
              <td className="opposition-squad-meta">
                {p.heightCm != null ? `${p.heightCm} cm` : '—'}
              </td>
              <td className="opposition-squad-meta">
                {cell(p.preferredFoot)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
