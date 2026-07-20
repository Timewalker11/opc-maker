import { useId, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Icon } from "../ui/Icon";
import { Popover } from "../ui/Popover";
import { useAuthStore } from "../../store/authStore";
import { useThemeStore } from "../../store/themeStore";

export function ProfileMenu() {
  const [open, setOpen] = useState(false);
  const labelId = useId();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const navigate = useNavigate();

  const initial = user?.name?.[0]?.toUpperCase() ?? "?";

  function handleLogout() {
    setOpen(false);
    logout();
    navigate("/login", { replace: true });
  }

  return (
    <div className="topbar__popover-anchor">
      <button
        className="topbar__profile-btn"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open user profile menu"
      >
        <span className="topbar__avatar" aria-hidden="true">{initial}</span>
      </button>
      <Popover open={open} onClose={() => setOpen(false)} labelledById={labelId}>
        <div className="menu-section">
          <p className="menu-heading" id={labelId}>{user?.name ?? "Account"}</p>
          <p className="menu-subtext truncate">{user?.email ?? ""}</p>
        </div>
        <div className="menu-list" role="none">
          <button
            className="menu-item"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              navigate("/settings");
            }}
          >
            <Icon name="settings" size={16} /> Business settings
          </button>
          <button
            className="menu-item"
            role="menuitem"
            onClick={() => {
              setOpen(false);
              toggleTheme();
            }}
          >
            <Icon name={theme === "dark" ? "sun" : "moon"} size={16} />
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </button>
        </div>
        <div className="menu-list" role="none">
          <button className="menu-item menu-item--danger" role="menuitem" onClick={handleLogout}>
            <Icon name="external-link" size={16} /> Log out
          </button>
        </div>
      </Popover>
    </div>
  );
}
