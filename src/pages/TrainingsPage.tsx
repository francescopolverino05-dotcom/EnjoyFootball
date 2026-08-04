import { Link } from 'react-router-dom';
import { getAllTrainings } from '../data/trainings';
import TrainingCard from '../components/TrainingCard';
import ReportHeader from '../components/ReportHeader';
import { useLanguage } from '../i18n/LanguageContext';

export default function TrainingsPage() {
  const trainings = getAllTrainings();
  const { t } = useLanguage();

  return (
    <div className="app-shell">
      <Link to="/" className="back-link">
        {t('backToHome')}
      </Link>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('trainingsPageTitle')}
          matchTitle={t('trainings')}
          matchDate={new Date().toISOString().slice(0, 10)}
          competition={t('season')}
        />
      </div>

      <section className="home-section" aria-labelledby="trainings-list-heading">
        <div className="section-title" id="trainings-list-heading">
          {t('trainings')} ({trainings.length})
        </div>
        <p className="home-section-hint">{t('trainingsHint')}</p>
        {trainings.length === 0 ? (
          <p className="home-empty">{t('noTrainingsYet')}</p>
        ) : (
          <div className="match-grid">
            {trainings.map((session) => (
              <TrainingCard key={session.id} session={session} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
