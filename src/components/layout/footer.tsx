import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    'Products': [
      { name: 'Santa Messages', href: '/santa-messages' },
      { name: 'Greeting Videos', href: '/greeting-videos' },
      { name: 'Bundles & Season Pass', href: '/bundles' },
      { name: 'Cards & Gifts', href: '/cards-gifts' },
    ],
    'Business': [
      { name: 'Retail & Wholesale', href: '/retail-wholesale' },
      { name: 'About Us', href: '/about' },
      { name: 'Contact', href: '/contact' },
    ],
    'Support': [
      { name: 'Privacy Policy', href: '/privacy-policy' },
      { name: 'Terms of Service', href: '/terms' },
      { name: 'Refund Policy', href: '/refunds' },
    ],
  };

  return (
    <footer className="bg-red-900 text-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-serif font-bold mb-4">
              KeepInMindGreetings
            </h3>
            <p className="text-cream/80 mb-6 leading-relaxed">
              Creating magical personalized video messages from Santa and warm greeting videos for all occasions. Never forget a special day.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-cream/80 hover:text-cream transition-colors cursor-pointer">
                <i className="ri-facebook-fill text-xl"></i>
              </a>
              <a href="#" className="text-cream/80 hover:text-cream transition-colors cursor-pointer">
                <i className="ri-instagram-line text-xl"></i>
              </a>
              <a href="#" className="text-cream/80 hover:text-cream transition-colors cursor-pointer">
                <i className="ri-youtube-line text-xl"></i>
              </a>
            </div>
          </div>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-lg font-serif font-semibold mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link
                      to={link.href}
                      className="text-cream/80 hover:text-cream transition-colors cursor-pointer"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-cream/20 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-cream/80 text-sm">
            © {currentYear} KeepInMindGreetings. All rights reserved.
          </p>
          <div className="mt-4 md:mt-0">
            <a 
              href="https://readdy.ai/?origin=logo" 
              className="text-cream/60 hover:text-cream/80 text-sm transition-colors cursor-pointer"
              target="_blank"
              rel="noopener noreferrer"
            >
              Powered by Readdy
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
