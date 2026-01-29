"use client";

import { useState, useEffect } from "react";

const EMOJIS = ["🚀", "👍", "❤️", "🔥", "📈", "✨", "🎉", "💰", "💎", "⭐"];
const NUM_EMOJIS = 30;

type Emoji = {
  id: number;
  emoji: string;
  x: number;
  duration: number;
  delay: number;
  size: number;
};

export function FallingEmojis() {
  const [emojis, setEmojis] = useState<Emoji[]>([]);

  useEffect(() => {
    const generatedEmojis = Array.from({ length: NUM_EMOJIS }).map((_, i) => ({
      id: i,
      emoji: EMOJIS[Math.floor(Math.random() * EMOJIS.length)],
      x: Math.random() * 100,
      duration: 5 + Math.random() * 10,
      delay: Math.random() * -15,
      size: 1 + Math.random() * 1.5,
    }));
    setEmojis(generatedEmojis);
  }, []);

  if (emojis.length === 0) {
    return null;
  }

  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden" aria-hidden="true">
      {emojis.map(({ id, emoji, x, duration, delay, size }) => (
        <span
          key={id}
          className="absolute animate-fall opacity-50"
          style={
            {
              left: `${x}vw`,
              fontSize: `${size}rem`,
              animationDuration: `${duration}s`,
              animationDelay: `${delay}s`,
            } as React.CSSProperties
          }
        >
          {emoji}
        </span>
      ))}
    </div>
  );
}
