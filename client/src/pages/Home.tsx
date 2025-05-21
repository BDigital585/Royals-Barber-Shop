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

const Home = () => {
  return (
    <>
      {/* SEO meta tags for home page */}
      <MetaTags
        title="Royals Barbershop | Premium Men's Haircuts in Batavia, NY"
        description="Royals Barbershop offers premium men's haircuts, fades, tapers, and facial hair styling in Batavia, NY. Book your appointment today!"
        imageUrl="/src/assets/haircuts/fades/low-skin-fade.png"
        type="website"
        url="https://www.royalsbatavia.com"
      />
      
      {/* Base schema markup for the business */}
      <SchemaMarkup type="website" />
      
      <Header />
      <main>
        <ContentfulHeroSection />
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
        <SocialSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
};

export default Home;
