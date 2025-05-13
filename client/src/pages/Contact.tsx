import Header from '@/components/Header';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import SchemaMarkup from '@/components/SchemaMarkup';

const Contact = () => {
  return (
    <>
      {/* SEO meta tags for contact page */}
      <MetaTags
        title="Contact Us | Royals Barbershop, Batavia NY"
        description="Contact Royals Barbershop in Batavia, NY. Call (585) 536-6576 or visit us at 317 Ellicott Street for premium men's haircuts."
        type="website"
        url="https://www.royalsbatavia.com/contact"
      />
      
      {/* Schema markup for contact page with appointment action */}
      <SchemaMarkup type="appointment" />
      
      <Header />
      <main className="pt-20">
        <ContactSection />
      </main>
      <Footer />
    </>
  );
};

export default Contact;