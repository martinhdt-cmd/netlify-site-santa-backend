import { Suspense } from 'react';
import Layout from '../../components/layout/Layout';
import { redirectToCheckout, STRIPE_PRICES } from '../../utils/stripe';

const giftProducts = [
  {
    id: 'printable-card',
    name: 'Printable Gift Card',
    price: '€5',
    type: 'Digital Download',
    features: [
      'Instant PDF download',
      'Beautiful festive design',
      'Personalized recipient name',
      'Custom message included',
      'Print at home',
      'High-resolution quality'
    ],
    image: 'https://readdy.ai/api/search-image?query=Elegant%20printable%20Christmas%20gift%20card%20design%20with%20festive%20borders%20Santa%20sleigh%20and%20reindeer%20illustrations%20beautiful%20typography%20and%20space%20for%20personalized%20message%20red%20green%20and%20gold%20color%20scheme%20professional%20quality%20ready%20to%20print&width=800&height=600&seq=printable-card-product&orientation=landscape'
  },
  {
    id: 'video-gift-card',
    name: 'Video Gift Card - €27',
    price: '€27',
    type: 'Gift Certificate',
    features: [
      'Redeemable for Santa Standard Video',
      'Beautiful digital certificate',
      'Personalized for recipient',
      'Instant email delivery',
      'Valid for 12 months',
      'Perfect gift solution'
    ],
    image: 'https://readdy.ai/api/search-image?query=Premium%20digital%20gift%20certificate%20with%20Santa%20Claus%20theme%20elegant%20border%20design%20with%20snowflakes%20and%20Christmas%20ornaments%20professional%20voucher%20layout%20with%20ribbon%20and%20seal%20festive%20red%20and%20gold%20colors%20ready%20for%20personalization&width=800&height=600&seq=video-gift-card-27&orientation=landscape'
  },
  {
    id: 'video-gift-card-41',
    name: 'Video Gift Card - €41',
    price: '€41',
    type: 'Gift Certificate',
    features: [
      'Redeemable for Two-Part Check-In',
      'Beautiful digital certificate',
      'Personalized for recipient',
      'Instant email delivery',
      'Valid for 12 months',
      'Premium gift option'
    ],
    image: 'https://readdy.ai/api/search-image?query=Deluxe%20digital%20gift%20certificate%20featuring%20Santa%20workshop%20scene%20ornate%20decorative%20border%20with%20holly%20and%20bells%20premium%20voucher%20design%20with%20wax%20seal%20effect%20rich%20festive%20colors%20and%20elegant%20typography%20perfect%20for%20special%20occasions&width=800&height=600&seq=video-gift-card-41&orientation=landscape'
  },
  {
    id: 'bundle-gift-card',
    name: 'Bundle Gift Card - €90',
    price: '€90',
    type: 'Gift Certificate',
    features: [
      'Redeemable for Family Bundle',
      'Beautiful digital certificate',
      'Personalized for recipient',
      'Instant email delivery',
      'Valid for 12 months',
      'Ultimate family gift'
    ],
    image: 'https://readdy.ai/api/search-image?query=Luxury%20family%20bundle%20gift%20certificate%20with%20multiple%20video%20icons%20and%20festive%20family%20scene%20elaborate%20decorative%20frame%20with%20Christmas%20elements%20premium%20quality%20voucher%20design%20warm%20inviting%20colors%20perfect%20for%20gifting%20entire%20family&width=800&height=600&seq=bundle-gift-card&orientation=landscape'
  }
];

const giftCardProduct = {
  id: 'printable-gift-card',
  name: 'Printable Gift Card Add-On',
  price: '€5',
  priceId: STRIPE_PRICES.GIFT_CARD,
  description: 'A beautiful, high-resolution printable gift card PDF featuring festive designs. Perfect for presenting your video gift in a tangible, heartfelt way.',
  features: [
    'High-resolution PDF for printing',
    'Recipient name personalisation',
    'Short custom message included',
    'Multiple festive design options',
    'Instant digital delivery',
    'Print at home or professionally'
  ],
  image: 'https://readdy.ai/api/search-image?query=Elegant%20Christmas%20gift%20card%20with%20festive%20border%2C%20warm%20holiday%20colors%2C%20space%20for%20personalized%20message%2C%20professional%20greeting%20card%20design%2C%20cozy%20winter%20theme%2C%20high%20quality%20printable%20card&width=500&height=400&seq=gift-card-product&orientation=landscape',
};

