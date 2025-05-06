import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ServiceSection from '@/components/ServiceSection';
import BookingSection from '@/components/BookingSection';
import GallerySection from '@/components/GallerySection';
import BlogSection from '@/components/BlogSection';
import NewsletterSection from '@/components/NewsletterSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Home = () => {
  return (
    <>
      <Header />
      <main className="pt-20">
        <HeroSection />
        <ServiceSection />
        <BookingSection />
        <GallerySection />
        <BlogSection />
        <NewsletterSection />
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default Home;
