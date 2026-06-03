// ============================================
// LUXUDIES - Profile Page
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Save, Loader2 } from 'lucide-react';
import Button from '@/components/ui/button';
import GlassCard from '@/components/ui/glass-card';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    phone: '',
    avatarUrl: '',
  });

  // Fetch user data from Supabase auth on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const supabase = createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (user) {
          // Try fetching from users table first
          const { data: dbProfile } = await supabase
            .from('users')
            .select('full_name, email, phone, avatar_url')
            .eq('id', user.id)
            .single();

          setProfile({
            fullName: dbProfile?.full_name || user.user_metadata?.full_name || user.user_metadata?.name || user.email?.split('@')[0] || '',
            email: user.email || dbProfile?.email || '',
            phone: dbProfile?.phone || user.user_metadata?.phone || user.phone || '',
            avatarUrl: dbProfile?.avatar_url || user.user_metadata?.avatar_url || '',
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // Update users table
        const { error } = await supabase
          .from('users')
          .update({
            full_name: profile.fullName,
            phone: profile.phone,
          })
          .eq('id', user.id);

        if (error) throw error;

        // Also update auth metadata
        await supabase.auth.updateUser({
          data: { full_name: profile.fullName, phone: profile.phone },
        });

        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error saving profile:', error);
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
      setIsEditing(false);
    }
  };

  const inputClasses = "w-full h-11 px-4 bg-white/60 backdrop-blur-sm border border-gold-400/15 rounded-[10px] text-sm font-inter text-espresso placeholder:text-espresso-100 focus:outline-none focus:border-gold-400/40 focus:ring-2 focus:ring-gold-400/10 transition-all disabled:bg-pearl-200/50 disabled:text-espresso-200";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-6 h-6 text-gold-400 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-playfair text-xl font-semibold text-espresso">
          Personal Information
        </h2>
        {!isEditing && (
          <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
            Edit Profile
          </Button>
        )}
      </div>

      <GlassCard variant="strong" padding="lg">
        {/* Avatar */}
        <div className="flex items-center gap-4 mb-8">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-gold-400/20"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gold-200 to-gold-400 flex items-center justify-center text-white font-playfair text-2xl font-bold">
              {profile.fullName?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          <div>
            <p className="font-inter font-semibold text-espresso">{profile.fullName || 'No name set'}</p>
            <p className="font-inter text-sm text-espresso-200">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-inter font-semibold text-espresso-300 uppercase tracking-wider mb-1.5 block">
              Full Name
            </label>
            <div className="relative">
              <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                disabled={!isEditing}
                className={`${inputClasses} pl-11`}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-inter font-semibold text-espresso-300 uppercase tracking-wider mb-1.5 block">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
              <input
                type="email"
                value={profile.email}
                disabled
                className={`${inputClasses} pl-11`}
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-inter font-semibold text-espresso-300 uppercase tracking-wider mb-1.5 block">
              Phone
            </label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                disabled={!isEditing}
                placeholder="+91 98765 43210"
                className={`${inputClasses} pl-11`}
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex gap-3 mt-6">
            <Button onClick={handleSave} isLoading={isSaving} icon={<Save className="w-4 h-4" />}>
              Save Changes
            </Button>
            <Button variant="ghost" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
          </div>
        )}
      </GlassCard>
    </motion.div>
  );
}
