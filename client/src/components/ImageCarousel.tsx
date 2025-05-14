import { useEffect, useState, useCallback } from 'react';
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
  caption: string;
}

// Import images for carousel
import basicFade from '../assets/haircuts/fades/basic-fade.jpg';
import skinFade from '../assets/haircuts/fades/skin-fade.jpg';
import dropFadeCurly from '../assets/haircuts/fades/drop-fade-curly.jpg';
import midFade from '../assets/haircuts/fades/mid-fade.jpg';
import curlyTopFade from '../assets/haircuts/fades/curly-top-fade.jpg';
import longMidTaper from '../assets/haircuts/tapers/long-mid-taper.jpg';
import lowLongTaper from '../assets/haircuts/tapers/low-long-taper.jpg';
import lightFade from '../assets/haircuts/other styles/light-fade.jpg';

// Define image paths to include in the carousel
const carouselImages: CarouselImage[] = [
  {
    src: basicFade,
    alt: "Classic fade haircut with clean lines",
    caption: "Classic Fade"
  },
  {
    src: skinFade,
    alt: "Skin fade haircut with excellent detail work",
    caption: "Premium Skin Fade"
  },
  {
    src: dropFadeCurly,
    alt: "Drop fade with curly texture on top",
    caption: "Drop Fade Curly"
  },
  {
    src: midFade,
    alt: "Mid fade haircut with textured top",
    caption: "Mid Fade"
  },
  {
    src: curlyTopFade,
    alt: "Curly top fade with natural styling",
    caption: "Curly Top Fade"
  },
  {
    src: longMidTaper,
    alt: "Long mid taper cut with extra length",
    caption: "Long Mid Taper"
  },
  {
    src: lowLongTaper,
    alt: "Low taper with length preservation",
    caption: "Low Long Taper"
  },
  {
    src: lightFade,
    alt: "Light fade with natural styling",
    caption: "Light Fade"
  },
];

const ImageCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  // Function to advance to the next slide
  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => 
      prevIndex === carouselImages.length - 1 ? 0 : prevIndex + 1
    );
  }, []);
  
  // Function to go to the previous slide
  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? carouselImages.length - 1 : prevIndex - 1
    );
  };
  
  // Function to directly set the current slide
  const goToSlide = (index: number) => {
    setCurrentIndex(index);
    // Reset auto-play timer when manually changing slides
    setIsPlaying(true);
  };
  
  // Auto-play functionality
  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isPlaying) {
      interval = setInterval(() => {
        nextSlide();
      }, 5000); // Change slide every 5 seconds
    }
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, nextSlide]);

  // Pause auto-play when user interacts with controls
  const handleControlClick = (callback: () => void) => {
    callback();
    setIsPlaying(false);
    // Resume auto-play after 10 seconds of inactivity
    setTimeout(() => setIsPlaying(true), 10000);
  };

  return (
    <section className="carousel-section py-12 md:py-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl text-center font-heading mb-8 text-primary">Featured Styles</h2>
        
        <Carousel className="relative w-full" aria-label="Haircut styles carousel">
          <CarouselContent>
            {carouselImages.map((image, index) => (
              <CarouselItem key={index} className="flex justify-center">
                <div 
                  className={cn(
                    "carousel-image-wrapper relative h-64 sm:h-80 md:h-96 w-full max-w-4xl mx-auto rounded-lg overflow-hidden shadow-lg transition-opacity duration-300",
                    index === currentIndex ? "opacity-100" : "opacity-0 absolute"
                  )}
                  style={{ display: index === currentIndex ? 'block' : 'none' }}
                >
                  <img 
                    src={image.src} 
                    alt={image.alt}
                    className="w-full h-full object-cover object-center"
                    loading={index === 0 ? "eager" : "lazy"} 
                  />
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 text-white">
                    <p className="text-lg font-semibold text-center">{image.caption}</p>
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          
          <CarouselPrevious 
            onClick={() => handleControlClick(prevSlide)}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary border-0"
            aria-label="Previous slide"
          />
          <CarouselNext 
            onClick={() => handleControlClick(nextSlide)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 hover:bg-white text-primary border-0"
            aria-label="Next slide"
          />
          
          {/* Dot indicators */}
          <div className="flex justify-center mt-4 space-x-2 absolute -bottom-10 left-0 right-0">
            {carouselImages.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === currentIndex ? "bg-primary" : "bg-gray-300"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </Carousel>
      </div>
    </section>
  );
};

export default ImageCarousel;