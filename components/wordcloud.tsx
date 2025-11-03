"use client";

import React, { useMemo } from "react";

type Item = { word: string; count: number };

function hashString(s: string) {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return h >>> 0;
}

export default function WordCloud({ words }: { words: Item[] }) {
  const items = useMemo(() => {
    if (!words || words.length === 0) return [];
    const counts = words.map((w) => w.count);
    const min = Math.min(...counts);
    const max = Math.max(...counts);

    const scale = (count: number) => {
      if (max === min) return 26;
      const t = (count - min) / (max - min);
      // smooth scale between 14 and 56
      return Math.round(14 + Math.pow(t, 0.9) * (56 - 14));
    };

    const palette = [
      "linear-gradient(90deg,#10B981,#059669)", // green
      "linear-gradient(90deg,#3B82F6,#2563EB)", // blue
      "linear-gradient(90deg,#F59E0B,#F97316)", // amber
      "linear-gradient(90deg,#EF4444,#DC2626)", // red
      "linear-gradient(90deg,#8B5CF6,#7C3AED)", // purple
    ];

    return words.map((w) => {
      const h = hashString(w.word);
      const color = palette[h % palette.length];
      const rotate = (h % 41) - 20; // -20..20
      const fontSize = scale(w.count);
      const opacity = 0.75 + ((w.count - min) / Math.max(1, max - min)) * 0.25;
      return { ...w, color, rotate, fontSize, opacity };
    });
  }, [words]);

  if (!items.length) {
    return <div className="p-4 text-sm text-gray-500">No words available</div>;
  }

  return (
    <div className="rounded-lg border bg-gradient-to-br from-white/60 to-slate-50 p-4 shadow-lg">
      <div className="mb-2 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Word Cloud</h3>
          <p className="text-sm text-gray-500">Most frequent words from recent reviews</p>
        </div>
        <div className="text-xs text-gray-400">Top {items.length}</div>
      </div>

      <div className="relative min-h-[160px] w-full overflow-hidden rounded-md bg-white/60 p-4">
        <div className="flex flex-wrap items-center gap-3">
          {items.map((it) => (
            <button
              key={it.word}
              title={`${it.word} — ${it.count}`}
              onClick={() => {
                // noop by default; parent can wrap and handle click via prop if needed
                // keep accessible and keyboard focusable
              }}
              className="inline-flex items-center justify-center rounded-md px-2 py-1 transition-transform duration-200 ease-out shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-200"
              style={{
                fontSize: `${it.fontSize}px`,
                transform: `rotate(${it.rotate}deg)`,
                background: it.color,
                WebkitBackgroundClip: "text",
                backgroundClip: "text",
                color: "transparent",
                opacity: it.opacity,
                textShadow: "0 1px 0 rgba(255,255,255,0.6)",
              }}
            >
              <span
                className="hover:scale-105 transform-gpu inline-block"
                style={{
                  WebkitTextFillColor: "initial",
                  background: it.color,
                  WebkitBackgroundClip: "text",
                  backgroundClip: "text",
                  color: "transparent",
                }}
              >
                {it.word}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="text-xs text-gray-500">Click a word to filter (no-op by default)</div>
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-400" />
          <div className="h-2 w-2 rounded-full bg-blue-400" />
          <div className="h-2 w-2 rounded-full bg-amber-400" />
        </div>
      </div>
    </div>
  );
}