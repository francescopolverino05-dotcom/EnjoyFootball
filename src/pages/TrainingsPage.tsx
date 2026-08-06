import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllTrainings } from '../data/trainings';
import { groupTrainingsByWeek } from '../data/trainingWeeks';
import TrainingCard from '../components/TrainingCard';
import ReportHeader from '../components/ReportHeader';
import { useLanguage } from '../i18n/LanguageContext';

export default function TrainingsPage() {
  const trainings = getAllTrainings();
  const weeks = groupTrainingsByWeek(trainings);
  const { t, formatDate } = useLanguage();
  const latestWeekNumber =
    weeks.length > 0 ? weeks[weeks.length - 1].weekNumber : 1;
  const [selectedWeekNumber, setSelectedWeekNumber] = useState(latestWeekNumber);
  const selectedWeek =
    weeks.find((week) => week.weekNumber === selectedWeekNumber) ??
    weeks[weeks.length - 1];

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
          {t('trainings')}
          {selectedWeek
            ? ` (${selectedWeek.sessions.length})`
            : ` (${trainings.length})`}
        </div>
        <p className="home-section-hint">{t('trainingsHint')}</p>
        {trainings.length === 0 || !selectedWeek ? (
          <p className="home-empty">{t('noTrainingsYet')}</p>
        ) : (
          <div className="training-weeks">
            <div className="tabs-header" role="tablist">
              {weeks.map((week) => {
                const active = week.weekNumber === selectedWeek.weekNumber;
                return (
                  <button
                    key={week.weekStart}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`tab-button ${active ? 'active' : ''}`}
                    onClick={() => setSelectedWeekNumber(week.weekNumber)}
                  >
                    {t('trainingWeek').replace('{n}', String(week.weekNumber))}
                  </button>
                );
              })}
            </div>

            <section
              className="training-week"
              aria-labelledby={`training-week-${selectedWeek.weekNumber}`}
            >
              <header className="training-week-header">
                <h3
                  className="training-week-title"
                  id={`training-week-${selectedWeek.weekNumber}`}
                >
                  {t('trainingWeek').replace(
                    '{n}',
                    String(selectedWeek.weekNumber)
                  )}
                </h3>
                <p className="training-week-range">
                  {formatDate(selectedWeek.weekStart)} –{' '}
                  {formatDate(selectedWeek.weekEnd)}
                </p>
              </header>
              <div className="match-grid">
                {selectedWeek.sessions.map((session) => (
                  <TrainingCard key={session.id} session={session} />
                ))}
              </div>
            </section>
          </div>
        )}
      </section>
    </div>
  );
}
