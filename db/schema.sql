-- WealthOS relational persistence blueprint.
-- Apply through the chosen Postgres migration runner; this file intentionally contains
-- no provider-specific extension requirements.

create table if not exists users (
  id uuid primary key,
  email text unique,
  display_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists wealth_profiles (
  user_id uuid primary key references users(id) on delete cascade,
  annual_income numeric(14,2) not null default 0,
  liquid_savings numeric(14,2) not null default 0,
  monthly_expenses numeric(14,2) not null default 0,
  target_income numeric(14,2) not null default 0,
  available_hours_per_week numeric(6,2) not null default 0,
  primary_goal text not null,
  risk_tolerance text not null,
  updated_at timestamptz not null default now()
);

create table if not exists wealth_actions (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  opportunity_id text not null,
  opportunity jsonb not null,
  status text not null,
  note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz,
  unique (user_id, opportunity_id)
);

create index if not exists wealth_actions_user_status_idx on wealth_actions(user_id, status);
create index if not exists wealth_actions_updated_idx on wealth_actions(user_id, updated_at desc);

create table if not exists connected_accounts (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  provider text not null,
  provider_account_id text not null,
  access_token_ciphertext text,
  refresh_token_ciphertext text,
  expires_at timestamptz,
  scopes text[] not null default '{}',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (user_id, provider)
);

create table if not exists subscriptions (
  id uuid primary key,
  user_id uuid not null references users(id) on delete cascade,
  stripe_customer_id text unique,
  stripe_subscription_id text unique,
  plan text not null,
  status text not null,
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
