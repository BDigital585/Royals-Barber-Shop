import { ReactNode } from 'react';
import Header from './Header';
import Footer from './Footer';
import HomeLink from './HomeLink';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      {/* HomeLink appears below header in the white section */}
      <HomeLink />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;