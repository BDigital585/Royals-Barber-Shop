import { useState, useEffect, useRef } from 'react';
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
  const videoRef = useRef<HTMLVideoElement>(null);
  const imagesByFolder = useHaircutImages();
  const [activeFilter, setActiveFilter] = useState('all');
  
  // State to track video loading
  const [videoLoaded, setVideoLoaded] = useState(false);
  
  // Optimize video loading for instant playback
  useEffect(() => {
    // Cache the video in browser memory
    const prefetchVideo = () => {
      // Create a link tag to prefetch the video
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = '/images/guy-chair.mp4';
      link.as = 'video';
      document.head.appendChild(link);
      
      // Also preload directly
      const videoPreload = document.createElement('video');
      videoPreload.style.display = 'none';
      videoPreload.src = '/images/guy-chair.mp4';
      videoPreload.preload = 'auto';
      document.body.appendChild(videoPreload);
      
      // Clean up
      return () => {
        document.head.removeChild(link);
        document.body.removeChild(videoPreload);
      };
    };
    
    // Function to handle immediate video playback
    const handleVideoPlayback = () => {
      const video = videoRef.current;
      if (!video) return;
      
      // Set highest loading priority
      video.preload = "auto";
      
      // Force load and immediate play
      video.load();
      
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log("Video playing successfully");
            setVideoLoaded(true);
          })
          .catch(error => {
            console.log("Video autoplay prevented:", error);
            // Try again on user interaction
            document.addEventListener('click', () => {
              video.play()
                .then(() => setVideoLoaded(true))
                .catch(() => {});
            }, { once: true });
          });
      }
    };
    
    // Run both strategies
    const cleanup = prefetchVideo();
    handleVideoPlayback();
    
    // Set up fallback timers to make sure video appears
    const timer = setTimeout(() => {
      setVideoLoaded(true); // Force showing video after a delay
    }, 300);
    
    return () => {
      cleanup();
      clearTimeout(timer);
    };
  }, []);
  
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
      <main className="pb-16">
        {/* Hero video section for BrowseHaircuts page */}
        <section className="relative w-full bg-black">
          <div className="w-full h-[70vh] min-h-[450px] max-h-[700px] relative overflow-hidden bg-black">
            {/* Hero background with immediate visibility */}
            <div 
              className="absolute inset-0 w-full h-full bg-gradient-to-b from-gray-900 to-black"
              style={{
                backgroundImage: "linear-gradient(to bottom, #000000, #1a1a1a)",
                opacity: 1
              }}
            >
              {/* Static logo that shows immediately */}
              <div className="absolute inset-0 flex items-center justify-center opacity-20">
                <div
                  className="w-[200px] h-[200px] bg-contain bg-center bg-no-repeat"
                  style={{ 
                    backgroundImage: 'url(/images/Royals\\ Text\\ Only\\ Logo\\ on\\ Dark.png)',
                  }}
                ></div>
              </div>
            </div>
            
            {/* Background with gradient pattern that shows immediately */}
            <div 
              className="absolute inset-0 w-full h-full opacity-50"
              style={{
                backgroundImage: "radial-gradient(circle at 25% 25%, rgba(50, 50, 50, 0.3) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(80, 80, 80, 0.3) 0%, transparent 50%)"
              }}
            ></div>
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent flex items-end justify-end flex-col">
              <div className="container mx-auto px-4 md:px-6 pb-10 md:pb-12">
                <div className="max-w-3xl mb-8 md:mb-10">
                  <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-3 md:mb-4">
                    Find Your Perfect <span className="text-primary">Style</span>
                  </h1>
                  <p className="text-white/90 text-sm md:text-base lg:text-lg max-w-xl mb-6">
                    Browse our gallery of premium haircuts to find the perfect look for your next visit to Royals Barber Shop.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
        
        <div className="container mx-auto px-4 py-6 md:py-8">
          
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
                        className="p-2 bg-white/90 backdrop-blur-sm rounded-md shadow-lg hover:bg-white transition-colors flex items-center"
                        aria-label="Share haircut"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-black">
                          <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"></path>
                          <polyline points="16 6 12 2 8 6"></polyline>
                          <line x1="12" y1="2" x2="12" y2="15"></line>
                        </svg>
                        <span className="ml-1 text-xs font-medium text-black">Share</span>
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