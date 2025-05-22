import { useQuery } from '@tanstack/react-query';
import { getBrowseHaircutsHeroContent, type SiteHero } from '../lib/contentful';

// Define the expected shape of our hero content data
interface HeroContent {
  title: string;
  subtitle: string;
  videoUrl: string;
  backgroundImage: string | null;
}

export default function BrowseHaircutsHeroSection() {
  const { data, isLoading, error } = useQuery<HeroContent>({
    queryKey: ['/api/contentful/browse-haircuts-hero'],
    queryFn: getBrowseHaircutsHeroContent
  });

  if (isLoading) {
    return (
      <section className="w-full h-[40vh] min-h-[250px] md:min-h-[300px] relative bg-gray-900 flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center justify-center text-white">
          <div className="w-12 h-12 border-2 border-white rounded-full border-t-transparent animate-spin mb-4"></div>
          <p className="text-sm text-gray-300">Loading hero content...</p>
        </div>
      </section>
    );
  }

  if (error || !data) {
    console.error("Error fetching Browse Haircuts hero content:", error);
    // Fallback to a simple header if content can't be loaded
    return (
      <section className="w-full relative bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto px-4 py-16 text-white">
          <div className="border-l-4 border-primary pl-3 md:pl-4 py-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-primary mb-2 leading-tight">
              Find Your Perfect <span className="inline-block">Style</span>
            </h1>
            <p className="text-gray-300 text-sm sm:text-base mb-1 max-w-xl">
              Browse our gallery of premium haircuts to find the perfect look for your next visit to Royals Barber Shop.
            </p>
          </div>
        </div>
      </section>
    );
  }

  // Extract data from the API response
  const { title, subtitle, videoUrl, backgroundImage } = data;

  // If we have a video, show a video background
  if (videoUrl) {
    return (
      <section className="w-full h-[50vh] min-h-[300px] md:min-h-[400px] relative bg-black overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute object-cover w-full h-full opacity-80"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          
          {/* Gradient overlay for text visibility */}
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent flex items-center">
            <div className="container mx-auto px-6 py-12">
              <div className="max-w-xl">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                  {title || 'Find Your Perfect Style'}
                </h1>
                <p className="text-white/90 text-base md:text-lg lg:text-xl max-w-lg">
                  {subtitle || 'Browse our gallery of premium haircuts to find the perfect look for your next visit to Royals Barber Shop.'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  } 
  // If there's a background image, use that
  else if (backgroundImage) {
    return (
      <section 
        className="w-full h-[50vh] min-h-[300px] md:min-h-[400px] relative bg-black bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/50 flex items-center">
          <div className="container mx-auto px-6 py-12">
            <div className="max-w-xl">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
                {title || 'Find Your Perfect Style'}
              </h1>
              <p className="text-white/90 text-base md:text-lg lg:text-xl max-w-lg">
                {subtitle || 'Browse our gallery of premium haircuts to find the perfect look for your next visit to Royals Barber Shop.'}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }
  // Simple styled section as fallback
  else {
    return (
      <section className="w-full relative bg-gradient-to-br from-gray-900 to-black">
        <div className="container mx-auto px-4 py-16 text-white">
          <div className="border-l-4 border-primary pl-3 md:pl-4 py-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-primary mb-2 leading-tight">
              {title || 'Find Your Perfect Style'}
            </h1>
            <p className="text-gray-300 text-sm sm:text-base mb-1 max-w-xl">
              {subtitle || 'Browse our gallery of premium haircuts to find the perfect look for your next visit to Royals Barber Shop.'}
            </p>
          </div>
        </div>
      </section>
    );
  }
}