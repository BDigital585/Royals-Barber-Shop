import Header from '@/components/Header';
import ContentfulHeroSection from '@/components/ContentfulHeroSection';
import BookingSection from '@/components/BookingSection';
import ContactSection from '@/components/ContactSection';
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
        <BookingSection />
        <ContactSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
};

export default Home;
