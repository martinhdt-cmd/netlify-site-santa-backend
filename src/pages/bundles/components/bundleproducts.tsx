import { redirectToCheckout, STRIPE_PRICES } from '../../../utils/stripe';

const BundleProducts = () => {
  const videoOptions = [
    {
      id: 'santa-standard',
      name: 'Santa Standard Video',
      price: '€27',
      description: 'Warm personalised fireside message from Santa',
      duration: '2-3 minutes',
      features: ['Personal name mention', 'Custom details', 'Town/city reference'],
    },
    {
      id: 'santa-two-part',
      name: 'Santa Wish List & Christmas Eve Check-In',
      price: '€41',
      description: 'Two separate videos: early wish list acknowledgement + Christmas Eve follow-up',
      duration: '2 videos (2-3 min each)',
      features: ['Wish list acknowledgement', 'Christmas Eve follow-up', 'Scheduled delivery', 'Extended personalisation'],
      badge: '2 Videos',
    },
    {
      id: 'greeting-birthday',
      name: 'Birthday Greeting Video',
      price: '€20',
      description: 'Personalised birthday message with celebration',
      duration: '2-3 minutes',
      features: ['Birthday wishes', 'Age mention', 'Personal touches'],
    },
    {
      id: 'greeting-anniversary',
      name: 'Anniversary Greeting Video',
      price: '€20',
      description: 'Romantic anniversary message for couples',
      duration: '2-3 minutes',
      features: ['Relationship celebration', 'Years together', 'Romantic tone'],
    },
    {
      id: 'greeting-congratulations',
      name: 'Congratulations Video',
      price: '€20',
      description: 'Celebrate achievements and milestones',
      duration: '2-3 minutes',
      features: ['Achievement recognition', 'Proud moments', 'Encouragement'],
    },
  ];

  const bundleDetails = {
    totalValue: '€135',
    bundlePrice: '€90',
    savings: '€45',
    description: 'Choose any 5 videos from our collection. At least 3 must be Santa/festive themed for the Christmas season.',
    minSantaVideos: 3,
  };

  const familyBundle = {
    id: 'family-video-bundle',
    name: 'Family Video Bundle',
    subtitle: '5 Personalised Videos',
    price: '€90',
    originalPrice: '€135',
    priceId: STRIPE_PRICES.FAMILY_BUNDLE,
    savings: 'Save €45',
    description: 'Mix and match any combination of Santa videos and greeting videos. Perfect for families who want to create magical memories throughout the year.',
    features: [
      'Choose any 5 videos from our collection',
      'Mix Santa videos & greeting videos',
      'Individual personalisation for each video',
      'Flexible delivery scheduling',
      'Valid for 12 months from purchase',
      'Perfect for multiple family members',
      'Great value - €18 per video',
      'Priority customer support'
    ],
    examples: [
      '2 Santa videos + 3 birthday greetings',
      '1 Santa Two-Part + 4 occasion greetings',
      '5 Santa Standard videos for siblings',
      '3 Santa videos + 2 anniversary greetings'
    ],
    image: 'https://readdy.ai/api/search-image?query=Family%20gathered%20around%20cozy%20fireplace%20with%20Christmas%20stockings%2C%20warm%20golden%20lighting%2C%20multiple%20gift%20boxes%2C%20family%20celebration%20atmosphere%2C%20realistic%20holiday%20scene%2C%20peaceful%20loving%20ambiance%2C%20bundle%20of%20gifts&width=500&height=400&seq=family-bundle&orientation=landscape',
    popular: true,
  };

  const handleCheckout = async () => {
    await redirectToCheckout({
      priceId: familyBundle.priceId,
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/bundles`,
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-red-900 mb-6">
            Family Video Bundle
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The perfect way to create magical memories for your entire family. 
            Mix and match videos to suit every occasion and family member.
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="card relative group hover:shadow-xl transition-all duration-300">
            {familyBundle.popular && (
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-amber-600 text-white px-6 py-2 rounded-full text-sm font-medium">
                  Best Value for Families
                </span>
              </div>
            )}
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              <div className="aspect-[4/3] lg:aspect-auto overflow-hidden">
                <img
                  src={familyBundle.image}
                  alt={familyBundle.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-8 lg:p-10">
                <div className="mb-6">
                  <h3 className="text-3xl font-serif font-bold text-red-900 mb-2">
                    {familyBundle.name}
                  </h3>
                  <p className="text-lg text-gray-600 mb-4">{familyBundle.subtitle}</p>
                  
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl font-bold text-amber-600">
                      {familyBundle.price}
                    </span>
                    <div className="text-right">
                      <div className="text-lg text-gray-500 line-through">
                        {familyBundle.originalPrice}
                      </div>
                      <div className="text-sm font-semibold text-green-600">
                        {familyBundle.savings}
                      </div>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {familyBundle.description}
                </p>
                
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-3">Bundle includes:</h4>
                  <ul className="space-y-2">
                    {familyBundle.features.slice(0, 6).map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-700">
                        <i className="ri-check-line text-green-600 mr-2 text-xs"></i>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <button
                  onClick={handleCheckout}
                  className="btn-primary w-full text-center py-4 text-lg mb-4 whitespace-nowrap"
                >
                  Order Bundle - €90
                </button>
                
                <p className="text-xs text-gray-500 text-center">
                  Valid for 12 months • Mix any videos • Individual personalisation
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Example Combinations */}
        <div className="mt-16 bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-red-900 mb-4">
              Popular Bundle Combinations
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Here are some popular ways families use their 5-video bundle. 
              You can choose any combination that works for your family.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {familyBundle.examples.map((example, index) => (
              <div key={index} className="bg-white rounded-xl p-6 text-center">
                <i className="ri-gift-line text-3xl text-amber-600 mb-3"></i>
                <p className="font-medium text-gray-900">{example}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Upgrade to Season Pass CTA */}
        <div className="mt-16 bg-gradient-to-r from-red-900 to-amber-600 rounded-2xl p-8 text-cream">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold mb-4">
              Want Even More Videos?
            </h3>
            <p className="text-cream/90 mb-6 max-w-2xl mx-auto">
              Our Season Pass Membership gives you 6 free videos per year, plus 20% off additional videos, 
              reminder service, and priority generation. Perfect for families who love staying connected.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => {
                  const seasonPassSection = document.querySelector('#season-pass-section');
                  seasonPassSection?.scrollIntoView({ behavior: 'smooth' });
                }}
                className="btn-secondary bg-amber-600 hover:bg-amber-700 whitespace-nowrap"
              >
                <i className="ri-vip-crown-line mr-2"></i>
                View Season Pass
              </button>
              <button 
                onClick={() => document.querySelector('#vapi-widget-floating-button')?.click()}
                className="btn-secondary bg-white/20 hover:bg-white/30 text-cream whitespace-nowrap"
              >
                <i className="ri-chat-smile-line mr-2"></i>
                Get Recommendations
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BundleProducts;
