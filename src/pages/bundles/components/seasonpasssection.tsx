import { useState } from 'react';
import { redirectToCheckout, STRIPE_PRICES } from '../../../utils/stripe';

const SeasonPassSection = () => {
  const [selectedPlan, setSelectedPlan] = useState<'monthly' | 'yearly'>('yearly');

  const plans = {
    monthly: {
      id: 'season-pass-monthly',
      name: 'Monthly Membership',
      price: '€10',
      priceId: STRIPE_PRICES.MONTHLY_MEMBERSHIP,
      period: '/month',
      description: 'Perfect for trying out our membership benefits',
      yearlyEquivalent: '€120/year',
      savings: null,
    },
    yearly: {
      id: 'season-pass-yearly',
      name: 'Yearly Membership',
      price: '€104',
      priceId: STRIPE_PRICES.YEARLY_MEMBERSHIP,
      period: '/year',
      description: 'Best value with 2 months free',
      monthlyEquivalent: '€8.67/month',
      savings: 'Save €16',
      popular: true,
    }
  };

  const benefits = [
    {
      icon: 'ri-gift-line',
      title: '6 Free Videos Per Year',
      description: 'Mix any Santa videos and greeting videos - your choice!'
    },
    {
      icon: 'ri-discount-percent-line',
      title: '20% Off Additional Videos',
      description: 'Need more than 6? Get 20% off all extra video purchases'
    },
    {
      icon: 'ri-notification-line',
      title: 'Never-Forget Reminder Service',
      description: 'We\'ll remind you of birthdays, anniversaries, and special occasions'
    },
    {
      icon: 'ri-flashlight-line',
      title: 'Priority Video Generation',
      description: 'Your videos are created first, with faster delivery times'
    },
    {
      icon: 'ri-calendar-schedule-line',
      title: 'Scheduled Delivery Options',
      description: 'Set videos to deliver automatically on special dates'
    },
    {
      icon: 'ri-customer-service-line',
      title: 'Premium Support',
      description: 'Direct access to our concierge team for personalized assistance'
    }
  ];

  const handleCheckout = async () => {
    const plan = plans[selectedPlan];
    await redirectToCheckout({
      priceId: plan.priceId,
      successUrl: `${window.location.origin}/success`,
      cancelUrl: `${window.location.origin}/bundles`,
    });
  };

  return (
    <section id="season-pass-section" className="py-20 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-red-900 mb-6">
            Season Pass Membership
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            The ultimate way to stay connected with loved ones year-round. 
            Get free videos, exclusive benefits, and never miss a special moment.
          </p>
        </div>

        {/* Plan Selection */}
        <div className="max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {Object.entries(plans).map(([key, plan]) => (
                <div 
                  key={key}
                  className={`p-8 relative cursor-pointer transition-all duration-300 ${
                    selectedPlan === key 
                      ? 'bg-gradient-to-br from-red-900 to-amber-600 text-cream' 
                      : 'bg-white hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedPlan(key as 'monthly' | 'yearly')}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="text-center">
                    <h3 className={`text-2xl font-serif font-bold mb-2 ${
                      selectedPlan === key ? 'text-cream' : 'text-red-900'
                    }`}>
                      {plan.name}
                    </h3>
                    
                    <div className="mb-4">
                      <span className={`text-4xl font-bold ${
                        selectedPlan === key ? 'text-cream' : 'text-amber-600'
                      }`}>
                        {plan.price}
                      </span>
                      <span className={`text-lg ${
                        selectedPlan === key ? 'text-cream/80' : 'text-gray-600'
                      }`}>
                        {plan.period}
                      </span>
                    </div>
                    
                    <p className={`text-sm mb-4 ${
                      selectedPlan === key ? 'text-cream/90' : 'text-gray-600'
                    }`}>
                      {plan.description}
                    </p>
                    
                    {key === 'yearly' && (
                      <div className={`text-sm ${
                        selectedPlan === key ? 'text-cream/80' : 'text-gray-500'
                      }`}>
                        <div>{plan.monthlyEquivalent}</div>
                        <div className="font-semibold text-green-400">{plan.savings}</div>
                      </div>
                    )}
                    
                    {key === 'monthly' && (
                      <div className={`text-sm ${
                        selectedPlan === key ? 'text-cream/80' : 'text-gray-500'
                      }`}>
                        {plan.yearlyEquivalent}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Benefits Grid */}
        <div className="mb-16">
          <h3 className="text-3xl font-serif font-bold text-red-900 text-center mb-12">
            Membership Benefits
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="w-12 h-12 bg-gradient-to-br from-red-900 to-amber-600 rounded-lg flex items-center justify-center mb-4">
                  <i className={`${benefit.icon} text-xl text-cream`}></i>
                </div>
                <h4 className="text-lg font-serif font-bold text-red-900 mb-2">
                  {benefit.title}
                </h4>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Value Comparison */}
        <div className="bg-gradient-to-r from-amber-50 to-red-50 rounded-2xl p-8 mb-16">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-serif font-bold text-red-900 mb-4">
              Incredible Value
            </h3>
            <p className="text-gray-600 max-w-2xl mx-auto">
              See how much you save with Season Pass membership compared to individual purchases.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-red-900 mb-2">Individual Videos</h4>
              <div className="text-2xl font-bold text-gray-600 mb-2">€20-€41</div>
              <p className="text-sm text-gray-500">Per video</p>
            </div>
            
            <div className="bg-white rounded-xl p-6 border-2 border-amber-400">
              <h4 className="font-bold text-red-900 mb-2">With Membership</h4>
              <div className="text-2xl font-bold text-amber-600 mb-2">FREE</div>
              <p className="text-sm text-gray-500">6 videos included + 20% off extras</p>
            </div>
            
            <div className="bg-white rounded-xl p-6">
              <h4 className="font-bold text-red-900 mb-2">Annual Savings</h4>
              <div className="text-2xl font-bold text-green-600 mb-2">€120+</div>
              <p className="text-sm text-gray-500">Based on 6 videos per year</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center">
          <button 
            onClick={handleCheckout}
            className="btn-primary text-lg px-12 py-4 mb-4 whitespace-nowrap"
          >
            Start Your {plans[selectedPlan].name} - {plans[selectedPlan].price}
          </button>
          <p className="text-sm text-gray-500">
            Cancel anytime • No long-term commitment • Instant activation
          </p>
        </div>
      </div>
    </section>
  );
};

export default SeasonPassSection;
