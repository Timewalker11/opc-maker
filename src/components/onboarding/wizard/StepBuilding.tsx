import { useEffect, useState } from "react";
import { Icon } from "../../ui/Icon";
import { Button } from "../../ui/Button";

const BUILD_ITEMS = [
  "Learning about your business",
  "Creating your dashboard",
  "Preparing customer workspace",
  "Configuring AI agents",
  "Organizing navigation",
  "Recommending integrations",
  "Preparing analytics",
  "Personalizing your homepage",
];

const STEP_DELAY_MS = 420;

interface StepBuildingProps {
  onFinish: () => void;
}

export function StepBuilding({ onFinish }: StepBuildingProps) {
  const [doneCount, setDoneCount] = useState(0);
  const allDone = doneCount >= BUILD_ITEMS.length;

  useEffect(() => {
    if (allDone) return;
    const timer = setTimeout(() => setDoneCount((c) => c + 1), STEP_DELAY_MS);
    return () => clearTimeout(timer);
  }, [doneCount, allDone]);

  return (
    <div className="wizard-building">
      <h2 className="wizard-building__title">{allDone ? "Your workspace is ready." : "Building your workspace…"}</h2>

      <ul className="wizard-building__list">
        {BUILD_ITEMS.map((label, i) => {
          const isDone = i < doneCount;
          const isCurrent = i === doneCount;
          return (
            <li
              key={label}
              className={`wizard-building__item ${i <= doneCount ? "wizard-building__item--visible" : ""} ${isDone ? "wizard-building__item--done" : ""}`}
            >
              <span className="wizard-building__item-check">
                {isDone && <Icon name="check" size={13} />}
                {isCurrent && !allDone && <span className="wizard-building__spinner" aria-hidden="true" />}
              </span>
              <span className="wizard-building__item-label">{label}</span>
            </li>
          );
        })}
      </ul>

      {allDone && (
        <div className="wizard-building__ready">
          <span className="wizard-building__ready-icon" aria-hidden="true">
            <Icon name="rocket" size={26} />
          </span>
          <Button variant="primary" onClick={onFinish}>
            Enter Dashboard
          </Button>
        </div>
      )}
    </div>
  );
}
