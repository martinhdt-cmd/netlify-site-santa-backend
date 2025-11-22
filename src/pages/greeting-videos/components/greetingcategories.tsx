
interface GreetingCategoriesProps {
  selectedCategory: string;
  onCategorySelect: (category: string) => void;
}

const GreetingCategories = ({ selectedCategory, onCategorySelect }: GreetingCategoriesProps) => {
  const categories = [
    {
      id: 'all',
      name: 'All Occasions',
      description: 'Browse all greeting videos',
      icon: 'ri-gift-line',
      color: 'bg-red-900'
    },
    {
      id: 'birthday',
      name: 'Birthday',
      description: 'Celebrate another year of joy',
      icon: 'ri-cake-line',
      color: 'bg-amber-600'
    },
    {
      id: 'anniversary',
      name: 'Anniversary',
      description: 'Honor love and commitment',
      icon: 'ri-heart-line',
      color: 'bg-rose-600'
    },
    {
      id: 'thank-you',
      name: 'Thank You',
      description: 'Express heartfelt gratitude',
      icon: 'ri-hand-heart-line',
      color: 'bg-emerald-600'
    },
    {
      id: 'congratulations',
      name: 'Congratulations',
      description: 'Celebrate achievements',
      icon: 'ri-trophy-line',
      color: 'bg-blue-600'
    },
    {
      id: 'sympathy',
      name: 'Sympathy',
      description: 'Offer comfort in difficult times',
      icon: 'ri-leaf-line',
      color: 'bg-gray-600'
    }
  ];

  return (
    <section className="py-20 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-red-900 mb-6">
            Choose Your Occasion
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Each greeting video is crafted with the same gentle warmth and personal touch 
            that makes every message feel like a treasured conversation by the fireside.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => onCategorySelect(category.id)}
              className={`group p-6 rounded-xl transition-all duration-300 cursor-pointer text-center ${
                selectedCategory === category.id
                  ? `${category.color} text-white shadow-xl scale-105`
                  : 'bg-white hover:bg-gray-50 text-gray-700 shadow-lg hover:shadow-xl hover:scale-105'
              }`}
            >
              <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${
                selectedCategory === category.id
                  ? 'bg-white/20'
                  : `${category.color} text-white`
              }`}>
                <i className={`${category.icon} text-xl`}></i>
              </div>
              
              <h3 className="font-serif font-bold mb-2">
                {category.name}
              </h3>
              
              <p className={`text-sm leading-relaxed ${
                selectedCategory === category.id
                  ? 'text-white/80'
                  : 'text-gray-600'
              }`}>
                {category.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GreetingCategories;
