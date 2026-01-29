DO $$
DECLARE
  target_user_id uuid;
  invite_record record;
BEGIN
  -- Get User ID safely
  SELECT id INTO target_user_id FROM auth.users WHERE email = 'otro@laimu.mx';

  -- Get Invitation Info
  SELECT * INTO invite_record FROM public.tracker_invitations WHERE email = 'otro@laimu.mx' limit 1;

  -- Log for debugging (visible if run in dashboard, but silent here)
  -- Perform UPSERT
  IF target_user_id IS NOT NULL THEN
    -- If invite exists, use it. If not, create incomplete profile so user can at least exist.
    IF invite_record IS NOT NULL THEN
        INSERT INTO public.tracker_profiles (id, full_name, role, organization_id)
        VALUES (
          target_user_id,
          COALESCE(invite_record.email, 'Usuario'),
          invite_record.role::public.user_role,
          invite_record.organization_id
        )
        ON CONFLICT (id) DO UPDATE
        SET organization_id = EXCLUDED.organization_id,
            role = EXCLUDED.role;
            
        -- Ensure invite is accepted
        UPDATE public.tracker_invitations SET status = 'ACCEPTED' WHERE id = invite_record.id;
    ELSE
        -- Fallback if no invite found (shouldn't happen based on user report, but safety first)
        INSERT INTO public.tracker_profiles (id, full_name, role)
        VALUES (target_user_id, 'Usuario Sin Invitacion', 'CLIENT_USER')
        ON CONFLICT (id) DO NOTHING;
    END IF;
  END IF;
END $$;
