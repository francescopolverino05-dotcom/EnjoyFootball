import { Link } from 'react-router-dom';
import {
  formatVam,
  getAllGaconSessions,
  getGaconDataset,
  sortPlayersByVam,
} from '../data/gaconLoad';
import { getPlayerBySlug } from '../data/players';
import type { GaconSession } from '../types/gacon';
import { useLanguage } from '../i18n/LanguageContext';

/** Gacon VAM histograms — squad block + individual bars (Excel values as-is). */
export default function GaconHistograms({ session }: { session: GaconSession }) {
  const { t, L, formatDate } = useLanguage();
  const allSessions = getAllGaconSessions();
  const players = sortPlayersByVam(session.players);
  const scaleNote = getGaconDataset().scaleNote;

  const maxSquad = Math.max(...allSessions.map((s) => s.avgVamKmh ?? 0), 1);
  const maxInd = Math.max(...players.map((p) => p.vamKmh), 1);

  return (
    <div className="tqr-panel gacon-panel">
      <div className="section-title">{t('gaconTitle')}</div>
      <p className="video-hint">{t('gaconHint')}</p>

      <div className="rpe-kpis">
        <div className="rpe-kpi">
          <div className="rpe-kpi-label">{t('gaconAvgVam')}</div>
          <div className="rpe-kpi-value">
            {formatVam(session.avgVamKmh)}
            <span className="gacon-unit"> {t('gaconUnitKmh')}</span>
          </div>
        </div>
        <div className="rpe-kpi">
          <div className="rpe-kpi-label">{t('gaconPlayersTested')}</div>
          <div className="rpe-kpi-value">{session.playersTested}</div>
        </div>
      </div>

      <div className="rpe-chart-block">
        <div className="rpe-chart-title">{t('gaconSquadHistogram')}</div>
        <div
          className="rpe-bars tqr-squad-bars"
          role="img"
          aria-label={t('gaconSquadHistogram')}
        >
          {allSessions.map((s) => {
            const value = s.avgVamKmh ?? 0;
            const height = Math.max(4, Math.round((value / maxSquad) * 100));
            const active = s.date === session.date;
            const label = formatDate(s.date).slice(0, 5);
            return (
              <div
                key={s.date}
                className={`rpe-bar-col ${active ? 'active' : ''} ${
                  s.kind === 'match' ? 'is-match' : ''
                }`}
                title={`${formatDate(s.date)} — VAM ${formatVam(s.avgVamKmh)} ${t('gaconUnitKmh')}`}
              >
                <div className="rpe-bar-value">{formatVam(s.avgVamKmh, 1)}</div>
                <div className="rpe-bar-track">
                  <div
                    className="rpe-bar-fill gacon-bar-fill"
                    style={{ height: `${height}%` }}
                  />
                </div>
                <div className="rpe-bar-label">{label}</div>
              </div>
            );
          })}
        </div>
        <p className="rpe-chart-legend">{t('gaconSquadLegend')}</p>
      </div>

      <div className="rpe-chart-block">
        <div className="rpe-chart-title">{t('gaconIndividualHistogram')}</div>
        {players.length === 0 ? (
          <p className="video-hint">{t('gaconIndividualEmpty')}</p>
        ) : (
          <div
            className="tqr-ind-bars"
            role="img"
            aria-label={t('gaconIndividualHistogram')}
          >
            {players.map((p) => {
              const player = getPlayerBySlug(p.playerSlug);
              const name = player?.displayName ?? p.excelName;
              const width = Math.max(4, Math.round((p.vamKmh / maxInd) * 100));
              return (
                <Link
                  key={p.playerSlug}
                  to={`/players/${p.playerSlug}`}
                  className="tqr-ind-row gacon-ind-row"
                  title={`${name} — VAM ${formatVam(p.vamKmh, 0)} ${t('gaconUnitKmh')}`}
                >
                  <div className="tqr-ind-name notranslate" translate="no">
                    {name}
                  </div>
                  <div className="tqr-ind-track">
                    <div
                      className="tqr-ind-fill gacon-ind-fill"
                      style={{ width: `${width}%` }}
                    />
                  </div>
                  <div className="tqr-ind-value">
                    {formatVam(p.vamKmh, 0)}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
        <p className="rpe-chart-legend">{t('gaconIndividualLegend')}</p>
      </div>

      <p className="rpe-footnote">{L(scaleNote)}</p>
    </div>
  );
}
