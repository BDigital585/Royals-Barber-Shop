import { useEffect, useRef, useState } from 'react';

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
    <section className="quote-section">
      <div className="container">
        <div 
          ref={quoteRef} 
          className={`quote-text ${isVisible ? 'visible' : ''}`}
        >
          More than a cut. This is barbershop game, culture, and consistency—all under one roof.
        </div>
      </div>
    </section>
  );
}