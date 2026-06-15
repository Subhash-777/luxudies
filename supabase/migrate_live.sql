-- ============================================
-- LUXUDIES - GO LIVE MIGRATION SCRIPT
-- ============================================
-- RUN THIS IN YOUR SUPABASE SQL EDITOR TO WIPE ALL DUMMY USER DATA
-- AND CREATE THE NEW CART SYNCING TABLES.

-- 1. Create cart_items table
CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
  variant_id UUID REFERENCES public.product_variants(id) ON DELETE SET NULL,
  quantity INT NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, product_id, variant_id)
);

-- 2. Add RLS Policies for cart_items
ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can read own cart" ON public.cart_items;
CREATE POLICY "Users can read own cart" ON public.cart_items FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can add to cart" ON public.cart_items;
CREATE POLICY "Users can add to cart" ON public.cart_items FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own cart" ON public.cart_items;
CREATE POLICY "Users can update own cart" ON public.cart_items FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can remove from cart" ON public.cart_items;
CREATE POLICY "Users can remove from cart" ON public.cart_items FOR DELETE USING (auth.uid() = user_id);

-- 3. Add Indexes & Triggers
CREATE INDEX IF NOT EXISTS idx_cart_items_user ON public.cart_items(user_id);

DROP TRIGGER IF EXISTS set_cart_items_updated_at ON public.cart_items;
CREATE TRIGGER set_cart_items_updated_at BEFORE UPDATE ON public.cart_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 4. TRUNCATE ALL DUMMY USER DATA (Keeps Products, Categories, Combos, Banners)
TRUNCATE TABLE public.users CASCADE;
-- (Because of ON DELETE CASCADE, truncating users will also delete all their addresses, orders, order_items, wishlists, and cart_items)

-- 5. Delete Auth Users to wipe dummy logins completely
-- Warning: This deletes ALL authenticated users from Supabase Auth!
DELETE FROM auth.users;

-- DONE! Your database is now a clean slate for production.
