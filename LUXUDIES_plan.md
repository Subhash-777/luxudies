# LUXUDIES Website Plan

## 1. Project Vision
LUXUDIES is a premium, mobile-first jewelry storefront built to feel elegant, modern, and highly convertible. The site should combine pearl-white and gold luxury styling with subtle 3D motion, liquid glass UI, and a fast path to purchase.

## 2. Business Goals
- Increase trust and premium perception.
- Convert social traffic from Instagram/WhatsApp into purchases.
- Highlight bestsellers, combos, and gifting intent.
- Make checkout fast and mobile friendly.
- Support order tracking, login, and repeat purchases.

## 3. Brand Positioning
- Core message: luxury jewelry that is elegant, wearable, and gift-ready.
- Tone: refined, warm, aspirational, minimal.
- Audience: mobile-first shoppers, gifting buyers, fashion-conscious customers, and repeat jewelry buyers.

## 4. Visual Direction
### Colors
- Pearl White: #F7F3EE
- Warm Ivory: #F3E7D7
- Champagne Gold: #D4AF37
- Antique Gold: #B8902D
- Soft Beige: #E7D7C3
- Espresso Text: #3A2A1E

### Typography
- Headings: Playfair Display or Cormorant Garamond.
- Body: Inter or Manrope.
- Use serif for premium feel, sans-serif for readability.

### Style Rules
- Soft luxury, not flashy.
- Use rounded glass cards, subtle shadows, thin gold borders.
- Keep backgrounds light and airy.
- Avoid overly dark sections.

## 5. Design System
### UI Tokens
- Radius: 16px cards, 999px pills.
- Spacing: 8px base grid.
- Border: 1px gold-tinted translucent line.
- Shadows: soft warm shadow with low opacity.
- Blur: 8px to 16px for glass surfaces.

### Components
- Header with logo, search, wishlist, cart, login.
- Hero banner with 3D product.
- Product cards.
- Sticky mobile bottom navigation.
- Glass CTA panels.
- Trust badges.
- Review cards.
- Combo offer cards.
- FAQ accordion.
- Order status timeline.
- Login/sign-up modal.
- Checkout summary drawer.

## 6. Site Information Architecture
- Home.
- Shop All.
- New Arrivals.
- Bestsellers.
- Combo Offers.
- Gift Sets.
- About LUXUDIES.
- Reviews.
- Track Order.
- Sign In / Create Account.
- Cart.
- Checkout.
- FAQ.
- Contact / WhatsApp.

## 7. Homepage Flow
### First Fold
- Full-screen hero.
- One signature product with 3D floating motion.
- Headline, short luxury line, and two CTAs.
- Secondary microcopy for trust and delivery.

### Second Fold
- Featured collections in swipeable cards.
- New arrivals and bestsellers.

### Third Fold
- Trust section with product benefits.
- Anti-tarnish, lightweight, water/sweat resistant, gift-ready.

### Fourth Fold
- Combo offers and value bundles.
- Social proof and UGC style gallery.

### Fifth Fold
- FAQ, shipping, payment, and returns.
- Footer with WhatsApp, Instagram, email, policies.

## 8. Hero Content Ideas
- Main headline: Luxury jewellery that speaks before you do.
- Subheadline: Pearl-white elegance, gold-finished details, and timeless everyday shine.
- CTA 1: Shop Now.
- CTA 2: View Collection.
- Small note: Secure checkout powered by Razorpay.

## 9. Product Presentation Strategy
- Show single hero product first.
- Use zoomable image galleries on product pages.
- Add 360°/3D preview where possible.
- Highlight product benefits before long descriptions.
- Show pricing, discounts, combo offers, and availability clearly.

## 10. Motion and Animation Plan
### Motion Principles
- Slow, premium, and soft.
- Never distract from product or checkout.
- Motion should improve perceived quality and depth.

### Homepage Animations
- Hero product gently floats and rotates.
- Gold spark particles appear subtly on scroll or hover.
- Glass cards fade in and lift upward.
- Text reveals with smooth staggered motion.
- Collection cards slightly scale on tap.
- Sticky CTA softly glows.

### Scroll Flow
- Hero enters with fade and float.
- Sections appear with parallax depth.
- Product cards animate in staggered rows.
- Reviews and FAQ slide in gently.

### Mobile Animation Rule
- Keep animations light.
- Disable heavy motion on low-power devices.
- Respect reduced-motion settings.

## 11. 3D Model Plan
- Use one signature necklace or jewelry piece in hero.
- Optional 3D product preview on premium product pages.
- Keep model lightweight and optimized.
- Use realistic metallic reflections and pearl-gold lighting.
- Add slow auto-rotation with touch drag support.
- Prefer GLTF/GLB assets.

