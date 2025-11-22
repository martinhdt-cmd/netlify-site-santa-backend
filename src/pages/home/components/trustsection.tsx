
const TrustSection = () => {
  const trustPoints = [
    {
      icon: 'ri-shield-check-line',
      title: 'Privacy Protected',
      description: 'Your personal information and video details are kept completely secure and private.',
    },
    {
      icon: 'ri-customer-service-line',
      title: 'Dedicated Support',
      description: 'Our caring team is here to help make every video perfect and every experience magical.',
    },
    {
      icon: 'ri-award-line',
      title: 'Quality Guaranteed',
      description: 'Every video is crafted with attention to detail and delivered with the highest quality.',
    },
    {
      icon: 'ri-time-line',
      title: 'Timely Delivery',
      description: 'Scheduled delivery ensures your video arrives exactly when you need it most.',
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-red-900 mb-6">
            Trusted by Families Everywhere
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            We understand how precious these moments are. That's why we're committed to 
            delivering not just videos, but treasured memories with complete trust and care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trustPoints.map((point, index) => (
            <div key={index} className="text-center group">
              <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-red-900 to-amber-600 rounded-full flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow duration-300">
                <i className={`${point.icon} text-2xl text-cream`}></i>
              </div>
              
              <h3 className="text-xl font-serif font-bold text-red-900 mb-4">
                {point.title}
              </h3>
              
              <p className="text-gray-600 leading-relaxed">
                {point.description}
              </p>
            </div>
          ))}
        </div>

        {/* Testimonial */}
        <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <i key={i} className="ri-star-fill text-amber-500 text-2xl"></i>
              ))}
            </div>
            
            <blockquote className="text-xl md:text-2xl text-gray-700 font-serif italic mb-8 leading-relaxed">
              "The video was absolutely magical. Santa's gentle voice and the cozy fireside setting 
              made it feel so real and special. Our daughter watches it every night before bed."
            </blockquote>
            
            <div className="flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-br from-red-900 to-amber-600 rounded-full flex items-center justify-center mr-4">
                <span className="text-cream font-bold text-xl">S</span>
              </div>
              <div className="text-left">
                <p className="font-semibold text-gray-900">Sarah M.</p>
                <p className="text-gray-600">Mother of two</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection;
