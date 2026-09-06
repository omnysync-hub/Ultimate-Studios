import type { HTMLAttributes, ReactNode } from "react";

type Props = {
  children: ReactNode;
  accentColor?: string; // Optional hex (e.g. #3FE0E0 or fixed category color)
  glowColor?: string; // Optional rgba string
  className?: string;
  hoverable?: boolean;
} & HTMLAttributes<HTMLDivElement>;

export function GlowCard({
  children,
  accentColor,
  glowColor,
  className = "",
  hoverable = true,
  style,
  ...props
}: Props) {
  // If specific accentColor is provided, use inline styles, otherwise default to dynamic var(--accent)
  const customBorderColor = accentColor || "var(--accent)";
  const customGlow = glowColor || (accentColor ? `${accentColor}88` : "var(--accent-glow)");

  return (
    <div
      {...props}
      style={{
        borderColor: customBorderColor,
        boxShadow: `0 0 18px ${customGlow}`,
        ...style
      }}
      className={`rounded-card border-2 bg-surface transition-all duration-200 ${
        hoverable ? "hover:-translate-y-1 hover:shadow-[0_0_24px_var(--accent-glow)]" : ""
      } ${className}`}
    >
      {children}
    </div>
  );
}
