import Layout from '../../components/layout/Layout';

const PrivacyPolicyPage = () => {
  return (
    <Layout>
      <div className="min-h-screen bg-cream py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-8 md:p-12">
            <h1 className="text-4xl font-serif font-bold text-red-900 mb-2">
              Privacy Policy & Terms of Service
            </h1>
            <p className="text-red-700 font-medium mb-8">Keep In Mind Greetings - Child-Safe Experience</p>
            <p className="text-gray-600 mb-8">Last updated: December 2024</p>
            
            <div className="prose prose-lg max-w-none">
              <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                <h2 className="text-xl font-bold text-green-800 mb-2">🎅 Child-Safe Christmas Magic</h2>
                <p className="text-green-700">
                  Our service is designed to create magical, family-friendly Christmas experiences for children. 
                  All content is PG-rated and carefully reviewed to ensure it's appropriate for young audiences.
                </p>
              </div>

              <h2 className="text-2xl font-serif font-bold text-red-900 mt-8 mb-4">
                1. Information We Collect
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">We collect only information necessary for creating personalized videos:</p>
              <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6">
                <li>Parent/guardian name and email address</li>
                <li>Child's name and age (for appropriate content)</li>
                <li>Payment information (processed securely by Stripe; we never store card details)</li>
                <li>Personalization details (achievements, messages) for video creation</li>
                <li>Delivery scheduling preferences</li>
              </ul>

              <h2 className="text-2xl font-serif font-bold text-red-900 mt-8 mb-4">
                2. Child Protection & Content Safety
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <ul className="list-disc pl-6 text-blue-700 leading-relaxed">
                  <li><strong>All videos are PG-rated</strong> - Safe for children of all ages</li>
                  <li><strong>Family-friendly messaging only</strong> - Christmas-themed, positive content</li>
                  <li><strong>No personal information sharing</strong> - Child details never shared with third parties</li>
                  <li><strong>Secure video delivery</strong> - Videos sent only to parent email addresses</li>
                  <li><strong>Content review process</strong> - All videos reviewed before delivery</li>
                </ul>
              </div>

              <h2 className="text-2xl font-serif font-bold text-red-900 mt-8 mb-4">
                3. Refund Policy
              </h2>
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-bold text-amber-800 mb-3">Important Refund Terms:</h3>
                <ul className="list-disc pl-6 text-amber-700 leading-relaxed space-y-2">
                  <li><strong>Before Preview Approval:</strong> Full refund available if you're not satisfied</li>
                  <li><strong>After Preview Approval:</strong> No refunds once you approve the preview video</li>
                  <li><strong>Delivery Guarantee:</strong> Full refund if final video not delivered within 24 hours of scheduled time</li>
                  <li><strong>Technical Issues:</strong> Full refund for any technical problems preventing delivery</li>
                </ul>
                <p className="text-amber-800 font-medium mt-4">
                  ⚠️ By approving your preview, you confirm satisfaction with the video content.
                </p>
              </div>

              <h2 className="text-2xl font-serif font-bold text-red-900 mt-8 mb-4">
                4. Service Guarantee
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">We guarantee:</p>
              <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6">
                <li>Preview ready within 24-48 hours of order</li>
                <li>Final video delivered within 24 hours of approval</li>
                <li>One free revision included with each order</li>
                <li>Child-safe, family-friendly content in all videos</li>
                <li>Secure, encrypted delivery to your email</li>
              </ul>

              <h2 className="text-2xl font-serif font-bold text-red-900 mt-8 mb-4">
                5. How We Use Your Information
              </h2>
              <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6">
                <li>Create personalized Santa videos for your child</li>
                <li>Schedule and deliver videos at your chosen time</li>
                <li>Process payments securely through Stripe</li>
                <li>Send order confirmations and delivery notifications</li>
                <li>Provide customer support when needed</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-6 font-medium text-red-700">
                🔒 We NEVER sell, rent, or share your information with third parties for marketing.
              </p>

              <h2 className="text-2xl font-serif font-bold text-red-900 mt-8 mb-4">
                6. Data Protection & Security
              </h2>
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                <p className="text-gray-700 leading-relaxed mb-4">Your information is protected through:</p>
                <ul className="list-disc pl-6 text-gray-700 leading-relaxed">
                  <li>Stripe for secure payment processing (PCI DSS compliant)</li>
                  <li>Supabase for encrypted data storage</li>
                  <li>HTTPS encryption for all communications</li>
                  <li>Limited access controls - only authorized personnel</li>
                  <li>Regular security audits and updates</li>
                </ul>
              </div>

              <h2 className="text-2xl font-serif font-bold text-red-900 mt-8 mb-4">
                7. Cookies & Tracking
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">We use minimal, essential cookies for:</p>
              <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6">
                <li>Website functionality and security</li>
                <li>Order processing and payment</li>
                <li>Customer support chat (if used)</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-6 font-medium">
                ✅ We do NOT use advertising, analytics, or tracking cookies.
              </p>

              <h2 className="text-2xl font-serif font-bold text-red-900 mt-8 mb-4">
                8. Your Rights & Data Control
              </h2>
              <p className="text-gray-700 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc pl-6 text-gray-700 leading-relaxed mb-6">
                <li>Request a copy of your data</li>
                <li>Update or correct your information</li>
                <li>Delete your account and all associated data</li>
                <li>Opt out of marketing communications</li>
              </ul>
              <p className="text-gray-700 leading-relaxed mb-6">
                Contact us at:{' '}
                <a href="mailto:support@keepinmindgreetings.com" className="text-red-700 hover:text-red-900 underline font-medium">
                  support@keepinmindgreetings.com
                </a>
              </p>

              <h2 className="text-2xl font-serif font-bold text-red-900 mt-8 mb-4">
                9. Children's Privacy (COPPA Compliance)
              </h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-6">
                <ul className="list-disc pl-6 text-red-700 leading-relaxed space-y-2">
                  <li>Our service requires <strong>parental consent</strong> for children under 13</li>
                  <li>Only parents/guardians can place orders and provide child information</li>
                  <li>We collect minimal child information (name, age) only for video personalization</li>
                  <li>Child data is never used for marketing or shared with third parties</li>
                  <li>Videos are delivered only to verified parent email addresses</li>
                  <li>Parents can request deletion of child data at any time</li>
                </ul>
              </div>

              <h2 className="text-2xl font-serif font-bold text-red-900 mt-8 mb-4">
                10. Contact & Support
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                <p className="text-green-700 leading-relaxed mb-4">
                  <strong>For immediate assistance:</strong>
                </p>
                <ul className="list-disc pl-6 text-green-700 leading-relaxed">
                  <li>Email: <a href="mailto:support@keepinmindgreetings.com" className="underline font-medium">support@keepinmindgreetings.com</a></li>
                  <li>Response time: Within 4 hours during business hours</li>
                  <li>Emergency delivery issues: Priority support available</li>
                </ul>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-200">
                <p className="text-sm text-gray-600 italic text-center">
                  By using our service, you agree to these terms. We reserve the right to update this policy, 
                  with changes posted on this page. Continued use constitutes acceptance of updates.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default PrivacyPolicyPage;