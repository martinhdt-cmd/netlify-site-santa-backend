import { useState } from 'react';
import { redirectToCheckout, STRIPE_PRICES } from '../../../utils/stripe';

interface GreetingProductsProps {
  selectedCategory?: string;
  onPersonalizeClick?: () => void;
}

const GreetingProducts = ({ selectedCategory, onPersonalizeClick }: GreetingProductsProps) => {
  const greetingProduct = {
    id: 'personalised-greeting',
    name: 'Personalised Greeting Video (Any Occasion)',
    price: '€20',
    priceId: STRIPE_PRICES.GREETING_VIDEO,
    description: 'A heartfelt, personalised message delivered with warmth and sincerity for any special occasion - birthdays, anniversaries, congratulations, new baby, thank you, and more.',
    features: [
      'Perfect for any occasion',
      'Personalised with names & details', 
      'Warm fireside delivery',
      'Scheduled or immediate delivery',
      '2-3 minutes of heartfelt messaging',
      'Professional quality production'
    ],
    occasions: ['Birthday', 'Anniversary', 'Congratulations', 'New Baby', 'Thank You', 'Get Well Soon', 'Graduation', 'Retirement', 'Valentine\'s Day', 'Mother\'s Day', 'Father\'s Day'],
    image: 'https://readdy.ai/api/search-image?query=Warm%20greeting%20card%20setup%20by%20cozy%20fireplace%2C%20soft%20golden%20lighting%2C%20comfortable%20celebration%20atmosphere%2C%20festive%20but%20elegant%20setting%2C%20realistic%20interior%20design%2C%20peaceful%20and%20joyful%20ambiance%2C%20any%20occasion%20celebration&width=400&height=300&seq=personalised-greeting&orientation=landscape',
  };

  const handlePersonalizeClick = () => {
    if (onPersonalizeClick) {
      onPersonalizeClick();
    }
  };

  const handleQuickCheckout = async () => {
    await redirectToCheckout({
      priceId: greetingProduct.priceId,
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/greeting-videos`,
      metadata: {
        product_type: 'greeting_video',
        video_count: '1',
      },
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-red-900 mb-6">
            Personalised Greeting Videos
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            One magical video format, perfect for any occasion. Each message is lovingly crafted 
            with your personal details and delivered with heartfelt warmth.
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="card group hover:shadow-xl transition-all duration-300">
            <div className="aspect-[4/3] overflow-hidden">
              <img
                src={greetingProduct.image}
                alt={greetingProduct.name}
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl font-serif font-bold text-red-900">
                  {greetingProduct.name}
                </h3>
                <span className="text-3xl font-bold text-amber-600">
                  {greetingProduct.price}
                </span>
              </div>
              
              <p className="text-gray-600 mb-6 leading-relaxed">
                {greetingProduct.description}
              </p>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">Perfect for these occasions:</h4>
                <div className="flex flex-wrap gap-2">
                  {greetingProduct.occasions.map((occasion, index) => (
                    <span key={index} className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm">
                      {occasion}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-6">
                <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {greetingProduct.features.map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <i className="ri-check-line text-green-600 mr-2 text-xs"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={handlePersonalizeClick}
                  className="btn-primary w-full text-center py-4 text-lg whitespace-nowrap"
                >
                  <i className="ri-edit-line mr-2"></i>
                  Personalise & Order - €20
                </button>
                
                <button
                  onClick={handleQuickCheckout}
                  className="btn-secondary w-full text-center py-4 text-lg whitespace-nowrap"
                >
                  <i className="ri-flashlight-line mr-2"></i>
                  Quick Checkout - €20
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-red-900 to-amber-600 rounded-2xl p-8 text-cream">
          <div className="text-center">
            <h3 className="text-2xl font-serif font-bold mb-4">
              Need Multiple Videos?
            </h3>
            <p className="text-cream/90 mb-6 max-w-2xl mx-auto">
              Save with our Family Video Bundle (5 videos for €90) or Season Pass Membership. 
              Mix and match Santa videos and greeting videos for maximum value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={() => window.REACT_APP_NAVIGATE('/bundles')}
                className="btn-secondary bg-amber-600 hover:bg-amber-700 whitespace-nowrap"
              >
                <i className="ri-gift-line mr-2"></i>
                View Bundles & Season Pass
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

export default GreetingProducts;
