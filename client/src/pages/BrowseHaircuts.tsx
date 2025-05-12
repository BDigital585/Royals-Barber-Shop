import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useHaircutImages } from '../features/haircuts/useHaircutImages';

const BrowseHaircuts = () => {
  const imagesByFolder = useHaircutImages();
  const [activeFilter, setActiveFilter] = useState('all');

  const filterCategories = [
    { id: 'all', label: 'All Haircuts' },
    { id: 'fades', label: 'Fades' },
    { id: 'kids haircuts', label: 'Kids Haircuts' },
    { id: 'tapers', label: 'Tapers' },
    { id: 'facial hair', label: 'Facial Hair' },
    { id: 'other styles', label: 'Other Styles' }
  ];

  const handleFilterChange = (filterId: string) => {
    setActiveFilter(filterId);
  };

  // Prepare images to display based on the active filter
  const getDisplayImages = () => {
    if (activeFilter === 'all') {
      // For "All Haircuts", flatten all image arrays
      return Object.values(imagesByFolder).flat();
    }
    // For specific categories, return the matching folder images
    return imagesByFolder[activeFilter] || [];
  };

  const displayImages = getDisplayImages();

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
          
          {/* Display haircut images in a responsive grid */}
          {displayImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayImages.map((imageUrl, index) => (
                <div key={index} className="aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <img 
                    src={imageUrl} 
                    alt={`Haircut style ${index + 1}`} 
                    className="w-full h-full object-cover object-center"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="min-h-[400px] flex items-center justify-center bg-gray-50 rounded-lg">
              <p className="text-gray-500 text-center">
                No images available for this category yet. Check back soon!
              </p>
            </div>
          )}
          
          {/* Professional Disclaimer */}
          <div className="mt-12 mb-8 px-4 py-5 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm text-center max-w-3xl mx-auto leading-relaxed">
              Disclaimer: The haircuts displayed on this page were not performed by barbers currently employed at this establishment. 
              These images are provided for promotional and educational purposes only. 
              Our licensed barbers are capable of performing most of the styles shown.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BrowseHaircuts;