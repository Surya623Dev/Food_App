/*
  # Create vendors table and update auth system

  1. New Tables
    - `vendors`
      - `id` (uuid, primary key)
      - `name` (text)
      - `email` (text, unique)
      - `phone` (text)
      - `address` (text)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on `vendors` table
    - Add policies for vendor authentication
*/

CREATE TABLE vendors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text UNIQUE NOT NULL,
  phone text NOT NULL,
  address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE vendors ENABLE ROW LEVEL SECURITY;

-- Allow vendors to read their own data
CREATE POLICY "Vendors can read their own data"
  ON vendors FOR SELECT
  TO authenticated
  USING (auth.jwt() ->> 'email' = email);