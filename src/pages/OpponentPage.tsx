import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import Formations from '../components/Formations';
import GkStrikerScout from '../components/GkStrikerScout';
import MatchMedia from '../components/MatchMedia';
import ReportHeader from '../components/ReportHeader';
import TwoColumnNotesPanel from '../components/TwoColumnNotesPanel';
import { strikersForGkTab } from '../data/gkStrikerSample';
import { teamCrestUrl } from '../data/teamLogos';
import {
  getFixturePack,
  getOpponentBySlug,
  getOurFixturesVsOpponent,
  isNapoliHomeVsOpponent,
  oppositionClipSectionLabel,
  formationSystemsFor,
  placeholderPlayersForSystem,
  referenceMatchSlotLimit,
  todayIsoDate,
} from '../data/opposition';
import { MATCH_COMPETITION_LABELS } from '../data/matchCompetitions';
import { OPPOSITION_MAX_REFERENCE_MATCHES } from '../types/opposition';
import { EMPTY_STRENGTHS_WEAKNESSES } from '../types/scoutNotes';
import {
  OPPOSITION_CLIP_GROUP_IDS,
  OPPOSITION_CLIP_GROUP_LABEL_KEYS,
  OPPOSITION_CLIP_SECTION_ORDER,
  oppositionClipGroupFor,
  type OppositionClipGroupId,
} from '../i18n/oppositionClipSections';
import { useLanguage } from '../i18n/LanguageContext';
import type { Formation } from '../types/match';

type OpponentTab =
  | 'formation'
  | 'clips'
  | 'strengths'
  | 'matches'
  | 'report'
  | 'gk';

