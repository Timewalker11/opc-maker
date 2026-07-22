import { useState } from "react";
import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import { CardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { Modal } from "../ui/Modal";
import { ClickableRegion } from "../ui/ClickableRegion";
import { useDashboardData } from "../../hooks/useDashboardData";
import { fetchEmails } from "../../services/emails";
import { formatRelativeTime } from "../../utils/format";
import { needsAttention, sortByPriority } from "../../utils/emailPriority";
import "./emails-card.css";
import "./card-detail.css";

export function EmailsCard() {
  const { status, data, reload, error } = useDashboardData(fetchEmails);
  const allEmails = data?.emails ?? [];
  const connected = data?.connected ?? false;
  const relevant = sortByPriority(allEmails.filter(needsAttention));
  const urgentCount = relevant.filter((e) => e.urgent).length;
  const topThree = relevant.slice(0, 3);
  const [detailsOpen, setDetailsOpen] = useState(false);

  return (
    <Card
      title="Needs attention"
      icon={<Icon name="mail" size={16} />}
      headerAction={
        <Link to="/communications" className="card-link">
          Open inbox <Icon name="chevron-right" size={13} />
        </Link>
      }
    >
      {status === "loading" && <CardSkeleton lines={3} />}
      {status === "error" && <ErrorState compact onRetry={reload} description={error} />}
      {status === "ready" && relevant.length === 0 && (
        <EmptyState
          icon="mail"
          title={connected ? (allEmails.length === 0 ? "Inbox zero" : "All caught up") : "No emails yet"}
          description={
            connected
              ? allEmails.length === 0
                ? "Nothing in your connected inbox right now."
                : "Everything in your inbox is read and doesn't need a response."
              : "Connect Gmail to view and reply to customer conversations here."
          }
          compact
          action={
            connected ? undefined : (
              <Link to="/settings#integrations" className="card-link">
                Connect Gmail <Icon name="arrow-up-right" size={12} />
              </Link>
            )
          }
        />
      )}
      {status === "ready" && relevant.length > 0 && (
        <ClickableRegion onClick={() => setDetailsOpen(true)} ariaLabel="View all emails needing attention">
          <div className="emails-card">
            <div className="emails-card__counts">
              <span>
                <strong>{relevant.length}</strong> need attention
              </span>
              {urgentCount > 0 && <Badge tone="critical">{urgentCount} urgent</Badge>}
            </div>
            <ul className="emails-card__list">
              {topThree.map((e) => (
                <li key={e.id} className="emails-card__item">
                  <div className="emails-card__item-top">
                    <span className="emails-card__sender truncate">{e.senderName}</span>
                    <span className="emails-card__time">{formatRelativeTime(e.receivedAt)}</span>
                  </div>
                  <p className="emails-card__subject truncate">{e.subject}</p>
                  <div className="tag-row">
                    {e.urgent && <Badge tone="critical">Urgent</Badge>}
                    {!e.urgent && e.businessRelated && <Badge tone="serious">Business</Badge>}
                    {e.needsResponse && <Badge tone="warning">Needs response</Badge>}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </ClickableRegion>
      )}
      <Modal open={detailsOpen} onClose={() => setDetailsOpen(false)} title="Emails needing attention">
        <div className="card-detail">
          {relevant.length === 0 && <p className="card-detail__empty">Nothing needs attention right now.</p>}
          {relevant.length > 0 && (
            <ul className="card-detail__list">
              {relevant.map((e) => (
                <li key={e.id} className="card-detail__row">
                  <div className="card-detail__row-body">
                    <p className="card-detail__row-title">
                      {e.senderName} &middot; <span className="truncate">{e.subject}</span>
                    </p>
                    <p className="card-detail__row-meta">{e.preview}</p>
                    <div className="tag-row">
                      {e.urgent && <Badge tone="critical">Urgent</Badge>}
                      {!e.urgent && e.businessRelated && <Badge tone="serious">Business</Badge>}
                      {e.needsResponse && <Badge tone="warning">Needs response</Badge>}
                    </div>
                  </div>
                  <span className="card-detail__row-meta">{formatRelativeTime(e.receivedAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Modal>
    </Card>
  );
}
