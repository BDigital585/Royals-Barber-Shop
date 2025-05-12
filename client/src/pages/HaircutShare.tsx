import { useEffect, useState } from 'react';
import { useRoute } from 'wouter';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

// Component to display a shared haircut image
const HaircutShare = () => {
  const [_, params] = useRoute<{ folder: string; filename: string }>('/share/haircuts/:folder/:filename');
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (params) {
      try {
        // Try to load the image from the assets folder
        const folder = decodeURIComponent(params.folder);
        const filename = decodeURIComponent(params.filename);
        
        // Use the URL directly instead of dynamic import (which doesn't work in production)
        // @ts-ignore - Add vite-ignore to suppress dynamic import warnings
        setImageSrc(`/src/assets/haircuts/${folder}/${filename}`);
        setLoading(false);
      } catch (err) {
        console.error('Error processing image path:', err);
        setError('Invalid image path');
        setLoading(false);
      }
    } else {
      setError('Missing image parameters');
      setLoading(false);
    }
  }, [params]);

  return (
    <>
      <Header />
      <main className="pt-[64px] md:pt-[80px] pb-16">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-heading text-primary text-center my-8">
            {params ? `${params.folder.replace(/-/g, ' ')} - ${params.filename}` : 'Haircut Image'}
          </h1>
          
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="bg-red-50 text-red-600 p-6 rounded-lg text-center">
                <p className="text-lg font-medium">{error}</p>
                <p className="mt-4">
                  <a href="/browse-haircuts" className="text-primary hover:underline">
                    Go back to Browse Haircuts
                  </a>
                </p>
              </div>
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-lg">
                <div className="aspect-auto overflow-hidden rounded-lg">
                  <img 
                    src={imageSrc || ''} 
                    alt={params ? `${params.folder} - ${params.filename}` : 'Haircut Image'} 
                    className="w-full h-auto object-contain mx-auto"
                  />
                </div>
                
                <div className="mt-6 flex flex-col sm:flex-row sm:justify-between items-center gap-4">
                  <a 
                    href="/browse-haircuts" 
                    className="text-primary hover:underline"
                  >
                    Back to Browse Haircuts
                  </a>
                  
                  <div className="flex gap-4">
                    {/* Download button */}
                    <a 
                      href={imageSrc || '#'} 
                      download={params?.filename}
                      className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
                    >
                      Download Image
                    </a>
                    
                    {/* Share button */}
                    <button
                      onClick={() => {
                        if (navigator.share && imageSrc) {
                          navigator.share({
                            title: params ? `Royals Barbershop - ${params.folder} Haircut` : 'Royals Barbershop Haircut',
                            text: 'Check out this amazing haircut from Royals Barbershop!',
                            url: window.location.href
                          }).catch(err => console.log('Error sharing:', err));
                        } else {
                          // Fallback for browsers that don't support navigator.share
                          navigator.clipboard.writeText(window.location.href);
                          alert('Link copied to clipboard!');
                        }
                      }}
                      className="px-4 py-2 bg-gray-100 text-gray-800 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Share
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
};

export default HaircutShare;