-- Create function to handle new user creation
create or replace function public.handle_new_user() 
returns trigger as $$
declare
  invite_record record;
begin
  -- Check for pending invitation by email
  select * into invite_record
  from public.tracker_invitations
  where email = new.email
  and status = 'PENDING'
  order by created_at desc
  limit 1;

  if found then
    -- If invitation exists, create profile with linked organization and role
    insert into public.tracker_profiles (id, full_name, role, organization_id)
    values (
      new.id,
      split_part(new.email, '@', 1), -- Default name from email part
      invite_record.role::public.user_role,
      invite_record.organization_id
    );

    -- Update invitation status
    update public.tracker_invitations
    set status = 'ACCEPTED'
    where id = invite_record.id;
  else
    -- If no invitation, create default profile (optional, maybe wait for Admin to assign?)
    -- Ideally we create a 'CLIENT_USER' with no org, or catch-all.
    -- For now, let's create a basic profile so the app doesn't crash on null profile
    insert into public.tracker_profiles (id, full_name, role)
    values (
      new.id,
      split_part(new.email, '@', 1),
      'CLIENT_USER'
    );
  end if;

  return new;
end;
$$ language plpgsql security definer;

-- Trigger the function on new user creation
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
