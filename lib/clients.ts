import { createClient } from "@supabase/supabase-js";
import Stripe from "stripe";

export const supabase = () =>
  createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } },
  );

export const stripe = () => new Stripe(process.env.STRIPE_SECRET_KEY!);

export const siteUrl = () =>
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://iametario.com";
