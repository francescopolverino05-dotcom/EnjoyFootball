import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import ReportHeader from '../components/ReportHeader';
import {
  addUtcDays,
  daysInMonth,
  defaultSelectedDate,
  getCalendarEvents,
  getCalendarMonths,
  groupEventsByDate,
  isoDate,
  mondayFirstOffset,
  monthKeyFromIso,
  passesCalendarFilter,
  seasonWeekLabel,
  weekDays,
  type CalendarEvent,
  type CalendarFilter,
  type CalendarViewMode,
} from '../data/calendarEvents';
import { getWeekStartMonday } from '../data/trainingWeeks';
import { useLanguage } from '../i18n/LanguageContext';
import type { Locale } from '../i18n/translations';
import { TRAINING_SESSION_TYPE_LABELS } from '../data/trainingDayTypes';
import MicrocycleDayBadge from '../components/MicrocycleDayBadge';

const DOW_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const DOW_IT = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom'];

const MONTH_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
const MONTH_IT = [
  'Gennaio',
  'Febbraio',
  'Marzo',
  'Aprile',
  'Maggio',
  'Giugno',
  'Luglio',
  'Agosto',
  'Settembre',
  'Ottobre',
  'Novembre',
  'Dicembre',
];

function dowLabels(locale: Locale): string[] {
  return locale === 'it' ? DOW_IT : DOW_EN;
}

function monthLabel(year: number, monthIndex: number, locale: Locale): string {
  const names = locale === 'it' ? MONTH_IT : MONTH_EN;
  return `${names[monthIndex]} ${year}`;
}

function formatDayHeading(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dow = dowLabels(locale)[(dt.getUTCDay() + 6) % 7];
  const months = locale === 'it' ? MONTH_IT : MONTH_EN;
  return `${dow} ${d} ${months[m - 1]} ${y}`;
}

function formatWeekRange(mondayIso: string, locale: Locale): string {
  const sunday = addUtcDays(mondayIso, 6);
  const short = (iso: string) => {
    const [, m, d] = iso.split('-').map(Number);
    const months = locale === 'it' ? MONTH_IT : MONTH_EN;
    return `${d} ${months[m - 1].slice(0, 3)}`;
  };
  return `${short(mondayIso)} – ${short(sunday)}`;
}

function EventKindDot({ kind }: { kind: CalendarEvent['kind'] }) {
  return (
    <span
      className={`calendar-dot calendar-dot--${kind}`}
      aria-hidden="true"
    />
  );
}

function EventCard({
  event,
  showDate,
}: {
  event: CalendarEvent;
  showDate?: boolean;
}) {
  const { t, L, formatDate } = useLanguage();
  const kindLabel =
    event.kind === 'match'
      ? t('calendarKindMatch')
      : event.sessionType
        ? L(TRAINING_SESSION_TYPE_LABELS[event.sessionType])
        : t('calendarKindTraining');

  return (
    <Link to={event.href} className={`calendar-event-card calendar-event-card--${event.kind}`}>
      <div className="calendar-event-card-top">
        <EventKindDot kind={event.kind} />
        {event.microcycleDay ? (
          <MicrocycleDayBadge day={event.microcycleDay} />
        ) : null}
        <span className="calendar-event-kind">{kindLabel}</span>
        {event.timeLabel ? (
          <span className="calendar-event-time">{event.timeLabel}</span>
        ) : null}
        <span className="calendar-event-week">
          {t('trainingWeek').replace('{n}', String(event.weekNumber))}
        </span>
      </div>
      {showDate ? (
        <div className="calendar-event-date">{formatDate(event.date)}</div>
      ) : null}
      <div className="calendar-event-title">{L(event.title)}</div>
      {event.subtitle ? (
        <div className="calendar-event-subtitle">{L(event.subtitle)}</div>
      ) : null}
      <div className="calendar-event-open">
        {event.kind === 'match' ? t('calendarOpenMatch') : t('calendarOpenSession')}
      </div>
    </Link>
  );
}

