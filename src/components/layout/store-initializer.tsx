'use client';

import { useEffect } from 'react';
import { useCartStore } from '@/store/cart-store';
import { useWishlistStore } from '@/store/wishlist-store';

export default function StoreInitializer() {
  const syncCart = useCartStore((s) => s.syncCart);
  const syncWishlist = useWishlistStore((s) => s.syncWishlist);

  useEffect(() => {
    // Fire syncs in background on app load
    syncCart();
    syncWishlist();
  }, [syncCart, syncWishlist]);

  return null;
}
