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
import { useDashboardData } from "../../hooks/useDashboardData";
import { fetchSocialPosts } from "../../services/social";
import { formatDay, formatTime } from "../../utils/format";
import "./social-posts-card.css";

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
  const { status, data, reload } = useDashboardData(fetchSocialPosts);
  const scheduled = (data ?? []).filter((p) => p.status === "scheduled").sort((a, b) => a.scheduledAt.localeCompare(b.scheduledAt));
  const next = scheduled[0];

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
      {status === "error" && <ErrorState compact onRetry={reload} />}
      {status === "ready" && (!data || data.length === 0) && (
        <EmptyState
          icon="megaphone"
          title="No posts scheduled"
          description="Add a social account to start scheduling posts."
          compact
          action={
            <Link to="/integrations" className="card-link">
              Add a social account <Icon name="arrow-up-right" size={12} />
            </Link>
          }
        />
      )}
      {status === "ready" && data && data.length > 0 && (
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
      )}
    </Card>
  );
}
