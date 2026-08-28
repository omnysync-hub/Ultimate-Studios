"use client";

import { useEffect, useState, type RefObject } from "react";

export function useInViewOnce(
  ref: RefObject<Element | null>,
  rootMargin = "80% 0px"
) {
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node || inView) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin, threshold: 0 }
    );

    io.observe(node);
    return () => io.disconnect();
  }, [inView, ref, rootMargin]);

  return inView;
}
