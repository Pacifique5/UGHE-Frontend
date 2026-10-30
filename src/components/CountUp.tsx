"use client";

import { useEffect, useRef, useState } from "react";

function formatNumber(value: number, grouping: boolean): string {
  if (!grouping) {
    return String(value);
  }
  return new Intl.NumberFormat("en-US").format(value);
}

export function CountUp({
  to,
  suffix,
  duration,
  grouping,
  fallback,
}: {
  to: number | null;
  suffix: string;
  duration: number;
  grouping: boolean;
  fallback: string;
}) {
  const nodeRef = useRef<HTMLParagraphElement>(null);
  const started = useRef(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const node = nodeRef.current;
    if (!node || to === null) {
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || started.current) {
          return;
        }
        started.current = true;
        const length = Math.max(duration, 1);
        const start = performance.now();
        const tick = (now: number) => {
          const progress = Math.min(1, (now - start) / length);
          const eased = 1 - (1 - progress) ** 3;
          setValue(Math.round(to * eased));
          if (progress < 1) {
            requestAnimationFrame(tick);
          }
        };
        requestAnimationFrame(tick);
      },
      { threshold: 0.45 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [duration, to]);

  const label = to === null ? fallback : `${formatNumber(value, grouping)}${suffix}`;

  return (
    <p ref={nodeRef} className="stat-value">
      {label}
    </p>
  );
}
