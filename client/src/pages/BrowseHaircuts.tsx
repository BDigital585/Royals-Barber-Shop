import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

const BrowseHaircuts = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const filterCategories = [
    { id: 'all', label: 'All Haircuts' },
    { id: 'fades', label: 'Fades' },
    { id: 'kids', label: 'Kids Haircuts' },
    { id: 'tapers', label: 'Tapers' },
    { id: 'facial', label: 'Facial Hair' },
    { id: 'other', label: 'Other Styles' }
  ];

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  return (
    <>
      <Header />
      <main className="pt-[64px] md:pt-[80px] pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-heading text-primary text-center my-8">Browse Haircuts</h1>
          
          {/* Scrollable Filter Bar */}
          <div className="relative mb-8 overflow-x-auto pb-2">
            <div className="flex space-x-2 min-w-max">
              {filterCategories.map(category => (
                <button
                  key={category.id}
                  className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors duration-200 ${
                    activeFilter === category.id
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                  onClick={() => handleFilterChange(category.id)}
                >
                  {category.label}
                </button>
              ))}
            </div>
          </div>
          
          {/* Placeholder for haircut images grid */}
          <div className="min-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-center">
              Haircut images will be displayed here based on selected filter: <span className="font-medium">{activeFilter}</span>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BrowseHaircuts;