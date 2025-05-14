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
            <h2 className="text-xl md:text-2xl font-heading mb-2 md:mb-3 text-white">Community Values</h2>
            <p className="text-gray-300 mb-3 md:mb-4 text-sm md:text-base leading-snug md:leading-relaxed">
              Here at Royals we build genuine relationships and love to grow with our clients! 
              We are also involved in the community and love giving back to our kids every year at the back to school event that Just Kings sponsors giving free haircuts to all students returning to school.
            </p>
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