
import Layout from '../../components/layout/Layout';

const AboutPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="relative py-24 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(127, 29, 29, 0.8), rgba(146, 64, 14, 0.7)), url('https://readdy.ai/api/search-image?query=Warm%20cozy%20living%20room%20with%20fireplace%2C%20comfortable%20armchair%2C%20family%20photos%20on%20mantle%2C%20soft%20golden%20lighting%2C%20peaceful%20home%20atmosphere%2C%20realistic%20interior%20design%2C%20inviting%20family%20space%2C%20serene%20environment&width=1920&height=600&seq=about-hero&orientation=landscape')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-cream mb-6">
            Our Story
          </h1>
          <p className="text-xl md:text-2xl text-cream/90 max-w-3xl mx-auto leading-relaxed">
            Creating magical moments and ensuring no special day is ever forgotten, 
            one personalized video at a time.
          </p>
        </div>
      </section>

      {/* Brand Philosophy */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-red-900 mb-8">
              Never Forget a Special Day
            </h2>
            <p className="text-xl text-gray-600 leading-relaxed mb-12">
              At KeepInMindGreetings, we believe that every special moment deserves to be celebrated 
              with the warmth and wonder it truly deserves. Our mission is simple yet profound: 
              to ensure that no special day is ever forgotten.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=Santa%20Claus%20sitting%20peacefully%20by%20warm%20fireplace%2C%20gentle%20expression%2C%20cozy%20living%20room%20setting%2C%20soft%20golden%20lighting%2C%20realistic%20portrayal%2C%20comfortable%20armchair%2C%20Christmas%20decorations%2C%20serene%20atmosphere%2C%20cinematic%20quality&width=500&height=400&seq=about-santa&orientation=landscape"
                alt="Our Fireside Santa"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
            <div>
              <h3 className="text-2xl font-serif font-bold text-red-900 mb-6">
                The Fireside Difference
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Unlike the rushed, cartoonish portrayals found elsewhere, our Santa embodies the 
                gentle wisdom and warmth of a beloved grandfather. Seated by his cozy fireside, 
                he speaks with the calm, measured pace of someone who truly understands the 
                magic of childhood wonder.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Every video is crafted with cinematic quality, featuring soft golden lighting 
                and a peaceful atmosphere that makes children feel as though they're sharing 
                a quiet, intimate moment with the real Santa Claus.
              </p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-900 to-amber-600 rounded-2xl p-8 md:p-12 text-cream mb-16">
            <div className="text-center">
              <h3 className="text-3xl font-serif font-bold mb-6">
                Our Core Values
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-heart-line text-2xl text-cream"></i>
                  </div>
                  <h4 className="text-lg font-serif font-bold mb-3">Authenticity</h4>
                  <p className="text-cream/80 text-sm leading-relaxed">
                    Every video feels genuine and personal, never rushed or artificial. 
                    We take the time to make each message truly special.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-shield-check-line text-2xl text-cream"></i>
                  </div>
                  <h4 className="text-lg font-serif font-bold mb-3">Trust</h4>
                  <p className="text-cream/80 text-sm leading-relaxed">
                    Families trust us with their most precious moments. We honor that 
                    trust with complete privacy and unwavering quality.
                  </p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-time-line text-2xl text-cream"></i>
                  </div>
                  <h4 className="text-lg font-serif font-bold mb-3">Timeliness</h4>
                  <p className="text-cream/80 text-sm leading-relaxed">
                    Special moments can't wait. We ensure every video arrives exactly 
                    when it's needed most, creating perfect timing for magic.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Reminder Service Philosophy */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-red-900 mb-8">
              Beyond Videos: A Philosophy of Care
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-16">
            <div>
              <h3 className="text-2xl font-serif font-bold text-red-900 mb-6">
                The Reminder Service
              </h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                Our gentle reminder service embodies our core belief: "Never forget a special day." 
                In our busy world, it's easy to let important dates slip by. We help families 
                stay connected to the moments that matter most.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                Whether it's a birthday, anniversary, or any meaningful occasion, our thoughtful 
                reminders ensure you never miss an opportunity to show someone you care.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <i className="ri-check-line text-green-600 mr-3"></i>
                  <span className="text-gray-700">Gentle, non-intrusive reminders</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-check-line text-green-600 mr-3"></i>
                  <span className="text-gray-700">Customizable reminder schedules</span>
                </div>
                <div className="flex items-center">
                  <i className="ri-check-line text-green-600 mr-3"></i>
                  <span className="text-gray-700">Helps maintain meaningful connections</span>
                </div>
              </div>
            </div>
            <div>
              <img
                src="https://readdy.ai/api/search-image?query=Elegant%20calendar%20with%20golden%20pen%20marking%20special%20dates%2C%20warm%20lighting%2C%20wooden%20desk%20surface%2C%20cozy%20home%20office%20setting%2C%20reminder%20notes%2C%20peaceful%20atmosphere%2C%20soft%20focus%20background%2C%20realistic%20photography%20style%2C%20organized%20planning&width=500&height=400&seq=about-reminder&orientation=landscape"
                alt="Reminder Service"
                className="w-full rounded-2xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Quality & Craftsmanship */}
      <section className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif font-bold text-red-900 mb-8">
              Craftsmanship & Quality
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Every video is a work of art, carefully crafted to create lasting memories 
              that families will treasure for generations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-movie-line text-3xl text-red-900"></i>
              </div>
              <h3 className="text-xl font-serif font-bold text-red-900 mb-4">
                Cinematic Quality
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Professional lighting, high-quality audio, and careful attention to every 
                visual detail create a truly cinematic experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-user-heart-line text-3xl text-amber-600"></i>
              </div>
              <h3 className="text-xl font-serif font-bold text-red-900 mb-4">
                Personal Touch
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Every detail you share is woven into the narrative, creating a truly 
                personal experience that feels authentic and meaningful.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <i className="ri-time-line text-3xl text-green-600"></i>
              </div>
              <h3 className="text-xl font-serif font-bold text-red-900 mb-4">
                Timeless Appeal
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our calm, realistic approach creates videos that remain magical and 
                relevant as children grow, becoming cherished family keepsakes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team & Mission */}
      <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-serif font-bold text-red-900 mb-8">
            Our Mission
          </h2>
          <div className="bg-white rounded-2xl shadow-lg p-8 md:p-12">
            <blockquote className="text-2xl font-serif italic text-gray-700 leading-relaxed mb-8">
              "To create magical moments that strengthen family bonds and ensure that 
              every special day is celebrated with the warmth, wonder, and personal 
              attention it deserves."
            </blockquote>
            <p className="text-gray-600 leading-relaxed mb-8">
              We're more than a video service – we're guardians of childhood wonder and 
              champions of family connection. In a world that moves too fast, we slow 
              down to create moments that truly matter.
            </p>
            <div className="flex justify-center">
              <button 
                onClick={() => document.querySelector('#vapi-widget-floating-button')?.click()}
                className="btn-primary"
              >
                <i className="ri-chat-smile-line mr-2"></i>
                Chat with Our Team
              </button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default AboutPage;
