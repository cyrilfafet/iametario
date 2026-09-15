import { supabaseAdmin } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await req.json();
  const { password, action, disponible, new_date, new_heure_debut } = body;
  if (password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  if (action === "cancel_reservation") {
    const { data: slot } = await supabaseAdmin
      .from("creneaux")
      .select("stripe_session_id, client_email, date, heure_debut")
      .eq("id", id)
      .single();

    const resetData = {
      reserve: false, pending: false, stripe_session_id: null,
      client_nom: null, client_email: null, client_message: null, pending_expires_at: null,
    };

    if (slot?.stripe_session_id) {
      await supabaseAdmin.from("creneaux").update(resetData).eq("stripe_session_id", slot.stripe_session_id);
    } else if (slot) {
      // Fallback : annuler les 3 heures consécutives par date + client_email
      const startH = parseInt((slot.heure_debut as string).slice(0, 2));
      const hours = [startH, startH + 1, startH + 2].map(h => `${String(h).padStart(2, "0")}:00:00`);
      await supabaseAdmin.from("creneaux").update(resetData).eq("date", slot.date).in("heure_debut", hours);
    }
    return NextResponse.json({ success: true });
  }

  if (action === "reschedule") {
    const { data: oldSlot } = await supabaseAdmin.from("creneaux").select("*").eq("id", id).single();
    if (!oldSlot) return NextResponse.json({ error: "Créneau introuvable" }, { status: 404 });

    const clientInfo = { client_nom: oldSlot.client_nom, client_email: oldSlot.client_email, client_message: oldSlot.client_message };
    const stripeSessionId = oldSlot.stripe_session_id;

    // Libérer les anciens créneaux
    const resetData = { reserve: false, pending: false, stripe_session_id: null, client_nom: null, client_email: null, client_message: null };
    if (stripeSessionId) {
      await supabaseAdmin.from("creneaux").update(resetData).eq("stripe_session_id", stripeSessionId);
    } else {
      const startH = parseInt((oldSlot.heure_debut as string).slice(0, 2));
      const hours = [startH, startH + 1, startH + 2].map(h => `${String(h).padStart(2, "0")}:00:00`);
      await supabaseAdmin.from("creneaux").update(resetData).eq("date", oldSlot.date).in("heure_debut", hours);
    }

    // Trouver les 3 nouveaux créneaux
    const newStartH = parseInt((new_heure_debut as string).slice(0, 2));
    const newHours = [newStartH, newStartH + 1, newStartH + 2].map(h => `${String(h).padStart(2, "0")}:00:00`);
    const { data: newSlots } = await supabaseAdmin
      .from("creneaux")
      .select("id")
      .eq("date", new_date)
      .in("heure_debut", newHours)
      .eq("disponible", true)
      .eq("reserve", false)
      .eq("pending", false);

    if (!newSlots || newSlots.length < 3) {
      return NextResponse.json({ error: "Nouveau créneau non disponible" }, { status: 409 });
    }

    await supabaseAdmin
      .from("creneaux")
      .update({ reserve: true, ...clientInfo, stripe_session_id: stripeSessionId })
      .in("id", newSlots.map((s: { id: string }) => s.id));

    return NextResponse.json({ success: true });
  }

  // Par défaut : toggle disponible
  const { error } = await supabaseAdmin.from("creneaux").update({ disponible }).eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const { password } = await req.json();
  if (password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { error } = await supabaseAdmin.from("creneaux").delete().eq("id", id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}
