import { useState } from "react";
import type { Priority, Recommendation } from "../../types";
import { Badge } from "../ui/Badge";
import type { BadgeTone } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import "./recommendation-card.css";

const PRIORITY_TONE: Record<Priority, BadgeTone> = {
  high: "critical",
  medium: "warning",
  low: "neutral",
};

const SENSITIVE_LABEL: Record<NonNullable<Recommendation["sensitiveAction"]>, string> = {
  "send-email": "Sending an email",
  "publish-post": "Publishing a post",
  "charge-customer": "Charging a customer",
  "delete-file": "Deleting a file",
  "modify-payment": "Modifying a payment",
  "contact-customer": "Contacting a customer",
};

interface RecommendationCardProps {
  recommendation: Recommendation;
  onApprove: (id: string) => Promise<void>;
  onDismiss: (id: string) => void;
  onEdit: (id: string, suggestedAction: string) => void;
}

export function RecommendationCard({ recommendation, onApprove, onDismiss, onEdit }: RecommendationCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(recommendation.suggestedAction);
  const [approving, setApproving] = useState(false);

  async function handleApprove() {
    setApproving(true);
    await onApprove(recommendation.id);
    setApproving(false);
  }

  function saveEdit() {
    onEdit(recommendation.id, draft);
    setEditing(false);
  }

  return (
    <div className="recommendation-card">
      <div className="recommendation-card__head">
        <p className="recommendation-card__title">{recommendation.title}</p>
        <Badge tone={PRIORITY_TONE[recommendation.priority]}>{recommendation.priority} priority</Badge>
      </div>
      <p className="recommendation-card__explanation">{recommendation.explanation}</p>
      <p className="recommendation-card__benefit">
        <Icon name="sparkles" size={12} /> {recommendation.benefit}
      </p>

      {editing ? (
        <textarea
          className="recommendation-card__edit-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={2}
          aria-label="Edit suggested action"
        />
      ) : (
        <p className="recommendation-card__action">{recommendation.suggestedAction}</p>
      )}

      {recommendation.sensitiveAction && (
        <p className="recommendation-card__sensitive">
          <Icon name="shield" size={12} />
          {SENSITIVE_LABEL[recommendation.sensitiveAction]} requires your approval -- nothing sends automatically.
        </p>
      )}

      <div className="recommendation-card__buttons">
        {editing ? (
          <>
            <Button size="sm" variant="primary" onClick={saveEdit}>
              Save
            </Button>
            <Button size="sm" variant="ghost" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </>
        ) : (
          <>
            <Button size="sm" variant="primary" onClick={handleApprove} disabled={approving}>
              {approving ? "Approving…" : "Approve"}
            </Button>
            <Button size="sm" variant="secondary" onClick={() => setEditing(true)} icon={<Icon name="edit" size={13} />}>
              Edit
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onDismiss(recommendation.id)}>
              Dismiss
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
