/*
  # Fix authentication schema and policies

  1. Changes
    - Ensures auth schema is properly configured
    - Updates user authentication policies
    - Fixes profile table permissions
*/

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Update profiles table permissions
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies to avoid conflicts
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;

-- Create comprehensive profile policies
CREATE POLICY "Profiles are viewable by users" ON profiles
    FOR SELECT USING (true);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = id);

-- Ensure auth schema is properly configured
DO $$
BEGIN
    -- Reset vendor password
    UPDATE auth.users
    SET encrypted_password = crypt('vendor123', gen_salt('bf'))
    WHERE email = 'vendor@example.com';

    -- Ensure vendor profile exists
    INSERT INTO public.profiles (id, role)
    SELECT id, 'vendor'
    FROM auth.users
    WHERE email = 'vendor@example.com'
    ON CONFLICT (id) DO UPDATE
    SET role = 'vendor';
END $$;