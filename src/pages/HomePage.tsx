import { Link } from 'react-router-dom';
import ReportHeader from '../components/ReportHeader';
import {
  addUtcDays,
  getCalendarEvents,
  weekDays,
  type CalendarEvent,
} from '../data/calendarEvents';
import { MATCH_COMPETITION_LABELS, MATCH_COMPETITION_TAB_KEYS } from '../data/matchCompetitions';
import { getAllMatches, getMatchBySlug } from '../data/matches';
import {
  getNextOppositionTarget,
  isNapoliHomeVsOpponent,
} from '../data/opposition';
import {
  formatRpe,
  getAllRpeSessions,
} from '../data/rpeLoad';
import {
  getCoppaItaliaStandings,
  getPrimavera2Standings,
  getUefaYouthLeagueStandings,
  STANDING_COMPETITION_ORDER,
  standingRowClassName,
  teamNameById,
  type CupStandings,
  type StandingCompetitionId,
} from '../data/standings';
import { teamCrestUrl } from '../data/teamLogos';
import { getWeekStartMonday } from '../data/trainingWeeks';
import { useLanguage } from '../i18n/LanguageContext';
import type { Localized } from '../i18n/translations';
import type { MatchSummary } from '../types/match';
import type { ScoutNote } from '../types/scoutNotes';

function todayIso(): string {
  return new Date().toISOString().slice(0, 10);
}

function isNapoliSide(name: string): boolean {
  return /napoli/i.test(name);
}

function opponentOf(match: MatchSummary): string {
  return isNapoliSide(match.homeTeam) ? match.awayTeam : match.homeTeam;
}

function venueOf(match: MatchSummary): 'H' | 'A' {
  return isNapoliSide(match.homeTeam) ? 'H' : 'A';
}

function resultTone(
  match: MatchSummary
): 'win' | 'loss' | 'draw' | undefined {
  const homeUs = isNapoliSide(match.homeTeam);
  const us = homeUs ? match.score.home : match.score.away;
  const them = homeUs ? match.score.away : match.score.home;
  if (us > them) return 'win';
  if (us < them) return 'loss';
  return 'draw';
}

function formatScore(match: MatchSummary): string {
  return `${match.score.home}–${match.score.away}`;
}

function shortDate(iso: string): string {
  const [, m, d] = iso.split('-');
  return `${d}/${m}`;
}

/** Drop "Monday training —" / "Lunedì —" so cells show the theme only. */
function shortCalendarLabel(
  title: string,
  kind: CalendarEvent['kind']
): string {
  const dashSplit = title.split(/\s*[—–]\s*/);
  if (dashSplit.length > 1) {
    const theme = dashSplit.slice(1).join(' — ').trim();
    if (theme) return theme;
  }
  if (kind === 'match') {
    const vs = title.replace(/^.*?\s+vs\.?\s+/i, '').trim();
    if (vs && vs !== title) return vs;
  }
  return title;
}

function firstWentWellText(
  notes: ScoutNote[] | undefined,
  L: (value: Localized | undefined) => string
): string {
  const first = notes?.[0];
  if (!first) return '';
  return L(first.text);
}

function dowShort(iso: string, locale: 'en' | 'it'): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  return dt.toLocaleDateString(locale === 'it' ? 'it-IT' : 'en-GB', {
    weekday: 'short',
    timeZone: 'UTC',
  });
}

function pickLatestPulse(matches: MatchSummary[], today: string) {
  const past = matches
    .filter((m) => m.status === 'published' && m.date <= today)
    .sort((a, b) => b.date.localeCompare(a.date));
  for (const summary of past) {
    const full = getMatchBySlug(summary.slug);
    if (!full) continue;
    const hasDepth =
      (full.analysisVideos?.length ?? 0) > 0 ||
      (full.clips?.length ?? 0) > 0 ||
      (full.reflection?.wentWell?.length ?? 0) > 0;
    if (hasDepth) return { summary, full };
  }
  if (past[0]) {
    return { summary: past[0], full: getMatchBySlug(past[0].slug) ?? null };
  }
  return null;
}

function fixtureStrip(matches: MatchSummary[], today: string): MatchSummary[] {
  const past = matches
    .filter((m) => m.date < today)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, 2)
    .reverse();
  const upcoming = matches
    .filter((m) => m.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, 4);
  return [...past, ...upcoming];
}

