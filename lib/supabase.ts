import { createClient } from '@supabase/supabase-js'

// Client admin — serveur uniquement (ne pas importer dans les composants client)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
