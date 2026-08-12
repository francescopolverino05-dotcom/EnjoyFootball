import { Link, useParams } from 'react-router-dom';
import {
  formatTrainingTimeRange,
  resolveTrainingSessionType,
  TRAINING_SESSION_TYPE_LABELS,
} from '../data/trainingDayTypes';
import { getTrainingBySlug } from '../data/trainings';
import { getMicrocycleDay } from '../data/microcycleDays';
import ReportHeader from '../components/ReportHeader';
import TrainingDashboard from '../components/TrainingDashboard';
import MicrocycleDayBadge from '../components/MicrocycleDayBadge';
import { useLanguage } from '../i18n/LanguageContext';

export default function TrainingPage() {
  const { slug } = useParams<{ slug: string }>();
  const session = slug ? getTrainingBySlug(slug) : undefined;
  const { t, L, formatDate } = useLanguage();

  if (!session) {
    return (
      <div className="app-shell">
        <Link to="/trainings" className="back-link">
          {t('backToTrainings')}
        </Link>
        <div className="report-page">
          <p>{t('trainingNotFound')}</p>
        </div>
      </div>
    );
  }

  const dateLabel = formatDate(session.date);
  const sessionType = resolveTrainingSessionType(
    session.date,
    session.sessionType
  );
  const typeLabel = sessionType
    ? L(TRAINING_SESSION_TYPE_LABELS[sessionType])
    : null;
  const timeRange = formatTrainingTimeRange(session.startTime, session.endTime);
  const microcycleDay = getMicrocycleDay(session.slug);
  const headerMeta = typeLabel
    ? `${typeLabel} · ${timeRange}`
    : session.focus
      ? L(session.focus)
      : t('trainingSession');

  return (
    <div className="app-shell">
      <Link to="/trainings" className="back-link">
        {t('backToTrainings')}
      </Link>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('trainingSession')}
          matchTitle={L(session.title)}
          matchDate={session.date}
          competition={headerMeta}
        />
        <div className="training-hero">
          <div className="training-hero-date">{dateLabel}</div>
          {microcycleDay ? (
            <MicrocycleDayBadge
              day={microcycleDay}
              className="microcycle-day-badge--hero"
            />
          ) : null}
          {typeLabel && sessionType ? (
            <div
              className={`training-type-badge training-type-badge--${sessionType}`}
            >
              {typeLabel}
            </div>
          ) : null}
          <h2 className="training-hero-title">{L(session.title)}</h2>
          <p className="training-hero-time">
            {t('trainingTimeLabel').replace('{time}', timeRange)}
          </p>
          {session.focus ? (
            <p className="training-hero-focus">{L(session.focus)}</p>
          ) : null}
          {session.notes ? (
            <p className="training-hero-notes">{L(session.notes)}</p>
          ) : null}
        </div>
      </div>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('trainingAnalysis')}
          matchTitle={L(session.title)}
          matchDate={session.date}
          competition={dateLabel}
        />
        <TrainingDashboard session={session} />
      </div>
    </div>
  );
}
