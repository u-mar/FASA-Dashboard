import bcrypt from "bcryptjs";
import { sql } from "@/lib/db";

export type UserRow = {
  id: string;
  email: string;
  password_hash: string;
  created_at?: string;
};

export async function findUserByEmail(email: string): Promise<UserRow | null> {
  const rows = await sql`SELECT id, email, password_hash, created_at FROM users WHERE email = ${email} LIMIT 1`;
  return (rows as UserRow[])[0] ?? null;
}

export async function createUser(email: string, password: string) {
  const passwordHash = await bcrypt.hash(password, 10);
  const rows = await sql`INSERT INTO users (email, password_hash) VALUES (${email}, ${passwordHash}) RETURNING id, email`;
  return (rows as { id: string; email: string }[])[0] ?? null;
}