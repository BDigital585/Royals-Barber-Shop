import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useHaircutImages } from '../features/haircuts/useHaircutImages';

// Mapping of folder IDs to human-readable names
const categoryNames: Record<string, string> = {
  'fades': 'Fades',
  'kids haircuts': 'Kids Haircuts',
  'tapers': 'Tapers',
  'facial hair': 'Facial Hair',
  'other styles': 'Other Styles'
};

const BrowseHaircuts = () => {
  const imagesByFolder = useHaircutImages();
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Helper function to get display name for category
  const getCategoryName = (categoryId: string): string => {
    return categoryNames[categoryId] || categoryId;
  };

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
              {displayImages.map((imageUrl, index) => {
                // Extract folder and filename from the imageUrl
                const matches = imageUrl.match(/\/src\/assets\/haircuts\/([^/]+)\/([^/]+)$/);
                if (!matches) return null;
                
                const [, folder, filename] = matches;
                const imageTitle = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '').replace(/-/g, ' ');
                const formattedTitle = imageTitle
                  .split(' ')
                  .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(' ');
                
                // Create the share link
                const shareLink = `/haircut/${encodeURIComponent(folder)}/${encodeURIComponent(filename)}`;
                
                return (
                  <div key={index} className="group relative aspect-square rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden">
                    <a href={shareLink} className="block w-full h-full">
                      <img 
                        src={imageUrl} 
                        alt={formattedTitle}
                        className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-medium truncate">{formattedTitle}</h3>
                          <p className="text-white/80 text-sm">{getCategoryName(folder)}</p>
                        </div>
                      </div>
                    </a>
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button 
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          window.location.href = shareLink;
                        }}
                        className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors"
                        aria-label="Share haircut"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                          <path d="M13.5 1a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zM11 2.5a2.5 2.5 0 1 1 .603 1.628l-6.718 3.12a2.499 2.499 0 0 1 0 1.504l6.718 3.12a2.5 2.5 0 1 1-.488.876l-6.718-3.12a2.5 2.5 0 1 1 0-3.256l6.718-3.12A2.5 2.5 0 0 1 11 2.5zm-8.5 4a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3zm11 5.5a1.5 1.5 0 1 0 0 3 1.5 1.5 0 0 0 0-3z"/>
                        </svg>
                      </button>
                    </div>
                  </div>
                );
              })}
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