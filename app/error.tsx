"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import "./tailwind.css";

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    void router;
    void error;
  }, [router, error]);

  return (
    <main className="uc-page mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-uc-fg">Something went wrong</h1>
      <p className="mt-4 text-uc-muted leading-relaxed">
        We hit an unexpected error. Try again, or head back to the homepage.
      </p>
      <button type="button" className="uc-btn mt-6" onClick={() => reset()}>
        Try again
      </button>
    </main>
  );
}
