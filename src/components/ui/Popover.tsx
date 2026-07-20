import { useRef } from "react";
import type { ReactNode } from "react";
import { useOutsideClick } from "../../hooks/useOutsideClick";
import "./popover.css";

interface PopoverProps {
  open: boolean;
  onClose: () => void;
  align?: "left" | "right";
  children: ReactNode;
  className?: string;
  labelledById?: string;
  role?: "menu" | "dialog" | "region";
}

export function Popover({
  open,
  onClose,
  align = "right",
  children,
  className = "",
  labelledById,
  role = "menu",
}: PopoverProps) {
  const ref = useRef<HTMLDivElement>(null);
  useOutsideClick(ref, open, onClose);

  if (!open) return null;

  return (
    <div
      ref={ref}
      className={`ui-popover ui-popover--${align} ${className}`}
      role={role}
      aria-labelledby={labelledById}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          e.stopPropagation();
          onClose();
        }
      }}
    >
      {children}
    </div>
  );
}
