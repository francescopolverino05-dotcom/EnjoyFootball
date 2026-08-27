import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import ReportHeader from '../components/ReportHeader';
import {
  getCoppaItaliaStandings,
  getPrimavera2Standings,
  getStandingsDataset,
  getUefaYouthLeagueStandings,
  STANDING_COMPETITION_ORDER,
  standingRowClassName,
  teamNameById,
  type StandingCompetitionId,
} from '../data/standings';
import { teamCrestUrl } from '../data/teamLogos';
import { useLanguage } from '../i18n/LanguageContext';
import { MATCH_COMPETITION_TAB_KEYS } from '../data/matchCompetitions';

function formatGd(gd: number): string {
  if (gd > 0) return `+${gd}`;
  return String(gd);
}

function formatDate(iso: string, locale: 'en' | 'it'): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    timeZone: 'UTC',
  });
}

function competitionFromSearch(
  value: string | null
): StandingCompetitionId {
  if (
    value === 'primavera2' ||
    value === 'coppaItalia' ||
    value === 'uefaYouthLeague'
  ) {
    return value;
  }
  return 'primavera2';
}

export default function TablesPage() {
  const { t, L, locale } = useLanguage();
  const [searchParams, setSearchParams] = useSearchParams();
  const dataset = getStandingsDataset();
  const league = getPrimavera2Standings();
  const coppa = getCoppaItaliaStandings();
  const uyl = getUefaYouthLeagueStandings();
  const selectedId = competitionFromSearch(searchParams.get('c'));
  const setSelectedId = (id: StandingCompetitionId) => {
    setSearchParams(id === 'primavera2' ? {} : { c: id }, { replace: true });
  };
  const [matchdayNumber, setMatchdayNumber] = useState(
    () => league.nextMatchday || league.matchdays[0]?.number || 1
  );

  const nameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const row of league.rows) map.set(row.teamId, row.shortName);
    return map;
  }, [league.rows]);

  const selectedMd =
    league.matchdays.find((md) => md.number === matchdayNumber) ??
    league.matchdays[0];
  const mdIndex = league.matchdays.findIndex(
    (md) => md.number === selectedMd?.number
  );
  const canPrev = mdIndex > 0;
  const canNext = mdIndex >= 0 && mdIndex < league.matchdays.length - 1;

  return (
    <div className="app-shell">
      <Link to="/" className="back-link">
        {t('backToHome')}
      </Link>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('tablePageTitle')}
          matchTitle={t('table')}
          matchDate={dataset.updatedAt}
          competition={t('season')}
        />
      </div>

      <section className="home-section" aria-labelledby="table-heading">
        <div className="section-title" id="table-heading">
          {t('table')}
        </div>
        <p className="home-section-hint">{t('tableHint')}</p>

        <div className="match-competitions">
          <div className="tabs-header" role="tablist">
            {STANDING_COMPETITION_ORDER.map((id) => {
              const active = id === selectedId;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`tab-button ${active ? 'active' : ''}`}
                  onClick={() => setSelectedId(id)}
                >
                  {t(MATCH_COMPETITION_TAB_KEYS[id])}
                </button>
              );
            })}
          </div>

          {selectedId === 'primavera2' ? (
            <section className="match-competition" aria-labelledby="table-p2">
              <header className="match-competition-header">
                <h3 className="match-competition-title" id="table-p2">
                  {L(league.name)}
                </h3>
                <p className="home-section-hint">
                  {t('tableUpdated').replace('{date}', dataset.updatedAt)}
                  {dataset.sources.primavera2 ? (
                    <>
                      {' · '}
                      <span>{t('tableSourceLnpb')}</span>
                    </>
                  ) : null}
                </p>
              </header>

              <div className="standings-table-wrap">
                <table className="standings-table">
                  <thead>
                    <tr>
                      <th scope="col">{t('tableColPos')}</th>
                      <th scope="col">{t('tableColTeam')}</th>
                      <th scope="col">{t('tableColPlayed')}</th>
                      <th scope="col">{t('tableColWon')}</th>
                      <th scope="col">{t('tableColDrawn')}</th>
                      <th scope="col">{t('tableColLost')}</th>
                      <th scope="col">{t('tableColGd')}</th>
                      <th scope="col">{t('tableColPts')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {league.rows.map((row) => {
                      const crest = teamCrestUrl(
                        {
                          logo:
                            row.teamId === 'napoli'
                              ? 'napoli-logo.png'
                              : `logos/${row.teamId}.png`,
                        },
                        'onLight'
                      );
                      const teamCell = row.us ? (
                        <span className="standings-team-inner">
                          <img
                            className="standings-crest"
                            src={crest}
                            alt=""
                            width={22}
                            height={22}
                          />
                          <span>{row.shortName}</span>
                        </span>
                      ) : (
                        <Link
                          to={`/opposition/${row.teamId}`}
                          className="standings-team-link"
                        >
                          <img
                            className="standings-crest"
                            src={crest}
                            alt=""
                            width={22}
                            height={22}
                          />
                          <span>{row.shortName}</span>
                        </Link>
                      );
                      return (
                        <tr
                          key={row.teamId}
                          className={standingRowClassName(row.pos, row.us)}
                        >
                          <td className="standings-pos">{row.pos}</td>
                          <td className="standings-team">{teamCell}</td>
                          <td>{row.played}</td>
                          <td>{row.won}</td>
                          <td>{row.drawn}</td>
                          <td>{row.lost}</td>
                          <td>{formatGd(row.gd)}</td>
                          <td className="standings-pts">{row.pts}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <ul
                className="home-table-legend standings-page-legend"
                aria-label={t('homeTableLegendAria')}
              >
                <li>
                  <span className="home-table-legend-swatch home-table-legend-swatch--champions" />
                  <span>
                    <strong>1</strong> — {t('homeZoneChampions')}
                  </span>
                </li>
                <li>
                  <span className="home-table-legend-swatch home-table-legend-swatch--playoff" />
                  <span>
                    <strong>2–5</strong> — {t('homeZonePlayoff')}
                  </span>
                </li>
                <li>
                  <span className="home-table-legend-swatch home-table-legend-swatch--playout" />
                  <span>
                    <strong>15–16</strong> — {t('homeZonePlayout')}
                  </span>
                </li>
              </ul>

              {selectedMd ? (
                <div className="standings-matchday">
                  <div className="standings-matchday-nav">
                    <button
                      type="button"
                      className="standings-matchday-btn"
                      disabled={!canPrev}
                      onClick={() =>
                        setMatchdayNumber(league.matchdays[mdIndex - 1].number)
                      }
                      aria-label={t('tablePrevMatchday')}
                    >
                      ←
                    </button>
                    <div className="standings-matchday-heading">
                      <h4 className="standings-matchday-title">
                        {t('tableMatchdayResults')
                          .replace('{n}', String(selectedMd.number))
                          .replace(
                            '{date}',
                            formatDate(selectedMd.date, locale)
                          )}
                      </h4>
                      <label className="standings-matchday-jump">
                        <span className="visually-hidden">
                          {t('tableJumpMatchday')}
                        </span>
                        <select
                          value={selectedMd.number}
                          onChange={(e) =>
                            setMatchdayNumber(Number(e.target.value))
                          }
                        >
                          {league.matchdays.map((md) => (
                            <option key={md.number} value={md.number}>
                              {t('tableMatchdayOption')
                                .replace('{n}', String(md.number))
                                .replace(
                                  '{date}',
                                  formatDate(md.date, locale)
                                )}
                            </option>
                          ))}
                        </select>
                      </label>
                    </div>
                    <button
                      type="button"
                      className="standings-matchday-btn"
                      disabled={!canNext}
                      onClick={() =>
                        setMatchdayNumber(league.matchdays[mdIndex + 1].number)
                      }
                      aria-label={t('tableNextMatchdayBtn')}
                    >
                      →
                    </button>
                  </div>
                  <ul className="standings-fixture-list">
                    {selectedMd.fixtures.map((fx) => {
                      const home = nameById.get(fx.homeId) ?? fx.homeId;
                      const away = nameById.get(fx.awayId) ?? fx.awayId;
                      const ours =
                        fx.homeId === 'napoli' || fx.awayId === 'napoli';
                      return (
                        <li
                          key={`${selectedMd.number}-${fx.homeId}-${fx.awayId}`}
                          className={
                            ours
                              ? 'standings-fixture standings-fixture--us'
                              : 'standings-fixture'
                          }
                        >
                          <span className="standings-fixture-home">{home}</span>
                          <span className="standings-fixture-sep">
                            {fx.score ?? '–'}
                          </span>
                          <span className="standings-fixture-away">{away}</span>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ) : null}
            </section>
          ) : null}

          {selectedId === 'coppaItalia' ? (
            <section className="match-competition" aria-labelledby="table-coppa">
              <header className="match-competition-header">
                <h3 className="match-competition-title" id="table-coppa">
                  {L(coppa.name)}
                </h3>
                <p className="home-section-hint">
                  {t('tableUpdated').replace('{date}', dataset.updatedAt)}
                  {dataset.sources.coppaItalia ? (
                    <>
                      {' · '}
                      <a
                        href={dataset.sources.coppaItalia}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Transfermarkt
                      </a>
                    </>
                  ) : null}
                </p>
              </header>

              {coppa.ourPath?.next ? (
                <div className="standings-our-path">
                  <div className="section-title">{t('tableOurPath')}</div>
                  <p className="standings-our-path-body">
                    <strong>{coppa.ourPath.next.round}</strong>
                    {' · '}
                    {formatDate(coppa.ourPath.next.date, locale)}
                    {' · '}
                    {teamNameById(league, coppa.ourPath.next.homeId)}
                    {' – '}
                    {teamNameById(league, coppa.ourPath.next.awayId)}
                  </p>
                </div>
              ) : null}

              {coppa.rounds.length === 0 ? (
                <p className="home-empty">{t('tableCupEmpty')}</p>
              ) : (
                coppa.rounds.map((round) => (
                  <div key={round.id} className="standings-cup-round">
                    <h4 className="standings-matchday-title">{L(round.name)}</h4>
                    {round.note ? (
                      <p className="home-section-hint">{round.note}</p>
                    ) : null}
                    <ul className="standings-fixture-list">
                      {round.fixtures.map((fx, i) => (
                        <li
                          key={`${round.id}-${i}`}
                          className={
                            fx.us
                              ? 'standings-fixture standings-fixture--us'
                              : 'standings-fixture'
                          }
                        >
                          <span className="standings-fixture-date">
                            {formatDate(fx.date, locale)}
                          </span>
                          <span className="standings-fixture-home">{fx.home}</span>
                          <span className="standings-fixture-sep">
                            {fx.score ?? '–'}
                          </span>
                          <span className="standings-fixture-away">{fx.away}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              )}
            </section>
          ) : null}

          {selectedId === 'uefaYouthLeague' ? (
            <section className="match-competition" aria-labelledby="table-uyl">
              <header className="match-competition-header">
                <h3 className="match-competition-title" id="table-uyl">
                  {L(uyl.name)}
                </h3>
              </header>
              <p className="home-empty">{t('tableUylEmpty')}</p>
            </section>
          ) : null}
        </div>
      </section>
    </div>
  );
}
