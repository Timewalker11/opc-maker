import { Link } from "react-router-dom";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { Badge } from "../ui/Badge";
import { CardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { useDashboardData } from "../../hooks/useDashboardData";
import { fetchEmails } from "../../services/emails";
import { formatRelativeTime } from "../../utils/format";
import "./emails-card.css";

export function EmailsCard() {
  const { status, data, reload } = useDashboardData(fetchEmails);
  const unread = (data ?? []).filter((e) => e.unread);
  const urgent = unread.filter((e) => e.urgent);
  const topThree = [...unread]
    .sort((a, b) => Number(b.urgent) - Number(a.urgent) || b.receivedAt.localeCompare(a.receivedAt))
    .slice(0, 3);

  return (
    <Card
      title="Unread emails"
      icon={<Icon name="mail" size={16} />}
      headerAction={
        <Link to="/communications" className="card-link">
          Open inbox <Icon name="chevron-right" size={13} />
        </Link>
      }
    >
      {status === "loading" && <CardSkeleton lines={3} />}
      {status === "error" && <ErrorState compact onRetry={reload} />}
      {status === "ready" && (!data || data.length === 0) && (
        <EmptyState
          icon="mail"
          title="No emails yet"
          description="Connect Gmail to view and reply to customer conversations here."
          compact
          action={
            <Link to="/integrations" className="card-link">
              Connect Gmail <Icon name="arrow-up-right" size={12} />
            </Link>
          }
        />
      )}
      {status === "ready" && data && data.length > 0 && (
        <div className="emails-card">
          <div className="emails-card__counts">
            <span>
              <strong>{unread.length}</strong> unread
            </span>
            {urgent.length > 0 && <Badge tone="critical">{urgent.length} urgent</Badge>}
          </div>
          {topThree.length === 0 ? (
            <p className="emails-card__none">Inbox zero -- nothing unread.</p>
          ) : (
            <ul className="emails-card__list">
              {topThree.map((e) => (
                <li key={e.id} className="emails-card__item">
                  <div className="emails-card__item-top">
                    <span className="emails-card__sender truncate">{e.senderName}</span>
                    <span className="emails-card__time">{formatRelativeTime(e.receivedAt)}</span>
                  </div>
                  <p className="emails-card__subject truncate">{e.subject}</p>
                  {e.urgent && <Badge tone="critical">Urgent</Badge>}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </Card>
  );
}
