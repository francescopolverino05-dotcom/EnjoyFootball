import { useMemo, useState } from 'react';
import { MatchData, AnalysisVideo, GoalkeeperLog, GpsHalfReport } from '../types/match';
import { useLanguage } from '../i18n/LanguageContext';
import type { Localized, UiKey } from '../i18n/translations';
import { getRpeSessionByMatchSlug } from '../data/rpeLoad';
import { getTqrSessionByMatchSlug } from '../data/tqrLoad';
import MatchMedia from './MatchMedia';
import PhaseClipsPanel from './PhaseClipsPanel';
import PhysicalLoadPanel from './PhysicalLoadPanel';
import TwoColumnNotesPanel from './TwoColumnNotesPanel';
import { EMPTY_MATCH_REFLECTION } from '../types/scoutNotes';

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
  | 'reflection'
  | 'physicalload';

type TabLabelKey =
  | 'tabDynamics'
  | 'tabTeamStats'
  | 'tabGk'
  | 'tabFullMatch'
  | 'tabClips'
  | 'tabVideoAnalysis'
  | 'tabWwbEbi'
  | 'tabPhysicalLoad';

export default function StatsDashboard({ match }: StatsDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabId>('dynamics');
  const { t, L } = useLanguage();
  const rpeSession = getRpeSessionByMatchSlug(match.slug);
  const tqrSession = getTqrSessionByMatchSlug(match.slug);
  const hasPhysicalLoad = Boolean(rpeSession || tqrSession);
  const reflection = match.reflection ?? EMPTY_MATCH_REFLECTION;

  // Match-only tabs — never include training tabs (Full Session / Training Design).
  const tabs: [TabId, TabLabelKey][] = [
    ['dynamics', 'tabDynamics'],
    ['teamstats', 'tabTeamStats'],
    ['gkanalysis', 'tabGk'],
    ['fullmatch', 'tabFullMatch'],
    ['clips', 'tabClips'],
    ['videoanalysis', 'tabVideoAnalysis'],
    ['reflection', 'tabWwbEbi'],
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
            onClick={() => setActiveTab(id)}
          >
            {t(labelKey)}
          </button>
        ))}
      </div>

      {/*
        Mount only the active tab. Hidden panels used to keep Full Match / analysis
        Vimeo iframes alive (display:none + autoload), which can leave Video Analysis
        embeds black or stuck on mobile.
      */}
      <div className="tab-content active" role="tabpanel">
        {activeTab === 'dynamics' ? (
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
        ) : null}

        {activeTab === 'teamstats' ? (
          <>
            <TeamStatsPanel match={match} />
            {match.gpsStats && match.gpsStats.length > 0 ? (
              <GpsStatsPanel reports={match.gpsStats} />
            ) : null}
          </>
        ) : null}
        {activeTab === 'gkanalysis' ? (
          <GkAnalysisPanel
            matchSlug={match.slug}
            goalkeepers={match.goalkeepers}
            analysisVideos={match.goalkeeperAnalysisVideos}
          />
        ) : null}
        {activeTab === 'fullmatch' ? <FullMatchPanel match={match} /> : null}
        {activeTab === 'clips' ? (
          <PhaseClipsPanel
            slug={match.slug}
            clips={match.clips}
            library="matches"
            emptyMessage={t('noClips').replace(/\{slug\}/g, match.slug)}
          />
        ) : null}
        {activeTab === 'videoanalysis' ? (
          <VideoAnalysisPanel match={match} />
        ) : null}
        {activeTab === 'reflection' ? (
          <TwoColumnNotesPanel
            hint={t('reflectionHint')}
            leftTitle={t('reflectionWentWell')}
            rightTitle={t('reflectionEvenBetterIf')}
            leftEmpty={t('reflectionWentWellEmpty')}
            rightEmpty={t('reflectionEvenBetterIfEmpty')}
            leftNotes={reflection.wentWell}
            rightNotes={reflection.evenBetterIf}
          />
        ) : null}
        {activeTab === 'physicalload' && hasPhysicalLoad ? (
          <PhysicalLoadPanel
            session={rpeSession ?? null}
            tqrSession={tqrSession ?? null}
            gaconSession={null}
          />
        ) : null}
      </div>
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

function formatGpsNum(value: number, decimals = 0): string {
  if (decimals === 0) return String(Math.round(value));
  return value.toFixed(decimals);
}

