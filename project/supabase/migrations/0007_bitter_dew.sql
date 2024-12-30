-- Create a vendor user and set their role
DO $$
BEGIN
  -- First check if the vendor account already exists
  IF NOT EXISTS (
    SELECT 1 FROM auth.users WHERE email = 'vendor@example.com'
  ) THEN
    -- Insert the vendor user into auth.users
    INSERT INTO auth.users (
      instance_id,
      id,
      aud,
      role,
      email,
      encrypted_password,
      email_confirmed_at,
      created_at,
      updated_at
    )
    VALUES (
      '00000000-0000-0000-0000-000000000000',
      gen_random_uuid(),
      'authenticated',
      'authenticated',
      'vendor@example.com',
      crypt('vendor123', gen_salt('bf')),
      now(),
      now(),
      now()
    );

    -- Set their role to vendor in the profiles table
    UPDATE profiles
    SET role = 'vendor'
    WHERE id = (
      SELECT id FROM auth.users WHERE email = 'vendor@example.com'
    );
  END IF;
END $$;