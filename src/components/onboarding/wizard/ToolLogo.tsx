interface ToolLogoProps {
  initials: string;
  color: string;
  size?: number;
}

// A colored monogram placeholder for a connected app -- not a reproduction of any
// company's real logo, just a recognizable stand-in until a real integration icon exists.
export function ToolLogo({ initials, color, size = 36 }: ToolLogoProps) {
  return (
    <span
      className="tool-logo"
      style={{ width: size, height: size, background: color }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}
