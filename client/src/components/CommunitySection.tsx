import { useEffect, useRef, useState } from 'react';

const CommunitySection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentRef = sectionRef.current;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      }
    );
    
    if (currentRef) {
      observer.observe(currentRef);
    }
    
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, []);

  return (
    <section 
      className="community-section py-12 md:py-16 px-4" 
      ref={sectionRef}
    >
      <div className="container mx-auto">
        <div className={`community-card ${isVisible ? 'visible' : ''}`}>
          <div className="community-content">
            <h2 className="text-xl md:text-2xl font-heading mb-3 md:mb-4 text-white">Community Values</h2>
            <div className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base leading-snug md:leading-relaxed">
              <p className="mb-2">Here at Royals we…</p>
              <ul className="list-none space-y-1 md:space-y-2 pl-1">
                <li className="flex items-start">
                  <span className="text-secondary mr-2 mt-1">•</span>
                  <span>Build genuine relationships</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2 mt-1">•</span>
                  <span>Grow with our clients</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2 mt-1">•</span>
                  <span>Give back to our community</span>
                </li>
                <li className="flex items-start">
                  <span className="text-secondary mr-2 mt-1">•</span>
                  <span>Create a safe, positive experience for everyone who walks in</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="community-image-container">
            <img 
              src="/kids-cuts-2025.png"
              alt="Community event with free haircuts for students" 
              className="community-image"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default CommunitySection;