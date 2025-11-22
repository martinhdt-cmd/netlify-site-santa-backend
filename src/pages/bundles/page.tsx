
import Layout from '../../components/layout/Layout';
import BundleProducts from './components/BundleProducts';
import SeasonPassSection from './components/SeasonPassSection';
import EmotionalJourney from './components/EmotionalJourney';

const BundlesPage = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="relative py-24 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(127, 29, 29, 0.8), rgba(146, 64, 14, 0.7)), url('https://readdy.ai/api/search-image?query=Multiple%20wrapped%20Christmas%20gifts%20under%20decorated%20tree%20by%20cozy%20fireplace%2C%20warm%20golden%20lighting%2C%20magical%20holiday%20atmosphere%2C%20realistic%20interior%2C%20festive%20decorations%2C%20peaceful%20Christmas%20scene&width=1920&height=600&seq=bundles-hero&orientation=landscape')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-cream mb-6">
            Bundles & Season Pass
          </h1>
          <p className="text-xl md:text-2xl text-cream/90 max-w-3xl mx-auto leading-relaxed">
            Create an unforgettable emotional journey throughout the season with our carefully crafted 
            bundles and exclusive Season Pass experiences.
          </p>
        </div>
      </section>

      <EmotionalJourney />
      <BundleProducts />
      <SeasonPassSection />
    </Layout>
  );
};

export default BundlesPage;
