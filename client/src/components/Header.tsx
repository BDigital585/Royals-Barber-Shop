import { useState, useEffect } from 'react';
import { Link } from 'wouter';
import RoyalsLogo from './RoyalsLogo';
import MobileMenu from './MobileMenu';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
          <Link href="/">
            <RoyalsLogo className="flex items-center" />
          </Link>
        </div>
        
        {/* Mobile Action Buttons */}
        <div className="md:hidden flex items-center gap-4">
          {/* Mobile Book Now Link - Desktop version shown in the nav bar */}
          <a
            href="https://royalsbarbershop.setmore.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="mobile-book-btn"
          >
            Book
          </a>
          
          {/* Mobile Menu Button */}
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
          <Link href="/" className="font-medium nav-link">
            Home
          </Link>
          <Link href="/#book" className="font-medium nav-link">
            Book Now
          </Link>
          
          <Link href="/browse-haircuts" className="font-medium nav-link">
            Browse Haircuts
          </Link>
          
          <Link href="/blog" className="font-medium nav-link">
            Blog
          </Link>
          <Link href="/#newsletter" className="font-medium nav-link">
            Newsletter
          </Link>
          <Link href="/contact" className="font-medium nav-link">
            Contact
          </Link>
        </nav>
      </div>
      
      {/* Mobile Menu */}
      <MobileMenu isOpen={isMenuOpen} onClose={closeMenu} />
    </header>
  );
};

export default Header;
