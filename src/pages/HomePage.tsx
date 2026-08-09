import { Link } from 'react-router-dom';
import MatchCard from '../components/MatchCard';
import ReportHeader from '../components/ReportHeader';
import TrainingCard from '../components/TrainingCard';
import {
  getCalendarEvents,
  groupEventsByDate,
  toIsoDate,
  weekDays,
  type CalendarEvent,
} from '../data/calendarEvents';
import { getAllMatches, getMatchBySlug } from '../data/matches';
import { getAllTrainings } from '../data/trainings';
import { getWeekStartMonday } from '../data/trainingWeeks';
import { useLanguage } from '../i18n/LanguageContext';
import type { MatchSummary } from '../types/match';
import type { TrainingSummary } from '../types/training';

function todayIso(): string {
  return toIsoDate(new Date());
}

function pickLastMatch(matches: MatchSummary[], today: string): MatchSummary | null {
  return matches.find((m) => m.date <= today) ?? null;
}

function pickNextMatch(matches: MatchSummary[], today: string): MatchSummary | null {
  const upcoming = [...matches]
    .filter((m) => m.date > today)
    .sort((a, b) => a.date.localeCompare(b.date));
  return upcoming[0] ?? null;
}

function weekEvents(events: CalendarEvent[], today: string): CalendarEvent[] {
  const monday = getWeekStartMonday(today);
  const days = new Set(weekDays(monday));
  return events.filter((e) => days.has(e.date));
}

