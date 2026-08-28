import type { ReactNode } from "react";
import "../tailwind.css";
import { AdScriptLoader } from "@/components/ads/AdScriptLoader";

export default function BlogLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <AdScriptLoader />
      {children}
    </>
  );
}

