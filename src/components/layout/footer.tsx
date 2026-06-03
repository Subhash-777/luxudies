// ============================================
// LUXUDIES - Footer Component
// ============================================

'use client';

import Link from 'next/link';
import Image from 'next/image';
import {
  MessageCircle,
  Mail,
  Phone,
  MapPin,
  Heart,
  Truck,
  Shield,
  CreditCard,
  RotateCcw,
  Headphones,
} from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}
import { getWhatsAppUrl } from '@/lib/utils';

const trustBadges = [
  { icon: Truck, label: 'FREE SHIPPING', sub: 'Across Tamil Nadu' },
  { icon: CreditCard, label: 'SECURE PAYMENTS', sub: 'Powered by Razorpay' },
  { icon: Shield, label: 'COD AVAILABLE', sub: 'Pay on delivery' },
  { icon: RotateCcw, label: 'EASY RETURNS', sub: '7-day return policy' },
  { icon: Headphones, label: 'SUPPORT', sub: 'WhatsApp Support' },
];

const shopLinks = [
  { href: '/shop', label: 'Shop All' },
  { href: '/shop/new-arrivals', label: 'New Arrivals' },
  { href: '/shop/bestsellers', label: 'Bestsellers' },
  { href: '/shop/combo-offers', label: 'Combo Offers' },
  { href: '/shop/gift-sets', label: 'Gift Sets' },
];

const helpLinks = [
  { href: '/track-order', label: 'Track Order' },
  { href: '/faq', label: 'FAQs' },
  { href: '/contact', label: 'Contact Us' },
  { href: '/policies/shipping', label: 'Shipping Policy' },
  { href: '/policies/returns', label: 'Returns & Exchange' },
];

const legalLinks = [
  { href: '/about', label: 'About LUXUDIES' },
  { href: '/policies/privacy', label: 'Privacy Policy' },
  { href: '/policies/terms', label: 'Terms & Conditions' },
];

export default function Footer() {
  return (
    <footer className="bg-pearl-50 pb-24 lg:pb-0">
      {/* Trust Badges Bar */}
      <div className="border-y border-gold-400/10 bg-ivory-50/50">
        <div className="container-luxury py-5">
          <div className="flex overflow-x-auto scrollbar-hide gap-6 lg:gap-0 lg:justify-between">
            {trustBadges.map((badge) => (
              <div
                key={badge.label}
                className="flex items-center gap-3 min-w-[180px] lg:min-w-0"
              >
                <div className="w-9 h-9 rounded-full bg-pearl-200 flex items-center justify-center shrink-0">
                  <badge.icon className="w-4 h-4 text-gold-500" />
                </div>
                <div>
                  <p className="text-[11px] font-inter font-bold tracking-wider text-espresso">
                    {badge.label}
                  </p>
                  <p className="text-[10px] font-inter text-espresso-200">
                    {badge.sub}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="container-luxury py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Image
                src="/images/brand/logo.jpg"
                alt="LUXUDIES"
                width={40}
                height={40}
                className="rounded-full border border-gold-400/20"
              />
              <span className="font-playfair text-xl font-bold text-espresso">
                LUXUDIES
              </span>
            </Link>
            <p className="text-sm text-espresso-200 font-inter leading-relaxed mb-4">
              Luxury Jewellery You Deserve. Crafted to be cherished, designed to
              be you.
            </p>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://instagram.com/luxudies"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-pearl-200 flex items-center justify-center text-espresso-300 hover:bg-gold-400 hover:text-white transition-all"
                aria-label="Instagram"
              >
                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href={getWhatsAppUrl('Hi LUXUDIES! I have a question.')}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-pearl-200 flex items-center justify-center text-espresso-300 hover:bg-green-500 hover:text-white transition-all"
                aria-label="WhatsApp"
              >
                <MessageCircle className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@luxudies.com"
                className="w-9 h-9 rounded-full bg-pearl-200 flex items-center justify-center text-espresso-300 hover:bg-gold-400 hover:text-white transition-all"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div>
            <h3 className="font-playfair text-sm font-semibold text-espresso mb-4">
              Shop
            </h3>
            <ul className="space-y-2.5">
              {shopLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-inter text-espresso-200 hover:text-gold-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help Links */}
          <div>
            <h3 className="font-playfair text-sm font-semibold text-espresso mb-4">
              Help
            </h3>
            <ul className="space-y-2.5">
              {helpLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-inter text-espresso-200 hover:text-gold-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-playfair text-sm font-semibold text-espresso mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              {legalLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm font-inter text-espresso-200 hover:text-gold-500 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="col-span-2 md:col-span-1">
            <h3 className="font-playfair text-sm font-semibold text-espresso mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-2">
                <Phone className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <span className="text-sm font-inter text-espresso-200">
                  +91 98765 43210
                </span>
              </li>
              <li className="flex items-start gap-2">
                <Mail className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <span className="text-sm font-inter text-espresso-200">
                  hello@luxudies.com
                </span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <span className="text-sm font-inter text-espresso-200">
                  Tamil Nadu, India
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gold-400/10">
        <div className="container-luxury py-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-espresso-200 font-inter">
              © {new Date().getFullYear()} LUXUDIES. All rights reserved.
            </p>
            <p className="text-xs text-espresso-100 font-inter flex items-center gap-1">
              Crafted with <Heart className="w-3 h-3 text-gold-400 inline" /> in
              Tamil Nadu
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
