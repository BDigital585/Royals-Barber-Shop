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
        <Link href="/" onClick={onClose} className="text-white text-xl font-medium hover:text-secondary text-center">
          Home
        </Link>
        <Link href="/#book" onClick={onClose} className="text-white text-xl font-medium hover:text-secondary text-center">
          Book Now
        </Link>
        
        {/* Hair Gallery with categories */}
        <div className="flex flex-col items-center space-y-3">
          <Link href="/#gallery" onClick={onClose} className="text-white text-xl font-medium hover:text-secondary text-center">
            Hair Gallery
          </Link>
          <div className="flex flex-col space-y-2 items-center">
            <Link href="/#gallery?category=fades" onClick={onClose} className="text-white text-lg font-medium hover:text-secondary text-center">
              - Fades
            </Link>
            <Link href="/#gallery?category=beards" onClick={onClose} className="text-white text-lg font-medium hover:text-secondary text-center">
              - Beards
            </Link>
            <Link href="/#gallery?category=kids" onClick={onClose} className="text-white text-lg font-medium hover:text-secondary text-center">
              - Kids
            </Link>
          </div>
        </div>
        
        <Link href="/#blog" onClick={onClose} className="text-white text-xl font-medium hover:text-secondary text-center">
          Blog
        </Link>
        <Link href="/#newsletter" onClick={onClose} className="text-white text-xl font-medium hover:text-secondary text-center">
          Newsletter
        </Link>
        <Link href="/contact" onClick={onClose} className="text-white text-xl font-medium hover:text-secondary text-center">
          Contact
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu;
