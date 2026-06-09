// ============================================
// LUXUDIES - Profile Page (Redesigned)
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { User, Mail, Phone, Save, Loader2 } from 'lucide-react';
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

  const inputClasses = "w-full h-12 bg-transparent border-b border-gold-400/30 text-sm font-inter text-espresso placeholder:text-espresso-200 focus:outline-none focus:border-gold-500 transition-colors px-1 disabled:opacity-60 disabled:border-transparent disabled:border-b disabled:border-gold-400/10";
  const labelClasses = "text-[11px] font-inter font-semibold text-espresso-300 uppercase tracking-widest mb-1 block";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 text-gold-400 animate-spin" />
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl"
    >
      <div className="flex items-center justify-between mb-8 border-b border-gold-400/20 pb-4">
        <h2 className="font-playfair text-2xl font-bold text-espresso">
          Personal Information
        </h2>
        {!isEditing && (
          <button 
            onClick={() => setIsEditing(true)}
            className="text-xs font-inter font-semibold text-gold-600 hover:text-gold-700 uppercase tracking-widest border border-gold-400/20 px-4 py-2 rounded-full hover:bg-gold-50 transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="glass-card p-6 sm:p-10">
        {/* Avatar */}
        <div className="flex items-center gap-6 mb-10">
          {profile.avatarUrl ? (
            <img
              src={profile.avatarUrl}
              alt={profile.fullName}
              className="w-20 h-20 rounded-full object-cover shadow-soft"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gold-300 to-gold-500 flex items-center justify-center text-white font-playfair text-3xl font-bold shadow-soft">
              {profile.fullName?.[0]?.toUpperCase() || '?'}
            </div>
          )}
          <div>
            <p className="font-playfair text-2xl font-bold text-espresso mb-1">{profile.fullName || 'No name set'}</p>
            <p className="font-inter text-sm text-espresso-200">{profile.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-8">
          <div>
            <label className={labelClasses}>Full Name</label>
            <div className="relative">
              <User className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
              <input
                type="text"
                value={profile.fullName}
                onChange={(e) => setProfile((p) => ({ ...p, fullName: e.target.value }))}
                disabled={!isEditing}
                className={`${inputClasses} pl-8`}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Email Address</label>
            <div className="relative">
              <Mail className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
              <input
                type="email"
                value={profile.email}
                disabled
                className={`${inputClasses} pl-8`}
              />
            </div>
          </div>

          <div>
            <label className={labelClasses}>Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-1 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
              <input
                type="tel"
                value={profile.phone}
                onChange={(e) => setProfile((p) => ({ ...p, phone: e.target.value }))}
                disabled={!isEditing}
                placeholder="+91 98765 43210"
                className={`${inputClasses} pl-8`}
              />
            </div>
          </div>
        </div>

        {isEditing && (
          <div className="flex flex-col sm:flex-row gap-4 mt-10 pt-6 border-t border-gold-400/20">
            <button 
              onClick={handleSave} 
              disabled={isSaving}
              className="btn-gold h-12 px-8 text-xs tracking-widest flex items-center justify-center gap-2 shadow-gold"
            >
              {isSaving ? 'SAVING...' : 'SAVE CHANGES'}
              {!isSaving && <Save className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => setIsEditing(false)}
              className="btn-ghost-gold h-12 px-8 text-xs tracking-widest"
            >
              CANCEL
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