export default function HomePage() {
  const { t, L, formatDate } = useLanguage();
  const today = todayIso();
  const matches = getAllMatches();
  const trainings = getAllTrainings();
  const events = getCalendarEvents();

  const lastMatch = pickLastMatch(matches, today);
  const nextMatch = pickNextMatch(matches, today);
  const thisWeek = weekEvents(events, today);
  const weekByDate = groupEventsByDate(thisWeek);
  const weekDates = weekDays(getWeekStartMonday(today));
  const recentTrainings = trainings.slice(0, 3);

  const lastMatchFull = lastMatch ? getMatchBySlug(lastMatch.slug) : undefined;
  const clipCount = lastMatchFull?.clips?.length ?? 0;
  const analysisCount = lastMatchFull?.analysisVideos?.length ?? 0;

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

      <section className="home-dash" aria-label={t('homeDashboard')}>
        <div className="home-dash-intro">
          <div>
            <p className="home-dash-kicker">{t('homeCreatorBrand')}</p>
            <h1 className="home-dash-title">{t('homeStaffDashboard')}</h1>
            <p className="home-dash-lead">{t('homeDashLead')}</p>
          </div>
          <span className="home-draft-badge">{t('homeDraftPreview')}</span>
        </div>

        <section className="home-section" aria-labelledby="home-week-heading">
          <div className="home-section-head">
            <h2 id="home-week-heading" className="section-title">
              {t('homeThisWeek')}
            </h2>
            <Link to="/calendar" className="home-section-link">
              {t('homeOpenCalendar')}
            </Link>
          </div>
          <p className="home-section-hint">{t('homeThisWeekHint')}</p>

          {thisWeek.length === 0 ? (
            <p className="home-empty">{t('homeNoWeekEvents')}</p>
          ) : (
            <div className="home-week-strip" role="list">
              {weekDates.map((date) => {
                const dayEvents = weekByDate.get(date) ?? [];
                if (dayEvents.length === 0) return null;
                return (
                  <div key={date} className="home-week-day" role="listitem">
                    <div className="home-week-day-label">
                      {formatDate(date)}
                      {date === today ? (
                        <span className="home-week-today">{t('homeToday')}</span>
                      ) : null}
                    </div>
                    <ul className="home-week-events">
                      {dayEvents.map((event) => (
                        <li key={event.id}>
                          <Link to={event.href} className={`home-week-chip ${event.kind}`}>
                            <span className="home-week-chip-kind">
                              {event.kind === 'match'
                                ? t('calendarKindMatch')
                                : t('calendarKindTraining')}
                            </span>
                            <span className="home-week-chip-title">{L(event.title)}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        <section className="home-match-grid" aria-label={t('homeMatchFocus')}>
          <div className="home-panel">
            <div className="home-section-head">
              <h2 className="section-title">{t('homeLastMatch')}</h2>
              {lastMatch ? (
                <Link to={`/match/${lastMatch.slug}`} className="home-section-link">
                  {t('homeOpenReport')}
                </Link>
              ) : null}
            </div>
            {lastMatch ? (
              <>
                <MatchCard match={lastMatch} />
                <ul className="home-match-meta-list">
                  <li>
                    {t('homeClipsAvailable').replace('{n}', String(clipCount))}
                  </li>
                  <li>
                    {t('homeAnalysisItems').replace('{n}', String(analysisCount))}
                  </li>
                </ul>
              </>
            ) : (
              <p className="home-empty">{t('homeNoLastMatch')}</p>
            )}
          </div>

          <div className="home-panel">
            <div className="home-section-head">
              <h2 className="section-title">{t('homeNextMatch')}</h2>
              {nextMatch ? (
                <Link to={`/match/${nextMatch.slug}`} className="home-section-link">
                  {t('homeOpenPreview')}
                </Link>
              ) : null}
            </div>
            {nextMatch ? (
              <>
                <MatchCard match={nextMatch} />
                <p className="home-section-hint home-panel-note">{t('homeNextMatchHint')}</p>
              </>
            ) : (
              <p className="home-empty">{t('homeNoNextMatch')}</p>
            )}
          </div>
        </section>

        <section className="home-section" aria-labelledby="home-briefing-heading">
          <div className="home-section-head">
            <h2 id="home-briefing-heading" className="section-title">
              {t('homeCoachBriefing')}
            </h2>
            <span className="home-draft-badge home-draft-badge-inline">
              {t('homeDraftPreview')}
            </span>
          </div>
          <p className="home-section-hint">{t('homeCoachBriefingHint')}</p>
          <div className="home-briefing">
            <div className="home-briefing-col">
              <h3>{t('homeTakeaways')}</h3>
              <ol>
                <li>{t('homeTakeaway1')}</li>
                <li>{t('homeTakeaway2')}</li>
                <li>{t('homeTakeaway3')}</li>
              </ol>
            </div>
            <div className="home-briefing-col">
              <h3>{t('homeTrainingPriorities')}</h3>
              <ol>
                <li>{t('homePriority1')}</li>
                <li>{t('homePriority2')}</li>
                <li>{t('homePriority3')}</li>
              </ol>
            </div>
            {lastMatch ? (
              <Link
                to={`/match/${lastMatch.slug}`}
                className="home-briefing-cta"
              >
                {t('homeReviewClips')}
              </Link>
            ) : null}
          </div>
        </section>

        <section className="home-section" aria-labelledby="home-trainings-heading">
          <div className="home-section-head">
            <h2 id="home-trainings-heading" className="section-title">
              {t('homeRecentTraining')}
            </h2>
            <Link to="/trainings" className="home-section-link">
              {t('homeAllTrainings')}
            </Link>
          </div>
          {recentTrainings.length === 0 ? (
            <p className="home-empty">{t('noTrainingsYet')}</p>
          ) : (
            <div className="home-card-grid">
              {recentTrainings.map((session: TrainingSummary) => (
                <TrainingCard key={session.id} session={session} />
              ))}
            </div>
          )}
        </section>

        <nav className="home-quick-links" aria-label={t('homeQuickLinks')}>
          <Link to="/calendar" className="home-quick-link">
            {t('calendar')}
          </Link>
          <Link to="/matches" className="home-quick-link">
            {t('matches')}
          </Link>
          <Link to="/trainings" className="home-quick-link">
            {t('navTraining')}
          </Link>
          <Link to="/players" className="home-quick-link">
            {t('players')}
          </Link>
        </nav>

        <footer className="home-dash-footer">
          <p className="home-credit-label">{t('homeCreatedBy')}</p>
          <p className="home-credit-name">{t('homeCreatorName')}</p>
          <p className="home-analyst-credit">{t('homeCreatorBrand')}</p>
        </footer>
      </section>
    </div>
  );
}
