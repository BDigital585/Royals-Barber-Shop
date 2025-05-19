import { useEffect, useRef } from 'react';
import { FaMapMarkerAlt, FaPhone, FaInstagram, FaFacebook } from 'react-icons/fa';
import { FaGoogle } from 'react-icons/fa';

const WelcomeSection = () => {
  const shimmerRef = useRef<HTMLDivElement>(null);

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
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-10 md:py-14 relative z-20">
        <div className="flex flex-col items-center">
          
          {/* Contact and social info - Mobile optimized */}
          <div className="flex flex-wrap justify-center gap-3 w-full max-w-4xl mx-auto px-4">
            {/* Address */}
            <a 
              href="https://maps.google.com/?q=317+Ellicott+Street,+Batavia,+NY" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-full shadow-sm transition-all duration-300 group bg-white"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-white group-hover:shadow-md transition-all">
                <FaMapMarkerAlt size={16} />
              </div>
              <span className="font-medium text-gray-900">317 Ellicott St, Batavia</span>
            </a>
            
            {/* Phone */}
            <a 
              href="tel:+15855366576" 
              className="flex items-center gap-2 py-2 px-3 hover:bg-gray-50 rounded-full shadow-sm transition-all duration-300 group bg-white"
            >
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-white group-hover:shadow-md transition-all">
                <FaPhone size={16} />
              </div>
              <span className="font-medium text-gray-900">(585) 536-6576</span>
            </a>
            
            {/* Social Links - Combined in one row */}
            <div className="flex items-center gap-2 py-2 px-4 hover:bg-gray-50 rounded-full shadow-sm transition-all duration-300 bg-white">
              <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-white">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M8 14s1.5 2 4 2 4-2 4-2"></path><line x1="9" y1="9" x2="9.01" y2="9"></line><line x1="15" y1="9" x2="15.01" y2="9"></line></svg>
              </div>
              <div className="flex space-x-3">
                <a 
                  href="https://www.instagram.com/royalsbarbershop585" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#E1306C] transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram size={20} />
                </a>
                <a 
                  href="https://www.facebook.com/share/19UCgP9N1f/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#1877F2] transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook size={20} />
                </a>
                <a 
                  href="https://g.page/r/CXiCN-AOTXGtEBM/review" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-600 hover:text-[#DB4437] transition-colors"
                  aria-label="Google Reviews"
                >
                  <FaGoogle size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;