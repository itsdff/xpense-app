-- Run this in your Supabase SQL Editor (Dashboard > SQL Editor > New query)

-- Categories table
create table if not exists categories (
  id bigint primary key generated always as identity,
  name text not null unique,
  created_at timestamptz default now()
);

-- Mediums table
create table if not exists mediums (
  id bigint primary key generated always as identity,
  name text not null unique,
  created_at timestamptz default now()
);

-- Expenses table
create table if not exists expenses (
  id bigint primary key generated always as identity,
  amount numeric(12, 2) not null check (amount > 0),
  category_id bigint references categories(id) on delete set null,
  medium_id bigint references mediums(id) on delete set null,
  note text,
  created_at timestamptz default now()
);

-- Indexes for fast monthly queries
create index if not exists expenses_created_at_idx on expenses(created_at desc);
create index if not exists expenses_category_idx on expenses(category_id);
create index if not exists expenses_medium_idx on expenses(medium_id);

-- Seed default categories
insert into categories (name) values
  ('Food & dining'),
  ('Transport'),
  ('Utilities'),
  ('Shopping'),
  ('Health'),
  ('Education'),
  ('Entertainment'),
  ('Other')
on conflict (name) do nothing;

-- Seed default mediums
insert into mediums (name) values
  ('Cash'),
  ('bKash'),
  ('MTB Debit Card'),
  ('MTB Credit Card')
on conflict (name) do nothing;

-- Enable Row Level Security (optional but recommended)
-- Since this is a single-user app without Supabase Auth,
-- RLS is handled by keeping the anon key server-side.
-- If you want to add user accounts later, enable RLS:

-- alter table categories enable row level security;
-- alter table mediums enable row level security;
-- alter table expenses enable row level security;
