import { useEffect, useState, useRef } from 'react';
import { SiteHero, getHeroContent } from '@/lib/contentful';
import { FaMapMarkerAlt, FaPhone, FaInstagram, FaFacebook, FaComments } from 'react-icons/fa';
import ChatBot from './ChatBot';

const ContentfulHeroSection = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [heroContent, setHeroContent] = useState<SiteHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Fetch hero content from Contentful
  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        setLoading(true);
        const content = await getHeroContent();
        if (content) {
          setHeroContent(content);
          setError(null);
        } else {
          throw new Error('No content returned from Contentful');
        }
      } catch (err) {
        console.error('Error fetching hero content:', err);
        setError('Failed to load content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchHeroContent();
  }, []);

  // Handle video playback on mobile devices
  useEffect(() => {
    if (!heroContent?.videoUrl || !videoRef.current) return;

    const video = videoRef.current;
    
    // Try to play the video automatically
    const playVideo = () => {
      if (!video) return;
      
      // Set video properties for mobile autoplay
      video.muted = true;
      video.playsInline = true;
      video.setAttribute('playsinline', '');
      video.setAttribute('webkit-playsinline', '');
      
      // Attempt to play
      const playPromise = video.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.log('Autoplay prevented:', error);
          
          // Try playing on user interaction
          const handleUserInteraction = () => {
            video.play().catch(e => console.log('Still failed to play:', e));
            
            // Clean up event listeners after first interaction
            document.removeEventListener('touchstart', handleUserInteraction);
            document.removeEventListener('click', handleUserInteraction);
          };
          
          document.addEventListener('touchstart', handleUserInteraction, { once: true });
          document.addEventListener('click', handleUserInteraction, { once: true });
        });
      }
    };
    
    // Play video when it's loaded
    const handleCanPlay = () => {
      console.log('Video can play now');
      playVideo();
    };
    
    // Handle visibility changes (switching tabs, etc.)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        playVideo();
      }
    };
    
    // Attach event listeners
    video.addEventListener('canplay', handleCanPlay);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    // Clean up
    return () => {
      if (video) {
        video.removeEventListener('canplay', handleCanPlay);
      }
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [heroContent?.videoUrl]);

  // Video load handlers
  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setVideoError(false);
  };

  const handleVideoError = () => {
    console.error('Error loading video:', heroContent?.videoUrl);
    setVideoError(true);
  };

  // Loading state
  if (loading) {
    return (
      <section id="home" className="relative bg-gray-900 pt-[48px] md:pt-16">
        <div className="h-[35vh] md:h-[70vh] flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="animate-pulse w-full max-w-2xl mx-auto text-center">
              <div className="h-8 md:h-12 bg-gray-700 rounded mb-3 md:mb-6 mx-auto w-3/4"></div>
              <div className="h-3 md:h-4 bg-gray-700 rounded mb-4 md:mb-8 mx-auto w-1/2"></div>
              <div className="h-10 bg-gray-700 rounded-md mx-auto w-40"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Error state
  if (error || !heroContent) {
    return (
      <section id="home" className="relative bg-gradient-to-r from-gray-900 to-black pt-[48px] md:pt-16">
        <div className="h-[35vh] md:h-[70vh] flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center text-center">
              <a 
                href="https://royalsbarbershop.setmore.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block book-button py-3 px-8 text-base md:text-lg"
              >
                BOOK NOW
              </a>
              {error && (
                <p className="mt-3 md:mt-6 text-xs md:text-sm text-gray-400">
                  {error}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Check if we have video or image
  const hasVideo = heroContent.videoUrl && heroContent.videoUrl.trim() !== '' && !videoError;
  const hasImage = heroContent.backgroundImage && typeof heroContent.backgroundImage === 'string';
  const backgroundStyle = hasImage ? { backgroundImage: `url(${heroContent.backgroundImage})` } : {};

  // Fallback if no media
  if ((!hasVideo && !hasImage) || (videoError && !hasImage)) {
    return (
      <section id="home" className="relative bg-gradient-to-r from-gray-900 to-black pt-[48px] md:pt-16">
        <div className="h-[35vh] md:h-[70vh] flex items-center justify-center">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center text-center">
              <a 
                href="https://royalsbarbershop.setmore.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block book-button py-3 px-8 text-base md:text-lg"
              >
                BOOK NOW
              </a>
            </div>
          </div>
        </div>
      </section>
    );
  }

  // Main render with video
  return (
    <section id="home" className="relative bg-black pt-[48px] md:pt-16 pb-0 mb-0">
      <div 
        className={`relative h-[30vh] md:h-[65vh] overflow-hidden ${hasVideo ? '' : 'bg-cover bg-center'}`} 
        style={hasVideo ? {} : backgroundStyle}
      >
        {hasVideo && (
          <video 
            ref={videoRef}
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
            controls={false}
            onLoadedData={handleVideoLoad}
            onError={handleVideoError}
          >
            <source src={heroContent.videoUrl} type="video/mp4" />
            <source src={heroContent.videoUrl} type="video/quicktime" />
            <source src={heroContent.videoUrl} type="video/mov" />
            Your browser does not support the video tag.
          </video>
        )}
        
        {/* Gradient overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent flex flex-col items-start justify-center">
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-start">
            <div className="max-w-[600px] text-white text-left">
              <h1 className="text-xl sm:text-3xl md:text-5xl lg:text-6xl font-bold uppercase tracking-tight mb-1 md:mb-3">
                Royals
              </h1>
              <h2 className="text-lg sm:text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight mb-2 md:mb-4">
                Barber Shop
              </h2>
              <p className="text-[10px] sm:text-xs md:text-base uppercase tracking-wider mb-3 md:mb-6 max-w-[280px] sm:max-w-[500px]">
                10 years in Batavia, NY<br />
                Thanks for growing with us.
              </p>
              <a 
                href="https://royalsbarbershop.setmore.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-black text-white font-medium uppercase py-2 px-6 md:py-3 md:px-8 rounded text-xs sm:text-sm md:text-base border border-white/20 hover:bg-primary transition-colors duration-300 mb-4 md:mb-8"
              >
                Book Now
              </a>
            </div>
            
            {/* Contact and social links */}
            <div className="w-full max-w-md mt-2 md:mt-0">
              <div className="grid grid-cols-5 gap-0 xs:gap-1 sm:gap-2">
                {/* Address */}
                <a 
                  href="https://maps.google.com/?q=317+Ellicott+Street,+Batavia,+NY" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center"
                  aria-label="317 Ellicott St, Batavia, NY"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all">
                    <FaMapMarkerAlt size={16} className="sm:text-lg" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-center mt-1 font-medium text-white">Location</span>
                </a>
                
                {/* Phone */}
                <a 
                  href="tel:+15855366576"
                  className="flex flex-col items-center" 
                  aria-label="Call (585) 536-6576"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-white shadow-md hover:shadow-lg hover:scale-105 transition-all">
                    <FaPhone size={16} className="sm:text-lg" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-center mt-1 font-medium text-white">Call</span>
                </a>
                
                {/* Instagram */}
                <a 
                  href="https://www.instagram.com/royalsbarbershop585" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center"
                  aria-label="Instagram"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#833AB4] to-[#E1306C] text-white shadow-md hover:shadow-lg hover:scale-105 transition-all">
                    <FaInstagram size={16} className="sm:text-lg" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-center mt-1 font-medium text-white">Instagram</span>
                </a>
                
                {/* Facebook */}
                <a 
                  href="https://www.facebook.com/share/19UCgP9N1f/?mibextid=wwXIfr" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex flex-col items-center"
                  aria-label="Facebook"
                >
                  <div className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-[#1877F2] to-[#0A66C2] text-white shadow-md hover:shadow-lg hover:scale-105 transition-all">
                    <FaFacebook size={16} className="sm:text-lg" />
                  </div>
                  <span className="text-[10px] sm:text-xs text-center mt-1 font-medium text-white">Facebook</span>
                </a>
                
                {/* Chat Button */}
                <div className="flex flex-col items-center">
                  <button
                    onClick={() => setIsChatOpen(true)}
                    className="w-10 h-10 sm:w-12 sm:h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 shadow-md hover:shadow-lg hover:scale-105 transition-all border-0 outline-none relative"
                    aria-label="Chat with us"
                  >
                    <div className="bg-white rounded-full w-6 h-6 sm:w-8 sm:h-8 flex items-center justify-center">
                      <FaComments size={14} className="sm:text-lg text-primary" />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3 sm:w-4 sm:h-4 flex items-center justify-center text-[8px] sm:text-[10px] font-bold text-white">1</span>
                  </button>
                  <span className="text-[10px] sm:text-xs text-center mt-1 font-medium text-white">Chat Now</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
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
      </div>
    </section>
  );
};

export default ContentfulHeroSection;