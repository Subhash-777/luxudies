// ============================================
// LUXUDIES - Checkout Page
// ============================================

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Lock, Truck, Shield, CreditCard, ChevronDown } from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import CartDrawer from '@/components/cart/cart-drawer';
import Button from '@/components/ui/button';
import GlassCard from '@/components/ui/glass-card';
import { useCartStore } from '@/store/cart-store';
import { formatPrice, SHIPPING_CONFIG } from '@/lib/utils';
import toast from 'react-hot-toast';

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
      // Create Razorpay order on server
      const response = await fetch('/api/razorpay/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: getTotal(),
          items: items.map((item) => ({
            product_id: item.product_id,
            name: item.product.name,
            price: item.product.price,
            quantity: item.quantity,
          })),
          address,
        }),
      });

      const data = await response.json();

      if (!data.orderId) {
        throw new Error('Failed to create order');
      }

      // Open Razorpay Checkout
      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: getTotal() * 100, // paise
        currency: 'INR',
        name: 'LUXUDIES',
        description: 'Luxury Jewellery Purchase',
        image: '/images/brand/logo.jpg',
        order_id: data.orderId,
        handler: async function (response: { razorpay_order_id: string; razorpay_payment_id: string; razorpay_signature: string }) {
          // Verify payment on server
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
        <main className="min-h-screen flex items-center justify-center py-20">
          <div className="text-center px-4">
            <h1 className="font-playfair text-2xl font-bold text-espresso mb-3">
              Nothing to Checkout
            </h1>
            <p className="font-inter text-sm text-espresso-200 mb-6">
              Your cart is empty. Add some beautiful pieces first.
            </p>
            <Link href="/shop">
              <Button>SHOP NOW</Button>
            </Link>
          </div>
        </main>
        <MobileNav />
      </>
    );
  }

  const inputClasses = "w-full h-11 px-4 bg-white/60 backdrop-blur-sm border border-gold-400/15 rounded-[10px] text-sm font-inter text-espresso placeholder:text-espresso-100 focus:outline-none focus:border-gold-400/40 focus:ring-2 focus:ring-gold-400/10 transition-all";
  const labelClasses = "text-xs font-inter font-semibold text-espresso-300 uppercase tracking-wider mb-1.5 block";

  return (
    <>
      <Header />
      <main className="min-h-screen pb-24 lg:pb-0">
        <div className="container-luxury py-6 lg:py-10">
          {/* Back */}
          <Link href="/cart" className="flex items-center gap-2 text-sm font-inter text-espresso-200 hover:text-gold-500 transition-colors mb-6">
            <ArrowLeft className="w-4 h-4" />
            Back to Cart
          </Link>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-3xl lg:text-4xl font-bold text-espresso mb-8"
          >
            Checkout
          </motion.h1>

          <div className="grid lg:grid-cols-5 gap-8">
            {/* Shipping Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="lg:col-span-3"
            >
              <GlassCard variant="strong" padding="lg">
                <h2 className="font-playfair text-lg font-semibold text-espresso mb-6 flex items-center gap-2">
                  <Truck className="w-5 h-5 text-gold-500" />
                  Shipping Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Full Name */}
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className={labelClasses}>Full Name *</label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      placeholder="Enter your full name"
                      value={address.fullName}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label htmlFor="phone" className={labelClasses}>Contact Number *</label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={address.phone}
                      onChange={handleChange}
                      className={inputClasses}
                      maxLength={15}
                      required
                    />
                  </div>

                  {/* Alternate Phone */}
                  <div>
                    <label htmlFor="alternatePhone" className={labelClasses}>Alternate Contact</label>
                    <input
                      id="alternatePhone"
                      name="alternatePhone"
                      type="tel"
                      placeholder="Optional"
                      value={address.alternatePhone}
                      onChange={handleChange}
                      className={inputClasses}
                      maxLength={15}
                    />
                  </div>

                  {/* Email */}
                  <div className="sm:col-span-2">
                    <label htmlFor="email" className={labelClasses}>Email Address *</label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="your@email.com"
                      value={address.email}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                    />
                  </div>

                  {/* Address Line 1 */}
                  <div className="sm:col-span-2">
                    <label htmlFor="line1" className={labelClasses}>Address Line 1 *</label>
                    <input
                      id="line1"
                      name="line1"
                      type="text"
                      placeholder="House/Flat number, Building, Street"
                      value={address.line1}
                      onChange={handleChange}
                      className={inputClasses}
                      required
                    />
                  </div>

                  {/* Address Line 2 */}
                  <div className="sm:col-span-2">
                    <label htmlFor="line2" className={labelClasses}>Address Line 2</label>
                    <input
                      id="line2"
                      name="line2"
                      type="text"
                      placeholder="Landmark, Area (Optional)"
                      value={address.line2}
                      onChange={handleChange}
                      className={inputClasses}
                    />
                  </div>

                  {/* City */}
                  <div>
                    <label htmlFor="city" className={labelClasses}>City *</label>
                    <div className="relative">
                      <select
                        id="city"
                        name="city"
                        value={address.city}
                        onChange={handleChange}
                        className={`${inputClasses} appearance-none pr-10`}
                        required
                      >
                        <option value="">Select city</option>
                        {TAMIL_NADU_CITIES.map((city) => (
                          <option key={city} value={city}>{city}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-espresso-200 pointer-events-none" />
                    </div>
                  </div>

                  {/* State */}
                  <div>
                    <label htmlFor="state" className={labelClasses}>State</label>
                    <input
                      id="state"
                      name="state"
                      type="text"
                      value={address.state}
                      className={`${inputClasses} bg-pearl-200/50`}
                      readOnly
                    />
                  </div>

                  {/* Pincode */}
                  <div>
                    <label htmlFor="pincode" className={labelClasses}>Pincode *</label>
                    <input
                      id="pincode"
                      name="pincode"
                      type="text"
                      placeholder="600001"
                      value={address.pincode}
                      onChange={handleChange}
                      className={inputClasses}
                      maxLength={6}
                      required
                    />
                  </div>
                </div>
              </GlassCard>
            </motion.div>

            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="lg:col-span-2"
            >
              <GlassCard variant="strong" padding="lg" className="sticky top-24">
                <h2 className="font-playfair text-lg font-semibold text-espresso mb-6">
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto scrollbar-hide">
                  {items.map((item) => {
                    const img = item.product.images.find((i) => i.is_primary) || item.product.images[0];
                    return (
                      <div key={`${item.product_id}-${item.variant_id}`} className="flex gap-3">
                        <div className="relative w-14 h-14 rounded-lg overflow-hidden bg-pearl-100 shrink-0">
                          {img && (
                            <Image src={img.url} alt={item.product.name} fill className="object-cover" sizes="56px" />
                          )}
                          <span className="absolute -top-1 -right-1 w-5 h-5 bg-espresso text-pearl text-[10px] font-bold rounded-full flex items-center justify-center">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-inter text-xs font-medium text-espresso line-clamp-1">{item.product.name}</p>
                          <p className="font-inter text-xs text-espresso-200">Qty: {item.quantity}</p>
                        </div>
                        <span className="font-inter text-sm font-semibold text-espresso shrink-0">
                          {formatPrice(item.product.price * item.quantity)}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Totals */}
                <div className="space-y-2 border-t border-gold-400/10 pt-4 mb-6">
                  <div className="flex justify-between text-sm font-inter">
                    <span className="text-espresso-200">Subtotal</span>
                    <span className="font-medium text-espresso">{formatPrice(getSubtotal())}</span>
                  </div>
                  <div className="flex justify-between text-sm font-inter">
                    <span className="text-espresso-200">Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between pt-3 border-t border-gold-400/10">
                    <span className="font-inter font-semibold text-espresso">Total</span>
                    <span className="font-inter font-bold text-xl text-espresso">{formatPrice(getTotal())}</span>
                  </div>
                </div>

                {/* Pay Button */}
                <Button
                  fullWidth
                  size="lg"
                  onClick={handlePayment}
                  isLoading={isProcessing}
                  icon={<CreditCard className="w-4 h-4" />}
                >
                  {isProcessing ? 'PROCESSING...' : `PAY ${formatPrice(getTotal())}`}
                </Button>

                {/* Trust Badges */}
                <div className="flex flex-col items-center gap-2 mt-4">
                  <div className="flex items-center gap-2">
                    <Lock className="w-3.5 h-3.5 text-gold-400" />
                    <span className="text-[10px] font-inter text-espresso-200">
                      Secured by Razorpay
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-[10px] text-espresso-100 font-inter">
                    <span>UPI</span>
                    <span>•</span>
                    <span>Cards</span>
                    <span>•</span>
                    <span>Net Banking</span>
                    <span>•</span>
                    <span>Wallets</span>
                  </div>
                </div>
              </GlassCard>
            </motion.div>
          </div>
        </div>
      </main>
      <CartDrawer />
      <MobileNav />
    </>
  );
}
