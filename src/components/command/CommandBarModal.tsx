import { useEffect, useRef, useState } from "react";
import { Modal } from "../ui/Modal";
import { Icon } from "../ui/Icon";
import { suggestedCommands, recentCommands as seedRecentCommands } from "../../mock/commands";
import { useAgentStore } from "../../store/agentStore";
import { useUIStore } from "../../store/uiStore";
import { useCommandHistoryStore } from "../../store/commandHistoryStore";
import "./command-bar.css";

interface CommandBarModalProps {
  open: boolean;
  onClose: () => void;
}

export function CommandBarModal({ open, onClose }: CommandBarModalProps) {
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const sendMessage = useAgentStore((s) => s.sendMessage);
  const setAgentPanelOpen = useUIStore((s) => s.setAgentPanelOpen);
  const recent = useCommandHistoryStore((s) => s.recent);
  const record = useCommandHistoryStore((s) => s.record);

  useEffect(() => {
    if (open) {
      setValue("");
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  function submit(text: string) {
    const trimmed = text.trim();
    if (!trimmed) return;
    record(trimmed);
    sendMessage(trimmed);
    setAgentPanelOpen(true);
    onClose();
  }

  const recentToShow = recent.length > 0 ? recent : seedRecentCommands.map((c) => c.label);

  return (
    <Modal open={open} onClose={onClose} title="Ask the dashboard agent" size="lg" hideHeader>
      <div className="command-bar">
        <form
          className="command-bar__input-row"
          onSubmit={(e) => {
            e.preventDefault();
            submit(value);
          }}
        >
          <Icon name="sparkles" size={17} />
          <input
            ref={inputRef}
            className="command-bar__input"
            placeholder="Summarize my business today, draft replies to urgent emails…"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            aria-label="Command for the dashboard agent"
          />
          <button className="command-bar__close" type="button" onClick={onClose} aria-label="Close command bar">
            <Icon name="x" size={16} />
          </button>
        </form>

        <div className="command-bar__body thin-scroll">
          <div className="command-bar__section">
            <p className="command-bar__heading">Suggested</p>
            {suggestedCommands.map((c) => (
              <button key={c.id} className="command-bar__item" onClick={() => submit(c.label)}>
                <Icon name="sparkles" size={14} />
                {c.label}
              </button>
            ))}
          </div>
          <div className="command-bar__section">
            <p className="command-bar__heading">Recent</p>
            {recentToShow.map((label, i) => (
              <button key={`${label}_${i}`} className="command-bar__item" onClick={() => submit(label)}>
                <Icon name="clock" size={14} />
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
