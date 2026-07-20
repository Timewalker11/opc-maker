import { useState } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent } from "@dnd-kit/core";
import { SortableContext, sortableKeyboardCoordinates, rectSortingStrategy } from "@dnd-kit/sortable";
import type { DashboardCardId } from "../../types";
import { Button } from "../ui/Button";
import { Icon } from "../ui/Icon";
import { Popover } from "../ui/Popover";
import { useDashboardLayoutStore } from "../../store/dashboardLayoutStore";
import { CARD_REGISTRY } from "./cardRegistry";
import { SortableCardTile } from "./SortableCardTile";
import { EmptyState } from "../ui/EmptyState";
import "./dashboard-grid.css";

export function DashboardGrid() {
  const cards = useDashboardLayoutStore((s) => s.cards);
  const customizing = useDashboardLayoutStore((s) => s.customizing);
  const setCustomizing = useDashboardLayoutStore((s) => s.setCustomizing);
  const reorder = useDashboardLayoutStore((s) => s.reorder);
  const toggleVisible = useDashboardLayoutStore((s) => s.toggleVisible);
  const restoreDefaults = useDashboardLayoutStore((s) => s.restoreDefaults);
  const [addMenuOpen, setAddMenuOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const visibleCards = cards.filter((c) => c.visible);
  const hiddenCards = cards.filter((c) => !c.visible);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      reorder(active.id as DashboardCardId, over.id as DashboardCardId);
    }
  }

  return (
    <section aria-label="Dashboard overview cards">
      <div className="dashboard-toolbar">
        <h2 className="dashboard-toolbar__title">Overview</h2>
        <div className="dashboard-toolbar__actions">
          {customizing && (
            <div className="topbar__popover-anchor">
              <Button size="sm" variant="secondary" icon={<Icon name="plus" size={14} />} onClick={() => setAddMenuOpen((v) => !v)} disabled={hiddenCards.length === 0}>
                Add card
              </Button>
              <Popover open={addMenuOpen} onClose={() => setAddMenuOpen(false)} role="menu">
                {hiddenCards.length === 0 ? (
                  <p className="dashboard-toolbar__empty-menu">All cards are visible</p>
                ) : (
                  <div className="menu-list">
                    {hiddenCards.map((c) => (
                      <button
                        key={c.id}
                        className="menu-item"
                        onClick={() => {
                          toggleVisible(c.id);
                          setAddMenuOpen(false);
                        }}
                      >
                        <Icon name={CARD_REGISTRY[c.id].icon} size={15} />
                        {CARD_REGISTRY[c.id].label}
                      </button>
                    ))}
                  </div>
                )}
              </Popover>
            </div>
          )}
          {customizing && (
            <Button size="sm" variant="ghost" onClick={restoreDefaults}>
              Restore default layout
            </Button>
          )}
          <Button size="sm" variant={customizing ? "primary" : "secondary"} onClick={() => setCustomizing(!customizing)}>
            {customizing ? "Done" : "Customize dashboard"}
          </Button>
        </div>
      </div>

      {customizing && (
        <p className="dashboard-toolbar__hint">Drag cards to reorder, resize with S/M/L, or remove with the × button.</p>
      )}

      {visibleCards.length === 0 ? (
        <EmptyState
          icon="layout"
          title="No cards on your dashboard"
          description="Use “Add card” above to bring one back."
        />
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={visibleCards.map((c) => c.id)} strategy={rectSortingStrategy}>
            <div className="dashboard-grid">
              {visibleCards.map((c) => (
                <SortableCardTile key={c.id} id={c.id} size={c.size} customizing={customizing} />
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </section>
  );
}
