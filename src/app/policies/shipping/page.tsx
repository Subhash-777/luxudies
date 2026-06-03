// ============================================
// LUXUDIES - Shipping Policy Page
// ============================================

export const metadata = {
  title: 'Shipping Policy',
  description: 'LUXUDIES shipping policy — free shipping across Tamil Nadu.',
};

export default function ShippingPolicyPage() {
  return (
    <article className="prose-luxury">
      <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-espresso mb-8">Shipping Policy</h1>
      
      <div className="space-y-6 font-inter text-sm text-espresso-200 leading-relaxed">
        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Free Shipping</h2>
          <p>We offer <strong className="text-espresso">FREE shipping on all orders across Tamil Nadu</strong>. No minimum order value required.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Processing Time</h2>
          <p>Orders are processed within 1-2 business days after payment confirmation. You will receive a confirmation email/SMS with your order details.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Estimated Delivery</h2>
          <p>Standard delivery takes <strong className="text-espresso">3-7 business days</strong> from the date of dispatch. Delivery times may vary based on your location within Tamil Nadu.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Order Tracking</h2>
          <p>Once your order is shipped, you will receive a tracking number via SMS and email. You can track your order anytime on our <a href="/track-order" className="text-gold-500 hover:underline">Track Order</a> page.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Cash on Delivery (COD)</h2>
          <p>Cash on Delivery is available for all orders across Tamil Nadu. You can pay in cash at the time of delivery.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Contact Us</h2>
          <p>For shipping-related queries, reach out to us via <a href="/contact" className="text-gold-500 hover:underline">our contact page</a> or WhatsApp at +91 98765 43210.</p>
        </section>
      </div>
    </article>
  );
}
