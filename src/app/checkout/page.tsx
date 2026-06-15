// ============================================
// LUXUDIES - Checkout Page (Redesigned)
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Truck, CreditCard, ChevronDown } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import CartDrawer from '@/components/cart/cart-drawer';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';

interface AddressForm {
  fullName: string;
  phone: string;
  alternatePhone: string;
  email: string;
  line1: string;
  line2: string;
  city: string;
  state: string;
  pincode: string;
}

const TAMIL_NADU_CITIES = [
  'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem',
  'Tirunelveli', 'Tiruppur', 'Vellore', 'Erode', 'Thoothukkudi',
  'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi', 'Karur',
  'Udhagamandalam', 'Hosur', 'Nagercoil', 'Kanchipuram', 'Other',
];

export default function CheckoutPage() {
  const { items, getSubtotal, getTotal, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [address, setAddress] = useState<AddressForm>({
    fullName: '',
    phone: '',
    alternatePhone: '',
    email: '',
    line1: '',
    line2: '',
    city: '',
    state: 'Tamil Nadu',
    pincode: '',
  });

  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error('Please sign in to checkout');
        window.location.href = '/auth/login?redirect=/checkout';
      }
    }
    checkAuth();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!address.fullName.trim()) { toast.error('Please enter your full name'); return false; }
    if (!address.phone.trim() || address.phone.length < 10) { toast.error('Please enter a valid phone number'); return false; }
    if (!address.email.trim() || !address.email.includes('@')) { toast.error('Please enter a valid email address'); return false; }
    if (!address.line1.trim()) { toast.error('Please enter your address'); return false; }
    if (!address.city.trim()) { toast.error('Please select your city'); return false; }
    if (!address.pincode.trim() || address.pincode.length < 6) { toast.error('Please enter a valid pincode'); return false; }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    setIsProcessing(true);

    try {
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          subtotal: getSubtotal(),
          shippingCost: 0,
          total: getTotal(),
          items: items.map((item) => {
            const primaryImage = item.product.images?.find((img) => img.is_primary) || item.product.images?.[0];
            return {
              product_id: item.product.id,
              variant_id: item.variant?.id || null,
              name: item.product.name,
              product_image: primaryImage?.url || null,
              variant_info: item.variant ? `${item.variant.name}: ${item.variant.value}` : null,
              price: item.product.price + (item.variant?.price_adjustment || 0),
              quantity: item.quantity,
            };
          }),
          address,
        }),
      });

      const data = await response.json();

      if (!data.orderId) {
        throw new Error('Failed to create order');
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: getTotal() * 100,
        currency: 'INR',
        name: 'LUXUDIES',
        description: 'Luxury Jewellery Purchase',
        image: '/images/brand/logo.jpg',
        order_id: data.orderId,
        handler: async function (response: any) {
          const verifyRes = await fetch('/api/razorpay/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            clearCart();
            window.location.href = `/checkout/success?order=${verifyData.orderNumber}`;
          } else {
            toast.error('Payment verification failed. Please contact support.');
          }
        },
        prefill: {
          name: address.fullName,
          email: address.email,
          contact: address.phone,
        },
        theme: {
          color: '#D4AF37',
          backdrop_color: 'rgba(58, 42, 30, 0.5)',
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
            toast.error('Payment cancelled');
          },
        },
      };

      // @ts-expect-error Razorpay is loaded via script
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-pearl">
          <div className="text-center px-4 max-w-sm mx-auto">
            <h1 className="font-playfair text-3xl font-bold text-espresso mb-4">
              Your Cart is Empty
            </h1>
            <p className="font-inter text-sm text-espresso-300 mb-8 leading-relaxed">
              Looks like you haven't added anything to your cart yet. Discover our beautiful collections.
            </p>
            <Link href="/shop">
              <button className="btn-gold px-8 py-4 text-xs tracking-widest w-full">
                SHOP NOW
              </button>
            </Link>
          </div>
        </main>
        <MobileNav />
      </>
    );
  }

  const inputClasses = "w-full h-12 bg-transparent border-b border-gold-400/30 text-sm font-inter text-espresso placeholder:text-espresso-200 focus:outline-none focus:border-gold-500 transition-colors px-1";
  const labelClasses = "text-[11px] font-inter font-semibold text-espresso-300 uppercase tracking-widest mb-1 block";

  return (
    <>
      <Header />
      <main className="min-h-screen bg-pearl pb-24 lg:pb-12">
        <div className="container-luxury py-8 lg:py-12">
          
          <Link href="/cart" className="inline-flex items-center gap-2 text-xs font-inter font-medium tracking-widest text-espresso-200 hover:text-gold-500 transition-colors uppercase mb-8">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-16">
            
            {/* Shipping Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="lg:col-span-7"
            >
              <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-espresso mb-8">
                Checkout
              </h1>

              <div className="glass-card p-6 sm:p-10">
                <h2 className="font-playfair text-xl font-bold text-espresso mb-8 flex items-center gap-3 border-b border-gold-400/20 pb-4">
                  <Truck className="w-5 h-5 text-gold-500" />
                  Shipping Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className={labelClasses}>Full Name *</label>
                    <input id="fullName" name="fullName" type="text" value={address.fullName} onChange={handleChange} className={inputClasses} required />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="email" className={labelClasses}>Email Address *</label>
                    <input id="email" name="email" type="email" value={address.email} onChange={handleChange} className={inputClasses} required />
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelClasses}>Contact Number *</label>
                    <input id="phone" name="phone" type="tel" value={address.phone} onChange={handleChange} className={inputClasses} maxLength={10} required />
                  </div>

                  <div>
                    <label htmlFor="alternatePhone" className={labelClasses}>Alternate Contact</label>
                    <input id="alternatePhone" name="alternatePhone" type="tel" value={address.alternatePhone} onChange={handleChange} className={inputClasses} maxLength={10} />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="line1" className={labelClasses}>Address Line 1 *</label>
                    <input id="line1" name="line1" type="text" placeholder="House/Flat number, Building, Street" value={address.line1} onChange={handleChange} className={inputClasses} required />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="line2" className={labelClasses}>Address Line 2</label>
                    <input id="line2" name="line2" type="text" placeholder="Landmark, Area (Optional)" value={address.line2} onChange={handleChange} className={inputClasses} />
                  </div>

                  <div>
                    <label htmlFor="city" className={labelClasses}>City *</label>
                    <div className="relative">
                      <select id="city" name="city" value={address.city} onChange={handleChange} className={`${inputClasses} appearance-none pr-10`} required>
                        <option value="">Select city</option>
                        {TAMIL_NADU_CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
                      </select>
                      <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="pincode" className={labelClasses}>Pincode *</label>
                    <input id="pincode" name="pincode" type="text" value={address.pincode} onChange={handleChange} className={inputClasses} maxLength={6} required />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="state" className={labelClasses}>State</label>
                    <input id="state" name="state" type="text" value={address.state} className={`${inputClasses} bg-pearl-200/50 cursor-not-allowed`} readOnly />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-5"
            >
              <div className="glass-card p-6 sm:p-8 lg:sticky lg:top-24">
                <h2 className="font-playfair text-xl font-bold text-espresso mb-6 border-b border-gold-400/20 pb-4">
                  Order Summary
                </h2>

                <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto scrollbar-hide pr-2">
                  {items.map((item) => {
                    const img = item.product.images.find((i) => i.is_primary) || item.product.images[0];
                    return (
                      <div key={`${item.product.id}-${item.variant_id}`} className="flex gap-4">
                        <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-pearl-100 flex-shrink-0 border border-gold-400/10">
                          {img && <Image src={img.url} alt={item.product.name} fill className="object-cover" sizes="64px" />}
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-antique text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-sm">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0 py-1">
                          <p className="font-playfair text-sm font-semibold text-espresso line-clamp-2 leading-snug mb-1">{item.product.name}</p>
                          <span className="font-inter text-sm font-bold text-espresso">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="space-y-3 pt-6 border-t border-gold-400/20 mb-8">
                  <div className="flex justify-between text-sm font-inter">
                    <span className="text-espresso-300">Subtotal</span>
                    <span className="font-medium text-espresso">{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm font-inter">
                    <span className="text-espresso-300">Shipping</span>
                    <span className="font-medium text-antique">FREE</span>
                  </div>
                  <div className="flex justify-between pt-4 mt-2 border-t border-gold-400/20">
                    <span className="font-inter font-bold text-espresso uppercase tracking-widest">Total</span>
                    <span className="font-inter font-bold text-2xl text-espresso">{formatPrice(getTotal())}</span>
                  </div>
                </div>

                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="w-full btn-gold h-14 text-sm tracking-widest flex items-center justify-center gap-3 shadow-gold"
                >
                  {isProcessing ? 'PROCESSING...' : `PAY ${formatPrice(getTotal())}`}
                  {!isProcessing && <CreditCard className="w-5 h-5" />}
                </button>

                <div className="flex flex-col items-center gap-3 mt-6">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-gold-500" />
                    <span className="text-xs font-inter font-medium text-espresso-300">
                      Secured by Razorpay
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </main>
      <CartDrawer />
      <MobileNav />
    </>
  );
}
