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
    <header className={`bg-primary text-white fixed w-full z-50 ${scrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="logo">
          <Link href="/">
            <RoyalsLogo className="h-12" />
          </Link>
        </div>
        
        {/* Mobile Menu Button */}
        <div className="md:hidden">
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
          <Link href="/" className="font-medium hover:text-secondary transition-colors">
            Home
          </Link>
          <Link href="/#book" className="font-medium hover:text-secondary transition-colors">
            Book Now
          </Link>
          
          {/* Hair Gallery with dropdown */}
          <div className="relative group">
            <Link href="/#gallery" className="font-medium hover:text-secondary transition-colors">
              Hair Gallery
            </Link>
            <div className="absolute left-0 mt-2 w-48 bg-primary shadow-lg rounded-md py-2 z-50 invisible group-hover:visible transition-all duration-300 opacity-0 group-hover:opacity-100">
              <Link href="/#gallery?category=fades" className="block px-4 py-2 text-white hover:text-secondary hover:bg-gray-800">
                Fades
              </Link>
              <Link href="/#gallery?category=beards" className="block px-4 py-2 text-white hover:text-secondary hover:bg-gray-800">
                Beards
              </Link>
              <Link href="/#gallery?category=kids" className="block px-4 py-2 text-white hover:text-secondary hover:bg-gray-800">
                Kids
              </Link>
            </div>
          </div>
          
          <Link href="/#blog" className="font-medium hover:text-secondary transition-colors">
            Blog
          </Link>
          <Link href="/#newsletter" className="font-medium hover:text-secondary transition-colors">
            Newsletter
          </Link>
          <Link href="/contact" className="font-medium hover:text-secondary transition-colors">
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
