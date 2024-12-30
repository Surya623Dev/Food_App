/*
  # Add customer details to orders table

  1. Changes
    - Add customer_name column (required)
    - Add customer_phone column (required)
    - Ensure existing RLS policies apply to new columns

  2. Notes
    - Both fields are required for new orders
    - Existing orders will need to be updated with customer details
*/

ALTER TABLE orders
ADD COLUMN customer_name text NOT NULL DEFAULT '',
ADD COLUMN customer_phone text NOT NULL DEFAULT '';

-- Remove the default constraints after adding the columns
ALTER TABLE orders 
ALTER COLUMN customer_name DROP DEFAULT,
ALTER COLUMN customer_phone DROP DEFAULT;