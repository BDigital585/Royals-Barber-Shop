import { useState } from 'react';

interface GalleryItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
}

const GallerySection = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  
  const galleryItems: GalleryItem[] = [
    {
      id: 1,
      title: 'Modern Fade',
      description: 'Precision fade with textured top styling',
      imageUrl: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600',
      category: 'fades'
    },
    {
      id: 2,
      title: 'Sculpted Beard',
      description: 'Precision trimmed beard with defined lines',
      imageUrl: 'https://pixabay.com/get/g81b3c4bd96a09491a63817865acf55c8dd1f1ca5f95d4b318c4709e48c8109a28394f856cc916377a2da53e110db54a2120e7e118e0aecde48a68fcca579cb02_1280.jpg',
      category: 'beards'
    },
    {
      id: 3,
      title: 'Kids Style',
      description: 'Fun and age-appropriate haircut for young clients',
      imageUrl: 'https://pixabay.com/get/gd20f0a7ddf7d6c3cc61b8cdb042f9b8e389f1b2bedd4bcba28c7e11f64367b69cebec8e6a155ee8096652268ca84cdef354a7c4b399ddbf1880359c89821a388_1280.jpg',
      category: 'kids'
    },
    {
      id: 4,
      title: 'Skin Fade',
      description: 'Clean skin fade with classic side part',
      imageUrl: 'https://pixabay.com/get/ga4dc50fc18819b3f47b8a618746f924add151511450557f011ca3371cc42d68a1c9db9668b6599175b856dfffd9cd1f78a6a2f8aef4d6504da1f17c748757e35_1280.jpg',
      category: 'fades'
    },
    {
      id: 5,
      title: 'Full Beard',
      description: 'Shaped and conditioned full beard style',
      imageUrl: 'https://images.unsplash.com/photo-1595152452543-e5fc28ebc2b8?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=600&h=600',
      category: 'beards'
    },
    {
      id: 6,
      title: 'Trendy Kids Cut',
      description: 'Modern style tailored for younger clients',
      imageUrl: 'https://pixabay.com/get/gb6db38c65baa6a7b4a31fc8b4ca43a8b09d09b677594e49d1c6dfd3c6d258f97ccbd4a5cabc38d4dfebb2e0ae5260cfbcf834cb21000be2f6daeea64fd2e1b8d_1280.jpg',
      category: 'kids'
    }
  ];

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  const filteredItems = activeFilter === 'all' 
    ? galleryItems 
    : galleryItems.filter(item => item.category === activeFilter);

  return (
    <section id="gallery" className="py-16 px-4 bg-white">
      <div className="container mx-auto">
        <h2 className="text-3xl md:text-4xl font-heading text-primary text-center mb-12">HAIR GALLERY</h2>
        
        {/* Gallery Filters */}
        <div className="flex justify-center mb-8 flex-wrap">
          <button 
            className={`gallery-filter px-4 py-2 mx-2 font-medium text-primary ${activeFilter === 'all' ? 'filter-active' : ''}`} 
            onClick={() => handleFilterChange('all')}
          >
            All Styles
          </button>
          <button 
            className={`gallery-filter px-4 py-2 mx-2 font-medium text-primary ${activeFilter === 'fades' ? 'filter-active' : ''}`}
            onClick={() => handleFilterChange('fades')}
          >
            Fades
          </button>
          <button 
            className={`gallery-filter px-4 py-2 mx-2 font-medium text-primary ${activeFilter === 'beards' ? 'filter-active' : ''}`}
            onClick={() => handleFilterChange('beards')}
          >
            Beards
          </button>
          <button 
            className={`gallery-filter px-4 py-2 mx-2 font-medium text-primary ${activeFilter === 'kids' ? 'filter-active' : ''}`}
            onClick={() => handleFilterChange('kids')}
          >
            Kids
          </button>
        </div>
        
        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div 
              key={item.id} 
              className="rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              <img 
                src={item.imageUrl} 
                alt={item.title} 
                className="w-full h-64 object-cover"
              />
              <div className="p-4 bg-white">
                <h3 className="text-lg font-heading text-primary">{item.title}</h3>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default GallerySection;
