-- =============================================================================
-- SnackCart Administrator Bootstrap Procedure
-- Usage: Execute in the Supabase SQL Editor to grant admin privileges to a user
-- =============================================================================

-- Step 1: Replace 'admin@snackcart.local' with the actual registered email
DO $$
DECLARE
    target_email TEXT := 'admin@snackcart.local';
    target_user_id UUID;
BEGIN
    SELECT id INTO target_user_id
    FROM auth.users
    WHERE email = target_email;

    IF target_user_id IS NULL THEN
        RAISE NOTICE 'User with email % not found. Please register this user via the application sign-up first.', target_email;
    ELSE
        -- Update the profile role to 'admin' using direct privileged SQL
        UPDATE public.profiles
        SET role = 'admin', updated_at = timezone('utc', now())
        WHERE id = target_user_id;

        RAISE NOTICE 'Successfully granted admin privileges to user % (%)', target_email, target_user_id;
    END IF;
END;
$$;
