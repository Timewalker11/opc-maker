import { useEffect } from "react";
import { Link } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { CardSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { useCustomersStore } from "../store/customersStore";
import { formatCurrency } from "../utils/format";

export function Customers() {
  const status = useCustomersStore((s) => s.status);
  const customers = useCustomersStore((s) => s.items);
  const load = useCustomersStore((s) => s.load);

  useEffect(() => {
    if (status === "idle") load();
  }, [status, load]);

  return (
    <div>
      <PageHeader title="Customers" description="Everyone who has bought from or contacted your business." />
      <Card title={`${customers.length} customers`}>
        {status === "loading" && <CardSkeleton lines={5} />}
        {status === "error" && <ErrorState onRetry={load} description="We couldn't load your customers." />}
        {status === "ready" && customers.length === 0 && (
          <EmptyState
            icon="users"
            title="No customers yet"
            description="Connect a store or import a spreadsheet to bring in your existing customers."
            action={
              <Link to="/settings#integrations" className="card-link">
                Connect a store
              </Link>
            }
          />
        )}
        {status === "ready" && customers.length > 0 && (
          <ul className="record-list">
            {customers.map((c) => (
              <li key={c.id} className="record-row">
                <div className="record-row__main">
                  <p className="record-row__title">{c.name}</p>
                  <p className="record-row__subtitle">
                    {c.email} · via {c.source}
                  </p>
                  <div className="tag-row">
                    {c.tags.map((tag) => (
                      <Badge key={tag} tone="neutral">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <div className="record-row__end">
                  <span className="record-row__amount">{formatCurrency(c.lifetimeValue)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
