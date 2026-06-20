-- ===========================================
-- LUXUDIES - Supabase Storage Master Script
-- ===========================================
-- Run this in Supabase SQL Editor AFTER schema.sql

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('products', 'products', TRUE, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('banners', 'banners', TRUE, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/avif']),
  ('avatars', 'avatars', TRUE, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp'])
ON CONFLICT (id) DO NOTHING;

-- Storage RLS policies

-- Products bucket: public read, admin write
CREATE POLICY "Public can view product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Admins can upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' 
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'products'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Banners bucket: public read, admin write
CREATE POLICY "Public can view banners" ON storage.objects
  FOR SELECT USING (bucket_id = 'banners');

CREATE POLICY "Admins can upload banners" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'banners'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Admins can delete banners" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'banners'
    AND EXISTS (SELECT 1 FROM public.users WHERE id = auth.uid() AND role = 'admin')
  );

-- Avatars bucket: public read, owner write
CREATE POLICY "Public can view avatars" ON storage.objects
  FOR SELECT USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload own avatar" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update own avatar" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'avatars'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
