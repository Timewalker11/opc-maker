import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import { ProgressBar } from "../ui/ProgressBar";
import { CardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { Modal } from "../ui/Modal";
import { ClickableRegion } from "../ui/ClickableRegion";
import { useFilesStore } from "../../store/filesStore";
import { formatBytes, formatRelativeTime } from "../../utils/format";
import "./storage-card.css";
import "./card-detail.css";

const KIND_ICON: Record<string, IconName> = {
  image: "image",
  document: "folder",
  spreadsheet: "bar-chart",
  media: "image",
};

export function StorageCard() {
  const status = useFilesStore((s) => s.status);
  const recentFiles = useFilesStore((s) => s.items);
  const storageUsedBytes = useFilesStore((s) => s.storageUsedBytes);
  const storageTotalBytes = useFilesStore((s) => s.storageTotalBytes);
  const load = useFilesStore((s) => s.load);
  const loading = status === "loading";
  const hasError = status === "error";
  const hasFiles = recentFiles.length > 0;

  const pct = storageTotalBytes > 0 ? (storageUsedBytes / storageTotalBytes) * 100 : 0;
  const nearlyFull = pct >= 85;
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") load();
  }, [status, load]);

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
      {hasError && <ErrorState compact onRetry={load} />}
      {!loading && !hasError && !hasFiles && (
        <EmptyState icon="database" title="No files yet" description="Upload your first file to start using storage." compact />
      )}
      {!loading && !hasError && hasFiles && (
        <ClickableRegion onClick={() => setDetailsOpen(true)} ariaLabel="View storage details">
          <div className="storage-card">
            <div className="storage-card__usage-row">
              <span>{formatBytes(storageUsedBytes)} used</span>
              <span className="storage-card__total">of {formatBytes(storageTotalBytes)}</span>
            </div>
            <ProgressBar value={storageUsedBytes} max={storageTotalBytes} tone={nearlyFull ? "warning" : "accent"} label="Storage used" />
            {nearlyFull && <Badge tone="warning">Storage almost full</Badge>}

            <div className="storage-card__recent">
              <p className="storage-card__recent-heading">Recently uploaded</p>
              <ul>
                {recentFiles.slice(0, 3).map((f) => (
                  <li key={f.id} className="storage-card__file">
                    <Icon name={KIND_ICON[f.kind] ?? "folder"} size={14} />
                    <span className="truncate">{f.name}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </ClickableRegion>
      )}
      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)} title="Storage details">
        <div className="card-detail">
          <div className="card-detail__stats">
            <div className="card-detail__stat">
              <span className="card-detail__stat-label">Used</span>
              <span className="card-detail__stat-value">{formatBytes(storageUsedBytes)}</span>
            </div>
            <div className="card-detail__stat">
              <span className="card-detail__stat-label">Total</span>
              <span className="card-detail__stat-value">{formatBytes(storageTotalBytes)}</span>
            </div>
          </div>
          <ProgressBar value={storageUsedBytes} max={storageTotalBytes} tone={nearlyFull ? "warning" : "accent"} label="Storage used" />
          <p className="card-detail__heading">All recent files</p>
          {recentFiles.length === 0 && <p className="card-detail__empty">No files uploaded yet.</p>}
          {recentFiles.length > 0 && (
            <ul className="card-detail__list">
              {recentFiles.map((f) => (
                <li key={f.id} className="card-detail__row">
                  <Icon name={KIND_ICON[f.kind] ?? "folder"} size={16} />
                  <div className="card-detail__row-body">
                    <p className="card-detail__row-title truncate">{f.name}</p>
                    <p className="card-detail__row-meta">
                      {formatBytes(f.sizeBytes)} &middot; {formatRelativeTime(f.uploadedAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </Card>
  );
}
