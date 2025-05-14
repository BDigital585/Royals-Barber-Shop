import { useEffect, useState, useRef } from 'react';
import { SiteHero, getHeroContent } from '@/lib/contentful';

const ContentfulHeroSection = () => {
  const [heroContent, setHeroContent] = useState<SiteHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const fetchHeroContent = async () => {
      try {
        setLoading(true);
        const content = await getHeroContent();
        if (content) {
          console.log('Contentful hero content fetched:', content);
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

  // Handle video load success
  const handleVideoLoad = () => {
    console.log('Video loaded successfully');
    setVideoError(false);
  };

  // Handle video load error
  const handleVideoError = (e: React.SyntheticEvent<HTMLVideoElement, Event>) => {
    console.error('Error loading video:', e);
    console.log('Video source URL:', heroContent?.videoUrl);
    setVideoError(true);
  };

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

  if (error || !heroContent) {
    // Return the same layout but with an error message
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

  // Check for video URL
  console.log('Content video URL:', heroContent.videoUrl);
  const hasVideo = heroContent.videoUrl && heroContent.videoUrl.trim() !== '' && !videoError;

  // Check for background image URL
  console.log('Content background image:', heroContent.backgroundImage);
  const hasImage = heroContent.backgroundImage && 
                  typeof heroContent.backgroundImage === 'string';
  
  // Prepare background style if image exists
  const backgroundStyle = hasImage 
    ? { backgroundImage: `url(${heroContent.backgroundImage})` } 
    : {};

  // If we have no media at all or if video failed to load and no image is available,
  // show a fallback with the same branding text but on a gradient background
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

  // Show the video with the main branding text overlaid
  return (
    <section id="home" className="relative bg-white pt-[48px] md:pt-16">
      <div 
        className={`relative h-[35vh] md:h-[70vh] overflow-hidden ${hasVideo ? '' : 'bg-cover bg-center'}`} 
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
            onError={handleVideoError}
            onLoadedData={handleVideoLoad}
          >
            <source src={heroContent.videoUrl} type="video/mp4" />
            <source src={heroContent.videoUrl} type="video/quicktime" />
            Your browser does not support the video tag.
          </video>
        )}
        
        {/* Simple dark overlay for video contrast without the button */}
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col justify-center items-center px-2 sm:px-4">
          {/* Removed Book Now button as requested since it's already in the header */}
        </div>
        
        {/* Stronger bottom fade gradient that transitions into the navy carousel background */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#1E293B] via-[#1E293B]/50 to-transparent"></div>
      </div>
    </section>
  );
};

export default ContentfulHeroSection;