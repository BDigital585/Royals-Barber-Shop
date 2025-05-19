import { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import RoyalsLogo from './RoyalsLogo';
import MobileMenu from './MobileMenu';

// Custom Link component that ensures scroll to top
const ScrollToTopLink = ({ href, className, children }: { href: string, className?: string, children: React.ReactNode }) => {
  const handleClick = () => {
    // Manually scroll to top when link is clicked (in addition to navigation)
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [location] = useLocation(); // Get current location to check if we're on homepage

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Prevent scrolling when menu is open
    if (!isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    document.body.style.overflow = 'auto';
  };

  return (
    <header className={`bg-primary text-white fixed top-0 left-0 w-full z-50 navbar-shimmer ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 py-2 flex justify-between items-center">
        <div className="logo">
          <ScrollToTopLink href="/">
            <RoyalsLogo className="flex items-center" />
          </ScrollToTopLink>
        </div>
        
        {/* Mobile Navigation and Action Buttons */}
        <div className="md:hidden flex items-center gap-4">
          {/* Mobile Quick Nav Links */}
          <div className="flex mr-2 gap-4 items-center">
            <ScrollToTopLink href="/browse-haircuts" className="mobile-nav-link">
              Browse
            </ScrollToTopLink>
          </div>
          
          {/* Mobile Book Now Link - Desktop version shown in the nav bar */}
          <a
            href="https://royalsbarbershop.setmore.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-book-btn"
          >
            Book Now
          </a>
          
          {/* Modern Mobile Menu Button */}
          <button 
            className={`hamburger z-30 ${isMenuOpen ? 'open' : ''}`}
            onClick={toggleMenu}
            aria-label="Toggle menu"
          >
            <span className="hamburger-top"></span>
            <span className="hamburger-middle"></span>
            <span className="hamburger-bottom"></span>
          </button>
        </div>
        
        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-8">
          <a 
            href="https://royalsbarbershop.setmore.com/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="font-medium nav-link"
          >
            Book Now
          </a>
          
          <ScrollToTopLink href="/browse-haircuts" className="font-medium nav-link">
            Browse Haircuts
          </ScrollToTopLink>
          
          <ScrollToTopLink href="/blog" className="font-medium nav-link">
            Blog
          </ScrollToTopLink>
          <ScrollToTopLink href="/#newsletter" className="font-medium nav-link">
            Newsletter
          </ScrollToTopLink>
          <ScrollToTopLink href="/contact" className="font-medium nav-link">
            Contact
          </ScrollToTopLink>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </header>
  );
};

export default Header;
