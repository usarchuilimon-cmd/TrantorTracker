-- Helper function to get current user role without triggering RLS recursion
create or replace function public.get_my_role()
returns public.user_role
language sql
security definer
stable
as $$
  select role from public.tracker_profiles where id = auth.uid();
$$;

create or replace function public.get_my_org_id()
returns uuid
language sql
security definer
stable
as $$
  select organization_id from public.tracker_profiles where id = auth.uid();
$$;

-- RLS Policies for tracker_profiles
create policy "Users can view their own profile"
on public.tracker_profiles
for select
using ( auth.uid() = id );

create policy "Admins can view all profiles"
on public.tracker_profiles
for select
using ( public.get_my_role() = 'SUPER_ADMIN' );

-- RLS Policies for tracker_organizations
create policy "Users can view their own organization"
on public.tracker_organizations
for select
using ( id = public.get_my_org_id() );

create policy "Admins can view all organizations"
on public.tracker_organizations
for select
using ( public.get_my_role() = 'SUPER_ADMIN' );

-- RLS Policies for Content Tables (Modules, etc.)

-- tracker_modules
create policy "Users view modules of their org"
on public.tracker_modules
for select
using ( organization_id = public.get_my_org_id() );

create policy "Admins view all modules"
on public.tracker_modules
for select
using ( public.get_my_role() = 'SUPER_ADMIN' );

create policy "Admins manage modules"
on public.tracker_modules
for all
using ( public.get_my_role() = 'SUPER_ADMIN' );

-- tracker_tickets (Clients can create)
create policy "Users view tickets of their org"
on public.tracker_tickets
for select
using ( organization_id = public.get_my_org_id() );

create policy "Admins view all tickets"
on public.tracker_tickets
for select
using ( public.get_my_role() = 'SUPER_ADMIN' );

create policy "Users can create tickets for their org"
on public.tracker_tickets
for insert
with check ( organization_id = public.get_my_org_id() );

-- tracker_timeline_events
create policy "Users view timeline of their org"
on public.tracker_timeline_events
for select
using ( organization_id = public.get_my_org_id() );

create policy "Admins manage timeline"
on public.tracker_timeline_events
for all
using ( public.get_my_role() = 'SUPER_ADMIN' );

-- tracker_custom_developments
create policy "Users view custom devs of their org"
on public.tracker_custom_developments
for select
using ( organization_id = public.get_my_org_id() );

create policy "Admins manage custom devs"
on public.tracker_custom_developments
for all
using ( public.get_my_role() = 'SUPER_ADMIN' );

-- tracker_action_items
create policy "Users view action items of their org"
on public.tracker_action_items
for select
using ( organization_id = public.get_my_org_id() );

create policy "Admins manage action items"
on public.tracker_action_items
for all
using ( public.get_my_role() = 'SUPER_ADMIN' );
