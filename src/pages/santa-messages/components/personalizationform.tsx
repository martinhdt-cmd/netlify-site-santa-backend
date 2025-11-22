
import { useState } from 'react';
import { redirectToCheckout, STRIPE_PRICES } from '../../../utils/stripe';

interface Child {
  id: string;
  name: string;
  age: string;
  gender: 'boy' | 'girl' | '';
  achievements: string;
  wishes: string;
  specialDetails: string;
}

interface PersonalizationFormProps {
  productType: 'standard' | 'two-part';
  onSubmit: () => void;
}

const PersonalizationForm = ({ productType, onSubmit }: PersonalizationFormProps) => {
  const [loading, setLoading] = useState(false);
  const [children, setChildren] = useState<Child[]>([
    { id: '1', name: '', age: '', gender: '', achievements: '', wishes: '', specialDetails: '' }
  ]);
  const [townCity, setTownCity] = useState('');
  const [parentName, setParentName] = useState('');
  const [email, setEmail] = useState('');

  const basePrice = productType === 'two-part' ? 41 : 27;
  const additionalChildPrice = 2.75;
  const additionalChildren = Math.max(0, children.length - 1);
  const totalPrice = basePrice + (additionalChildren * additionalChildPrice);

  const handleAddChild = () => {
    if (children.length < 15) {
      setChildren([...children, { 
        id: Date.now().toString(), 
        name: '', 
        age: '', 
        gender: '',
        achievements: '',
        wishes: '',
        specialDetails: ''
      }]);
    }
  };

  const handleRemoveChild = (id: string) => {
    if (children.length > 1) {
      setChildren(children.filter(child => child.id !== id));
    }
  };

  const handleChildChange = (id: string, field: keyof Child, value: string) => {
    setChildren(children.map(child => 
      child.id === id ? { ...child, [field]: value } : child
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!email || !townCity || !parentName) {
      alert('Please fill in all required fields');
      return;
    }

    // Validate all children have required fields
    for (const child of children) {
      if (!child.name || !child.age || !child.gender) {
        alert('Please complete all child details (name, age, and gender)');
        return;
      }
    }

    setLoading(true);

    try {
      const priceId = productType === 'two-part' 
        ? STRIPE_PRICES.SANTA_DELUXE 
        : STRIPE_PRICES.SANTA_STANDARD;

      await redirectToCheckout({
        priceId,
        quantity: 1,
        customerEmail: email,
        metadata: {
          product_type: productType === 'two-part' ? 'santa_two_part' : 'santa_standard',
          number_of_children: children.length.toString(),
          additional_children: additionalChildren.toString(),
          additional_cost: (additionalChildren * additionalChildPrice * 100).toString(), // in cents
        },
        orderData: {
          children: children.map(child => ({
            name: child.name,
            age: parseInt(child.age),
            gender: child.gender,
            achievements: child.achievements,
            wishes: child.wishes,
            special_details: child.specialDetails,
          })),
          town_city: townCity,
          parent_name: parentName,
          email: email,
          product_type: productType === 'two-part' ? 'santa_two_part' : 'santa_standard',
        },
      });

      onSubmit();
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Failed to process checkout. Please try again.');
      setLoading(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-red-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={onSubmit}
            className="inline-flex items-center text-red-900 hover:text-red-700 mb-6 transition-colors"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Products
          </button>
          <h2 className="text-4xl font-serif font-bold text-red-900 mb-4">
            Personalize Your {productType === 'two-part' ? 'Two-Part' : 'Standard'} Santa Video
          </h2>
          <p className="text-lg text-gray-600">
            Fill in the details below to create a magical personalized message from Santa
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-red-100">
          {/* Parent Details */}
          <div className="mb-8 p-6 bg-green-50/50 rounded-xl border border-green-100">
            <h3 className="text-2xl font-semibold text-red-900 mb-6">
              Parent/Guardian Details
            </h3>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Your Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={parentName}
                  onChange={(e) => setParentName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  placeholder="Parent/Guardian name"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Town/City <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={townCity}
                  onChange={(e) => setTownCity(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                  placeholder="e.g., Dublin, Cork, Galway"
                  required
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                placeholder="your@email.com"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                We'll send your personalized video to this email
              </p>
            </div>
          </div>

          {/* Children Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-semibold text-red-900">
                Children Details
              </h3>
              <div className="text-right">
                <div className="text-sm text-gray-600">Total Price</div>
                <div className="text-3xl font-bold text-red-900">€{totalPrice.toFixed(2)}</div>
                {additionalChildren > 0 && (
                  <div className="text-xs text-gray-500">
                    Base: €{basePrice} + {additionalChildren} child{additionalChildren > 1 ? 'ren' : ''} (€{(additionalChildren * additionalChildPrice).toFixed(2)})
                  </div>
                )}
              </div>
            </div>

            {children.map((child, index) => (
              <div key={child.id} className="mb-6 p-6 bg-red-50/50 rounded-xl border border-red-100">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold text-red-900">
                    Child {index + 1}
                    {index > 0 && <span className="ml-2 text-sm text-gray-600">(+€{additionalChildPrice.toFixed(2)})</span>}
                  </h4>
                  {children.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveChild(child.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <i className="ri-close-circle-line text-xl"></i>
                    </button>
                  )}
                </div>

                {/* Basic Info */}
                <div className="grid md:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Name <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      value={child.name}
                      onChange={(e) => handleChildChange(child.id, 'name', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      placeholder="Enter name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Age <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="18"
                      value={child.age}
                      onChange={(e) => handleChildChange(child.id, 'age', e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm"
                      placeholder="Age"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Gender <span className="text-red-600">*</span>
                    </label>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => handleChildChange(child.id, 'gender', 'boy')}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium whitespace-nowrap ${
                          child.gender === 'boy'
                            ? 'border-red-600 bg-red-50 text-red-900'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                        }`}
                      >
                        Boy
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChildChange(child.id, 'gender', 'girl')}
                        className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium whitespace-nowrap ${
                          child.gender === 'girl'
                            ? 'border-red-600 bg-red-50 text-red-900'
                            : 'border-gray-300 bg-white text-gray-700 hover:border-red-300'
                        }`}
                      >
                        Girl
                      </button>
                    </div>
                  </div>
                </div>

                {/* Achievements */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Achievements & Good Behavior
                  </label>
                  <textarea
                    value={child.achievements}
                    onChange={(e) => {
                      if (e.target.value.length <= 300) {
                        handleChildChange(child.id, 'achievements', e.target.value);
                      }
                    }}
                    rows={2}
                    maxLength={300}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm resize-none"
                    placeholder={`What has ${child.name || 'this child'} done well this year? (e.g., helped with chores, did well in school, was kind to siblings)`}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {child.achievements.length}/300 characters
                  </div>
                </div>

                {/* Wishes */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Christmas Wishes
                  </label>
                  <textarea
                    value={child.wishes}
                    onChange={(e) => {
                      if (e.target.value.length <= 300) {
                        handleChildChange(child.id, 'wishes', e.target.value);
                      }
                    }}
                    rows={2}
                    maxLength={300}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm resize-none"
                    placeholder={`What does ${child.name || 'this child'} want for Christmas? (e.g., toys, games, books)`}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {child.wishes.length}/300 characters
                  </div>
                </div>

                {/* Special Details */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Details & Hobbies
                  </label>
                  <textarea
                    value={child.specialDetails}
                    onChange={(e) => {
                      if (e.target.value.length <= 300) {
                        handleChildChange(child.id, 'specialDetails', e.target.value);
                      }
                    }}
                    rows={2}
                    maxLength={300}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent text-sm resize-none"
                    placeholder={`Any hobbies, interests, or special details about ${child.name || 'this child'}? (e.g., loves football, plays piano, favorite color is blue)`}
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {child.specialDetails.length}/300 characters
                  </div>
                </div>
              </div>
            ))}

            {children.length < 15 && (
              <button
                type="button"
                onClick={handleAddChild}
                className="w-full py-3 border-2 border-dashed border-red-300 rounded-lg text-red-900 hover:border-red-500 hover:bg-red-50 transition-all font-medium whitespace-nowrap"
              >
                <i className="ri-add-line mr-2"></i>
                Add Another Child (+€{additionalChildPrice.toFixed(2)})
              </button>
            )}

            {children.length >= 15 && (
              <p className="text-center text-sm text-gray-500 italic">
                Maximum of 15 children reached
              </p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-900 text-white py-4 rounded-lg font-semibold text-lg hover:bg-red-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {loading ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Processing...
              </>
            ) : (
              <>
                <i className="ri-shopping-cart-line mr-2"></i>
                Proceed to Checkout - €{totalPrice.toFixed(2)}
              </>
            )}
          </button>

          <p className="text-center text-xs text-gray-500 mt-4">
            Secure checkout powered by Stripe
          </p>
        </form>
      </div>
    </section>
  );
};

export default PersonalizationForm;
