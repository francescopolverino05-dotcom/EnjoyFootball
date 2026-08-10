import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { MatchData, VideoClip, AnalysisVideo, GoalkeeperLog } from '../types/match';
import { useLanguage } from '../i18n/LanguageContext';
import { CLIP_LABELS, ANALYSIS_SECTION_ORDER, HIDDEN_CLIP_SECTIONS, type ClipLabelId } from '../i18n/clipLabels';
import type { Localized, UiKey } from '../i18n/translations';
import { getPlayersForClip } from '../data/playerLinks';
import { getRpeSessionByMatchSlug } from '../data/rpeLoad';
import { getTqrSessionByMatchSlug } from '../data/tqrLoad';
import MatchMedia from './MatchMedia';
import PhysicalLoadPanel from './PhysicalLoadPanel';

interface StatsDashboardProps {
  match: MatchData;
}

type TabId =
  | 'dynamics'
  | 'teamstats'
  | 'gkanalysis'
  | 'fullmatch'
  | 'clips'
  | 'videoanalysis'
  | 'physicalload';

type TabLabelKey =
  | 'tabDynamics'
  | 'tabTeamStats'
  | 'tabGk'
  | 'tabFullMatch'
  | 'tabClips'
  | 'tabVideoAnalysis'
  | 'tabPhysicalLoad';

const TAB_IDS: TabId[] = [
  'dynamics',
  'teamstats',
  'gkanalysis',
  'fullmatch',
  'clips',
  'videoanalysis',
  'physicalload',
];

function isTabId(value: string | null): value is TabId {
  return Boolean(value && TAB_IDS.includes(value as TabId));
}

