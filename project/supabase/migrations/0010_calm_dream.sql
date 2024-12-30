/*
  # Create vendor account with proper authentication

  1. Changes
    - Creates vendor user with proper authentication setup
    - Ensures profile exists with vendor role
    - Sets up proper password hashing
*/

-- First, ensure the auth schema extensions are enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  vendor_id uuid;
  email_addr text := 'vendor@example.com';
  pwd text := 'vendor123';
BEGIN
  -- Check if vendor exists
  SELECT id INTO vendor_id
  FROM auth.users
  WHERE email = email_addr;

  IF vendor_id IS NULL THEN
    -- Create new vendor user
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role
    ) VALUES (
      gen_random_uuid(),
      email_addr,
      crypt(pwd, gen_salt('bf')),
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      'authenticated',
      'authenticated'
    )
    RETURNING id INTO vendor_id;

    -- Ensure profile exists with vendor role
    INSERT INTO public.profiles (id, role)
    VALUES (vendor_id, 'vendor')
    ON CONFLICT (id) DO UPDATE
    SET role = 'vendor';
  END IF;
END $$;