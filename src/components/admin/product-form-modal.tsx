import { useState, useEffect } from 'react';
import { Plus, X } from 'lucide-react';
import Image from 'next/image';
import AdminModal from './admin-modal';
import Button from '@/components/ui/button';
import ImageUpload from './image-upload';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';

interface ProductFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  product?: any; // If provided, it's edit mode
  onSuccess: () => void;
}

export default function ProductFormModal({ isOpen, onClose, product, onSuccess }: ProductFormModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    sku: '',
    slug: '',
    category: 'necklaces',
    price: '',
    compare_at_price: '',
    stock: '10',
    description: '',
    is_active: true,
  });
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        sku: product.sku,
        slug: product.slug,
        category: product.category,
        price: product.price.toString(),
        compare_at_price: product.compare_at_price ? product.compare_at_price.toString() : '',
        stock: product.stock.toString(),
        description: product.description || '',
        is_active: product.is_active,
      });
      setImages(product.product_images?.map((img: any) => img.url) || []);
    } else {
      setFormData({
        name: '',
        sku: '',
        slug: '',
        category: 'necklaces',
        price: '',
        compare_at_price: '',
        stock: '10',
        description: '',
        is_active: true,
      });
      setImages([]);
    }
  }, [product, isOpen]);

  // Auto-generate slug from name
  useEffect(() => {
    if (!product && formData.name) {
      setFormData(prev => ({
        ...prev,
        slug: formData.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')
      }));
    }
  }, [formData.name, product]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsLoading(true);
    const supabase = createClient();

    try {
      const productData = {
        name: formData.name,
        sku: formData.sku,
        slug: formData.slug,
        category: formData.category,
        price: parseFloat(formData.price),
        compare_at_price: formData.compare_at_price ? parseFloat(formData.compare_at_price) : null,
        stock: parseInt(formData.stock),
        description: formData.description,
        is_active: formData.is_active,
      };

      let productId = product?.id;

      if (product) {
        // Update product
        const { error } = await supabase
          .from('products')
          .update(productData)
          .eq('id', product.id);
        if (error) throw error;
      } else {
        // Create product
        const { data, error } = await supabase
          .from('products')
          .insert([productData])
          .select()
          .single();
        if (error) throw error;
        productId = data.id;
      }

      // Handle images
      // First, delete existing images if editing
      if (product) {
        await supabase.from('product_images').delete().eq('product_id', product.id);
      }

      // Insert new images
      const imageRecords = images.map((url, index) => ({
        product_id: productId,
        url,
        is_primary: index === 0,
        sort_order: index,
      }));

      const { error: imageError } = await supabase
        .from('product_images')
        .insert(imageRecords);

      if (imageError) throw imageError;

      toast.success(`Product ${product ? 'updated' : 'created'} successfully`);
      onSuccess();
      onClose();
    } catch (error: any) {
      toast.error(error.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages(images.filter((_, idx) => idx !== indexToRemove));
  };

  const inputClasses = "w-full h-10 px-3 bg-white/60 border border-gold-400/20 rounded-xl text-sm font-inter text-espresso focus:outline-none focus:border-gold-400/50 transition-all";

  return (
    <AdminModal isOpen={isOpen} onClose={onClose} title={product ? 'Edit Product' : 'Add New Product'} className="md:w-[800px]">
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Images Section */}
        <div className="space-y-3">
          <label className="block text-sm font-semibold text-espresso">Product Images <span className="text-red-500">*</span></label>
          <p className="text-xs text-espresso-200">The first image will be used as the primary image.</p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-xl overflow-hidden border border-gold-400/20 group">
                <Image src={url} alt={`Product image ${idx + 1}`} fill className="object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button type="button" onClick={() => removeImage(idx)} className="p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
                {idx === 0 && (
                  <span className="absolute top-2 left-2 bg-gold-500 text-white text-[10px] px-2 py-0.5 rounded-full font-semibold shadow-sm">
                    Primary
                  </span>
                )}
              </div>
            ))}
            <div className="col-span-2 md:col-span-4">
               <ImageUpload 
                  bucket="products" 
                  folder={formData.sku || 'misc'} 
                  multiple 
                  onUpload={(urls) => setImages([...images, ...urls])} 
               />
            </div>
          </div>
        </div>

        {/* Basic Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-espresso">Product Name <span className="text-red-500">*</span></label>
            <input required type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={inputClasses} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-espresso">SKU <span className="text-red-500">*</span></label>
            <input required type="text" value={formData.sku} onChange={e => setFormData({...formData, sku: e.target.value})} className={inputClasses} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-espresso">URL Slug <span className="text-red-500">*</span></label>
            <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className={inputClasses} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-espresso">Category <span className="text-red-500">*</span></label>
            <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} className={inputClasses}>
              <option value="necklaces">Necklaces</option>
              <option value="earrings">Earrings</option>
              <option value="bracelets">Bracelets</option>
              <option value="rings">Rings</option>
              <option value="combos">Combos</option>
            </select>
          </div>
        </div>

        {/* Pricing & Inventory */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-espresso">Price (₹) <span className="text-red-500">*</span></label>
            <input required type="number" min="0" step="0.01" value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className={inputClasses} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-espresso">Compare at Price (₹)</label>
            <input type="number" min="0" step="0.01" value={formData.compare_at_price} onChange={e => setFormData({...formData, compare_at_price: e.target.value})} className={inputClasses} />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-semibold text-espresso">Stock <span className="text-red-500">*</span></label>
            <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: e.target.value})} className={inputClasses} />
          </div>
        </div>

        {/* Description */}
        <div className="space-y-1">
          <label className="text-xs font-semibold text-espresso">Description</label>
          <textarea 
            rows={4} 
            value={formData.description} 
            onChange={e => setFormData({...formData, description: e.target.value})} 
            className="w-full p-3 bg-white/60 border border-gold-400/20 rounded-xl text-sm font-inter text-espresso focus:outline-none focus:border-gold-400/50 transition-all resize-none"
          />
        </div>

        {/* Status */}
        <div className="flex items-center gap-3 p-4 bg-white/40 border border-gold-400/20 rounded-xl">
          <input 
            type="checkbox" 
            id="is_active" 
            checked={formData.is_active} 
            onChange={e => setFormData({...formData, is_active: e.target.checked})}
            className="w-4 h-4 rounded border-gold-400/30 text-gold-500 focus:ring-gold-500"
          />
          <label htmlFor="is_active" className="text-sm font-semibold text-espresso cursor-pointer">
            Active Product
          </label>
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-3 pt-4 border-t border-gold-400/20">
          <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>Cancel</Button>
          <Button type="submit" isLoading={isLoading}>{product ? 'Save Changes' : 'Create Product'}</Button>
        </div>

      </form>
    </AdminModal>
  );
}
