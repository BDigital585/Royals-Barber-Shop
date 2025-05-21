import { useEffect, useState, useRef } from 'react';
import { SiteHero, getHeroContent } from '@/lib/contentful';
import { FaMapMarkerAlt, FaPhone, FaStar, FaStarHalfAlt, FaGoogle } from 'react-icons/fa';

const ContentfulHeroSection = () => {
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
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent flex flex-col items-start justify-start pt-12 md:pt-16">
          <div className="container mx-auto px-4 md:px-6 flex flex-col items-start">
            <div className="max-w-[400px] text-white text-left pl-2 sm:pl-4 md:pl-6">
              <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-tight mb-2 md:mb-3">
                Ready for a<br />fresh look?
              </h1>
              <p className="text-[10px] sm:text-xs md:text-sm uppercase tracking-wider mb-2 md:mb-4 max-w-[220px] sm:max-w-[280px]">
                walk-ins welcome or<br />schedule online today
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
            
            {/* Contact info and reviews */}
            <div className="w-full max-w-md mt-2">
              <div className="grid grid-cols-2 gap-3 sm:gap-4">
                {/* Location and Phone Combined */}
                <div className="flex items-center space-x-2 rounded-full bg-black/70 backdrop-blur-sm px-3 py-1.5 shadow-md">
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-white">
                      <FaMapMarkerAlt size={14} />
                    </div>
                  </div>
                  <div className="text-white">
                    <span className="text-[10px] sm:text-xs font-medium">317 Ellicott St, Batavia</span>
                  </div>
                </div>
                
                {/* Phone */}
                <div className="flex items-center space-x-2 rounded-full bg-black/70 backdrop-blur-sm px-3 py-1.5 shadow-md">
                  <div className="flex items-center">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-white">
                      <FaPhone size={14} />
                    </div>
                  </div>
                  <div className="text-white">
                    <span className="text-[10px] sm:text-xs font-medium">(585) 536-6576</span>
                  </div>
                </div>
                
                {/* Google Reviews */}
                <a 
                  href="https://www.google.com/search?q=royals+barbershop+batavia+ny+reviews" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="col-span-2 flex items-center space-x-2 rounded-full bg-black/70 backdrop-blur-sm px-3 py-1.5 shadow-md hover:bg-black/80 transition-all"
                  aria-label="Google Reviews"
                >
                  <div className="flex-shrink-0">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md">
                      <FaGoogle className="text-[#4285F4] text-lg" />
                    </div>
                  </div>
                  <div className="flex flex-col text-white">
                    <div className="flex items-center">
                      <span className="text-xs font-bold mr-1.5">4.9</span>
                      <div className="flex">
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <FaStar className="w-3 h-3 text-yellow-400" />
                        <FaStarHalfAlt className="w-3 h-3 text-yellow-400" />
                      </div>
                      <span className="text-[10px] text-gray-200 ml-1.5">(99 reviews)</span>
                    </div>
                  </div>
                </a>

              </div>
            </div>
          </div>
        </div>
        

      </div>
    </section>
  );
};

export default ContentfulHeroSection;