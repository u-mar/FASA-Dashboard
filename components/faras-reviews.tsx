// ...existing code...
"use client";

import React from "react";

type Review = {
  id: string;
  reviewer?: string | null;
  rating?: number | null;
  date?: string | null;
  text: string;
  sourcee?: string | null;
  overall_sentiment?: string | null;
};

export default function FarasReviews({ reviews }: { reviews: Review[] }) {
  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-medium">Sources (sentiment)</h2>
          <span className="ml-2 rounded-full bg-emerald-100 text-emerald-800 px-2 py-0.5 text-xs font-medium">
            {reviews?.length ?? 0} reviews
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">No. of Sources</span>
          <span className="rounded bg-gray-100 px-2 py-1 text-sm">—</span>
        </div>
      </div>

      <div className="mt-3">
        {/* parent should still render SourcesSentiment above if required */}
      </div>

      <div className="mt-4 border-t pt-4">
        <h3 className="text-sm font-medium mb-2">Recent Faras Reviews</h3>

        {(!reviews || reviews.length === 0) ? (
          <p className="text-sm text-gray-500">No reviews available.</p>
        ) : (
          <div className="grid grid-cols-1 gap-3">
            {reviews.map((r) => (
              <div key={r.id} className="flex items-start gap-3 rounded-md border bg-white p-3 shadow-sm">
                <div className="flex-shrink-0">
                  <div className="h-8 w-8 rounded-full bg-emerald-500 flex items-center justify-center text-xs font-semibold text-white">
                    {r.reviewer ? String(r.reviewer).split(" ").map(s => s[0]).slice(0,2).join("") : "U"}
                  </div>
                </div>

                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-medium text-gray-800">{r.reviewer ?? "Anonymous"}</div>
                      <div className="text-xs text-gray-500">{r.sourcee ?? ""}</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-sm font-semibold">
                        {Array.from({ length: Math.max(0, Math.min(5, r.rating ?? 0)) }).map((_, i) => (
                          <span key={i} className="text-amber-500">★</span>
                        ))}
                        {typeof r.rating === "number" ? <span className="text-xs text-gray-500 ml-1">({r.rating})</span> : null}
                      </div>

                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                          r.overall_sentiment === "positive"
                            ? "bg-green-100 text-green-800"
                            : r.overall_sentiment === "negative"
                            ? "bg-red-100 text-red-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {r.overall_sentiment ?? "neutral"}
                      </span>
                    </div>
                  </div>

                  <p className="mt-2 text-sm text-gray-700 line-clamp-3">{r.text}</p>

                  <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                    <span>{r.date ? new Date(r.date).toLocaleDateString() : ""}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}