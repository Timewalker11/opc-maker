import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import { ProgressBar } from "../ui/ProgressBar";
import { CardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { useDashboardData } from "../../hooks/useDashboardData";
import { fetchStorageUsage, fetchRecentFiles } from "../../services/files";
import { formatBytes } from "../../utils/format";
import "./storage-card.css";

const KIND_ICON: Record<string, IconName> = {
  image: "image",
  document: "folder",
  spreadsheet: "bar-chart",
  media: "image",
};

export function StorageCard() {
  const usage = useDashboardData(fetchStorageUsage);
  const recentFiles = useDashboardData(fetchRecentFiles);
  const loading = usage.status === "loading" || recentFiles.status === "loading";
  const hasError = usage.status === "error" || recentFiles.status === "error";
  const hasFiles = !!recentFiles.data && recentFiles.data.length > 0;

  const pct = usage.data ? (usage.data.used / usage.data.total) * 100 : 0;
  const nearlyFull = pct >= 85;

  return (
    <Card
      title="Storage"
      icon={<Icon name="database" size={16} />}
      headerAction={
        <Link to="/files" className="card-link">
          Manage files <Icon name="chevron-right" size={13} />
        </Link>
      }
    >
      {loading && <CardSkeleton lines={3} />}
      {hasError && <ErrorState compact onRetry={() => { usage.reload(); recentFiles.reload(); }} />}
      {!loading && !hasError && !hasFiles && (
        <EmptyState icon="database" title="No files yet" description="Upload your first file to start using storage." compact />
      )}
      {!loading && !hasError && hasFiles && usage.data && (
        <div className="storage-card">
          <div className="storage-card__usage-row">
            <span>{formatBytes(usage.data.used)} used</span>
            <span className="storage-card__total">of {formatBytes(usage.data.total)}</span>
          </div>
          <ProgressBar
            value={usage.data.used}
            max={usage.data.total}
            tone={nearlyFull ? "warning" : "accent"}
            label="Storage used"
          />
          {nearlyFull && <Badge tone="warning">Storage almost full</Badge>}

          <div className="storage-card__recent">
            <p className="storage-card__recent-heading">Recently uploaded</p>
            <ul>
              {recentFiles.data!.slice(0, 3).map((f) => (
                <li key={f.id} className="storage-card__file">
                  <Icon name={KIND_ICON[f.kind] ?? "folder"} size={14} />
                  <span className="truncate">{f.name}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </Card>
  );
}
