
import Layout from '../../components/layout/Layout';
import ProductGrid from './components/ProductGrid';
import ProductComparison from './components/ProductComparison';
import PersonalizationForm from './components/PersonalizationForm';
import { useState } from 'react';

const SantaMessagesPage = () => {
  const [selectedProduct, setSelectedProduct] = useState<{id: string; type: 'standard' | 'two-part'} | null>(null);

  const handleSelectProduct = (productId: string) => {
    const productType = productId === 'santa-two-part' ? 'two-part' : 'standard';
    setSelectedProduct({ id: productId, type: productType });
  };

  const handleCloseForm = () => {
    setSelectedProduct(null);
  };

  return (
    <Layout>
      {/* Hero Section - with Santa fireplace background */}
      <section 
        className="py-20 relative bg-cover bg-center"
        style={{
          backgroundImage: 'url(https://readdy.ai/api/search-image?query=Santa%20Claus%20cozy%20workshop%20interior%20with%20warm%20fireplace%2C%20Christmas%20decorations%2C%20wooden%20furniture%2C%20soft%20golden%20lighting%2C%20magical%20atmosphere%2C%20stockings%20hanging%2C%20festive%20garlands%2C%20comfortable%20armchair%20by%20fire%2C%20peaceful%20holiday%20scene%2C%20realistic%20detailed%20setting&width=1920&height=800&seq=santa-hero-bg&orientation=landscape)'
        }}
      >
        {/* Dark overlay for text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70"></div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 drop-shadow-lg">
              Santa Messages
            </h1>
            <p className="text-xl md:text-2xl text-white/95 leading-relaxed mb-8 drop-shadow-md">
              Gentle, warm personalized videos from Santa, delivered from his cozy fireside. 
              Each message is crafted with care to create magical moments that last forever.
            </p>
            
            {/* Simple value proposition */}
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl p-8 shadow-2xl border border-amber-200 mb-12">
              <div className="grid md:grid-cols-3 gap-6 text-center">
                <div>
                  <div className="w-16 h-16 bg-red-900/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-heart-line text-red-900 text-2xl"></i>
                  </div>
                  <h3 className="font-semibold text-red-900 mb-2">Calm & Realistic</h3>
                  <p className="text-gray-600 text-sm">Gentle fireside conversations, not theatrical performances</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-red-900/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-user-heart-line text-red-900 text-2xl"></i>
                  </div>
                  <h3 className="font-semibold text-red-900 mb-2">Fully Personalized</h3>
                  <p className="text-gray-600 text-sm">Every detail you share becomes part of Santa's message</p>
                </div>
                <div>
                  <div className="w-16 h-16 bg-red-900/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i className="ri-calendar-schedule-line text-red-900 text-2xl"></i>
                  </div>
                  <h3 className="font-semibold text-red-900 mb-2">Perfect Timing</h3>
                  <p className="text-gray-600 text-sm">Schedule delivery or get a private link when ready</p>
                </div>
              </div>
            </div>

            {/* Clear next step */}
            <div className="text-center">
              <p className="text-lg text-white/90 mb-6 drop-shadow-md">
                Choose your Santa video template below to get started
              </p>
              <div className="inline-flex items-center text-white font-medium drop-shadow-md">
                <i className="ri-arrow-down-line mr-2"></i>
                Select a template
              </div>
            </div>
          </div>
        </div>
      </section>

      {!selectedProduct && (
        <>
          <ProductGrid onSelectProduct={handleSelectProduct} />
          <ProductComparison />
        </>
      )}
      
      {selectedProduct && (
        <PersonalizationForm 
          productType={selectedProduct.type}
          onSubmit={handleCloseForm}
        />
      )}
    </Layout>
  );
};

export default SantaMessagesPage;
