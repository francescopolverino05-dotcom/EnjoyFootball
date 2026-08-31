import type { GpsHalfReport } from '../types/match';
import { useLanguage } from '../i18n/LanguageContext';
import type { UiKey } from '../i18n/translations';

function formatGpsNum(value: number, decimals = 0): string {
  if (decimals === 0) return String(Math.round(value));
  return value.toFixed(decimals);
}

export default function GpsStatsPanel({ reports }: { reports: GpsHalfReport[] }) {
  const { t, L } = useLanguage();

  const columns: {
    key: keyof GpsHalfReport['players'][number];
    labelKey: UiKey;
    decimals?: number;
    suffix?: string;
  }[] = [
    { key: 'totalDistanceM', labelKey: 'gpsColTotalDist' },
    { key: 'distancePerMin', labelKey: 'gpsColDistPerMin' },
    { key: 'distanceOver16KmhM', labelKey: 'gpsColOver16' },
    { key: 'distance20to24KmhM', labelKey: 'gpsCol20to24', decimals: 1 },
    { key: 'distanceOver24KmhM', labelKey: 'gpsColOver24', decimals: 1 },
    { key: 'metabolicPowerWkg', labelKey: 'gpsColMetPower', decimals: 1 },
    { key: 'accelerationsOver3', labelKey: 'gpsColAcc' },
    { key: 'decelerationsUnder3', labelKey: 'gpsColDec' },
    { key: 'maxSpeedKmh', labelKey: 'gpsColMaxSpeed', decimals: 2 },
    { key: 'recoveryPct', labelKey: 'gpsColRecovery', decimals: 2, suffix: '%' },
  ];

  return (
    <div className="gps-stats-panel">
      <div className="section-title">{t('gpsReportTitle')}</div>
      {reports.map((report) => (
        <section className="gps-stats-section" key={L(report.half)}>
          <h4 className="team-stats-section-title">{L(report.half)}</h4>
          <div className="gps-table-wrap">
            <table className="gps-table">
              <thead>
                <tr>
                  <th>{t('gpsColPlayer')}</th>
                  {columns.map((col) => (
                    <th key={col.key}>{t(col.labelKey)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.players.map((row) => (
                  <tr key={row.player}>
                    <th scope="row">{row.player}</th>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {formatGpsNum(row[col.key] as number, col.decimals)}
                        {col.suffix ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {report.summary ? (
            <p className="gps-stats-summary">{L(report.summary)}</p>
          ) : null}
        </section>
      ))}
    </div>
  );
}
