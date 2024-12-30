/*
  # Fix vendor authentication and profiles

  1. Changes
    - Updates existing vendor account if found
    - Creates new vendor account if not exists
    - Ensures proper profile role assignment
    - Sets up RLS policies for profiles
*/

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

DO $$
DECLARE
  vendor_id uuid;
  vendor_email text := 'vendor@example.com';
BEGIN
  -- Try to find existing vendor
  SELECT id INTO vendor_id
  FROM auth.users
  WHERE email = vendor_email;

  IF vendor_id IS NULL THEN
    -- Create new vendor user if doesn't exist
    INSERT INTO auth.users (
      id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      confirmed_at,
      created_at,
      updated_at
    ) VALUES (
      gen_random_uuid(),
      vendor_email,
      crypt('vendor123', gen_salt('bf')),
      now(),
      jsonb_build_object('provider', 'email', 'providers', array['email']),
      '{}'::jsonb,
      'authenticated',
      'authenticated',
      now(),
      now(),
      now()
    )
    RETURNING id INTO vendor_id;
  ELSE
    -- Update existing vendor's password
    UPDATE auth.users
    SET 
      encrypted_password = crypt('vendor123', gen_salt('bf')),
      updated_at = now()
    WHERE id = vendor_id;
  END IF;

  -- Ensure vendor profile exists with correct role
  INSERT INTO public.profiles (id, role)
  VALUES (vendor_id, 'vendor')
  ON CONFLICT (id) DO UPDATE
  SET role = 'vendor';
END $$;

-- Ensure proper RLS policies
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Recreate policies with proper permissions
DROP POLICY IF EXISTS "Allow public read access" ON profiles;
DROP POLICY IF EXISTS "Allow authenticated update" ON profiles;

CREATE POLICY "Allow public read access"
  ON public.profiles FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Allow authenticated update"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id);