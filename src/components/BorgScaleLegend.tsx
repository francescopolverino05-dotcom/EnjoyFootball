import {
  getBorgScale,
  type BorgScaleKind,
} from '../data/borgScales';
import { useLanguage } from '../i18n/LanguageContext';

/** Compact always-visible Borg 6–20 reference for RPE or TQR charts. */
export default function BorgScaleLegend({ kind }: { kind: BorgScaleKind }) {
  const { L, t } = useLanguage();
  const scale = getBorgScale(kind);

  return (
    <aside
      className={`borg-scale-legend borg-scale-${kind}`}
      aria-label={`${L(scale.title)} (${L(scale.rangeLabel)})`}
    >
      <div className="borg-scale-head">
        <span className="borg-scale-title">{L(scale.title)}</span>
        <span className="borg-scale-range">{L(scale.rangeLabel)}</span>
      </div>
      <p className="borg-scale-caption">{t('borgScaleCaption')}</p>
      <ol className="borg-scale-grid">
        {scale.steps.map((step) => (
          <li key={step.value} className="borg-scale-step">
            <span className="borg-scale-value">{step.value}</span>
            <span className="borg-scale-label">{L(step.label)}</span>
          </li>
        ))}
      </ol>
    </aside>
  );
}
