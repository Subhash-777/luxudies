-- Updated migration: adds announcement_quotes array and updates announcement_bar column
-- Run this in Supabase Dashboard → SQL Editor

-- First, create the table if it doesn't exist
create table if not exists public.store_settings (
  id                   text primary key default 'singleton',
  store_name           text not null default 'LUXUDIES',
  contact_email        text not null default 'hello@luxudies.com',
  phone                text not null default '+91 99999 99999',
  whatsapp             text not null default '919999999999',
  free_shipping_state  text not null default 'Tamil Nadu',
  shipping_cost_other  integer not null default 99,
  min_delivery_days    integer not null default 3,
  max_delivery_days    integer not null default 7,
  -- Multiple announcement quotes (shown in scrolling marquee)
  announcement_quotes  text[] not null default ARRAY[
    'Free Delivery Across Tamil Nadu • ₹99 for Other States',
    'Extra 10% off on your first order — Use code LUXE10',
    'Anti-Tarnish • Lightweight • Premium Quality'
  ],
  instagram_url        text default '',
  facebook_url         text default '',
  updated_at           timestamptz not null default now()
);

-- Add the new columns if the table already exists (safe migration)
alter table public.store_settings
  add column if not exists announcement_quotes text[] not null default ARRAY[
    'Free Delivery Across Tamil Nadu • ₹99 for Other States',
    'Extra 10% off on your first order — Use code LUXE10',
    'Anti-Tarnish • Lightweight • Premium Quality'
  ];

-- Remove old single-quote column if it exists
alter table public.store_settings
  drop column if exists announcement_bar;

-- Insert default singleton row
insert into public.store_settings (id)
values ('singleton')
on conflict (id) do nothing;

-- RLS
alter table public.store_settings enable row level security;

-- Drop existing policy if re-running
drop policy if exists "Admin can manage settings" on public.store_settings;

create policy "Admin can manage settings"
  on public.store_settings for all
  using (true) with check (true);
