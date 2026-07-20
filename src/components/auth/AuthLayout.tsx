import type { ReactNode } from "react";
import { Icon } from "../ui/Icon";
import "./auth-layout.css";

interface AuthLayoutProps {
  title: string;
  description?: string;
  children: ReactNode;
  width?: "sm" | "md";
}

export function AuthLayout({ title, description, children, width = "sm" }: AuthLayoutProps) {
  return (
    <div className="auth-layout">
      <div className={`auth-layout__card auth-layout__card--${width}`}>
        <div className="auth-layout__brand">
          <span className="auth-layout__mark" aria-hidden="true">
            <Icon name="layout" size={18} />
          </span>
        </div>
        <h1 className="auth-layout__title">{title}</h1>
        {description && <p className="auth-layout__description">{description}</p>}
        {children}
      </div>
    </div>
  );
}
