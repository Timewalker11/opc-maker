import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Icon } from "../components/ui/Icon";
import type { IconName } from "../components/ui/Icon";
import { Badge } from "../components/ui/Badge";
import { ProgressBar } from "../components/ui/ProgressBar";
import { CardSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { useDashboardData } from "../hooks/useDashboardData";
import { fetchRecentFiles, fetchStorageUsage } from "../services/files";
import { formatBytes, formatRelativeTime } from "../utils/format";

const KIND_ICON: Record<string, IconName> = { image: "image", document: "folder", spreadsheet: "bar-chart", media: "image" };

export function Files() {
  const usage = useDashboardData(fetchStorageUsage);
  const files = useDashboardData(fetchRecentFiles);
  const fileList = files.data ?? [];
  const pctUsed = usage.data ? (usage.data.used / usage.data.total) * 100 : 0;

  return (
    <div>
      <PageHeader title="Files" description="Everything you've uploaded, in one place." />
      <div className="page-grid">
        <Card title="Storage usage">
          {usage.status === "loading" && <CardSkeleton lines={2} />}
          {usage.status === "error" && <ErrorState onRetry={usage.reload} />}
          {usage.status === "ready" && usage.data && (
            <div className="storage-usage">
              <p className="record-row__subtitle">
                {formatBytes(usage.data.used)} of {formatBytes(usage.data.total)} used
              </p>
              <ProgressBar value={usage.data.used} max={usage.data.total} tone={pctUsed >= 85 ? "warning" : "accent"} label="Storage used" />
              {pctUsed >= 85 && <Badge tone="warning">Storage almost full -- consider archiving older files</Badge>}
            </div>
          )}
        </Card>

        <Card title="Recent files">
          {files.status === "loading" && <CardSkeleton lines={4} />}
          {files.status === "error" && <ErrorState onRetry={files.reload} />}
          {files.status === "ready" && fileList.length === 0 && (
            <EmptyState icon="upload" title="No files yet" description="Upload your first file to start using storage." />
          )}
          {files.status === "ready" && fileList.length > 0 && (
            <ul className="record-list">
              {fileList.map((f) => (
                <li key={f.id} className="record-row">
                  <div className="record-row__main record-row__checkbox-row">
                    <Icon name={KIND_ICON[f.kind] ?? "folder"} size={16} />
                    <div>
                      <p className="record-row__title truncate">{f.name}</p>
                      {f.relatedTo && <p className="record-row__subtitle">Related to {f.relatedTo.label}</p>}
                    </div>
                  </div>
                  <div className="record-row__end">
                    <span className="record-row__subtitle">{formatBytes(f.sizeBytes)}</span>
                    <span className="record-row__subtitle">{formatRelativeTime(f.uploadedAt)}</span>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
