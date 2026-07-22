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
  | "sun"
  | "graduation-cap"
  | "heart-pulse"
  | "utensils"
  | "factory"
  | "hammer"
  | "handshake"
  | "camera"
  | "globe"
  | "package"
  | "download"
  | "repeat"
  | "credit-card"
  | "receipt"
  | "layers"
  | "zap"
  | "trending-up"
  | "grid"
  | "eye"
  | "rocket";

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
  "graduation-cap": (
    <>
      <path d="M2.5 9 12 4.5 21.5 9 12 13.5 2.5 9Z" />
      <path d="M6.5 11v5c0 1.4 2.5 2.5 5.5 2.5s5.5-1.1 5.5-2.5v-5" />
      <path d="M21.5 9v6" />
    </>
  ),
  "heart-pulse": (
    <>
      <path d="M12 20.2C6 16 3 12.7 3 9a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 19 5.6" />
      <path d="M3.5 12h4l1.5-3 2.5 5 1.5-3H21" />
    </>
  ),
  utensils: (
    <>
      <path d="M7 3v7a2 2 0 1 1-4 0V3M5 10v11" />
      <path d="M12 3v18M17 3c-1.5 0-2.5 1.5-2.5 4s1 4 2.5 4 2.5-1.5 2.5-4-1-4-2.5-4Zm0 8v10" />
    </>
  ),
  factory: (
    <>
      <path d="M3 21V11l6 4v-4l6 4v-4l6 4v6H3Z" />
      <path d="M7 21v-4M13 21v-4M17 8V3l3 2.5" />
    </>
  ),
  hammer: (
    <>
      <path d="M14.5 6.5 18 3l3 3-3.5 3.5" />
      <path d="M16 8 6.5 17.5a2 2 0 0 1-2.8 0l-.2-.2a2 2 0 0 1 0-2.8L13.5 4" />
      <path d="M3 21l3.5-3.5" />
    </>
  ),
  handshake: (
    <>
      <path d="M2.5 12.5 6 9l3.5 3-1 1a1.4 1.4 0 0 0 2 2l3-3 3 3" />
      <path d="M9.5 12 14 7.5l3 3 3.5-3.5" />
      <path d="M6 9 3 12M18 6.5 21.5 10" />
    </>
  ),
  camera: (
    <>
      <path d="M4 8h3l1.5-2h7L17 8h3a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V9a1 1 0 0 1 1-1Z" />
      <circle cx="12" cy="13.5" r="3.5" />
    </>
  ),
  globe: (
    <>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M3.5 12h17M12 3.5c2 2.3 3 5.3 3 8.5s-1 6.2-3 8.5c-2-2.3-3-5.3-3-8.5s1-6.2 3-8.5Z" />
    </>
  ),
  package: (
    <>
      <path d="M3.5 7.5 12 3l8.5 4.5V16L12 20.5 3.5 16V7.5Z" />
      <path d="M3.5 7.5 12 12l8.5-4.5M12 12v8.5" />
    </>
  ),
  download: (
    <>
      <path d="M12 4v11M8 11l4 4 4-4" />
      <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
    </>
  ),
  repeat: (
    <>
      <path d="M4 7.5h13l-3-3M20 16.5H7l3 3" />
    </>
  ),
  "credit-card": (
    <>
      <rect x="3" y="6" width="18" height="13" rx="2" />
      <path d="M3 10.5h18" />
    </>
  ),
  receipt: (
    <>
      <path d="M6 3h12v18l-2.5-1.5L13 21l-2.5-1.5L8 21l-2-1.5V3Z" />
      <path d="M9 8h6M9 12h6" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3.5 21 8l-9 4.5L3 8l9-4.5Z" />
      <path d="M3 12l9 4.5L21 12M3 16l9 4.5 9-4.5" />
    </>
  ),
  zap: <path d="M13 2.5 4.5 14H11l-1 7.5L19.5 10H13l1-7.5Z" />,
  "trending-up": (
    <>
      <path d="M3.5 17 10 10.5l4 4 6.5-7.5" />
      <path d="M15 6.5h5.5V12" />
    </>
  ),
  grid: (
    <>
      <rect x="3.5" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="3.5" width="7.5" height="7.5" rx="1.5" />
      <rect x="3.5" y="13" width="7.5" height="7.5" rx="1.5" />
      <rect x="13" y="13" width="7.5" height="7.5" rx="1.5" />
    </>
  ),
  eye: (
    <>
      <path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12Z" />
      <circle cx="12" cy="12" r="3" />
    </>
  ),
  rocket: (
    <>
      <path d="M12 2.5c3 1 5.5 4 5.5 9-1.5 1-3.5 1.5-5.5 1.5S8 12.5 6.5 11.5c0-5 2.5-8 5.5-9Z" />
      <path d="M9.5 16.5 8 21l3-1.5M14.5 16.5 16 21l-3-1.5" />
      <circle cx="12" cy="10" r="1.4" />
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
