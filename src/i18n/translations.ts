export type Locale = 'en' | 'it';

export type Localized = string | { en: string; it: string };

export function localize(value: Localized | undefined, locale: Locale): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return value[locale] || value.en || value.it || '';
}

const dictionaries = {
  en: {
    brandSubtitle: 'Match Technical Report',
    season: 'Season 2026/27',
    homePageTitle: 'MATCH ANALYSIS',
    homeDashboard: 'Primavera — Dashboard',
    homeHeroTitle: 'Match Technical Reports',
    homeHeroBody:
      'All Primavera (U19) match analysis in one place — statistics, formations, full video and analysis clips for the coaching staff.',
    matches: 'Matches',
    backToMatches: '← Back to matches',
    matchNotFound: 'Match not found.',
    teamSheet: 'TEAM SHEET',
    tacticalDashboard: 'TACTICAL DASHBOARD',
    keyMoments: 'Key Moments & Events',
    tacticalSetup: 'Tactical Setup',
    tabDynamics: 'Match Dynamics',
    tabTeamStats: 'Team Statistics',
    tabGk: 'Goalkeeper Analysis',
    tabVideo: 'Video & Clips',
    fullMatchVideo: 'Full Match Video',
    analysisClips: 'Analysis Clips',
    noVideo:
      'No video uploaded yet. Add the MP4 file to matches/{slug}/video/match.mp4',
    noClips:
      'No clips yet. Add MP4 files to matches/{slug}/clips/ and register them in match.json.',
    videoUnsupported: 'Your browser does not support video playback.',
    minutes: 'minutes',
    team: 'Team',
    jerseyColour: 'Jersey colour',
    shotsFaced: 'Shots faced',
    saves: 'Saves',
    goalsConceded: 'Goals conceded',
    statusPublished: 'Published',
    statusInReview: 'In review',
    statusDraft: 'Draft',
    langEn: 'EN',
    langIt: 'IT',
    langAria: 'Language',
  },
  it: {
    brandSubtitle: 'Report Tecnico Partita',
    season: 'Stagione 2026/27',
    homePageTitle: 'ANALISI PARTITE',
    homeDashboard: 'Primavera — Dashboard',
    homeHeroTitle: 'Report Tecnici Partita',
    homeHeroBody:
      'Tutte le analisi della Primavera (U19) in un unico posto — statistiche, formazioni, video completo e clip di analisi per lo staff tecnico.',
    matches: 'Partite',
    backToMatches: '← Torna alle partite',
    matchNotFound: 'Partita non trovata.',
    teamSheet: 'DISTINTA DI GARA',
    tacticalDashboard: 'DASHBOARD TATTICA',
    keyMoments: 'Azioni Salienti ed Eventi',
    tacticalSetup: 'Disposizione Tattica',
    tabDynamics: 'Dinamiche di Gara',
    tabTeamStats: 'Statistiche Squadra',
    tabGk: 'Analisi Portieri',
    tabVideo: 'Video & Clip',
    fullMatchVideo: 'Video Partita Completa',
    analysisClips: 'Clip di Analisi',
    noVideo:
      'Nessun video caricato. Aggiungi il file MP4 in matches/{slug}/video/match.mp4',
    noClips:
      'Nessuna clip ancora. Aggiungi file MP4 in matches/{slug}/clips/ e registra i metadata in match.json.',
    videoUnsupported: 'Il browser non supporta la riproduzione video.',
    minutes: 'minuti',
    team: 'Squadra',
    jerseyColour: 'Colore maglia',
    shotsFaced: 'Tiri subiti',
    saves: 'Parate',
    goalsConceded: 'Gol subiti',
    statusPublished: 'Pubblicato',
    statusInReview: 'In revisione',
    statusDraft: 'Bozza',
    langEn: 'EN',
    langIt: 'IT',
    langAria: 'Lingua',
  },
} as const;

export type UiKey = keyof typeof dictionaries.en;

export function ui(locale: Locale, key: UiKey): string {
  return dictionaries[locale][key];
}

export function formatDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split('-');
  return locale === 'en' ? `${d}/${m}/${y}` : `${d}.${m}.${y}`;
}
