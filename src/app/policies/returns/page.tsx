// ============================================
// LUXUDIES - Returns & Exchange Policy
// ============================================

export const metadata = {
  title: 'Returns & Exchange',
  description: 'LUXUDIES returns and exchange policy — 7-day hassle-free returns.',
};

export default function ReturnsPolicyPage() {
  return (
    <article>
      <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-espresso mb-8">Returns & Exchange Policy</h1>
      
      <div className="space-y-6 font-inter text-sm text-espresso-200 leading-relaxed">
        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">7-Day Return Policy</h2>
          <p>We offer a <strong className="text-espresso">7-day return window</strong> from the date of delivery. If you are not completely satisfied with your purchase, you may request a return or exchange within this period.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Eligibility</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>The product must be unused, unworn, and in its original packaging.</li>
            <li>All tags and labels must be intact.</li>
            <li>Products purchased during clearance or sale events may not be eligible for returns.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">How to Initiate a Return</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Contact us via WhatsApp at +91 98765 43210 or email hello@luxudies.com.</li>
            <li>Provide your order number and reason for return.</li>
            <li>Our team will guide you through the return process.</li>
            <li>Once the return is approved, we will arrange a pickup.</li>
          </ol>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Refund Process</h2>
          <p>Refunds will be processed within <strong className="text-espresso">5-7 business days</strong> after we receive and inspect the returned product. The refund will be credited to your original payment method.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Exchanges</h2>
          <p>We offer exchanges for a different size or style, subject to availability. Exchange requests follow the same process as returns.</p>
        </section>
      </div>
    </article>
  );
}
