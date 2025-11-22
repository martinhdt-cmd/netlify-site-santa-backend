import { redirectToCheckout, STRIPE_PRICES } from '../../../utils/stripe';

const FeaturedProducts = () => {
  const products = [
    {
      id: 'santa-standard',
      name: 'Santa Standard Video',
      price: '€27',
      description: 'A warm, personalised fireside message from Santa',
      image: 'https://readdy.ai/api/search-image?query=Santa%20Claus%20sitting%20by%20warm%20fireplace%20reading%20letter%2C%20gentle%20smile%2C%20cozy%20living%20room%2C%20soft%20golden%20lighting%2C%20Christmas%20decorations%2C%20peaceful%20atmosphere%2C%20realistic%20Santa%2C%20comfortable%20armchair&width=400&height=300&seq=santa-standard-featured&orientation=landscape',
      link: '/santa-messages',
    },
    {
      id: 'santa-two-part',
      name: 'Two-Part Santa Experience',
      price: '€41',
      description: 'Wish list acknowledgement + Christmas Eve follow-up',
      badge: 'Most Popular',
      image: 'https://readdy.ai/api/search-image?query=Santa%20Claus%20with%20magical%20storybook%20by%20fireplace%2C%20warm%20golden%20glow%2C%20Christmas%20tree%20background%2C%20cozy%20room%20setting%2C%20storytelling%20moment%2C%20realistic%20Santa%2C%20peaceful%20evening%20atmosphere%2C%20premium%20magical%20scene&width=400&height=300&seq=santa-deluxe-featured&orientation=landscape',
      link: '/santa-messages',
    },
    {
      id: 'greeting-video',
      name: 'Personalised Greeting Video',
      price: '€20',
      description: 'Perfect for birthdays, anniversaries, and special occasions',
      image: 'https://readdy.ai/api/search-image?query=Warm%20greeting%20card%20setup%20by%20cozy%20fireplace%2C%20soft%20golden%20lighting%2C%20comfortable%20celebration%20atmosphere%2C%20festive%20but%20elegant%20setting%2C%20realistic%20interior%20design%2C%20peaceful%20and%20joyful%20ambiance%2C%20any%20occasion%20celebration&width=400&height=300&seq=greeting-featured&orientation=landscape',
      link: '/greeting-videos',
    },
    {
      id: 'family-bundle',
      name: 'Family Video Bundle',
      price: '€90',
      description: 'Any 5 personalised videos - Save €45',
      badge: 'Best Value',
      image: 'https://readdy.ai/api/search-image?query=Family%20gathered%20around%20cozy%20fireplace%20with%20Christmas%20stockings%2C%20warm%20golden%20lighting%2C%20multiple%20gift%20boxes%2C%20family%20celebration%20atmosphere%2C%20realistic%20holiday%20scene%2C%20peaceful%20loving%20ambiance%2C%20bundle%20of%20gifts&width=400&height=300&seq=family-bundle-featured&orientation=landscape',
      link: '/bundles',
    },
  ];

  const handleProductClick = (product: typeof products[0]) => {
    // Navigate to product page for more details
    window.REACT_APP_NAVIGATE(product.link);
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-red-900 mb-6">
            Magical Video Messages
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Create personalised video memories that bring joy, warmth, and wonder 
            to every special occasion throughout the year.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product) => (
            <div
              key={product.id}
              className="card group hover:shadow-xl transition-all duration-300 cursor-pointer"
              onClick={() => handleProductClick(product)}
            >
              {product.badge && (
                <div className="absolute -top-3 -right-3 z-10">
                  <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {product.badge}
                  </span>
                </div>
              )}
              
              <div className="aspect-[3/2] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-serif font-bold text-red-900 leading-tight">
                    {product.name}
                  </h3>
                  <div className="text-right flex-shrink-0 ml-2">
                    <span className="text-xl font-bold text-amber-600">
                      {product.price}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 text-sm leading-relaxed mb-4">
                  {product.description}
                </p>
                
                <button className="btn-primary w-full text-sm py-2 whitespace-nowrap">
                  Learn More
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Season Pass CTA */}
        <div className="mt-16 bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-serif font-bold text-red-900 mb-4">
            Want Even More Value?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Our Season Pass Membership gives you 6 free videos per year, plus 20% off additional videos, 
            reminder service, and priority generation.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => window.REACT_APP_NAVIGATE('/bundles')}
              className="btn-primary whitespace-nowrap"
            >
              <i className="ri-vip-crown-line mr-2"></i>
              View Season Pass
            </button>
            <button 
              onClick={() => document.querySelector('#vapi-widget-floating-button')?.click()}
              className="btn-secondary whitespace-nowrap"
            >
              <i className="ri-chat-smile-line mr-2"></i>
              Get Recommendations
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
