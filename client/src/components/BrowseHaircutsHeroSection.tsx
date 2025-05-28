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
  const { data, error } = useQuery<HeroContent>({
    queryKey: ['/api/contentful/browse-haircuts-hero'],
    queryFn: getBrowseHaircutsHeroContent
  });

  // Always show the hero image immediately - no loading state delay
  const heroContent = data || {
    title: 'Find Your Perfect Style',
    subtitle: 'Browse our gallery of premium haircuts to find the perfect look for your next visit to Royals Barber Shop.'
  };

  // Always show the image hero section immediately - no delays
  return (
    <section className="w-full h-[50vh] min-h-[300px] md:min-h-[400px] relative bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Fast-loading hero image with preload optimization */}
        <img 
          src="/images/2page.png"
          alt="Browse Haircuts"
          className="absolute object-cover w-full h-full"
          style={{ 
            objectPosition: 'center center'
          }}
          loading="eager"
          fetchpriority="high"
        />
        
        {/* Gradient overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent flex items-end pb-8 md:pb-12 lg:pb-16">
          <div className="container mx-auto px-4 md:px-6">
            <div className="max-w-md md:max-w-lg ml-2 md:ml-4 mb-2 md:mb-4">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-2 md:mb-3">
                {heroContent.title}
              </h1>
              <p className="text-white/90 text-sm md:text-base max-w-[250px] md:max-w-md">
                {heroContent.subtitle}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}