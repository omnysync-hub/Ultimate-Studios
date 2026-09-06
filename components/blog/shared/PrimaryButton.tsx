import type { ButtonHTMLAttributes, ReactNode } from "react";
import Link from "next/link";

type Props = {
  children: ReactNode;
  variant?: "global" | "post";
  href?: string;
  className?: string;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export function PrimaryButton({
  children,
  variant = "global",
  href,
  className = "",
  ...buttonProps
}: Props) {
  const baseClasses =
    "inline-flex items-center justify-center font-bold uppercase tracking-wider rounded-pill transition-all duration-200";

  const variantStyles =
    variant === "global"
      ? "bg-brand-red hover:bg-brand-red-hover text-white text-sm px-7 py-3 shadow-[0_0_20px_rgba(214,48,63,0.5)] hover:shadow-[0_0_25px_rgba(232,71,85,0.7)]"
      : "bg-transparent border-2 border-[var(--accent)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-[var(--accent-text-on)] text-sm px-6 py-2.5 shadow-[0_0_15px_var(--accent-glow)]";

  if (href) {
    return (
      <Link href={href} className={`${baseClasses} ${variantStyles} ${className}`}>
        {children}
      </Link>
    );
  }

  return (
    <button className={`${baseClasses} ${variantStyles} ${className}`} {...buttonProps}>
      {children}
    </button>
  );
}
