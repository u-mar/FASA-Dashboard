import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

/**
 * Returns 10 random reviews/comments from the DB.
 * If the `reviews` table does not exist, returns a small sample set so the dashboard still works.
 */
const SAMPLE = [
  { id: "s1", text: "Great service — driver was friendly and on time.", source: "App", sentiment: "positive", created_at: new Date().toISOString() },
  { id: "s2", text: "App crashed once but customer support resolved it quickly.", source: "Email", sentiment: "neutral", created_at: new Date().toISOString() },
  { id: "s3", text: "Long wait times during peak hours.", source: "Web", sentiment: "negative", created_at: new Date().toISOString() },
  { id: "s4", text: "Fair prices and easy booking.", source: "App", sentiment: "positive", created_at: new Date().toISOString() },
  { id: "s5", text: "Payment flow confusing for new users.", source: "App", sentiment: "negative", created_at: new Date().toISOString() },
  { id: "s6", text: "Love the new update — UI is cleaner.", source: "App", sentiment: "positive", created_at: new Date().toISOString() },
  { id: "s7", text: "Driver was late but apologized.", source: "App", sentiment: "neutral", created_at: new Date().toISOString() },
  { id: "s8", text: "Promos are great, but some promo codes don't apply.", source: "Email", sentiment: "negative", created_at: new Date().toISOString() },
  { id: "s9", text: "Fast pickup and friendly driver.", source: "Web", sentiment: "positive", created_at: new Date().toISOString() },
  { id: "s10", text: "Map routing sometimes inaccurate.", source: "App", sentiment: "negative", created_at: new Date().toISOString() },
];

export async function GET() {
  try {
    const rows = await sql`
      SELECT reviewer, rating, date, text, sourcee, overall_sentiment,company
      FROM reviews
      where company = 'faras'
      ORDER BY RANDOM()
      LIMIT 10
    `;
    const data =
      Array.isArray(rows) && rows.length > 0
        ? (rows as any[]).map((r, i) => ({
            reviewer: r.reviewer ?? null,
            rating: r.rating ?? null,
            date: r.date ?? r.created_at ?? null,
            text: r.text ?? "",
            sourcee: r.sourcee ?? r.source ?? null,
            overall_sentiment: r.overall_sentiment ?? r.sentiment ?? null,
          }))
        : SAMPLE;

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("faras-reviews API error:", err?.message ?? err);
    if (String(err?.message).toLowerCase().includes("relation") || String(err?.message).toLowerCase().includes("does not exist")) {
      return NextResponse.json({ data: SAMPLE });
    }
    return NextResponse.json({ error: "Failed to fetch reviews" }, { status: 500 });
  }
}