-- ============================================
-- LUXUDIES - Admin RLS Policies
-- ============================================
-- Run this in Supabase SQL Editor to grant admin users the ability to manage the store.

-- 1. Create a helper function to check if the current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Add FULL ACCESS policies for Admins on all necessary tables
CREATE POLICY "Admins can do all on categories" ON public.categories FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can do all on products" ON public.products FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can do all on product images" ON public.product_images FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can do all on product variants" ON public.product_variants FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can do all on combos" ON public.combos FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can do all on combo items" ON public.combo_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can do all on banners" ON public.banners FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can do all on orders" ON public.orders FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can do all on order items" ON public.order_items FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can do all on order history" ON public.order_status_history FOR ALL USING (public.is_admin());
CREATE POLICY "Admins can do all on reviews" ON public.reviews FOR ALL USING (public.is_admin());
