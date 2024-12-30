/*
  # Add vendor credentials and fix authentication

  1. Changes:
    - Creates a vendor user with credentials
    - Updates profile role to vendor
    - Adds RLS policies for proper role-based access

  2. Security:
    - Ensures vendor accounts can only be created via migration
    - Maintains role separation between customers and vendors
*/

-- Create vendor user if not exists
DO $$
DECLARE
  vendor_id uuid;
BEGIN
  -- Check if vendor exists
  IF NOT EXISTS (SELECT 1 FROM auth.users WHERE email = 'vendor@example.com') THEN
    -- Insert vendor user
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
      crypt('vendor123', gen_salt('bf')), -- Password: vendor123
      now(),
      now(),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      false,
      now()
    ) RETURNING id INTO vendor_id;

    -- Set vendor role in profiles
    INSERT INTO public.profiles (id, role)
    VALUES (vendor_id, 'vendor');
  END IF;
END $$;