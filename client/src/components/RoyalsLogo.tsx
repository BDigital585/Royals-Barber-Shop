interface RoyalsLogoProps {
  className?: string;
}

const RoyalsLogo: React.FC<RoyalsLogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src="/images/Royals Text Only Logo on Dark.png" 
        alt="Royals Barber Shop" 
        className="h-8 md:h-10"
      />
    </div>
  );
};

export default RoyalsLogo;
