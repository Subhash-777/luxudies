# LUXUDIES — Luxury Jewellery Ecommerce

A premium, mobile-first luxury jewelry ecommerce website built for **LUXUDIES**. Features a pearl-white & gold design system, liquid-glass UI, subtle 3D motion, and a fast mobile checkout flow.

## 🚀 Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations:** [Framer Motion](https://www.framer.com/motion/)
- **Backend & Auth:** [Supabase](https://supabase.com/) (PostgreSQL, Auth, Storage)
- **Payments:** [Razorpay](https://razorpay.com/) (Standard Checkout)
- **State Management:** [Zustand](https://zustand-demo.pmnd.rs/) (Cart & Wishlist with localStorage persistence)
- **Icons:** [Lucide React](https://lucide.dev/)

## 💎 Features

- **Storefront:** Home, Shop All, Product Detail, Standalone Static Pages (About, Policies, Contact, FAQ).
- **Shopping:** Cart drawer, Wishlist, Category Filtering, Sort.
- **Checkout:** Fully integrated Razorpay checkout with address collection (Name, Phone, Tamil Nadu cities).
- **Authentication:** Email/Password, Phone OTP, Google OAuth.
- **Account:** Profile management, Order History, Saved Addresses, Settings.
- **Tracking:** Animated order tracking timeline.
- **Admin Panel:** Dashboard, Products/Orders/Customers/Banners CRUD interfaces.

## 🛠️ Setup & Local Development

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment Configuration:**
   Copy `.env.example` (or setup based on your `.env.local` if available) with your Supabase and Razorpay credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

   NEXT_PUBLIC_RAZORPAY_KEY_ID=rzp_test_your_key
   RAZORPAY_KEY_SECRET=your_secret
   
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   ```

3. **Database Setup (Supabase):**
   - Run the SQL schema found in `supabase/schema.sql`.
   - Setup Storage buckets using `supabase/storage.sql`.
   - Check `walkthrough.md` (or the guide provided during setup) for step-by-step Supabase provider configs.

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 🚀 Vercel Deployment Compatibility

This project is 100% compatible with Vercel deployment:
- Uses standard Next.js App Router.
- Build command is `next build`.
- Requires setting the exact same Environment Variables in your Vercel project settings.
- Supabase edge functions/middleware are correctly configured using `@supabase/ssr`.

---

*Crafted to be cherished. Designed to be you.*
