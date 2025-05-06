const BlogSection = () => {
  const blogPosts = [
    {
      id: 1,
      title: '5 TRENDING HAIRCUTS FOR 2023',
      date: 'June 15, 2023',
      excerpt: 'Discover the most popular men\'s haircut styles that are dominating this year.',
      imageUrl: 'https://pixabay.com/get/g0e68d5a6714a96e00da847cf48be40928be3df140579707557d9fca3c7a8e1fe9ae6e77e2880e1f2c6cc77d13a45a9c0f93f430306c790c44d59fe53429855a0_1280.jpg',
      imageAlt: 'Haircut Styles'
    },
    {
      id: 2,
      title: 'ULTIMATE BEARD CARE GUIDE',
      date: 'May 28, 2023',
      excerpt: 'Essential tips and products for maintaining a healthy, well-groomed beard.',
      imageUrl: 'https://pixabay.com/get/g1b52dcc17b098484c58ce40d21e5e862e474db50ed8673b0af6aee703b2c12064e11616768d2b980f7d4292b09a80d0e36f6e0a437048657b977e40bdc1b1634_1280.jpg',
      imageAlt: 'Beard Care'
    },
    {
      id: 3,
      title: '10 YEARS OF ROYALS: OUR STORY',
      date: 'April 10, 2023',
      excerpt: 'Looking back at a decade of exceptional service and community connection.',
      imageUrl: 'https://pixabay.com/get/gfd51615f49c2e9d8d3b0fd5785473d63497ab1b9026b62cd3a0e930934742a767eefe6cc0d99da7b75e9984ace3ba02b07f265fc17fcb303f6e610f23513d0e2_1280.jpg',
      imageAlt: 'Barber History'
    }
  ];

  return (
    <section id="blog" className="py-16 px-4 bg-accent">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-heading text-primary text-center mb-12">BARBER BLOG</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
              <img 
                src={post.imageUrl} 
                alt={post.imageAlt} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-heading text-primary mb-2">{post.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{post.date}</p>
                <p className="text-muted-foreground mb-4">{post.excerpt}</p>
                <a href="#" className="text-secondary font-medium hover:underline">Read More →</a>
              </div>
            </div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="#" className="bg-secondary text-white font-medium py-3 px-8 rounded hover:bg-opacity-90 transition-colors inline-block">
            VIEW ALL POSTS
          </a>
        </div>
      </div>
    </section>
  );
};

export default BlogSection;
