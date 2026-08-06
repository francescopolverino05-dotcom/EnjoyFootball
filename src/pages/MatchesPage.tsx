import { useState } from 'react';
import { Link } from 'react-router-dom';
import { getAllMatches } from '../data/matches';
import {
  defaultMatchCompetitionId,
  groupMatchesByCompetition,
  MATCH_COMPETITION_TAB_KEYS,
  type MatchCompetitionId,
} from '../data/matchCompetitions';
import MatchCard from '../components/MatchCard';
import ReportHeader from '../components/ReportHeader';
import { useLanguage } from '../i18n/LanguageContext';

export default function MatchesPage() {
  const matches = getAllMatches();
  const competitions = groupMatchesByCompetition(matches);
  const { t } = useLanguage();
  const [selectedCompetitionId, setSelectedCompetitionId] =
    useState<MatchCompetitionId>(() => defaultMatchCompetitionId(competitions));

  const selectedCompetition =
    competitions.find((group) => group.id === selectedCompetitionId) ??
    competitions[0];

  return (
    <div className="app-shell">
      <Link to="/" className="back-link">
        {t('backToHome')}
      </Link>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('matchesPageTitle')}
          matchTitle={t('matches')}
          matchDate={new Date().toISOString().slice(0, 10)}
          competition={t('season')}
        />
      </div>

      <section className="home-section" aria-labelledby="matches-list-heading">
        <div className="section-title" id="matches-list-heading">
          {t('matches')}
          {selectedCompetition
            ? ` (${selectedCompetition.matches.length})`
            : ` (${matches.length})`}
        </div>
        <p className="home-section-hint">{t('matchesHint')}</p>
        {!selectedCompetition ? (
          <p className="home-empty">{t('noMatchesYet')}</p>
        ) : (
          <div className="match-competitions">
            <div className="tabs-header" role="tablist">
              {competitions.map((group) => {
                const active = group.id === selectedCompetition.id;
                return (
                  <button
                    key={group.id}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    className={`tab-button ${active ? 'active' : ''}`}
                    onClick={() => setSelectedCompetitionId(group.id)}
                  >
                    {t(MATCH_COMPETITION_TAB_KEYS[group.id])}
                  </button>
                );
              })}
            </div>

            <section
              className="match-competition"
              aria-labelledby={`match-competition-${selectedCompetition.id}`}
            >
              <header className="match-competition-header">
                <h3
                  className="match-competition-title"
                  id={`match-competition-${selectedCompetition.id}`}
                >
                  {t(MATCH_COMPETITION_TAB_KEYS[selectedCompetition.id])}
                </h3>
              </header>
              {selectedCompetition.matches.length === 0 ? (
                <p className="home-empty">{t('noMatchesInCompetition')}</p>
              ) : (
                <div className="match-grid">
                  {selectedCompetition.matches.map((match) => (
                    <MatchCard key={match.id} match={match} />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}
      </section>
    </div>
  );
}
