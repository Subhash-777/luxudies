// ============================================
// LUXUDIES - Reviews Section
// ============================================

'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import GlassCard from '@/components/ui/glass-card';
import { SAMPLE_REVIEWS } from '@/lib/sample-data';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          className={`w-4 h-4 ${
            i < rating
              ? 'text-gold-400 fill-gold-400'
              : 'text-pearl-400'
          }`}
        />
      ))}
    </div>
  );
}

export default function ReviewsSection() {
  const [current, setCurrent] = useState(0);

  const next = () => setCurrent((prev) => (prev + 1) % SAMPLE_REVIEWS.length);
  const prev = () =>
    setCurrent((prev) =>
      prev === 0 ? SAMPLE_REVIEWS.length - 1 : prev - 1
    );

  const avgRating = (
    SAMPLE_REVIEWS.reduce((sum, r) => sum + r.rating, 0) / SAMPLE_REVIEWS.length
  ).toFixed(1);

  return (
    <section className="py-16 lg:py-24">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10 lg:mb-14"
        >
          <span className="text-xs font-inter font-semibold tracking-[0.15em] text-gold-500 uppercase mb-3 block">
            Customer Love
          </span>
          <h2 className="font-playfair text-2xl sm:text-3xl lg:text-4xl font-bold text-espresso mb-3">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-3">
            <StarRating rating={5} />
            <span className="font-inter text-sm text-espresso-200">
              {avgRating} / 5 · {SAMPLE_REVIEWS.length} Reviews
            </span>
          </div>
        </motion.div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {SAMPLE_REVIEWS.slice(0, 3).map((review, i) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard padding="lg" hover className="h-full">
                <Quote className="w-8 h-8 text-gold-200 mb-4" />
                <StarRating rating={review.rating} />
                <h4 className="font-inter font-semibold text-espresso mt-3 mb-2">
                  {review.title}
                </h4>
                <p className="font-inter text-sm text-espresso-200 leading-relaxed mb-4">
                  &ldquo;{review.body}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gold-400/10">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-200 to-gold-400 flex items-center justify-center text-white font-inter font-bold text-sm">
                    {review.user_name[0]}
                  </div>
                  <div>
                    <p className="font-inter font-medium text-sm text-espresso">
                      {review.user_name}
                    </p>
                    {review.is_verified && (
                      <p className="text-[10px] font-inter text-green-600">
                        ✓ Verified Purchase
                      </p>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          ))}
        </div>

        {/* Mobile Carousel */}
        <div className="md:hidden relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.3 }}
            >
              <GlassCard padding="lg">
                <Quote className="w-7 h-7 text-gold-200 mb-3" />
                <StarRating rating={SAMPLE_REVIEWS[current].rating} />
                <h4 className="font-inter font-semibold text-espresso mt-3 mb-2">
                  {SAMPLE_REVIEWS[current].title}
                </h4>
                <p className="font-inter text-sm text-espresso-200 leading-relaxed mb-4">
                  &ldquo;{SAMPLE_REVIEWS[current].body}&rdquo;
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-gold-400/10">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-gold-200 to-gold-400 flex items-center justify-center text-white font-inter font-bold text-sm">
                    {SAMPLE_REVIEWS[current].user_name[0]}
                  </div>
                  <div>
                    <p className="font-inter font-medium text-sm text-espresso">
                      {SAMPLE_REVIEWS[current].user_name}
                    </p>
                    {SAMPLE_REVIEWS[current].is_verified && (
                      <p className="text-[10px] font-inter text-green-600">
                        ✓ Verified Purchase
                      </p>
                    )}
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </AnimatePresence>

          {/* Carousel controls */}
          <div className="flex items-center justify-center gap-4 mt-6">
            <button
              onClick={prev}
              className="w-10 h-10 rounded-full border border-gold-400/20 flex items-center justify-center text-espresso-300 hover:bg-gold-50 transition-colors"
              aria-label="Previous review"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-1.5">
              {SAMPLE_REVIEWS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`w-2 h-2 rounded-full transition-all ${
                    i === current
                      ? 'bg-gold-400 w-5'
                      : 'bg-pearl-400'
                  }`}
                  aria-label={`Go to review ${i + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="w-10 h-10 rounded-full border border-gold-400/20 flex items-center justify-center text-espresso-300 hover:bg-gold-50 transition-colors"
              aria-label="Next review"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
