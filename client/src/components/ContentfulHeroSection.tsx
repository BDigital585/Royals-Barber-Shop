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
      <section className="py-10 bg-white">
        <div className="container mx-auto px-4">
          <div className="h-[40vh] flex items-center justify-center">
            <div className="animate-pulse w-full max-w-2xl mx-auto text-center">
              <div className="h-8 bg-gray-200 rounded mb-4 mx-auto w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded mb-2 mx-auto w-1/2"></div>
              <div className="h-24 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !heroContent) {
    // Return null or a minimal error state
    return (
      <section className="py-6 bg-white">
        <div className="container mx-auto px-4 text-center text-gray-600">
          {error ? 'Unable to load content. Please check back later.' : ''}
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
  // show a simpler version of the section with just the text content
  if ((!hasVideo && !hasImage) || (videoError && !hasImage)) {
    return (
      <section className="relative bg-gradient-to-r from-gray-900 to-black py-12 my-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center text-center py-12">
            <h2 className="text-3xl md:text-4xl font-heading text-white mb-4">
              {heroContent.title}
            </h2>
            {heroContent.subtitle && (
              <p className="text-lg md:text-xl text-white max-w-2xl">
                {heroContent.subtitle}
              </p>
            )}
          </div>
        </div>
      </section>
    );
  }

  // Otherwise, show the rich media version
  return (
    <section className="relative bg-white py-8">
      <div 
        className={`relative h-[40vh] overflow-hidden ${hasVideo ? '' : 'bg-cover bg-center'}`} 
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
            Your browser does not support the video tag.
          </video>
        )}
        
        <div className="absolute inset-0 bg-black bg-opacity-40 flex flex-col items-center justify-center px-4">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-heading text-white mb-3">
              {heroContent.title}
            </h2>
            {heroContent.subtitle && (
              <p className="text-lg md:text-xl text-white">
                {heroContent.subtitle}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContentfulHeroSection;