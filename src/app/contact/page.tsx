// ============================================
// LUXUDIES - Contact Page
// ============================================

'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, MessageCircle, Clock, Send } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import Footer from '@/components/layout/footer';
import CartDrawer from '@/components/cart/cart-drawer';
import WhatsAppFAB from '@/components/home/whatsapp-fab';
import GlassCard from '@/components/ui/glass-card';
import Button from '@/components/ui/button';
import { getWhatsAppUrl } from '@/lib/utils';
import toast from 'react-hot-toast';

const contactMethods = [
  { icon: MessageCircle, label: 'WhatsApp', value: '+91 98765 43210', sub: 'Fastest response', href: getWhatsAppUrl('Hi LUXUDIES!'), color: 'bg-green-50 text-green-600' },
  { icon: Mail, label: 'Email', value: 'hello@luxudies.com', sub: 'We reply within 24hrs', href: 'mailto:hello@luxudies.com', color: 'bg-gold-50 text-gold-500' },
  { icon: Phone, label: 'Phone', value: '+91 98765 43210', sub: 'Mon-Sat 10am-7pm', href: 'tel:+919876543210', color: 'bg-blue-50 text-blue-500' },
  { icon: MapPin, label: 'Location', value: 'Tamil Nadu, India', sub: 'Online store only', href: '#', color: 'bg-purple-50 text-purple-500' },
];

export default function ContactPage() {
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    setIsSubmitting(false);
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', subject: '', message: '' });
  };

  const inputClasses = "w-full h-11 px-4 bg-white/60 backdrop-blur-sm border border-gold-400/15 rounded-[10px] text-sm font-inter text-espresso placeholder:text-espresso-100 focus:outline-none focus:border-gold-400/40 focus:ring-2 focus:ring-gold-400/10 transition-all";

  return (
    <>
      <Header />
      <main className="min-h-screen pb-24 lg:pb-0">
        <div className="container-luxury py-8 lg:py-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="font-playfair text-3xl lg:text-5xl font-bold text-espresso mb-3">Get in Touch</h1>
            <p className="font-inter text-sm text-espresso-200 max-w-md mx-auto">
              We&apos;d love to hear from you. Reach out through any of the channels below.
            </p>
          </motion.div>

          {/* Contact Methods */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
            {contactMethods.map((method, i) => (
              <motion.a
                key={method.label}
                href={method.href}
                target={method.href.startsWith('http') ? '_blank' : undefined}
                rel={method.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <GlassCard hover padding="md" className="text-center h-full">
                  <div className={`w-12 h-12 rounded-xl ${method.color} flex items-center justify-center mx-auto mb-3`}>
                    <method.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-inter font-semibold text-sm text-espresso mb-1">{method.label}</h3>
                  <p className="font-inter text-xs text-espresso-300">{method.value}</p>
                  <p className="font-inter text-[10px] text-espresso-100 mt-1">{method.sub}</p>
                </GlassCard>
              </motion.a>
            ))}
          </div>

          {/* Contact Form */}
          <div className="max-w-xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <GlassCard variant="strong" padding="lg">
                <h2 className="font-playfair text-xl font-semibold text-espresso mb-6 text-center">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <input type="text" placeholder="Your Name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClasses} required />
                    <input type="email" placeholder="Your Email *" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className={inputClasses} required />
                  </div>
                  <input type="text" placeholder="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className={inputClasses} />
                  <textarea
                    placeholder="Your Message *"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={5}
                    className={`${inputClasses} h-auto py-3 resize-none`}
                    required
                  />
                  <Button type="submit" fullWidth size="lg" isLoading={isSubmitting} icon={<Send className="w-4 h-4" />}>
                    SEND MESSAGE
                  </Button>
                </form>
              </GlassCard>
            </motion.div>
          </div>

          {/* Business hours */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }} className="text-center mt-8">
            <div className="flex items-center justify-center gap-2 text-sm font-inter text-espresso-200">
              <Clock className="w-4 h-4 text-gold-400" />
              <span>Business Hours: Monday – Saturday, 10:00 AM – 7:00 PM IST</span>
            </div>
          </motion.div>
        </div>
      </main>
      <Footer />
      <CartDrawer />
      <MobileNav />
      <WhatsAppFAB />
    </>
  );
}
