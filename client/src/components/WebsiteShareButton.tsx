import { useState } from 'react';
import { Share2, Facebook, Twitter, Linkedin, Link2, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface WebsiteShareButtonProps {
  className?: string;
  variant?: 'default' | 'floating';
}

const WebsiteShareButton = ({ className = '', variant = 'default' }: WebsiteShareButtonProps) => {
  const [copied, setCopied] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  
  const shareData = {
    title: 'Royals Barber Shop | Premium Men\'s Haircuts in Batavia, NY',
    text: 'Check out Royals Barber Shop for premium men\'s haircuts, fades, tapers, and facial hair styling in Batavia, NY!',
    url: window.location.origin
  };

  const handleNativeShare = async () => {
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      setShowOptions(!showOptions);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareData.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log('Error copying to clipboard:', err);
    }
  };

  const encodedTitle = encodeURIComponent(shareData.title);
  const encodedUrl = encodeURIComponent(shareData.url);
  const encodedText = encodeURIComponent(shareData.text);

  if (variant === 'floating') {
    return (
      <div className={cn("fixed bottom-6 left-6 z-50", className)}>
        <div className="relative">
          <Button
            onClick={handleNativeShare}
            className="bg-secondary hover:bg-secondary/90 text-black rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
            aria-label="Share website"
          >
            <Share2 className="w-5 h-5" />
          </Button>
          
          {showOptions && (
            <div className="absolute bottom-16 left-0 bg-white rounded-lg shadow-xl border border-gray-200 p-3 min-w-[200px]">
              <p className="text-sm font-medium text-gray-700 mb-3">Share Royals Barber Shop</p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2 bg-blue-600 text-white hover:bg-blue-700 border-blue-600"
                  onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')}
                >
                  <Facebook className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2 bg-sky-500 text-white hover:bg-sky-600 border-sky-500"
                  onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank')}
                >
                  <Twitter className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2 bg-blue-700 text-white hover:bg-blue-800 border-blue-700"
                  onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank')}
                >
                  <Linkedin className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  className="p-2 bg-gray-600 text-white hover:bg-gray-700 border-gray-600"
                  onClick={handleCopyLink}
                >
                  {copied ? (
                    <span className="text-xs font-medium">✓</span>
                  ) : (
                    <Link2 className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm font-medium text-gray-600">Share our website:</span>
      
      {/* Native share button (mobile) */}
      {typeof navigator !== 'undefined' && navigator.share && typeof navigator.canShare === 'function' && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleNativeShare}
          className="flex items-center gap-2 hover:bg-gray-50"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      )}
      
      {/* Social media sharing buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="p-2 bg-blue-600 text-white hover:bg-blue-700 border-blue-600 hover:border-blue-700"
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')}
        >
          <Facebook className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="p-2 bg-sky-500 text-white hover:bg-sky-600 border-sky-500 hover:border-sky-600"
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank')}
        >
          <Twitter className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="p-2 bg-blue-700 text-white hover:bg-blue-800 border-blue-700 hover:border-blue-800"
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank')}
        >
          <Linkedin className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="p-2 bg-gray-600 text-white hover:bg-gray-700 border-gray-600 hover:border-gray-700"
          onClick={handleCopyLink}
        >
          {copied ? (
            <span className="text-white text-xs font-medium">Copied!</span>
          ) : (
            <Link2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default WebsiteShareButton;