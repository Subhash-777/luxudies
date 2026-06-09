// ============================================
// LUXUDIES - FAQ Section (Redesigned)
// ============================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus } from 'lucide-react';
import { FAQ_DATA } from '@/lib/sample-data';

export default function FAQSection() {
  const faqs = FAQ_DATA.slice(0, 5);
  const [openId, setOpenId] = useState<string | null>(faqs[0]?.id || null);

  const toggleFaq = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-20 lg:py-32 bg-pearl relative overflow-hidden">
      <div className="container-luxury max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          <h2 className="font-playfair text-3xl lg:text-4xl xl:text-5xl font-bold text-espresso mb-3">
            Common Questions
          </h2>
          <p className="font-inter text-espresso-200">
            Everything you need to know about our jewelry.
          </p>
        </motion.div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="glass-card overflow-hidden"
            >
              <button
                onClick={() => toggleFaq(faq.id)}
                className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
              >
                <span className="font-playfair font-medium text-lg text-espresso pr-4">
                  {faq.question}
                </span>
                <span className="flex-shrink-0 w-8 h-8 rounded-full border border-gold-400/30 flex items-center justify-center bg-gold-50/50 transition-colors hover:bg-gold-100">
                  {openId === faq.id ? (
                    <Minus className="w-4 h-4 text-gold-500" />
                  ) : (
                    <Plus className="w-4 h-4 text-gold-500" />
                  )}
                </span>
              </button>

              <AnimatePresence initial={false}>
                {openId === faq.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 pt-0 font-inter text-espresso-300 leading-relaxed text-sm">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
