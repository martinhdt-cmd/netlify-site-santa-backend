
const HowItWorks = () => {
  const steps = [
    {
      step: '1',
      title: 'Choose Your Video',
      description: 'Select from our collection of Santa videos or greeting messages, each crafted with care and warmth.',
      icon: 'ri-video-line',
    },
    {
      step: '2',
      title: 'Personalize Details',
      description: 'Share the special details - names, ages, towns, and memories that make your message unique and meaningful.',
      icon: 'ri-edit-line',
    },
    {
      step: '3',
      title: 'Schedule & Receive',
      description: 'Choose your delivery date and time, then receive your magical personalized video via private link.',
      icon: 'ri-calendar-schedule-line',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-red-50 to-amber-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-red-900 mb-6">
            How It Works
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Creating your personalized video is simple and magical. 
            In just three steps, you'll have a treasured memory to keep forever.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <div key={step.step} className="text-center relative">
              {/* Connection Line */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-16 left-1/2 w-full h-0.5 bg-gradient-to-r from-amber-300 to-red-300 transform translate-x-1/2 z-0"></div>
              )}
              
              {/* Step Circle */}
              <div className="relative z-10 w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-red-900 to-amber-600 rounded-full flex items-center justify-center shadow-xl">
                <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center">
                  <i className={`${step.icon} text-3xl text-red-900`}></i>
                </div>
                <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-amber-600 rounded-full flex items-center justify-center text-white font-bold">
                  {step.step}
                </div>
              </div>
              
              <h3 className="text-2xl font-serif font-bold text-red-900 mb-4">
                {step.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed max-w-sm mx-auto">
                {step.description}
              </p>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-16">
          <div className="inline-flex items-center bg-white rounded-full px-8 py-4 shadow-lg">
            <i className="ri-time-line text-amber-600 mr-3 text-xl"></i>
            <span className="text-gray-700 font-medium">
              Videos delivered within 24-48 hours
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
