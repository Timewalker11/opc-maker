import { useState } from "react";
import type { Integration, IntegrationStatus } from "../types";
import type { BadgeTone } from "../components/ui/Badge";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { CardSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { useDashboardData } from "../hooks/useDashboardData";
import { fetchIntegrations } from "../services/integrations";
import { reconnectIntegration } from "../services/actions";
import { formatRelativeTime } from "../utils/format";

const STATUS_TONE: Record<IntegrationStatus, BadgeTone> = { connected: "good", disconnected: "neutral", error: "critical" };

export function Integrations() {
  const { status, data, reload } = useDashboardData(fetchIntegrations);
  const [reconnecting, setReconnecting] = useState<string | null>(null);
  const [localOverrides, setLocalOverrides] = useState<Record<string, IntegrationStatus>>({});
  const integrations = data ?? [];

  async function handleReconnect(integration: Integration) {
    setReconnecting(integration.id);
    const firstAttempt = !localOverrides[integration.id];
    const simulateFailureOnce = integration.id === "int_quickbooks" && firstAttempt;
    try {
      await reconnectIntegration(integration.id, simulateFailureOnce);
      setLocalOverrides((prev) => ({ ...prev, [integration.id]: "connected" }));
    } catch {
      setLocalOverrides((prev) => ({ ...prev, [integration.id]: "error" }));
    } finally {
      setReconnecting(null);
    }
  }

  return (
    <div>
      <PageHeader title="Integrations" description="The apps connected to your business operating system." />
      <Card title="Connected apps">
        {status === "loading" && <CardSkeleton lines={5} />}
        {status === "error" && <ErrorState onRetry={reload} />}
        {status === "ready" && integrations.length === 0 && (
          <EmptyState icon="plug" title="No integrations connected" description="Connect Shopify, Gmail, or your calendar to begin importing data." />
        )}
        {status === "ready" && integrations.length > 0 && (
          <ul className="record-list">
            {integrations.map((i) => {
              const currentStatus = localOverrides[i.id] ?? i.status;
              return (
                <li key={i.id} className="record-row">
                  <div className="record-row__main">
                    <p className="record-row__title">{i.name}</p>
                    <p className="record-row__subtitle">
                      {i.category} · {i.lastSyncedAt ? `Synced ${formatRelativeTime(i.lastSyncedAt)}` : "Never synced"}
                    </p>
                  </div>
                  <div className="record-row__end">
                    <Badge tone={STATUS_TONE[currentStatus]}>{currentStatus}</Badge>
                    {currentStatus !== "connected" && (
                      <Button size="sm" variant="secondary" onClick={() => handleReconnect(i)} disabled={reconnecting === i.id}>
                        {reconnecting === i.id ? "Connecting…" : currentStatus === "error" ? "Reconnect" : "Connect"}
                      </Button>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </Card>
    </div>
  );
}
