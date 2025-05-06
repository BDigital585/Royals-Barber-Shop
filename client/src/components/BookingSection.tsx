const BookingSection = () => {
  return (
    <section id="book" className="py-16 px-4 bg-accent">
      <div className="container mx-auto text-center">
        <h2 className="text-3xl md:text-4xl font-heading text-primary mb-6">READY FOR A FRESH LOOK?</h2>
        <p className="text-muted-foreground max-w-2xl mx-auto mb-8">Book your appointment today for the royal treatment. Walk-ins welcome based on availability.</p>
        <a 
          href="https://booksy.com" 
          target="_blank" 
          rel="noopener noreferrer"
          className="bg-secondary text-white font-medium py-3 px-8 rounded hover:bg-opacity-90 transition-colors inline-block"
        >
          BOOK ONLINE
        </a>
        <p className="mt-6 text-muted-foreground">
          Or call us at <a href="tel:+15855366576" className="text-secondary font-medium hover:underline">(585) 536-6576</a>
        </p>
      </div>
    </section>
  );
};

export default BookingSection;
