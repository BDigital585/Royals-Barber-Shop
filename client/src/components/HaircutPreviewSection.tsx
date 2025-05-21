import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import { useHaircutImages } from '../features/haircuts/useHaircutImages';
import { Send, MessageSquare } from 'lucide-react';
import ShareButton from './ShareButton';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea';
import ChatBot from './ChatBot';

// Custom Link component that ensures scroll to top
const ScrollToTopLink = ({ href, className, children }: { href: string, className?: string, children: React.ReactNode }) => {
  const handleClick = () => {
    // Manually scroll to top when link is clicked (in addition to navigation)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

// Valid category IDs (for validation)
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

const HaircutPreviewSection = () => {
  const imagesByFolder = useHaircutImages();
  const [randomImages, setRandomImages] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  
  // Helper function to get the display name for a category
  const getCategoryName = (categoryId: string): string => {
    // Decode URL-encoded characters
    const decodedCategory = decodeURIComponent(categoryId.trim().toLowerCase());
    
    // Check if this is a valid category we know about
    if (VALID_CATEGORIES.includes(decodedCategory)) {
      return categoryNames[decodedCategory];
    }
    
    return '';
  };
  
  // On mount, randomly select 6 images to display
  useEffect(() => {
    // Get all images by flattening the folder arrays
    const allImages = Object.values(imagesByFolder).flat();
    
    // Only proceed if we have images
    if (allImages.length === 0) return;
    
    // Shuffle the array and take up to 6 images
    const shuffled = [...allImages].sort(() => 0.5 - Math.random());
    setRandomImages(shuffled.slice(0, 6));
  }, [imagesByFolder]);
  
  // Add intersection observer for fade-in effect
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1
      }
    );
    
    const section = document.getElementById('haircut-preview-section');
    if (section) {
      observer.observe(section);
    }
    
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section 
      id="haircut-preview-section"
      className="py-8 md:py-10 bg-white"
    >
      <div className="container mx-auto px-4">        
        {randomImages.length > 0 ? (
          <div className={`${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`}>
            {/* Horizontal scrollable container for mobile */}
            <div className="haircut-scroll-container relative pb-4 mb-6">
              <div className="flex overflow-x-auto gap-4 pb-4 snap-x">
                {randomImages.map((imageUrl, index) => {
                  // Extract folder and filename from the imageUrl
                  const matches = imageUrl.match(/\/src\/assets\/haircuts\/([^/]+)\/([^/]+)$/);
                  if (!matches) return null;
                  
                  const [, folder, filename] = matches;
                  const imageTitle = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '').replace(/-/g, ' ');
                  const formattedTitle = imageTitle
                    .split(' ')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' ');
                  
                  return (
                    <div 
                      key={index} 
                      className="group relative aspect-square rounded-lg shadow-md overflow-hidden flex-shrink-0 snap-start"
                      style={{ width: '280px', maxWidth: '90vw' }}
                    >
                      <img 
                        src={imageUrl} 
                        alt={`${formattedTitle} – ${getCategoryName(folder)} style | Royals Barbershop, Batavia NY`}
                        className="w-full h-full object-cover object-center transition-all duration-300 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent">
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
                    </div>
                  );
                })}
              </div>
              <div className="scroll-indicators flex justify-center gap-2 mt-2">
                <div className="w-16 h-1 bg-gradient-to-r from-transparent to-gray-300 rounded-full"></div>
                <div className="w-16 h-1 bg-gradient-to-l from-transparent to-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-16 flex items-center justify-center">
            <p className="text-gray-400">Loading haircut styles...</p>
          </div>
        )}
        
        {/* Heading moved below the images */}
        <div className={`mt-8 mb-6 ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          <div className="border-l-4 border-primary pl-3 md:pl-4 py-1 max-w-2xl mx-auto">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-heading text-primary mb-2 leading-tight">
              Not Sure What <span className="inline-block">to Ask For?</span>
            </h2>
            <p className="text-gray-600 text-sm sm:text-base md:text-lg">
              Explore popular styles so you know exactly what to book.
            </p>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-6 mt-8 max-w-4xl mx-auto">
          <div className={`flex-1 flex flex-col justify-center ${isVisible ? 'animate-fadeInUp' : 'opacity-0'}`} style={{ animationDelay: '300ms' }}>
            <h3 className="text-lg font-medium mb-3 text-center md:text-left">Want to see all styles?</h3>
            <ScrollToTopLink 
              href="/browse-haircuts" 
              className="inline-flex items-center justify-center bg-primary hover:bg-[#B91C1C] text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
            >
              See Full Haircut Guide
            </ScrollToTopLink>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HaircutPreviewSection;