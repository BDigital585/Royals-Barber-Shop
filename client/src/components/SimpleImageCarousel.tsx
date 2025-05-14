import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SimpleCarouselProps {
  className?: string;
}

const SimpleImageCarousel = ({ className = '' }: SimpleCarouselProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // List all images from the shop folder
  const shopImages = [
    '/shop/cut.JPG',
    '/shop/cut2.JPG',
    '/shop/IMG_0674.JPG',
    '/shop/IMG_0675.JPG',
    '/shop/IMG_0676.JPG',
    '/shop/IMG_0678.JPG',
    '/shop/IMG_0679.JPG',
    '/shop/IMG_0680.JPG',
    '/shop/IMG_0681.JPG',
    '/shop/IMG_0682.JPG',
    '/shop/IMG_0683.JPG',
    '/shop/IMG_0684.JPG',
    '/shop/IMG_0685.JPG',
    '/shop/IMG_9364.JPG',
    '/shop/IMG_9366.JPG'
  ];
  
  // Navigate to the next image
  const nextImage = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === shopImages.length - 1 ? 0 : prevIndex + 1
    );
  }, [shopImages.length]);
  
  // Navigate to the previous image
  const prevImage = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? shopImages.length - 1 : prevIndex - 1
    );
  }, [shopImages.length]);
  
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
          <div className="simple-carousel-image relative rounded-lg overflow-hidden shadow-lg">
            <img
              src={shopImages[currentIndex]}
              alt={`Barber shop image ${currentIndex + 1}`}
              loading="eager"
              className="w-full h-64 sm:h-72 md:h-96 object-cover"
              style={{ 
                objectPosition: 
                  // Adjust position for specific images that need better face focus
                  currentIndex === 8 || currentIndex === 7 ? '50% 15%' : 
                  currentIndex === 4 || currentIndex === 14 ? '50% 25%' : 
                  '50% 20%'
              }}
            />
          </div>
          
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
          
          {/* Image counter (optional) */}
          <div className="absolute bottom-4 right-4 bg-black/50 text-white text-sm px-2 py-1 rounded">
            {currentIndex + 1} / {shopImages.length}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SimpleImageCarousel;