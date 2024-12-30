/*
  # Add test vendor account

  1. Changes
    - Create auth user for vendor if not exists
    - Set up vendor profile if not exists
    - Add vendor details to vendors table
    
  2. Security
    - Password is securely hashed
    - Maintains existing RLS policies
*/

DO $$
DECLARE
  vendor_id uuid := gen_random_uuid();
  existing_user_id uuid;
BEGIN
  -- Check if user already exists
  SELECT id INTO existing_user_id
  FROM auth.users
  WHERE email = 'testvendor@example.com';

  IF existing_user_id IS NULL THEN
    -- Create new auth user for vendor
    INSERT INTO auth.users (
      id,
      instance_id,
      email,
      encrypted_password,
      email_confirmed_at,
      raw_app_meta_data,
      raw_user_meta_data,
      aud,
      role,
      created_at,
      updated_at
    ) VALUES (
      vendor_id,
      '00000000-0000-0000-0000-000000000000',
      'testvendor@example.com',
      crypt('vendor123', gen_salt('bf')), -- Password: vendor123
      now(),
      '{"provider": "email", "providers": ["email"]}',
      '{}',
      'authenticated',
      'authenticated',
      now(),
      now()
    );

    -- Create vendor profile
    INSERT INTO public.profiles (id, role)
    VALUES (vendor_id, 'vendor')
    ON CONFLICT (id) DO UPDATE
    SET role = 'vendor';

    -- Add vendor details
    INSERT INTO public.vendors (
      id,
      name,
      email,
      phone,
      address
    ) VALUES (
      vendor_id,
      'Test Vendor',
      'testvendor@example.com',
      '+1234567890',
      '123 Test Street, Test City'
    )
    ON CONFLICT (email) DO NOTHING;
  END IF;
END $$;