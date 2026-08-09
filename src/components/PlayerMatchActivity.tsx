import { Link } from 'react-router-dom';
import MatchMedia from './MatchMedia';
import {
  appearanceMinutesPlayed,
  formatAppearanceMinutes,
  getPlayerMatchLinks,
  type PlayerMatchLink,
} from '../data/playerLinks';
import { useLanguage } from '../i18n/LanguageContext';
import { CLIP_LABELS, type ClipLabelId } from '../i18n/clipLabels';

interface PlayerMatchActivityProps {
  playerSlug: string;
}

function sourceLabel(
  source: PlayerMatchLink['source'],
  t: (key: 'playerLinkSourceAppearances' | 'playerLinkSourceFormation' | 'playerLinkSourceGoals') => string
): string {
  if (source === 'appearances') return t('playerLinkSourceAppearances');
  if (source === 'formation') return t('playerLinkSourceFormation');
  return t('playerLinkSourceGoals');
}

export default function PlayerMatchActivity({
  playerSlug,
}: PlayerMatchActivityProps) {
  const { t, L, formatDate, locale } = useLanguage();
  const links = getPlayerMatchLinks(playerSlug);

  const matchCount = links.length;
  const clipCount = links.reduce((sum, link) => sum + link.clips.length, 0);
  const goalCount = links.reduce((sum, link) => sum + link.goals.length, 0);

  return (
    <section className="player-activity" aria-labelledby="player-activity-heading">
      <div className="player-activity-head">
        <div>
          <h2 id="player-activity-heading" className="section-title">
            {t('playerMatchActivity')}
          </h2>
          <p className="player-activity-hint">{t('playerMatchActivityHint')}</p>
        </div>
        <span className="home-draft-badge home-draft-badge-inline">
          {t('homeDraftPreview')}
        </span>
      </div>

      <div className="player-activity-kpis" aria-label={t('playerMatchActivity')}>
        <div className="player-activity-kpi">
          <span className="player-activity-kpi-value">{matchCount}</span>
          <span className="player-activity-kpi-label">{t('playerMatchesCount')}</span>
        </div>
        <div className="player-activity-kpi">
          <span className="player-activity-kpi-value">{clipCount}</span>
          <span className="player-activity-kpi-label">{t('playerClipsCount')}</span>
        </div>
        <div className="player-activity-kpi">
          <span className="player-activity-kpi-value">{goalCount}</span>
          <span className="player-activity-kpi-label">{t('playerGoalsCount')}</span>
        </div>
      </div>

      {links.length === 0 ? (
        <p className="home-empty">{t('playerNoMatchLinks')}</p>
      ) : (
        <div className="player-activity-list">
          {links.map((link) => {
            const minutes = appearanceMinutesPlayed(link.appearance);
            return (
              <article className="player-match-card" key={link.matchSlug}>
                <header className="player-match-card-head">
                  <div>
                    <div className="player-match-card-date">
                      {formatDate(link.matchDate)} · {L(link.competition)}
                    </div>
                    <h3 className="player-match-card-title">{L(link.matchTitle)}</h3>
                    <div className="player-match-card-score">
                      {link.homeTeam} {link.score.home} – {link.score.away}{' '}
                      {link.awayTeam}
                    </div>
                  </div>
                  <div className="player-match-card-actions">
                    <span className="player-link-source">
                      {sourceLabel(link.source, t)}
                    </span>
                    <Link
                      to={`/match/${link.matchSlug}`}
                      className="home-section-link"
                    >
                      {t('homeOpenReport')}
                    </Link>
                  </div>
                </header>

                <dl className="player-match-meta">
                  <div>
                    <dt>{t('playerMinutes')}</dt>
                    <dd>
                      {formatAppearanceMinutes(link.appearance, locale)}
                      {minutes != null ? ` · ${minutes}'` : ''}
                    </dd>
                  </div>
                  <div>
                    <dt>{t('appearanceGoal')}</dt>
                    <dd>
                      {link.goals.length
                        ? link.goals.map((m) => `${m}'`).join(', ')
                        : '—'}
                    </dd>
                  </div>
                  <div>
                    <dt>{t('appearanceAssist')}</dt>
                    <dd>
                      {link.assists.length
                        ? link.assists.map((m) => `${m}'`).join(', ')
                        : '—'}
                    </dd>
                  </div>
                </dl>

                <div className="player-match-clips">
                  <div className="player-match-clips-head">
                    <h4>{t('playerTaggedClips')}</h4>
                    <span>
                      {link.clips.length
                        ? t('homeClipsAvailable').replace(
                            '{n}',
                            String(link.clips.length)
                          )
                        : t('playerNoTaggedClips')}
                    </span>
                  </div>

                  {link.clips.length === 0 ? null : (
                    <div className="player-clip-grid">
                      {link.clips.map(({ clip, draftTagged }) => {
                        const labelId = clip.labels[0] as ClipLabelId | undefined;
                        const label = labelId
                          ? L(CLIP_LABELS[labelId] ?? { en: labelId, it: labelId })
                          : null;
                        return (
                          <article className="player-clip-card" key={clip.id}>
                            <MatchMedia
                              slug={link.matchSlug}
                              src={clip.videoFile}
                              kind="clips"
                              unsupportedLabel={t('videoUnsupported')}
                              playLabel={t('playVideo')}
                              title={L(clip.title)}
                            />
                            <div className="clip-card-body">
                              <div className="clip-card-time">
                                {clip.minute}'
                                {clip.second != null
                                  ? `:${String(clip.second).padStart(2, '0')}`
                                  : ''}
                                {label ? ` · ${label}` : ''}
                              </div>
                              <div className="clip-card-title">{L(clip.title)}</div>
                              <div className="player-clip-card-foot">
                                {draftTagged ? (
                                  <span className="player-draft-tag">
                                    {t('playerDraftClipTag')}
                                  </span>
                                ) : null}
                                <Link
                                  to={`/match/${link.matchSlug}?tab=clips&clip=${encodeURIComponent(clip.id)}`}
                                  className="home-section-link"
                                >
                                  {t('playerOpenInMatch')}
                                </Link>
                              </div>
                            </div>
                          </article>
                        );
                      })}
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
