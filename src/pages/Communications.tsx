import { Link } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { CardSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { useDashboardData } from "../hooks/useDashboardData";
import { fetchEmails } from "../services/emails";
import { formatRelativeTime } from "../utils/format";

export function Communications() {
  const { status, data, reload } = useDashboardData(fetchEmails);
  const emails = data ?? [];

  return (
    <div>
      <PageHeader title="Communications" description="Your unified inbox across connected email accounts." />
      <Card title="Inbox">
        {status === "loading" && <CardSkeleton lines={5} />}
        {status === "error" && <ErrorState onRetry={reload} description="We couldn't load your inbox." />}
        {status === "ready" && emails.length === 0 && (
          <EmptyState
            icon="mail"
            title="No emails yet"
            description="Connect Gmail or Outlook to see customer conversations here."
            action={
              <Link to="/integrations" className="card-link">
                Connect email
              </Link>
            }
          />
        )}
        {status === "ready" && emails.length > 0 && (
          <ul className="record-list">
            {emails.map((e) => (
              <li key={e.id} className="record-row">
                <div className="record-row__main">
                  <p className="record-row__title">
                    {e.senderName} <span className="record-row__title-secondary">· {e.subject}</span>
                  </p>
                  <p className="record-row__subtitle">{e.preview}</p>
                  <div className="tag-row">
                    {e.unread && <Badge tone="accent">Unread</Badge>}
                    {e.urgent && <Badge tone="critical">Urgent</Badge>}
                    {e.needsResponse && <Badge tone="warning">Needs response</Badge>}
                  </div>
                </div>
                <div className="record-row__end">
                  <span className="record-row__subtitle">{formatRelativeTime(e.receivedAt)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
