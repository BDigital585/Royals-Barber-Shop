import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';

/**
 * LED Ticker component that displays scrolling information at the bottom of the hero section
 * Shows location, current date, time, and temperature in a neon LED style display
 */
const LedTicker: React.FC = () => {
  const [currentDate, setCurrentDate] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [temperature, setTemperature] = useState('75'); // Default placeholder
  
  useEffect(() => {
    // Function to update date and time
    const updateDateTime = () => {
      const now = new Date();
      
      // Format date: May 21, 2025
      const dateOptions: Intl.DateTimeFormatOptions = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      };
      setCurrentDate(now.toLocaleDateString('en-US', dateOptions));
      
      // Format time: 2:53 PM
      const timeOptions: Intl.DateTimeFormatOptions = { 
        hour: 'numeric', 
        minute: '2-digit', 
        hour12: true 
      };
      setCurrentTime(now.toLocaleTimeString('en-US', timeOptions));
    };
    
    // Initial update
    updateDateTime();
    
    // Set interval to update every minute
    const timer = setInterval(updateDateTime, 60000);
    
    // Get weather data - would use an API in production
    // For now using placeholder data
    // Future enhancement: Implement OpenWeatherMap API 
    
    return () => clearInterval(timer);
  }, []);
  
  return (
    <div className="led-ticker-container w-full absolute bottom-0 left-0 h-16 bg-black overflow-hidden z-10">
      <div className="led-ticker-wrapper whitespace-nowrap animate-marquee relative z-10">
        <div className="led-ticker-content font-mono inline-block py-4 text-lg md:text-2xl">
          <span className="px-5 led-text">
            <FaMapMarkerAlt className="inline-block mr-2 text-blue-500" /> BATAVIA NY 
          </span>
          <span className="px-5 led-text">
            | {currentDate.toUpperCase()} 
          </span>
          <span className="px-5 led-text">
            | {currentTime.toUpperCase()} 
          </span>
          <span className="px-5 led-text">
            | {temperature}°F
          </span>
          
          {/* Duplicate content for continuous scrolling effect */}
          <span className="px-5 led-text">
            <FaMapMarkerAlt className="inline-block mr-2 text-blue-500" /> BATAVIA NY 
          </span>
          <span className="px-5 led-text">
            | {currentDate.toUpperCase()} 
          </span>
          <span className="px-5 led-text">
            | {currentTime.toUpperCase()} 
          </span>
          <span className="px-5 led-text">
            | {temperature}°F
          </span>
          
          {/* Triple duplicate for long screens */}
          <span className="px-5 led-text">
            <FaMapMarkerAlt className="inline-block mr-2 text-blue-500" /> BATAVIA NY 
          </span>
          <span className="px-5 led-text">
            | {currentDate.toUpperCase()} 
          </span>
          <span className="px-5 led-text">
            | {currentTime.toUpperCase()} 
          </span>
          <span className="px-5 led-text">
            | {temperature}°F
          </span>
        </div>
      </div>
    </div>
  );
};

export default LedTicker;