function GpsStatsPanel({ reports }: { reports: GpsHalfReport[] }) {
  const { t, L } = useLanguage();

  const columns: { key: keyof GpsHalfReport['players'][number]; labelKey: UiKey; decimals?: number; suffix?: string }[] = [
    { key: 'totalDistanceM', labelKey: 'gpsColTotalDist' },
    { key: 'distancePerMin', labelKey: 'gpsColDistPerMin' },
    { key: 'distanceOver16KmhM', labelKey: 'gpsColOver16' },
    { key: 'distance20to24KmhM', labelKey: 'gpsCol20to24', decimals: 1 },
    { key: 'distanceOver24KmhM', labelKey: 'gpsColOver24', decimals: 1 },
    { key: 'metabolicPowerWkg', labelKey: 'gpsColMetPower', decimals: 1 },
    { key: 'accelerationsOver3', labelKey: 'gpsColAcc' },
    { key: 'decelerationsUnder3', labelKey: 'gpsColDec' },
    { key: 'maxSpeedKmh', labelKey: 'gpsColMaxSpeed', decimals: 2 },
    { key: 'recoveryPct', labelKey: 'gpsColRecovery', decimals: 2, suffix: '%' },
  ];

  return (
    <div className="gps-stats-panel">
      <h3 className="gps-stats-title">{t('gpsReportTitle')}</h3>
      {reports.map((report) => (
        <section className="gps-stats-section" key={L(report.half)}>
          <h4 className="team-stats-section-title">{L(report.half)}</h4>
          <div className="gps-table-wrap">
            <table className="gps-table">
              <thead>
                <tr>
                  <th>{t('gpsColPlayer')}</th>
                  {columns.map((col) => (
                    <th key={col.key}>{t(col.labelKey)}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.players.map((row) => (
                  <tr key={row.player}>
                    <th scope="row">{row.player}</th>
                    {columns.map((col) => (
                      <td key={col.key}>
                        {formatGpsNum(row[col.key] as number, col.decimals)}
                        {col.suffix ?? ''}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {report.summary ? (
            <p className="gps-stats-summary">{L(report.summary)}</p>
          ) : null}
        </section>
      ))}
    </div>
  );
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

function GkAnalysisPanel({
  matchSlug,
  goalkeepers,
  analysisVideos,
}: {
  matchSlug: string;
  goalkeepers: GoalkeeperLog[];
  analysisVideos?: AnalysisVideo[];
}) {
  const { t, L } = useLanguage();
  const rows = useMemo(() => buildGkStatRows(goalkeepers), [goalkeepers]);
  const notes = goalkeepers.filter((gk) => gk.notes);
  const videos = analysisVideos ?? [];

  if (goalkeepers.length === 0 && videos.length === 0) {
    return null;
  }

  const statsBlock =
    goalkeepers.length === 0 ? null : goalkeepers.length === 2 ? (
      (() => {
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
      })()
    ) : (
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

  return (
    <div className="gk-analysis-shell">
      {statsBlock}
      {videos.length > 0 ? (
        <div className="video-section gk-analysis-videos">
          <div className="section-title">{t('gkAnalysisVideos')}</div>
          <p className="video-hint">{t('gkAnalysisVideosHint')}</p>
          <div className="analysis-grid">
            {videos.map((item) => (
              <article className="analysis-card" key={item.id}>
                <div className="clip-card-body clip-card-body--above">
                  <div className="clip-card-title">{L(item.title)}</div>
                  <div className="clip-card-desc">{L(item.description)}</div>
                </div>
                <MatchMedia
                  slug={matchSlug}
                  src={item.videoFile}
                  kind="analysis"
                  unsupportedLabel={t('videoUnsupported')}
                  playLabel={t('playVideo')}
                  title={L(item.title)}
                />
              </article>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
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

function isAnalysisDocument(item: AnalysisVideo): boolean {
  const src = item.videoFile || '';
  if (item.kind === 'pdf' || item.kind === 'markdown' || item.kind === 'docx') {
    return true;
  }
  return /\.(pdf|docx?|md)$/i.test(src.split(/[?#]/)[0] ?? '');
}

function VideoAnalysisPanel({ match }: { match: MatchData }) {
  const { t, L } = useLanguage();
  // Videos first so post-match Vimeo is not buried under tall PDF previews.
  const videos = [...(match.analysisVideos ?? [])].sort((a, b) => {
    const aDoc = isAnalysisDocument(a) ? 1 : 0;
    const bDoc = isAnalysisDocument(b) ? 1 : 0;
    return aDoc - bDoc;
  });

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
            <div className="clip-card-body clip-card-body--above">
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
            />
          </article>
        ))}
      </div>
    </div>
  );
}
