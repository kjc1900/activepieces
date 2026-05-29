-- ============================================================
-- Custom Doll Builder — Supabase Schema
-- Run this in your Supabase project: SQL Editor > New query
-- ============================================================

-- Ingredients (synced from Notion)
create table if not exists doll_ingredients (
  id          uuid        primary key default gen_random_uuid(),
  notion_id   text        unique,
  category    text        not null check (category in ('ROCK','HERB_OIL','COLOR','ARCHETYPE')),
  name        text        not null,
  description text,
  extra_data  jsonb       not null default '{}',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

-- Seeker recipes
create table if not exists doll_recipes (
  id             uuid        primary key default gen_random_uuid(),
  user_id        uuid        not null references auth.users(id) on delete cascade,
  name           text        not null,
  doll_line      text        not null check (doll_line in ('YOU_DO_YOU_VOODOO','SOUL_STITCH','JOJOS_ODDITIES')),
  formula        text        not null check (formula in ('ONE_ROCK_TWO_HERBS','TWO_ROCKS_ONE_HERB','THREE_ROCKS_TWO_HERBS')),
  rock_ids       uuid[]      not null default '{}',
  herb_ids       uuid[]      not null default '{}',
  color_ids      uuid[]      not null default '{}',
  archetype_ids  uuid[]      not null default '{}',
  intention      text,
  status         text        not null default 'draft' check (status in ('draft','submitted')),
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Row Level Security
alter table doll_ingredients enable row level security;
alter table doll_recipes     enable row level security;

-- Anyone can read ingredients (public ingredient library)
create policy "public_read_ingredients"
  on doll_ingredients for select using (true);

-- Only the service role can write ingredients (via sync API)
create policy "service_write_ingredients"
  on doll_ingredients for all
  using (auth.role() = 'service_role');

-- Seekers manage only their own recipes
create policy "users_select_own_recipes"
  on doll_recipes for select using (auth.uid() = user_id);

create policy "users_insert_own_recipes"
  on doll_recipes for insert with check (auth.uid() = user_id);

create policy "users_update_own_recipes"
  on doll_recipes for update using (auth.uid() = user_id);

create policy "users_delete_own_recipes"
  on doll_recipes for delete using (auth.uid() = user_id);

-- Helpful index
create index if not exists doll_recipes_user_id_idx on doll_recipes (user_id);
create index if not exists doll_ingredients_category_idx on doll_ingredients (category);
create index if not exists doll_ingredients_notion_id_idx on doll_ingredients (notion_id);
