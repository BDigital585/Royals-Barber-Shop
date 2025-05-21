import { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaInstagram, FaFacebook, FaComments } from 'react-icons/fa';
import { FaGoogle } from 'react-icons/fa';

const WelcomeSection = () => {
  const shimmerRef = useRef<HTMLDivElement>(null);
  // No chat state anymore - removed chat functionality from this component

  // Shimmer light effect on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (shimmerRef.current) {
        const scrollY = window.scrollY;
        const element = shimmerRef.current;
        const rect = element.getBoundingClientRect();
        const isVisible = rect.top < window.innerHeight && rect.bottom >= 0;
        
        if (isVisible) {
          const position = (scrollY - rect.top + window.innerHeight) / 10;
          element.style.backgroundPosition = `${position}% 50%`;
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll(); // Initialize position
    
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section className="welcome-section relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-white to-gray-100 z-0"></div>
      
      {/* Shimmer effect overlay */}
      <div 
        ref={shimmerRef}
        className="absolute inset-0 opacity-30 z-10 shimmer-effect"
      ></div>
      
      {/* No chat interface here anymore - moved to Home component */}
      
      {/* Main content - compressed spacing */}
      <div className="container mx-auto px-4 py-3 md:py-4 relative z-20">
        <div className="flex flex-col items-center">
          
          {/* Contact and social info - Grid layout for better mobile display */}
          <div className="w-full max-w-md mx-auto">
            <div className="grid grid-cols-5 gap-1 sm:gap-3">
              {/* Address */}
              <a 
                href="https://maps.google.com/?q=317+Ellicott+Street,+Batavia,+NY" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center"
                aria-label="317 Ellicott St, Batavia, NY"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all">
                  <FaMapMarkerAlt size={20} />
                </div>
                <span className="text-xs text-center mt-1 font-medium text-gray-900">Location</span>
              </a>
              
              {/* Phone - icon only */}
              <a 
                href="tel:+15855366576"
                className="flex flex-col items-center" 
                aria-label="Call (585) 536-6576"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all">
                  <FaPhone size={18} />
                </div>
                <span className="text-xs text-center mt-1 font-medium text-gray-900">Call</span>
              </a>
              
              {/* Instagram */}
              <a 
                href="https://www.instagram.com/royalsbarbershop585" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center"
                aria-label="Instagram"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] text-white shadow-md hover:shadow-lg hover:scale-105 transition-all">
                  <FaInstagram size={22} />
                </div>
                <span className="text-xs text-center mt-1 font-medium text-gray-900">Instagram</span>
              </a>
              
              {/* Facebook */}
              <a 
                href="https://www.facebook.com/share/19UCgP9N1f/?mibextid=wwXIfr" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center"
                aria-label="Facebook"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#1877F2] to-[#0A66C2] text-white shadow-md hover:shadow-lg hover:scale-105 transition-all">
                  <FaFacebook size={20} />
                </div>
                <span className="text-xs text-center mt-1 font-medium text-gray-900">Facebook</span>
              </a>
              
              {/* Google Reviews - replaced chat button */}
              <a 
                href="https://www.google.com/search?q=royals+barbershop+batavia+ny+reviews" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex flex-col items-center"
                aria-label="Google Reviews"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#4285F4] to-[#EA4335] text-white shadow-md hover:shadow-lg hover:scale-105 transition-all">
                  <FaGoogle size={20} />
                </div>
                <span className="text-xs text-center mt-1 font-medium text-gray-900">Reviews</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;