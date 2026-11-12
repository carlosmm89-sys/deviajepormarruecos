import type { SupabaseClient } from '@supabase/supabase-js';

// Carga diferida del cliente de Supabase (~190 KB de JavaScript).
// Así la portada se pinta sin esperar a descargar y ejecutar Supabase: se pide en cuanto hace falta el primer dato.
let clientPromise: Promise<SupabaseClient> | null = null;

export function getSupabase(): Promise<SupabaseClient> {
  if (!clientPromise) {
    clientPromise = import('./supabase').then(m => m.supabase);
  }
  return clientPromise;
}
