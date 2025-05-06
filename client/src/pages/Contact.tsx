import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';

const Contact = () => {
  return (
    <>
      <Header />
      <main className="pt-20">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default Contact;