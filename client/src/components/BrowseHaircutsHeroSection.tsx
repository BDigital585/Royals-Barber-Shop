import { useQuery } from '@tanstack/react-query';
import { getBrowseHaircutsHero } from '../lib/contentful';
import { FaStar } from 'react-icons/fa';
import { useMobile } from '../hooks/use-mobile';

export default function BrowseHaircutsHeroSection() {
  const isMobile = useMobile();
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/contentful/browse-haircuts-hero'],
    queryFn: getBrowseHaircutsHero,
    retry: false
  });

  if (isLoading) {
    return (
      <section className="w-full h-[50vh] min-h-[350px] relative bg-black flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center justify-center text-white">
          <div className="w-12 h-12 border-2 border-white rounded-full border-t-transparent animate-spin mb-4"></div>
          <p className="text-sm text-gray-300">Loading haircuts showcase...</p>
        </div>
      </section>
    );
  }

  if (error || !data) {
    console.error("Error fetching Browse Haircuts hero content:", error);
    return (
      <section className="w-full h-[50vh] min-h-[350px] relative bg-gradient-to-br from-gray-900 to-black flex items-center">
        <div className="container mx-auto px-4 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Find Your Perfect Style</h1>
          <p className="mb-6 max-w-lg">Browse our collection of premium haircuts and find inspiration for your next visit.</p>
        </div>
      </section>
    );
  }

  // Extract data from the API response
  const { title, subtitle, videoUrl, backgroundImage } = data;

  return (
    <section id="browse-haircuts-hero" className="w-full h-[50vh] min-h-[350px] md:min-h-[450px] max-h-[550px] relative bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        {videoUrl && (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute object-cover w-full h-full opacity-70"
            onLoadedData={() => console.log("Haircuts hero video loaded successfully")}
            preload="auto"
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        
        {/* Fallback background image if video is not available */}
        {!videoUrl && backgroundImage && (
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-70" 
            style={{ backgroundImage: `url(${backgroundImage})` }}
          />
        )}
        
        {/* Gradient overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent flex flex-col items-start justify-between py-8 md:py-12">
          <div className="container mx-auto px-3 md:px-6 flex flex-col items-start">
            <div className="max-w-[450px] text-white text-left pl-2 sm:pl-4 md:pl-6 mb-2 md:mb-4 mt-4">
              <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight mb-2 md:mb-3">
                {title || "Find Your Perfect Style"}
              </h1>
              <p className="text-xs sm:text-sm md:text-base tracking-wider mb-3 sm:mb-4 max-w-[240px] sm:max-w-[300px]">
                {subtitle || "Browse premium haircuts and find the perfect look for your next visit"}
              </p>
              
              {/* Reviews stars */}
              <div className="flex items-center mt-2 mb-4">
                <div className="flex items-center text-yellow-400">
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                  <FaStar />
                </div>
                <span className="ml-2 text-xs sm:text-sm text-white/90">5.0 from 100+ reviews</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}