import React from 'react';
import { Link, useLocation } from 'wouter';
import { FaHome } from 'react-icons/fa';

const HomeLink: React.FC = () => {
  const [location] = useLocation();
  
  // Only show on non-homepage pages
  if (location === '/') return null;
  
  return (
    <div className="home-link-container">
      <div className="container mx-auto px-4">
        <Link href="/" className="home-link-below" aria-label="Go to homepage">
          <FaHome className="home-icon" />
          <span className="home-link-text">Home</span>
        </Link>
      </div>
    </div>
  );
};

export default HomeLink;