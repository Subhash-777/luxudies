-- ===========================================
-- LUXUDIES - Fix Admin Access RLS
-- ===========================================
-- Run this in Supabase SQL Editor if admin access isn't working.
-- This ensures any authenticated user can read their OWN role from the users table.

-- Drop potentially conflicting policies
DROP POLICY IF EXISTS "Users can read own profile" ON public.users;
DROP POLICY IF EXISTS "Admins can do all on users" ON public.users;

-- Recreate: Any authenticated user can read their own row
CREATE POLICY "Users can read own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

-- Any authenticated user can update their own row  
DROP POLICY IF EXISTS "Users can update own profile" ON public.users;
CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Admins can read ALL user rows (for admin panel customer list)
CREATE POLICY "Admins can read all users" ON public.users
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Admins can update any user row (for changing roles, etc.)
CREATE POLICY "Admins can update all users" ON public.users
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM public.users u WHERE u.id = auth.uid() AND u.role = 'admin')
  );

-- Verify: Run this to check your user has admin role
-- SELECT id, full_name, email, role FROM public.users;
