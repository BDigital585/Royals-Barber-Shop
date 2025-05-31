import { useState, useRef, useEffect } from 'react';
import { useIntersectionObserver } from '@/hooks/useIntersectionObserver';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: string;
  onLoad?: () => void;
  onError?: () => void;
}

export default function LazyImage({
  src,
  alt,
  className = '',
  style,
  placeholder,
  onLoad,
  onError
}: LazyImageProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const { targetRef, isIntersecting } = useIntersectionObserver<HTMLDivElement>({
    threshold: 0.1,
    rootMargin: '50px',
    triggerOnce: true
  });

  const imgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (isIntersecting && !isLoaded && !isError) {
      const img = new Image();
      img.onload = () => {
        setIsLoaded(true);
        onLoad?.();
      };
      img.onerror = () => {
        setIsError(true);
        onError?.();
      };
      img.src = src;
    }
  }, [isIntersecting, src, isLoaded, isError, onLoad, onError]);

  return (
    <div 
      ref={targetRef}
      className={`lazy-image-container ${className}`}
      style={style}
    >
      {isError ? (
        <div className="flex items-center justify-center bg-gray-100 text-gray-500 text-sm">
          Failed to load image
        </div>
      ) : isLoaded ? (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          className="w-full h-full object-cover transition-opacity duration-300"
          style={{ opacity: isLoaded ? 1 : 0 }}
          decoding="async"
        />
      ) : (
        <div 
          className="bg-gray-100 animate-pulse flex items-center justify-center"
          style={{ minHeight: '200px' }}
        >
          {placeholder ? (
            <img src={placeholder} alt="Loading..." className="opacity-50" />
          ) : (
            <div className="text-gray-400 text-sm">Loading...</div>
          )}
        </div>
      )}
    </div>
  );
}