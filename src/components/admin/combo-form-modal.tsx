import { useState, useEffect } from 'react';
import { X, Search, Check } from 'lucide-react';
import Image from 'next/image';
import AdminModal from './admin-modal';
import Button from '@/components/ui/button';
import ImageUpload from './image-upload';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import { cn } from '@/lib/utils';

interface ComboFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  combo?: any;
  onSuccess: () => void;
}

export default function ComboFormModal({ isOpen, onClose, combo, onSuccess }: ComboFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    combo_price: '',
    is_active: true,
  });
  const [image, setImage] = useState<string>('');
  
  const [allProducts, setAllProducts] = useState<any[]>([]);
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const supabase = createClient();

  useEffect(() => {
    const fetchProducts = async () => {
      const { data } = await supabase.from('products').select('id, name, price, product_images(url)').eq('is_active', true);
      setAllProducts(data || []);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (combo) {
      setFormData({
        name: combo.name || '',
        slug: combo.slug || '',
        description: combo.description || '',
        combo_price: combo.combo_price?.toString() || '',
        is_active: combo.is_active,
      });
      setImage(combo.image_url || '');
      // Extract selected product IDs from combo_items
      if (combo.combo_items) {
        setSelectedProductIds(combo.combo_items.map((item: any) => item.product_id));
      }
    } else {
      setFormData({
        name: '',
        slug: '',
        description: '',
        combo_price: '',
        is_active: true,
      });
      setImage('');
      setSelectedProductIds([]);
    }
  }, [combo, isOpen]);

  // Auto slug
  useEffect(() => {
    if (!combo && formData.name) {
      setFormData(prev => ({
        ...prev,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  }, [formData.name, combo]);

  const toggleProduct = (productId: string) => {
    if (selectedProductIds.includes(productId)) {
      setSelectedProductIds(prev => prev.filter(id => id !== productId));
    } else {
      setSelectedProductIds(prev => [...prev, productId]);
    }
  };

  const calculateOriginalPrice = () => {
    return selectedProductIds.reduce((total, id) => {
      const product = allProducts.find(p => p.id === id);
      return total + (product ? Number(product.price) : 0);
    }, 0);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return toast.error('Combo image is required');
    if (selectedProductIds.length < 2) return toast.error('Please select at least 2 products for a combo');

    setIsLoading(true);

    try {
      const original_price = calculateOriginalPrice();
      const payload = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        combo_price: parseFloat(formData.combo_price),
        original_price,
        image_url: image,
        is_active: formData.is_active,
      };

      let comboId = combo?.id;

      if (combo) {
        const { error } = await supabase.from('combos').update(payload).eq('id', combo.id);
        if (error) throw error;
      } else {
        const { data, error } = await supabase.from('combos').insert([payload]).select().single();
        if (error) throw error;
        comboId = data.id;
      }

      // Handle combo items
      if (combo) {
        await supabase.from('combo_items').delete().eq('combo_id', combo.id);
      }
      
      const itemsToInsert = selectedProductIds.map(pid => ({
        combo_id: comboId,
        product_id: pid
      }));
      
      const { error: itemsError } = await supabase.from('combo_items').insert(itemsToInsert);
      if (itemsError) throw itemsError;

      toast.success(`Combo ${combo ? 'updated' : 'created'}`);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const inputClasses = "w-full h-10 px-3 bg-white/60 border border-gold-400/20 rounded-xl text-sm font-inter text-espresso focus:outline-none focus:border-gold-400/50 transition-all";

  const filteredProducts = allProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={combo ? 'Edit Combo' : 'Create Combo'} className="md:w-[800px]">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold text-espresso">Combo Image <span className="text-red-500">*</span></label>
              {image ? (
                <div className="relative aspect-square w-full max-w-[200px] rounded-xl overflow-hidden border border-gold-400/20 group">
                  <Image src={image} alt="Combo" fill className="object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => setImage('')} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <ImageUpload bucket="misc" folder="combos" onUpload={(urls) => setImage(urls[0])} />
              )}
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-espresso">Combo Name <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClasses} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-espresso">URL Slug <span className="text-red-500">*</span></label>
              <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className={inputClasses} />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-semibold text-espresso">Description</label>
              <textarea rows={3} value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-white/60 border border-gold-400/20 rounded-xl text-sm font-inter text-espresso focus:outline-none focus:border-gold-400/50 resize-none" />
            </div>
            
            <div className="p-4 bg-pearl-100/50 border border-gold-400/20 rounded-xl space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-espresso-300">Original Value:</span>
                <span className="font-semibold text-espresso-200 line-through">₹{calculateOriginalPrice()}</span>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-espresso">Combo Price (₹) <span className="text-red-500">*</span></label>
                <input required type="number" min="0" step="0.01" value={formData.combo_price} onChange={e => setFormData({...formData, combo_price: e.target.value})} className={inputClasses} />
              </div>
              {formData.combo_price && calculateOriginalPrice() > 0 && (
                <div className="text-xs text-green-600 font-semibold text-right">
                  Savings: ₹{(calculateOriginalPrice() - Number(formData.combo_price)).toFixed(2)}
                </div>
              )}
            </div>
            
            <div className="flex items-center gap-3 p-4 bg-white/40 border border-gold-400/20 rounded-xl">
              <input 
                type="checkbox" 
                id="is_active_combo" 
                checked={formData.is_active} 
                onChange={e => setFormData({...formData, is_active: e.target.checked})}
                className="w-4 h-4 rounded border-gold-400/30 text-gold-500 focus:ring-gold-500"
              />
              <label htmlFor="is_active_combo" className="text-sm font-semibold text-espresso cursor-pointer">
                Active Combo
              </label>
            </div>
          </div>

          {/* Select Products */}
          <div className="border border-gold-400/20 rounded-xl p-4 bg-white/40 flex flex-col h-full max-h-[500px]">
            <h3 className="text-sm font-semibold text-espresso mb-1">Select Products <span className="text-red-500">*</span></h3>
            <p className="text-xs text-espresso-200 mb-3">{selectedProductIds.length} selected</p>
            
            <div className="relative mb-3 shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
              <input 
                type="text" 
                placeholder="Search products..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full h-9 pl-9 pr-3 bg-white border border-gold-400/20 rounded-lg text-sm font-inter focus:outline-none focus:border-gold-400/50"
              />
            </div>

            <div className="flex-1 overflow-y-auto space-y-2 pr-1">
              {filteredProducts.map(product => {
                const isSelected = selectedProductIds.includes(product.id);
                const imgUrl = product.product_images?.[0]?.url;
                
                return (
                  <div 
                    key={product.id}
                    onClick={() => toggleProduct(product.id)}
                    className={cn(
                      "flex items-center gap-3 p-2 rounded-lg border cursor-pointer transition-colors",
                      isSelected ? "border-gold-500 bg-gold-50/50" : "border-gold-400/10 bg-white hover:bg-pearl-50"
                    )}
                  >
                    <div className="relative w-10 h-10 rounded bg-pearl-100 overflow-hidden shrink-0">
                      {imgUrl && <Image src={imgUrl} alt={product.name} fill className="object-cover" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-espresso line-clamp-1">{product.name}</p>
                      <p className="text-xs text-espresso-300">₹{product.price}</p>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border flex items-center justify-center shrink-0",
                      isSelected ? "bg-gold-500 border-gold-500 text-white" : "border-gold-400/30"
                    )}>
                      {isSelected && <Check className="w-3 h-3" />}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gold-400/20">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>{combo ? 'Save Combo' : 'Create Combo'}</Button>
        </div>
      </form>
    </AdminModal>
  );
}
