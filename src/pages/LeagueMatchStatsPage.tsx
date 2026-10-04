import { Link, useParams } from 'react-router-dom';
import ReportHeader from '../components/ReportHeader';
import {
  getLeagueMatchStats,
  isLeagueMatchCompetitionId,
} from '../data/leagueMatchStats';
import { useLanguage } from '../i18n/LanguageContext';

export default function LeagueMatchStatsPage() {
  const { competitionId = '', slug = '' } = useParams<{
    competitionId: string;
    slug: string;
  }>();
  const { t, L, formatDate } = useLanguage();

  const pack =
    isLeagueMatchCompetitionId(competitionId) && slug
      ? getLeagueMatchStats(competitionId, slug)
      : undefined;

  if (!pack) {
    return (
      <div className="app-shell">
        <Link to="/table" className="back-link">
          {t('backToTable')}
        </Link>
        <div className="report-page">
          <p>{t('leagueMatchStatsNotFound')}</p>
        </div>
      </div>
    );
  }

  const homePlayers = pack.playerStats.filter(
    (p) => p.team.toLowerCase() === pack.home.name.toLowerCase()
  );
  const awayPlayers = pack.playerStats.filter(
    (p) => p.team.toLowerCase() === pack.away.name.toLowerCase()
  );

  return (
    <div className="app-shell">
      <Link to="/table" className="back-link">
        {t('backToTable')}
      </Link>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('statsPageTitle')}
          matchTitle={`${pack.home.name} ${pack.score} ${pack.away.name}`}
          matchDate={formatDate(pack.date)}
          competition={
            pack.matchday != null
              ? `${t('tableMatchday')} ${pack.matchday}`
              : t('stats')
          }
        />
      </div>

      <section className="home-section" aria-labelledby="lms-goals">
        <div className="section-title" id="lms-goals">
          {t('leagueMatchStatsGoals')}
        </div>
        {pack.goals.length === 0 ? (
          <p className="home-empty">—</p>
        ) : (
          <ul className="league-match-goals">
            {pack.goals.map((g) => (
              <li key={`${g.minute}-${g.scorer}-${g.teamId}`}>
                <span className="league-match-goal-min">{g.minute}&apos;</span>
                <strong>{g.scorer}</strong>
                <span className="league-match-goal-team">
                  {g.teamId === pack.home.teamId
                    ? pack.home.name
                    : pack.away.name}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="home-section" aria-labelledby="lms-team">
        <div className="section-title" id="lms-team">
          {t('leagueMatchStatsTeam')}
        </div>
        <div className="table-wrap">
          <table className="standings-table stats-rankings-table">
            <thead>
              <tr>
                <th scope="col">{t('leagueMatchStatsMetric')}</th>
                <th scope="col">{pack.home.name}</th>
                <th scope="col">{pack.away.name}</th>
              </tr>
            </thead>
            <tbody>
              {pack.teamStats.map((row) => (
                <tr key={row.stat}>
                  <th scope="row">{row.stat}</th>
                  <td className="stats-value-cell">{row.home}</td>
                  <td className="stats-value-cell">{row.away}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {(
        [
          [pack.home.name, homePlayers],
          [pack.away.name, awayPlayers],
        ] as const
      ).map(([teamName, rows]) => (
        <section
          key={teamName}
          className="home-section"
          aria-labelledby={`lms-players-${teamName}`}
        >
          <div className="section-title" id={`lms-players-${teamName}`}>
            {t('leagueMatchStatsPlayers')} — {teamName}
          </div>
          <div className="table-wrap">
            <table className="standings-table league-match-player-table">
              <thead>
                <tr>
                  <th scope="col">{t('leagueMatchStatsPlayer')}</th>
                  <th scope="col">Passes</th>
                  <th scope="col">Pass %</th>
                  <th scope="col">Prog</th>
                  <th scope="col">Key</th>
                  <th scope="col">Shots</th>
                  <th scope="col">SoT</th>
                  <th scope="col">G</th>
                  <th scope="col">xG</th>
                  <th scope="col">Int</th>
                  <th scope="col">Rec</th>
                  <th scope="col">Clr</th>
                  <th scope="col">Blk</th>
                  <th scope="col">Duels</th>
                  <th scope="col">Fouls</th>
                  <th scope="col">Lost</th>
                  <th scope="col">Saves</th>
                  <th scope="col">Y</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((p) => (
                  <tr key={`${p.team}-${p.player}`}>
                    <th scope="row">{p.player}</th>
                    <td>{p.passes}</td>
                    <td>{p.passAccPct}%</td>
                    <td>{p.progPasses}</td>
                    <td>{p.keyPasses}</td>
                    <td>{p.shots}</td>
                    <td>{p.onTarget}</td>
                    <td>{p.goals}</td>
                    <td>{p.xg}</td>
                    <td>{p.interceptions}</td>
                    <td>{p.recoveries}</td>
                    <td>{p.clearances}</td>
                    <td>{p.blocks}</td>
                    <td>
                      {p.duelsWon}/{p.duels}
                    </td>
                    <td>{p.fouls}</td>
                    <td>{p.ballsLost}</td>
                    <td>{p.saves}</td>
                    <td>{p.yellow}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      ))}

      {pack.note ? (
        <p className="home-section-hint league-match-note">{L(pack.note)}</p>
      ) : null}
    </div>
  );
}
