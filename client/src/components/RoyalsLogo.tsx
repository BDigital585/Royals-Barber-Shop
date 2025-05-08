import royalsLogo from '../assets/new-royals-logo.png';

interface RoyalsLogoProps {
  className?: string;
}

const RoyalsLogo: React.FC<RoyalsLogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={royalsLogo}
        alt="Royals Barber Shop - 10th Anniversary" 
        className="h-10 md:h-12 max-w-none"
      />
    </div>
  );
};

export default RoyalsLogo;
