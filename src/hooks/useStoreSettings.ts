// ============================================
// LUXUDIES - Shared Store Settings Hook
// Fetches settings from Supabase once and caches them.
// Used by announcement bar, WhatsApp FAB, footer, checkout.
// ============================================

import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';

export interface StoreSettings {
  store_name: string;
  contact_email: string;
  phone: string;
  whatsapp: string;                    // digits only, e.g. "919999999999"
  free_shipping_state: string;
  shipping_cost_other: number;
  min_delivery_days: number;
  max_delivery_days: number;
  announcement_quotes: string[];       // array of scrolling quotes
  instagram_url: string;
  facebook_url: string;
  updated_at?: string;
}

export const DEFAULT_SETTINGS: StoreSettings = {
  store_name: 'LUXUDIES',
  contact_email: 'hello@luxudies.com',
  phone: '+91 99999 99999',
  whatsapp: '919999999999',
  free_shipping_state: 'Tamil Nadu',
  shipping_cost_other: 99,
  min_delivery_days: 3,
  max_delivery_days: 7,
  announcement_quotes: [
    'Free Delivery Across Tamil Nadu • ₹99 for Other States',
    'Extra 10% off on your first order — Use code LUXE10',
    'Anti-Tarnish • Lightweight • Premium Quality',
  ],
  instagram_url: '',
  facebook_url: '',
};

/** In-memory cache so multiple components don't refetch on the same page */
let cachedSettings: StoreSettings | null = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function useStoreSettings() {
  const [settings, setSettings] = useState<StoreSettings>(
    cachedSettings ?? DEFAULT_SETTINGS
  );
  const [isLoading, setIsLoading] = useState(!cachedSettings);
  const supabase = createClient();

  useEffect(() => {
    const now = Date.now();
    if (cachedSettings && now - cacheTimestamp < CACHE_TTL_MS) {
      setSettings(cachedSettings);
      setIsLoading(false);
      return;
    }

    supabase
      .from('store_settings')
      .select('*')
      .eq('id', 'singleton')
      .single()
      .then(({ data, error }) => {
        if (error || !data) {
          setSettings(DEFAULT_SETTINGS);
          setIsLoading(false);
          return;
        }

        const loaded: StoreSettings = {
          store_name: data.store_name ?? DEFAULT_SETTINGS.store_name,
          contact_email: data.contact_email ?? DEFAULT_SETTINGS.contact_email,
          phone: data.phone ?? DEFAULT_SETTINGS.phone,
          whatsapp: data.whatsapp ?? DEFAULT_SETTINGS.whatsapp,
          free_shipping_state: data.free_shipping_state ?? DEFAULT_SETTINGS.free_shipping_state,
          shipping_cost_other: data.shipping_cost_other ?? DEFAULT_SETTINGS.shipping_cost_other,
          min_delivery_days: data.min_delivery_days ?? DEFAULT_SETTINGS.min_delivery_days,
          max_delivery_days: data.max_delivery_days ?? DEFAULT_SETTINGS.max_delivery_days,
          announcement_quotes: Array.isArray(data.announcement_quotes) && data.announcement_quotes.length > 0
            ? data.announcement_quotes
            : DEFAULT_SETTINGS.announcement_quotes,
          instagram_url: data.instagram_url ?? '',
          facebook_url: data.facebook_url ?? '',
          updated_at: data.updated_at,
        };

        cachedSettings = loaded;
        cacheTimestamp = Date.now();
        setSettings(loaded);
        setIsLoading(false);
      });
  }, []);

  /** Call this after saving settings in admin to invalidate the cache */
  const invalidateCache = () => {
    cachedSettings = null;
    cacheTimestamp = 0;
  };

  return { settings, isLoading, invalidateCache };
}
