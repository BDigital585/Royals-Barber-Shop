import { Link } from 'wouter';

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
        <Link href="/" onClick={onClose} className="text-white text-xl font-medium nav-link text-center">
          Home
        </Link>
        <Link href="/#book" onClick={onClose} className="text-white text-xl font-medium nav-link text-center">
          Book Now
        </Link>
        
        <Link href="/#gallery" onClick={onClose} className="text-white text-xl font-medium nav-link text-center">
          Hair Gallery
        </Link>
        
        <Link href="/#blog" onClick={onClose} className="text-white text-xl font-medium nav-link text-center">
          Blog
        </Link>
        <Link href="/#newsletter" onClick={onClose} className="text-white text-xl font-medium nav-link text-center">
          Newsletter
        </Link>
        <Link href="/contact" onClick={onClose} className="text-white text-xl font-medium nav-link text-center">
          Contact
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu;
