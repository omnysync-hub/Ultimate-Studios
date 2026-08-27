"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ErrorBoundary({
  error,
  reset
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const router = useRouter();

  useEffect(() => {
    // Ensure the error state doesn't trap the user in SPA navigation.
    // If you have logging, hook it here.
    void router;
  }, [router]);

  return (
    <main className="mx-auto w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold">Something went wrong</h1>
      <p className="mt-4 text-slate-200 leading-relaxed">
        This is a placeholder error page.
      </p>
      <button
        type="button"
        className="mt-6 rounded bg-amber-400 px-4 py-2 font-semibold text-black"
        onClick={() => reset()}
      >
        Try again
      </button>
    </main>
  );
}

