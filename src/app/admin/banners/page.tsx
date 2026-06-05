// ============================================
// LUXUDIES - Admin Banners Page
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Image as ImageIcon, Plus, Pencil, Trash2, Loader2, Eye } from 'lucide-react';
import Image from 'next/image';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import BannerFormModal from '@/components/admin/banner-form-modal';
import ConfirmModal from '@/components/admin/confirm-modal';
import { cn } from '@/lib/utils';

export default function AdminBannersPage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<any | null>(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [bannerToDelete, setBannerToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('position', { ascending: true })
        .order('sort_order', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error: any) {
      toast.error('Failed to load banners');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleDelete = async () => {
    if (!bannerToDelete) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('banners').delete().eq('id', bannerToDelete);
      if (error) throw error;
      toast.success('Banner deleted');
      fetchBanners();
    } catch (error: any) {
      toast.error('Failed to delete banner');
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setBannerToDelete(null);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-espresso">Banners</h1>
          <p className="font-inter text-sm text-espresso-200">Manage hero and promotional banners</p>
        </div>
        <Button 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => { setSelectedBanner(null); setIsFormOpen(true); }}
        >
          Add Banner
        </Button>
      </motion.div>

      {isLoading ? (
        <GlassCard variant="strong" className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-4" />
          <p className="text-espresso-300">Loading banners...</p>
        </GlassCard>
      ) : banners.length === 0 ? (
        <GlassCard variant="strong" padding="lg" className="text-center py-16">
          <ImageIcon className="w-16 h-16 text-pearl-400 mx-auto mb-4" />
          <h3 className="font-playfair text-lg font-semibold text-espresso mb-2">No banners yet</h3>
          <p className="font-inter text-sm text-espresso-200 mb-6">
            Upload banners for your homepage hero section and promotional areas.
          </p>
          <Button 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => { setSelectedBanner(null); setIsFormOpen(true); }}
          >
            Upload Banner
          </Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {banners.map((banner) => (
            <GlassCard key={banner.id} variant="strong" className="flex flex-col md:flex-row gap-4 p-4 items-center">
              <div className="relative w-full md:w-64 aspect-video rounded-lg overflow-hidden bg-pearl-100 shrink-0">
                <Image src={banner.image_url} alt={banner.title || 'Banner'} fill className="object-cover" />
              </div>
              <div className="flex-1 min-w-0 py-2">
                <div className="flex items-center gap-2 mb-1">
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-gold-100 text-gold-800 uppercase">
                    {banner.position}
                  </span>
                  <span className={cn(
                    "px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase",
                    banner.is_active ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  )}>
                    {banner.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
                <h3 className="font-playfair text-lg font-bold text-espresso line-clamp-1">{banner.title || 'Untitled Banner'}</h3>
                {banner.subtitle && <p className="font-inter text-sm text-espresso-300 line-clamp-1">{banner.subtitle}</p>}
                {banner.link && <p className="font-inter text-xs text-espresso-200 mt-2 font-mono">Link: {banner.link}</p>}
              </div>
              <div className="flex items-center gap-2 md:flex-col md:justify-center">
                <button 
                  onClick={() => { setSelectedBanner(banner); setIsFormOpen(true); }}
                  className="p-2 rounded-lg bg-pearl-100 text-espresso hover:bg-pearl-200 transition-colors"
                >
                  <Pencil className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setBannerToDelete(banner.id); setIsDeleteOpen(true); }}
                  className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {isFormOpen && (
        <BannerFormModal 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          banner={selectedBanner}
          onSuccess={fetchBanners}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Banner"
        message="Are you sure you want to delete this banner? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
