import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ContentfulHeroSection from '@/components/ContentfulHeroSection';
import BookingSection from '@/components/BookingSection';
import GallerySection from '@/components/GallerySection';
import BlogSection from '@/components/BlogSection';
import NewsletterSection from '@/components/NewsletterSection';
import Footer from '@/components/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <main className="pt-20">
        <HeroSection />
        <ContentfulHeroSection />
        <BookingSection />
        <GallerySection />
        <BlogSection />
        <NewsletterSection />
      </main>
      <Footer />
    </>
  );
};

export default Home;
