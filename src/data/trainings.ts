import type { TrainingSession, TrainingSummary } from '../types/training';
import { getMicrocycleDay } from './microcycleDays';

const trainingModules = import.meta.glob<{ default: TrainingSession }>(
  '../../trainings/*/training.json',
  { eager: true }
);

function toSummary(session: TrainingSession): TrainingSummary {
  return {
    id: session.id,
    slug: session.slug,
    date: session.date,
    title: session.title,
    focus: session.focus,
    sessionType: session.sessionType,
    startTime: session.startTime,
    endTime: session.endTime,
    status: session.status,
    microcycleDay: getMicrocycleDay(session.slug),
  };
}

export function getAllTrainings(): TrainingSummary[] {
  return Object.values(trainingModules)
    .map((mod) => toSummary(mod.default))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getTrainingBySlug(slug: string): TrainingSession | undefined {
  const entry = Object.entries(trainingModules).find(([path]) =>
    path.includes(`/${slug}/`)
  );
  return entry?.[1].default;
}
