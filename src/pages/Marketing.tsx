import { Link } from "react-router-dom";
import type { PostStatus } from "../types";
import type { BadgeTone } from "../components/ui/Badge";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Icon } from "../components/ui/Icon";
import { CardSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { useDashboardData } from "../hooks/useDashboardData";
import { fetchSocialPosts } from "../services/social";
import { campaigns } from "../mock/campaigns";
import { formatDay, formatTime } from "../utils/format";

const STATUS_TONE: Record<PostStatus, BadgeTone> = { draft: "neutral", scheduled: "accent", published: "good" };

export function Marketing() {
  const posts = useDashboardData(fetchSocialPosts);
  const socialPosts = posts.data ?? [];
  const campaignList = campaigns;

  return (
    <div>
      <PageHeader title="Marketing" description="Campaigns and social posts across every connected channel." />
      <div className="page-grid">
        <Card title="Campaigns">
          {campaignList.length === 0 ? (
            <EmptyState icon="megaphone" title="No campaigns yet" description="Launch your first marketing campaign to see it here." />
          ) : (
            <ul className="record-list">
              {campaignList.map((c) => (
                <li key={c.id} className="record-row">
                  <div className="record-row__main">
                    <p className="record-row__title">{c.name}</p>
                    <p className="record-row__subtitle">
                      {c.channel} · {c.purchasesGenerated} purchases generated
                    </p>
                  </div>
                  <Badge tone={c.performance === "underperforming" ? "warning" : c.performance === "top-performer" ? "good" : "neutral"}>
                    {c.performance.replace("-", " ")}
                  </Badge>
                </li>
              ))}
            </ul>
          )}
        </Card>

        <Card title="Social calendar">
          {posts.status === "loading" && <CardSkeleton lines={4} />}
          {posts.status === "error" && <ErrorState onRetry={posts.reload} />}
          {posts.status === "ready" && socialPosts.length === 0 && (
            <EmptyState
              icon="megaphone"
              title="No posts scheduled"
              description="Add a social account to start scheduling posts."
              action={
                <Link to="/integrations" className="card-link">
                  Add a social account
                </Link>
              }
            />
          )}
          {posts.status === "ready" && socialPosts.length > 0 && (
            <ul className="record-list">
              {socialPosts.map((p) => (
                <li key={p.id} className="record-row">
                  <div className="record-row__main">
                    <p className="record-row__title truncate">{p.caption}</p>
                    <p className="record-row__subtitle">
                      {formatDay(p.scheduledAt)}, {formatTime(p.scheduledAt)}
                    </p>
                  </div>
                  <div className="record-row__end">
                    <Icon name={p.platform} size={16} />
                    <Badge tone={STATUS_TONE[p.status]}>{p.status}</Badge>
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
