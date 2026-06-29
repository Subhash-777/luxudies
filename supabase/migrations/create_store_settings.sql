-- Run this in Supabase Dashboard → SQL Editor
-- Creates the store_settings table for the Admin Settings page

create table if not exists public.store_settings (
  id          text primary key default 'singleton',
  store_name  text not null default 'LUXUDIES',
  contact_email text not null default 'hello@luxudies.com',
  phone       text not null default '+91 98765 43210',
  whatsapp    text not null default '+91 98765 43210',
  free_shipping_state text not null default 'Tamil Nadu',
  shipping_cost_other integer not null default 99,
  min_delivery_days integer not null default 3,
  max_delivery_days integer not null default 7,
  announcement_bar text default 'Extra 10% off on your first order • Use code LUXFIRST',
  instagram_url text default '',
  facebook_url  text default '',
  updated_at  timestamptz not null default now()
);

-- Insert default row
insert into public.store_settings (id)
values ('singleton')
on conflict (id) do nothing;

-- Allow service role full access, anon read-only
alter table public.store_settings enable row level security;

create policy "Admin can manage settings"
  on public.store_settings for all
  using (true) with check (true);
