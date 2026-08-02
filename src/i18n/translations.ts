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
    tabFullMatch: 'Full Match',
    tabClips: 'Clips',
    tabVideoAnalysis: 'Video Analysis',
    fullMatchVideo: 'Full Match Video',
    fullMatchHint: 'Watch the complete match recording.',
    clipsSidebarTitle: 'Clip list',
    clipsHint: 'Clips grouped by theme — Build-up, Progression, Mid block, and more.',
    clipsSearchPlaceholder: 'Search clips by theme, keyword, or minute…',
    clipsSearchEmpty: 'No clips match your search.',
    clipsSearchAria: 'Search clips',
    analystComments: 'Analyst comments',
    labels: 'Labels',
    tags: 'Tags',
    selectClip: 'Select a clip from the list to play it.',
    noVideo:
      'No video uploaded yet. Add the MP4 file to matches/{slug}/video/match.mp4',
    noClips:
      'No clips yet. Add MP4 files to matches/{slug}/clips/ and register them in match.json.',
    noAnalysis:
      'No video analysis yet. Drop your analyst video into matches/{slug}/analysis/ and tell the agent to register it.',
    videoAnalysisHint:
      'Full analyst video breakdowns for the coaching staff.',
    videoUnsupported: 'Your browser does not support video playback.',
    playVideo: 'Play video',
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
    tabFullMatch: 'Partita Intera',
    tabClips: 'Clip',
    tabVideoAnalysis: 'Analisi Video',
    fullMatchVideo: 'Video Partita Completa',
    fullMatchHint: 'Guarda la registrazione completa della partita.',
    clipsSidebarTitle: 'Elenco clip',
    clipsHint:
      'Clip raggruppate per tema — Costruzione, Progressione, Blocco mediano e altro.',
    clipsSearchPlaceholder: 'Cerca clip per tema, parola chiave o minuto…',
    clipsSearchEmpty: 'Nessuna clip corrisponde alla ricerca.',
    clipsSearchAria: 'Cerca clip',
    analystComments: 'Commenti analista',
    labels: 'Etichette',
    tags: 'Tag',
    selectClip: 'Seleziona una clip dall’elenco per riprodurla.',
    noVideo:
      'Nessun video caricato. Aggiungi il file MP4 in matches/{slug}/video/match.mp4',
    noClips:
      'Nessuna clip ancora. Aggiungi file MP4 in matches/{slug}/clips/ e registra i metadata in match.json.',
    noAnalysis:
      'Nessuna analisi video ancora. Metti il video in matches/{slug}/analysis/ e chiedi all’agente di registrarlo.',
    videoAnalysisHint:
      'Video di analisi completi preparati dall’analista per lo staff tecnico.',
    videoUnsupported: 'Il browser non supporta la riproduzione video.',
    playVideo: 'Riproduci video',
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
