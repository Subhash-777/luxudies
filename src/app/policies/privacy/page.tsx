// ============================================
// LUXUDIES - Privacy Policy
// ============================================

export const metadata = {
  title: 'Privacy Policy',
  description: 'LUXUDIES privacy policy — how we collect, use, and protect your data.',
};

export default function PrivacyPolicyPage() {
  return (
    <article>
      <h1 className="font-playfair text-3xl lg:text-4xl font-bold text-espresso mb-2">Privacy Policy</h1>
      <p className="font-inter text-xs text-espresso-100 mb-8">Last updated: June 2026</p>
      
      <div className="space-y-6 font-inter text-sm text-espresso-200 leading-relaxed">
        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Information We Collect</h2>
          <p>When you visit our website or make a purchase, we collect:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Personal information: name, email, phone number, shipping address</li>
            <li>Payment information (processed securely by Razorpay — we never store card details)</li>
            <li>Browsing data: pages visited, products viewed, device information</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">How We Use Your Information</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To process and fulfil your orders</li>
            <li>To communicate order updates and shipping notifications</li>
            <li>To provide customer support</li>
            <li>To send promotional offers (only with your consent)</li>
            <li>To improve our website and services</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Data Security</h2>
          <p>We implement industry-standard security measures to protect your personal information. All payment transactions are processed through <strong className="text-espresso">Razorpay</strong>, which is PCI-DSS compliant.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Third-Party Sharing</h2>
          <p>We do not sell or share your personal information with third parties, except:</p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li>Payment processor (Razorpay) for transaction processing</li>
            <li>Shipping partners for order delivery</li>
            <li>Analytics services (anonymized data only)</li>
          </ul>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Your Rights</h2>
          <p>You have the right to access, update, or delete your personal information. Contact us at hello@luxudies.com for any data-related requests.</p>
        </section>

        <section>
          <h2 className="font-playfair text-xl font-semibold text-espresso mb-3">Contact</h2>
          <p>For privacy-related questions, email us at <a href="mailto:hello@luxudies.com" className="text-gold-500 hover:underline">hello@luxudies.com</a>.</p>
        </section>
      </div>
    </article>
  );
}
