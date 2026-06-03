// ============================================
// LUXUDIES - Admin Settings Page
// ============================================

'use client';

import { motion } from 'framer-motion';
import { Settings, Store, Truck, CreditCard, Bell, Globe } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';

export default function AdminSettingsPage() {
  const inputClasses = "w-full h-10 px-4 bg-white/60 border border-gold-400/15 rounded-[10px] text-sm font-inter text-espresso focus:outline-none focus:border-gold-400/40 transition-all";

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="font-playfair text-2xl font-bold text-espresso">Settings</h1>
        <p className="font-inter text-sm text-espresso-200">Manage your store configuration</p>
      </motion.div>

      <div className="space-y-6 max-w-2xl">
        {/* Store Info */}
        <GlassCard variant="strong" padding="lg">
          <div className="flex items-center gap-3 mb-5">
            <Store className="w-5 h-5 text-gold-500" />
            <h2 className="font-inter font-semibold text-espresso">Store Information</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-inter font-semibold text-espresso-300 uppercase tracking-wider mb-1.5 block">Store Name</label>
              <input type="text" defaultValue="LUXUDIES" className={inputClasses} />
            </div>
            <div>
              <label className="text-xs font-inter font-semibold text-espresso-300 uppercase tracking-wider mb-1.5 block">Contact Email</label>
              <input type="email" defaultValue="hello@luxudies.com" className={inputClasses} />
            </div>
            <div>
              <label className="text-xs font-inter font-semibold text-espresso-300 uppercase tracking-wider mb-1.5 block">Phone</label>
              <input type="tel" defaultValue="+91 98765 43210" className={inputClasses} />
            </div>
            <div>
              <label className="text-xs font-inter font-semibold text-espresso-300 uppercase tracking-wider mb-1.5 block">WhatsApp</label>
              <input type="tel" defaultValue="+91 98765 43210" className={inputClasses} />
            </div>
          </div>
        </GlassCard>

        {/* Shipping */}
        <GlassCard variant="strong" padding="lg">
          <div className="flex items-center gap-3 mb-5">
            <Truck className="w-5 h-5 text-gold-500" />
            <h2 className="font-inter font-semibold text-espresso">Shipping</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-inter font-semibold text-espresso-300 uppercase tracking-wider mb-1.5 block">Shipping Region</label>
              <input type="text" defaultValue="Tamil Nadu" className={inputClasses} readOnly />
            </div>
            <div>
              <label className="text-xs font-inter font-semibold text-espresso-300 uppercase tracking-wider mb-1.5 block">Shipping Cost</label>
              <input type="text" defaultValue="FREE" className={`${inputClasses} text-green-600 font-semibold`} readOnly />
            </div>
            <div>
              <label className="text-xs font-inter font-semibold text-espresso-300 uppercase tracking-wider mb-1.5 block">Min Delivery Days</label>
              <input type="number" defaultValue="3" className={inputClasses} />
            </div>
            <div>
              <label className="text-xs font-inter font-semibold text-espresso-300 uppercase tracking-wider mb-1.5 block">Max Delivery Days</label>
              <input type="number" defaultValue="7" className={inputClasses} />
            </div>
          </div>
        </GlassCard>

        {/* Payment */}
        <GlassCard variant="strong" padding="lg">
          <div className="flex items-center gap-3 mb-5">
            <CreditCard className="w-5 h-5 text-gold-500" />
            <h2 className="font-inter font-semibold text-espresso">Payment (Razorpay)</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-inter font-semibold text-espresso-300 uppercase tracking-wider mb-1.5 block">Mode</label>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-xs font-inter font-semibold bg-yellow-50 text-yellow-700">TEST MODE</span>
                <span className="text-xs font-inter text-espresso-200">Switch to live mode when ready for production</span>
              </div>
            </div>
            <div>
              <label className="text-xs font-inter font-semibold text-espresso-300 uppercase tracking-wider mb-1.5 block">Key ID</label>
              <input type="text" defaultValue="rzp_test_•••••••••" className={inputClasses} readOnly />
            </div>
          </div>
        </GlassCard>

        <Button size="lg">Save Settings</Button>
      </div>
    </div>
  );
}
