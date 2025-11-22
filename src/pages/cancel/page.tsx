
import React from 'react';
import { Link } from 'react-router-dom';

const CancelPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-amber-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Cancel Icon */}
        <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-8">
          <i className="ri-close-line text-4xl text-red-600"></i>
        </div>

        {/* Cancel Message */}
        <h1 className="text-4xl md:text-5xl font-serif text-red-900 mb-6">
          Order Cancelled
        </h1>
        
        <p className="text-xl text-red-700 mb-8 leading-relaxed">
          No worries! Your order has been cancelled and no payment has been processed. 
          We're here whenever you're ready to create a special video message.
        </p>

        {/* Reassurance Card */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h2 className="text-2xl font-serif text-red-900 mb-6">What You Can Do Next</h2>
          
          <div className="space-y-6 text-left">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-arrow-left-line text-xl text-red-700"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Try Again</h3>
                <p className="text-red-700">Go back and complete your order when you're ready. All your personalization details are saved.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-question-line text-xl text-amber-700"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Need Help?</h3>
                <p className="text-red-700">If you experienced any issues during checkout, our support team is here to help.</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                <i className="ri-heart-line text-xl text-red-700"></i>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Browse More</h3>
                <p className="text-red-700">Explore our other video options - maybe a different product would be perfect for your occasion.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center mb-8">
          <Link 
            to="/santa-messages" 
            className="inline-block bg-red-700 text-white px-8 py-3 rounded-lg hover:bg-red-800 transition-colors font-semibold"
          >
            Browse Santa Videos
          </Link>
          <Link 
            to="/greeting-videos" 
            className="inline-block bg-amber-600 text-white px-8 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
          >
            Browse Greeting Videos
          </Link>
        </div>

        {/* Common Questions */}
        <div className="bg-amber-50 rounded-lg p-6 mb-8 text-left">
          <h3 className="text-lg font-serif text-red-900 mb-4 text-center">Common Questions</h3>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Was I charged?</h4>
              <p className="text-red-700 text-sm">No, your payment was not processed. You will not see any charges on your account.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Are my details saved?</h4>
              <p className="text-red-700 text-sm">Your personalization details may be temporarily saved in your browser, but no personal information is stored on our servers.</p>
            </div>
            
            <div>
              <h4 className="font-semibold text-red-900 mb-1">Can I get help with my order?</h4>
              <p className="text-red-700 text-sm">Absolutely! Our KeepInMind Concierge is available via the chat button, or you can contact us directly.</p>
            </div>
          </div>
        </div>

        {/* Navigation Options */}
        <div className="grid sm:grid-cols-2 gap-4 mb-8">
          <Link 
            to="/" 
            className="bg-white border-2 border-red-200 text-red-700 px-6 py-3 rounded-lg hover:bg-red-50 transition-colors font-semibold text-center"
          >
            <i className="ri-home-line mr-2"></i>
            Return Home
          </Link>
          <Link 
            to="/contact" 
            className="bg-white border-2 border-amber-200 text-amber-700 px-6 py-3 rounded-lg hover:bg-amber-50 transition-colors font-semibold text-center"
          >
            <i className="ri-customer-service-line mr-2"></i>
            Contact Support
          </Link>
        </div>

        {/* Encouragement Message */}
        <div className="text-center">
          <p className="text-red-600 italic mb-2">
            "Never forget a special day"
          </p>
          <p className="text-sm text-red-700">
            We're here to help you create magical moments whenever you're ready.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CancelPage;
