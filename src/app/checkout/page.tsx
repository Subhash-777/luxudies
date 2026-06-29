// ============================================
// LUXUDIES - Checkout Page (Complete Rewrite)
// ============================================

'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft, Lock, Truck, CreditCard, ChevronDown,
  MapPin, ShieldCheck, Package, Sparkles, CheckCircle2
} from 'lucide-react';
import Header from '@/components/layout/header';
import MobileNav from '@/components/layout/mobile-nav';
import CartDrawer from '@/components/cart/cart-drawer';
import { useCartStore } from '@/store/cart-store';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';
import { createClient } from '@/lib/supabase/client';
import { INDIA_STATES, STATE_CITY_MAP } from '@/lib/locations';

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

export default function CheckoutPage() {
  const { items, getSubtotal, getTotal, getShipping, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [customCity, setCustomCity] = useState('');
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressIdx, setSelectedAddressIdx] = useState<string>('new');

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

  const handleAddressSelect = (addr: any) => {
    const newState = addr.state || 'Tamil Nadu';
    const newCity = addr.city || '';
    const availableCities = STATE_CITY_MAP[newState] || [];
    const isCustomCity = newCity && !availableCities.includes(newCity);

    setAddress({
      fullName: addr.full_name || '',
      phone: addr.phone || '',
      alternatePhone: addr.alternate_phone || '',
      email: addr.email || address.email,
      line1: addr.line1 || '',
      line2: addr.line2 || '',
      city: isCustomCity ? 'Other' : newCity,
      state: newState,
      pincode: addr.pincode || '',
    });
    setCustomCity(isCustomCity ? newCity : '');
  };

  useEffect(() => {
    async function init() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (!user) {
        toast.error('Please sign in to checkout');
        window.location.href = '/auth/login?redirect=/checkout';
        return;
      }

      // Fetch saved addresses
      const { data: addrs } = await supabase
        .from('addresses')
        .select('*')
        .eq('user_id', user.id)
        .order('is_default', { ascending: false });

      if (addrs && addrs.length > 0) {
        setSavedAddresses(addrs);
        handleAddressSelect({ ...addrs[0], email: user.email });
        setSelectedAddressIdx('0');
      } else {
        // Try to autofill from profile
        const { data: profile } = await supabase
          .from('users')
          .select('full_name, phone')
          .eq('id', user.id)
          .single();

        setAddress(prev => ({
          ...prev,
          email: user.email || '',
          fullName: profile?.full_name || '',
          phone: profile?.phone || '',
        }));
      }
    }
    init();
  }, []);

  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAddress(prev => ({ ...prev, state: e.target.value, city: '' }));
    setCustomCity('');
  };

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAddress(prev => ({ ...prev, city: e.target.value }));
    if (e.target.value !== 'Other') setCustomCity('');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setAddress(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateForm = () => {
    if (!address.fullName.trim()) { toast.error('Please enter your full name'); return false; }
    if (!address.phone.trim() || address.phone.replace(/\D/g, '').length < 10) {
      toast.error('Please enter a valid 10-digit phone number'); return false;
    }
    if (!address.email.trim() || !address.email.includes('@')) {
      toast.error('Please enter a valid email address'); return false;
    }
    if (!address.line1.trim()) { toast.error('Please enter your address'); return false; }
    if (!address.city.trim() || (address.city === 'Other' && !customCity.trim())) {
      toast.error('Please select or enter your city'); return false;
    }
    if (!address.state.trim()) { toast.error('Please select your state'); return false; }
    if (!address.pincode.trim() || address.pincode.replace(/\D/g, '').length < 6) {
      toast.error('Please enter a valid 6-digit pincode'); return false;
    }
    return true;
  };

  const handlePayment = async () => {
    if (!validateForm()) return;
    if (items.length === 0) { toast.error('Your cart is empty'); return; }

    setIsProcessing(true);

    try {
      const finalAddress = {
        ...address,
        city: address.city === 'Other' ? customCity : address.city,
      };

      const response = await fetch('/api/paytm/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((item) => {
            const img = item.product.images?.find((i: any) => i.is_primary) || item.product.images?.[0];
            return {
              product_id: item.product.id,
              variant_id: item.variant?.id || null,
              name: item.product.name,
              product_image: img?.url || null,
              variant_info: item.variant ? `${item.variant.name}: ${item.variant.value}` : null,
              quantity: item.quantity,
            };
          }),
          address: finalAddress,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.txnToken) {
        throw new Error(data.error || 'Payment initiation failed. Please try again.');
      }

      // ── Redirect to Paytm payment page (works in all environments, no CORS) ──
      const env = data.environment === 'STAGING' ? 'securegw-stage' : 'securegw';
      const paytmUrl = `https://${env}.paytm.in/theia/api/v1/showPaymentPage?mid=${data.mid}&orderId=${data.orderId}`;

      // Create and submit a hidden form (required by Paytm spec)
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = paytmUrl;

      const tokenInput = document.createElement('input');
      tokenInput.type = 'hidden';
      tokenInput.name = 'txnToken';
      tokenInput.value = data.txnToken;

      form.appendChild(tokenInput);
      document.body.appendChild(form);
      form.submit();
    } catch (error: any) {
      console.error('Payment error:', error);
      toast.error(error?.message || 'Something went wrong. Please try again.');
      setIsProcessing(false);
    }
  };

  const shipping = getShipping(address.state);
  const subtotal = getSubtotal();
  const total = getTotal(address.state);
  const isFreeShipping = shipping === 0;

  const inputCls =
    'w-full h-12 bg-white/60 border border-amber-100 rounded-xl text-sm font-inter text-espresso placeholder:text-gray-400 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-100 transition-all px-4';
  const labelCls =
    'text-[11px] font-inter font-bold text-amber-700 uppercase tracking-widest mb-1.5 block';

  if (items.length === 0) {
    return (
      <>
        <Header />
        <main className="min-h-[calc(100vh-80px)] flex flex-col items-center justify-center bg-gradient-to-br from-amber-50 via-white to-rose-50">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center px-6 max-w-sm mx-auto"
          >
            <div className="w-24 h-24 rounded-full bg-amber-50 border-2 border-amber-200 flex items-center justify-center mx-auto mb-6">
              <Package className="w-10 h-10 text-amber-400" />
            </div>
            <h1 className="font-playfair text-3xl font-bold text-espresso mb-3">Your Cart is Empty</h1>
            <p className="font-inter text-sm text-gray-500 mb-8 leading-relaxed">
              Looks like you haven't added anything yet. Explore our beautiful jewellery collections.
            </p>
            <Link href="/shop">
              <button className="btn-gold px-10 py-4 text-xs tracking-widest w-full rounded-full">
                EXPLORE COLLECTION
              </button>
            </Link>
          </motion.div>
        </main>
        <MobileNav />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-gradient-to-br from-amber-50/60 via-white to-rose-50/30 pb-32 lg:pb-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-14">

          {/* Back link */}
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-xs font-inter font-semibold tracking-widest text-amber-600 hover:text-amber-800 transition-colors uppercase mb-8 group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Back to Cart
          </Link>

          {/* Page title */}
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            className="font-playfair text-4xl lg:text-5xl font-bold text-espresso mb-10"
          >
            Checkout
          </motion.h1>

          <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-start">

            {/* ── LEFT: Shipping Form ─────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Saved Addresses */}
              {savedAddresses.length > 0 && (
                <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6">
                  <h2 className="font-playfair text-lg font-bold text-espresso mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-amber-500" />
                    Saved Addresses
                  </h2>
                  <div className="grid sm:grid-cols-2 gap-3">
                    {savedAddresses.map((addr, idx) => (
                      <button
                        key={addr.id}
                        onClick={() => { setSelectedAddressIdx(String(idx)); handleAddressSelect(addr); }}
                        className={`text-left p-4 rounded-xl border-2 transition-all text-sm ${
                          selectedAddressIdx === String(idx)
                            ? 'border-amber-400 bg-amber-50'
                            : 'border-gray-100 hover:border-amber-200 bg-white'
                        }`}
                      >
                        <div className="flex items-center gap-2 mb-1">
                          {selectedAddressIdx === String(idx) && (
                            <CheckCircle2 className="w-4 h-4 text-amber-500 flex-shrink-0" />
                          )}
                          <span className="font-semibold text-espresso font-inter">
                            {addr.label || `Address ${idx + 1}`}
                          </span>
                        </div>
                        <p className="text-gray-500 font-inter leading-relaxed text-xs">
                          {addr.full_name} · {addr.line1}, {addr.city}, {addr.state} — {addr.pincode}
                        </p>
                      </button>
                    ))}
                    <button
                      onClick={() => {
                        setSelectedAddressIdx('new');
                        setAddress(prev => ({
                          fullName: '', phone: '', alternatePhone: '',
                          email: prev.email, line1: '', line2: '',
                          city: '', state: 'Tamil Nadu', pincode: ''
                        }));
                        setCustomCity('');
                      }}
                      className={`text-left p-4 rounded-xl border-2 transition-all text-sm ${
                        selectedAddressIdx === 'new'
                          ? 'border-amber-400 bg-amber-50'
                          : 'border-dashed border-gray-200 hover:border-amber-300 bg-white'
                      }`}
                    >
                      <span className="font-inter text-amber-600 font-semibold text-sm">+ Enter New Address</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Shipping Details Form */}
              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 sm:p-8">
                <h2 className="font-playfair text-lg font-bold text-espresso mb-6 flex items-center gap-2 pb-4 border-b border-amber-50">
                  <Truck className="w-5 h-5 text-amber-500" />
                  Shipping Details
                </h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-5">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className={labelCls}>Full Name *</label>
                    <input
                      id="fullName" name="fullName" type="text"
                      placeholder="Enter your full name"
                      value={address.fullName} onChange={handleChange}
                      className={inputCls} required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="email" className={labelCls}>Email Address *</label>
                    <input
                      id="email" name="email" type="email"
                      placeholder="your@email.com"
                      value={address.email} onChange={handleChange}
                      className={inputCls} required
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className={labelCls}>Contact Number *</label>
                    <input
                      id="phone" name="phone" type="tel"
                      placeholder="10-digit mobile number"
                      value={address.phone} onChange={handleChange}
                      className={inputCls} maxLength={10} required
                    />
                  </div>

                  <div>
                    <label htmlFor="alternatePhone" className={labelCls}>Alternate Contact</label>
                    <input
                      id="alternatePhone" name="alternatePhone" type="tel"
                      placeholder="Optional"
                      value={address.alternatePhone} onChange={handleChange}
                      className={inputCls} maxLength={10}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="line1" className={labelCls}>Address Line 1 *</label>
                    <input
                      id="line1" name="line1" type="text"
                      placeholder="House/Flat no., Building, Street"
                      value={address.line1} onChange={handleChange}
                      className={inputCls} required
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="line2" className={labelCls}>Address Line 2</label>
                    <input
                      id="line2" name="line2" type="text"
                      placeholder="Landmark, Area (Optional)"
                      value={address.line2} onChange={handleChange}
                      className={inputCls}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="state" className={labelCls}>State *</label>
                    <div className="relative">
                      <select
                        id="state" name="state"
                        value={address.state} onChange={handleStateChange}
                        className={`${inputCls} appearance-none pr-10`} required
                      >
                        {INDIA_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 pointer-events-none" />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="city" className={labelCls}>City *</label>
                    <div className="relative">
                      <select
                        id="city" name="city"
                        value={address.city} onChange={handleCityChange}
                        className={`${inputCls} appearance-none pr-10`} required
                      >
                        <option value="">Select city</option>
                        {(STATE_CITY_MAP[address.state] || ['Other']).map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-amber-500 pointer-events-none" />
                    </div>
                    <AnimatePresence>
                      {address.city === 'Other' && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-2"
                        >
                          <input
                            type="text" placeholder="Enter your city"
                            value={customCity}
                            onChange={(e) => setCustomCity(e.target.value)}
                            className={inputCls} required
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <div>
                    <label htmlFor="pincode" className={labelCls}>Pincode *</label>
                    <input
                      id="pincode" name="pincode" type="text"
                      placeholder="6-digit pincode"
                      value={address.pincode} onChange={handleChange}
                      className={inputCls} maxLength={6} required
                    />
                  </div>
                </div>

                {/* Delivery badge */}
                <div className={`mt-6 flex items-center gap-3 p-3 rounded-xl text-sm font-inter font-medium ${
                  isFreeShipping
                    ? 'bg-green-50 text-green-700 border border-green-100'
                    : 'bg-amber-50 text-amber-700 border border-amber-100'
                }`}>
                  <Truck className="w-4 h-4 flex-shrink-0" />
                  {isFreeShipping
                    ? '🎉 Free delivery across Tamil Nadu!'
                    : '🚚 ₹99 delivery charge applies for orders outside Tamil Nadu'
                  }
                </div>
              </div>
            </motion.div>

            {/* ── RIGHT: Order Summary ────────────────────────── */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="lg:col-span-5"
            >
              <div className="bg-white rounded-2xl border border-amber-100 shadow-sm p-6 sm:p-8 lg:sticky lg:top-24">
                <h2 className="font-playfair text-lg font-bold text-espresso mb-5 pb-4 border-b border-amber-50 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  Order Summary
                </h2>

                {/* Items */}
                <div className="space-y-4 mb-6 max-h-[280px] overflow-y-auto scrollbar-hide">
                  {items.map((item) => {
                    const img = item.product.images?.find((i: any) => i.is_primary) || item.product.images?.[0];
                    return (
                      <div key={`${item.product.id}-${item.variant_id}`} className="flex gap-4 items-center">
                        <div className="relative w-16 h-20 rounded-xl overflow-hidden bg-amber-50 flex-shrink-0 border border-amber-100">
                          <Image
                            src={img?.url || '/images/brand/logo.jpg'}
                            alt={item.product.name}
                            fill className="object-cover" sizes="64px"
                          />
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-playfair text-sm font-semibold text-espresso line-clamp-2 leading-snug mb-0.5">
                            {item.product.name}
                          </p>
                          {item.variant && (
                            <p className="text-xs text-gray-400 font-inter mb-1">
                              {item.variant.name}: {item.variant.value}
                            </p>
                          )}
                          <span className="font-inter text-sm font-bold text-amber-700">
                            {formatPrice(item.product.price * item.quantity)}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Price breakdown */}
                <div className="space-y-3 pt-5 border-t border-amber-50">
                  <div className="flex justify-between text-sm font-inter">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-semibold text-espresso">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm font-inter">
                    <span className="text-gray-500">Shipping</span>
                    <span className={`font-semibold ${isFreeShipping ? 'text-green-600' : 'text-amber-700'}`}>
                      {isFreeShipping ? 'FREE' : formatPrice(shipping)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-4 mt-2 border-t border-amber-100">
                    <span className="font-inter font-bold text-espresso tracking-widest text-sm uppercase">
                      Total
                    </span>
                    <span className="font-playfair font-bold text-3xl text-espresso">
                      {formatPrice(total)}
                    </span>
                  </div>
                </div>

                {/* Pay Button */}
                <button
                  onClick={handlePayment}
                  disabled={isProcessing}
                  className="relative w-full mt-8 h-14 rounded-2xl font-inter font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 overflow-hidden transition-all duration-300
                    bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500
                    hover:from-amber-600 hover:via-yellow-500 hover:to-amber-600
                    shadow-lg hover:shadow-amber-200 text-white
                    disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <>
                      <motion.span
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CreditCard className="w-5 h-5" />
                      PAY {formatPrice(total)}
                    </>
                  )}
                </button>

                {/* Trust badges */}
                <div className="mt-5 flex items-center justify-center gap-4 text-xs text-gray-400 font-inter">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-green-500" />
                    100% Secure
                  </span>
                  <span className="w-1 h-1 bg-gray-200 rounded-full" />
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-green-500" />
                    Secured by Paytm
                  </span>
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
