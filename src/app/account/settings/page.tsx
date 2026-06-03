// ============================================
// LUXUDIES - Account Settings Page
// ============================================

'use client';

import { motion } from 'framer-motion';
import { Bell, Shield, Trash2 } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';

export default function SettingsPage() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <h2 className="font-playfair text-xl font-semibold text-espresso">Settings</h2>

      {/* Notifications */}
      <GlassCard variant="strong" padding="lg">
        <div className="flex items-center gap-3 mb-4">
          <Bell className="w-5 h-5 text-gold-500" />
          <h3 className="font-inter font-semibold text-espresso">Notifications</h3>
        </div>
        <div className="space-y-4">
          {[
            { label: 'Order updates', desc: 'Get notified about your order status', checked: true },
            { label: 'Promotions & offers', desc: 'Receive deals and new arrivals', checked: true },
            { label: 'WhatsApp updates', desc: 'Receive order updates on WhatsApp', checked: false },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div>
                <p className="font-inter text-sm font-medium text-espresso">{item.label}</p>
                <p className="font-inter text-xs text-espresso-200">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={item.checked} className="sr-only peer" />
                <div className="w-10 h-5 bg-pearl-400 peer-focus:ring-2 peer-focus:ring-gold-400/20 rounded-full peer peer-checked:bg-gold-400 after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:after:translate-x-5" />
              </label>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Security */}
      <GlassCard variant="strong" padding="lg">
        <div className="flex items-center gap-3 mb-4">
          <Shield className="w-5 h-5 text-gold-500" />
          <h3 className="font-inter font-semibold text-espresso">Security</h3>
        </div>
        <Button variant="outline" size="sm">
          Change Password
        </Button>
      </GlassCard>

      {/* Danger Zone */}
      <GlassCard variant="strong" padding="lg" className="border-red-200">
        <div className="flex items-center gap-3 mb-4">
          <Trash2 className="w-5 h-5 text-red-500" />
          <h3 className="font-inter font-semibold text-red-600">Danger Zone</h3>
        </div>
        <p className="font-inter text-sm text-espresso-200 mb-4">
          Permanently delete your account and all associated data.
        </p>
        <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50">
          Delete Account
        </Button>
      </GlassCard>
    </motion.div>
  );
}
