import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { code, stars, nom } = await request.json();

  if (!code || !stars || stars < 1 || stars > 5) {
    return Response.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const { error } = await supabaseAdmin
    .from("avis")
    .insert({ code, stars, nom: nom?.trim() || null });

  if (error) {
    console.error("Supabase error:", error);
    return Response.json({ error: "Erreur base de données" }, { status: 500 });
  }

  return Response.json({ success: true });
}

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("avis")
    .select("stars, nom, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error) {
    return Response.json({ error: "Erreur base de données" }, { status: 500 });
  }

  return Response.json({ avis: data });
}
