
import { useState } from 'react';
import Layout from '../../components/layout/Layout';
import GreetingCategories from './components/GreetingCategories';
import GreetingProducts from './components/GreetingProducts';
import GreetingPersonalizationForm from './components/GreetingPersonalizationForm';

const GreetingVideosPage = () => {
  const [showPersonalizationForm, setShowPersonalizationForm] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('all');

  return (
    <Layout>
      {/* Hero Section */}
      <section 
        className="relative py-24 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `linear-gradient(rgba(127, 29, 29, 0.3), rgba(146, 64, 14, 0.5)), url('https://readdy.ai/api/search-image?query=Cozy%20living%20room%20with%20warm%20crackling%20fireplace%2C%20comfortable%20leather%20armchair%2C%20soft%20golden%20lighting%2C%20Christmas%20decorations%2C%20wooden%20beams%2C%20peaceful%20winter%20evening%2C%20magical%20holiday%20atmosphere%2C%20gentle%20shadows%2C%20inviting%20ambiance%2C%20realistic%20interior%20design%2C%20festive%20home%20setting&width=1920&height=600&seq=greeting-videos-hero&orientation=landscape')`
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg">
            Warm Greeting Videos
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-4xl mx-auto leading-relaxed mb-12 drop-shadow-md">
            Heartfelt personalized messages for every special occasion, 
            delivered with the same gentle warmth and fireside comfort that 
            makes our Santa videos so cherished.
          </p>
        </div>
      </section>

      {/* Categories Section */}
      <GreetingCategories 
        selectedCategory={selectedCategory}
        onCategorySelect={setSelectedCategory}
      />

      {/* Products Section */}
      {!showPersonalizationForm && (
        <GreetingProducts 
          selectedCategory={selectedCategory}
          onPersonalizeClick={() => setShowPersonalizationForm(true)} 
        />
      )}

      {/* Personalization Form */}
      {showPersonalizationForm && <GreetingPersonalizationForm />}
    </Layout>
  );
};

export default GreetingVideosPage;
