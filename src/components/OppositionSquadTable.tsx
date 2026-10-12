import type {
  OppositionSquadDepth,
  OppositionSquadPlayer,
} from '../types/opposition';
import { useLanguage } from '../i18n/LanguageContext';
import { openOppositionSquadPdf } from '../utils/oppositionSquadPdf';

interface OppositionSquadTableProps {
  players: OppositionSquadPlayer[];
  /** Team display name used in the PDF title (e.g. Villarreal). */
  teamName: string;
  teamId?: string;
  /** When set, PDF also includes the last-4-XIs depth pitch. */
  depth?: OppositionSquadDepth;
}

function cell(value: string | number | null | undefined): string {
  if (value == null || value === '') return '—';
  return String(value);
}

export default function OppositionSquadTable({
  players,
  teamName,
  teamId,
  depth,
}: OppositionSquadTableProps) {
  const { t, L, locale } = useLanguage();
  const pitchTitle =
    locale === 'it' ? `Rosa ${teamName}` : `${teamName} Squad`;

  return (
    <div className="opposition-squad-table-wrap">
      <div className="opposition-squad-toolbar">
        <button
          type="button"
          className="opposition-squad-pdf-btn"
          onClick={() =>
            openOppositionSquadPdf(
              teamName,
              players,
              {
                title: t('oppositionSquad'),
                depthTitle: t('oppositionSquadDepth'),
                depthPitchTitle: pitchTitle,
                depthNote: depth?.note
                  ? L(depth.note)
                  : depth
                    ? t('oppositionSquadDepthHint')
                    : undefined,
                colNumber: t('oppositionSquadColNumber'),
                colPlayer: t('oppositionSquadColPlayer'),
                colRole: t('oppositionSquadColRole'),
                colHeight: t('oppositionSquadColHeight'),
                colFoot: t('oppositionSquadColFoot'),
                heightUnit: 'cm',
                generatedLabel: t('oppositionSquadPdfGenerated'),
              },
              depth && teamId ? { depth, teamId } : undefined
            )
          }
        >
          {t('oppositionSquadPdf')}
        </button>
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
          {players.map((p) => (
            <tr key={`squad-${p.number ?? 'x'}-${p.name}`}>
              <td className="opposition-squad-num">
                {p.number != null ? p.number : '—'}
              </td>
              <td className="opposition-squad-name">{p.name}</td>
              <td>{cell(p.position)}</td>
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
