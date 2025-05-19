import { useEffect, useRef, useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaInstagram, FaFacebook, FaComments } from 'react-icons/fa';
import { FaGoogle } from 'react-icons/fa';
import ChatBot from './ChatBot';

const WelcomeSection = () => {
  const shimmerRef = useRef<HTMLDivElement>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);

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
      
      {/* Chat Interface */}
      {isChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl flex flex-col w-full max-w-md h-[30rem] overflow-hidden">
            {/* Chat header */}
            <div className="bg-primary text-white p-4 flex justify-between items-center">
              <h3 className="font-semibold">Royals Barbershop Assistant</h3>
              <button 
                onClick={() => setIsChatOpen(false)}
                className="text-white hover:text-gray-200 transition-colors"
                aria-label="Close chat"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
              </button>
            </div>
            
            <ChatBot isInWelcomeSection={true} />
          </div>
        </div>
      )}
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-6 md:py-8 relative z-20">
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
              
              {/* Chat Button - Icon only */}
              <button
                onClick={() => setIsChatOpen(true)}
                className="flex flex-col items-center"
                aria-label="Chat with us"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 flex items-center justify-center rounded-full bg-gradient-to-br from-[#38B2AC] to-[#2C7A7B] text-white shadow-md hover:shadow-lg hover:scale-105 transition-all">
                  <FaComments size={20} />
                </div>
                <span className="text-xs text-center mt-1 font-medium text-gray-900">Chat</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WelcomeSection;