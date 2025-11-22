
import { Link } from 'react-router-dom';

const ReminderService = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-red-900 to-amber-600 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 items-center">
            {/* Content */}
            <div className="p-12 lg:p-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-cream mb-6">
                Never Forget a<br />
                <span className="text-amber-300">Special Day</span>
              </h2>
              
              <p className="text-xl text-cream/90 mb-8 leading-relaxed">
                Our gentle reminder service helps you stay connected to the moments that matter most. 
                Set up personalized reminders for birthdays, anniversaries, and special occasions.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-center text-cream/90">
                  <i className="ri-notification-line text-amber-300 mr-4 text-xl"></i>
                  <span>Gentle email reminders before special dates</span>
                </div>
                <div className="flex items-center text-cream/90">
                  <i className="ri-calendar-line text-amber-300 mr-4 text-xl"></i>
                  <span>Customizable reminder schedules</span>
                </div>
                <div className="flex items-center text-cream/90">
                  <i className="ri-heart-line text-amber-300 mr-4 text-xl"></i>
                  <span>Never miss a moment to show you care</span>
                </div>
              </div>
              
              <Link
                to="/contact"
                className="btn-secondary bg-amber-600 hover:bg-amber-700 text-lg px-8 py-4"
              >
                Learn More About Reminders
              </Link>
            </div>
            
            {/* Image */}
            <div className="h-96 lg:h-full">
              <img
                src="https://readdy.ai/api/search-image?query=Elegant%20calendar%20with%20golden%20pen%20marking%20special%20dates%2C%20warm%20lighting%2C%20wooden%20desk%20surface%2C%20cozy%20home%20office%20setting%2C%20reminder%20notes%2C%20peaceful%20atmosphere%2C%20soft%20focus%20background%2C%20realistic%20photography%20style&width=600&height=400&seq=reminder-service&orientation=landscape"
                alt="Reminder Service"
                className="w-full h-full object-cover object-top"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ReminderService;
