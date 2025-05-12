import { useState } from 'react';
import { Link } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useHaircutImages, HaircutImage } from '../features/haircuts/useHaircutImages';
import { Share2 } from 'lucide-react';

// Use window.location.origin to get the current domain
const domain = typeof window !== 'undefined' ? window.location.origin : '';

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
  const getDisplayImages = (): HaircutImage[] => {
    if (activeFilter === 'all') {
      // For "All Haircuts", flatten all image arrays
      return Object.values(imagesByFolder).flat();
    }
    // For specific categories, return the matching folder images
    return imagesByFolder[activeFilter] || [];
  };

  const displayImages = getDisplayImages();

  // Create a shareable URL for an image
  const getShareableUrl = (image: HaircutImage) => {
    return `${domain}/share/haircuts/${encodeURIComponent(image.folder)}/${encodeURIComponent(image.filename)}`;
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
          
          {/* Display haircut images in a responsive grid */}
          {displayImages.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayImages.map((image, index) => (
                <div key={index} className="group relative aspect-square overflow-hidden rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <a 
                    href={getShareableUrl(image)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block relative w-full h-full"
                  >
                    <img 
                      src={image.url} 
                      alt={`${image.folder} - ${image.filename}`} 
                      className="w-full h-full object-cover object-center transition-transform group-hover:scale-105"
                    />
                    
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-opacity flex items-center justify-center">
                      <div className="bg-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <Share2 className="w-5 h-5 text-primary" />
                      </div>
                    </div>
                  </a>
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
        </div>
      </main>
      <Footer />
    </>
  );
};

export default BrowseHaircuts;