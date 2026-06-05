// ============================================
// LUXUDIES - Admin Products Page
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Plus, Search, Eye, Pencil, Trash2, Loader2 } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import { formatPrice, cn } from '@/lib/utils';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import ProductFormModal from '@/components/admin/product-form-modal';
import ConfirmModal from '@/components/admin/confirm-modal';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Modal States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          product_images (
            url,
            is_primary,
            sort_order
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error: any) {
      toast.error('Failed to load products: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', productToDelete);
      
      if (error) throw error;
      toast.success('Product deleted');
      fetchProducts();
    } catch (error: any) {
      toast.error('Failed to delete product: ' + error.message);
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setProductToDelete(null);
    }
  };

  const filteredProducts = products.filter(
    (p) =>
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6"
      >
        <div>
          <h1 className="font-playfair text-2xl font-bold text-espresso">Products</h1>
          <p className="font-inter text-sm text-espresso-200">{products.length} products total</p>
        </div>
        <Button 
          icon={<Plus className="w-4 h-4" />} 
          onClick={() => { setSelectedProduct(null); setIsFormOpen(true); }}
        >
          Add Product
        </Button>
      </motion.div>

      {/* Search */}
      <div className="relative mb-6 max-w-sm">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200" />
        <input
          type="text"
          placeholder="Search products by name or SKU..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-10 pl-10 pr-4 bg-white/60 backdrop-blur-sm border border-gold-400/15 rounded-xl text-sm font-inter text-espresso focus:outline-none focus:border-gold-400/40 transition-all"
        />
      </div>

      {/* Products Table */}
      <GlassCard variant="strong" padding="none">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center p-12 text-espresso-300">
            <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-4" />
            <p className="font-inter text-sm font-medium">Loading products...</p>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-12 text-espresso-300">
            <div className="w-16 h-16 bg-pearl-200 rounded-full flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-espresso-200" />
            </div>
            <p className="font-inter font-medium mb-1">No products found</p>
            <p className="font-inter text-sm text-espresso-200 mb-4 text-center">
              Try adjusting your search query or add a new product.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold-400/10">
                  <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">Product</th>
                  <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">SKU</th>
                  <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">Price</th>
                  <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">Stock</th>
                  <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">Status</th>
                  <th className="text-left text-[10px] font-inter font-semibold text-espresso-200 uppercase tracking-wider p-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredProducts.map((product) => {
                  const img = product.product_images?.find((i: any) => i.is_primary) || product.product_images?.[0];
                  return (
                    <tr key={product.id} className="border-b border-gold-400/5 last:border-b-0 hover:bg-pearl-100/50 transition-colors">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="relative w-10 h-10 rounded-lg overflow-hidden bg-pearl-100 shrink-0">
                            {img && <Image src={img.url} alt={product.name} fill className="object-cover" sizes="40px" />}
                          </div>
                          <div className="min-w-0">
                            <p className="font-inter text-sm font-medium text-espresso line-clamp-1">{product.name}</p>
                            <p className="font-inter text-[10px] text-espresso-200 capitalize">{product.category}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 font-inter text-xs text-espresso-300 font-mono">{product.sku}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-inter text-sm font-medium text-espresso">{formatPrice(product.price)}</p>
                          {product.compare_at_price && (
                            <p className="font-inter text-[10px] text-espresso-200 line-through">{formatPrice(product.compare_at_price)}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          'font-inter text-xs font-medium',
                          product.stock > 20 ? 'text-green-600' : product.stock > 5 ? 'text-yellow-600' : 'text-red-500'
                        )}>
                          {product.stock}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={cn(
                          'px-2 py-0.5 rounded-full text-[10px] font-inter font-semibold',
                          product.is_active ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'
                        )}>
                          {product.is_active ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-1">
                          <a 
                            href={`/product/${product.slug}`}
                            target="_blank"
                            rel="noreferrer"
                            className="p-1.5 rounded-lg text-espresso-200 hover:bg-pearl-200 hover:text-espresso transition-colors block"
                            title="View on Storefront"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </a>
                          <button 
                            onClick={() => { setSelectedProduct(product); setIsFormOpen(true); }}
                            className="p-1.5 rounded-lg text-espresso-200 hover:bg-pearl-200 hover:text-espresso transition-colors"
                            title="Edit Product"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button 
                            onClick={() => { setProductToDelete(product.id); setIsDeleteOpen(true); }}
                            className="p-1.5 rounded-lg text-espresso-200 hover:bg-red-50 hover:text-red-500 transition-colors"
                            title="Delete Product"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </GlassCard>

      {/* Modals */}
      {isFormOpen && (
        <ProductFormModal 
          isOpen={isFormOpen} 
          onClose={() => setIsFormOpen(false)} 
          product={selectedProduct}
          onSuccess={fetchProducts}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product? This action cannot be undone and will remove all associated images."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
