// ============================================
// LUXUDIES - Reviews Section (Redesigned)
// ============================================

'use client';

import { useRef, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const reviews = [
  {
    id: 1,
    name: "Priya S.",
    location: "Chennai, TN",
    rating: 5,
    text: "The signature bow pendant is absolutely stunning. It has that perfect 18K gold shine and doesn't irritate my sensitive skin at all. Highly recommend!",
    product: "Signature Bow Pendant"
  },
  {
    id: 2,
    name: "Ananya R.",
    location: "Bangalore, KA",
    rating: 5,
    text: "I bought the everyday essentials combo. The packaging was so premium, it felt like opening a luxury gift. The minimalist ring is my new favorite.",
    product: "Everyday Essentials Combo"
  },
  {
    id: 3,
    name: "Karthik M.",
    location: "Coimbatore, TN",
    rating: 5,
    text: "Gifted the pearl drop earrings to my wife for our anniversary. She loves how lightweight they are. The quality is exceptional for the price.",
    product: "Pearl Drop Earrings"
  },
  {
    id: 4,
    name: "Sneha V.",
    location: "Hyderabad, TS",
    rating: 5,
    text: "Been wearing the chain bracelet daily, even in the shower. True to their word, absolutely zero tarnishing. Beautiful craftsmanship.",
    product: "Classic Chain Bracelet"
  }
];

export default function ReviewsSection() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const progress = scrollLeft / (scrollWidth - clientWidth);
    setScrollProgress(progress);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', handleScroll);
      handleScroll(); // Init
      return () => el.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <section className="py-20 lg:py-32 bg-ivory-50 relative overflow-hidden">
      <div className="container-luxury">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 lg:mb-16"
        >
          {/* Overall Rating Badge */}
          <div className="inline-flex flex-col items-center justify-center mb-6">
            <div className="flex items-center gap-1 mb-2">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 fill-gold-400 text-gold-400" />
              ))}
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-playfair text-4xl font-bold text-espresso">4.9</span>
              <span className="font-inter text-sm text-espresso-300">based on 1,200+ reviews</span>
            </div>
          </div>
          
          <h2 className="font-playfair text-3xl lg:text-4xl xl:text-5xl font-bold text-espresso mb-3">
            Words of Love
          </h2>
          <p className="font-inter text-espresso-200">
            Real experiences from our beautiful community.
          </p>
        </motion.div>

        {/* Scrollable Reviews Container */}
        <div 
          ref={scrollRef}
          className="flex lg:grid lg:grid-cols-4 gap-4 lg:gap-6 overflow-x-auto lg:overflow-visible pb-8 lg:pb-0 snap-x snap-mandatory scrollbar-hide -mx-4 px-4 lg:mx-0 lg:px-0"
        >
          {reviews.map((review, index) => (
            <motion.div
              key={review.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-50px' }}
              transition={{ duration: 0.6, delay: index * 0.1, ease: 'easeOut' }}
              className="min-w-[300px] sm:min-w-[340px] lg:min-w-0 snap-start flex-shrink-0"
            >
              <div className="glass-card p-6 lg:p-8 h-full flex flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-medium hover:border-gold-400/30">
                <div className="flex gap-1 mb-4">
                  {[...Array(review.rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-gold-400 text-gold-400" />
                  ))}
                </div>
                
                <p className="font-playfair italic text-lg lg:text-xl text-espresso-400 leading-relaxed flex-1 mb-6">
                  "{review.text}"
                </p>

                <div className="mt-auto border-t border-gold-400/10 pt-4">
                  <p className="font-inter font-bold text-sm text-espresso mb-0.5">
                    {review.name}
                  </p>
                  <p className="font-inter text-xs text-espresso-300 mb-2">
                    {review.location}
                  </p>
                  <p className="font-inter text-[10px] text-gold-500 uppercase tracking-wider">
                    Purchased: {review.product}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile Scroll Indicator */}
        <div className="flex lg:hidden justify-center gap-2 mt-4">
          {reviews.map((_, i) => (
            <div 
              key={i} 
              className={`h-1 rounded-full transition-all duration-300 ${
                Math.abs(scrollProgress * (reviews.length - 1) - i) < 0.5 
                  ? 'w-6 bg-gold-400' 
                  : 'w-1.5 bg-gold-400/20'
              }`} 
            />
          ))}
        </div>
      </div>
    </section>
  );
}
