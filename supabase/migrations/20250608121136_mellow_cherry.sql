/*
  # Create Admin User for Static Authentication

  1. Creates an admin user in Supabase auth
  2. Assigns admin role in user_roles table
  3. Ensures proper permissions for admin operations

  This migration creates the necessary Supabase user that will be used
  behind the scenes when someone logs in with static credentials.
*/

-- First, we need to create the admin user in auth.users
-- This needs to be done manually in Supabase dashboard or via API
-- Email: admin@wedding.local
-- Password: Admin2025!SuperSecure

-- Function to create admin user role (run after creating the auth user)
CREATE OR REPLACE FUNCTION setup_admin_user()
RETURNS void AS $$
DECLARE
  admin_user_id uuid;
BEGIN
  -- Get the admin user ID from auth.users
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@wedding.local'
  LIMIT 1;
  
  IF admin_user_id IS NOT NULL THEN
    -- Insert or update user role to admin
    INSERT INTO user_roles (user_id, role)
    VALUES (admin_user_id, 'admin')
    ON CONFLICT (user_id) 
    DO UPDATE SET 
      role = 'admin',
      updated_at = now();
      
    RAISE NOTICE 'Admin user role created for user ID: %', admin_user_id;
  ELSE
    RAISE NOTICE 'Admin user not found. Please create user with email admin@wedding.local first.';
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Call the function to set up admin user
-- Note: This will only work if the auth user exists
SELECT setup_admin_user();

-- Clean up the function
DROP FUNCTION setup_admin_user();