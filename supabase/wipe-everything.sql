-- ===========================================
-- LUXUDIES - WIPE EVERYTHING (DANGER ZONE)
-- ===========================================
-- Run this in Supabase SQL Editor to COMPLETELY destroy everything
-- and start 100% fresh.

-- 1. Wipe all Authentication Users
DELETE FROM auth.users;

-- 2. Storage Buckets (Manual Action Required)
-- Supabase blocks direct SQL deletion of storage objects to prevent orphaned files in S3.
-- Please go to the "Storage" tab in your Supabase Dashboard and manually delete your buckets.
-- 3. Drop all custom tables, policies, functions, and triggers in public schema
-- The easiest way to do this without writing 50 DROP statements is to 
-- drop the public schema and recreate it.
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

-- 4. Restore default permissions to the new public schema (Crucial for Supabase to work)
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL ROUTINES IN SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON TABLES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO postgres, anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON SEQUENCES TO postgres, anon, authenticated, service_role;

-- DONE! Your database is now completely empty.
