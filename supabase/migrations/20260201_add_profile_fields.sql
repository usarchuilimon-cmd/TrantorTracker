-- Add new columns to tracker_profiles
ALTER TABLE public.tracker_profiles
ADD COLUMN IF NOT EXISTS phone text,
ADD COLUMN IF NOT EXISTS job_title text,
ADD COLUMN IF NOT EXISTS department text;

-- Update the handle_new_user function to use metadata
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
DECLARE
  invite_record record;
  meta_full_name text;
  meta_phone text;
  meta_job_title text;
  meta_department text;
BEGIN
  -- Extract metadata (with fallbacks)
  meta_full_name := new.raw_user_meta_data->>'full_name';
  if meta_full_name is null then
    meta_full_name := split_part(new.email, '@', 1);
  end if;
  
  meta_phone := new.raw_user_meta_data->>'phone';
  meta_job_title := new.raw_user_meta_data->>'job_title';
  meta_department := new.raw_user_meta_data->>'department';

  -- Check for pending invitation by email
  SELECT * INTO invite_record
  FROM public.tracker_invitations
  WHERE email = new.email
  AND status = 'PENDING'
  ORDER BY created_at DESC
  LIMIT 1;

  IF found THEN
    -- If invitation exists, create profile with linked organization and role
    INSERT INTO public.tracker_profiles (id, full_name, role, organization_id, phone, job_title, department)
    VALUES (
      new.id,
      meta_full_name,
      invite_record.role::public.user_role,
      invite_record.organization_id,
      meta_phone,
      meta_job_title,
      meta_department
    );

    -- Update invitation status
    UPDATE public.tracker_invitations
    SET status = 'ACCEPTED'
    WHERE id = invite_record.id;
  ELSE
    -- If no invitation, create default profile
    INSERT INTO public.tracker_profiles (id, full_name, role, phone, job_title, department)
    VALUES (
      new.id,
      meta_full_name,
      'CLIENT_USER',
      meta_phone,
      meta_job_title,
      meta_department
    );
  END IF;

  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
