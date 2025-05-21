import { useEffect, useState, useCallback, useMemo } from 'react';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from '@/lib/utils';

// Define image data interface
interface CarouselImage {
  src: string;
  alt: string;
}

// Define image paths to include in the carousel
// Using images from the shop folder in the public directory
const carouselImages: CarouselImage[] = [
  {
    src: "/shop/cut.JPG",
    alt: "Professional haircut at Royals Barber Shop"
  },
  {
    src: "/shop/cut2.JPG",
    alt: "Quality haircut from Royals expert barbers"
  },
  {
    src: "/shop/IMG_0674.JPG",
    alt: "Precise fade haircut technique from Royals Barber Shop"
  },
  {
    src: "/shop/IMG_0675.JPG",
    alt: "Classic men's haircut at Royals Barber Shop in Batavia"
  },
  {
    src: "/shop/IMG_0676.JPG",
    alt: "Premium men's haircut with perfect details"
  },
  {
    src: "/shop/IMG_0678.JPG",
    alt: "Modern haircut style from skilled barbers at Royals"
  },
  {
    src: "/shop/IMG_0680.JPG",
    alt: "Precision haircut by Royals Barbershop professionals"
  },
  {
    src: "/shop/IMG_9364.JPG",
    alt: "Expert men's haircut with fine detailing"
  }
];

const ImageCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  
  // Memoize our handlers to prevent unnecessary re-renders
  const nextSlide = useCallback(() => {
    setActiveIndex((prevIndex) => 
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  }, []);
  
  const prevSlide = useCallback(() => {
    setActiveIndex((prevIndex) => 
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  }, []);
  
  const goToSlide = useCallback((index: number) => {
    setActiveIndex(index);
    setPaused(false);
  }, []);

  // Optimize auto-play functionality
  useEffect(() => {
    let timer: number | undefined;
    
    if (!paused) {
      // Use requestAnimationFrame for smoother transitions
      const tick = () => {
        timer = window.setTimeout(() => {
          nextSlide();
          requestAnimationFrame(tick);
        }, 5000);
      };
      
      requestAnimationFrame(tick);
    }
    
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [paused, nextSlide]);
  
  // Optimized control handler
  const handleControl = useCallback((action: () => void) => {
    action();
    setPaused(true);
    
    const resumeTimer = window.setTimeout(() => {
      setPaused(false);
    }, 8000);
    
    return () => clearTimeout(resumeTimer);
  }, []);
  
  // Preload images for smoother transitions
  useEffect(() => {
    carouselImages.forEach(image => {
      const img = new Image();
      img.src = image.src;
    });
  }, []);
  
  return (
    <section className="carousel-section py-10 md:py-14 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-xl md:text-2xl text-center font-heading mb-6 md:mb-8 text-primary leading-relaxed px-4">
          Proudly serving Batavia for 10 years.<br />
          <span className="font-medium text-gray-700 text-lg md:text-xl">Thank you for growing with us!</span>
        </h2>
        
        <Carousel className="relative w-full" aria-label="Royals Barbershop images">
          <CarouselContent>
            {carouselImages.map((image, index) => (
              <CarouselItem key={index} className="flex justify-center">
                <div 
                  className={cn(
                    "carousel-image-wrapper relative h-60 sm:h-72 md:h-96 w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg transform transition-all",
                    {
                      "opacity-100 scale-100": index === activeIndex,
                      "opacity-0 absolute scale-95": index !== activeIndex
                    }
                  )}
                  style={{ display: index === activeIndex ? 'block' : 'none' }}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-full object-cover object-center"
                    loading={index <= 1 ? "eager" : "lazy"} 
                    decoding="async"
                  />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious 
            onClick={() => handleControl(prevSlide)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary border-0 z-10"
            aria-label="Previous image"
          />
          <CarouselNext 
            onClick={() => handleControl(nextSlide)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary border-0 z-10"
            aria-label="Next image"
          />
          
          {/* Small dot indicators for mobile */}
          <div className="flex justify-center mt-4 space-x-1.5 absolute -bottom-8 left-0 right-0">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === activeIndex ? "bg-primary scale-125" : "bg-gray-300"
                }`}
                aria-label={`Go to image ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default ImageCarousel;