/** Focus table on the next competitive tournament (skip friendlies). */
function homeFocusCompetition(
  matches: MatchSummary[],
  today: string
): StandingCompetitionId {
  const isStandingComp = (
    id: MatchSummary['competitionId']
  ): id is StandingCompetitionId =>
    id === 'primavera2' || id === 'coppaItalia' || id === 'uefaYouthLeague';

  const upcoming = matches
    .filter((m) => m.date >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
  for (const m of upcoming) {
    if (isStandingComp(m.competitionId)) return m.competitionId;
  }

  const past = matches
    .filter((m) => m.date < today)
    .sort((a, b) => b.date.localeCompare(a.date));
  for (const m of past) {
    if (isStandingComp(m.competitionId)) return m.competitionId;
  }

  return 'primavera2';
}

function cupTitle(cup: CupStandings, locale: 'en' | 'it'): string {
  return cup.name[locale] ?? cup.name.en;
}

export default function HomePage() {
  const { t, L, locale } = useLanguage();
  const today = todayIso();
  const matches = getAllMatches().filter((m) => m.status === 'published');
  const pulse = pickLatestPulse(matches, today);
  const fixtures = fixtureStrip(matches, today);
  const nextOpp = getNextOppositionTarget(today);
  const league = getPrimavera2Standings();
  const coppa = getCoppaItaliaStandings();
  const uyl = getUefaYouthLeagueStandings();
  const focusCompetition = homeFocusCompetition(matches, today);
  const otherCompetitions = STANDING_COMPETITION_ORDER.filter(
    (id) => id !== focusCompetition
  );
  const focusTitle =
    focusCompetition === 'primavera2'
      ? L(league.name)
      : focusCompetition === 'coppaItalia'
        ? cupTitle(coppa, locale)
        : cupTitle(uyl, locale);
  const rpeSessions = getAllRpeSessions();
  const latestRpe = [...rpeSessions].sort((a, b) =>
    b.date.localeCompare(a.date)
  )[0];

  const weekStart = getWeekStartMonday(today);
  const weekA = weekDays(weekStart);
  const weekB = weekDays(addUtcDays(weekStart, 7));
  const fortnightWeeks = [weekA, weekB];
  const events = getCalendarEvents();
  const eventsByDate = new Map<string, CalendarEvent[]>();
  for (const ev of events) {
    const list = eventsByDate.get(ev.date) ?? [];
    list.push(ev);
    eventsByDate.set(ev.date, list);
  }

  const pulseHref = pulse ? `/match/${pulse.summary.slug}` : '/matches';
  const pulseTitle = pulse
    ? `${opponentOf(pulse.summary)} · ${formatScore(pulse.summary)}`
    : t('homePulseEmpty');
  const wentWellText = firstWentWellText(
    pulse?.full?.reflection?.wentWell,
    L
  );
  const pulseBlurb = wentWellText
    ? wentWellText.slice(0, 90) + (wentWellText.length > 90 ? '…' : '')
    : pulse
      ? `${L(pulse.summary.competition)} · ${shortDate(pulse.summary.date)}`
      : t('homePulseEmptyHint');

  function renderDayCell(iso: string) {
    const dayEvents = eventsByDate.get(iso) ?? [];
    const primary = dayEvents[0];
    const isToday = iso === today;
    const kind = primary?.kind ?? 'off';
    return (
      <div
        key={iso}
        className={`home-week-day home-week-day--${kind}${
          isToday ? ' home-week-day--today' : ''
        }`}
      >
        <span className="home-week-dow">
          {dowShort(iso, locale)} {iso.slice(8)}
        </span>
        {primary ? (
          <Link to={primary.href} className="home-week-link">
            {shortCalendarLabel(L(primary.title), primary.kind)}
          </Link>
        ) : (
          <span className="home-week-off">—</span>
        )}
      </div>
    );
  }

  return (
    <div className="app-shell">
      <div className="report-page">
        <ReportHeader
          pageTitle={t('homePageTitle')}
          matchTitle={t('homeDashboard')}
          matchDate={today}
          competition={t('season')}
        />
      </div>

      <section className="home-portal" aria-label={t('homePortalAria')}>
        <div className="home-portal-layout">
          <div className="home-portal-upper">
            <div className="home-portal-main-upper">
              <div className="home-portal-top">
                {/* Latest pulse — compact */}
                <article className="home-tile home-tile--pulse">
                  <header className="home-tile-header">
                    <span className="home-tile-kicker">
                      {t('homePulseKicker')}
                    </span>
                    <h2 className="home-tile-title">{t('homePulseTitle')}</h2>
                  </header>
                  <div className="home-tile-body">
                    <h3 className="home-pulse-headline">{pulseTitle}</h3>
                    <p className="home-tile-text">{pulseBlurb}</p>
                  </div>
                  {pulse ? (
                    <Link className="home-tile-link" to={pulseHref}>
                      {t('homeOpenMatch')}
                    </Link>
                  ) : (
                    <Link className="home-tile-link" to="/matches">
                      {t('matches')}
                    </Link>
                  )}
                </article>

                {/* Next opponent */}
                <article className="home-tile home-tile--next">
                  <header className="home-tile-header">
                    <span className="home-tile-kicker">
                      {t('homeNextKicker')}
                    </span>
                    <h2 className="home-tile-title">{t('homeNextTitle')}</h2>
                  </header>
                  {nextOpp ? (
                    <>
                      <div className="home-tile-body">
                        <div className="home-next-crest-row">
                          <img
                            className="home-next-crest"
                            src={teamCrestUrl(
                              { logo: nextOpp.opponent.logo },
                              'onLight'
                            )}
                            alt=""
                            width={36}
                            height={36}
                          />
                          <h3 className="home-pulse-headline">
                            {nextOpp.opponent.shortName}
                          </h3>
                        </div>
                        <p className="home-tile-text">
                          {dowShort(nextOpp.match.date, locale)}{' '}
                          {shortDate(nextOpp.match.date)} ·{' '}
                          {L(
                            MATCH_COMPETITION_LABELS[
                              nextOpp.match.competitionId
                            ]
                          )}{' '}
                          ·{' '}
                          {isNapoliHomeVsOpponent(
                            nextOpp.match,
                            nextOpp.opponent
                          )
                            ? t('oppositionHomeFull')
                            : t('oppositionAwayFull')}
                        </p>
                        <p className="home-tile-meta">
                          {t('homeNextSystem')}:{' '}
                          {[
                            nextOpp.opponent.formationSystem,
                            ...(nextOpp.opponent.alternateFormationSystems ??
                              []),
                          ].join(' · ')}
                        </p>
                      </div>
                      <Link
                        className="home-tile-link"
                        to={`/opposition/${nextOpp.opponent.slug}`}
                      >
                        {t('homeOpenOpposition')}
                      </Link>
                    </>
                  ) : (
                    <p className="home-tile-text">{t('homeNextEmpty')}</p>
                  )}
                </article>

                {/* Physical pulse */}
                <article className="home-tile home-tile--load">
                  <header className="home-tile-header">
                    <span className="home-tile-kicker">
                      {t('homeLoadKicker')}
                    </span>
                    <h2 className="home-tile-title">{t('homeLoadTitle')}</h2>
                  </header>
                  {latestRpe ? (
                    <>
                      <div className="home-tile-body">
                        <div className="home-load-stats">
                          <div className="home-stat">
                            <span className="home-stat-value">
                              {formatRpe(latestRpe.avgRpe)}
                            </span>
                            <span className="home-stat-label">
                              {t('homeLoadAvgRpe')} ·{' '}
                              {shortDate(latestRpe.date)}
                            </span>
                          </div>
                          <div className="home-stat">
                            <span className="home-stat-value">
                              {latestRpe.playersAnswered}
                            </span>
                            <span className="home-stat-label">
                              {t('homeLoadAnswered')}
                            </span>
                          </div>
                        </div>
                      </div>
                      {latestRpe.trainingSlug ? (
                        <Link
                          className="home-tile-link"
                          to={`/training/${latestRpe.trainingSlug}`}
                        >
                          {t('homeOpenSession')}
                        </Link>
                      ) : latestRpe.matchSlug ? (
                        <Link
                          className="home-tile-link"
                          to={`/match/${latestRpe.matchSlug}`}
                        >
                          {t('homeOpenMatch')}
                        </Link>
                      ) : null}
                    </>
                  ) : (
                    <p className="home-tile-text">{t('homeLoadEmpty')}</p>
                  )}
                </article>
              </div>

              {/* Fixtures */}
              <article className="home-tile home-tile--fixtures">
                <header className="home-tile-header">
                  <span className="home-tile-kicker">
                    {t('homeFixturesKicker')}
                  </span>
                  <h2 className="home-tile-title">{t('homeFixturesTitle')}</h2>
                </header>
                <ul className="home-fixture-list">
                  {fixtures.map((m) => {
                    const past = m.date < today;
                    const tone = past ? resultTone(m) : undefined;
                    return (
                      <li key={m.id}>
                        <Link
                          to={`/match/${m.slug}`}
                          className="home-fixture-row"
                        >
                          <span className="home-fixture-date">
                            {dowShort(m.date, locale)} {shortDate(m.date)}
                          </span>
                          <span className="home-fixture-main">
                            <span className="home-fixture-opp">
                              {opponentOf(m)}
                            </span>
                            <span className="home-fixture-meta">
                              {L(MATCH_COMPETITION_LABELS[m.competitionId])} ·{' '}
                              {venueOf(m) === 'H'
                                ? t('oppositionHomeFull')
                                : t('oppositionAwayFull')}
                            </span>
                          </span>
                          <span
                            className={
                              tone
                                ? `home-fixture-score home-fixture-score--${tone}`
                                : 'home-fixture-score'
                            }
                          >
                            {past ? formatScore(m) : '—'}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <Link className="home-tile-link" to="/matches">
                  {t('homeAllMatches')}
                </Link>
              </article>

              {/* Fortnight microcycle — under schedule on the left */}
              <article className="home-tile home-tile--week">
                <header className="home-tile-header">
                  <span className="home-tile-kicker">{t('homeWeekKicker')}</span>
                  <h2 className="home-tile-title">{t('homeWeekTitle')}</h2>
                </header>
                <div className="home-fortnight">
                  {fortnightWeeks.map((days, weekIdx) => (
                    <div key={weekIdx} className="home-fortnight-week">
                      <span className="home-fortnight-label">
                        {weekIdx === 0
                          ? t('homeFortnightThisWeek')
                          : t('homeFortnightNextWeek')}
                      </span>
                      <div className="home-week-grid">
                        {days.map(renderDayCell)}
                      </div>
                    </div>
                  ))}
                </div>
                <Link className="home-tile-link" to="/calendar">
                  {t('homeOpenCalendar')}
                </Link>
              </article>
            </div>

            {/* Standings — follows next competitive tournament */}
            <aside className="home-portal-side">
              <article className="home-tile home-tile--table">
                <header className="home-tile-header">
                  <span className="home-tile-kicker">
                    {t('homeTableKicker')}
                  </span>
                  <h2 className="home-tile-title">{focusTitle}</h2>
                </header>

                <div className="home-standings-body">
                  {focusCompetition === 'primavera2' ? (
                    <>
                      <div className="standings-table-wrap home-standings-wrap">
                        <table className="standings-table home-standings-table">
                          <thead>
                            <tr>
                              <th scope="col">{t('tableColPos')}</th>
                              <th scope="col">{t('tableColTeam')}</th>
                              <th scope="col">{t('tableColPts')}</th>
                            </tr>
                          </thead>
                          <tbody>
                            {league.rows.map((row, index) => {
                              const rank = row.pos || index + 1;
                              return (
                                <tr
                                  key={row.teamId}
                                  className={standingRowClassName(
                                    rank,
                                    row.us
                                  )}
                                >
                                  <td className="standings-pos">{rank}</td>
                                  <td className="standings-team">
                                    {row.us ? (
                                      <span className="standings-team-inner">
                                        {row.shortName}
                                      </span>
                                    ) : (
                                      <Link
                                        to={`/opposition/${row.teamId}`}
                                        className="standings-team-link"
                                      >
                                        {row.shortName}
                                      </Link>
                                    )}
                                  </td>
                                  <td className="standings-pts">{row.pts}</td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                      <div className="home-table-footer">
                        <ul
                          className="home-table-legend"
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
                      </div>
                    </>
                  ) : null}

                  {focusCompetition === 'uefaYouthLeague' && uyl.groupTable ? (
                    <div className="standings-table-wrap home-standings-wrap">
                      <table className="standings-table home-standings-table">
                        <thead>
                          <tr>
                            <th scope="col">{t('tableColPos')}</th>
                            <th scope="col">{t('tableColTeam')}</th>
                            <th scope="col">{t('tableColPts')}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {uyl.groupTable.rows.map((row, index) => {
                            const rank = row.pos || index + 1;
                            return (
                              <tr
                                key={row.teamId}
                                className={standingRowClassName(rank, row.us, {
                                  zones: false,
                                })}
                              >
                                <td className="standings-pos">{rank}</td>
                                <td className="standings-team">
                                  <span className="standings-team-inner">
                                    {row.shortName}
                                  </span>
                                </td>
                                <td className="standings-pts">{row.pts}</td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  ) : null}

                  {focusCompetition === 'coppaItalia' ||
                  (focusCompetition === 'uefaYouthLeague' &&
                    !uyl.groupTable) ? (
                    <div className="home-cup-compact">
                      {(() => {
                        const cup =
                          focusCompetition === 'coppaItalia' ? coppa : uyl;
                        if (cup.ourPath?.next) {
                          return (
                            <p className="home-cup-next">
                              <strong>{t('tableOurPath')}</strong>
                              {': '}
                              {cup.ourPath.next.round}
                              {' · '}
                              {shortDate(cup.ourPath.next.date)}
                              {' · '}
                              {teamNameById(
                                league,
                                cup.ourPath.next.homeId
                              )}
                              {' – '}
                              {teamNameById(
                                league,
                                cup.ourPath.next.awayId
                              )}
                            </p>
                          );
                        }
                        return null;
                      })()}
                      {(() => {
                        const cup =
                          focusCompetition === 'coppaItalia' ? coppa : uyl;
                        if (cup.rounds.length === 0) {
                          return (
                            <p className="home-cup-empty">
                              {focusCompetition === 'uefaYouthLeague'
                                ? t('tableUylEmpty')
                                : t('tableCupEmpty')}
                            </p>
                          );
                        }
                        return cup.rounds.map((round) => (
                          <div key={round.id}>
                            <h3 className="home-cup-round-title">
                              {L(round.name)}
                            </h3>
                            <ul className="home-cup-fixture-list">
                              {round.fixtures.map((fx, i) => (
                                <li
                                  key={`${round.id}-${i}`}
                                  className={
                                    fx.us
                                      ? 'home-cup-fixture home-cup-fixture--us'
                                      : 'home-cup-fixture'
                                  }
                                >
                                  <span className="home-cup-fixture-home">
                                    {fx.home}
                                  </span>
                                  <span className="home-cup-fixture-sep">
                                    {fx.score ?? '–'}
                                  </span>
                                  <span className="home-cup-fixture-away">
                                    {fx.away}
                                  </span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        ));
                      })()}
                    </div>
                  ) : null}
                </div>

                <div className="home-table-other">
                  <Link
                    className="home-tile-link"
                    to={`/table?c=${focusCompetition}`}
                  >
                    {t('homeOpenTable')}
                  </Link>
                  <span className="home-table-other-label">
                    {t('homeOtherTablesTitle')}
                  </span>
                  <ul
                    className="home-table-comp-list"
                    aria-label={t('homeOtherTablesAria')}
                  >
                    {otherCompetitions.map((id) => (
                      <li key={id}>
                        <Link
                          className="home-table-comp-link"
                          to={`/table?c=${id}`}
                        >
                          <span>{t(MATCH_COMPETITION_TAB_KEYS[id])}</span>
                          <span
                            className="home-table-comp-link-arrow"
                            aria-hidden
                          >
                            →
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </article>
            </aside>
          </div>
        </div>

        <footer className="home-credit-strip" aria-label={t('homeCreatedBy')}>
          <span className="home-credit-strip-label">{t('homeCreatedBy')}</span>
          <span className="home-credit-strip-name">
            {t('homeCreatorName')}
          </span>
          <span className="home-credit-strip-sep" aria-hidden>
            ·
          </span>
          <span className="home-credit-strip-brand">
            {t('homeCreatorBrand')}
          </span>
        </footer>
      </section>
    </div>
  );
}
