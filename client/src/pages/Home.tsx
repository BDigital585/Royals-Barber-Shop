import Header from '@/components/Header';
import ContentfulHeroSection from '@/components/ContentfulHeroSection';
import WelcomeSection from '@/components/WelcomeSection';
import QuoteSection from '@/components/QuoteSection';
import BookingSection from '@/components/BookingSection';
import HaircutPreviewSection from '@/components/HaircutPreviewSection';
import LatestBlogPreview from '@/components/LatestBlogPreview';
import CommunitySection from '@/components/CommunitySection';
import ContactSection from '@/components/ContactSection';
import SocialSection from '@/components/SocialSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';
import SchemaMarkup from '@/components/SchemaMarkup';
import MetaTags from '@/components/MetaTags';

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
        <WelcomeSection />
        <QuoteSection />
        <HaircutPreviewSection />
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
