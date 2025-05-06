import { Link } from 'wouter';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
}

const MobileMenu = ({ isOpen, onClose }: MobileMenuProps) => {
  return (
    <div 
      className={`fixed inset-0 z-20 bg-primary flex-col items-center pt-24 pb-8 space-y-6 ${isOpen ? 'flex' : 'hidden'}`}
    >
      <Link href="#home" onClick={onClose} className="text-white text-xl font-medium hover:text-secondary">
        Home
      </Link>
      <Link href="#book" onClick={onClose} className="text-white text-xl font-medium hover:text-secondary">
        Book Now
      </Link>
      <Link href="#gallery" onClick={onClose} className="text-white text-xl font-medium hover:text-secondary">
        Hair Gallery
      </Link>
      <Link href="#blog" onClick={onClose} className="text-white text-xl font-medium hover:text-secondary">
        Blog
      </Link>
      <Link href="#newsletter" onClick={onClose} className="text-white text-xl font-medium hover:text-secondary">
        Newsletter
      </Link>
      <Link href="#contact" onClick={onClose} className="text-white text-xl font-medium hover:text-secondary">
        Contact
      </Link>
    </div>
  );
};

export default MobileMenu;
