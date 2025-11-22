import React from 'react';
import { Link } from 'react-router-dom';

const SuccessPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-amber-50 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Success Icon with Christmas Magic */}
        <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-green-500 rounded-full flex items-center justify-center mx-auto mb-8 relative">
          <i className="ri-check-line text-5xl text-white"></i>
          <div className="absolute -top-2 -right-2 text-2xl animate-bounce">🎅</div>
          <div className="absolute -bottom-1 -left-2 text-xl animate-pulse">✨</div>
        </div>

        {/* Success Message */}
        <h1 className="text-4xl md:text-5xl font-serif text-red-900 mb-6">
          🎄 Order Complete! 🎄
        </h1>
        
        <p className="text-xl text-red-700 mb-8 leading-relaxed">
          <strong>Ho ho ho!</strong> Thank you for your order! Santa's elves are already working on your magical personalized video.
        </p>

        {/* Magical Timeline Card */}
        <div className="bg-white rounded-xl shadow-xl p-8 mb-8 text-left border-t-4 border-red-500">
          <h2 className="text-2xl font-serif text-red-900 mb-6 text-center flex items-center justify-center">
            <span className="mr-3">🎬</span>
            Your Video Journey Begins!
            <span className="ml-3">✨</span>
          </h2>
          
          <div className="space-y-8">
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border-2 border-red-200">
                <span className="text-red-700 font-bold">📧</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Instant Confirmation</h3>
                <p className="text-red-700">You'll receive an order confirmation email within 5 minutes with all your magical details!</p>
                <p className="text-sm text-red-600 mt-1"><i className="ri-time-line mr-1"></i>Expected: Within 5 minutes</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border-2 border-amber-200">
                <span className="text-amber-700 font-bold">🎅</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Santa's Workshop Magic</h3>
                <p className="text-red-700">Our Christmas elves will carefully craft your personalized video using all the special details you provided.</p>
                <p className="text-sm text-red-600 mt-1"><i className="ri-time-line mr-1"></i>Expected: 24-48 hours</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border-2 border-green-200">
                <span className="text-green-700 font-bold">👀</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Preview & Approval</h3>
                <p className="text-red-700">You'll receive a preview to review and approve. Love it? Great! Want changes? One free revision included!</p>
                <p className="text-sm text-red-600 mt-1"><i className="ri-gift-line mr-1"></i>Free revision included</p>
              </div>
            </div>

            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-1 border-2 border-blue-200">
                <span className="text-blue-700 font-bold">🎁</span>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-red-900 mb-2">Final Delivery</h3>
                <p className="text-red-700">Your high-quality, watermark-free video will be delivered exactly when scheduled - never miss the magic!</p>
                <p className="text-sm text-red-600 mt-1"><i className="ri-shield-check-line mr-1"></i>24-hour delivery guarantee</p>
              </div>
            </div>
          </div>
        </div>

        {/* Important Reminders */}
        <div className="bg-gradient-to-r from-red-50 to-green-50 rounded-xl p-6 mb-8 border border-red-200">
          <h3 className="text-lg font-serif text-red-900 mb-3 flex items-center justify-center">
            <i className="ri-information-line mr-2"></i>
            Important Reminders
          </h3>
          <div className="space-y-2 text-sm">
            <p className="text-red-700">
              <strong>✅ Delivery Guarantee:</strong> Your video will arrive within 24 hours of the scheduled time, or you get a full refund
            </p>
            <p className="text-red-700">
              <strong>🔄 Free Revision:</strong> Don't love the preview? Request changes at no extra cost
            </p>
            <p className="text-red-700">
              <strong>📧 Check Your Email:</strong> All updates and your final video will be sent to your email address
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-4 sm:space-y-0 sm:space-x-4 sm:flex sm:justify-center mb-8">
          <Link 
            to="/" 
            className="inline-block bg-red-700 text-white px-8 py-4 rounded-xl hover:bg-red-800 transition-colors font-semibold text-lg shadow-lg whitespace-nowrap"
          >
            <i className="ri-home-line mr-2"></i>
            Return Home
          </Link>
          <Link 
            to="/santa-messages" 
            className="inline-block bg-green-600 text-white px-8 py-4 rounded-xl hover:bg-green-700 transition-colors font-semibold text-lg shadow-lg whitespace-nowrap"
          >
            <i className="ri-add-line mr-2"></i>
            Order Another Video
          </Link>
        </div>

        {/* Support Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
          <h3 className="text-lg font-serif text-red-900 mb-4 flex items-center justify-center">
            <i className="ri-customer-service-line mr-2"></i>
            Need Help? We're Here!
          </h3>
          <p className="text-red-700 mb-4">
            Questions about your order? Need to make changes? Our North Pole support team is standing by!
          </p>
          <Link 
            to="/contact" 
            className="inline-block bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition-colors font-semibold"
          >
            <i className="ri-mail-line mr-2"></i>
            Contact Our Elves
          </Link>
        </div>

        {/* Christmas Magic Message */}
        <div className="text-center bg-gradient-to-r from-red-100 to-green-100 rounded-xl p-6 border-2 border-dashed border-red-300">
          <h4 className="text-red-800 font-serif text-lg mb-2">🎅 A Message from Santa 🎅</h4>
          <p className="text-red-700 italic text-sm leading-relaxed">
            "Ho ho ho! Thank you for choosing Keep In Mind Greetings to spread Christmas magic. 
            Your child's face will light up with joy when they see their personalized message! 
            Remember, Christmas magic is real when you believe! 🎄✨"
          </p>
          <p className="text-xs text-red-600 mt-3 font-medium">
            - Santa Claus, North Pole Workshop 🏠❄️
          </p>
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;