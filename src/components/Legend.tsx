import { MetricKey } from '../types/occupation';
import { METRIC_CONFIG, DIVISION_COLORS } from '../utils/colorScale';

interface Props {
  metric: MetricKey;
  divisions: Array<{ code: string; name: string; color: string; total_workforce_million?: number }>;
  activeDivisions: string[];
  onToggleDivision: (code: string) => void;
}

export default function Legend({ metric, divisions, activeDivisions, onToggleDivision }: Props) {
  const cfg = METRIC_CONFIG[metric];

  const gradientStyle = {
    background: `linear-gradient(to right, ${cfg.colorRange.join(', ')})`,
  };

  return (
    <div className="legend-bar">
      <div className="legend-title">{cfg.label}</div>
      <div className="legend-gradient">
        <span className="legend-label">{cfg.lowLabel}</span>
        <div className="legend-grad-bar" style={gradientStyle} />
        <span className="legend-label">{cfg.highLabel}</span>
      </div>

      <div className="legend-divs">
        {divisions.map(div => {
          const active = activeDivisions.length === 0 || activeDivisions.includes(div.code);
          return (
            <div
              key={div.code}
              className="legend-div-item"
              style={{ opacity: active ? 1 : 0.35 }}
              onClick={() => onToggleDivision(div.code)}
              title={div.name}
            >
              <div className="legend-div-dot" style={{ background: DIVISION_COLORS[div.code] }} />
              <span>{div.name.split(',')[0]}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
