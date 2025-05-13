import { useEffect, useState } from 'react';
import { useLocation, useRoute } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MetaTags from '@/components/MetaTags';
import SchemaMarkup from '@/components/SchemaMarkup';
import { Button } from '@/components/ui/button';
import { FaFacebook, FaTwitter, FaEnvelope, FaInstagram, FaLink, FaArrowLeft } from 'react-icons/fa';
import { toast } from '@/hooks/use-toast';

// Valid category IDs (used for validation)
const VALID_CATEGORIES = [
  'fades',
  'kids haircuts',
  'tapers',
  'facial hair',
  'other styles'
];

// Mapping of folder IDs to human-readable names
const categoryNames: Record<string, string> = {
  'fades': 'Fades',
  'kids haircuts': 'Kids Haircuts',
  'tapers': 'Tapers',
  'facial hair': 'Facial Hair',
  'other styles': 'Other Styles'
};

const HaircutShare = () => {
  const [, setLocation] = useLocation();
  const [match, params] = useRoute('/haircut/:category/:image');
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [haircutTitle, setHaircutTitle] = useState('');
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!match || !params) {
      setLocation('/browse-haircuts');
      return;
    }

    const { category, image } = params;
    
    // Decode the URL components
    const decodedCategory = decodeURIComponent(category);
    const decodedImage = decodeURIComponent(image);
    
    // Attempt to load the image
    const fullImageUrl = `/src/assets/haircuts/${decodedCategory}/${decodedImage}`;
    setImageUrl(fullImageUrl);
    
    // Generate a title from the image filename
    const rawTitle = decodedImage.replace(/\.(jpg|jpeg|png|webp)$/i, '').replace(/-/g, ' ');
    setHaircutTitle(
      rawTitle.split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    );
    
    // Set the page title for SEO
    document.title = `${rawTitle} - Royals Barbershop`;

    setLoaded(true);
  }, [match, params, setLocation]);

  const handleShare = (platform: string) => {
    if (!imageUrl) return;
    
    const pageUrl = window.location.href;
    const pageTitle = `Check out this ${haircutTitle} at Royals Barbershop!`;
    const pageDescription = `Royals Barbershop offers premium haircuts including this ${haircutTitle}. Book your appointment today!`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle)}`;
        break;
      case 'instagram':
        // Instagram doesn't have a direct share URL, so we'll copy the link to clipboard
        navigator.clipboard.writeText(pageUrl)
          .then(() => toast({
            title: 'Link copied!',
            description: 'Paste this link in Instagram to share this haircut',
          }))
          .catch(err => console.error('Failed to copy link:', err));
        return;
      case 'email':
        shareUrl = `mailto:?subject=${encodeURIComponent(pageTitle)}&body=${encodeURIComponent(`${pageDescription}\n\n${pageUrl}`)}`;
        break;
      case 'copy':
        navigator.clipboard.writeText(pageUrl)
          .then(() => toast({
            title: 'Link copied!',
            description: 'The link has been copied to your clipboard',
          }))
          .catch(err => console.error('Failed to copy link:', err));
        return;
      default:
        return;
    }
    
    // Open the share dialog in a new window
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  /**
   * Helper function to get the display name for a category
   * Cleans and formats folder names into proper category labels
   * 
   * @param categoryId - The raw folder name or category ID
   * @returns A properly formatted category name or empty string if invalid
   */
  const getCategoryName = (categoryId: string): string => {
    // Decode URL-encoded characters
    const decodedCategory = decodeURIComponent(categoryId.trim().toLowerCase());
    
    // Check if this is a valid category we know about
    if (VALID_CATEGORIES.includes(decodedCategory)) {
      return categoryNames[decodedCategory];
    }
    
    // If it's not a valid category, log a warning and return empty string
    console.warn(`Unknown category: ${decodedCategory}`);
    return '';
  };

  if (!loaded || !imageUrl) {
    return (
      <>
        <Header />
        <main className="pt-[64px] md:pt-[80px] pb-16">
          <div className="container mx-auto px-4 text-center">
            <p className="mt-20">Loading...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Generate meta tags for social sharing with SEO optimization
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  const categoryName = params?.category ? getCategoryName(params.category) : '';
  const pageTitle = `${haircutTitle} – ${categoryName} style | Royals Barbershop`;
  const pageDescription = `Check out this ${haircutTitle} from our ${categoryName} collection at Royals Barbershop in Batavia, NY. Book your appointment today!`;

  return (
    <>
      {/* Dynamic meta tags for SEO and social sharing */}
      <MetaTags
        title={pageTitle}
        description={pageDescription}
        imageUrl={imageUrl || undefined}
        url={pageUrl}
      />
      
      {/* Add schema markup for this haircut */}
      <SchemaMarkup 
        type="haircut"
        haircutName={haircutTitle}
        haircutCategory={categoryName}
        haircutImage={imageUrl}
      />
      
      <Header />
      <main className="pt-[64px] md:pt-[80px] pb-16">
        <div className="container mx-auto px-4">
          <div className="mt-8 mb-4">
            <Button 
              variant="ghost" 
              onClick={() => setLocation('/browse-haircuts')}
              className="flex items-center gap-2"
            >
              <FaArrowLeft /> Back to Gallery
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="aspect-square rounded-lg overflow-hidden shadow-lg">
              <img 
                src={imageUrl} 
                alt={`${haircutTitle} – ${params?.category ? getCategoryName(params.category) : ''} style | Royals Barbershop, Batavia NY`}
                className="w-full h-full object-cover object-center"
                onError={() => {
                  // If the image fails to load, redirect to the gallery
                  setLocation('/browse-haircuts');
                }}
              />
            </div>
            
            <div className="flex flex-col justify-center">
              <h1 className="text-3xl md:text-4xl font-heading text-primary mb-4">{haircutTitle}</h1>
              
              {params?.category && getCategoryName(params.category) && (
                <div className="flex items-center mb-6">
                  <span className="text-gray-600">Category: </span>
                  <div className="flex items-center ml-2">
                    <span className="inline-block w-2 h-2 rounded-full bg-secondary mr-2"></span>
                    <span className="font-medium text-primary">{getCategoryName(params.category)}</span>
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <h2 className="text-xl font-medium text-primary">Share this haircut</h2>
                
                <div className="flex flex-wrap gap-3">
                  <Button 
                    onClick={() => handleShare('facebook')} 
                    className="bg-[#1877F2] hover:bg-[#166fe5] text-white"
                  >
                    <FaFacebook className="mr-2" /> Facebook
                  </Button>
                  
                  <Button 
                    onClick={() => handleShare('twitter')} 
                    className="bg-[#1DA1F2] hover:bg-[#1a94da] text-white"
                  >
                    <FaTwitter className="mr-2" /> Twitter
                  </Button>
                  
                  <Button 
                    onClick={() => handleShare('instagram')} 
                    className="bg-[#E4405F] hover:bg-[#d93651] text-white"
                  >
                    <FaInstagram className="mr-2" /> Instagram
                  </Button>
                  
                  <Button 
                    onClick={() => handleShare('email')} 
                    className="bg-gray-600 hover:bg-gray-700 text-white"
                  >
                    <FaEnvelope className="mr-2" /> Email
                  </Button>
                  
                  <Button 
                    onClick={() => handleShare('copy')} 
                    className="bg-primary hover:bg-primary/90 text-white"
                  >
                    <FaLink className="mr-2" /> Copy Link
                  </Button>
                </div>
                
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                  <p className="text-gray-700">
                    Ready to get this look? Book an appointment at Royals Barbershop today!
                  </p>
                  <Button 
                    className="mt-4 bg-primary hover:bg-white hover:text-primary border-2 border-primary transition-colors"
                    onClick={() => window.open('https://royalsbarbershop.setmore.com/', '_blank')}
                  >
                    Book Now
                  </Button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 px-4 py-5 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-sm text-center max-w-3xl mx-auto leading-relaxed">
              Disclaimer: The haircuts displayed on this page were not performed by barbers currently employed at this establishment. 
              These images are provided for promotional and educational purposes only. 
              Our licensed barbers are capable of performing most of the styles shown.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default HaircutShare;