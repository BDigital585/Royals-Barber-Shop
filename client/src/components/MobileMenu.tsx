import { Link } from 'wouter';

// Custom Link component that ensures scroll to top
const ScrollToTopLink = ({ href, className, children, onClick }: { href: string, className?: string, children: React.ReactNode, onClick?: () => void }) => {
  const handleClick = () => {
    // Execute the onClick handler if provided
    if (onClick) onClick();
    
    // Force immediate scroll to top with no smooth behavior
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'auto'
    });
    
    // Extra scroll commands to ensure browser compatibility
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;
  };
  
  return (
    <Link href={href} onClick={handleClick} className={className}>
      {children}
    </Link>
  );
};

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <div 
      className={`fixed inset-0 z-20 bg-primary flex-col items-center pt-24 pb-8 space-y-6 overflow-y-auto ${isOpen ? 'flex' : 'hidden'}`}
    >
      <div className="flex flex-col space-y-6 w-full px-6">
        <ScrollToTopLink href="/" onClick={onClose} className="text-white text-xl font-medium nav-link text-center">
          Home
        </ScrollToTopLink>
        <a
          href="https://royalsbarbershop.setmore.com/"
          target="_blank"
          rel="noopener noreferrer"
          onClick={onClose}
          className="text-white text-xl font-medium nav-link text-center"
        >
          Book Now
        </a>
        
        <ScrollToTopLink href="/browse-haircuts" onClick={onClose} className="text-white text-xl font-medium nav-link text-center">
          Browse Haircuts
        </ScrollToTopLink>
        
        <ScrollToTopLink href="/blog" onClick={onClose} className="text-white text-xl font-medium nav-link text-center">
          Blog
        </ScrollToTopLink>
        <ScrollToTopLink href="/#newsletter" onClick={onClose} className="text-white text-xl font-medium nav-link text-center">
          Newsletter
        </ScrollToTopLink>
        <ScrollToTopLink href="/contact" onClick={onClose} className="text-white text-xl font-medium nav-link text-center">
          Contact
        </ScrollToTopLink>
      </div>
    </div>
  );
};

export default MobileMenu;
