import React from 'react';

const WelcomeSection: React.FC = () => {
  return (
    <section className="welcome-section">
      <div className="container mx-auto px-4 text-center">
        <h2 className="welcome-title">Welcome to Royals</h2>
        <p className="welcome-subtitle">
          Celebrating 10 years of barbering in Batavia, NY. Thank you for growing with us!
        </p>
      </div>
    </section>
  );
};

export default WelcomeSection;