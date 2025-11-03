// ...existing code...
import { NextResponse } from "next/server";
import { findUserByEmail, createUser } from "@/lib/users";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) return NextResponse.json({ message: "Missing fields" }, { status: 400 });

    if (await findUserByEmail(email)) return NextResponse.json({ message: "User exists" }, { status: 409 });

    const user = await createUser(email, password);
    if (!user) return NextResponse.json({ message: "Could not create user" }, { status: 500 });

    return NextResponse.json({ ok: true, user: { id: user.id, email: user.email } }, { status: 201 });
  } catch (err) {
    console.error("Signup error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
// ...existing code...