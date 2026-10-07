import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../i18n/LanguageContext';
import type { UiKey } from '../i18n/translations';
import { getAllMatches, formatMatchScore } from '../data/matches';
import { getAllOpponents } from '../data/opposition';
import { getAllPlayers } from '../data/players';
import { getAllTrainings } from '../data/trainings';

type SearchGroup = 'pages' | 'matches' | 'opposition' | 'players' | 'trainings';

interface SearchHit {
  id: string;
  group: SearchGroup;
  title: string;
  subtitle?: string;
  path: string;
  haystack: string;
}

const GROUP_ORDER: SearchGroup[] = [
  'pages',
  'matches',
  'opposition',
  'players',
  'trainings',
];

const GROUP_LABEL: Record<SearchGroup, UiKey> = {
  pages: 'searchGroupPages',
  matches: 'searchGroupMatches',
  opposition: 'searchGroupOpposition',
  players: 'searchGroupPlayers',
  trainings: 'searchGroupTrainings',
};

function normalize(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .trim();
}

export default function GlobalSearch() {
  const { t, L, formatDate, locale } = useLanguage();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const catalog = useMemo<SearchHit[]>(() => {
    const pages: SearchHit[] = [
      {
        id: 'page-home',
        group: 'pages',
        title: t('navHome'),
        path: '/',
        haystack: `${t('navHome')} home hub`,
      },
      {
        id: 'page-calendar',
        group: 'pages',
        title: t('calendar'),
        path: '/calendar',
        haystack: `${t('calendar')} calendar calendario`,
      },
      {
        id: 'page-matches',
        group: 'pages',
        title: t('matches'),
        path: '/matches',
        haystack: `${t('matches')} matches partite`,
      },
      {
        id: 'page-opposition',
        group: 'pages',
        title: t('navOpposition'),
        path: '/opposition',
        haystack: `${t('navOpposition')} opposition avversari`,
      },
      {
        id: 'page-players',
        group: 'pages',
        title: t('players'),
        path: '/players',
        haystack: `${t('players')} players giocatori`,
      },
      {
        id: 'page-table',
        group: 'pages',
        title: t('navTable'),
        path: '/table',
        haystack: `${t('navTable')} table classifica`,
      },
      {
        id: 'page-stats',
        group: 'pages',
        title: t('navStats'),
        path: '/stats',
        haystack: `${t('navStats')} stats statistiche`,
      },
      {
        id: 'page-trainings',
        group: 'pages',
        title: t('navTraining'),
        path: '/trainings',
        haystack: `${t('navTraining')} training allenamenti`,
      },
    ];

    const matches = getAllMatches().map((m) => {
      const title = L(m.title);
      const competition = L(m.competition);
      const score = formatMatchScore(m.score);
      return {
        id: `match-${m.slug}`,
        group: 'matches' as const,
        title,
        subtitle: `${formatDate(m.date)}${score !== '—' ? ` · ${score}` : ''}${
          competition ? ` · ${competition}` : ''
        }`,
        path: `/match/${m.slug}`,
        haystack: [
          title,
          competition,
          m.homeTeam,
          m.awayTeam,
          m.slug,
          m.date,
          score,
        ].join(' '),
      };
    });

    const opposition = getAllOpponents().map((o) => ({
      id: `opp-${o.slug}`,
      group: 'opposition' as const,
      title: o.shortName,
      subtitle: t('navOpposition'),
      path: `/opposition/${o.slug}`,
      haystack: `${o.shortName} ${o.slug} opposition avversari`,
    }));

    const players = getAllPlayers().map((p) => ({
      id: `player-${p.slug}`,
      group: 'players' as const,
      title: p.displayName,
      subtitle: p.positionShort || t('players'),
      path: `/players/${p.slug}`,
      haystack: `${p.displayName} ${p.slug} ${p.positionShort ?? ''}`,
    }));

    const trainings = getAllTrainings().map((s) => {
      const title = L(s.title);
      const focus = L(s.focus);
      return {
        id: `training-${s.slug}`,
        group: 'trainings' as const,
        title,
        subtitle: `${formatDate(s.date)}${focus ? ` · ${focus}` : ''}`,
        path: `/training/${s.slug}`,
        haystack: [title, focus, s.slug, s.date, s.sessionType].join(' '),
      };
    });

    return [...pages, ...matches, ...opposition, ...players, ...trainings];
  }, [L, formatDate, t, locale]);

  const results = useMemo(() => {
    const q = normalize(query);
    const filtered = !q
      ? catalog.filter((h) => h.group === 'pages')
      : catalog.filter((h) => normalize(h.haystack).includes(q));

    return [...filtered].sort((a, b) => {
      const gi = GROUP_ORDER.indexOf(a.group) - GROUP_ORDER.indexOf(b.group);
      if (gi !== 0) return gi;
      return a.title.localeCompare(b.title, locale === 'it' ? 'it' : 'en');
    });
  }, [catalog, locale, query]);

  const close = useCallback(() => {
    setOpen(false);
    setQuery('');
    setActiveIndex(0);
  }, []);

  const openSearch = useCallback(() => {
    setOpen(true);
    setActiveIndex(0);
  }, []);

  const go = useCallback(
    (hit: SearchHit) => {
      navigate(hit.path);
      close();
    },
    [close, navigate]
  );

  useEffect(() => {
    if (!open) return;
    const id = window.setTimeout(() => inputRef.current?.focus(), 0);
    return () => window.clearTimeout(id);
  }, [open]);

  useEffect(() => {
    setActiveIndex(0);
  }, [query]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((prev) => {
          if (prev) {
            setQuery('');
            setActiveIndex(0);
            return false;
          }
          return true;
        });
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    if (!open) return;
    const el = listRef.current?.querySelector<HTMLElement>(
      `[data-search-index="${activeIndex}"]`
    );
    el?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open, results]);

  const onInputKeyDown = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      e.preventDefault();
      close();
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, Math.max(results.length - 1, 0)));
      return;
    }
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
      return;
    }
    if (e.key === 'Enter' && results[activeIndex]) {
      e.preventDefault();
      go(results[activeIndex]);
    }
  };

  let lastGroup: SearchGroup | null = null;

  return (
    <>
      <button
        type="button"
        className="app-search-btn"
        onClick={openSearch}
        aria-label={t('navSearchAria')}
        title={`${t('navSearch')} (⌘K)`}
      >
        <svg
          className="app-search-icon"
          viewBox="0 0 24 24"
          width="16"
          height="16"
          aria-hidden="true"
        >
          <path
            fill="currentColor"
            d="M10.5 3a7.5 7.5 0 0 1 5.9 12.1l3.7 3.8a1 1 0 0 1-1.4 1.4l-3.8-3.7A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
          />
        </svg>
        <span className="app-search-btn-label">{t('navSearch')}</span>
        <kbd className="app-search-kbd">⌘K</kbd>
      </button>

      {open ? (
        <div
          className="app-search-overlay"
          role="presentation"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) close();
          }}
        >
          <div
            className="app-search-dialog"
            role="dialog"
            aria-modal="true"
            aria-label={t('navSearchAria')}
          >
            <div className="app-search-input-row">
              <svg
                className="app-search-icon"
                viewBox="0 0 24 24"
                width="18"
                height="18"
                aria-hidden="true"
              >
                <path
                  fill="currentColor"
                  d="M10.5 3a7.5 7.5 0 0 1 5.9 12.1l3.7 3.8a1 1 0 0 1-1.4 1.4l-3.8-3.7A7.5 7.5 0 1 1 10.5 3Zm0 2a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11Z"
                />
              </svg>
              <input
                ref={inputRef}
                className="app-search-input"
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={onInputKeyDown}
                placeholder={t('navSearchPlaceholder')}
                aria-label={t('navSearchAria')}
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
              />
              <button
                type="button"
                className="app-search-close"
                onClick={close}
                aria-label={t('navSearchClose')}
              >
                Esc
              </button>
            </div>

            <div className="app-search-results" ref={listRef} role="listbox">
              {results.length === 0 ? (
                <p className="app-search-empty">{t('navSearchEmpty')}</p>
              ) : (
                results.map((hit, index) => {
                  const showGroup = hit.group !== lastGroup;
                  lastGroup = hit.group;
                  return (
                    <div key={hit.id}>
                      {showGroup ? (
                        <div className="app-search-group">
                          {t(GROUP_LABEL[hit.group])}
                        </div>
                      ) : null}
                      <button
                        type="button"
                        role="option"
                        aria-selected={index === activeIndex}
                        data-search-index={index}
                        className={
                          index === activeIndex
                            ? 'app-search-hit active'
                            : 'app-search-hit'
                        }
                        onMouseEnter={() => setActiveIndex(index)}
                        onClick={() => go(hit)}
                      >
                        <span className="app-search-hit-title">{hit.title}</span>
                        {hit.subtitle ? (
                          <span className="app-search-hit-sub">
                            {hit.subtitle}
                          </span>
                        ) : null}
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
