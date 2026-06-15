// ============================================
// LUXUDIES - Wishlist Store (Zustand)
// ============================================

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Product } from '@/types';
import { createClient } from '@/lib/supabase/client';

interface WishlistStore {
  items: Product[];

  // Actions
  addItem: (product: Product) => Promise<void>;
  removeItem: (productId: string) => Promise<void>;
  toggleItem: (product: Product) => Promise<void>;
  clearWishlist: () => Promise<void>;
  syncWishlist: () => Promise<void>;

  // Queries
  isInWishlist: (productId: string) => boolean;
  getItemCount: () => number;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: async (product) => {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          import('react-hot-toast').then(toast => {
            toast.default.error('Please sign in to add items to your wishlist');
          });
          if (typeof window !== 'undefined') {
            window.location.href = '/auth/login?redirect=/shop';
          }
          return;
        }

        let isNew = false;
        set((state) => {
          if (state.items.find((item) => item.id === product.id)) return state;
          isNew = true;
          return { items: [...state.items, product] };
        });

        if (isNew) {
          try {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user) {
              await supabase.from('wishlists').insert({
                user_id: user.id,
                product_id: product.id
              });
            }
          } catch (e) {}
        }
      },

      removeItem: async (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('wishlists').delete()
              .eq('user_id', user.id)
              .eq('product_id', productId);
          }
        } catch (e) {}
      },

      toggleItem: async (product) => {
        const isInList = get().isInWishlist(product.id);
        if (isInList) {
          await get().removeItem(product.id);
        } else {
          await get().addItem(product);
        }
      },

      clearWishlist: async () => {
        set({ items: [] });
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (user) {
            await supabase.from('wishlists').delete().eq('user_id', user.id);
          }
        } catch (e) {}
      },

      syncWishlist: async () => {
        try {
          const supabase = createClient();
          const { data: { user } } = await supabase.auth.getUser();
          if (!user) return;

          const { data: dbWishlists, error } = await supabase
            .from('wishlists')
            .select(`product:products(*)`)
            .eq('user_id', user.id);
            
          if (error || !dbWishlists) return;
          
          if (dbWishlists.length > 0) {
            const syncedItems = dbWishlists.map(w => Array.isArray(w.product) ? w.product[0] : w.product) as Product[];
            set({ items: syncedItems });
          } else {
             const localItems = get().items;
             for (const item of localItems) {
               await supabase.from('wishlists').insert({
                 user_id: user.id,
                 product_id: item.id
               }).select().single();
             }
          }
        } catch (error) {
          console.error("Wishlist sync failed", error);
        }
      },

      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },

      getItemCount: () => {
        return get().items.length;
      },
    }),
    {
      name: 'luxudies-wishlist',
    }
  )
);
