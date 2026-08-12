import { formatMicrocycleDay } from '../data/microcycleDays';
import { useLanguage } from '../i18n/LanguageContext';

interface MicrocycleDayBadgeProps {
  day: number;
  className?: string;
}

export default function MicrocycleDayBadge({
  day,
  className = '',
}: MicrocycleDayBadgeProps) {
  const { locale } = useLanguage();
  const label = formatMicrocycleDay(day, locale);

  return (
    <span className={`microcycle-day-badge ${className}`.trim()}>{label}</span>
  );
}
