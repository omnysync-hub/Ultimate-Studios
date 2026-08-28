"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

type Props = {
  children: ReactNode;
  minHeight: string;
  rootMargin?: string;
  idleTimeout?: number;
};

export function DeferredSection({
  children,
  minHeight,
  rootMargin = "100% 0px",
  idleTimeout = 3500
}: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (mounted) return;

    let done = false;
    const mount = () => {
      if (done) return;
      done = true;
      setMounted(true);
    };

    const idleId =
      typeof requestIdleCallback !== "undefined"
        ? requestIdleCallback(mount, { timeout: idleTimeout })
        : window.setTimeout(mount, 800);

    const node = hostRef.current;
    if (!node) {
      return () => {
        if (typeof cancelIdleCallback !== "undefined") {
          cancelIdleCallback(idleId as number);
        } else {
          clearTimeout(idleId as number);
        }
      };
    }

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) mount();
      },
      { rootMargin, threshold: 0 }
    );
    io.observe(node);

    return () => {
      if (typeof cancelIdleCallback !== "undefined") {
        cancelIdleCallback(idleId as number);
      } else {
        clearTimeout(idleId as number);
      }
      io.disconnect();
    };
  }, [idleTimeout, mounted, rootMargin]);

  return (
    <div ref={hostRef} style={mounted ? undefined : { minHeight }}>
      {mounted ? children : null}
    </div>
  );
}
