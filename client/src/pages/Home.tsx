import Header from '@/components/Header';
import ContentfulHeroSection from '@/components/ContentfulHeroSection';
import BookingSection from '@/components/BookingSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <main>
        <ContentfulHeroSection />
        <BookingSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
};

export default Home;
