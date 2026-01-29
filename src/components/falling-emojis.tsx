"use client";

import { useState, useEffect } from "react";

const NUM_FLAKES = 50;

type Flake = {
  id: number;
  x: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
};

export function FallingEmojis() {
  const [flakes, setFlakes] = useState<Flake[]>([]);

  useEffect(() => {
    const generatedFlakes = Array.from({ length: NUM_FLAKES }).map((_, i) => ({
      id: i,
      x: Math.random() * 100,
      duration: 10 + Math.random() * 10,
      delay: Math.random() * -20,
      size: 0.5 + Math.random() * 1,
      opacity: 0.3 + Math.random() * 0.7,
    }));
    setFlakes(generatedFlakes);
  }, []);

  if (flakes.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {flakes.map(({ id, x, duration, delay, size, opacity }) => (
        <span
          key={id}
          className="absolute animate-snowfall text-white"
          style={
            {
              left: `${x}vw`,
              fontSize: `${size}rem`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              opacity: opacity,
            } as React.CSSProperties
          }
        >
          ❄️
        </span>
      ))}
    </div>
  );
}
