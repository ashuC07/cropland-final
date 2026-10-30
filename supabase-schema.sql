-- ============================================================
-- CROP LAND - SUPABASE SCHEMA (Compatible with script.js)
-- Run this in your Supabase SQL Editor
-- ============================================================

-- 1. PROFILES TABLE
create table if not exists public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    role text not null check (role in ('farmer', 'shopkeeper')),
    display_name text not null,
    email text not null,
    created_at timestamptz not null default now()
);

-- 2. PRODUCTS TABLE (with farmer_name text column for anonymous/local inserts)
create table if not exists public.products (
    id text primary key default gen_random_uuid()::text,
    farmer_id uuid references public.profiles(id) on delete set null,
    farmer_name text not null default 'Crop Land Farmer',
    name text not null,
    quantity numeric not null check (quantity >= 0),
    price numeric not null check (price >= 0),
    location text not null,
    quality text not null default 'A Grade',
    description text not null default '',
    created_at timestamptz not null default now()
);

-- 3. ORDERS TABLE (with all columns script.js expects)
create table if not exists public.orders (
    id text primary key default gen_random_uuid()::text,
    product_id text references public.products(id) on delete set null,
    product_name text not null,
    farmer_id uuid references public.profiles(id) on delete set null,
    farmer_name text not null default 'Crop Land Farmer',
    shopkeeper_id uuid references public.profiles(id) on delete set null,
    shopkeeper_name text not null default 'Local Shopkeeper',
    quantity numeric not null check (quantity > 0),
    price numeric not null check (price >= 0),
    order_value numeric,
    status text not null default 'Pending' check (status in ('Pending', 'Accepted', 'Rejected', 'Ready for Delivery', 'Delivered')),
    commission_rate numeric,
    commission numeric,
    farmer_amount numeric,
    created_at timestamptz not null default now()
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

alter table public.profiles enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;

-- PROFILES POLICIES
drop policy if exists "Profiles can be found for login" on public.profiles;
create policy "Profiles can be found for login" on public.profiles for select using (true);

drop policy if exists "Users create their own profile" on public.profiles;
create policy "Users create their own profile" on public.profiles for insert with check (auth.uid() = id);

drop policy if exists "Users update their own profile" on public.profiles;
create policy "Users update their own profile" on public.profiles for update using (auth.uid() = id);

-- PRODUCTS POLICIES
drop policy if exists "Products are publicly readable" on public.products;
create policy "Products are publicly readable" on public.products for select using (true);

drop policy if exists "Anyone can insert products" on public.products;
create policy "Anyone can insert products" on public.products for insert with check (true);

drop policy if exists "Farmers update their products" on public.products;
create policy "Farmers update their products" on public.products for update using (true);

drop policy if exists "Farmers delete their products" on public.products;
create policy "Farmers delete their products" on public.products for delete using (true);

-- ORDERS POLICIES
drop policy if exists "Anyone can read orders" on public.orders;
create policy "Anyone can read orders" on public.orders for select using (true);

drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders" on public.orders for insert with check (true);

drop policy if exists "Anyone can update orders" on public.orders;
create policy "Anyone can update orders" on public.orders for update using (true);
