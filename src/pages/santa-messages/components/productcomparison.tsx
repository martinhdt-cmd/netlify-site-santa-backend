
const ProductComparison = () => {
  const products = [
    {
      name: 'Santa Standard Video',
      price: '€27',
      features: [
        { name: 'Video Duration', value: '2-3 minutes' },
        { name: 'Personalisation Level', value: 'Standard' },
        { name: 'Name Mention', value: true },
        { name: 'Custom Details', value: '2-3 details' },
        { name: 'Town/City Reference', value: true },
        { name: 'Number of Videos', value: '1 video' },
        { name: 'Scheduled Delivery', value: false },
        { name: 'Extended Storytelling', value: false },
        { name: 'Family Memories', value: false },
        { name: 'Delivery Time', value: '24-48 hours' },
      ],
    },
    {
      name: 'Santa Wish List & Christmas Eve Check-In',
      price: '€41',
      popular: true,
      features: [
        { name: 'Video Duration', value: '2 videos (2-3 min each)' },
        { name: 'Personalisation Level', value: 'Premium' },
        { name: 'Name Mention', value: true },
        { name: 'Custom Details', value: 'Extensive details' },
        { name: 'Town/City Reference', value: true },
        { name: 'Number of Videos', value: '2 separate videos' },
        { name: 'Scheduled Delivery', value: 'Part 2 scheduled' },
        { name: 'Extended Storytelling', value: true },
        { name: 'Family Memories', value: true },
        { name: 'Delivery Time', value: 'Part 1: 24-48 hrs | Part 2: Your chosen date' },
      ],
    },
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-white to-red-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-red-900 mb-6">
            Compare Santa Video Options
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Choose the perfect Santa experience for your loved ones. Both options feature Santa's warm fireside presence with personalised details.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-2xl shadow-lg overflow-hidden">
            <thead>
              <tr className="bg-gradient-to-r from-red-900 to-red-800">
                <th className="px-6 py-4 text-left text-white font-serif text-lg">
                  Feature
                </th>
                {products.map((product) => (
                  <th key={product.name} className="px-6 py-4 text-center relative">
                    {product.popular && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-amber-500 text-white px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap">
                          Most Popular
                        </span>
                      </div>
                    )}
                    <div className="text-white font-serif text-lg mb-2">
                      {product.name}
                    </div>
                    <div className="text-amber-300 text-2xl font-bold">
                      {product.price}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products[0].features.map((_, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}
                >
                  <td className="px-6 py-4 font-medium text-gray-900 border-b border-gray-200">
                    {products[0].features[index].name}
                  </td>
                  {products.map((product) => (
                    <td
                      key={product.name}
                      className="px-6 py-4 text-center border-b border-gray-200"
                    >
                      {typeof product.features[index].value === 'boolean' ? (
                        product.features[index].value ? (
                          <i className="ri-check-line text-green-600 text-2xl"></i>
                        ) : (
                          <i className="ri-close-line text-gray-400 text-2xl"></i>
                        )
                      ) : (
                        <span className="text-gray-700 text-sm">
                          {product.features[index].value}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-12 bg-amber-50 rounded-2xl p-8 border-2 border-amber-200">
          <div className="flex items-start">
            <div className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
              <i className="ri-information-line text-amber-600 text-3xl"></i>
            </div>
            <div className="ml-4">
              <h3 className="text-xl font-serif font-bold text-red-900 mb-3">
                About the Two-Part Package
              </h3>
              <div className="space-y-2 text-gray-700">
                <p className="leading-relaxed">
                  <strong>Video 1 - Wish List Acknowledgement:</strong> Santa records an early message acknowledging that he has received your child's wish list, or kindly asks them to send it. This creates early excitement and anticipation.
                </p>
                <p className="leading-relaxed">
                  <strong>Video 2 - Christmas Eve Follow-Up:</strong> A special follow-up message scheduled for Christmas Eve (or your chosen date) that includes recent achievements, behaviour praise, and magical surprises based on details you provide.
                </p>
                <p className="leading-relaxed text-sm text-gray-600 mt-4">
                  Both videos are fully personalised with your child's name, age, and special details that make each message uniquely magical.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProductComparison;
