import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import ShareButton from './ShareButton';

interface LayoutProps {
  children: ReactNode;
  title?: string;
  text?: string;
}

const Layout = ({ 
  children, 
  title = "Royals Barbershop", 
  text = "Check out Royals Barbershop in Batavia, NY!"
}: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen relative">
      <Header />
      <div className="fixed top-4 right-4 md:top-6 md:right-6 z-10">
        <ShareButton title={title} text={text} />
      </div>
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;