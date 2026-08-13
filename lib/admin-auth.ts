import { NextRequest } from "next/server";
import { jwtVerify } from "jose";

/**
 * 管理画面のAPIに付いてくるクッキーを検証する。
 *
 * 画面そのものは `proxy.ts` が守っているが、**APIは proxy を通らない経路でも叩ける**ので、
 * 書き換え・削除を行う route.ts は必ずここを最初に呼ぶこと。
 */
export async function verifyAuth(req: NextRequest): Promise<boolean> {
  const token = req.cookies.get("admin_token")?.value;
  if (!token) return false;
  try {
    await jwtVerify(
      token,
      new TextEncoder().encode(process.env.ADMIN_JWT_SECRET ?? "")
    );
    return true;
  } catch {
    return false;
  }
}
