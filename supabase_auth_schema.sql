-- Create a table for public profiles
create table profiles (
  id uuid references auth.users not null primary key,
  updated_at timestamp with time zone,
  first_name text,
  last_name text,
  phone text,
  region text,
  commune text,
  street_address text,
  role text default 'user' check (role in ('user', 'admin')),
  avatar_url text
);

-- Set up Row Level Security (RLS)
alter table profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on profiles for update
  using ( auth.uid() = id );

-- Create a trigger to automatically create a profile entry when a new user signs up
-- This ensures every user in auth.users has a corresponding row in public.profiles
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (
    id, 
    first_name, 
    last_name, 
    phone, 
    region, 
    commune, 
    street_address, 
    role, 
    avatar_url
  )
  values (
    new.id, 
    new.raw_user_meta_data->>'first_name', 
    new.raw_user_meta_data->>'last_name',
    new.raw_user_meta_data->>'phone',
    new.raw_user_meta_data->>'region',
    new.raw_user_meta_data->>'commune',
    new.raw_user_meta_data->>'street_address',
    'user', 
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Update sales table to link to users
alter table sales add column user_id uuid references auth.users;

-- RLS for Sales: Users can only see their own orders
create policy "Users can view own orders"
  on sales for select
  using ( auth.uid() = user_id );

-- RLS for Sales: Admins can view all orders
-- Note: This requires a policy that checks the profile role.
-- For simplicity in this demo, we might keep the "read all" policy for now or implement a role check function.
-- A robust admin check would look like:
-- create policy "Admins can view all orders"
--   on sales for select
--   using ( exists (select 1 from profiles where id = auth.uid() and role = 'admin') );
