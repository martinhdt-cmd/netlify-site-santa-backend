import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import { redirectToCustomerPortal, createReferralCode } from '../../utils/stripe';

const AccountPage = () => {
  const [email, setEmail] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [referralData, setReferralData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleManageMembership = async () => {
    if (!customerId) {
      alert('Please enter your Stripe Customer ID to manage your membership.');
      return;
    }

    setLoading(true);
    try {
      await redirectToCustomerPortal(customerId);
    } catch (error) {
      console.error('Error:', error);
      alert('Unable to open customer portal. Please contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReferral = async () => {
    if (!email) {
      alert('Please enter your email address.');
      return;
    }

    setLoading(true);
    try {
      const data = await createReferralCode(email);
      setReferralData(data);
    } catch (error) {
      console.error('Error:', error);
      alert('Unable to generate referral code. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Copied to clipboard!');
  };

  return (
    <Layout>
      <main className="min-h-screen bg-gradient-to-b from-red-50 to-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif font-bold text-red-900 mb-4">
              My Account
            </h1>
            <p className="text-xl text-gray-600">
              Manage your membership, referrals, and account settings
            </p>
          </div>

          {/* Membership Management */}
          <div className="card mb-8">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-vip-crown-line text-cream text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-red-900">
                    Manage Membership
                  </h2>
                  <p className="text-gray-600">
                    Update payment methods, view invoices, or cancel subscription
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Stripe Customer ID
                  </label>
                  <input
                    type="text"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                    placeholder="cus_xxxxxxxxxxxxx"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Find this in your confirmation email or contact support
                  </p>
                </div>

                <button
                  onClick={handleManageMembership}
                  disabled={loading || !customerId}
                  className="btn-primary w-full py-3 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Loading...
                    </>
                  ) : (
                    <>
                      <i className="ri-settings-3-line mr-2"></i>
                      Open Customer Portal
                    </>
                  )}
                </button>
              </div>

              <div className="mt-6 bg-amber-50 rounded-lg p-4">
                <h4 className="font-semibold text-amber-900 mb-2">
                  What you can do in the Customer Portal:
                </h4>
                <ul className="space-y-1 text-sm text-amber-800">
                  <li className="flex items-center">
                    <i className="ri-check-line mr-2"></i>
                    Update payment methods
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line mr-2"></i>
                    View and download invoices
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line mr-2"></i>
                    Download receipts
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line mr-2"></i>
                    Cancel subscription
                  </li>
                  <li className="flex items-center">
                    <i className="ri-check-line mr-2"></i>
                    Upgrade or downgrade plans (automatic proration)
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Referral Program */}
          <div className="card">
            <div className="p-8">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mr-4">
                  <i className="ri-gift-line text-white text-xl"></i>
                </div>
                <div>
                  <h2 className="text-2xl font-serif font-bold text-red-900">
                    Referral Rewards
                  </h2>
                  <p className="text-gray-600">
                    Share the magic and earn store credit
                  </p>
                </div>
              </div>

              <div className="mb-6 bg-gradient-to-r from-red-50 to-amber-50 rounded-lg p-6">
                <h4 className="font-semibold text-red-900 mb-3">How it works:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-3xl font-bold text-amber-600 mb-1">20%</div>
                    <p className="text-sm text-gray-700">Store credit for first referral purchase</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-600 mb-1">5%</div>
                    <p className="text-sm text-gray-700">Store credit for each additional referral</p>
                  </div>
                  <div>
                    <div className="text-3xl font-bold text-amber-600 mb-1">30%</div>
                    <p className="text-sm text-gray-700">Maximum discount per order</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Email Address
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="your@email.com"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent"
                  />
                </div>

                <button
                  onClick={handleGenerateReferral}
                  disabled={loading || !email}
                  className="btn-primary w-full py-3 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <i className="ri-loader-4-line animate-spin mr-2"></i>
                      Generating...
                    </>
                  ) : (
                    <>
                      <i className="ri-link mr-2"></i>
                      Generate My Referral Link
                    </>
                  )}
                </button>
              </div>

              {referralData && (
                <div className="mt-6 bg-green-50 rounded-lg p-6">
                  <h4 className="font-semibold text-green-900 mb-4">
                    Your Referral Link is Ready!
                  </h4>
                  
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referral Code
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={referralData.referralCode}
                        readOnly
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg"
                      />
                      <button
                        onClick={() => copyToClipboard(referralData.referralCode)}
                        className="btn-secondary whitespace-nowrap"
                      >
                        <i className="ri-file-copy-line mr-2"></i>
                        Copy
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Referral URL
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={referralData.referralUrl}
                        readOnly
                        className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm"
                      />
                      <button
                        onClick={() => copyToClipboard(referralData.referralUrl)}
                        className="btn-secondary whitespace-nowrap"
                      >
                        <i className="ri-file-copy-line mr-2"></i>
                        Copy
                      </button>
                    </div>
                  </div>

                  <p className="text-sm text-green-800 mt-4">
                    Share this link with friends and family. When they make their first purchase, 
                    you'll earn 20% store credit. Each additional purchase earns you 5% more!
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Help Section */}
          <div className="mt-8 text-center">
            <p className="text-gray-600 mb-4">
              Need help with your account?
            </p>
            <button
              onClick={() => document.querySelector('#vapi-widget-floating-button')?.click()}
              className="btn-secondary whitespace-nowrap"
            >
              <i className="ri-customer-service-line mr-2"></i>
              Chat with Concierge
            </button>
          </div>
        </div>
      </main>
    </Layout>
  );
};

export default AccountPage;
