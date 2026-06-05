import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import Image from 'next/image';
import AdminModal from './admin-modal';
import Button from '@/components/ui/button';
import ImageUpload from './image-upload';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface BannerFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  banner?: any;
  onSuccess: () => void;
}

export default function BannerFormModal({ isOpen, onClose, banner, onSuccess }: BannerFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    link: '',
    cta_text: '',
    position: 'hero',
    is_active: true,
  });
  const [desktopImage, setDesktopImage] = useState<string>('');
  const [mobileImage, setMobileImage] = useState<string>('');

  useEffect(() => {
    if (banner) {
      setFormData({
        title: banner.title || '',
        subtitle: banner.subtitle || '',
        link: banner.link || '',
        cta_text: banner.cta_text || '',
        position: banner.position || 'hero',
        is_active: banner.is_active,
      });
      setDesktopImage(banner.image_url || '');
      setMobileImage(banner.mobile_image_url || '');
    } else {
      setFormData({
        title: '',
        subtitle: '',
        link: '',
        cta_text: '',
        position: 'hero',
        is_active: true,
      });
      setDesktopImage('');
      setMobileImage('');
    }
  }, [banner, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!desktopImage) {
      toast.error('Desktop banner image is required');
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const payload = {
        ...formData,
        image_url: desktopImage,
        mobile_image_url: mobileImage || null,
      };

      if (banner) {
        const { error } = await supabase.from('banners').update(payload).eq('id', banner.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('banners').insert([payload]);
        if (error) throw error;
      }

      toast.success(`Banner ${banner ? 'updated' : 'created'}`);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full h-10 px-3 bg-white/60 border border-gold-400/20 rounded-xl text-sm font-inter text-espresso focus:outline-none focus:border-gold-400/50 transition-all";

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={banner ? 'Edit Banner' : 'Add Banner'} className="md:w-[600px]">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-xs font-semibold text-espresso">Desktop Image (16:9) <span className="text-red-500">*</span></label>
            {desktopImage ? (
              <div className="relative aspect-video rounded-xl overflow-hidden border border-gold-400/20 group">
                <Image src={desktopImage} alt="Desktop banner" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => setDesktopImage('')} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <ImageUpload bucket="misc" folder="banners" onUpload={(urls) => setDesktopImage(urls[0])} />
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-espresso">Mobile Image (9:16) (Optional)</label>
            {mobileImage ? (
              <div className="relative aspect-[9/16] w-1/2 mx-auto rounded-xl overflow-hidden border border-gold-400/20 group">
                <Image src={mobileImage} alt="Mobile banner" fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => setMobileImage('')} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              <ImageUpload bucket="misc" folder="banners" onUpload={(urls) => setMobileImage(urls[0])} />
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-espresso">Title</label>
            <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={inputClasses} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-espresso">Subtitle</label>
            <input type="text" value={formData.subtitle} onChange={e => setFormData({...formData, subtitle: e.target.value})} className={inputClasses} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-espresso">CTA Text (e.g. Shop Now)</label>
            <input type="text" value={formData.cta_text} onChange={e => setFormData({...formData, cta_text: e.target.value})} className={inputClasses} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-espresso">Link URL (e.g. /category/necklaces)</label>
            <input type="text" value={formData.link} onChange={e => setFormData({...formData, link: e.target.value})} className={inputClasses} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-espresso">Position</label>
            <select value={formData.position} onChange={e => setFormData({...formData, position: e.target.value})} className={inputClasses}>
              <option value="hero">Hero (Homepage Top)</option>
              <option value="promo">Promo (Homepage Middle)</option>
              <option value="category">Category Page</option>
            </select>
          </div>
        </div>

        <div className="flex items-center gap-3 p-4 bg-white/40 border border-gold-400/20 rounded-xl">
          <input 
            type="checkbox" 
            id="is_active_banner" 
            checked={formData.is_active} 
            onChange={e => setFormData({...formData, is_active: e.target.checked})}
            className="w-4 h-4 rounded border-gold-400/30 text-gold-500 focus:ring-gold-500"
          />
          <label htmlFor="is_active_banner" className="text-sm font-semibold text-espresso cursor-pointer">
            Active Banner
          </label>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gold-400/20">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>{banner ? 'Save' : 'Create'}</Button>
        </div>
      </form>
    </AdminModal>
  );
}
