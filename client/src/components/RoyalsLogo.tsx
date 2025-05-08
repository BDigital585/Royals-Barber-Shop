import royalsLogo from '../assets/royals-logo.png';

interface RoyalsLogoProps {
  className?: string;
}

const RoyalsLogo: React.FC<RoyalsLogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={royalsLogo}
        alt="Royals Barber Shop" 
        className="h-8 md:h-10 max-w-none"
      />
    </div>
  );
};

export default RoyalsLogo;
