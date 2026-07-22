import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { PageHeader } from "../components/layout/PageHeader";
import { Card } from "../components/ui/Card";
import { Badge } from "../components/ui/Badge";
import { Button } from "../components/ui/Button";
import { CardSkeleton } from "../components/ui/Skeleton";
import { ErrorState } from "../components/ui/ErrorState";
import { EmptyState } from "../components/ui/EmptyState";
import { useDashboardData } from "../hooks/useDashboardData";
import { fetchIntegrations, connectIntegration, disconnectIntegration } from "../services/integrationsApi";
import { ApiError } from "../services/apiClient";
import { formatRelativeTime } from "../utils/format";
import { useOnboardingWizardStore } from "../store/onboardingWizardStore";

// Maps onboarding "which tools do you already use" answers to the provider ids in the
// registry, so the app can point back at the tool the owner already told us they use.
const TOOL_TO_PROVIDER: Record<string, string> = {
  shopify: "shopify",
  gmail: "google",
  "google-calendar": "google",
};

export function Integrations() {
  const { status, data, reload } = useDashboardData(fetchIntegrations);
  const tools = useOnboardingWizardStore((s) => s.answers.tools);
  const recommendedProviderIds = new Set(tools.map((t) => TOOL_TO_PROVIDER[t]).filter(Boolean));
  const integrations = [...(data?.integrations ?? [])].sort((a, b) => {
    const aRec = recommendedProviderIds.has(a.id) ? 1 : 0;
    const bRec = recommendedProviderIds.has(b.id) ? 1 : 0;
    return bRec - aRec;
  });
  const [busyId, setBusyId] = useState<string | null>(null);
  const [rowError, setRowError] = useState<{ id: string; message: string } | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const connectedBanner = searchParams.get("connected");
  const errorBanner = searchParams.get("error");

  useEffect(() => {
    if (connectedBanner || errorBanner) {
      reload();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function dismissBanner() {
    setSearchParams({}, { replace: true });
  }

  async function handleConnect(providerId: string) {
    setBusyId(providerId);
    setRowError(null);
    try {
      const { url } = await connectIntegration(providerId);
      window.location.href = url;
    } catch (err) {
      setRowError({ id: providerId, message: err instanceof ApiError ? err.message : "Couldn't start the connection." });
      setBusyId(null);
    }
  }

  async function handleDisconnect(providerId: string) {
    setBusyId(providerId);
    setRowError(null);
    try {
      await disconnectIntegration(providerId);
      reload();
    } catch (err) {
      setRowError({ id: providerId, message: err instanceof ApiError ? err.message : "Couldn't disconnect." });
    } finally {
      setBusyId(null);
    }
  }

  return (
    <div>
      <PageHeader title="Integrations" description="The apps connected to your business operating system." />

      {connectedBanner && (
        <div className="inline-banner inline-banner--good">
          <Badge tone="good">Connected</Badge>
          <span>{connectedBanner} is now connected.</span>
          <button onClick={dismissBanner} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}
      {errorBanner && (
        <div className="inline-banner inline-banner--critical">
          <Badge tone="critical">Failed</Badge>
          <span>Couldn't connect: {errorBanner.replace(/_/g, " ")}.</span>
          <button onClick={dismissBanner} aria-label="Dismiss">
            ×
          </button>
        </div>
      )}

      <Card title="Connected apps">
        {status === "loading" && <CardSkeleton lines={5} />}
        {status === "error" && <ErrorState onRetry={reload} description="Couldn't reach the server. Is the backend running?" />}
        {status === "ready" && integrations.length === 0 && (
          <EmptyState icon="plug" title="No integrations registered" description="No providers are set up on the server yet." />
        )}
        {status === "ready" && integrations.length > 0 && (
          <ul className="record-list">
            {integrations.map((i) => (
              <li key={i.id} className="record-row">
                <div className="record-row__main">
                  <p className="record-row__title">{i.name}</p>
                  <p className="record-row__subtitle">
                    {i.category}
                    {i.connected && i.connectedAt ? ` · Connected ${formatRelativeTime(i.connectedAt)}` : ""}
                    {!i.configured ? " · Not configured on the server" : ""}
                  </p>
                  {rowError?.id === i.id && <p className="record-row__subtitle record-row__subtitle--error">{rowError.message}</p>}
                </div>
                <div className="record-row__end">
                  {!i.connected && recommendedProviderIds.has(i.id) && <Badge tone="accent">Recommended for you</Badge>}
                  <Badge tone={i.connected ? "good" : i.configured ? "neutral" : "warning"}>
                    {i.connected ? "connected" : i.configured ? "not connected" : "unconfigured"}
                  </Badge>
                  {i.connected ? (
                    <Button size="sm" variant="secondary" onClick={() => handleDisconnect(i.id)} disabled={busyId === i.id}>
                      {busyId === i.id ? "Disconnecting…" : "Disconnect"}
                    </Button>
                  ) : (
                    <Button size="sm" variant="secondary" onClick={() => handleConnect(i.id)} disabled={busyId === i.id || !i.configured}>
                      {busyId === i.id ? "Connecting…" : "Connect"}
                    </Button>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>
    </div>
  );
}
