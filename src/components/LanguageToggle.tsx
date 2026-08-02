import { useLanguage } from '../i18n/LanguageContext';

export default function LanguageToggle() {
  const { locale, setLocale, t } = useLanguage();

  return (
    <div className="lang-toggle" role="group" aria-label={t('langAria')}>
      <button
        type="button"
        className={`lang-btn ${locale === 'en' ? 'active' : ''}`}
        onClick={() => setLocale('en')}
        aria-pressed={locale === 'en'}
      >
        {t('langEn')}
      </button>
      <button
        type="button"
        className={`lang-btn ${locale === 'it' ? 'active' : ''}`}
        onClick={() => setLocale('it')}
        aria-pressed={locale === 'it'}
      >
        {t('langIt')}
      </button>
    </div>
  );
}
