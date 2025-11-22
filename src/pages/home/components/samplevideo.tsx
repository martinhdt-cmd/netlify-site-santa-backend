
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SampleVideo = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const handleStartVideo = () => {
    navigate('/santa-messages');
  };

  return (
    <section className="py-20 bg-gradient-to-br from-red-50 via-amber-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Two-column layout */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left column - 3-step flow */}
          <div className="space-y-8">
            <div className="text-center lg:text-left">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-red-900 mb-6">
                Create Your Santa Video
              </h2>
              <p className="text-xl text-gray-600 leading-relaxed">
                Three simple steps to magical personalized messages
              </p>
            </div>

            {/* Steps */}
            <div className="space-y-6">
              {/* Step 1 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-900 text-cream rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-900 mb-2">
                    Choose your Santa video template
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Pick the type of message you'd like Santa to record – a single message, bedtime story, birthday surprise, or bundle.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-900 text-cream rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-900 mb-2">
                    Add your magical details
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Tell Santa the names, little stories, and details to mention (and what to avoid).
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-12 h-12 bg-red-900 text-cream rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-red-900 mb-2">
                    Schedule & let Santa do the rest
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    Choose a delivery date and timezone, or send a private link when it's ready.
                  </p>
                </div>
              </div>
            </div>

            {/* Primary CTA Button */}
            <div className="pt-6">
              <button
                onClick={handleStartVideo}
                className="w-full lg:w-auto bg-red-900 hover:bg-red-800 text-cream px-12 py-4 rounded-full text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap cursor-pointer"
              >
                Start your Santa video
              </button>
            </div>
          </div>

          {/* Right column - Sample video */}
          <div className="space-y-6">
            <div className="text-center lg:text-left">
              <h3 className="text-2xl font-serif font-bold text-red-900 mb-4">
                See how Santa speaks from the heart
              </h3>
              <p className="text-gray-600 leading-relaxed">
                In this sample, Santa shares the same calm, cosy fireside style he'll use for your loved one. Every real order includes a fully personalised script based on the details you share – this sample is just to show the tone and atmosphere.
              </p>
            </div>

            {/* Video container with cosy frame */}
            <div className="relative">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-6 rounded-2xl shadow-lg">
                <div className="relative rounded-xl overflow-hidden shadow-xl bg-black cursor-pointer group" onClick={openModal}>
                  <div className="aspect-video relative">
                    <img
                      src="https://readdy.ai/api/search-image?query=Cozy%20fireside%20living%20room%20with%20warm%20crackling%20fireplace%2C%20comfortable%20leather%20armchair%2C%20soft%20golden%20lighting%2C%20Christmas%20decorations%2C%20wooden%20beams%2C%20peaceful%20winter%20evening%2C%20Santas%20silhouette%20sitting%20by%20the%20fire%2C%20cinematic%20warm%20glow%2C%20realistic%20interior%20design%2C%20magical%20holiday%20atmosphere%2C%20gentle%20shadows%2C%20inviting%20ambiance&width=1200&height=675&seq=santa-preview&orientation=landscape"
                      alt="Sample Santa Video Preview - Cozy Fireside Setting"
                      className="w-full h-full object-cover object-center"
                    />
                    
                    {/* Dark overlay for better contrast */}
                    <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-all duration-300"></div>
                    
                    {/* Play button overlay */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-red-900/90 backdrop-blur-sm rounded-full p-4 group-hover:bg-red-800/90 group-hover:scale-110 transition-all duration-300 shadow-2xl">
                        <i className="ri-play-fill text-cream text-3xl ml-1"></i>
                      </div>
                    </div>
                    
                    {/* Sample preview label */}
                    <div className="absolute top-3 left-3">
                      <div className="bg-amber-600/90 backdrop-blur-sm text-cream px-3 py-1 rounded-full text-sm font-medium">
                        Sample Preview
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sample script example */}
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 border border-amber-200">
              <h4 className="text-lg font-semibold text-red-900 mb-3">Sample Script Style:</h4>
              <p className="text-gray-700 leading-relaxed italic">
                "Hello there! Santa here with a special message just for you. I'm sitting by the fire, thinking of all the wonderful people I get to speak to. Every message I record is made carefully from the details you send in – names, favourite things, and little stories that make your loved ones unique. When you're ready, you can tell me who the message is for, and I'll prepare a calm, cosy fireside video just for them."
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={closeModal}
          ></div>
          
          {/* Modal content */}
          <div className="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
            {/* Close button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 z-10 bg-black/20 hover:bg-black/40 text-white rounded-full p-2 transition-all duration-200"
            >
              <i className="ri-close-line text-xl"></i>
            </button>
            
            {/* Modal header */}
            <div className="bg-gradient-to-r from-red-900 to-red-800 text-cream p-6">
              <h3 className="text-2xl font-serif font-bold mb-2">Sample Santa Preview</h3>
              <p className="text-cream/90">Experience the magic of our personalized Santa videos</p>
            </div>
            
            {/* Video placeholder */}
            <div className="aspect-video bg-gradient-to-b from-red-900/10 to-amber-900/10 flex items-center justify-center">
              <div className="text-center p-8">
                <div className="bg-red-900/10 rounded-full p-8 mb-6 inline-block">
                  <i className="ri-video-line text-red-900 text-6xl"></i>
                </div>
                <h4 className="text-2xl font-serif font-bold text-red-900 mb-4">
                  Sample Santa Video Coming Soon
                </h4>
                <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                  Our sample video is being prepared to showcase the warm, cinematic quality 
                  of our personalized Santa messages. Each video features Santa in a cozy 
                  fireside setting, delivering heartfelt messages with gentle, realistic charm.
                </p>
                <div className="mt-8 flex justify-center">
                  <button
                    onClick={closeModal}
                    className="bg-red-900 hover:bg-red-800 text-cream px-8 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl whitespace-nowrap"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default SampleVideo;
