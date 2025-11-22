import { useState } from 'react';
import { supabase } from '../../../utils/supabase';
import { redirectToCheckout, STRIPE_PRICES } from '../../../utils/stripe';

interface GreetingPersonalizationFormProps {
  onSubmit?: () => void;
}

const GreetingPersonalizationForm = ({ onSubmit }: GreetingPersonalizationFormProps) => {
  const [formData, setFormData] = useState({
    // Recipient Information
    recipientName: '',
    recipientAge: '',
    recipientGender: 'boy',
    
    // Sender Information
    senderName: '',
    senderEmail: '',
    
    // Occasion Details
    occasion: 'birthday',
    customOccasion: '',
    
    // Message Details
    messageDetails: '',
    relationshipToRecipient: '',
    
    // Delivery
    deliveryDate: '',
    deliveryEmail: '',
    
    // Additional
    pronunciationNotes: '',
    specialRequests: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const occasions = [
    { value: 'birthday', label: 'Birthday' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'congratulations', label: 'Congratulations' },
    { value: 'new_baby', label: 'New Baby' },
    { value: 'thank_you', label: 'Thank You' },
    { value: 'get_well', label: 'Get Well Soon' },
    { value: 'graduation', label: 'Graduation' },
    { value: 'retirement', label: 'Retirement' },
    { value: 'valentines', label: "Valentine's Day" },
    { value: 'mothers_day', label: "Mother's Day" },
    { value: 'fathers_day', label: "Father's Day" },
    { value: 'other', label: 'Other' },
  ];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      // Save order to Supabase
      const orderData = {
        product_type: 'greeting_video',
        recipient_name: formData.recipientName,
        recipient_age: formData.recipientAge ? parseInt(formData.recipientAge) : null,
        recipient_gender: formData.recipientGender,
        sender_name: formData.senderName,
        sender_email: formData.senderEmail,
        occasion: formData.occasion === 'other' ? formData.customOccasion : formData.occasion,
        message_details: formData.messageDetails,
        relationship_to_recipient: formData.relationshipToRecipient,
        delivery_date: formData.deliveryDate || null,
        delivery_email: formData.deliveryEmail || formData.senderEmail,
        pronunciation_notes: formData.pronunciationNotes,
        special_requests: formData.specialRequests,
        video_status: 'pending',
        order_amount: 20.00,
        currency: 'EUR',
        created_at: new Date().toISOString(),
      };

      const { data, error } = await supabase
        .from('santa_video_orders')
        .insert([orderData])
        .select();

      if (error) throw error;

      // Redirect to Stripe checkout
      await redirectToCheckout({
        priceId: STRIPE_PRICES.GREETING_VIDEO,
        successUrl: `${window.location.origin}/success`,
        cancelUrl: `${window.location.origin}/greeting-videos`,
        customerEmail: formData.senderEmail,
        metadata: {
          product_type: 'greeting_video',
          order_id: data[0].id,
          occasion: formData.occasion === 'other' ? formData.customOccasion : formData.occasion,
        },
      });

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-16 bg-gradient-to-b from-purple-50 to-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={onSubmit}
            className="inline-flex items-center text-purple-900 hover:text-purple-700 mb-6 transition-colors"
          >
            <i className="ri-arrow-left-line mr-2"></i>
            Back to Products
          </button>
          <h2 className="text-4xl font-serif font-bold text-purple-900 mb-4">
            Personalize Your Greeting Video
          </h2>
          <p className="text-lg text-gray-600">
            Fill in the details below to create a heartfelt personalized message
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-xl p-8 border border-purple-100">
          {/* Recipient Details */}
          <div className="mb-8">
            <h3 className="text-2xl font-semibold text-purple-900 mb-6">Recipient Details</h3>
            
            <div className="grid md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Recipient Name <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.recipientName}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipientName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="Enter recipient's name"
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
                  max="120"
                  value={formData.recipientAge}
                  onChange={(e) => setFormData(prev => ({ ...prev, recipientAge: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="Age"
                  required
                />
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Gender <span className="text-red-600">*</span>
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, recipientGender: 'boy' }))}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium whitespace-nowrap ${
                      formData.recipientGender === 'boy'
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300'
                    }`}
                  >
                    Boy
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData(prev => ({ ...prev, recipientGender: 'girl' }))}
                    className={`flex-1 px-4 py-3 rounded-lg border-2 transition-all text-sm font-medium whitespace-nowrap ${
                      formData.recipientGender === 'girl'
                        ? 'border-purple-600 bg-purple-50 text-purple-900'
                        : 'border-gray-300 bg-white text-gray-700 hover:border-purple-300'
                    }`}
                  >
                    Girl
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Relationship to You <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  value={formData.relationshipToRecipient}
                  onChange={(e) => setFormData(prev => ({ ...prev, relationshipToRecipient: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  placeholder="e.g., Daughter, Son, Friend"
                  required
                />
              </div>
            </div>
          </div>

          {/* Occasion */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Occasion <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.occasion === 'other' ? formData.customOccasion : formData.occasion}
              onChange={(e) => {
                if (formData.occasion === 'other') {
                  setFormData(prev => ({ ...prev, customOccasion: e.target.value }));
                } else {
                  setFormData(prev => ({ ...prev, occasion: e.target.value }));
                }
              }}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              placeholder="e.g., Birthday, Anniversary, Graduation"
              required
            />
          </div>

          {/* Special Message */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Special Message or Context
            </label>
            <textarea
              value={formData.specialRequests}
              onChange={(e) => {
                if (e.target.value.length <= 300) {
                  setFormData(prev => ({ ...prev, specialRequests: e.target.value }));
                }
              }}
              rows={4}
              maxLength={300}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm resize-none"
              placeholder="Any special details, achievements, or personal touches you'd like included? (Max 300 characters)"
            />
            <div className="text-right text-xs text-gray-500 mt-1">
              {formData.specialRequests.length}/300 characters
            </div>
          </div>

          {/* Email */}
          <div className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Your Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              value={formData.senderEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, senderEmail: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
              placeholder="your@email.com"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              We'll send your personalized video to this email
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-purple-900 text-white py-4 rounded-lg font-semibold text-lg hover:bg-purple-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
          >
            {isSubmitting ? (
              <>
                <i className="ri-loader-4-line animate-spin mr-2"></i>
                Processing...
              </>
            ) : (
              <>
                <i className="ri-shopping-cart-line mr-2"></i>
                Proceed to Checkout - €20.00
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

export default GreetingPersonalizationForm;