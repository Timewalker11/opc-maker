import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import type { SocialPlatform, PostStatus } from "../../types";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import type { BadgeTone } from "../ui/Badge";
import { CardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { Modal } from "../ui/Modal";
import { ClickableRegion } from "../ui/ClickableRegion";
import { useSocialStore } from "../../store/socialStore";
import { formatDay, formatTime } from "../../utils/format";
import "./social-posts-card.css";
import "./card-detail.css";

const PLATFORM_ICON: Record<SocialPlatform, IconName> = {
  instagram: "instagram",
  facebook: "facebook",
  linkedin: "linkedin",
  tiktok: "tiktok",
};

const STATUS_TONE: Record<PostStatus, BadgeTone> = {
  draft: "neutral",
  scheduled: "accent",
  published: "good",
};

export function SocialPostsCard() {
  const status = useSocialStore((s) => s.status);
  const allPosts = useSocialStore((s) => s.items);
  const load = useSocialStore((s) => s.load);
  const scheduled = allPosts.filter((p) => p.status === "scheduled").sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  const next = scheduled[0];
  const [detailsOpen, setDetailsOpen] = useState(false);

  useEffect(() => {
    if (status === "idle") load();
  }, [status, load]);

  return (
    <Card
      title="Scheduled social posts"
      icon={<Icon name="megaphone" size={16} />}
      headerAction={
        <Link to="/marketing" className="card-link">
          Social calendar <Icon name="chevron-right" size={13} />
        </Link>
      }
    >
      {status === "loading" && <CardSkeleton lines={2} />}
      {status === "error" && <ErrorState compact onRetry={load} />}
      {status === "ready" && allPosts.length === 0 && (
        <EmptyState
          icon="megaphone"
          title="No posts scheduled"
          description="Add a social account to start scheduling posts."
          compact
          action={
            <Link to="/settings#integrations" className="card-link">
              Add a social account <Icon name="arrow-up-right" size={12} />
            </Link>
          }
        />
      )}
      {status === "ready" && allPosts.length > 0 && (
        <ClickableRegion onClick={() => setDetailsOpen(true)} ariaLabel="View all social posts">
          <div className="social-posts-card">
            <p className="social-posts-card__count">
              <strong>{scheduled.length}</strong> scheduled
            </p>
            {next ? (
              <div className="social-posts-card__next">
                <span className="social-posts-card__platform">
                  <Icon name={PLATFORM_ICON[next.platform]} size={16} />
                </span>
                <div className="social-posts-card__next-body">
                  <p className="truncate">{next.caption}</p>
                  <p className="social-posts-card__meta">
                    {formatDay(next.scheduledAt)}, {formatTime(next.scheduledAt)}
                  </p>
                </div>
                <Badge tone={STATUS_TONE[next.status]}>{next.status}</Badge>
              </div>
            ) : (
              <p className="social-posts-card__none">Nothing scheduled next -- everything is either drafted or already live.</p>
            )}
          </div>
        </ClickableRegion>
      )}
      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)} title="Social posts">
        <div className="card-detail">
          {allPosts.length === 0 && <p className="card-detail__empty">No posts yet.</p>}
          {allPosts.length > 0 && (
            <ul className="card-detail__list">
              {[...allPosts]
                .sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt))
                .map((p) => (
                  <li key={p.id} className="card-detail__row">
                    <span className="social-posts-card__platform">
                      <Icon name={PLATFORM_ICON[p.platform]} size={16} />
                    </span>
                    <div className="card-detail__row-body">
                      <p className="card-detail__row-title truncate">{p.caption}</p>
                      <p className="card-detail__row-meta">
                        {formatDay(p.scheduledAt)}, {formatTime(p.scheduledAt)}
                      </p>
                    </div>
                    <Badge tone={STATUS_TONE[p.status]}>{p.status}</Badge>
                  </li>
                ))}
            </ul>
          )}
        </div>
      </Modal>
    </Card>
  );
}
