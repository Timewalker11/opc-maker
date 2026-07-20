import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { CardSize, DashboardCardId } from "../../types";
import { Icon } from "../ui/Icon";
import { useDashboardLayoutStore } from "../../store/dashboardLayoutStore";
import { CARD_REGISTRY } from "./cardRegistry";

const SIZES: CardSize[] = ["sm", "md", "lg"];

interface SortableCardTileProps {
  id: DashboardCardId;
  size: CardSize;
  customizing: boolean;
}

export function SortableCardTile({ id, size, customizing }: SortableCardTileProps) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: !customizing });
  const setSize = useDashboardLayoutStore((s) => s.setSize);
  const toggleVisible = useDashboardLayoutStore((s) => s.toggleVisible);
  const { label, Component } = CARD_REGISTRY[id];

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`dashboard-grid__item dashboard-grid__item--${size} ${isDragging ? "dashboard-grid__item--dragging" : ""} ${customizing ? "dashboard-grid__item--customizing" : ""}`}
    >
      {customizing && (
        <div className="card-customize-bar">
          <button className="card-customize-bar__handle" {...attributes} {...listeners} aria-label={`Drag to reorder ${label}`}>
            <Icon name="grip" size={14} />
          </button>
          <div className="card-customize-bar__sizes" role="group" aria-label={`Resize ${label}`}>
            {SIZES.map((s) => (
              <button
                key={s}
                className={s === size ? "is-active" : ""}
                onClick={() => setSize(id, s)}
                aria-pressed={s === size}
                aria-label={`Set ${label} to ${s} size`}
              >
                {s.toUpperCase()}
              </button>
            ))}
          </div>
          <button className="card-customize-bar__remove" onClick={() => toggleVisible(id)} aria-label={`Remove ${label} card`}>
            <Icon name="x" size={14} />
          </button>
        </div>
      )}
      <div className="dashboard-grid__item-body">
        <Component />
      </div>
    </div>
  );
}
