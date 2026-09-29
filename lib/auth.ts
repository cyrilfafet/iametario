import { timingSafeEqual } from "node:crypto";

export function isAdmin(req: Request): boolean {
  const expected = process.env.ADMIN_TOKEN;
  const given = req.headers.get("x-admin-token");
  if (!expected || !given) return false;
  const a = Buffer.from(expected);
  const b = Buffer.from(given);
  return a.length === b.length && timingSafeEqual(a, b);
}
