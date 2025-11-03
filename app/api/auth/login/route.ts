// ...existing code...
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "@/lib/users";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    const user = await findUserByEmail(email);
    if (!user) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    const ok = await bcrypt.compare(password, user.password_hash);
    if (!ok) return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });

    // TODO: set session cookie / issue JWT
    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
// ...existing code...