// lib/supabase.ts
import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// NO singleton. Each call creates a fresh client with its own auth lock.
// All clients share the same localStorage session (keyed by project URL),
// but independent locks prevent React 18 strict mode deadlocks.
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
