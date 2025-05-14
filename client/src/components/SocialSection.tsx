import { useEffect, useRef, useState } from 'react';
import { FaInstagram, FaFacebookF, FaGoogle } from 'react-icons/fa';

export default function SocialSection() {
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
        threshold: 0.3,
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
    <section className="social-section compact-social" ref={sectionRef}>
      <div className="container px-4 mx-auto">
        {/* Social Text */}
        <div className={`social-text ${isVisible ? 'visible' : ''}`}>
          Give us a like, a follow, or a review — it's greatly appreciated!
        </div>
        
        {/* Modern Brand-Colored Social Media Icons */}
        <div className={`social-icons-container ${isVisible ? 'visible' : ''}`}>
          <a 
            href="https://www.instagram.com/royalsbarbershop585/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon instagram-icon"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a 
            href="https://www.facebook.com/share/19UCgP9N1f/?mibextid=wwXIfr" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon facebook-icon"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a 
            href="https://g.page/royalsbarbershop" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon google-icon"
            aria-label="Google Reviews"
          >
            <FaGoogle />
          </a>
        </div>
      </div>
    </section>
  );
}