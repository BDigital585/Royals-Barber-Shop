import { Share } from 'lucide-react';
import { useState } from 'react';
import { Button } from './ui/button';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from './ui/popover';

interface ShareButtonProps {
  title?: string;
  text?: string;
  className?: string;
}

export default function ShareButton({ 
  title = "Royals Barbershop", 
  text = "Check out Royals Barbershop in Batavia, NY!",
  className = ""
}: ShareButtonProps) {
  const [copied, setCopied] = useState(false);

  const shareUrl = window.location.href;
  
  const handleShare = async () => {
    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title,
          text,
          url: shareUrl,
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    }
  };
  
  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${className}`}>
      {typeof navigator.share === 'function' ? (
        <Button 
          variant="outline" 
          size="sm" 
          className="flex items-center gap-2 bg-white hover:bg-gray-100"
          onClick={handleShare}
        >
          <Share className="h-4 w-4" />
          <span className="text-sm">Share</span>
        </Button>
      ) : (
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-2 bg-white hover:bg-gray-100"
            >
              <Share className="h-4 w-4" />
              <span className="text-sm">Share</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-2" align="end">
            <div className="grid gap-2">
              <Button
                variant="ghost" 
                size="sm"
                className="flex items-center justify-start gap-2" 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`, '_blank')}
              >
                <svg className="h-4 w-4 text-[#1877F2]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.989C18.343 21.129 22 16.99 22 12c0-5.523-4.477-10-10-10z" />
                </svg>
                <span>Facebook</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center justify-start gap-2" 
                onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(shareUrl)}`, '_blank')}
              >
                <svg className="h-4 w-4 text-[#1DA1F2]" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                </svg>
                <span>Twitter</span>
              </Button>
              <Button 
                variant="ghost" 
                size="sm"
                className="flex items-center justify-start gap-2" 
                onClick={copyToClipboard}
              >
                <svg className="h-4 w-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{copied ? "Copied!" : "Copy Link"}</span>
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  );
}