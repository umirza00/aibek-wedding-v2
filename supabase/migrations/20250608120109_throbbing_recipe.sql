/*
  # Fix Admin Access and RLS Policies

  1. Security Updates
    - Ensure admin users can perform all operations on web_content
    - Create initial admin user if none exists
    - Fix RLS policies for proper admin access

  2. Changes
    - Update RLS policies to ensure admin access works correctly
    - Add function to create admin user
    - Ensure proper permissions for authenticated admin users
*/

-- Function to get current user's role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid uuid DEFAULT auth.uid())
RETURNS text AS $$
BEGIN
  RETURN (
    SELECT role 
    FROM user_roles 
    WHERE user_id = user_uuid
    LIMIT 1
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
  RETURN (
    SELECT EXISTS (
      SELECT 1 
      FROM user_roles 
      WHERE user_id = user_uuid 
      AND role = 'admin'
    )
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing policies to recreate them
DROP POLICY IF EXISTS "Admins can manage all content" ON web_content;
DROP POLICY IF EXISTS "Public can read content" ON web_content;

-- Recreate web_content policies with better admin access
CREATE POLICY "Public can read content"
  ON web_content
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage all content"
  ON web_content
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Drop existing policies for user_roles to recreate them
DROP POLICY IF EXISTS "Admins can manage all user roles" ON user_roles;
DROP POLICY IF EXISTS "Users can read their own role" ON user_roles;

-- Recreate user_roles policies
CREATE POLICY "Users can read their own role"
  ON user_roles
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Admins can manage all user roles"
  ON user_roles
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Drop existing policies for wedding_settings to recreate them
DROP POLICY IF EXISTS "Admins can manage wedding settings" ON wedding_settings;
DROP POLICY IF EXISTS "Public can read wedding settings" ON wedding_settings;

-- Recreate wedding_settings policies
CREATE POLICY "Public can read wedding settings"
  ON wedding_settings
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Admins can manage wedding settings"
  ON wedding_settings
  FOR ALL
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- Function to create admin user (call this manually with your user ID)
CREATE OR REPLACE FUNCTION create_admin_user(admin_user_id uuid)
RETURNS void AS $$
BEGIN
  -- Insert or update user role to admin
  INSERT INTO user_roles (user_id, role)
  VALUES (admin_user_id, 'admin')
  ON CONFLICT (user_id) 
  DO UPDATE SET 
    role = 'admin',
    updated_at = now();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO authenticated;

-- Ensure RLS is enabled on all tables
ALTER TABLE web_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE wedding_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_roles ENABLE ROW LEVEL SECURITY;