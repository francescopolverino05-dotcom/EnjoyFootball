import { TimelineEvent } from '../types/match';
import { useLanguage } from '../i18n/LanguageContext';

interface TimelineProps {
  events: TimelineEvent[];
}

export default function Timeline({ events }: TimelineProps) {
  const { t, L } = useLanguage();

  return (
    <>
      <div className="section-title">{t('keyMoments')}</div>
      <div className="timeline-scroll">
        <div className="timeline-container">
          <div className="timeline-halves">
            <span>1&apos;</span>
            <span>45+1&apos;</span>
            <span>46&apos;</span>
            <span>90+4&apos;</span>
          </div>
          <div className="timeline-axis" />
          {events.map((event) => (
            <div
              className="timeline-event"
              key={`${event.minute}-${typeof event.label === 'string' ? event.label : event.label.en}`}
              style={{ left: `${event.positionPercent}%` }}
            >
              <div
                className={`timeline-event-marker ${event.type === 'goal' ? 'goal' : event.type === 'substitution' ? 'sub' : ''}`}
                style={event.markerColor ? { background: event.markerColor } : undefined}
              />
              <div className="timeline-event-label">{L(event.label)}</div>
              <div className="timeline-event-time">{event.minute}&apos;</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