export default function CalendarPage() {
  const { t, L, locale } = useLanguage();
  const events = useMemo(() => getCalendarEvents(), []);
  const months = useMemo(() => getCalendarMonths(events), [events]);

  const [viewMode, setViewMode] = useState<CalendarViewMode>('month');
  const [filter, setFilter] = useState<CalendarFilter>('all');
  const [selectedDate, setSelectedDate] = useState(() =>
    defaultSelectedDate(events)
  );
  const [monthKey, setMonthKey] = useState(() =>
    monthKeyFromIso(defaultSelectedDate(events))
  );

  const filtered = useMemo(
    () => events.filter((e) => passesCalendarFilter(e, filter)),
    [events, filter]
  );
  const byDate = useMemo(() => groupEventsByDate(filtered), [filtered]);
  const selectedEvents = byDate.get(selectedDate) ?? [];

  const month =
    months.find((m) => m.key === monthKey) ??
    months[months.length - 1] ??
    (() => {
      const [y, m] = monthKey.split('-').map(Number);
      return { key: monthKey, year: y, month: m - 1 };
    })();

  const weekMonday = getWeekStartMonday(selectedDate);
  const weekIsoDays = weekDays(weekMonday);
  const weekSeason = seasonWeekLabel(weekMonday, events);
  const weekEvents = filtered.filter((e) => weekIsoDays.includes(e.date));

  const cells: { day: number | null; iso: string | null }[] = [];
  if (month) {
    const offset = mondayFirstOffset(month.year, month.month);
    const totalDays = daysInMonth(month.year, month.month);
    for (let i = 0; i < offset; i++) cells.push({ day: null, iso: null });
    for (let d = 1; d <= totalDays; d++) {
      cells.push({ day: d, iso: isoDate(month.year, month.month, d) });
    }
    while (cells.length % 7 !== 0) cells.push({ day: null, iso: null });
  }

  function selectDate(iso: string) {
    setSelectedDate(iso);
    setMonthKey(monthKeyFromIso(iso));
  }

  function shiftWeek(delta: number) {
    selectDate(addUtcDays(weekMonday, delta * 7));
  }

  function shiftDay(delta: number) {
    selectDate(addUtcDays(selectedDate, delta));
  }

  const viewTitle =
    viewMode === 'month'
      ? monthLabel(month.year, month.month, locale)
      : viewMode === 'week'
        ? `${
            weekSeason != null
              ? t('trainingWeek').replace('{n}', String(weekSeason))
              : t('calendarWeek')
          } · ${formatWeekRange(weekMonday, locale)}`
        : formatDayHeading(selectedDate, locale);

  const trainingCount = events.filter((e) => e.kind === 'training').length;
  const matchCount = events.filter((e) => e.kind === 'match').length;

  return (
    <div className="app-shell">
      <Link to="/" className="back-link">
        {t('backToHome')}
      </Link>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('calendarPageTitle')}
          matchTitle={t('calendar')}
          matchDate={new Date().toISOString().slice(0, 10)}
          competition={t('season')}
        />
      </div>

      <section className="home-section" aria-labelledby="calendar-heading">
        <div className="section-title" id="calendar-heading">
          {t('calendar')}
          {` (${filtered.length})`}
        </div>
        <p className="home-section-hint">{t('calendarHint')}</p>

        <div className="calendar-legend" aria-hidden="true">
          <span className="calendar-legend-item">
            <EventKindDot kind="training" />
            {t('calendarKindTraining')}
            {` (${trainingCount})`}
          </span>
          <span className="calendar-legend-item">
            <EventKindDot kind="match" />
            {t('calendarKindMatch')}
            {` (${matchCount})`}
          </span>
        </div>

        <div className="calendar-panel">
          <div className="calendar-toolbar">
            <div className="tabs-header calendar-view-tabs" role="tablist">
              {(
                [
                  ['day', 'calendarViewDay'],
                  ['week', 'calendarViewWeek'],
                  ['month', 'calendarViewMonth'],
                ] as const
              ).map(([id, key]) => {
                const active = viewMode === id;
                return (
                  <button
                    key={id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`tab-button ${active ? 'active' : ''}`}
                    onClick={() => setViewMode(id)}
                  >
                    {t(key)}
                  </button>
                );
              })}
            </div>

            <div className="calendar-filters" role="group" aria-label={t('calendarFilter')}>
              {(
                [
                  ['all', 'calendarFilterAll'],
                  ['trainings', 'calendarFilterTrainings'],
                  ['matches', 'calendarFilterMatches'],
                ] as const
              ).map(([id, key]) => (
                <button
                  key={id}
                  type="button"
                  className={`calendar-filter-chip ${filter === id ? 'active' : ''}`}
                  aria-pressed={filter === id}
                  onClick={() => setFilter(id)}
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </div>

          <header className="calendar-view-header">
            <h3 className="calendar-view-title">{viewTitle}</h3>
            <div className="calendar-nav-controls">
              {viewMode === 'month' && months.length > 0 ? (
                months.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    className={`calendar-filter-chip ${monthKey === m.key ? 'active' : ''}`}
                    onClick={() => setMonthKey(m.key)}
                  >
                    {monthLabel(m.year, m.month, locale)}
                  </button>
                ))
              ) : null}
              {viewMode === 'week' ? (
                <>
                  <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={() => shiftWeek(-1)}
                  >
                    {t('calendarPrevWeek')}
                  </button>
                  <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={() => shiftWeek(1)}
                  >
                    {t('calendarNextWeek')}
                  </button>
                </>
              ) : null}
              {viewMode === 'day' ? (
                <>
                  <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={() => shiftDay(-1)}
                  >
                    {t('calendarPrevDay')}
                  </button>
                  <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={() => shiftDay(1)}
                  >
                    {t('calendarNextDay')}
                  </button>
                </>
              ) : null}
            </div>
          </header>

          {events.length === 0 ? (
            <p className="home-empty">{t('calendarEmpty')}</p>
          ) : (
            <>
              {viewMode === 'month' ? (
                <div className="calendar-month-grid" role="grid">
                  {dowLabels(locale).map((d) => (
                    <div key={d} className="calendar-dow" role="columnheader">
                      {d}
                    </div>
                  ))}
                  {cells.map((cell, i) => {
                    if (!cell.iso) {
                      return (
                        <div
                          key={`empty-${i}`}
                          className="calendar-day calendar-day--empty"
                        />
                      );
                    }
                    const dayEvents = byDate.get(cell.iso) ?? [];
                    const hasTraining = dayEvents.some((e) => e.kind === 'training');
                    const hasMatch = dayEvents.some((e) => e.kind === 'match');
                    const selected = cell.iso === selectedDate;
                    const clickable = dayEvents.length > 0;
                    return (
                      <button
                        key={cell.iso}
                        type="button"
                        className={[
                          'calendar-day',
                          selected ? 'selected' : '',
                          clickable ? 'has-events' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => selectDate(cell.iso!)}
                      >
                        <span className="calendar-day-num">{cell.day}</span>
                        <span className="calendar-day-dots">
                          {hasTraining ? <EventKindDot kind="training" /> : null}
                          {hasMatch ? <EventKindDot kind="match" /> : null}
                        </span>
                        {dayEvents.length > 0 ? (
                          <span className="calendar-day-label">
                            {dayEvents.length === 1
                              ? dayEvents[0].kind === 'match'
                                ? t('calendarKindMatch')
                                : dayEvents[0].sessionType
                                  ? L(
                                      TRAINING_SESSION_TYPE_LABELS[
                                        dayEvents[0].sessionType
                                      ]
                                    )
                                  : t('calendarKindTraining')
                              : t('calendarItemsCount').replace(
                                  '{n}',
                                  String(dayEvents.length)
                                )}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              {viewMode === 'week' ? (
                <div className="calendar-week-grid">
                  {weekIsoDays.map((iso, i) => {
                    const dayEvents = byDate.get(iso) ?? [];
                    const selected = iso === selectedDate;
                    const dayNum = Number(iso.slice(8));
                    const hasTraining = dayEvents.some((e) => e.kind === 'training');
                    const hasMatch = dayEvents.some((e) => e.kind === 'match');
                    return (
                      <button
                        key={iso}
                        type="button"
                        className={[
                          'calendar-week-day',
                          selected ? 'selected' : '',
                          dayEvents.length > 0 ? 'has-events' : '',
                        ]
                          .filter(Boolean)
                          .join(' ')}
                        onClick={() => selectDate(iso)}
                      >
                        <span className="calendar-dow">{dowLabels(locale)[i]}</span>
                        <span className="calendar-day-num">{dayNum}</span>
                        <span className="calendar-day-dots">
                          {hasTraining ? <EventKindDot kind="training" /> : null}
                          {hasMatch ? <EventKindDot kind="match" /> : null}
                        </span>
                        {dayEvents.length > 0 ? (
                          <span className="calendar-day-label">
                            {dayEvents[0].kind === 'match'
                              ? t('calendarKindMatch')
                              : dayEvents[0].sessionType
                                ? L(
                                    TRAINING_SESSION_TYPE_LABELS[
                                      dayEvents[0].sessionType
                                    ]
                                  )
                                : t('calendarKindTraining')}
                            {dayEvents.length > 1
                              ? ` +${dayEvents.length - 1}`
                              : ''}
                          </span>
                        ) : null}
                      </button>
                    );
                  })}
                </div>
              ) : null}

              <div className="calendar-agenda">
                <header className="calendar-agenda-header">
                  <h4 className="calendar-agenda-title">
                    {viewMode === 'week' && selectedEvents.length === 0
                      ? `${t('calendarWeekAgenda')} · ${formatWeekRange(weekMonday, locale)}`
                      : `${t('calendarDayAgenda')} · ${formatDayHeading(selectedDate, locale)}`}
                  </h4>
                  <span className="calendar-agenda-count">
                    {viewMode === 'week' && selectedEvents.length === 0
                      ? weekEvents.length
                      : selectedEvents.length}
                  </span>
                </header>

                {viewMode === 'week' && selectedEvents.length === 0 ? (
                  weekEvents.length === 0 ? (
                    <p className="home-empty">{t('calendarNoEventsDay')}</p>
                  ) : (
                    <div className="calendar-event-list">
                      {weekEvents.map((event) => (
                        <EventCard key={event.id} event={event} showDate />
                      ))}
                    </div>
                  )
                ) : selectedEvents.length === 0 ? (
                  <p className="home-empty">{t('calendarNoEventsDay')}</p>
                ) : (
                  <div className="calendar-event-list">
                    {selectedEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                )}

                {viewMode === 'week' &&
                selectedEvents.length > 0 &&
                weekEvents.length > selectedEvents.length ? (
                  <div className="calendar-week-rest">
                    <p className="calendar-week-rest-label">
                      {t('calendarWeekAgenda')}
                    </p>
                    <div className="calendar-event-list">
                      {weekEvents
                        .filter((e) => e.date !== selectedDate)
                        .map((event) => (
                          <EventCard key={event.id} event={event} showDate />
                        ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