const CardsGiftsPage = () => {
  const handleGiftCardCheckout = async () => {
    await redirectToCheckout({
      priceId: STRIPE_PRICES.GIFT_CARD_ADDON,
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/cards-gifts`,
    });
  };

  return (
    <Layout>
      <Suspense fallback={<div className="min-h-screen bg-white"></div>}>
        <main className="min-h-screen bg-white">
          {/* Hero Section */}
          <section className="py-20 bg-gradient-to-br from-red-50 to-amber-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center">
                <h1 className="text-4xl md:text-6xl font-serif font-bold text-red-900 mb-6">
                  Gift Cards & Add-Ons
                </h1>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Perfect for gifting personalised video experiences. Give the magic of 
                  custom Santa messages and greeting videos to someone special.
                </p>
              </div>
            </div>
          </section>

          {/* Printable Gift Card Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="max-w-4xl mx-auto">
                <div className="card hover:shadow-xl transition-all duration-300">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
                    <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
                      <img
                        src="https://readdy.ai/api/search-image?query=Elegant%20Christmas%20gift%20card%20design%20by%20warm%20fireplace%2C%20festive%20holiday%20styling%2C%20premium%20printable%20gift%20certificate%2C%20cozy%20winter%20atmosphere%2C%20realistic%20holiday%20scene%2C%20beautiful%20gift%20presentation&width=500&height=400&seq=gift-card-addon&orientation=landscape"
                        alt="Printable Gift Card Add-On"
                        className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    
                    <div className="p-8 lg:p-10">
                      <div className="mb-6">
                        <h2 className="text-3xl font-serif font-bold text-red-900 mb-2">
                          Printable Gift Card Add-On
                        </h2>
                        <div className="flex items-center gap-4 mb-4">
                          <span className="text-4xl font-bold text-amber-600">€5</span>
                          <span className="text-sm text-gray-500">Add-on to any video purchase</span>
                        </div>
                      </div>
                      
                      <p className="text-gray-600 mb-6 leading-relaxed">
                        Transform your video gift into a beautiful, printable presentation. Perfect for 
                        wrapping under the tree, tucking into a card, or presenting as a special surprise.
                      </p>
                      
                      <div className="mb-6">
                        <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                        <ul className="space-y-2">
                          <li className="flex items-center text-sm text-gray-700">
                            <i className="ri-check-line text-green-600 mr-2 text-xs"></i>
                            <span>Beautiful festive gift card design</span>
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <i className="ri-check-line text-green-600 mr-2 text-xs"></i>
                            <span>High-resolution PDF for home printing</span>
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <i className="ri-check-line text-green-600 mr-2 text-xs"></i>
                            <span>Personalised recipient name</span>
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <i className="ri-check-line text-green-600 mr-2 text-xs"></i>
                            <span>Gift message from you</span>
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <i className="ri-check-line text-green-600 mr-2 text-xs"></i>
                            <span>Instructions for accessing the video</span>
                          </li>
                          <li className="flex items-center text-sm text-gray-700">
                            <i className="ri-check-line text-green-600 mr-2 text-xs"></i>
                            <span>Standard card size (fits in envelope)</span>
                          </li>
                        </ul>
                      </div>
                      
                      <div className="bg-amber-50 rounded-lg p-4 mb-6">
                        <p className="text-sm text-amber-800">
                          <i className="ri-information-line mr-2"></i>
                          <strong>Note:</strong> This is an add-on to video purchases. You can add it during checkout 
                          when ordering any Santa video or greeting video, or order it separately here.
                        </p>
                      </div>
                      
                      <div className="space-y-3">
                        <button 
                          onClick={() => window.REACT_APP_NAVIGATE('/santa-messages')}
                          className="btn-primary w-full text-center py-4 text-lg whitespace-nowrap"
                        >
                          Order Video + Gift Card
                        </button>
                        <button 
                          onClick={handleGiftCardCheckout}
                          className="btn-secondary w-full text-center py-4 text-lg whitespace-nowrap"
                        >
                          Order Gift Card Only - €5
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* How It Works */}
          <section className="py-20 bg-gradient-to-r from-red-50 to-amber-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl font-serif font-bold text-red-900 mb-6">
                  How Gift Cards Work
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                  Simple steps to create the perfect gift presentation
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-cream">1</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-red-900 mb-3">
                    Order Your Video
                  </h3>
                  <p className="text-gray-600">
                    Choose any Santa video or greeting video, then add the gift card option during checkout.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-cream">2</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-red-900 mb-3">
                    We Create Both
                  </h3>
                  <p className="text-gray-600">
                    Your personalised video is created along with a beautiful, printable gift card.
                  </p>
                </div>

                <div className="text-center">
                  <div className="w-16 h-16 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl font-bold text-cream">3</span>
                  </div>
                  <h3 className="text-xl font-serif font-bold text-red-900 mb-3">
                    Print & Present
                  </h3>
                  <p className="text-gray-600">
                    Print the gift card at home and present it beautifully. The recipient gets the video link.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* CTA Section */}
          <section className="py-20 bg-gradient-to-r from-red-900 to-amber-600">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center text-cream">
                <h2 className="text-3xl font-serif font-bold mb-6">
                  Ready to Create the Perfect Gift?
                </h2>
                <p className="text-xl text-cream/90 mb-8 max-w-2xl mx-auto">
                  Start with any video and add a beautiful gift card presentation. 
                  Perfect for holidays, birthdays, and special occasions.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button 
                    onClick={() => window.REACT_APP_NAVIGATE('/santa-messages')}
                    className="btn-secondary bg-amber-600 hover:bg-amber-700 whitespace-nowrap"
                  >
                    <i className="ri-gift-line mr-2"></i>
                    Start with Santa Videos
                  </button>
                  <button 
                    onClick={() => window.REACT_APP_NAVIGATE('/greeting-videos')}
                    className="btn-secondary bg-white/20 hover:bg-white/30 text-cream whitespace-nowrap"
                  >
                    <i className="ri-heart-line mr-2"></i>
                    Browse Greeting Videos
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

export default CardsGiftsPage;
