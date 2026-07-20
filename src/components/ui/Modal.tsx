import { useRef } from "react";
import type { ReactNode } from "react";
import { createPortal } from "react-dom";
import { useFocusTrap } from "../../hooks/useFocusTrap";
import { Icon } from "./Icon";
import "./modal.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  labelledById?: string;
  size?: "md" | "lg";
  hideHeader?: boolean;
}

export function Modal({ open, onClose, title, children, size = "md", hideHeader = false }: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  useFocusTrap(containerRef, open, onClose);

  if (!open) return null;

  return createPortal(
    <div className="ui-modal-overlay" onMouseDown={onClose}>
      <div
        className={`ui-modal ui-modal--${size}`}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        ref={containerRef}
        tabIndex={-1}
        onMouseDown={(e) => e.stopPropagation()}
      >
        {!hideHeader && (
          <div className="ui-modal__header">
            <h2 className="ui-modal__title">{title}</h2>
            <button className="ui-modal__close" onClick={onClose} aria-label="Close dialog">
              <Icon name="x" size={16} />
            </button>
          </div>
        )}
        {children}
      </div>
    </div>,
    document.body,
  );
}
