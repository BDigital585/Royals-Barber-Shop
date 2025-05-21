import { useQuery } from '@tanstack/react-query';
import { FaMapMarkerAlt, FaPhone, FaStar, FaStarHalfAlt, FaGoogle } from 'react-icons/fa';

export default function ContentfulHeroSection() {
  const { data, isLoading, error } = useQuery({
    queryKey: ['/api/contentful/hero'],
    retry: false
  });

  if (isLoading) {
    return (
      <section className="w-full h-screen relative bg-black flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center justify-center text-white">
          <div className="w-12 h-12 border-2 border-white rounded-full border-t-transparent animate-spin mb-4"></div>
          <p className="text-sm text-gray-300">Loading hero content...</p>
        </div>
      </section>
    );
  }

  if (error || !data) {
    console.error("Error fetching hero content:", error);
    return (
      <section className="w-full h-[70vh] relative bg-gradient-to-br from-gray-900 to-black flex items-center">
        <div className="container mx-auto px-4 text-white">
          <h1 className="text-3xl md:text-5xl font-bold mb-4">Ready for a fresh look?</h1>
          <p className="mb-6 max-w-lg">Walk-ins welcome or schedule your appointment online today.</p>
          <a 
            href="https://royalsbarbershop.setmore.com/" 
            target="_blank"
            rel="noopener noreferrer"
            className="bg-primary hover:bg-primary/90 text-white px-6 py-3 rounded-md font-medium"
          >
            Book Now
          </a>
        </div>
      </section>
    );
  }

  // Extract data from the API response
  const { title, subtitle, videoUrl, backgroundImage } = data;

  return (
    <section className="w-full h-[70vh] min-h-[480px] md:min-h-[550px] max-h-[650px] relative bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        {videoUrl && (
          <video 
            autoPlay 
            loop 
            muted 
            playsInline 
            className="absolute object-cover w-full h-full opacity-70"
            onLoadedData={() => console.log("Video loaded successfully")}
            onCanPlay={() => console.log("Video can play now")}
          >
            <source src={videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}
        
        {/* Gradient overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent flex flex-col items-start justify-between py-8 md:py-12">
          <div className="container mx-auto px-3 md:px-6 flex flex-col items-start">
            <div className="max-w-[400px] text-white text-left pl-2 sm:pl-4 md:pl-6 mb-2 md:mb-4 mt-4">
              <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-tight mb-2 md:mb-3">
                Ready for a<br />fresh look?
              </h1>
              <p className="text-xs sm:text-sm md:text-base uppercase tracking-wider mb-3 sm:mb-4 max-w-[240px] sm:max-w-[300px]">
                walk-ins welcome or<br />schedule online today
              </p>
              <a 
                href="https://royalsbarbershop.setmore.com/" 
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block bg-gradient-to-r from-primary to-blue-700 text-white font-medium uppercase py-2 px-6 md:py-3 md:px-8 rounded-md text-xs sm:text-sm md:text-base shadow-md hover:shadow-lg hover:brightness-105 transition-all duration-300"
              >
                Book Now
              </a>
            </div>
          </div>
          
          {/* Contact buttons at the very bottom of hero */}
          <div className="container mx-auto px-3 md:px-6 w-full mt-auto absolute bottom-0 left-0 right-0 pb-3">
            <div className="flex justify-center space-x-8">
              {/* Location */}
              <a 
                href="https://maps.google.com/?q=317+Ellicott+Street,+Batavia,+NY"
                target="_blank"
                rel="noopener noreferrer"
                className="flex flex-col items-center"
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-white shadow-md">
                    <FaMapMarkerAlt size={20} />
                  </div>
                </div>
                <div className="text-white text-center mt-2">
                  <span className="text-xs sm:text-sm font-semibold">Address</span>
                </div>
              </a>
              
              {/* Phone */}
              <a 
                href="tel:+15855366576"
                className="flex flex-col items-center" 
              >
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-br from-primary to-blue-700 text-white shadow-md">
                    <FaPhone size={20} />
                  </div>
                </div>
                <div className="text-white text-center mt-2">
                  <span className="text-xs sm:text-sm font-semibold">Call Now</span>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}