export default function StatsDashboard({ match }: StatsDashboardProps) {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get('tab');
  const highlightClipId = searchParams.get('clip');
  const [activeTab, setActiveTab] = useState<TabId>(() =>
    isTabId(initialTab) ? initialTab : 'dynamics'
  );
  const { t, L } = useLanguage();
  const rpeSession = getRpeSessionByMatchSlug(match.slug);
  const tqrSession = getTqrSessionByMatchSlug(match.slug);
  const hasPhysicalLoad = Boolean(rpeSession || tqrSession);

  useEffect(() => {
    if (isTabId(initialTab) && initialTab !== activeTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab, activeTab]);

  function selectTab(id: TabId) {
    setActiveTab(id);
    const next = new URLSearchParams(searchParams);
    if (id === 'dynamics') next.delete('tab');
    else next.set('tab', id);
    if (id !== 'clips') next.delete('clip');
    setSearchParams(next, { replace: true });
  }

  // Match-only tabs — never include training tabs (Full Session / Training Design).
  const tabs: [TabId, TabLabelKey][] = [
    ['dynamics', 'tabDynamics'],
    ['teamstats', 'tabTeamStats'],
    ['gkanalysis', 'tabGk'],
    ['fullmatch', 'tabFullMatch'],
    ['clips', 'tabClips'],
    ['videoanalysis', 'tabVideoAnalysis'],
    ...(hasPhysicalLoad
      ? ([['physicalload', 'tabPhysicalLoad']] as [TabId, TabLabelKey][])
      : []),
  ];

  return (
    <>
      <div className="tabs-header" role="tablist">
        {tabs.map(([id, labelKey]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={activeTab === id}
            className={`tab-button ${activeTab === id ? 'active' : ''}`}
            onClick={() => selectTab(id)}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      <div
        className={`tab-content ${activeTab === 'dynamics' ? 'active' : ''}`}
        role="tabpanel"
      >
        <div className="dynamics-panel">
          {match.dynamics.map((metric) => (
            <div
              className="dynamic-metric-card"
              key={typeof metric.name === 'string' ? metric.name : metric.name.en}
            >
              <div className="dynamic-metric-header">{L(metric.name)}</div>
              <div className="dynamic-bar-container">
                <div
                  className="dynamic-bar-fill home"
                  style={{ width: `${metric.homeValue}%` }}
                />
                <div
                  className="dynamic-bar-fill away"
                  style={{ width: `${metric.awayValue}%` }}
                />
              </div>
              <div className="dynamic-labels-footer">
                <span style={{ color: 'var(--napoli-blue-dark)' }}>
                  {metric.homeValue}
                  {metric.unit ?? ''} {match.homeTeam.shortName}
                </span>
                <span style={{ color: 'var(--away-green)' }}>
                  {metric.awayValue}
                  {metric.unit ?? ''} {match.awayTeam.shortName}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className={`tab-content ${activeTab === 'teamstats' ? 'active' : ''}`}
        role="tabpanel"
      >
        <TeamStatsPanel match={match} />
      </div>

      <div
        className={`tab-content ${activeTab === 'gkanalysis' ? 'active' : ''}`}
        role="tabpanel"
      >
        <GkAnalysisPanel goalkeepers={match.goalkeepers} />
      </div>

      <div
        className={`tab-content ${activeTab === 'fullmatch' ? 'active' : ''}`}
        role="tabpanel"
      >
        <FullMatchPanel match={match} />
      </div>

      <div
        className={`tab-content ${activeTab === 'clips' ? 'active' : ''}`}
        role="tabpanel"
      >
        <ClipsPanel match={match} highlightClipId={highlightClipId} />
      </div>

      <div
        className={`tab-content ${activeTab === 'videoanalysis' ? 'active' : ''}`}
        role="tabpanel"
      >
        <VideoAnalysisPanel match={match} />
      </div>

      {hasPhysicalLoad ? (
        <div
          className={`tab-content ${activeTab === 'physicalload' ? 'active' : ''}`}
          role="tabpanel"
        >
          <PhysicalLoadPanel
            session={rpeSession ?? null}
            tqrSession={tqrSession ?? null}
            gaconSession={null}
          />
        </div>
      ) : null}
    </>
  );
}

function localizedKey(value: Localized): string {
  if (typeof value === 'string') return value;
  return `${value.en}|${value.it}`;
}

function TeamStatsPanel({ match }: { match: MatchData }) {
  const { L } = useLanguage();

  const sections = useMemo(() => {
    const groups: { key: string; category: Localized; stats: typeof match.teamStats }[] = [];
    for (const stat of match.teamStats) {
      const key = localizedKey(stat.category);
      const last = groups[groups.length - 1];
      if (last && last.key === key) {
        last.stats.push(stat);
      } else {
        groups.push({ key, category: stat.category, stats: [stat] });
      }
    }
    return groups;
  }, [match.teamStats]);

  if (sections.length === 0) return null;

  return (
    <div className="team-stats-panel">
      <div className="stats-comparison-row stats-comparison-header">
        <span className="stats-val-home">{match.homeTeam.shortName}</span>
        <span className="stats-label" aria-hidden="true" />
        <span className="stats-val-away">{match.awayTeam.shortName}</span>
      </div>
      {sections.map((section) => (
        <section className="team-stats-section" key={section.key}>
          <h3 className="team-stats-section-title">{L(section.category)}</h3>
          {section.stats.map((stat) => (
            <div
              className="stats-comparison-row"
              key={localizedKey(stat.name)}
            >
              <span className="stats-val-home">{L(stat.home)}</span>
              <span className="stats-label">{L(stat.name)}</span>
              <span className="stats-val-away">{L(stat.away)}</span>
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

function formatClipTimestamp(clip: VideoClip): string {
  const m = clip.minute;
  const s = clip.second ?? 0;
  if (s > 0) {
    return `${m}'${String(s).padStart(2, '0')}"`;
  }
  return `${m}'`;
}

function gkColumnTitle(
  gk: GoalkeeperLog,
  L: (value: Localized) => string
): string {
  const period = gk.period ? L(gk.period) : null;
  if (period) return `${gk.name} (${period} — ${gk.minutes}')`;
  return `${gk.name} (${gk.minutes}')`;
}

type GkStatRow = {
  key: string;
  labelKey: UiKey;
  values: Array<Localized | number | string | undefined>;
};

function formatGkCell(
  value: Localized | number | string | undefined,
  L: (value: Localized) => string
): string {
  if (value == null) return '—';
  if (typeof value === 'number' || typeof value === 'string') return String(value);
  return L(value);
}

function buildGkStatRows(goalkeepers: GoalkeeperLog[]): GkStatRow[] {
  const optional = (
    key: string,
    labelKey: UiKey,
    pick: (gk: GoalkeeperLog) => Localized | number | string | undefined
  ): GkStatRow | null => {
    if (!goalkeepers.some((gk) => pick(gk) != null)) return null;
    return { key, labelKey, values: goalkeepers.map(pick) };
  };

  return [
    {
      key: 'jersey',
      labelKey: 'jerseyColour',
      values: goalkeepers.map((gk) => gk.jerseyColor),
    },
    {
      key: 'shotsFaced',
      labelKey: 'shotsFaced',
      values: goalkeepers.map((gk) => gk.shotsFaced),
    },
    optional('sotFaced', 'shotsOnTargetFaced', (gk) => gk.shotsOnTargetFaced),
    {
      key: 'goalsConceded',
      labelKey: 'goalsConceded',
      values: goalkeepers.map((gk) => gk.goalsConceded),
    },
    {
      key: 'saves',
      labelKey: 'saves',
      values: goalkeepers.map((gk) => gk.saves),
    },
    optional('reflexSaves', 'reflexSaves', (gk) => gk.reflexSaves),
    optional('savePercentage', 'savePercentage', (gk) => gk.savePercentage),
    optional('aerialDuels', 'aerialDuels', (gk) => gk.aerialDuels),
    optional('exits', 'gkExits', (gk) => gk.exits),
    optional('passes', 'gkPasses', (gk) => gk.passes),
  ].filter((row): row is GkStatRow => row != null);
}

function GkAnalysisPanel({ goalkeepers }: { goalkeepers: GoalkeeperLog[] }) {
  const { t, L } = useLanguage();
  const rows = useMemo(() => buildGkStatRows(goalkeepers), [goalkeepers]);
  const notes = goalkeepers.filter((gk) => gk.notes);

  if (goalkeepers.length === 0) {
    return null;
  }

  if (goalkeepers.length === 2) {
    const [a, b] = goalkeepers;
    return (
      <div className="gk-stats-panel">
        <div className="stats-comparison-row stats-comparison-header">
          <span className={`stats-val-home gk-val-${a.colorClass}`}>
            {gkColumnTitle(a, L)}
          </span>
          <span className="stats-label" aria-hidden="true" />
          <span className={`stats-val-away gk-val-${b.colorClass}`}>
            {gkColumnTitle(b, L)}
          </span>
        </div>
        {rows.map((row) => (
          <div className="stats-comparison-row" key={row.key}>
            <span className={`stats-val-home gk-val-${a.colorClass}`}>
              {formatGkCell(row.values[0], L)}
            </span>
            <span className="stats-label">{t(row.labelKey)}</span>
            <span className={`stats-val-away gk-val-${b.colorClass}`}>
              {formatGkCell(row.values[1], L)}
            </span>
          </div>
        ))}
        {notes.length > 0 ? (
          <div className="gk-stats-notes">
            {notes.map((gk) => (
              <p key={gk.name}>
                <strong>{gk.name}:</strong> {L(gk.notes!)}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    );
  }

  return (
    <div
      className="gk-stats-panel gk-stats-multi"
      style={{ ['--gk-cols' as string]: goalkeepers.length }}
    >
      <div className="gk-stats-row gk-stats-header">
        <span className="gk-stats-metric" aria-hidden="true" />
        {goalkeepers.map((gk) => (
          <span
            className={`gk-stats-val gk-val-${gk.colorClass}`}
            key={gk.name}
          >
            {gkColumnTitle(gk, L)}
          </span>
        ))}
      </div>
      {rows.map((row) => (
        <div className="gk-stats-row" key={row.key}>
          <span className="gk-stats-metric">{t(row.labelKey)}</span>
          {row.values.map((value, i) => (
            <span
              className={`gk-stats-val gk-val-${goalkeepers[i].colorClass}`}
              key={`${row.key}-${goalkeepers[i].name}`}
            >
              {formatGkCell(value, L)}
            </span>
          ))}
        </div>
      ))}
      {notes.length > 0 ? (
        <div className="gk-stats-notes">
          {notes.map((gk) => (
            <p key={gk.name}>
              <strong>{gk.name}:</strong> {L(gk.notes!)}
            </p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function clipSortKey(clip: VideoClip): number {
  return clip.minute * 60 + (clip.second ?? 0);
}

function localizedText(value: Localized | undefined): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  return `${value.en} ${value.it}`;
}

type ClipTimeFilter =
  | { kind: 'minute'; minute: number }
  | { kind: 'point'; totalSeconds: number }
  | { kind: 'range'; fromMinute: number; toMinute: number };

/** Parse queries like `10`, `10'`, `10:12`, `10-20`, `10'-20'`. */
function parseClipTimeQuery(raw: string): ClipTimeFilter | null {
  const q = raw.trim();
  const range = q.match(
    /^(\d+)\s*['′]?(?::(\d{1,2}))?\s*[-–—]\s*(\d+)\s*['′]?(?::(\d{1,2}))?\s*['′"]?$/
  );
  if (range) {
    const fromMinute = Number(range[1]);
    const toMinute = Number(range[3]);
    if (Number.isFinite(fromMinute) && Number.isFinite(toMinute)) {
      return {
        kind: 'range',
        fromMinute: Math.min(fromMinute, toMinute),
        toMinute: Math.max(fromMinute, toMinute),
      };
    }
  }

  const withSeconds = q.match(/^(\d+)\s*[:'′]\s*(\d{1,2})\s*["″]?$/);
  if (withSeconds) {
    const minute = Number(withSeconds[1]);
    const second = Number(withSeconds[2]);
    if (Number.isFinite(minute) && Number.isFinite(second) && second < 60) {
      return { kind: 'point', totalSeconds: minute * 60 + second };
    }
  }

  const minuteOnly = q.match(/^(\d+)\s*['′]?$/);
  if (minuteOnly) {
    const minute = Number(minuteOnly[1]);
    if (Number.isFinite(minute)) return { kind: 'minute', minute };
  }

  return null;
}

function clipMatchesTime(clip: VideoClip, filter: ClipTimeFilter): boolean {
  if (filter.kind === 'minute') return clip.minute === filter.minute;
  if (filter.kind === 'point') return clipSortKey(clip) === filter.totalSeconds;
  return clip.minute >= filter.fromMinute && clip.minute <= filter.toMinute;
}

function clipSearchHaystack(clip: VideoClip, sectionId: ClipLabelId): string {
  const sectionLabel = CLIP_LABELS[sectionId];
  const labelTexts = clip.labels
    .map((id) => {
      const label = CLIP_LABELS[id];
      return label ? `${id} ${localizedText(label)}` : id;
    })
    .join(' ');

  return [
    sectionId,
    localizedText(sectionLabel),
    localizedText(clip.title),
    localizedText(clip.comments),
    labelTexts,
    ...(clip.tags ?? []),
    formatClipTimestamp(clip),
    String(clip.minute),
    clip.second != null ? `${clip.minute}:${String(clip.second).padStart(2, '0')}` : '',
  ]
    .join(' ')
    .toLowerCase();
}

function clipMatchesSearch(
  clip: VideoClip,
  sectionId: ClipLabelId,
  query: string
): boolean {
  const q = query.trim().toLowerCase();
  if (!q) return true;

  const timeFilter = parseClipTimeQuery(q);
  if (timeFilter?.kind === 'range') {
    return clipMatchesTime(clip, timeFilter);
  }
  if (timeFilter && clipMatchesTime(clip, timeFilter)) {
    return true;
  }

  return clipSearchHaystack(clip, sectionId).includes(q);
}

function FullMatchPanel({ match }: { match: MatchData }) {
  const { t } = useLanguage();
  const src = match.video?.fullMatch ?? null;

  return (
    <div className="video-section">
      <div className="section-title">{t('fullMatchVideo')}</div>
      <p className="video-hint">{t('fullMatchHint')}</p>
      {src ? (
        <MatchMedia
          slug={match.slug}
          src={src}
          kind={null}
          unsupportedLabel={t('videoUnsupported')}
          playLabel={t('playVideo')}
          fullHeight
          autoload
          title={t('fullMatchVideo')}
        />
      ) : (
        <div className="video-placeholder">
          {t('noVideo').replace('{slug}', match.slug)}
        </div>
      )}
    </div>
  );
}

function ClipsPanel({
  match,
  highlightClipId,
}: {
  match: MatchData;
  highlightClipId: string | null;
}) {
  const { t, L } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');

  const sections = useMemo(() => {
    const map = new Map<ClipLabelId, VideoClip[]>();
    for (const clip of match.clips) {
      const key = (clip.section ?? clip.labels[0] ?? 'other') as ClipLabelId;
      if (HIDDEN_CLIP_SECTIONS.has(key)) continue;
      const list = map.get(key) ?? [];
      list.push(clip);
      map.set(key, list);
    }
    for (const list of map.values()) {
      list.sort((a, b) => clipSortKey(a) - clipSortKey(b));
    }
    return ANALYSIS_SECTION_ORDER.filter((id) => (map.get(id)?.length ?? 0) > 0).map(
      (id) => ({ id, clips: map.get(id)! })
    );
  }, [match.clips]);

  const filteredSections = useMemo(() => {
    const q = searchQuery.trim();
    if (!q) return sections;
    return sections
      .map((section) => ({
        ...section,
        clips: section.clips.filter((clip) =>
          clipMatchesSearch(clip, section.id, q)
        ),
      }))
      .filter((section) => section.clips.length > 0);
  }, [sections, searchQuery]);

  useEffect(() => {
    if (!highlightClipId) return;
    const el = document.getElementById(`clip-${highlightClipId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [highlightClipId, filteredSections]);

  if (sections.length === 0) {
    return (
      <div className="empty-clips">
        {t('noClips').replace(/\{slug\}/g, match.slug)}
      </div>
    );
  }

  return (
    <div className="video-section">
      <p className="video-hint">{t('clipsHint')}</p>

      <div className="clips-search">
        <label className="clips-search-label" htmlFor="clips-search-input">
          {t('clipsSearchAria')}
        </label>
        <input
          id="clips-search-input"
          type="search"
          className="clips-search-input"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder={t('clipsSearchPlaceholder')}
          aria-label={t('clipsSearchAria')}
          autoComplete="off"
          spellCheck={false}
        />
      </div>

      {filteredSections.length === 0 ? (
        <div className="clips-search-empty">{t('clipsSearchEmpty')}</div>
      ) : (
        filteredSections.map((section) => (
          <section className="analysis-section" key={section.id} id={`clips-${section.id}`}>
            <div className="analysis-section-header">
              <h3 className="analysis-section-title">
                {L(CLIP_LABELS[section.id] ?? { en: section.id, it: section.id })}
              </h3>
              <span className="analysis-section-count">{section.clips.length}</span>
            </div>
            <div className="analysis-grid">
              {section.clips.map((clip) => {
                const linkedPlayers = getPlayersForClip(match.slug, clip);
                const highlighted = highlightClipId === clip.id;
                return (
                  <article
                    className={`analysis-card ${highlighted ? 'analysis-card-highlight' : ''}`}
                    key={clip.id}
                    id={`clip-${clip.id}`}
                  >
                    <MatchMedia
                      slug={match.slug}
                      src={clip.videoFile}
                      kind="clips"
                      unsupportedLabel={t('videoUnsupported')}
                      playLabel={t('playVideo')}
                      title={L(clip.title)}
                    />
                    <div className="clip-card-body">
                      <div className="clip-card-time">{formatClipTimestamp(clip)}</div>
                      <div className="clip-card-title">{L(clip.title)}</div>
                      <div className="clip-card-desc">{L(clip.comments)}</div>
                      {linkedPlayers.length > 0 ? (
                        <div className="clip-player-links">
                          {linkedPlayers.map(({ player, draftTagged }) => (
                            <Link
                              key={player.slug}
                              to={`/players/${player.slug}`}
                              className={`clip-player-chip ${draftTagged ? 'draft' : ''}`}
                            >
                              {player.displayName}
                              {draftTagged ? ` · ${t('playerDraftClipTag')}` : ''}
                            </Link>
                          ))}
                        </div>
                      ) : null}
                      {clip.tags && clip.tags.length > 0 ? (
                        <div className="clip-tags">
                          {clip.tags.map((tag) => (
                            <span className="clip-tag" key={tag}>
                              {tag}
                            </span>
                          ))}
                        </div>
                      ) : null}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        ))
      )}
    </div>
  );
}

function VideoAnalysisPanel({ match }: { match: MatchData }) {
  const { t, L } = useLanguage();
  const videos = match.analysisVideos ?? [];

  if (videos.length === 0) {
    return (
      <div className="empty-clips">
        {t('noAnalysis').replace(/\{slug\}/g, match.slug)}
      </div>
    );
  }

  return (
    <div className="video-section">
      <p className="video-hint">{t('videoAnalysisHint')}</p>
      <div className="analysis-grid">
        {videos.map((item: AnalysisVideo) => (
          <article className="analysis-card" key={item.id}>
            <MatchMedia
              slug={match.slug}
              src={item.videoFile}
              kind="analysis"
              unsupportedLabel={t('videoUnsupported')}
              playLabel={t('playVideo')}
              openPdfLabel={t('openPdf')}
              downloadPdfLabel={t('downloadPdf')}
              openReportLabel={t('openReport')}
              openDocLabel={t('openDoc')}
              title={L(item.title)}
              autoload
            />
            <div className="clip-card-body">
              <div className="clip-card-title">{L(item.title)}</div>
              <div className="clip-card-desc">{L(item.description)}</div>
              {item.tags && item.tags.length > 0 ? (
                <div className="clip-tags">
                  {item.tags.map((tag) => (
                    <span className="clip-tag" key={tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
