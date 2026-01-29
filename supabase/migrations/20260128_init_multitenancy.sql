-- Create tracker_organizations table
create table if not exists public.tracker_organizations (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Create tracker_profiles table
create type public.user_role as enum ('SUPER_ADMIN', 'ORG_ADMIN', 'CLIENT_USER');

create table if not exists public.tracker_profiles (
  id uuid references auth.users on delete cascade primary key,
  role public.user_role not null default 'CLIENT_USER',
  organization_id uuid references public.tracker_organizations(id),
  full_name text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add organization_id to existing tables
alter table public.tracker_modules 
add column if not exists organization_id uuid references public.tracker_organizations(id);

alter table public.tracker_custom_developments 
add column if not exists organization_id uuid references public.tracker_organizations(id);

alter table public.tracker_timeline_events 
add column if not exists organization_id uuid references public.tracker_organizations(id);

alter table public.tracker_action_items 
add column if not exists organization_id uuid references public.tracker_organizations(id);

alter table public.tracker_tickets 
add column if not exists organization_id uuid references public.tracker_organizations(id);

-- Optional: Add to FAQs and Tutorials if they should be tenant-specific
-- largely depends on if we want global content or not. 
-- For now, let's keep FAQs and Tutorials GLOBAL (no org_id) so all clients see the same help docs.

-- RLS Policies

-- Enable RLS on new tables
alter table public.tracker_organizations enable row level security;
alter table public.tracker_profiles enable row level security;

-- Enable RLS on existing tables (if not already enabled, good practice to ensure)
alter table public.tracker_modules enable row level security;
alter table public.tracker_custom_developments enable row level security;
alter table public.tracker_timeline_events enable row level security;
alter table public.tracker_action_items enable row level security;
alter table public.tracker_tickets enable row level security;

-- Seed Default Admin Org
-- logic: IF no organizations exist, create 'System Admin Org'
do $$
declare
  admin_org_id uuid;
begin
  if not exists (select 1 from public.tracker_organizations limit 1) then
    insert into public.tracker_organizations (name)
    values ('Admin System')
    returning id into admin_org_id;
    
    -- NOTE: We cannot easily seed a profile for an auth.user without knowing their ID.
    -- The user will need to be manually linked or we handle it in the app upon first login if profile doesn't exist?
    -- For now, we created the Org.
  end if;
end $$;
