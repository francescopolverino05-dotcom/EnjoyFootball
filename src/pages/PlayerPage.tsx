import { Link, useParams } from 'react-router-dom';
import {
  getPlayerBySlug,
  playerInitials,
  playerPhotoUrl,
} from '../data/players';
import ReportHeader from '../components/ReportHeader';
import PlayerLoadTimeline from '../components/PlayerLoadTimeline';
import PlayerTqrHistogram from '../components/PlayerTqrHistogram';
import { useLanguage } from '../i18n/LanguageContext';

export default function PlayerPage() {
  const { slug } = useParams<{ slug: string }>();
  const player = slug ? getPlayerBySlug(slug) : undefined;
  const { t } = useLanguage();

  if (!player) {
    return (
      <div className="app-shell">
        <Link to="/players" className="back-link">
          {t('backToPlayers')}
        </Link>
        <div className="report-page">
          <p>{t('playerNotFound')}</p>
        </div>
      </div>
    );
  }

  const photo = playerPhotoUrl(player.photoPath);
  const tbd = t('playerValueTbd');
  const footLabel =
    player.foot == null
      ? tbd
      : player.foot === 'Left'
        ? t('footLeft')
        : player.foot === 'Right'
          ? t('footRight')
          : player.foot === 'Both'
            ? t('footBoth')
            : player.foot;
  const squadLabel =
    player.squad == null
      ? tbd
      : player.squad === 'U18'
        ? t('squadU18')
        : player.squad === 'Primavera'
          ? t('squadPrimavera')
          : player.squad === 'Trialist'
            ? t('squadTrialist')
            : player.squad;
  const squadClass =
    player.squad === 'U18'
      ? 'u18'
      : player.squad === 'Primavera'
        ? 'primavera'
        : player.squad === 'Trialist'
          ? 'trialist'
          : '';

  return (
    <div className="app-shell">
      <Link to="/players" className="back-link">
        {t('backToPlayers')}
      </Link>

      <div className="report-page">
        <ReportHeader
          pageTitle={t('playerProfile')}
          matchTitle={player.displayName}
          matchDate={new Date().toISOString().slice(0, 10)}
          competition={t('season')}
        />

        <div className="player-profile">
          <div className="player-profile-portrait">
            {photo ? (
              <img
                src={photo}
                alt={player.displayName}
                className="player-portrait"
              />
            ) : (
              <div className="player-portrait player-portrait-initials" aria-hidden>
                {playerInitials(player.displayName)}
              </div>
            )}
          </div>

          <div className="player-profile-body">
            <h1 className="player-profile-name notranslate" translate="no">
              {player.displayName}
            </h1>
            <div className="player-profile-meta">
              <span
                className="player-profile-position notranslate"
                translate="no"
              >
                {player.positionShort}
              </span>
              <span className={`squad-badge ${squadClass}`}>{squadLabel}</span>
            </div>

            <dl className="player-stats-grid">
              <div className="player-stat">
                <dt>{t('playerBirthDate')}</dt>
                <dd>{player.birthDate ?? tbd}</dd>
              </div>
              <div className="player-stat">
                <dt>{t('playerAge')}</dt>
                <dd>{player.age ?? tbd}</dd>
              </div>
              <div className="player-stat">
                <dt>{t('playerFoot')}</dt>
                <dd>{footLabel}</dd>
              </div>
              <div className="player-stat">
                <dt>{t('playerHeight')}</dt>
                <dd>
                  {player.heightCm != null
                    ? `${player.heightCm} ${t('unitCm')}`
                    : tbd}
                </dd>
              </div>
              <div className="player-stat">
                <dt>{t('playerWeight')}</dt>
                <dd>
                  {player.weightKg != null
                    ? `${formatWeight(player.weightKg)} ${t('unitKg')}`
                    : tbd}
                </dd>
              </div>
              <div className="player-stat">
                <dt>{t('playerBmi')}</dt>
                <dd>
                  {player.bmi != null ? player.bmi.toFixed(1) : tbd}
                </dd>
              </div>
            </dl>
          </div>
        </div>

        <PlayerLoadTimeline playerSlug={player.slug} />
        <PlayerTqrHistogram playerSlug={player.slug} />
      </div>
    </div>
  );
}

function formatWeight(kg: number): string {
  return Number.isInteger(kg) ? String(kg) : kg.toFixed(1);
}
