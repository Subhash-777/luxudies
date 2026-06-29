// ============================================
// LUXUDIES - Admin Settings Page (Fully Functional)
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Store, Truck, CreditCard, Bell, Globe,
  Save, RefreshCw, CheckCircle2, Link as LinkIcon,
  MessageCircle, Loader2,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface StoreSettings {
  store_name: string;
  contact_email: string;
  phone: string;
  whatsapp: string;
  free_shipping_state: string;
  shipping_cost_other: number;
  min_delivery_days: number;
  max_delivery_days: number;
  announcement_quotes: string[];
  instagram_url: string;
  facebook_url: string;
}

const defaultSettings: StoreSettings = {
  store_name: 'LUXUDIES',
  contact_email: 'hello@luxudies.com',
  phone: '+91 98765 43210',
  whatsapp: '+91 98765 43210',
  free_shipping_state: 'Tamil Nadu',
  shipping_cost_other: 99,
  min_delivery_days: 3,
  max_delivery_days: 7,
  announcement_quotes: [
    'Extra 10% off on your first order • Use code LUXFIRST',
    'Free Delivery Across Tamil Nadu • ₹99 for Other States'
  ],
  instagram_url: '',
  facebook_url: '',
};

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<StoreSettings>(defaultSettings);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const supabase = createClient();

  const inputClasses =
    'w-full h-11 px-4 bg-white border border-gray-200 rounded-xl text-sm font-inter text-gray-800 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all';
  const labelClasses =
    'text-xs font-inter font-semibold text-gray-500 uppercase tracking-wider mb-1.5 block';

  // ── Load settings ──────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('store_settings')
          .select('*')
          .eq('id', 'singleton')
          .single();

        if (error) {
          // Table doesn't exist yet — use defaults, show SQL prompt
          console.warn('store_settings table missing:', error.message);
          setSettings(defaultSettings);
        } else if (data) {
          setSettings({
            store_name: data.store_name ?? defaultSettings.store_name,
            contact_email: data.contact_email ?? defaultSettings.contact_email,
            phone: data.phone ?? defaultSettings.phone,
            whatsapp: data.whatsapp ?? defaultSettings.whatsapp,
            free_shipping_state: data.free_shipping_state ?? defaultSettings.free_shipping_state,
            shipping_cost_other: data.shipping_cost_other ?? defaultSettings.shipping_cost_other,
            min_delivery_days: data.min_delivery_days ?? defaultSettings.min_delivery_days,
            max_delivery_days: data.max_delivery_days ?? defaultSettings.max_delivery_days,
            announcement_quotes: Array.isArray(data.announcement_quotes) && data.announcement_quotes.length > 0 
              ? data.announcement_quotes 
              : defaultSettings.announcement_quotes,
            instagram_url: data.instagram_url ?? '',
            facebook_url: data.facebook_url ?? '',
          });
          if (data.updated_at) setLastSaved(new Date(data.updated_at));
        }
      } finally {
        setIsLoading(false);
      }
    };
    load();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Save settings ──────────────────────────────────────────
  const handleSave = async () => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('store_settings')
        .upsert({
          id: 'singleton',
          ...settings,
          updated_at: new Date().toISOString(),
        });

      if (error) throw error;
      setLastSaved(new Date());
      toast.success('Settings saved successfully!');
    } catch (err: any) {
      console.error(err);
      toast.error(`Failed to save: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const set = (field: keyof StoreSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSettings((prev) => ({ ...prev, [field]: e.target.value }));

  const setNum = (field: keyof StoreSettings) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setSettings((prev) => ({ ...prev, [field]: Number(e.target.value) }));

  const addQuote = () => {
    setSettings((prev) => ({
      ...prev,
      announcement_quotes: [...prev.announcement_quotes, '']
    }));
  };

  const updateQuote = (index: number, value: string) => {
    setSettings((prev) => {
      const newQuotes = [...prev.announcement_quotes];
      newQuotes[index] = value;
      return { ...prev, announcement_quotes: newQuotes };
    });
  };

  const removeQuote = (index: number) => {
    setSettings((prev) => ({
      ...prev,
      announcement_quotes: prev.announcement_quotes.filter((_, i) => i !== index)
    }));
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[40vh]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-playfair text-2xl font-bold text-gray-900">Settings</h1>
            <p className="font-inter text-sm text-gray-400 mt-1">
              Manage your store configuration
              {lastSaved && (
                <span className="ml-2 text-green-500">
                  · Last saved {lastSaved.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
            </p>
          </div>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-inter font-semibold text-sm rounded-xl transition-all shadow-sm disabled:opacity-60"
          >
            {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            {isSaving ? 'Saving…' : 'Save Settings'}
          </button>
        </div>
      </motion.div>

      <div className="space-y-6">

        {/* ── Store Information ─────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-amber-50 flex items-center justify-center">
              <Store className="w-4 h-4 text-amber-600" />
            </div>
            <h2 className="font-inter font-semibold text-gray-900">Store Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Store Name</label>
              <input type="text" value={settings.store_name} onChange={set('store_name')} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Contact Email</label>
              <input type="email" value={settings.contact_email} onChange={set('contact_email')} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>Phone</label>
              <input type="tel" value={settings.phone} onChange={set('phone')} className={inputClasses} />
            </div>
            <div>
              <label className={labelClasses}>
                <MessageCircle className="w-3 h-3 inline mr-1" />
                WhatsApp Number
              </label>
              <input type="tel" value={settings.whatsapp} onChange={set('whatsapp')} className={inputClasses}
                placeholder="+91 9999999999" />
            </div>
          </div>
        </motion.div>

        {/* ── Announcement Bar ──────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center">
              <Bell className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="font-inter font-semibold text-gray-900">Announcement Bar Quotes</h2>
              <p className="text-xs font-inter text-gray-500 mt-0.5">These will scroll across the top of your website.</p>
            </div>
            <button
              onClick={addQuote}
              className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg text-xs font-inter font-semibold transition-colors"
            >
              + Add Quote
            </button>
          </div>
          
          <div className="space-y-3">
            {settings.announcement_quotes.map((quote, index) => (
              <div key={index} className="flex gap-2">
                <input 
                  type="text" 
                  value={quote} 
                  onChange={(e) => updateQuote(index, e.target.value)} 
                  className={inputClasses}
                  placeholder="e.g. Free shipping on orders over ₹999" 
                />
                <button
                  onClick={() => removeQuote(index)}
                  disabled={settings.announcement_quotes.length <= 1}
                  className="w-11 h-11 flex items-center justify-center shrink-0 border border-red-200 text-red-500 rounded-xl hover:bg-red-50 transition-colors disabled:opacity-40 disabled:hover:bg-transparent"
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            ))}
          </div>
          
          {settings.announcement_quotes.filter(q => q.trim()).length > 0 && (
            <div className="mt-5 px-4 py-3 bg-gray-900 rounded-xl flex items-center overflow-hidden">
              <div className="animate-[marquee_10s_linear_infinite] flex items-center whitespace-nowrap min-w-full text-white text-xs font-inter uppercase tracking-wider">
                {[...settings.announcement_quotes.filter(q => q.trim()), ...settings.announcement_quotes.filter(q => q.trim())].map((text, i) => (
                  <div key={i} className="flex items-center">
                    <span className="px-6">{text}</span>
                    <span className="w-1 h-1 rounded-full bg-amber-400 mx-2 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* ── Shipping ──────────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center">
              <Truck className="w-4 h-4 text-green-600" />
            </div>
            <h2 className="font-inter font-semibold text-gray-900">Shipping</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Free Shipping State</label>
              <input type="text" value={settings.free_shipping_state} onChange={set('free_shipping_state')} className={inputClasses} />
              <p className="text-xs text-gray-400 mt-1 font-inter">Orders from this state get free shipping</p>
            </div>
            <div>
              <label className={labelClasses}>Shipping Cost (other states) ₹</label>
              <input type="number" value={settings.shipping_cost_other} onChange={setNum('shipping_cost_other')}
                className={inputClasses} min={0} />
            </div>
            <div>
              <label className={labelClasses}>Min Delivery Days</label>
              <input type="number" value={settings.min_delivery_days} onChange={setNum('min_delivery_days')}
                className={inputClasses} min={1} max={30} />
            </div>
            <div>
              <label className={labelClasses}>Max Delivery Days</label>
              <input type="number" value={settings.max_delivery_days} onChange={setNum('max_delivery_days')}
                className={inputClasses} min={1} max={60} />
            </div>
          </div>
        </motion.div>

        {/* ── Social Links ──────────────────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-purple-50 flex items-center justify-center">
              <Globe className="w-4 h-4 text-purple-600" />
            </div>
            <h2 className="font-inter font-semibold text-gray-900">Social Links</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}><LinkIcon className="w-3 h-3 inline mr-1" />Instagram URL</label>
              <input type="url" value={settings.instagram_url} onChange={set('instagram_url')} className={inputClasses}
                placeholder="https://instagram.com/luxudies" />
            </div>
            <div>
              <label className={labelClasses}><LinkIcon className="w-3 h-3 inline mr-1" />Facebook URL</label>
              <input type="url" value={settings.facebook_url} onChange={set('facebook_url')} className={inputClasses}
                placeholder="https://facebook.com/luxudies" />
            </div>
          </div>
        </motion.div>

        {/* ── Payment (read-only info) ───────────────────────── */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-9 h-9 rounded-xl bg-yellow-50 flex items-center justify-center">
              <CreditCard className="w-4 h-4 text-yellow-600" />
            </div>
            <h2 className="font-inter font-semibold text-gray-900">Payment Gateway (Paytm)</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full text-xs font-inter font-semibold bg-yellow-50 text-yellow-700 border border-yellow-200">
                TEST MODE
              </span>
              <span className="text-xs font-inter text-gray-400">
                Switch to live mode in Vercel environment variables when ready
              </span>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>Merchant ID (MID)</label>
                <div className="h-11 px-4 flex items-center bg-gray-50 border border-gray-200 rounded-xl text-sm font-inter text-gray-500 font-mono">
                  {process.env.NEXT_PUBLIC_PAYTM_MID || 'Set in env vars'}
                </div>
              </div>
              <div>
                <label className={labelClasses}>Environment</label>
                <div className="h-11 px-4 flex items-center bg-gray-50 border border-gray-200 rounded-xl text-sm font-inter text-gray-500">
                  {process.env.NEXT_PUBLIC_PAYTM_ENVIRONMENT || 'STAGING'}
                </div>
              </div>
            </div>
            <p className="text-xs font-inter text-gray-400">
              To change payment keys, update them in your Vercel project environment variables.
            </p>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
          className="flex items-center justify-between pt-2 pb-8"
        >
          <button
            onClick={() => setSettings(defaultSettings)}
            className="flex items-center gap-2 px-4 py-2 text-sm font-inter text-gray-400 hover:text-gray-600 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Reset to defaults
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-inter font-bold text-sm rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-60"
          >
            {isSaving ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            {isSaving ? 'Saving…' : 'Save All Settings'}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
