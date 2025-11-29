import Header from '@/components/Header';
import ContentfulHeroSection from '@/components/ContentfulHeroSection';
import RoyalsBodyContent from '@/components/RoyalsBodyContent';
import QuoteSection from '@/components/QuoteSection';
import BookingSection from '@/components/BookingSection';
import HaircutPreviewSection from '@/components/HaircutPreviewSection';
import LatestBlogPreview from '@/components/LatestBlogPreview';
import CommunitySection from '@/components/CommunitySection';
import ContactSection from '@/components/ContactSection';
import SocialSection from '@/components/SocialSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import SimpleImageCarousel from '@/components/SimpleImageCarousel';
import SchemaMarkup from '@/components/SchemaMarkup';
import MetaTags from '@/components/MetaTags';
import ChatBot from '@/components/ChatBot';
import WebsiteShareButton from '@/components/WebsiteShareButton';
import Leaderboard from '@/components/Leaderboard';
import { usePreloadImages } from '@/hooks/usePreloadImages';
import { useEffect } from 'react';

const Home = () => {
  // Preload critical resources for better performance
  const criticalImages = [
    '/images/Royals Text Only Logo on Dark.png',
    '/shop/IMG_0674.JPG', // First carousel image
    '/shop/IMG_0675.JPG', // Second carousel image
    '/haircuts/fades/basic-fade.jpg', // Popular haircut images
    '/haircuts/fades/low-fade.jpg',
    '/haircuts/men/buzz-cut.jpg'
  ];

  usePreloadImages(criticalImages, { priority: 'high' });

  // Preload hero video with high priority
  useEffect(() => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'video';
    link.href = '/superhero-mobile-hq.mp4';
    link.setAttribute('fetchpriority', 'high');
    document.head.appendChild(link);

    return () => {
      document.head.removeChild(link);
    };
  }, []);

  return (
    <>
      {/* SEO meta tags for home page */}
      <MetaTags
        title="Royals Barber Shop | Premium Men's Haircuts in Batavia, NY"
        description="Royals Barber Shop offers premium men's haircuts, fades, tapers, and facial hair styling in Batavia, NY. Book your appointment today!"
        imageUrl="/images/Royals Text Only Logo on Dark.png"
        type="website"
        url={window.location.origin}
      />
      
      {/* Base schema markup for the business */}
      <SchemaMarkup type="website" />
      
      <Header />
      <main>
        <ContentfulHeroSection />
        <Leaderboard />
        <section className="py-4 bg-gradient-to-b from-black/5 to-white">
          <div className="container mx-auto px-4">
            <div className="max-w-lg mx-auto">
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-100 flex flex-col h-72 sm:h-80 md:h-96">
                <div className="bg-gradient-to-r from-black to-primary text-white p-3 flex items-center justify-between">
                  <div className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-secondary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
                    <h3 className="font-bold">Royals AI Assistant</h3>
                  </div>
                  <span className="text-xs bg-red-600/80 px-2 py-1 rounded-full animate-pulse shadow-[0_0_5px_#ff0000] font-medium">Live Chat</span>
                </div>
                <ChatBot isInWelcomeSection={true} />
              </div>
            </div>
          </div>
        </section>
        <HaircutPreviewSection />
        <RoyalsBodyContent />
        <QuoteSection />
        <BookingSection />
        <LatestBlogPreview />
        <CommunitySection />
        <ContactSection />
        
        {/* Website Share Section */}
        <section className="py-8 bg-gray-50">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Share Royals Barber Shop</h2>
              <p className="text-gray-600 mb-6">Help us spread the word about our premium barber services!</p>
              <WebsiteShareButton className="justify-center" />
            </div>
          </div>
        </section>
        
        <SocialSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
};

export default Home;
