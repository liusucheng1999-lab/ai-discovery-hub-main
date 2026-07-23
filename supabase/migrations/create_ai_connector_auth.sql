create table if not exists public.ai_connector_device_codes (
  id uuid primary key default gen_random_uuid(),
  device_code_hash text not null unique,
  user_code text not null unique,
  user_id uuid references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'consumed')),
  expires_at timestamptz not null,
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  consumed_at timestamptz
);

create table if not exists public.ai_connector_tokens (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  token_hash text not null unique,
  name text not null default 'Codex',
  last_used_at timestamptz,
  expires_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists ai_connector_tokens_user_id_idx
  on public.ai_connector_tokens(user_id);
create index if not exists ai_connector_device_codes_expires_at_idx
  on public.ai_connector_device_codes(expires_at);

alter table public.ai_connector_device_codes enable row level security;
alter table public.ai_connector_tokens enable row level security;

revoke all on public.ai_connector_device_codes from anon, authenticated;
revoke all on public.ai_connector_tokens from anon, authenticated;
