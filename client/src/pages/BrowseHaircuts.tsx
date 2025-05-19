import { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import SchemaMarkup from '@/components/SchemaMarkup';
import ImageSchemaMarkup from '@/components/ImageSchemaMarkup';
import { useHaircutImages } from '../features/haircuts/useHaircutImages';

// Valid category IDs (used for validation)
const VALID_CATEGORIES = [
  'fades',
  'kids haircuts',
  'tapers',
  'facial hair',
  'other styles'
];

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
  
  /**
   * Helper function to get the display name for a category
   * Cleans and formats folder names into proper category labels
   * 
   * @param categoryId - The raw folder name or category ID
   * @returns A properly formatted category name or empty string if invalid
   */
  const getCategoryName = (categoryId: string): string => {
    // Decode URL-encoded characters
    const decodedCategory = decodeURIComponent(categoryId.trim().toLowerCase());
    
    // Check if this is a valid category we know about
    if (VALID_CATEGORIES.includes(decodedCategory)) {
      return categoryNames[decodedCategory];
    }
    
    // If it's not a valid category, log a warning and return empty string
    console.warn(`Unknown category: ${decodedCategory}`);
    return '';
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
      // For "All Haircuts", flatten all image arrays and randomize the order
      const allImages = Object.values(imagesByFolder).flat();
      // Use Fisher-Yates (Knuth) shuffle algorithm for true randomization
      const shuffledImages = [...allImages];
      for (let i = shuffledImages.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
      }
      return shuffledImages;
    }
    // For specific categories, return the matching folder images (not randomized)
    return imagesByFolder[activeFilter] || [];
  };

  const displayImages = getDisplayImages();

  return (
    <>
      {/* SEO meta tags for haircuts gallery page */}
      <MetaTags
        title="Pick a Style That Fits You | Royals Barbershop, Batavia NY"
        description="Explore our gallery of premium men's haircuts including fades, tapers, kids cuts and facial hair styling at Royals Barbershop in Batavia, NY."
        imageUrl="/src/assets/haircuts/fades/low-skin-fade.png"
        type="website"
        url="https://www.royalsbatavia.com/browse-haircuts"
      />
      
      {/* Schema markup for haircuts gallery page */}
      <SchemaMarkup type="website" />
      
      <Header />
      <main className="pt-[64px] md:pt-[72px] pb-16">
        <div className="container mx-auto px-4 py-3 md:py-6 mt-6 md:mt-8">
          <div className="border-l-4 border-primary pl-3 md:pl-4 py-1 mb-5 md:mb-6">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-primary mb-2 leading-tight">
              Find Your <span className="inline-block">Perfect Style</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mb-1 max-w-xl">
              Not sure what to ask for? Browse our visual guide to popular cuts and styles.
            </p>
          </div>
          
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
                        alt={`${formattedTitle} – ${getCategoryName(folder)} style | Royals Barbershop, Batavia NY`}
                        className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
                      />
                      {/* Add ImageObject schema markup for this image */}
                      <ImageSchemaMarkup 
                        imageUrl={imageUrl}
                        description={`${formattedTitle} – ${getCategoryName(folder)} style | Royals Barbershop, Batavia NY`}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                          <h3 className="text-white font-medium truncate">{formattedTitle}</h3>
                          {/* Only show category if it's valid */}
                          {getCategoryName(folder) && (
                            <div className="flex items-center mt-1">
                              <span className="inline-block w-2 h-2 rounded-full bg-secondary mr-2"></span>
                              <p className="text-white/90 text-sm font-medium">{getCategoryName(folder)}</p>
                            </div>
                          )}
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