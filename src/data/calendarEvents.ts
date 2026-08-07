import { getAllMatches } from './matches';
import { getAllTrainings } from './trainings';
import {
  getTrainingWeekNumber,
  getWeekStartMonday,
} from './trainingWeeks';
import type { Localized } from '../i18n/translations';

export type CalendarEventKind = 'training' | 'match';
export type CalendarFilter = 'all' | 'trainings' | 'matches';
export type CalendarViewMode = 'day' | 'week' | 'month';

export interface CalendarEvent {
  id: string;
  date: string;
  kind: CalendarEventKind;
  title: Localized;
  subtitle?: Localized;
  href: string;
  weekNumber: number;
  slug: string;
}

function parseIsoDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function toIsoDate(date: Date): string {
  const y = date.getUTCFullYear();
  const m = String(date.getUTCMonth() + 1).padStart(2, '0');
  const d = String(date.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function addUtcDays(iso: string, days: number): string {
  const date = parseIsoDate(iso);
  date.setUTCDate(date.getUTCDate() + days);
  return toIsoDate(date);
}

export function weekDays(mondayIso: string): string[] {
  return Array.from({ length: 7 }, (_, i) => addUtcDays(mondayIso, i));
}

export function daysInMonth(year: number, monthIndex: number): number {
  return new Date(Date.UTC(year, monthIndex + 1, 0)).getUTCDate();
}

/** Monday-first offset: Mon=0 … Sun=6 */
export function mondayFirstOffset(year: number, monthIndex: number): number {
  const dow = new Date(Date.UTC(year, monthIndex, 1)).getUTCDay();
  return (dow + 6) % 7;
}

export function isoDate(year: number, monthIndex: number, day: number): string {
  return toIsoDate(new Date(Date.UTC(year, monthIndex, day)));
}

export function monthKeyFromIso(iso: string): string {
  return iso.slice(0, 7);
}

export function passesCalendarFilter(
  event: CalendarEvent,
  filter: CalendarFilter
): boolean {
  if (filter === 'all') return true;
  if (filter === 'trainings') return event.kind === 'training';
  return event.kind === 'match';
}

/**
 * Build calendar events from published site data (trainings + matches JSON).
 * Live data is the source of truth for clickable sessions.
 */
export function getCalendarEvents(): CalendarEvent[] {
  const trainings = getAllTrainings().map((session) => {
    const weekStart = getWeekStartMonday(session.date);
    return {
      id: `training:${session.id}`,
      date: session.date,
      kind: 'training' as const,
      title: session.title,
      subtitle: session.focus,
      href: `/training/${session.slug}`,
      weekNumber: getTrainingWeekNumber(weekStart),
      slug: session.slug,
    };
  });

  const matches = getAllMatches().map((match) => {
    const weekStart = getWeekStartMonday(match.date);
    return {
      id: `match:${match.id}`,
      date: match.date,
      kind: 'match' as const,
      title: match.title,
      subtitle: match.competition,
      href: `/match/${match.slug}`,
      weekNumber: getTrainingWeekNumber(weekStart),
      slug: match.slug,
    };
  });

  return [...trainings, ...matches].sort((a, b) => {
    const byDate = a.date.localeCompare(b.date);
    if (byDate !== 0) return byDate;
    if (a.kind === b.kind) return a.id.localeCompare(b.id);
    return a.kind === 'training' ? -1 : 1;
  });
}

/** Months that contain at least one event, sorted ascending. */
export function getCalendarMonths(events: CalendarEvent[]): {
  key: string;
  year: number;
  month: number;
}[] {
  const keys = [...new Set(events.map((e) => monthKeyFromIso(e.date)))].sort();
  return keys.map((key) => {
    const [y, m] = key.split('-').map(Number);
    return { key, year: y, month: m - 1 };
  });
}

export function groupEventsByDate(
  events: CalendarEvent[]
): Map<string, CalendarEvent[]> {
  const byDate = new Map<string, CalendarEvent[]>();
  for (const event of events) {
    const list = byDate.get(event.date) ?? [];
    list.push(event);
    byDate.set(event.date, list);
  }
  return byDate;
}

/** Prefer today when it has events; else nearest upcoming; else latest. */
export function defaultSelectedDate(events: CalendarEvent[]): string {
  if (events.length === 0) {
    return new Date().toISOString().slice(0, 10);
  }
  const today = new Date().toISOString().slice(0, 10);
  if (events.some((e) => e.date === today)) return today;
  const upcoming = events.find((e) => e.date >= today);
  if (upcoming) return upcoming.date;
  return events[events.length - 1].date;
}

export function seasonWeekLabel(
  mondayIso: string,
  events: CalendarEvent[]
): number | null {
  const days = new Set(weekDays(mondayIso));
  const nums = events
    .filter((e) => days.has(e.date))
    .map((e) => e.weekNumber);
  if (nums.length === 0) return null;
  return Math.min(...nums);
}
