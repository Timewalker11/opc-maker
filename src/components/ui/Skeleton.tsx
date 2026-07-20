import "./skeleton.css";

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  radius?: string;
  className?: string;
}

export function Skeleton({ width = "100%", height = 14, radius, className = "" }: SkeletonProps) {
  return (
    <span
      className={`ui-skeleton ${className}`}
      style={{ width, height, borderRadius: radius ?? "var(--radius-sm)" }}
      aria-hidden="true"
    />
  );
}

export function CardSkeleton({ lines = 3 }: { lines?: number }) {
  return (
    <div className="ui-card-skeleton" role="status" aria-label="Loading">
      <Skeleton width={120} height={12} />
      <Skeleton width={72} height={26} />
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={12} width={`${85 - i * 12}%`} />
      ))}
      <span className="visually-hidden">Loading content</span>
    </div>
  );
}
