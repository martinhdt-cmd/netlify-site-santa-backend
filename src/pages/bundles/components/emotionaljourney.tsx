
const EmotionalJourney = () => {
  const journeySteps = [
    {
      phase: 'Anticipation',
      title: 'Building Excitement',
      description: 'The journey begins with gentle anticipation, as each video builds upon the last, creating a crescendo of magical moments.',
      icon: 'ri-heart-pulse-line',
      color: 'bg-rose-500',
    },
    {
      phase: 'Connection',
      title: 'Deepening Bonds',
      description: 'Each personalized message creates deeper emotional connections, making every child feel truly seen and valued.',
      icon: 'ri-links-line',
      color: 'bg-amber-500',
    },
    {
      phase: 'Wonder',
      title: 'Magical Moments',
      description: 'The peak experiences create lasting wonder, with Santa\'s gentle presence bringing pure joy and amazement.',
      icon: 'ri-star-line',
      color: 'bg-yellow-500',
    },
    {
      phase: 'Memory',
      title: 'Treasured Forever',
      description: 'These moments become cherished memories, creating a foundation of magic that lasts long after the season ends.',
      icon: 'ri-bookmark-line',
      color: 'bg-red-500',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-red-900 mb-6">
            An Emotional Journey Through the Season
          </h2>
          <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Our bundles and Season Pass aren't just collections of videos – they're carefully orchestrated 
            experiences that create an emotional arc of wonder, joy, and lasting memories throughout the holiday season.
          </p>
        </div>

        <div className="relative">
          {/* Journey Path */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-rose-500 via-amber-500 via-yellow-500 to-red-500 transform -translate-y-1/2 z-0"></div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
            {journeySteps.map((step, index) => (
              <div key={step.phase} className="text-center group">
                {/* Icon Circle */}
                <div className={`w-24 h-24 mx-auto mb-6 ${step.color} rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300 relative z-10`}>
                  <i className={`${step.icon} text-3xl text-white`}></i>
                </div>
                
                {/* Phase Label */}
                <div className="mb-3">
                  <span className={`inline-block px-4 py-1 ${step.color} text-white text-sm font-medium rounded-full`}>
                    Phase {index + 1}: {step.phase}
                  </span>
                </div>
                
                <h3 className="text-xl font-serif font-bold text-red-900 mb-4">
                  {step.title}
                </h3>
                
                <p className="text-gray-600 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-16 bg-white rounded-2xl shadow-lg p-8 md:p-12">
          <div className="text-center">
            <h3 className="text-3xl font-serif font-bold text-red-900 mb-6">
              The Science of Seasonal Joy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-brain-line text-2xl text-red-900"></i>
                </div>
                <h4 className="text-lg font-serif font-bold text-red-900 mb-2">Memory Formation</h4>
                <p className="text-gray-600 text-sm">Spaced experiences create stronger, more vivid memories that children treasure forever.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-emotion-happy-line text-2xl text-amber-600"></i>
                </div>
                <h4 className="text-lg font-serif font-bold text-red-900 mb-2">Emotional Bonding</h4>
                <p className="text-gray-600 text-sm">Multiple touchpoints deepen the emotional connection and sense of personal relationship with Santa.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-gift-line text-2xl text-yellow-600"></i>
                </div>
                <h4 className="text-lg font-serif font-bold text-red-900 mb-2">Anticipation Building</h4>
                <p className="text-gray-600 text-sm">Scheduled deliveries create healthy anticipation that enhances the joy of each surprise.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EmotionalJourney;
