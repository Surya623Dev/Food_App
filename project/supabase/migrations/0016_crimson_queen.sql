/*
  # Fix Vendor Authentication and Access

  1. Changes
    - Update existing vendor account if it exists
    - Ensure proper role assignment
    - Set up correct access policies
    - Add performance indexes

  2. Security
    - Maintain RLS policies
    - Update authentication settings
*/

-- Reset auth schema configuration
ALTER ROLE authenticated SET search_path = public;
ALTER ROLE service_role SET search_path = public;

-- Ensure proper indexes exist
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles(role);

-- Update vendor account with proper configuration
DO $$
DECLARE
  existing_vendor_id uuid;
BEGIN
  -- Check if vendor exists
  SELECT id INTO existing_vendor_id
  FROM auth.users
  WHERE email = 'vendor@test.com';

  IF existing_vendor_id IS NULL THEN
    -- Create new vendor user if doesn't exist
    existing_vendor_id := gen_random_uuid();
    
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
      existing_vendor_id,
      '00000000-0000-0000-0000-000000000000',
      'vendor@test.com',
      crypt('vendor123', gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}',
      '{}',
      'authenticated',
      'authenticated',
      now(),
      now()
    );
  ELSE
    -- Update existing vendor's password
    UPDATE auth.users
    SET 
      encrypted_password = crypt('vendor123', gen_salt('bf')),
      updated_at = now()
    WHERE id = existing_vendor_id;
  END IF;

  -- Ensure profile exists with vendor role
  INSERT INTO profiles (id, role)
  VALUES (existing_vendor_id, 'vendor')
  ON CONFLICT (id) DO UPDATE
  SET role = 'vendor';

END $$;

-- Ensure proper access policies
DROP POLICY IF EXISTS "Orders are viewable by all authenticated users" ON orders;
CREATE POLICY "Orders are viewable by all authenticated users"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Orders are updatable by vendors"
  ON orders FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'vendor'
    )
  );