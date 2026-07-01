'use client';
import { createBrowserClient } from '@supabase/ssr';

// Cliente do navegador: usado nas telas de login e ativação.
export function supabaseBrowser() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}
