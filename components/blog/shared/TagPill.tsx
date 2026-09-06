import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  color?: string; // Optional custom/fixed color hex, otherwise uses var(--accent)
  className?: string;
};

export function TagPill({ children, color, className = "" }: Props) {
  const customStyle = color
    ? {
        borderColor: color,
        color: color
      }
    : {
        borderColor: "var(--accent)",
        color: "var(--accent)"
      };

  return (
    <span
      style={customStyle}
      className={`inline-flex items-center justify-center rounded-pill border-2 bg-transparent px-4 py-1.5 text-xs font-semibold uppercase tracking-wider transition-colors ${className}`}
    >
      {children}
    </span>
  );
}
