import { useEffect, useState } from 'react';
import { SiteHero, getHeroContent } from '@/lib/contentful';

const ContentfulHeroSection = () => {
  const [heroContent, setHeroContent] = useState<SiteHero | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
    return null; // Don't show anything if there's an error or no content
  }

  const hasVideo = heroContent.videoUrl && heroContent.videoUrl.trim() !== '';
  const hasImage = heroContent.backgroundImage && heroContent.backgroundImage.fields && 
                 heroContent.backgroundImage.fields.file && heroContent.backgroundImage.fields.file.url;
  
  // If neither video nor image is available, don't display the section
  if (!hasVideo && !hasImage) {
    return null;
  }

  const backgroundStyle = hasImage 
    ? { backgroundImage: `url(https:${heroContent.backgroundImage?.fields.file.url})` } 
    : {};

  return (
    <section className="relative bg-white py-8">
      <div 
        className={`relative h-[40vh] overflow-hidden ${hasVideo ? '' : 'bg-cover bg-center'}`} 
        style={hasVideo ? {} : backgroundStyle}
      >
        {hasVideo && (
          <video 
            className="absolute inset-0 w-full h-full object-cover"
            autoPlay 
            loop 
            muted 
            playsInline
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