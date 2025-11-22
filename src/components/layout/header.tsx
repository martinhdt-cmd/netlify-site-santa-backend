
import { useState } from 'react';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Santa Messages', href: '/santa-messages' },
    { name: 'Greeting Videos', href: '/greeting-videos' },
    { name: 'Bundles & Season Pass', href: '/bundles' },
    { name: 'Gift Cards', href: '/cards-gifts' },
    { name: 'About', href: '/about' },
    { name: 'Contact', href: '/contact' },
  ];

  const handleNavigation = (href: string) => {
    window.REACT_APP_NAVIGATE(href);
    setMobileMenuOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-red-900 to-amber-600 sticky top-0 z-50 shadow-lg">
      <nav className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div 
            className="flex-shrink-0 cursor-pointer"
            onClick={() => handleNavigation('/')}
          >
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-cream">
              KeepInMindGreetings
            </h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1">
            {navigation.map((item) => (
              <button
                key={item.name}
                onClick={() => handleNavigation(item.href)}
                className="text-cream/90 hover:text-cream hover:bg-white/10 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap"
              >
                {item.name}
              </button>
            ))}
            
            {/* Test Dashboard - Prominent Button */}
            <button
              onClick={() => handleNavigation('/test-dashboard')}
              className="ml-4 bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap shadow-lg"
            >
              <i className="ri-test-tube-line mr-2"></i>
              Test Dashboard
            </button>
            
            <button
              onClick={() => handleNavigation('/account')}
              className="ml-2 btn-secondary bg-amber-600 hover:bg-amber-700 text-cream whitespace-nowrap"
            >
              <i className="ri-user-line mr-2"></i>
              My Account
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-cream hover:text-cream/80 p-2"
            >
              <i className={`${mobileMenuOpen ? 'ri-close-line' : 'ri-menu-line'} text-2xl`}></i>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="lg:hidden pb-4">
            <div className="flex flex-col space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.name}
                  onClick={() => handleNavigation(item.href)}
                  className="text-cream/90 hover:text-cream hover:bg-white/10 px-4 py-3 rounded-lg text-left font-medium transition-all duration-200 whitespace-nowrap"
                >
                  {item.name}
                </button>
              ))}
              
              {/* Test Dashboard - Mobile */}
              <button
                onClick={() => handleNavigation('/test-dashboard')}
                className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-3 rounded-lg font-semibold transition-all duration-200 whitespace-nowrap text-left"
              >
                <i className="ri-test-tube-line mr-2"></i>
                Test Dashboard
              </button>
              
              <button
                onClick={() => handleNavigation('/account')}
                className="btn-secondary bg-amber-600 hover:bg-amber-700 text-cream text-left whitespace-nowrap"
              >
                <i className="ri-user-line mr-2"></i>
                My Account
              </button>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
