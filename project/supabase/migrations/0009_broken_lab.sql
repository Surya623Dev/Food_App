/*
  # Fix vendor user setup

  1. Changes
    - Safely handle existing vendor user
    - Update profile role if exists
    - Create new vendor if doesn't exist
  2. Security
    - Maintains referential integrity
    - Preserves existing data
*/

DO $$
DECLARE
  vendor_id uuid;
BEGIN
  -- First try to find existing vendor
  SELECT id INTO vendor_id
  FROM auth.users
  WHERE email = 'vendor@example.com';

  IF vendor_id IS NULL THEN
    -- Create new vendor user if doesn't exist
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at,
      raw_app_meta_data,
      raw_user_meta_data,
      is_super_admin,
      confirmed_at
    ) VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'vendor@example.com',
      crypt('vendor123', gen_salt('bf')),
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      false,
      now()
    ) RETURNING id INTO vendor_id;

    -- Create profile for new vendor
    INSERT INTO public.profiles (id, role)
    VALUES (vendor_id, 'vendor');
  ELSE
    -- Update existing vendor's profile
    UPDATE public.profiles
    SET role = 'vendor'
    WHERE id = vendor_id;
  END IF;
END $$;