export default function OpponentPage() {
  const { slug } = useParams<{ slug: string }>();
  const opponent = slug ? getOpponentBySlug(slug) : undefined;
  const { t, L, formatDate } = useLanguage();
  const [tab, setTab] = useState<OpponentTab>('formation');
  const [activeGroups, setActiveGroups] = useState<Set<OppositionClipGroupId>>(
    () => new Set<OppositionClipGroupId>(['attack'])
  );
  const [gkStrikerId, setGkStrikerId] = useState<string | null>(null);
  const today = todayIsoDate();

  const ourFixtures = opponent ? getOurFixturesVsOpponent(opponent) : [];
  const defaultSlug = useMemo(() => {
    const upcoming = ourFixtures.find((m) => m.date >= today);
    return (upcoming ?? ourFixtures[0])?.slug ?? null;
  }, [ourFixtures, today]);
  const [fixtureSlug, setFixtureSlug] = useState<string | null>(null);
  const selectedSlug = fixtureSlug ?? defaultSlug;
  const selectedMatch = ourFixtures.find((m) => m.slug === selectedSlug) ?? null;

  if (!opponent) {
    return (
      <div className="app-shell">
        <Link to="/opposition" className="back-link">
          {t('backToOpposition')}
        </Link>
        <div className="report-page">
          <p>{t('opponentNotFound')}</p>
        </div>
      </div>
    );
  }

  const pack = getFixturePack(opponent, selectedSlug);
  const refSlotLimit = referenceMatchSlotLimit(selectedMatch);
  const systems = formationSystemsFor(opponent);
  const formations: Formation[] = systems.map((system, index) => {
    const useScoutedStarters =
      index === 0 && opponent.starters.length > 0;
    return {
      teamId: `${opponent.id}-${system}`,
      label: opponent.name,
      system,
      players: useScoutedStarters
        ? opponent.starters
        : placeholderPlayersForSystem(system, opponent.id),
    };
  });
  const refs = pack.referenceMatches.slice(0, refSlotLimit);
  const emptySlots = Math.max(0, refSlotLimit - refs.length);
  const reports = pack.reportItems;
  const strengthsWeaknesses =
    pack.strengthsWeaknesses ?? EMPTY_STRENGTHS_WEAKNESSES;
  const gkStrikers = strikersForGkTab(opponent.gkStrikers, opponent.shortName);
  const selectedGkStriker =
    gkStrikers.find((s) => s.id === gkStrikerId) ?? gkStrikers[0] ?? null;
  const clipsBySection = OPPOSITION_CLIP_SECTION_ORDER.filter((id) =>
    activeGroups.has(oppositionClipGroupFor(id))
  ).map((id) => ({
    id,
    clips: opponent.clips.filter((c) => c.section === id),
  }));

  const tabs: [
    OpponentTab,
    | 'tabOppositionFormation'
    | 'tabOppositionClips'
    | 'tabOppositionStrengthsWeaknesses'
    | 'tabOppositionMatches'
    | 'tabOppositionReport'
    | 'tabOppositionGk',
  ][] = [
    ['formation', 'tabOppositionFormation'],
    ['clips', 'tabOppositionClips'],
    ['strengths', 'tabOppositionStrengthsWeaknesses'],
    ['matches', 'tabOppositionMatches'],
    ['report', 'tabOppositionReport'],
    ['gk', 'tabOppositionGk'],
  ];

  function toggleClipGroup(groupId: OppositionClipGroupId) {
    setActiveGroups((current) => {
      const next = new Set(current);
      if (next.has(groupId)) next.delete(groupId);
      else next.add(groupId);
      return next;
    });
  }

  return (
    <div className="app-shell">
      <Link to="/opposition" className="back-link">
        {t('backToOpposition')}
      </Link>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('oppositionPageTitle')}
          matchTitle={L(opponent.name)}
          matchDate={selectedMatch?.date ?? new Date().toISOString().slice(0, 10)}
          competition={
            selectedMatch
              ? L(MATCH_COMPETITION_LABELS[selectedMatch.competitionId])
              : t('opposition')
          }
        />

        <div className="opponent-hero">
          <img
            src={teamCrestUrl({ logo: opponent.logo }, 'onLight')}
            alt={L(opponent.name)}
            className="opponent-hero-crest"
          />
          <h2 className="opponent-hero-title notranslate" translate="no">
            {L(opponent.name)}
          </h2>
          <p className="opponent-hero-fixtures">{t('oppositionFixtureHint')}</p>
        </div>

        {ourFixtures.length > 0 ? (
          <div className="fixture-chip-row" role="tablist" aria-label={t('oppositionOurFixtures')}>
            {ourFixtures.map((match) => {
              const weHome = isNapoliHomeVsOpponent(match, opponent);
              const active = match.slug === selectedSlug;
              const isNext = match.slug === defaultSlug && match.date >= today;
              return (
                <button
                  key={match.slug}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`fixture-chip ${active ? 'active' : ''}`}
                  onClick={() => setFixtureSlug(match.slug)}
                >
                  <span className="fixture-chip-date">{formatDate(match.date)}</span>
                  <span className="fixture-chip-meta">
                    {weHome ? t('oppositionHomeFull') : t('oppositionAwayFull')}
                    {' · '}
                    {L(MATCH_COMPETITION_LABELS[match.competitionId])}
                  </span>
                  {isNext ? (
                    <span className="fixture-chip-next">{t('oppositionNextBadge')}</span>
                  ) : null}
                </button>
              );
            })}
          </div>
        ) : (
          <p className="home-empty">{t('oppositionNoOurFixtures')}</p>
        )}
      </div>

      <div className="report-page">
        <div className="tabs-header" role="tablist">
          {tabs.map(([id, labelKey]) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={tab === id}
              className={`tab-button ${tab === id ? 'active' : ''}`}
              onClick={() => setTab(id)}
            >
              {t(labelKey)}
            </button>
          ))}
        </div>

        {tab === 'formation' ? (
          <div className="tab-content active" role="tabpanel">
            <p className="video-hint">{t('oppositionFormationHint')}</p>
            <Formations formations={formations} />
            <div className="section-title">{t('oppositionSubs')}</div>
            {opponent.substitutes.length === 0 ? (
              <p className="home-empty">{t('oppositionSubsEmpty')}</p>
            ) : (
              <ul className="opponent-name-list">
                {opponent.substitutes.map((p) => (
                  <li key={`${p.number}-${p.name}`}>
                    {p.number != null ? `${p.number} ` : ''}
                    {p.name}
                    {p.position ? ` · ${p.position}` : ''}
                  </li>
                ))}
              </ul>
            )}
            <div className="section-title">{t('oppositionSquad')}</div>
            {opponent.squad.length === 0 ? (
              <p className="home-empty">{t('oppositionSquadEmpty')}</p>
            ) : (
              <ul className="opponent-name-list">
                {opponent.squad.map((p) => (
                  <li key={`${p.number}-${p.name}`}>
                    {p.number != null ? `${p.number} ` : ''}
                    {p.name}
                    {p.position ? ` · ${p.position}` : ''}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : null}

        {tab === 'clips' ? (
          <div className="tab-content active" role="tabpanel">
            <p className="video-hint">{t('oppositionClipsHint')}</p>

            <div
              className="opposition-clip-toggles"
              role="group"
              aria-label={t('oppositionClipFilterAria')}
            >
              {OPPOSITION_CLIP_GROUP_IDS.map((groupId) => {
                const on = activeGroups.has(groupId);
                return (
                  <button
                    key={groupId}
                    type="button"
                    aria-pressed={on}
                    className={`opposition-clip-toggle ${on ? 'active' : ''}`}
                    onClick={() => toggleClipGroup(groupId)}
                  >
                    {t(OPPOSITION_CLIP_GROUP_LABEL_KEYS[groupId])}
                  </button>
                );
              })}
            </div>

            {clipsBySection.length === 0 ? (
              <p className="home-empty">{t('oppositionClipFilterEmpty')}</p>
            ) : (
              clipsBySection.map((section) => (
                <div className="opposition-clip-section" key={section.id}>
                  <div className="section-title">
                    {L(oppositionClipSectionLabel(section.id))}
                  </div>
                  {section.clips.length === 0 ? (
                    <p className="home-empty">{t('oppositionClipSectionEmpty')}</p>
                  ) : (
                    <div className="analysis-grid">
                      {section.clips.map((clip) => (
                        <article className="analysis-card" key={clip.id}>
                          <MatchMedia
                            slug={opponent.slug}
                            src={clip.videoFile}
                            kind="clips"
                            unsupportedLabel={t('videoUnsupported')}
                            playLabel={t('playVideo')}
                            title={L(clip.title)}
                          />
                          <div className="clip-card-body">
                            <div className="clip-card-title">{L(clip.title)}</div>
                          </div>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        ) : null}

        {tab === 'strengths' ? (
          <div className="tab-content active" role="tabpanel">
            <TwoColumnNotesPanel
              hint={t('oppositionStrengthsWeaknessesHint')}
              leftTitle={t('oppositionStrengths')}
              rightTitle={t('oppositionWeaknesses')}
              leftEmpty={t('oppositionStrengthsEmpty')}
              rightEmpty={t('oppositionWeaknessesEmpty')}
              leftNotes={strengthsWeaknesses.strengths}
              rightNotes={strengthsWeaknesses.weaknesses}
            />
          </div>
        ) : null}

        {tab === 'gk' ? (
          <div className="tab-content active" role="tabpanel">
            <p className="video-hint">{t('oppositionGkAreaHint')}</p>
            <div
              className="gk-striker-picker"
              role="tablist"
              aria-label={t('oppositionGkStrikers')}
            >
              {gkStrikers.map((striker) => {
                const active = striker.id === selectedGkStriker?.id;
                return (
                  <button
                    key={striker.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`gk-striker-chip ${active ? 'active' : ''}`}
                    onClick={() => setGkStrikerId(striker.id)}
                  >
                    {striker.number != null ? `${striker.number} ` : ''}
                    {striker.name}
                  </button>
                );
              })}
            </div>
            {selectedGkStriker ? (
              <GkStrikerScout
                key={selectedGkStriker.id}
                striker={selectedGkStriker}
                mediaSlug={opponent.slug}
              />
            ) : null}
          </div>
        ) : null}

        {tab === 'matches' ? (
          <div className="tab-content active" role="tabpanel">
            <p className="video-hint">
              {t(
                refSlotLimit >= OPPOSITION_MAX_REFERENCE_MATCHES
                  ? 'oppositionRefMatchesHint'
                  : 'oppositionRefMatchesHintThree'
              ).replace('{n}', String(refSlotLimit))}
            </p>
            <div className="match-grid">
              {refs.map((item) => (
                <article className="match-card" key={item.id}>
                  <div className="match-card-date">
                    {item.date ? formatDate(item.date) : t('oppositionRefMatch')}
                    {item.competition ? ` · ${L(item.competition)}` : ''}
                  </div>
                  <div className="match-card-title">{L(item.title)}</div>
                  {item.score ? (
                    <div className="match-card-score">{item.score}</div>
                  ) : null}
                  {item.videoFile ? (
                    <MatchMedia
                      slug={opponent.slug}
                      src={item.videoFile}
                      unsupportedLabel={t('videoUnsupported')}
                      playLabel={t('playVideo')}
                      title={L(item.title)}
                    />
                  ) : null}
                </article>
              ))}
              {Array.from({ length: emptySlots }, (_, i) => {
                const slot = refs.length + i + 1;
                const isFourth =
                  slot === 4 &&
                  refSlotLimit >= OPPOSITION_MAX_REFERENCE_MATCHES;
                return (
                  <article
                    className="match-card opponent-slot-card"
                    key={`slot-${i}`}
                  >
                    <div className="match-card-date">
                      {t('oppositionRefSlot').replace('{n}', String(slot))}
                    </div>
                    <div className="match-card-title">
                      {isFourth
                        ? t('oppositionRefSlotFour')
                        : t('oppositionRefEmpty')}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        ) : null}

        {tab === 'report' ? (
          <div className="tab-content active" role="tabpanel">
            <p className="video-hint">{t('oppositionReportHint')}</p>
            <div className="opposition-report-shell">
              <div className="section-title">{t('oppositionReportWritten')}</div>
              <p className="home-empty">{t('oppositionReportWrittenEmpty')}</p>
              <div className="section-title">{t('oppositionReportVideo')}</div>
              {reports.length === 0 ? (
                <p className="home-empty">{t('oppositionReportVideoEmpty')}</p>
              ) : (
                <div className="analysis-grid">
                  {reports.map((item) => (
                    <article className="analysis-card" key={item.id}>
                      <MatchMedia
                        slug={opponent.slug}
                        src={item.videoFile}
                        kind="analysis"
                        unsupportedLabel={t('videoUnsupported')}
                        playLabel={t('playVideo')}
                        title={L(item.title)}
                      />
                      <div className="clip-card-body">
                        <div className="clip-card-title">{L(item.title)}</div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
