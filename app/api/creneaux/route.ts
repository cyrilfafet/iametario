import { supabaseAdmin } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function GET() {
  const today = new Date().toISOString().split("T")[0];
  const { data, error } = await supabaseAdmin
    .from("creneaux")
    .select("id, date, heure_debut, duree_min")
    .eq("disponible", true)
    .eq("reserve", false)
    .gte("date", today)
    .order("date", { ascending: true })
    .order("heure_debut", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}
