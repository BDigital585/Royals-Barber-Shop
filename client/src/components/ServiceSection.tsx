import { Link } from 'wouter';

const ServiceSection = () => {
  const services = [
    {
      id: 1,
      title: 'CLASSIC CUTS',
      description: 'Precision haircuts tailored to your face shape and personal style.',
      price: 'From $25',
      imageUrl: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500',
      imageAlt: 'Classic Haircut'
    },
    {
      id: 2,
      title: 'BEARD GROOMING',
      description: 'Expert beard trims and shaping for the perfect facial hair style.',
      price: 'From $15',
      imageUrl: 'https://images.unsplash.com/photo-1605497788044-5a32c7078486?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=800&h=500',
      imageAlt: 'Beard Trim'
    },
    {
      id: 3,
      title: 'KIDS CUTS',
      description: 'Gentle and patient service for our youngest clients.',
      price: 'From $20',
      imageUrl: 'https://pixabay.com/get/g351674fffbac96db93f94cd2ee8f0521c741c44c6b825a143e4552d04bfdd1752fe048511431d84249b67250901abcab7e1d8ce0df2772b403dbd0442ff09b19_1280.jpg',
      imageAlt: 'Kids Haircut'
    }
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-heading text-primary text-center mb-12">OUR SERVICES</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-lg shadow-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <img 
                src={service.imageUrl} 
                alt={service.imageAlt} 
                className="w-full h-56 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-heading text-primary mb-2">{service.title}</h3>
                <p className="text-textColor mb-4">{service.description}</p>
                <div className="flex justify-between items-center">
                  <span className="text-secondary font-medium">{service.price}</span>
                  <Link href="#book" className="text-primary font-medium hover:text-secondary transition-colors">
                    Book Now →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServiceSection;
