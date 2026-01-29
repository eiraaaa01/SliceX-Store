"use client";

import { useState, useEffect } from "react";

const NUM_FLAKES = 150;

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
      duration: 12 + Math.random() * 15,
      delay: Math.random() * -27,
      size: 1 + Math.random() * 2,
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
        <div
          key={id}
          className="absolute animate-snowfall bg-white rounded-full"
          style={
            {
              left: `${x}vw`,
              width: `${size}px`,
              height: `${size}px`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
              opacity: opacity,
            } as React.CSSProperties
          }
        />
      ))}
    </div>
  );
}
