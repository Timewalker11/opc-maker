import type { SVGProps } from "react";

export type IconName =
  | "home"
  | "users"
  | "message"
  | "megaphone"
  | "briefcase"
  | "folder"
  | "bar-chart"
  | "plug"
  | "bot"
  | "settings"
  | "search"
  | "sparkles"
  | "bell"
  | "chevron-down"
  | "chevron-up"
  | "chevron-left"
  | "chevron-right"
  | "x"
  | "check"
  | "plus"
  | "minus"
  | "grip"
  | "external-link"
  | "calendar"
  | "clock"
  | "alert-triangle"
  | "alert-circle"
  | "shield"
  | "upload"
  | "trash"
  | "edit"
  | "undo"
  | "more-horizontal"
  | "filter"
  | "arrow-up-right"
  | "arrow-down-right"
  | "dollar-sign"
  | "send"
  | "loader"
  | "mail"
  | "database"
  | "image"
  | "layout"
  | "link"
  | "instagram"
  | "facebook"
  | "linkedin"
  | "tiktok"
  | "inbox"
  | "clipboard-check"
  | "user-circle"
  | "moon"
  | "sun";

const paths: Record<IconName, React.ReactNode> = {
  home: <path d="M4 11.5 12 4l8 7.5M6 9.5V20h5v-6h2v6h5V9.5" />,
  users: (
    <>
      <circle cx="9" cy="8" r="3" />
      <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
      <circle cx="17" cy="8" r="2.4" />
      <path d="M15.5 14.2c2.5.4 4.5 2.7 4.5 5.8" />
    </>
  ),
  message: <path d="M4 5h16v11H8l-4 4V5Z" />,
  megaphone: (
    <>
      <path d="M3 10v4h3l5 4V6L6 10H3Z" />
      <path d="M14 9a4 4 0 0 1 0 6" />
      <path d="M17 6a8 8 0 0 1 0 12" />
    </>
  ),
  briefcase: (
    <>
      <rect x="3" y="8" width="18" height="12" rx="2" />
      <path d="M8 8V6a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
    </>
  ),
  folder: <path d="M3 6h6l2 2h10v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V6Z" />,
  "bar-chart": (
    <>
      <path d="M4 20V10" />
      <path d="M12 20V4" />
      <path d="M20 20v-7" />
    </>
  ),
  plug: (
    <>
      <path d="M9 3v5M15 3v5" />
      <path d="M6 8h12v3a6 6 0 0 1-12 0V8Z" />
      <path d="M12 17v4" />
    </>
  ),
  bot: (
    <>
      <rect x="4" y="8" width="16" height="11" rx="3" />
      <path d="M12 8V4" />
      <circle cx="12" cy="3" r="1.2" />
      <circle cx="9" cy="13" r="1.2" />
      <circle cx="15" cy="13" r="1.2" />
      <path d="M9 17h6" />
    </>
  ),
  settings: (
    <>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2M12 19v2M4.2 4.2l1.5 1.5M18.3 18.3l1.5 1.5M3 12h2M19 12h2M4.2 19.8l1.5-1.5M18.3 5.7l1.5-1.5" />
    </>
  ),
  search: (
    <>
      <circle cx="10.5" cy="10.5" r="6.5" />
      <path d="m20 20-4.3-4.3" />
    </>
  ),
  sparkles: (
    <>
      <path d="M11 3v3M11 15v3M3 9h3M15 9h3M6 6l1.5 1.5M14.5 6 16 4.5" />
      <path d="M11 6 9 9l-3 2 3 2 2 3 2-3 3-2-3-2-2-3Z" />
    </>
  ),
  bell: (
    <>
      <path d="M6 10a6 6 0 0 1 12 0v5l1.5 3h-15L6 15v-5Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </>
  ),
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-up": <path d="m6 15 6-6 6 6" />,
  "chevron-left": <path d="m15 6-6 6 6 6" />,
  "chevron-right": <path d="m9 6 6 6-6 6" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  check: <path d="m5 12 5 5 9-10" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  grip: (
    <>
      <circle cx="9" cy="6" r="1.3" />
      <circle cx="9" cy="12" r="1.3" />
      <circle cx="9" cy="18" r="1.3" />
      <circle cx="15" cy="6" r="1.3" />
      <circle cx="15" cy="12" r="1.3" />
      <circle cx="15" cy="18" r="1.3" />
    </>
  ),
  "external-link": (
    <>
      <path d="M9 6H5a1 1 0 0 0-1 1v12a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4" />
      <path d="M14 4h6v6M20 4 11 13" />
    </>
  ),
  calendar: (
    <>
      <rect x="3.5" y="5" width="17" height="15" rx="2" />
      <path d="M3.5 9.5h17M8 3v3M16 3v3" />
    </>
  ),
  clock: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </>
  ),
  "alert-triangle": (
    <>
      <path d="M12 4 2.5 20h19L12 4Z" />
      <path d="M12 10.5v4M12 17.2v.1" />
    </>
  ),
  "alert-circle": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 8v4.5M12 16v.1" />
    </>
  ),
  shield: <path d="M12 3.5 19 6v6c0 4.5-3 7.5-7 8.5-4-1-7-4-7-8.5V6l7-2.5Z" />,
  upload: (
    <>
      <path d="M12 15V4M8 8l4-4 4 4" />
      <path d="M4 15v4a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-4" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" />
      <path d="M6 7l1 13a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1l1-13" />
    </>
  ),
  edit: (
    <>
      <path d="M4 20h4L18 10l-4-4L4 16v4Z" />
      <path d="m13.5 5.5 4 4" />
    </>
  ),
  undo: <path d="M7 8H4V5M4 8a8 8 0 1 1 2 8" />,
  "more-horizontal": (
    <>
      <circle cx="5" cy="12" r="1.3" />
      <circle cx="12" cy="12" r="1.3" />
      <circle cx="19" cy="12" r="1.3" />
    </>
  ),
  filter: <path d="M4 5h16l-6 8v6l-4-2v-4L4 5Z" />,
  "arrow-up-right": <path d="M7 17 17 7M9 7h8v8" />,
  "arrow-down-right": <path d="M7 7 17 17M17 9v8H9" />,
  "dollar-sign": (
    <>
      <path d="M12 3v18" />
      <path d="M16.5 7.5c0-1.7-2-3-4.5-3s-4.5 1.2-4.5 3 2 2.6 4.5 3 4.5 1.3 4.5 3-2 3-4.5 3-4.5-1.3-4.5-3" />
    </>
  ),
  send: <path d="M4 11 20 4l-6 16-3-7-7-2Z" />,
  loader: (
    <>
      <path d="M12 3v3M12 18v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M3 12h3M18 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" />
    </>
  ),
  mail: <path d="M4 6h16v12H4V6Zm0 0 8 7 8-7" />,
  database: (
    <>
      <ellipse cx="12" cy="6" rx="8" ry="3" />
      <path d="M4 6v12c0 1.7 3.6 3 8 3s8-1.3 8-3V6" />
      <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
    </>
  ),
  image: (
    <>
      <rect x="3.5" y="5" width="17" height="14" rx="2" />
      <circle cx="9" cy="10" r="1.6" />
      <path d="m5 17 5-5 3.5 3.5L18 11l1 1.5" />
    </>
  ),
  layout: (
    <>
      <rect x="3.5" y="4.5" width="17" height="15" rx="2" />
      <path d="M9.5 4.5v15" />
    </>
  ),
  link: (
    <>
      <path d="M9.5 14.5 14.5 9.5" />
      <path d="M11 6.5 12.3 5a3.5 3.5 0 1 1 5 5L16 11.5" />
      <path d="M13 17.5 11.7 19a3.5 3.5 0 1 1-5-5L8 12.5" />
    </>
  ),
  instagram: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="4.5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="16.2" cy="7.8" r="0.8" fill="currentColor" stroke="none" />
    </>
  ),
  facebook: <path d="M14 21v-7h2.5l.5-3H14V9c0-.9.3-1.5 1.7-1.5H17V4.8c-.3 0-1.2-.1-2.3-.1-2.3 0-3.7 1.4-3.7 3.9V11H8.5v3H11v7h3Z" />,
  linkedin: (
    <>
      <rect x="4" y="4" width="16" height="16" rx="2.5" />
      <path d="M8 10.5v6M8 8v.1M12 16.5v-3.7c0-1.4 1-2.3 2.2-2.3s1.8.9 1.8 2.3v3.7" />
    </>
  ),
  tiktok: (
    <>
      <path d="M13 4v10.2a2.6 2.6 0 1 1-2-2.5" />
      <path d="M13 4c.3 2 1.8 3.5 3.8 3.7" />
    </>
  ),
  inbox: (
    <>
      <path d="M4 12h4.5l1.5 3h4l1.5-3H20" />
      <path d="M6 5h12l2 7v6a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6l2-7Z" />
    </>
  ),
  "clipboard-check": (
    <>
      <rect x="5" y="4.5" width="14" height="16" rx="2" />
      <path d="M9 4.5V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v.5" />
      <path d="m9 12.5 2 2 4-4.5" />
    </>
  ),
  "user-circle": (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="10" r="2.6" />
      <path d="M6.5 18.2a6 6 0 0 1 11 0" />
    </>
  ),
  moon: <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" />,
  sun: (
    <>
      <circle cx="12" cy="12" r="4.5" />
      <path d="M12 2.5v3M12 18.5v3M4.6 4.6l2.1 2.1M17.3 17.3l2.1 2.1M2.5 12h3M18.5 12h3M4.6 19.4l2.1-2.1M17.3 6.7l2.1-2.1" />
    </>
  ),
};

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 18, ...rest }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      {...rest}
    >
      {paths[name]}
    </svg>
  );
}
