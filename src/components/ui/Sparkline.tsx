interface SparklineProps {
  values: number[];
  width?: number;
  height?: number;
  positive?: boolean;
}

export function Sparkline({ values, width = 96, height = 32, positive = true }: SparklineProps) {
  if (values.length < 2) return null;

  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const stepX = width / (values.length - 1);
  const pad = 3;

  const points = values.map((v, i) => {
    const x = i * stepX;
    const y = pad + (1 - (v - min) / range) * (height - pad * 2);
    return [x, y] as const;
  });

  const linePath = points.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const areaPath = `${linePath} L${width},${height} L0,${height} Z`;
  const stroke = positive ? "var(--status-good)" : "var(--status-critical)";
  const fill = positive ? "var(--status-good-soft)" : "var(--status-critical-soft)";
  const last = points[points.length - 1];

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} aria-hidden="true" focusable="false">
      <path d={areaPath} fill={fill} stroke="none" />
      <path d={linePath} fill="none" stroke={stroke} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={2.5} fill={stroke} />
    </svg>
  );
}
