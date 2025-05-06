import React from 'react';
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
            <p className="text-sm text-gray-400">Celebrating 10 years of exceptional service</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
