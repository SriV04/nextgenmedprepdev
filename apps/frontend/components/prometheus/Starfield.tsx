'use client';

import React, { useEffect, useMemo, useState } from 'react';

type Star = {
  x: number; // 0-100 vw percent
  y: number; // 0-100 vh percent
  size: number; // px
  delay: number; // s
  duration: number; // s
  driftX: number; // px
  driftY: number; // px
  baseOpacity: number; // 0-1
  twinkleDuration: number; // s
  twinkleDelay: number; // s
};

export default function Starfield({
  count = 60,
  className = '',
}: {
  count?: number;
  className?: string;
}) {
  const [stars, setStars] = useState<Star[] | null>(null);

  // Generate stars only on the client to avoid hydration mismatch from randomness.
  useEffect(() => {
    const arr: Star[] = [];
    for (let i = 0; i < count; i++) {
      // Weighted size: small(~30%), medium(~60%), rare large(~10%)
      let size: number;
      const r = Math.random();
      if (r < 0.3) size = 1.6 + Math.random() * 0.6; // 1.6 - 2.2
      else if (r < 0.9) size = 2.0 + Math.random() * 1.2; // 2.0 - 3.2
      else size = 3.3 + Math.random() * 1.2; // 3.3 - 4.5 (rare brighter stars)
      arr.push({
        x: Math.random() * 100,
        y: Math.random() * 100,
        size,
        delay: Math.random() * 6,
        duration: 9 + Math.random() * 10, // 9-19s subtle slow drift
        driftX: (Math.random() - 0.5) * 24, // -12 to 12px
        driftY: (Math.random() - 0.5) * 36, // -18 to 18px
        baseOpacity: 0.7 + Math.random() * 0.25, // 0.7 - 0.95
        twinkleDuration: 2.2 + Math.random() * 3.2, // 2.2-5.4s
        twinkleDelay: Math.random() * 5,
      });
    }
    setStars(arr);
  }, [count]);

  return (
    <div
      className={`absolute inset-0 pointer-events-none ${className}`}
      aria-hidden="true"
      suppressHydrationWarning
    >
      {stars?.map((s, i) => (
        <span
          key={i}
          className="ngmp-star"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            // custom CSS vars for animation
            ['--drift-x' as any]: `${s.driftX}px`,
            ['--drift-y' as any]: `${s.driftY}px`,
            ['--base-opacity' as any]: s.baseOpacity.toString(),
            ['--float-duration' as any]: `${s.duration}s`,
            ['--float-delay' as any]: `${s.delay}s`,
            ['--twinkle-duration' as any]: `${s.twinkleDuration}s`,
            ['--twinkle-delay' as any]: `${s.twinkleDelay}s`,
          }}
        />
      ))}
    </div>
  );
}
