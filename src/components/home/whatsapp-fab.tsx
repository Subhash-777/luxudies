// ============================================
// LUXUDIES - WhatsApp Floating Action Button
// ============================================

'use client';

import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { getWhatsAppUrl } from '@/lib/utils';

export default function WhatsAppFAB() {
  return (
    <motion.a
      href={getWhatsAppUrl('Hi LUXUDIES! I would like to know more about your jewelry.')}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2, type: 'spring', stiffness: 200 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-20 lg:bottom-6 right-4 lg:right-6 z-50 w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-green-600 transition-colors"
      aria-label="Chat on WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />

      {/* Pulse ring */}
      <span className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-20" />
    </motion.a>
  );
}
