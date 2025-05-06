interface RoyalsLogoProps {
  className?: string;
}

const RoyalsLogo: React.FC<RoyalsLogoProps> = ({ className = '' }) => {
  return (
    <div className={`flex items-center ${className}`}>
      <span className="text-xl font-bold text-white">Royals Barber Shop</span>
    </div>
  );
};

export default RoyalsLogo;
