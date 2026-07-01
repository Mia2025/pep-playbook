import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

// Cliente ligado aos cookies da requisição, para ler/gravar a sessão do usuário.
export function supabaseServer() {
  const cookieStore = cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // chamado de um Server Component: ignorado (middleware cuida do refresh)
          }
        },
      },
    }
  );
}
