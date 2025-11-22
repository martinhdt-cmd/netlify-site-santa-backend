import Layout from '../../components/layout/Layout';

const ContactPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="relative py-24 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(127, 29, 29, 0.8), rgba(146, 64, 14, 0.7)), url('https://readdy.ai/api/search-image?query=Cozy%20home%20office%20with%20warm%20fireplace%2C%20comfortable%20desk%20setup%2C%20soft%20golden%20lighting%2C%20peaceful%20writing%20atmosphere%2C%20realistic%20interior%20design%2C%20inviting%20communication%20space%2C%20serene%20environment&width=1920&height=600&seq=contact-hero&orientation=landscape')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-cream mb-6">
            Get in Touch
          </h1>
          <p className="text-xl md:text-2xl text-cream/90 max-w-3xl mx-auto leading-relaxed">
            We're here to help make every video perfect and every experience magical. 
            Reach out with questions, special requests, or just to say hello.
          </p>
        </div>
      </section>

      {/* Contact Form Section */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-serif font-bold text-red-900 mb-8">
                Let's Create Magic Together
              </h2>
              
              <p className="text-gray-600 mb-8 leading-relaxed">
                Whether you have questions about our videos, need help with personalization, 
                or want to discuss custom requirements, our caring team is here to help make 
                every moment special.
              </p>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="ri-chat-smile-line text-red-900 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-red-900 mb-2">
                      KeepInMind Concierge
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Our AI concierge is available 24/7 to help you choose the perfect video, 
                      answer questions, and guide you through the personalization process.
                    </p>
                    <button 
                      onClick={() => document.querySelector('#vapi-widget-floating-button')?.click()}
                      className="text-red-900 hover:text-amber-600 font-medium text-sm mt-2 cursor-pointer"
                    >
                      Start chatting now →
                    </button>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="ri-time-line text-amber-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-red-900 mb-2">
                      Response Time
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      We typically respond to messages within 2-4 hours during business hours. 
                      For urgent requests, please use our chat feature for immediate assistance.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                    <i className="ri-shield-check-line text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-red-900 mb-2">
                      Privacy & Security
                    </h3>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      Your personal information and video details are kept completely secure. 
                      We never share your data and all communications are encrypted.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-gray-50 rounded-2xl p-8">
              <h3 className="text-2xl font-serif font-bold text-red-900 mb-6">
                Send Us a Message
              </h3>
              
              <form 
                action="https://readdy.ai/api/form/d4db37qahcjh6clrrgv0"
                method="POST"
                data-readdy-form
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                    />
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subject *
                  </label>
                  <select
                    name="subject"
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent pr-8 text-sm"
                  >
                    <option value="">Select a subject</option>
                    <option value="general-inquiry">General Inquiry</option>
                    <option value="video-question">Video Questions</option>
                    <option value="personalization-help">Personalization Help</option>
                    <option value="technical-support">Technical Support</option>
                    <option value="custom-request">Custom Video Request</option>
                    <option value="billing-question">Billing Question</option>
                    <option value="feedback">Feedback</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows={6}
                    required
                    maxLength={500}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-900 focus:border-transparent text-sm"
                    placeholder="Tell us how we can help make your experience magical..."
                  ></textarea>
                  <div className="text-right text-sm text-gray-500 mt-1">
                    Maximum 500 characters
                  </div>
                </div>
                
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    name="newsletter"
                    id="newsletter"
                    className="mt-1 mr-3"
                  />
                  <label htmlFor="newsletter" className="text-sm text-gray-600">
                    I'd like to receive updates about new videos and special offers
                  </label>
                </div>
                
                <button
                  type="submit"
                  className="btn-primary w-full whitespace-nowrap"
                >
                  <i className="ri-send-plane-line mr-2"></i>
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-red-900 mb-6">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed">
              Quick answers to common questions about our magical video experiences.
            </p>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "How long does it take to receive my personalized video?",
                answer: "Most videos are delivered within 24-48 hours. Bundles and Season Pass videos follow your chosen schedule. You'll receive an email with your private video link when it's ready."
              },
              {
                question: "Can I schedule my video for a specific date and time?",
                answer: "Absolutely! During checkout, you can choose either 'Send When Ready' for immediate delivery or 'Scheduled Delivery' to specify exactly when you want to receive your video."
              },
              {
                question: "What information do I need to provide for personalization?",
                answer: "We'll ask for the child's name, age (optional), town, special details to mention, anything to avoid, and your preferred tone. The more details you share, the more magical we can make the experience!"
              },
              {
                question: "Are the videos suitable for all ages?",
                answer: "Yes! Our videos are designed to be appropriate for children of all ages. We adjust the content and tone based on the age you provide during personalization."
              },
              {
                question: "Can I share my video with family members?",
                answer: "Yes, you'll receive a private link that you can share with family and friends. Season Pass holders get additional family sharing options."
              },
              {
                question: "What if I'm not satisfied with my video?",
                answer: "We're committed to making every video perfect. If you're not completely satisfied, contact us within 48 hours and we'll work with you to make it right."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white rounded-xl shadow-lg p-6">
                <h3 className="text-lg font-serif font-bold text-red-900 mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ContactPage;