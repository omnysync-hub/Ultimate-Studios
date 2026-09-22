import type { ReactNode } from "react";

/** Full-viewport shell — hides marketing chrome under a fixed layer. */
export default function StudioLayout({ children }: { children: ReactNode }) {
  return (
    <div
      id="sanity-studio"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        height: "100dvh",
        width: "100%",
        overflow: "auto",
        background: "#101112"
      }}
    >
      {children}
    </div>
  );
}
