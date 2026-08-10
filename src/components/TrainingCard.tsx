import { Link } from 'react-router-dom';
import {
  formatTrainingTimeRange,
  resolveTrainingSessionType,
  TRAINING_SESSION_TYPE_LABELS,
} from '../data/trainingDayTypes';
import { useLanguage } from '../i18n/LanguageContext';
import type { TrainingSummary } from '../types/training';

interface TrainingCardProps {
  session: TrainingSummary;
}

export default function TrainingCard({ session }: TrainingCardProps) {
  const { t, L, formatDate } = useLanguage();
  const sessionType = resolveTrainingSessionType(
    session.date,
    session.sessionType
  );
  const typeLabel = sessionType
    ? L(TRAINING_SESSION_TYPE_LABELS[sessionType])
    : null;
  const timeRange = formatTrainingTimeRange(session.startTime, session.endTime);

  return (
    <Link to={`/training/${session.slug}`} className="match-card training-card">
      <div className="training-card-date">{formatDate(session.date)}</div>
      <div className="match-card-date">{t('trainingSession')}</div>
      {typeLabel ? (
        <div className={`training-type-badge training-type-badge--${sessionType}`}>
          {typeLabel}
        </div>
      ) : null}
      <div className="match-card-title">{L(session.title)}</div>
      <div className="training-card-time">{timeRange}</div>
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
