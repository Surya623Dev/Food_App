/*
  # Update orders table schema

  1. Changes
    - Add items_json column to store order items
    - Update RLS policies
*/

-- Add items_json column to orders table
ALTER TABLE orders ADD COLUMN items_json JSONB NOT NULL DEFAULT '[]';

-- Update RLS policies for the new column
CREATE POLICY "Vendors can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Vendors can update order status"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);