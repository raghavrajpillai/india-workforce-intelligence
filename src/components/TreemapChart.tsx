import { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as d3 from 'd3';
import { OccupationData, MetricKey } from '../types/occupation';
import { getMetricColor, DIVISION_COLORS } from '../utils/colorScale';
import { formatWorkforce } from '../utils/format';
import HoverCard from './HoverCard';

interface Props {
  occupations: OccupationData[];
  allOccupations: OccupationData[];
  metric: MetricKey;
  search: string;
}

interface TileData {
  data: OccupationData;
  x0: number; y0: number; x1: number; y1: number;
  parent: { data: { name: string; code: string }; x0: number; y0: number; x1: number; y1: number } | null;
}

interface HoverState {
  occ: OccupationData;
  x: number;
  y: number;
}

export default function TreemapChart({ occupations, allOccupations, metric, search }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ w: 800, h: 600 });
  const [hover, setHover] = useState<HoverState | null>(null);
  const [pinned, setPinned] = useState<HoverState | null>(null);

  // Track container size
  useEffect(() => {
    if (!containerRef.current) return;
    const ro = new ResizeObserver(entries => {
      const { width, height } = entries[0].contentRect;
      if (width > 0 && height > 0) setDims({ w: Math.floor(width), h: Math.floor(height) });
    });
    ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, []);

  // Escape to dismiss pinned card
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') { setPinned(null); setHover(null); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Build D3 treemap layout
  const tiles = useMemo<TileData[]>(() => {
    if (!occupations.length || dims.w < 10) return [];

    // Group occupations by division
    const grouped = new Map<string, OccupationData[]>();
    for (const o of occupations) {
      if (!grouped.has(o.division_code)) grouped.set(o.division_code, []);
      grouped.get(o.division_code)!.push(o);
    }

    // Build hierarchy: root → divisions → occupations
    const rootData = {
      name: 'India',
      code: 'root',
      children: Array.from(grouped.entries()).map(([divCode, occs]) => ({
        name: occs[0]?.division_name ?? divCode,
        code: divCode,
        children: occs.map(o => ({ ...o, value: Math.max(o.workforce_million, 0.01) })),
      })),
    };

    const root = d3.hierarchy(rootData)
      .sum((d: any) => d.value ?? 0)
      .sort((a, b) => (b.value ?? 0) - (a.value ?? 0));

    d3.treemap<typeof rootData>()
      .size([dims.w, dims.h])
      .paddingOuter(3)
      .paddingInner(1.5)
      .paddingTop(20)
      .round(true)
      .tile(d3.treemapSquarify)(root);

    const result: TileData[] = [];
    root.leaves().forEach((leaf: any) => {
      result.push({
        data: leaf.data as OccupationData,
        x0: leaf.x0, y0: leaf.y0, x1: leaf.x1, y1: leaf.y1,
        parent: leaf.parent ? {
          data: { name: leaf.parent.data.name, code: leaf.parent.data.code },
          x0: leaf.parent.x0, y0: leaf.parent.y0, x1: leaf.parent.x1, y1: leaf.parent.y1,
        } : null,
      });
    });
    return result;
  }, [occupations, dims]);

  // Division borders (unique parent nodes)
  const divisionBorders = useMemo(() => {
    const seen = new Map<string, { code: string; name: string; x0: number; y0: number; x1: number; y1: number }>();
    for (const t of tiles) {
      if (t.parent && !seen.has(t.parent.data.code)) {
        seen.set(t.parent.data.code, {
          code: t.parent.data.code,
          name: t.parent.data.name,
          ...t.parent,
        });
      }
    }
    return Array.from(seen.values());
  }, [tiles]);

  // Determine search query match
  const searchLower = search.toLowerCase().trim();
  const isMatched = useCallback((occ: OccupationData) => {
    if (!searchLower) return true;
    return (
      occ.name.toLowerCase().includes(searchLower) ||
      occ.code.includes(searchLower) ||
      occ.sector.toLowerCase().includes(searchLower) ||
      occ.nco2015_examples.some(e => e.toLowerCase().includes(searchLower))
    );
  }, [searchLower]);

  const handleMouseMove = useCallback((e: React.MouseEvent, occ: OccupationData) => {
    if (!pinned) setHover({ occ, x: e.clientX, y: e.clientY });
  }, [pinned]);

  const handleClick = useCallback((e: React.MouseEvent, occ: OccupationData) => {
    e.stopPropagation();
    if (pinned?.occ.code === occ.code) {
      setPinned(null);
    } else {
      setPinned({ occ, x: e.clientX, y: e.clientY });
      setHover(null);
    }
  }, [pinned]);

  const handleSvgClick = useCallback(() => {
    setPinned(null);
    setHover(null);
  }, []);

  const activeHover = pinned ?? hover;

  return (
    <div ref={containerRef} className="treemap-container" style={{ width: '100%', height: '100%' }}>
      <svg
        className="treemap-svg"
        width={dims.w}
        height={dims.h}
        onClick={handleSvgClick}
      >
        {/* Division labels (header bars) */}
        {divisionBorders.map(div => {
          const w = div.x1 - div.x0;
          const color = DIVISION_COLORS[div.code] ?? '#6b7280';
          if (w < 30) return null;
          return (
            <g key={div.code} className="division-label-group">
              <rect
                x={div.x0}
                y={div.y0}
                width={w}
                height={18}
                fill={color}
                opacity={0.18}
              />
              <text
                x={div.x0 + 5}
                y={div.y0 + 13}
                fill={color}
                fontSize={10}
                fontWeight={700}
                opacity={0.9}
              >
                {div.name.length > Math.floor(w / 7)
                  ? div.name.slice(0, Math.floor(w / 7) - 1) + '…'
                  : div.name}
              </text>
            </g>
          );
        })}

        {/* Occupation tiles */}
        {tiles.map(tile => {
          const { data, x0, y0, x1, y1 } = tile;
          const w = x1 - x0;
          const h = y1 - y0;
          if (w < 2 || h < 2) return null;

          const score = data.scores[metric];
          const fill = getMetricColor(score, metric);
          const matched = isMatched(data);
          const isActive = activeHover?.occ.code === data.code;

          const showText = w > 45 && h > 28;
          const showSize = w > 60 && h > 42;
          const showCode = w > 80 && h > 55;

          // Calculate text color based on background brightness
          const textColor = '#ffffff';

          return (
            <g key={data.code}>
              <rect
                className={`tile-rect${!matched && searchLower ? ' dimmed' : ''}${isActive ? ' highlighted' : ''}`}
                x={x0} y={y0}
                width={w} height={h}
                fill={fill}
                opacity={matched || !searchLower ? 0.88 : 0.15}
                onMouseMove={e => handleMouseMove(e, data)}
                onMouseLeave={() => !pinned && setHover(null)}
                onClick={e => handleClick(e, data)}
              />
              {showText && (
                <text
                  className="tile-label"
                  x={x0 + 5}
                  y={y0 + 18}
                  fill={textColor}
                  style={{ pointerEvents: 'none' }}
                >
                  <tspan
                    className="tile-name"
                    fontSize={Math.min(12, Math.max(8, w / 10))}
                    fontWeight={600}
                    x={x0 + 5}
                    dy={0}
                  >
                    {data.name.length > Math.floor(w / 7)
                      ? data.name.slice(0, Math.floor(w / 7) - 1) + '…'
                      : data.name}
                  </tspan>
                  {showSize && (
                    <tspan
                      className="tile-size"
                      fontSize={Math.min(10, Math.max(7, w / 12))}
                      x={x0 + 5}
                      dy={13}
                      opacity={0.8}
                    >
                      {formatWorkforce(data.workforce_million)}
                    </tspan>
                  )}
                  {showCode && (
                    <tspan
                      className="tile-code"
                      fontSize={8}
                      x={x0 + 5}
                      dy={11}
                      opacity={0.55}
                    >
                      NCO {data.code}
                    </tspan>
                  )}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      {activeHover && (
        <HoverCard
          occ={activeHover.occ}
          x={activeHover.x}
          y={activeHover.y}
          activeMetric={metric}
        />
      )}

      {!occupations.length && (
        <div className="empty-state">
          <span style={{ fontSize: 32 }}>🔍</span>
          <span>No occupations match your filters</span>
          <span style={{ fontSize: 12, color: '#475569' }}>Try clearing some filters</span>
        </div>
      )}
    </div>
  );
}
