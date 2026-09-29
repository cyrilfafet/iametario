import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { supabase } from "@/lib/clients";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { data, error } = await supabase()
    .from("clients")
    .select("id, name, address, postal_code, city, phone, email")
    .order("name");
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ clients: data });
}
