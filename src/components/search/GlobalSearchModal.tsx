import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { SearchCategory, SearchResult } from "../../types";
import { Modal } from "../ui/Modal";
import { Icon } from "../ui/Icon";
import type { IconName } from "../ui/Icon";
import { EmptyState } from "../ui/EmptyState";
import { searchAll } from "../../services/search";
import "./global-search.css";

const CATEGORY_META: Record<SearchCategory, { label: string; icon: IconName }> = {
  customers: { label: "Customers", icon: "users" },
  emails: { label: "Emails", icon: "mail" },
  tasks: { label: "Tasks", icon: "clipboard-check" },
  events: { label: "Calendar events", icon: "calendar" },
  files: { label: "Files", icon: "folder" },
  media: { label: "Media", icon: "image" },
  orders: { label: "Orders", icon: "dollar-sign" },
  invoices: { label: "Invoices", icon: "dollar-sign" },
  campaigns: { label: "Campaigns", icon: "megaphone" },
  notes: { label: "Notes", icon: "edit" },
  posts: { label: "Social posts", icon: "send" },
  integrations: { label: "Integrations", icon: "plug" },
};

const EXAMPLES = [
  "Find customers from TikTok",
  "Show overdue invoices",
  "Find emails that need a response",
  "Show campaigns that generated purchases",
];

interface GlobalSearchModalProps {
  open: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ open, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (open) {
      setQuery("");
      setResults([]);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    setLoading(true);
    const handle = setTimeout(() => {
      searchAll(query).then((r) => {
        setResults(r);
        setLoading(false);
      });
    }, 150);
    return () => clearTimeout(handle);
  }, [query]);

  function goTo(result: SearchResult) {
    navigate(result.href);
    onClose();
  }

  const grouped = results.reduce<Partial<Record<SearchCategory, SearchResult[]>>>((acc, r) => {
    (acc[r.category] ??= []).push(r);
    return acc;
  }, {});

  return (
    <Modal open={open} onClose={onClose} title="Search" size="lg" hideHeader>
      <div className="global-search">
        <div className="global-search__input-row">
          <Icon name="search" size={17} />
          <input
            ref={inputRef}
            className="global-search__input"
            placeholder="Search everything, or ask in plain language…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search across your business"
          />
          <button className="global-search__close" onClick={onClose} aria-label="Close search">
            <Icon name="x" size={16} />
          </button>
        </div>

        <div className="global-search__body thin-scroll">
          {!query.trim() && (
            <div className="global-search__examples">
              <p className="global-search__examples-heading">Try asking</p>
              {EXAMPLES.map((ex) => (
                <button key={ex} className="global-search__example" onClick={() => setQuery(ex)}>
                  <Icon name="sparkles" size={14} />
                  {ex}
                </button>
              ))}
            </div>
          )}

          {query.trim() && loading && <p className="global-search__status">Searching…</p>}

          {query.trim() && !loading && results.length === 0 && (
            <EmptyState icon="search" title="No matches" description={`Nothing found for "${query}".`} compact />
          )}

          {query.trim() &&
            !loading &&
            (Object.keys(grouped) as SearchCategory[]).map((category) => (
              <div key={category} className="global-search__group">
                <p className="global-search__group-heading">
                  <Icon name={CATEGORY_META[category].icon} size={13} />
                  {CATEGORY_META[category].label}
                </p>
                {grouped[category]!.map((r) => (
                  <button key={r.id} className="global-search__result" onClick={() => goTo(r)}>
                    <span className="global-search__result-title truncate">{r.title}</span>
                    <span className="global-search__result-meta truncate">{r.meta}</span>
                  </button>
                ))}
              </div>
            ))}
        </div>
      </div>
    </Modal>
  );
}
