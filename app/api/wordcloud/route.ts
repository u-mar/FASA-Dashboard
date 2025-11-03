import { NextResponse } from "next/server";
import { sql } from "@/lib/db";

const STOPWORDS = new Set([
  "the","and","a","an","to","is","in","it","of","for","on","that","this","with","i","you","was","are","they","we","be","have","has","not","but","as","at","or","from","by","my","so","if","your"
]);

function tokenize(text = "") {
  return text
    .toLowerCase()
    .replace(/[\u2018\u2019\u201C\u201D"]/g, "'")
    .replace(/[^a-z0-9'\s]/g, " ")
    .split(/\s+/)
    .map(s => s.trim())
    .filter(s => s && !STOPWORDS.has(s) && s.length > 1);
}

export async function GET() {
  try {
    const rows = await sql`SELECT text FROM reviews WHERE text IS NOT NULL limit 100`;
    const counts = new Map<string, number>();
    (rows as any[]).forEach(r => {
      tokenize(r.text).forEach(w => counts.set(w, (counts.get(w) || 0) + 1));
    });

    if (counts.size === 0) {
      // fallback sample
      const sample = ["service","driver","app","price","support","wait","pickup","booking","update","promo"];
      const data = sample.map((w, i) => ({ word: w, count: 10 - i }));
      return NextResponse.json({ data });
    }

    const data = Array.from(counts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 40)
      .map(([word, count]) => ({ word, count }));

    return NextResponse.json({ data });
  } catch (err: any) {
    console.error("wordcloud API error:", err?.message ?? err);
    return NextResponse.json({ data: [] });
  }
}