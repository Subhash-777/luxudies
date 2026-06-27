// ============================================
// LUXUDIES - Terms & Conditions
// ============================================

export const metadata = {
  title: 'Terms & Conditions',
  description: 'LUXUDIES terms and conditions of use.',
};

export default function TermsPage() {
  return (
    <article>
      <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-espresso mb-2">Terms & Conditions</h1>
      <p className="font-inter text-xs text-espresso-100 mb-8">Last updated: June 2026</p>
      
      <div className="space-y-6 font-inter text-sm text-espresso-200 leading-relaxed">
        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Acceptance of Terms</h2>
          <p>By accessing and using the LUXUDIES website (luxudies.com), you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Products & Pricing</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All prices are listed in Indian Rupees (INR) and include applicable taxes.</li>
            <li>We reserve the right to modify prices without prior notice.</li>
            <li>Product images are representative; actual products may have slight variations.</li>
            <li>Our jewelry is premium fashion jewelry with anti-tarnish coating, not solid gold.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Orders & Payment</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>All orders are subject to availability and confirmation.</li>
            <li>We accept payments via UPI, credit/debit cards, net banking, wallets, and COD.</li>
            <li>Payment is processed securely through Paytm.</li>
            <li>We reserve the right to cancel orders if fraud is suspected.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Shipping</h2>
          <p>Free shipping is available on all orders across Tamil Nadu. Refer to our <a href="/policies/shipping" className="text-gold-500 hover:underline">Shipping Policy</a> for detailed information.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Returns & Refunds</h2>
          <p>We offer a 7-day return policy. Refer to our <a href="/policies/returns" className="text-gold-500 hover:underline">Returns & Exchange Policy</a> for detailed information.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Intellectual Property</h2>
          <p>All content on this website, including designs, logos, images, and text, is the property of LUXUDIES and protected by intellectual property laws.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Limitation of Liability</h2>
          <p>LUXUDIES shall not be liable for any indirect, incidental, or consequential damages arising from the use of our products or services.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Governing Law</h2>
          <p>These terms are governed by the laws of India. Any disputes shall be subject to the jurisdiction of courts in Tamil Nadu, India.</p>
        </section>
      </div>
    </article>
  );
}
