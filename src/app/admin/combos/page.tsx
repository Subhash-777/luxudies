// ============================================
// LUXUDIES - Admin Combos Page
// ============================================

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Package, Plus, Pencil, Trash2, Loader2, Eye } from 'lucide-react';
import Image from 'next/image';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import { createClient } from '@/lib/supabase/client';
import toast from 'react-hot-toast';
import ComboFormModal from '@/components/admin/combo-form-modal';
import ConfirmModal from '@/components/admin/confirm-modal';
import { formatPrice, cn } from '@/lib/utils';

export default function AdminCombosPage() {
  const [combos, setCombos] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedCombo, setSelectedCombo] = useState<any | null>(null);
  
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [comboToDelete, setComboToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const supabase = createClient();

  const fetchCombos = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('combos')
        .select(`
          *,
          combo_items (
            product_id,
            products (name)
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCombos(data || []);
    } catch (error: any) {
      toast.error('Failed to load combos');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCombos();
  }, []);

  const handleDelete = async () => {
    if (!comboToDelete) return;
    setIsDeleting(true);
    try {
      const { error } = await supabase.from('combos').delete().eq('id', comboToDelete);
      if (error) throw error;
      toast.success('Combo deleted');
      fetchCombos();
    } catch (error: any) {
      toast.error('Failed to delete combo');
    } finally {
      setIsDeleting(false);
      setIsDeleteOpen(false);
      setComboToDelete(null);
    }
  };

  return (
    <div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-playfair text-2xl font-bold text-espresso">Combos & Offers</h1>
          <p className="font-inter text-sm text-espresso-200">Manage curated sets and special prices</p>
        </div>
        <Button 
          icon={<Plus className="w-4 h-4" />}
          onClick={() => { setSelectedCombo(null); setIsFormOpen(true); }}
        >
          Create Combo
        </Button>
      </motion.div>

      {isLoading ? (
        <GlassCard variant="strong" className="flex flex-col items-center justify-center py-16">
          <Loader2 className="w-8 h-8 animate-spin text-gold-500 mb-4" />
          <p className="text-espresso-300">Loading combos...</p>
        </GlassCard>
      ) : combos.length === 0 ? (
        <GlassCard variant="strong" padding="lg" className="text-center py-16">
          <Package className="w-16 h-16 text-pearl-400 mx-auto mb-4" />
          <h3 className="font-playfair text-lg font-semibold text-espresso mb-2">No combos yet</h3>
          <p className="font-inter text-sm text-espresso-200 mb-6">
            Group products together to offer special bundle pricing.
          </p>
          <Button 
            icon={<Plus className="w-4 h-4" />}
            onClick={() => { setSelectedCombo(null); setIsFormOpen(true); }}
          >
            Create First Combo
          </Button>
        </GlassCard>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {combos.map((combo) => (
            <GlassCard key={combo.id} variant="strong" padding="none" className="flex flex-col overflow-hidden">
              <div className="relative aspect-video w-full bg-pearl-100">
                {combo.image_url ? (
                  <Image src={combo.image_url} alt={combo.name} fill className="object-cover" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-espresso-200">
                    <Package className="w-8 h-8" />
                  </div>
                )}
                <div className="absolute top-2 right-2 flex gap-2">
                  <span className={cn(
                    "px-2 py-1 rounded text-[10px] font-bold tracking-wider uppercase shadow-sm backdrop-blur-md",
                    combo.is_active ? "bg-green-500/90 text-white" : "bg-red-500/90 text-white"
                  )}>
                    {combo.is_active ? 'Active' : 'Hidden'}
                  </span>
                </div>
              </div>
              
              <div className="p-4 flex-1 flex flex-col">
                <h3 className="font-playfair text-lg font-bold text-espresso line-clamp-1">{combo.name}</h3>
                <div className="mt-2 flex items-end gap-2">
                  <span className="font-inter font-semibold text-espresso">{formatPrice(combo.combo_price)}</span>
                  <span className="font-inter text-xs text-espresso-200 line-through mb-0.5">{formatPrice(combo.original_price)}</span>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gold-400/10 flex-1">
                  <p className="text-xs font-semibold text-espresso-300 mb-2">Included Products:</p>
                  <ul className="text-xs text-espresso-200 space-y-1">
                    {combo.combo_items?.slice(0, 3).map((item: any, idx: number) => (
                      <li key={idx} className="line-clamp-1">• {item.products?.name}</li>
                    ))}
                    {combo.combo_items?.length > 3 && (
                      <li className="italic text-gold-600">+{combo.combo_items.length - 3} more</li>
                    )}
                  </ul>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gold-400/10 flex items-center justify-end gap-2">
                  <a 
                    href={`/product/${combo.slug}`}
                    target="_blank"
                    rel="noreferrer"
                    className="p-2 text-espresso-200 hover:bg-pearl-200 hover:text-espresso rounded-lg transition-colors"
                    title="View Combo"
                  >
                    <Eye className="w-4 h-4" />
                  </a>
                  <button 
                    onClick={() => { setSelectedCombo(combo); setIsFormOpen(true); }}
                    className="p-2 text-espresso-200 hover:bg-pearl-200 hover:text-espresso rounded-lg transition-colors"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={() => { setComboToDelete(combo.id); setIsDeleteOpen(true); }}
                    className="p-2 text-espresso-200 hover:bg-red-50 hover:text-red-500 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      )}

      {isFormOpen && (
        <ComboFormModal 
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          combo={selectedCombo}
          onSuccess={fetchCombos}
        />
      )}

      <ConfirmModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Delete Combo"
        message="Are you sure you want to delete this combo? This action cannot be undone."
        confirmText="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
