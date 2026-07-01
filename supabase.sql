-- Rode isto no Supabase: menu SQL Editor -> New query -> cole -> Run.
-- Cria a tabela que guarda quem pagou (libera a criação de conta).

create table if not exists public.entitlements (
  email text primary key,
  paid boolean not null default false,
  stripe_session text,
  created_at timestamptz not null default now()
);

-- Segurança: liga o RLS e NÃO cria nenhuma policy publica.
-- Assim a tabela so pode ser lida/escrita pelo back-end (service_role),
-- nunca pelo navegador.
alter table public.entitlements enable row level security;
