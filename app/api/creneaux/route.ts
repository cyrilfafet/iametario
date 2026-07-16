import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const followup = new URL(req.url).searchParams.get("followup") === "1";
  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,"0")}-${String(today.getDate()).padStart(2,"0")}`;

  // Libérer les créneaux pending expirés
  await supabaseAdmin
    .from("creneaux")
    .update({ pending: false, stripe_session_id: null, client_nom: null, client_email: null, client_message: null, pending_expires_at: null })
    .eq("pending", true)
    .lt("pending_expires_at", new Date().toISOString());

  const { data, error } = await supabaseAdmin
    .from("creneaux")
    .select("id, date, heure_debut")
    .eq("disponible", true)
    .eq("reserve", false)
    .eq("pending", false)
    .gte("date", todayStr)
    .order("date", { ascending: true })
    .order("heure_debut", { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  if (followup) {
    const slots = (data ?? []).map(row => ({ id: row.id, date: row.date, heure_debut: row.heure_debut, duree_min: 60 }));
    return NextResponse.json(slots);
  }

  const byDate: Record<string, { id: string; heure_debut: string }[]> = {};
  for (const row of (data ?? [])) {
    (byDate[row.date] ??= []).push({ id: row.id, heure_debut: row.heure_debut });
  }

  const validSlots: { id: string; date: string; heure_debut: string; duree_min: number }[] = [];
  for (const [date, hours] of Object.entries(byDate)) {
    const hourMap = new Map(hours.map(h => [parseInt(h.heure_debut.slice(0, 2)), h]));
    for (const [h, slot] of hourMap) {
      if (hourMap.has(h + 1) && hourMap.has(h + 2)) {
        validSlots.push({ id: slot.id, date, heure_debut: slot.heure_debut, duree_min: 180 });
      }
    }
  }

  validSlots.sort((a, b) => a.date.localeCompare(b.date) || a.heure_debut.localeCompare(b.heure_debut));
  return NextResponse.json(validSlots);
}
