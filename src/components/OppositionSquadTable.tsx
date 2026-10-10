import type { OppositionSquadPlayer } from '../types/opposition';
import { useLanguage } from '../i18n/LanguageContext';

interface OppositionSquadTableProps {
  players: OppositionSquadPlayer[];
}

function cell(value: string | number | null | undefined): string {
  if (value == null || value === '') return '—';
  return String(value);
}

export default function OppositionSquadTable({
  players,
}: OppositionSquadTableProps) {
  const { t } = useLanguage();

  return (
    <div className="opposition-squad-table-wrap">
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
