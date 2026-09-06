/* eslint-disable @next/next/no-img-element */
type Props = {
  src: string;
  alt: string;
  size?: "sm" | "md"; // sm = 24px, md = 40px
  className?: string;
};

export function Avatar({ src, alt, size = "sm", className = "" }: Props) {
  const sizeClasses = size === "sm" ? "w-6 h-6" : "w-10 h-10";

  return (
    <img
      src={src}
      alt={alt}
      className={`inline-block rounded-full object-cover border border-border-subtle ${sizeClasses} ${className}`}
      loading="lazy"
    />
  );
}
