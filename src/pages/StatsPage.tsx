import { Link, useSearchParams } from 'react-router-dom';
import ReportHeader from '../components/ReportHeader';
import { MATCH_COMPETITION_TAB_KEYS } from '../data/matchCompetitions';
import {
  formatStatsValue,
  getStatsCategoryForCompetition,
  getStatsRankings,
  isStatsCategoryId,
  isStatsCompetitionId,
  metricUsValue,
  sortMetricRows,
  STATS_CATEGORY_ORDER,
  STATS_COMPETITION_ORDER,
} from '../data/statsRankings';
import type {
  StatsCategoryId,
  StatsCompetitionId,
} from '../types/statsRankings';
import { useLanguage } from '../i18n/LanguageContext';
import type { UiKey } from '../i18n/translations';

const CATEGORY_TAB_KEYS: Record<StatsCategoryId, UiKey> = {
  general: 'statsTabGeneral',
  offensive: 'statsTabOffensive',
  defensive: 'statsTabDefensive',
  possession: 'statsTabPossession',
};

function categoryFromSearch(value: string | null): StatsCategoryId {
  if (value && isStatsCategoryId(value)) return value;
  return 'general';
}

function competitionFromSearch(value: string | null): StatsCompetitionId {
  if (value && isStatsCompetitionId(value)) return value;
  return 'primavera2';
}

export default function StatsPage() {
  const { t, L } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const dataset = getStatsRankings();
  const competitionId = competitionFromSearch(searchParams.get('c'));
  const categoryId = categoryFromSearch(searchParams.get('tab'));
  const category = getStatsCategoryForCompetition(categoryId, competitionId);

  const setCompetitionId = (id: StatsCompetitionId) => {
    const next: Record<string, string> = {};
    if (id !== 'primavera2') next.c = id;
    if (categoryId !== 'general') next.tab = categoryId;
    setSearchParams(next, { replace: true });
  };

  const setCategoryId = (id: StatsCategoryId) => {
    const next: Record<string, string> = {};
    if (competitionId !== 'primavera2') next.c = competitionId;
    if (id !== 'general') next.tab = id;
    setSearchParams(next, { replace: true });
  };

  return (
    <div className="app-shell">
      <Link to="/" className="back-link">
        {t('backToHome')}
      </Link>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('statsPageTitle')}
          matchTitle={t('stats')}
          matchDate={dataset.updatedAt}
          competition={dataset.season}
        />
      </div>

      <section className="home-section" aria-labelledby="stats-heading">
        <div className="section-title" id="stats-heading">
          {t('stats')}
        </div>
        <p className="home-section-hint">{t('statsHint')}</p>
        <p className="home-section-hint stats-scope-hint">{L(dataset.scope)}</p>

        <div className="match-competitions">
          <div
            className="tabs-header"
            role="tablist"
            aria-label={t('statsCompetitionAria')}
          >
            {STATS_COMPETITION_ORDER.map((id) => {
              const active = id === competitionId;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`tab-button ${active ? 'active' : ''}`}
                  onClick={() => setCompetitionId(id)}
                >
                  {t(MATCH_COMPETITION_TAB_KEYS[id])}
                </button>
              );
            })}
          </div>

          <div
            className="tabs-header stats-category-tabs"
            role="tablist"
            aria-label={t('statsCategoryAria')}
          >
            {STATS_CATEGORY_ORDER.map((id) => {
              const active = id === categoryId;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`tab-button ${active ? 'active' : ''}`}
                  onClick={() => setCategoryId(id)}
                >
                  {t(CATEGORY_TAB_KEYS[id])}
                </button>
              );
            })}
          </div>

          {!category || category.metrics.length === 0 ? (
            <p className="home-empty">{t('statsEmptyCompetition')}</p>
          ) : (
            category.metrics.map((metric) => {
              const ranked = sortMetricRows(
                metric.rows,
                metric.higherIsBetter
              );
              const usValue = metricUsValue(metric);
              return (
                <div className="stats-metric-block" key={metric.id}>
                  <div className="section-title stats-metric-title">
                    {L(metric.label)}
                    {metric.unit === '%' ? ' (%)' : ''}
                  </div>
                  {usValue != null ? (
                    <p className="stats-metric-avg">
                      {t('statsUsValue').replace(
                        '{value}',
                        formatStatsValue(usValue, metric.unit)
                      )}
                    </p>
                  ) : null}
                  <div className="standings-table-wrap">
                    <table className="standings-table stats-rankings-table">
                      <thead>
                        <tr>
                          <th scope="col">{t('statsColRank')}</th>
                          <th scope="col">{t('statsColTeam')}</th>
                          <th scope="col">{t('statsColPlayed')}</th>
                          <th scope="col">{t('statsColValue')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {ranked.map((row, index) => (
                          <tr
                            className={
                              row.isUs ? 'standings-row--us' : undefined
                            }
                            key={`${metric.id}-${row.teamId}`}
                          >
                            <td className="standings-pos">{index + 1}</td>
                            <td className="standings-team">{row.team}</td>
                            <td>{row.played}</td>
                            <td className="stats-value-cell">
                              {formatStatsValue(row.value, metric.unit)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>
    </div>
  );
}
