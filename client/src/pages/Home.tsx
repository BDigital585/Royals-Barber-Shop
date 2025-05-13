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
