import { STATE_INDEX } from '../data/states';
import { CHAPTERS, metricFormat, metricValue } from '../data/chapters';

interface Props {
  fips: string | null;
  chapterIndex: number;
}

export function StateTooltip({ fips, chapterIndex }: Props) {
  if (!fips) return null;
  const row = STATE_INDEX[fips];
  if (!row) return null;
  const chapter = CHAPTERS[chapterIndex];
  const v = metricValue(row, chapter.metric);

  const ratio = row.licensedHomes / Math.max(1, row.fosterCare) * 100;
  const churchesPerChild = (row.congregations / Math.max(1, row.waitingAdoption)).toFixed(1);

  return (
    <div className="tooltip" role="status" aria-live="polite">
      <div className="tooltip-name">{row.name}</div>
      <div className="tooltip-metric">
        <span className="tooltip-metric-label">{chapter.unit}</span>
        <span className="tooltip-metric-value">{metricFormat(chapter.metric, v)}</span>
      </div>
      <dl className="tooltip-stats">
        <div>
          <dt>Children in care</dt>
          <dd>{row.fosterCare.toLocaleString()}</dd>
        </div>
        <div>
          <dt>Waiting to be adopted</dt>
          <dd>{row.waitingAdoption.toLocaleString()}</dd>
        </div>
        <div>
          <dt>Licensed homes / 100 kids</dt>
          <dd>{ratio.toFixed(0)}</dd>
        </div>
        <div>
          <dt>Churches per waiting child</dt>
          <dd>{churchesPerChild}</dd>
        </div>
      </dl>
    </div>
  );
}
