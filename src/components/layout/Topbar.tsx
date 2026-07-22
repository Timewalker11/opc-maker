import { useMemo, useState } from "react";
import { Icon } from "../ui/Icon";
import { useUIStore } from "../../store/uiStore";
import { useNotificationsStore, selectUnreadCount } from "../../store/notificationsStore";
import { ProfileMenu } from "./ProfileMenu";
import { NotificationCenter } from "../notifications/NotificationCenter";
import { GlobalSearchModal } from "../search/GlobalSearchModal";
import "./topbar.css";

export function Topbar() {
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);
  const searchOpen = useUIStore((s) => s.searchOpen);
  const setSearchOpen = useUIStore((s) => s.setSearchOpen);
  const notificationsOpen = useUIStore((s) => s.notificationsOpen);
  const setNotificationsOpen = useUIStore((s) => s.setNotificationsOpen);
  const notificationItems = useNotificationsStore((s) => s.items);
  const unreadCount = useMemo(() => selectUnreadCount(notificationItems), [notificationItems]);
  const [notifLabelId] = useState("notification-center-heading");

  return (
    <header className="topbar">
      <button
        className="topbar__hamburger"
        onClick={() => setMobileNavOpen(true)}
        aria-label="Open navigation menu"
        aria-controls="primary-sidebar"
      >
        <Icon name="grip" size={18} />
      </button>

      <button className="topbar__search" onClick={() => setSearchOpen(true)} aria-haspopup="dialog">
        <Icon name="search" size={16} />
        <span className="topbar__search-label">Search customers, emails, invoices…</span>
        <kbd className="topbar__kbd">/</kbd>
      </button>

      <div className="topbar__actions">
        <div className="topbar__popover-anchor">
          <button
            className="topbar__icon-btn"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            aria-haspopup="dialog"
            aria-expanded={notificationsOpen}
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ""}`}
          >
            <Icon name="bell" size={18} />
            {unreadCount > 0 && <span className="topbar__badge">{unreadCount > 9 ? "9+" : unreadCount}</span>}
          </button>
          <NotificationCenter
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            labelledById={notifLabelId}
          />
        </div>
        <ProfileMenu />
      </div>

      <GlobalSearchModal open={searchOpen} onClose={() => setSearchOpen(false)} />
    </header>
  );
}
