-- Create table for tracking site visits
create table site_visits (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  page text not null
);

-- Create table for tracking sales
create table sales (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  amount numeric not null,
  items jsonb not null,
  customer_email text
);

-- Enable Row Level Security (RLS)
alter table site_visits enable row level security;
alter table sales enable row level security;

-- Create policies to allow public insert (for tracking) and read (for admin)
-- Note: In a real production app, you'd restrict read access to authenticated admins only.
-- For this demo, we'll allow public access for simplicity, or you can set up Auth policies.

-- Allow anyone to insert visits
create policy "Enable insert for all users" on site_visits for insert with check (true);
-- Allow anyone to read visits (for dashboard)
create policy "Enable read for all users" on site_visits for select using (true);

-- Allow anyone to insert sales (simulating checkout)
create policy "Enable insert for all users" on sales for insert with check (true);
-- Allow anyone to read sales (for dashboard)
create policy "Enable read for all users" on sales for select using (true);
