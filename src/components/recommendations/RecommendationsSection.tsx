import { useEffect } from "react";
import { Card } from "../ui/Card";
import { Icon } from "../ui/Icon";
import { CardSkeleton } from "../ui/Skeleton";
import { ErrorState } from "../ui/ErrorState";
import { EmptyState } from "../ui/EmptyState";
import { useRecommendationsStore } from "../../store/recommendationsStore";
import { useDashboardPanelsStore } from "../../store/dashboardPanelsStore";
import { RecommendationCard } from "./RecommendationCard";
import "./recommendations-section.css";

export function RecommendationsSection() {
  const status = useRecommendationsStore((s) => s.status);
  const items = useRecommendationsStore((s) => s.items);
  const load = useRecommendationsStore((s) => s.load);
  const approve = useRecommendationsStore((s) => s.approve);
  const dismiss = useRecommendationsStore((s) => s.dismiss);
  const edit = useRecommendationsStore((s) => s.edit);
  const collapsed = useDashboardPanelsStore((s) => s.recommendationsCollapsed);
  const toggleCollapsed = useDashboardPanelsStore((s) => s.toggleRecommendations);

  useEffect(() => {
    if (status === "idle") load();
  }, [status, load]);

  const pending = items.filter((r) => r.status === "pending");

  return (
    <Card
      title="Recommended actions"
      subtitle="Generated from your current data"
      icon={<Icon name="sparkles" size={16} />}
      headerAction={
        <button
          className="ui-card__collapse-btn"
          onClick={toggleCollapsed}
          aria-label={collapsed ? "Expand recommended actions" : "Collapse recommended actions"}
          aria-expanded={!collapsed}
        >
          <Icon name={collapsed ? "chevron-down" : "chevron-up"} size={15} />
        </button>
      }
    >
      {!collapsed && (
        <>
          {status === "loading" && (
            <div className="recommendations-section__skeletons">
              <CardSkeleton lines={2} />
              <CardSkeleton lines={2} />
            </div>
          )}
          {status === "error" && <ErrorState onRetry={load} description="We couldn't load recommendations." />}
          {status === "ready" && pending.length === 0 && (
            <EmptyState icon="sparkles" title="You're all caught up" description="New recommendations will appear here as they come up." />
          )}
          {status === "ready" && pending.length > 0 && (
            <div className="recommendations-section">
              {pending.map((rec) => (
                <RecommendationCard key={rec.id} recommendation={rec} onApprove={approve} onDismiss={dismiss} onEdit={edit} />
              ))}
            </div>
          )}
        </>
      )}
    </Card>
  );
}
