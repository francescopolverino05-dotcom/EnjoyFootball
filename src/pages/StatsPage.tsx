import { Link, useSearchParams } from 'react-router-dom';
import ReportHeader from '../components/ReportHeader';
import { MATCH_COMPETITION_TAB_KEYS } from '../data/matchCompetitions';
import {
  getStatsRankings,
  isStatsCompetitionId,
  STATS_COMPETITION_ORDER,
} from '../data/statsRankings';
import type { StatsCompetitionId } from '../types/statsRankings';
import {
  getLeaderboards,
  LEADERBOARD_CATEGORIES,
  type LeaderboardCategory,
} from '../data/leaderboards';
import { useLanguage } from '../i18n/LanguageContext';
import type { UiKey } from '../i18n/translations';

const CATEGORY_TAB_KEYS: Record<LeaderboardCategory, UiKey> = {
  general: 'statsTabGeneral',
  attacking: 'statsTabAttacking',
  defensive: 'statsTabDefensive',
  passing: 'statsTabPassing',
  setPieces: 'statsTabSetPieces',
};

function categoryFromSearch(value: string | null): LeaderboardCategory {
  if (value && (LEADERBOARD_CATEGORIES as string[]).includes(value)) return value as LeaderboardCategory;
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
  const boards = getLeaderboards(competitionId)[categoryId];

  const setCompetitionId = (id: StatsCompetitionId) => {
    const next: Record<string, string> = {};
    if (id !== 'primavera2') next.c = id;
    if (categoryId !== 'general') next.tab = categoryId;
    setSearchParams(next, { replace: true });
  };

  const setCategoryId = (id: LeaderboardCategory) => {
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
            {LEADERBOARD_CATEGORIES.map((id) => {
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

          {boards.length === 0 ? (
            <p className="home-empty">{t('statsEmptyCompetition')}</p>
          ) : (
            <div className="leaderboard-grid">
              {boards.map((board) => {
                const isPlayer = board.rows.some((r) => r.team);
                return (
                  <div className="leaderboard-card" key={board.id}>
                    <div className="leaderboard-title">{L(board.label)}</div>
                    <table className="standings-table stats-rankings-table">
                      <thead>
                        <tr>
                          <th scope="col">{t('statsColRank')}</th>
                          <th scope="col">{isPlayer ? t('statsColPlayer') : t('statsColTeam')}</th>
                          {isPlayer ? <th scope="col">{t('statsColTeam')}</th> : <th scope="col">{t('statsColPlayed')}</th>}
                          <th scope="col">{t('statsColValue')}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {board.rows.slice(0, 10).map((row, index) => (
                          <tr className={row.isUs ? 'standings-row--us' : undefined} key={row.key}>
                            <td className="standings-pos">{index + 1}</td>
                            <td className="standings-team">{row.name}</td>
                            <td>{isPlayer ? row.team : row.played}</td>
                            <td className="stats-value-cell">
                              {board.unit === 'total' ? row.value : row.value.toFixed(board.unit === '%' ? 1 : 2).replace(/\.?0+$/, '')}
                              {board.unit === '%' ? '%' : ''}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
