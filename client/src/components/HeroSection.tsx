import { Link } from 'wouter';

const HeroSection = () => {
  return (
    <section id="home" className="relative">
      <div className="h-[70vh] bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1920&h=1080')" }}>
        <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col justify-center items-center px-4">
          <h1 className="text-4xl md:text-6xl font-heading text-white mb-4 text-center">ROYALS BARBER SHOP</h1>
          <p className="text-white text-center max-w-2xl mx-auto mb-8">Our barbers are committed to making every individual feel and look their best.</p>
          <Link href="#book" className="bg-secondary text-white font-medium py-3 px-8 rounded hover:bg-opacity-90 transition-colors">
            BOOK NOW
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
