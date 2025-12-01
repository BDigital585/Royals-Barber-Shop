import { Link } from 'wouter';
import RoyalsLogo from './RoyalsLogo';

const Footer = () => {
  return (
    <footer className="bg-primary text-white py-8 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <RoyalsLogo className="h-10" />
          </div>
          <div className="text-center md:text-right">
            <p className="mb-2">&copy; {new Date().getFullYear()} Royals Barber Shop. All rights reserved.</p>
            <p className="text-sm text-gray-400 mb-2">Celebrating 10 years of exceptional service</p>
            <div className="flex justify-center md:justify-end gap-4 text-sm">
              <Link href="/privacy-policy" className="text-gray-300 hover:text-white transition-colors">
                Privacy Policy
              </Link>
              <span className="text-gray-500">|</span>
              <Link href="/terms-of-service" className="text-gray-300 hover:text-white transition-colors">
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
