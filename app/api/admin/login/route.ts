import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

export async function POST(req: NextRequest) {
  const { id, password } = await req.json();

  if (id !== process.env.ADMIN_ID || password !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "IDまたはパスワードが正しくありません" },
      { status: 401 }
    );
  }

  const secret = new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? "");
  const token = await new SignJWT({ role: "admin" })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(secret);

  const res = NextResponse.json({ ok: true });
  res.cookies.set("admin_token", token, {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 60 * 60 * 24,
    secure: process.env.NODE_ENV === "production",
  });

  return res;
}
