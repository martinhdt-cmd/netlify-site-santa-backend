import { useState } from 'react';
import { redirectToCheckout, STRIPE_PRICES, createPaymentIntent } from '../../../utils/stripe';
import PaymentRequestButton from '../../../components/payment/PaymentRequestButton';

interface Product {
  id: string;
  name: string;
  price: string;
  priceId: string;
  originalPrice?: string;
  description: string;
  features: string[];
  duration: string;
  delivery: string;
  image: string;
  popular?: boolean;
  badge?: string;
  isTwoPart?: boolean;
}

interface ProductGridProps {
  onSelectProduct: (productId: string) => void;
}

const ProductGrid = ({ onSelectProduct }: ProductGridProps) => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  const products: Product[] = [
    {
      id: 'santa-standard',
      name: 'Santa Standard Video',
      price: '€27',
      priceId: STRIPE_PRICES.SANTA_STANDARD,
      description: 'A warm, personalised fireside message from Santa with your loved one\'s name and special details that make them smile.',
      features: ['Personal name mention', 'Age-appropriate content', 'Town/city reference', 'Custom details included'],
      duration: '2-3 minutes',
      delivery: '24-48 hours',
      image: 'https://readdy.ai/api/search-image?query=Santa%20Claus%20sitting%20by%20warm%20fireplace%20reading%20letter%2C%20gentle%20smile%2C%20cozy%20living%20room%2C%20soft%20golden%20lighting%2C%20Christmas%20decorations%2C%20peaceful%20atmosphere%2C%20realistic%20Santa%2C%20comfortable%20armchair&width=400&height=300&seq=santa-standard-product&orientation=landscape',
    },
    {
      id: 'santa-two-part',
      name: 'Santa Wish List & Christmas Eve Check-In',
      price: '€41',
      priceId: STRIPE_PRICES.SANTA_DELUXE,
      description: 'Two magical personalised videos from Santa: an early wish list acknowledgement and a special Christmas Eve follow-up message filled with warmth and wonder.',
      features: [
        'Video 1: Wish list acknowledgement',
        'Video 2: Christmas Eve follow-up',
        'Scheduled delivery for part 2',
        'Extended personalisation',
        'Family memories included',
        'Special wishes & dreams'
      ],
      duration: '2 videos (2-3 min each)',
      delivery: 'Part 1: 24-48 hrs | Part 2: Scheduled',
      image: 'https://readdy.ai/api/search-image?query=Santa%20Claus%20with%20magical%20storybook%20by%20fireplace%2C%20warm%20golden%20glow%2C%20Christmas%20tree%20background%2C%20cozy%20room%20setting%2C%20storytelling%20moment%2C%20realistic%20Santa%2C%20peaceful%20evening%20atmosphere%2C%20premium%20magical%20scene&width=400&height=300&seq=santa-deluxe-product&orientation=landscape',
      popular: true,
      isTwoPart: true,
    },
  ];

  const handlePersonaliseOrder = (product: Product) => {
    // Trigger the personalization form
    onSelectProduct(product.id);
  };

  const handleQuickCheckout = async (product: Product) => {
    setSelectedProduct(product);
    setShowPaymentModal(true);
  };

  const handlePaymentSuccess = async (paymentMethod: any) => {
    if (!selectedProduct) return;

    try {
      // Create payment intent and confirm
      const amount = parseInt(selectedProduct.price.replace('€', '')) * 100;
      const { clientSecret } = await createPaymentIntent({
        amount,
        currency: 'eur',
        priceId: selectedProduct.priceId,
        metadata: {
          product_type: selectedProduct.isTwoPart ? 'two_part_santa_video' : 'santa_standard_video',
          video_count: selectedProduct.isTwoPart ? '2' : '1',
        },
      });

      const stripe = (window as any).Stripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
      const { error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: paymentMethod.id,
      });

      if (error) {
        throw error;
      }

      // Redirect to success page
      window.location.href = `${window.location.origin}/success`;
    } catch (error) {
      console.error('Payment failed:', error);
      alert('Payment failed. Please try again.');
    } finally {
      setShowPaymentModal(false);
      setSelectedProduct(null);
    }
  };

  const handleStandardCheckout = async () => {
    if (!selectedProduct) return;
    
    setShowPaymentModal(false);
    
    // Determine product type for database
    const productType = selectedProduct.isTwoPart ? 'two_part_santa_video' : 'santa_standard_video';
    
    await redirectToCheckout({
      priceId: selectedProduct.priceId,
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/santa-messages`,
      productType: productType,
      orderData: {
        child_name: 'Quick Order Customer',
        child_age: '5',
        parent_name: 'Quick Order Parent',
        town_city: 'Quick Order Location',
        video_details: 'Standard quick checkout order - customer will provide details later',
        special_requests: 'Quick checkout - minimal personalization',
      },
      metadata: {
        product_type: productType,
        video_count: selectedProduct.isTwoPart ? '2' : '1',
        checkout_type: 'quick_checkout',
      },
    });
  };

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-red-900 mb-6">
            Choose Your Santa Video
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Each video is lovingly crafted with your special details, delivered with the warmth 
            and wonder of Santa's magical fireside presence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {products.map((product) => (
            <div key={product.id} className="card relative group hover:shadow-xl transition-all duration-300">
              {product.popular && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                  <span className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                </div>
              )}
              
              {product.isTwoPart && (
                <div className="absolute top-4 right-4 z-10">
                  <span className="bg-red-900 text-white px-3 py-1 rounded-full text-xs font-medium">
                    2 Videos
                  </span>
                </div>
              )}
              
              <div className="aspect-[4/3] overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-serif font-bold text-red-900">
                    {product.name}
                  </h3>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-amber-600">
                      {product.price}
                    </span>
                  </div>
                </div>
                
                <p className="text-gray-600 mb-4 leading-relaxed text-sm">
                  {product.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Duration:</span>
                    <span className="font-medium text-gray-900">{product.duration}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Delivery:</span>
                    <span className="font-medium text-gray-900">{product.delivery}</span>
                  </div>
                </div>
                
                <ul className="space-y-1 mb-6">
                  {product.features.slice(0, 4).map((feature, index) => (
                    <li key={index} className="flex items-center text-sm text-gray-700">
                      <i className="ri-check-line text-green-600 mr-2 text-xs"></i>
                      <span>{feature}</span>
                    </li>
                  ))}
                  {product.features.length > 4 && (
                    <li className="text-xs text-gray-500">
                      +{product.features.length - 4} more features
                    </li>
                  )}
                </ul>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handlePersonaliseOrder(product)}
                    className="btn-primary w-full text-center text-sm py-3 whitespace-nowrap"
                  >
                    <i className="ri-edit-line mr-2"></i>
                    Personalise & Order - {product.price}
                  </button>
                  
                  <button
                    onClick={() => handleQuickCheckout(product)}
                    className="btn-secondary w-full text-center text-sm py-3 whitespace-nowrap"
                  >
                    <i className="ri-flashlight-line mr-2"></i>
                    Quick Checkout - {product.price}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Process Information */}
        <div className="mt-16 bg-gradient-to-r from-amber-50 to-red-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-red-900 mb-4">
              How Your Video Order Works
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We want you to be completely happy with your video. Here's our simple process:
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">1</span>
              </div>
              <h4 className="font-semibold text-red-900 mb-2">Order & Personalise</h4>
              <p className="text-sm text-gray-600">Share details that make your video special</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-amber-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">2</span>
              </div>
              <h4 className="font-semibold text-red-900 mb-2">Preview Delivery</h4>
              <p className="text-sm text-gray-600">Receive watermarked preview within 24-48 hours</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-red-900 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">3</span>
              </div>
              <h4 className="font-semibold text-red-900 mb-2">Approve or Revise</h4>
              <p className="text-sm text-gray-600">One free revision if needed</p>
            </div>

            <div className="text-center">
              <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-white font-bold">4</span>
              </div>
              <h4 className="font-semibold text-red-900 mb-2">Final Video</h4>
              <p className="text-sm text-gray-600">High-quality final video delivered</p>
            </div>
          </div>
        </div>

        {/* Feature Comparison Card */}
        <div className="mt-16 bg-gradient-to-r from-red-50 to-amber-50 rounded-2xl p-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-red-900 mb-4">
              Standard vs Two-Part Package Comparison
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Both options feature Santa's warm fireside presence, but the Two-Part Package offers an extended magical journey with two separate personalised videos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-xl p-6 border-2 border-gray-200">
              <h4 className="font-serif font-bold text-red-900 text-lg mb-3">Santa Standard Video</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Single 2-3 minute personalised message</li>
                <li className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Name and basic details included</li>
                <li className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Town/city reference</li>
                <li className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Age-appropriate content</li>
              </ul>
            </div>

            <div className="bg-white rounded-xl p-6 border-2 border-amber-400">
              <h4 className="font-serif font-bold text-red-900 text-lg mb-3">Santa Two-Part Package</h4>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Two separate personalised videos</li>
                <li className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Part 1: Early wish list acknowledgement</li>
                <li className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Part 2: Christmas Eve follow-up message</li>
                <li className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Scheduled delivery for part 2</li>
                <li className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Extended personalisation & storytelling</li>
                <li className="flex items-center"><i className="ri-check-line text-green-600 mr-2"></i>Family memories & special moments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-serif font-bold text-red-900 mb-2">
                  {selectedProduct.name}
                </h3>
                <p className="text-3xl font-bold text-amber-600">{selectedProduct.price}</p>
              </div>
              <button
                onClick={() => {
                  setShowPaymentModal(false);
                  setSelectedProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600 w-8 h-8 flex items-center justify-center"
              >
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <div className="mb-6 p-4 bg-amber-50 rounded-lg">
              <p className="text-sm text-amber-800">
                <i className="ri-information-line mr-2"></i>
                <strong>Note:</strong> Quick checkout uses default personalisation. For custom details, use "Personalise & Order" instead.
              </p>
            </div>

            <div className="space-y-4">
              <PaymentRequestButton
                amount={parseInt(selectedProduct.price.replace('€', '')) * 100}
                currency="eur"
                label={selectedProduct.name}
                onSuccess={handlePaymentSuccess}
                onError={(error) => {
                  console.error('Payment error:', error);
                  alert('Payment failed. Please try again.');
                }}
              />

              <button
                onClick={handleStandardCheckout}
                className="btn-primary w-full text-center py-3 whitespace-nowrap"
              >
                Continue to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default ProductGrid;
