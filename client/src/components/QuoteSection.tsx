import { useEffect, useRef, useState } from 'react';
import { FaInstagram, FaFacebookF, FaGoogle } from 'react-icons/fa';

export default function QuoteSection() {
  const [isVisible, setIsVisible] = useState(false);
  const quoteRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const currentRef = quoteRef.current;
    
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
    <section className="tagline-section">
      <div className="container">
        {/* Social Media Icons */}
        <div className={`social-icons-container ${isVisible ? 'visible' : ''}`}>
          <a 
            href="https://www.instagram.com/royalsbarbershop585/" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="Instagram"
          >
            <FaInstagram />
          </a>
          <a 
            href="https://www.facebook.com/royalsbarbershop" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="Facebook"
          >
            <FaFacebookF />
          </a>
          <a 
            href="https://g.page/royalsbarbershop" 
            target="_blank" 
            rel="noopener noreferrer"
            className="social-icon"
            aria-label="Google"
          >
            <FaGoogle />
          </a>
        </div>
        
        <div 
          ref={quoteRef} 
          className={`tagline-text ${isVisible ? 'visible' : ''}`}
        >
          <span className="tagline-wrapper">
            Where sharp cuts meet sharper standards.
          </span>
        </div>
      </div>
    </section>
  );
}