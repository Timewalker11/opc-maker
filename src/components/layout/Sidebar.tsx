import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { useUIStore } from "../../store/uiStore";
import { useBusinessProfileStore } from "../../store/businessProfileStore";
import { navItems } from "./navItems";
import "./sidebar.css";

export function Sidebar() {
  const collapsed = useUIStore((s) => s.sidebarCollapsed);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const mobileNavOpen = useUIStore((s) => s.mobileNavOpen);
  const setMobileNavOpen = useUIStore((s) => s.setMobileNavOpen);
  const companyName = useBusinessProfileStore((s) => s.profile?.companyName) ?? "Your Business";

  useEffect(() => {
    if (!mobileNavOpen) return;
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") setMobileNavOpen(false);
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [mobileNavOpen, setMobileNavOpen]);

  return (
    <>
      {mobileNavOpen && <div className="sidebar-backdrop" onClick={() => setMobileNavOpen(false)} />}
      <aside
        id="primary-sidebar"
        className={`sidebar ${collapsed ? "sidebar--collapsed" : ""} ${mobileNavOpen ? "sidebar--mobile-open" : ""}`}
      >
        <div className="sidebar__brand">
          <span className="sidebar__logo-mark" aria-hidden="true">{companyName[0]?.toUpperCase()}</span>
          {!collapsed && <span className="sidebar__logo-text truncate">{companyName}</span>}
        </div>

        <nav className="sidebar__nav" aria-label="Primary">
          <ul>
            {navItems.map((item) => (
              <li key={item.path}>
                <NavLink
                  to={item.path}
                  end={item.path === "/"}
                  className={({ isActive }) => `sidebar__link ${isActive ? "sidebar__link--active" : ""}`}
                  onClick={() => setMobileNavOpen(false)}
                  title={collapsed ? item.label : undefined}
                >
                  <Icon name={item.icon} size={19} />
                  {!collapsed && <span>{item.label}</span>}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <button
          className="sidebar__collapse-btn"
          onClick={toggleSidebar}
          aria-pressed={collapsed}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          <Icon name={collapsed ? "chevron-right" : "chevron-left"} size={16} />
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>
    </>
  );
}
