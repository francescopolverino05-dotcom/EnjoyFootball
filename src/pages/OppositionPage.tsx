import { useState } from 'react';
import { Link } from 'react-router-dom';
import OpponentCard from '../components/OpponentCard';
import ReportHeader from '../components/ReportHeader';
import {
  getNextOppositionTarget,
  getOpponentsByCompetition,
  OPPOSITION_COMPETITION_ORDER,
} from '../data/opposition';
import { MATCH_COMPETITION_TAB_KEYS } from '../data/matchCompetitions';
import { useLanguage } from '../i18n/LanguageContext';
import type { OppositionCompetitionId } from '../types/opposition';

export default function OppositionPage() {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] =
    useState<OppositionCompetitionId>('primavera2');
  const opponents = getOpponentsByCompetition(selectedId);
  const nextTarget = getNextOppositionTarget();

  return (
    <div className="app-shell">
      <Link to="/" className="back-link">
        {t('backToHome')}
      </Link>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('oppositionPageTitle')}
          matchTitle={t('opposition')}
          matchDate={new Date().toISOString().slice(0, 10)}
          competition={t('season')}
        />
      </div>

      <section className="home-section" aria-labelledby="opposition-heading">
        <div className="section-title" id="opposition-heading">
          {t('opposition')}
          {` (${opponents.length})`}
        </div>
        <p className="home-section-hint">{t('oppositionHint')}</p>

        <div className="match-competitions">
          <div className="tabs-header" role="tablist">
            {OPPOSITION_COMPETITION_ORDER.map((id) => {
              const active = id === selectedId;
              return (
                <button
                  key={id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  className={`tab-button ${active ? 'active' : ''}`}
                  onClick={() => setSelectedId(id)}
                >
                  {t(MATCH_COMPETITION_TAB_KEYS[id])}
                </button>
              );
            })}
          </div>

          <section
            className="match-competition"
            aria-labelledby={`opposition-${selectedId}`}
          >
            <header className="match-competition-header">
              <h3
                className="match-competition-title"
                id={`opposition-${selectedId}`}
              >
                {t(MATCH_COMPETITION_TAB_KEYS[selectedId])}
              </h3>
            </header>
            {opponents.length === 0 ? (
              <p className="home-empty">
                {selectedId === 'uefaYouthLeague'
                  ? t('oppositionUylEmpty')
                  : t('oppositionEmptyCompetition')}
              </p>
            ) : (
              <div className="match-grid opponent-grid">
                {opponents.map((opponent) => {
                  const isNext = nextTarget?.opponent.id === opponent.id;
                  return (
                    <OpponentCard
                      key={opponent.id}
                      opponent={opponent}
                      isNext={isNext}
                      nextDate={isNext ? nextTarget?.match.date : undefined}
                    />
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </section>
    </div>
  );
}
