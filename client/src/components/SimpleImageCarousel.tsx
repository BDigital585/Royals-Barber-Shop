import { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play } from 'lucide-react';
import { getQueryFn } from '@/lib/queryClient';
import { useQuery } from '@tanstack/react-query';

interface SimpleCarouselProps {
  className?: string;
}

const SimpleImageCarousel = ({ className = '' }: SimpleCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const autoplayIntervalRef = useRef<number | null>(null);
  
  // Fetch all images from the shop folder through the API
  const { data, isLoading } = useQuery<string[]>({
    queryKey: ['/api/shop-images'],
    queryFn: getQueryFn({ on401: 'returnNull' }),
    refetchOnWindowFocus: false,
  });
  
  // Use a safer version of the image data with fallback to empty array
  const shopImages: string[] = data || [];
  
  // Navigate to the next image
  const nextImage = useCallback(() => {
    if (shopImages.length === 0) return;
    
    setCurrentIndex((prevIndex) => 
      prevIndex === shopImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [shopImages.length]);
  
  // Navigate to the previous image
  const prevImage = useCallback(() => {
    if (shopImages.length === 0) return;
    
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? shopImages.length - 1 : prevIndex - 1
    );
  }, [shopImages.length]);
  
  // Set up autoplay for the carousel
  useEffect(() => {
    // Only start autoplay if we have images and are not paused
    if (shopImages.length > 0 && !isPaused) {
      // Clear any existing interval
      if (autoplayIntervalRef.current) {
        window.clearInterval(autoplayIntervalRef.current);
      }
      
      // Set new interval for autoplay (5 seconds)
      autoplayIntervalRef.current = window.setInterval(() => {
        nextImage();
      }, 5000);
    }
    
    // Cleanup function
    return () => {
      if (autoplayIntervalRef.current) {
        window.clearInterval(autoplayIntervalRef.current);
        autoplayIntervalRef.current = null;
      }
    };
  }, [shopImages.length, nextImage, isPaused]);
  
  // Toggle autoplay on/off
  const toggleAutoplay = useCallback(() => {
    setIsPaused(prev => !prev);
  }, []);
  
  // Function to handle touch start for swipe detection
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const touchDown = e.touches[0].clientX;
    const carousel = e.currentTarget;
    
    // Store the initial touch position as a data attribute
    carousel.setAttribute('data-touchstart', touchDown.toString());
  }, []);
  
  // Function to handle touch move for swipe detection
  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    const carousel = e.currentTarget;
    const touchStartStr = carousel.getAttribute('data-touchstart');
    
    if (!touchStartStr) return;
    
    const touchStart = parseInt(touchStartStr, 10);
    const currentTouch = e.touches[0].clientX;
    const diff = touchStart - currentTouch;
    
    // Minimum swipe distance
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        nextImage();
      } else {
        prevImage();
      }
      
      // Clear the touch start position
      carousel.removeAttribute('data-touchstart');
    }
  }, [nextImage, prevImage]);
  
  // Get the object position based on image index for better face focusing
  const getObjectPosition = (index: number) => {
    // Mapping of indices to custom positions for face focusing
    const positionMap: Record<number, string> = {
      // Add specific positions for images as needed
      // These are examples based on the original hardcoded values
      7: '50% 15%',  // IMG_0682.JPG
      8: '50% 15%',  // IMG_0683.JPG
      4: '50% 25%',  // IMG_0679.JPG
      14: '50% 25%', // IMG_9366.JPG
    };
    
    // Return custom position from map or default
    return positionMap[index] || '50% 20%';
  };
  
  // Display loading state while images are being loaded
  if (isLoading) {
    return (
      <section className={`carousel-section py-10 ${className}`}>
        <div className="container px-4 mx-auto">
          <h2 className="text-xl md:text-2xl text-center font-heading mb-6 md:mb-8 text-primary leading-relaxed">
            Proudly serving Batavia for 10 years.<br />
            <span className="font-medium text-gray-700 text-lg md:text-xl">Thank you for growing with us!</span>
          </h2>
          <div className="simple-carousel-container relative max-w-3xl mx-auto">
            <div className="simple-carousel-image h-64 sm:h-72 md:h-96 bg-gray-200 animate-pulse rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Loading images...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }
  
  return (
    <section className={`carousel-section py-10 ${className}`}>
      <div className="container px-4 mx-auto">
        <h2 className="text-xl md:text-2xl text-center font-heading mb-6 md:mb-8 text-primary leading-relaxed">
          Proudly serving Batavia for 10 years.<br />
          <span className="font-medium text-gray-700 text-lg md:text-xl">Thank you for growing with us!</span>
        </h2>
        
        <div 
          className="simple-carousel-container relative max-w-3xl mx-auto"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          {/* Main Image */}
          {shopImages.length > 0 && (
            <div className="simple-carousel-image relative rounded-lg overflow-hidden shadow-lg">
              <img
                src={shopImages[currentIndex]}
                alt={`Barber shop image ${currentIndex + 1}`}
                loading="eager"
                className="w-full h-64 sm:h-72 md:h-96 object-cover"
                style={{ objectPosition: getObjectPosition(currentIndex) }}
              />
            </div>
          )}
          
          {/* Navigation Controls */}
          <button 
            className="carousel-control carousel-prev absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md text-primary"
            onClick={prevImage}
            aria-label="Previous image"
          >
            <ChevronLeft size={24} />
          </button>
          
          <button 
            className="carousel-control carousel-next absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-2 shadow-md text-primary"
            onClick={nextImage}
            aria-label="Next image"
          >
            <ChevronRight size={24} />
          </button>
          
          {/* Autoplay toggle button */}
          <button 
            className="carousel-control absolute left-1/2 -translate-x-1/2 bottom-4 bg-white/80 hover:bg-white rounded-full p-2 shadow-md text-primary"
            onClick={toggleAutoplay}
            aria-label={isPaused ? "Play slideshow" : "Pause slideshow"}
          >
            {isPaused ? <Play size={18} /> : <Pause size={18} />}
          </button>
          
          {/* Image counter */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded">
            {currentIndex + 1} / {shopImages.length}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleImageCarousel;