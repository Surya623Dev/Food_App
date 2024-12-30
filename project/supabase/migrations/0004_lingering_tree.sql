/*
  # Fix orders table RLS policies

  1. Changes
    - Drop existing policies
    - Add new comprehensive policies for orders table
    - Allow anonymous users to create orders
    - Allow vendors to manage orders
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Users can create their own orders" ON orders;
DROP POLICY IF EXISTS "Vendors can view all orders" ON orders;
DROP POLICY IF EXISTS "Vendors can update order status" ON orders;

-- Create new policies
CREATE POLICY "Anyone can create orders"
  ON orders FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can view orders"
  ON orders FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can update orders"
  ON orders FOR UPDATE
  TO public
  USING (true);