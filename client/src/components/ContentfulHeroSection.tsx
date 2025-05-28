import { FaMapMarkerAlt, FaPhone, FaStar, FaStarHalfAlt, FaGoogle } from 'react-icons/fa';

export default function ContentfulHeroSection() {
  // Static content for instant loading - no API delays for mobile performance
  const title = 'Ready for a fresh look?';
  const subtitle = 'Walk-ins welcome or schedule your appointment online today.';

  // Render immediately for instant mobile video playback
  return (
    <section className="w-full h-[70vh] min-h-[480px] md:min-h-[550px] max-h-[650px] relative bg-black overflow-hidden">
      <div className="absolute inset-0 z-0">
        {/* Advanced video loading solution with progressive enhancement */}
        <div className="absolute inset-0">
          {/* Static background color shown if video fails */}
          <div className="absolute inset-0 bg-gray-900 bg-opacity-90"></div>
          
          {/* Instant autoplay hero video */}
          <video 
            id="heroVideo"
            autoPlay 
            muted 
            loop 
            playsInline
            preload="auto"
            controls={false}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ 
              objectPosition: 'center center',
              opacity: 0.7,
              zIndex: 1
            }}
            onLoadedData={(e) => {
              const video = e.target as HTMLVideoElement;
              video.play().catch(() => {});
            }}
            onCanPlay={(e) => {
              const video = e.target as HTMLVideoElement;
              video.play().catch(() => {});
            }}
          >
            <source src="/superhero-compressed.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>
        
        {/* Gradient overlay for text visibility */}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/30 to-transparent flex flex-col items-start justify-between py-8 md:py-12" style={{ zIndex: 2 }}>
          <div className="container mx-auto px-3 md:px-6 flex flex-col items-start">
            <div className="max-w-[400px] text-white text-left pl-2 sm:pl-4 md:pl-6 mb-2 md:mb-4 mt-4">
              <h1 className="text-xl sm:text-2xl md:text-4xl lg:text-5xl font-bold uppercase tracking-tight leading-tight mb-2 md:mb-3">
                {title.split(' ').slice(0, 3).join(' ')}<br />{title.split(' ').slice(3).join(' ')}
              </h1>
              <p className="text-xs sm:text-sm md:text-base uppercase tracking-wider mb-3 sm:mb-4 max-w-[240px] sm:max-w-[300px]">
                {subtitle}
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