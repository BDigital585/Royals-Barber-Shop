import { Fragment } from 'react';
import { FaInstagram, FaFacebookSquare } from 'react-icons/fa';

const ContactSection = () => {
  const businessHours = [
    { day: 'Monday', hours: 'CLOSED' },
    { day: 'Tuesday', hours: '9:00 AM - 3:00 PM' },
    { day: 'Wednesday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Thursday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Friday', hours: '9:00 AM - 5:00 PM' },
    { day: 'Saturday', hours: '9:00 AM - 2:00 PM' },
    { day: 'Sunday', hours: 'CLOSED' }
  ];

  return (
    <section id="contact" className="py-4 md:py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-xl md:text-4xl font-heading text-primary text-center mb-3 md:mb-12">CONTACT US</h2>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-12">
          <div>
            {/* More compact mobile layout */}
            <div className="grid grid-cols-2 gap-2 md:gap-6 md:block">
              <div className="mb-2 md:mb-8">
                <h3 className="text-lg md:text-2xl font-heading text-primary mb-1 md:mb-4">LOCATION</h3>
                <p className="text-muted-foreground text-xs md:text-base mb-0 md:mb-2">317 Ellicott Street</p>
                <p className="text-muted-foreground text-xs md:text-base mb-1 md:mb-4">Batavia, NY</p>
                <a 
                  href="https://maps.google.com/?q=317+Ellicott+Street,+Batavia,+NY" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-secondary text-xs md:text-base font-medium hover:underline"
                >
                  Get Directions
                </a>
              </div>
              
              <div className="mb-2 md:mb-8">
                <h3 className="text-lg md:text-2xl font-heading text-primary mb-1 md:mb-4">CONTACT</h3>
                <p className="text-muted-foreground text-xs md:text-base mb-0 md:mb-2">
                  <a href="tel:+15855366576" className="text-secondary hover:underline">(585) 536-6576</a>
                </p>
                <p className="text-muted-foreground text-xs md:text-base mb-1 md:mb-4">
                  <a href="mailto:info@royalsbarbershop.com" className="text-secondary hover:underline truncate inline-block max-w-full">info@royalsbarbershop.com</a>
                </p>
              </div>
            
              <div className="mb-2 md:mb-8 col-span-2">
                <h3 className="text-lg md:text-2xl font-heading text-primary mb-1 md:mb-4">HOURS</h3>
                <div className="grid grid-cols-2 gap-0 md:gap-2 text-xs md:text-base">
                  {businessHours.map((schedule, index) => (
                    <Fragment key={index}>
                      <div className="text-muted-foreground">{schedule.day}</div>
                      <div className="text-muted-foreground">{schedule.hours}</div>
                    </Fragment>
                  ))}
                </div>
              </div>
            </div>
          </div>
          
          <div className="h-48 md:h-96 rounded-lg overflow-hidden shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2916.954461895315!2d-78.18709708452285!3d43.0015013791437!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89d3cd11c0ad9b43%3A0xf9a7a1d72b67be29!2s317%20Ellicott%20St%2C%20Batavia%2C%20NY%2014020!5e0!3m2!1sen!2sus!4v1661287546854!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen={true} 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Royals Barbershop Location Map"
            ></iframe>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;
