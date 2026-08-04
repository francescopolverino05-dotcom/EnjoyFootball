import { Link, useParams } from 'react-router-dom';
import { getTrainingBySlug } from '../data/trainings';
import ReportHeader from '../components/ReportHeader';
import TrainingDashboard from '../components/TrainingDashboard';
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
  const focus = session.focus ? L(session.focus) : t('trainingSession');

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
          competition={focus}
        />
        <div className="training-hero">
          <div className="training-hero-date">{dateLabel}</div>
          <h2 className="training-hero-title">{L(session.title)}</h2>
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
