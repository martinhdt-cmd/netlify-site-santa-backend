
import { Suspense } from 'react';
import Layout from '../../components/layout/Layout';

const RetailWholesalePage = () => {
  return (
    <Layout>
      <Suspense fallback={<div className="min-h-screen bg-white"></div>}>
        <main className="min-h-screen bg-white">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-red-50 to-amber-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-red-900 mb-6">
                  Retail & Wholesale
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Coming soon: Premium printed gift cards for retailers, with bulk packs 
                  and point-of-sale displays to bring the magic to your customers.
                </p>
              </div>
            </div>
          </section>

          {/* Coming Soon Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <div className="w-20 h-20 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-8">
                  <i className="ri-gift-line text-3xl text-cream"></i>
                </div>
                <h2 className="text-4xl font-serif font-bold text-red-900 mb-6">
                  Printed Gift Cards for Retailers
                </h2>
                <div className="bg-amber-100 border border-amber-400 rounded-xl p-6 max-w-2xl mx-auto">
                  <h3 className="text-2xl font-bold text-amber-800 mb-4">Coming Soon</h3>
                  <p className="text-amber-800 leading-relaxed">
                    We're developing beautiful printed gift cards for retail partners. 
                    Bulk packs, point-of-sale displays, and partner incentives will be available.
                  </p>
                </div>
              </div>

              {/* What's Coming */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-900 to-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <i className="ri-store-line text-2xl text-cream"></i>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-red-900 mb-3">
                    Point-of-Sale Displays
                  </h3>
                  <p className="text-gray-600">
                    Eye-catching retail displays designed to maximize gift card sales during peak seasons.
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-900 to-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <i className="ri-archive-line text-2xl text-cream"></i>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-red-900 mb-3">
                    Bulk Packs
                  </h3>
                  <p className="text-gray-600">
                    Wholesale quantities with attractive retailer pricing and flexible ordering options.
                  </p>
                </div>

                <div className="text-center p-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-red-900 to-amber-600 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <i className="ri-handshake-line text-2xl text-cream"></i>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-red-900 mb-3">
                    Partner Incentives
                  </h3>
                  <p className="text-gray-600">
                    Competitive margins, promotional support, and co-marketing opportunities for retail partners.
                  </p>
                </div>
              </div>

              {/* Preview Card */}
              <div className="max-w-4xl mx-auto">
                <div className="card hover:shadow-xl transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
                      <img
                        src="https://readdy.ai/api/search-image?query=Retail%20gift%20card%20display%20stand%20in%20store%2C%20premium%20Christmas%20gift%20cards%2C%20point%20of%20sale%20display%2C%20festive%20retail%20environment%2C%20professional%20retail%20setup%2C%20holiday%20merchandise%2C%20cozy%20store%20atmosphere&width=500&height=400&seq=retail-display&orientation=landscape"
                        alt="Retail Gift Card Display"
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="p-8 lg:p-10">
                      <h3 className="text-3xl font-serif font-bold text-red-900 mb-4">
                        Perfect for Retailers
                      </h3>
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Our printed gift cards will be ideal for gift shops, bookstores, toy stores, 
                        and seasonal retailers looking to offer unique, memorable gifts to their customers.
                      </p>
                      
                      <div className="space-y-3 mb-6">
                        <div className="flex items-center text-sm text-gray-700">
                          <i className="ri-check-line text-green-600 mr-3"></i>
                          <span>Premium printed gift card design</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <i className="ri-check-line text-green-600 mr-3"></i>
                          <span>Multiple denominations available</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <i className="ri-check-line text-green-600 mr-3"></i>
                          <span>Easy redemption process for customers</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <i className="ri-check-line text-green-600 mr-3"></i>
                          <span>Seasonal and year-round options</span>
                        </div>
                        <div className="flex items-center text-sm text-gray-700">
                          <i className="ri-check-line text-green-600 mr-3"></i>
                          <span>Marketing materials included</span>
                        </div>
                      </div>
                      
                      <div className="bg-red-50 rounded-lg p-4">
                        <p className="text-sm text-red-800">
                          <i className="ri-information-line mr-2"></i>
                          <strong>Launching Soon:</strong> We're finalizing partnerships and production. 
                          Join our waitlist to be first to know when retail options become available.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Interest Form CTA */}
          <section className="py-20 bg-gradient-to-r from-red-900 to-amber-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center text-cream">
                <h2 className="text-3xl font-serif font-bold mb-6">
                  Interested in Retail Partnership?
                </h2>
                <p className="text-xl text-cream/90 mb-8 max-w-2xl mx-auto">
                  Join our waitlist to receive updates on wholesale pricing, minimum orders, 
                  and launch timeline for our retail gift card program.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => window.REACT_APP_NAVIGATE('/contact')}
                    className="btn-secondary bg-amber-600 hover:bg-amber-700"
                  >
                    <i className="ri-mail-line mr-2"></i>
                    Join Retail Waitlist
                  </button>
                  <button 
                    onClick={() => document.querySelector('#vapi-widget-floating-button')?.click()}
                    className="btn-secondary bg-white/20 hover:bg-white/30 text-cream"
                  >
                    <i className="ri-chat-smile-line mr-2"></i>
                    Chat About Partnership
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Current Options */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h3 className="text-2xl font-serif font-bold text-red-900 mb-6">
                  Available Now for Individual Customers
                </h3>
                <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
                  While we prepare our retail program, individual customers can still enjoy 
                  our personalised video services and printable gift card add-ons.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => window.REACT_APP_NAVIGATE('/santa-messages')}
                    className="btn-primary"
                  >
                    <i className="ri-gift-line mr-2"></i>
                    Browse Santa Videos
                  </button>
                  <button 
                    onClick={() => window.REACT_APP_NAVIGATE('/cards-gifts')}
                    className="btn-secondary"
                  >
                    <i className="ri-gift-2-line mr-2"></i>
                    Printable Gift Cards
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </Suspense>
    </Layout>
  );
};

export default RetailWholesalePage;
