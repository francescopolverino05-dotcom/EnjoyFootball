import { Link } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import type { TrainingSummary } from '../types/training';

interface TrainingCardProps {
  session: TrainingSummary;
}

export default function TrainingCard({ session }: TrainingCardProps) {
  const { t, L, formatDate } = useLanguage();

  return (
    <Link to={`/training/${session.slug}`} className="match-card training-card">
      <div className="training-card-date">{formatDate(session.date)}</div>
      <div className="match-card-date">{t('trainingSession')}</div>
      <div className="match-card-title">{L(session.title)}</div>
      {session.focus ? (
        <div className="training-card-focus">{L(session.focus)}</div>
      ) : null}
      <div className="match-card-meta">
        <span>{formatDate(session.date)}</span>
        <span className={`status-badge ${session.status}`}>
          {statusLabel(session.status, t)}
        </span>
      </div>
    </Link>
  );
}

function statusLabel(
  status: TrainingSummary['status'],
  t: (key: 'statusPublished' | 'statusInReview' | 'statusDraft') => string
): string {
  switch (status) {
    case 'published':
      return t('statusPublished');
    case 'in-review':
      return t('statusInReview');
    case 'draft':
      return t('statusDraft');
  }
}