## 12. Liquid Glass UI Plan
- Use translucent cards with soft blur.
- Add gold borders and subtle glow.
- Use pearl-white panels with warm shadows.
- Keep glass effects refined, not noisy.
- Apply glass style to CTA cards, filters, cart drawer, and login modals.

## 13. Mobile-First Strategy
- Design for mobile first, desktop second.
- Use one-column layouts on mobile.
- Keep CTAs sticky and easy to tap.
- Place product, price, and buy button above the fold when possible.
- Use bottom navigation for home, shop, cart, account, and order tracking.
- Keep fonts large enough for readability.

## 14. Conversion Strategy
- Push combo offers early.
- Use gift-oriented copy.
- Show limited-time or limited-stock messages carefully.
- Add customer reviews near the CTA.
- Use WhatsApp CTA for quick decision buyers.
- Make checkout as short as possible.

## 15. Business Growth Ideas
- Instagram to product landing pages.
- WhatsApp broadcast catalog links.
- Festive campaign pages.
- Gift guide landing pages.
- Combo bundles for festivals, birthdays, and weddings.
- Referral rewards.
- First-order discount.
- Loyalty points or repeat buyer perks.
- UGC campaigns with customer photos.

## 16. Product and Content Strategy
- Categorize by style, occasion, and price.
- Use short premium descriptions.
- Add styling suggestions.
- Add care instructions.
- Add gift-use scenarios.
- Add buy-together recommendations.

## 17. Payment and Checkout
- Use Razorpay Standard Checkout.
- Show UPI, cards, netbanking, wallets, and QR.
- Keep checkout clean and trustworthy.
- Show order summary, shipping, and taxes clearly.
- Add guest checkout if possible.
- Verify payment server-side.

## 18. Authentication Strategy
- Sign in with email/password.
- Add OTP login for mobile users.
- Save addresses and wishlists.
- Show order history.
- Allow profile editing and contact updates.
- Use secure session handling.

## 19. Order Status Strategy
- Create a Track Order page.
- Show timeline: Placed, Confirmed, Packed, Shipped, Out for Delivery, Delivered.
- Add live tracking links when available.
- Show delivery ETA.
- Send email/WhatsApp/SMS status updates.

## 20. Recommended Tech Stack
### Frontend
- Next.js.
- React.
- Tailwind CSS.
- Framer Motion.
- Three.js or React Three Fiber.
- GSAP for premium scroll effects.

### Backend
- Supabase Auth.
- Supabase Postgres.
- Supabase Storage.
- Supabase Realtime.
- Supabase Edge Functions.
- Supabase Database Webhooks.

### Payments
- Razorpay.

### Media and Assets
- Cloudinary optional if extra optimization is needed.
- WebP/AVIF images.
- GLB models for 3D.

### Operations
- GitHub.
- Vercel for frontend deployment.
- Sentry for error tracking.
- GA4 and Meta Pixel for analytics.

## 21. Why Supabase
- One platform for auth, database, storage, realtime, and serverless functions.
- Good for order tracking and login.
- Good for scalable ecommerce without managing separate backend hosting.
- Works well with webhooks and realtime updates.

## 22. Data Model Ideas
- users.
- products.
- product_images.
- variants.
- carts.
- cart_items.
- orders.
- order_items.
- payments.
- addresses.
- wishlists.
- reviews.
- coupons.
- support_requests.

## 23. Admin Panel Needs
- View orders.
- Update statuses.
- Manage products.
- Upload images.
- Change banners.
- Create combo offers.
- Review customer messages.
- View payment status.

## 24. SEO and Marketing
- Add product schema.
- Add FAQ schema.
- Use descriptive page titles.
- Optimize images and metadata.
- Make landing pages for collections and campaigns.
- Track conversions and abandoned carts.

## 25. Performance Rules
- Optimize all media.
- Lazy-load 3D content.
- Use compressed images.
- Keep animations lightweight.
- Avoid large libraries unless required.
- Ensure fast mobile load times.

## 26. Accessibility Rules
- Use strong contrast for text.
- Make buttons large enough.
- Provide alt text for every product image.
- Respect reduced-motion preferences.
- Keep forms simple and readable.

## 27. Suggested Page Content Blocks
- Hero.
- Bestsellers.
- New arrivals.
- Why LUXUDIES.
- Combo offers.
- Reviews.
- Gift ideas.
- FAQs.
- Order tracking.
- Login/account.
- Footer with support.

## 28. Launch Strategy
- Start with a polished homepage and top 10 products.
- Launch with 3 to 5 combo offers.
- Add Instagram and WhatsApp promotion.
- Test checkout and order tracking carefully.
- Add analytics before marketing spend.

## 29. Final Experience Goal
The final site should feel like a luxury jewelry brand that is visually rich, mobile friendly, fast to buy from, and easy to trust.
