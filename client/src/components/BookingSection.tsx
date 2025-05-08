const BookingSection = () => {
  return (
    <section id="book" className="py-8 md:py-16 px-4 bg-accent">
      <div className="container mx-auto text-center">
        <h2 className="text-2xl md:text-4xl font-heading text-primary mb-3 md:mb-6">READY FOR A FRESH LOOK?</h2>
        <p className="text-sm md:text-base text-muted-foreground max-w-2xl mx-auto mb-4 md:mb-8">Book your appointment today for the royal treatment. Walk-ins welcome based on availability.</p>
        <a 
          href="https://royalsbarbershop.setmore.com/" 
          target="_blank" 
          rel="noopener noreferrer"
          className="book-button py-2 md:py-3 px-6 md:px-8 inline-block text-sm md:text-base"
        >
          BOOK ONLINE
        </a>
        <p className="mt-3 md:mt-6 text-xs md:text-sm text-muted-foreground">
          Or call us at <a href="tel:+15855366576" className="text-secondary font-medium hover:underline">(585) 536-6576</a>
        </p>
      </div>
    </section>
  );
};

export default BookingSection;
