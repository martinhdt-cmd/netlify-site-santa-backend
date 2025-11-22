
import { Link } from 'react-router-dom';

const Hero = () => {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Urgent Alert Header */}
      <div className="relative z-20 bg-gradient-to-r from-red-600 to-red-700 text-white py-3 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 text-sm md:text-base font-semibold">
            <i className="ri-alarm-warning-line text-yellow-300 animate-pulse"></i>
            <span className="uppercase tracking-wide">Limited Places Left!</span>
            <i className="ri-alarm-warning-line text-yellow-300 animate-pulse"></i>
          </div>
          <p className="text-xs md:text-sm mt-1 opacity-90">
            Book your Christmas Eve Santa callback now - Only a few spots remaining for December 24th delivery!
          </p>
        </div>
      </div>

      {/* Main Hero Content */}
      <div className="relative flex-1 flex items-center justify-center">
        {/* Background Image */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://readdy.ai/api/search-image?query=Santa%20Claus%20sitting%20by%20cozy%20fireplace%20with%20warm%20golden%20lighting%2C%20Christmas%20stockings%20hanging%2C%20wrapped%20presents%20nearby%2C%20magical%20winter%20evening%20atmosphere%2C%20traditional%20Christmas%20scene%2C%20peaceful%20holiday%20setting%2C%20realistic%20festive%20ambiance&width=1920&height=1080&seq=santa-wishlist-hero&orientation=landscape"
            alt="Santa Claus by the fireplace creating magical Christmas moments"
            className="w-full h-full object-cover object-center"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40"></div>
        </div>

        {/* Content */}
        <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-20">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-6 drop-shadow-lg">
              Magical Moments, Never Forgotten
            </h1>
            <p className="text-xl md:text-2xl text-white/90 leading-relaxed mb-12 drop-shadow-md">
              Personalised video messages from Santa and loved ones, delivered exactly when they matter most. 
              Create lasting memories with our gentle, heartwarming approach to digital greetings.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <button 
                onClick={() => window.REACT_APP_NAVIGATE('/santa-messages')}
                className="btn-primary text-lg px-8 py-4 cursor-pointer relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  <i className="ri-gift-line mr-2"></i>
                  Create Santa Video
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              </button>
              <button 
                onClick={() => window.REACT_APP_NAVIGATE('/bundles')}
                className="btn-secondary text-lg px-8 py-4 cursor-pointer"
              >
                <i className="ri-star-line mr-2"></i>
                View Season Pass
              </button>
            </div>

            {/* Christmas Eve Urgency CTA */}
            <div className="mt-8 p-4 bg-red-600/90 backdrop-blur-sm rounded-xl border-2 border-red-400/50">
              <div className="flex items-center justify-center gap-2 text-white mb-2">
                <i className="ri-time-line text-yellow-300"></i>
                <span className="font-semibold text-sm uppercase tracking-wide">Christmas Eve Special</span>
                <i className="ri-time-line text-yellow-300"></i>
              </div>
              <p className="text-white/95 text-sm mb-3">
                Secure your Christmas Eve Santa callback - Limited availability for December 24th delivery!
              </p>
              <button 
                onClick={() => window.REACT_APP_NAVIGATE('/santa-messages')}
                className="bg-yellow-400 hover:bg-yellow-300 text-red-900 font-bold py-2 px-6 rounded-full text-sm transition-colors duration-200 whitespace-nowrap"
              >
                <i className="ri-calendar-check-line mr-2"></i>
                Book Christmas Eve Slot
              </button>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-10">
          <div className="animate-bounce">
            <i className="ri-arrow-down-line text-white text-2xl drop-shadow-lg"></i>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
