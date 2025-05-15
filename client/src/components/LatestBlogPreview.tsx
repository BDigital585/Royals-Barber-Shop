import { useState, useEffect, useRef } from 'react';
import { Link } from 'wouter';
import { getBlogPosts, type BlogPost } from '@/lib/contentful';
import { useQuery } from '@tanstack/react-query';
import { Clock } from 'lucide-react';

const LatestBlogPreview = () => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  
  // Fetch blog posts from Contentful
  const {
    data: blogPosts,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['/api/contentful/blog'],
    queryFn: getBlogPosts
  });
  
  // Get the latest post (the first one in the array)
  const latestPost = blogPosts && blogPosts.length > 0 ? blogPosts[0] : null;
  
  // Format the date for display
  const formattedDate = latestPost ? 
    new Date(latestPost.publishedAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }) : '';
  
  // Intersection Observer for animation
  useEffect(() => {
    if (!sectionRef.current) return;
    
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1
      }
    );
    
    observer.observe(sectionRef.current);
    
    return () => {
      observer.disconnect();
    };
  }, []);
  
  // If there's an error or no posts, don't show anything
  if (isError || !latestPost) {
    return null;
  }
  
  return (
    <section 
      ref={sectionRef}
      className="py-8 md:py-12 px-4 bg-gray-50 border-t border-b border-gray-100"
    >
      <div className="container mx-auto">
        <div className={`latest-blog-preview ${isVisible ? 'animate-fadeIn' : 'opacity-0'}`}>
          <div className="section-header text-center mb-5">
            <h2 className="text-xl md:text-2xl font-heading text-primary">From the Blog</h2>
            <p className="text-sm text-muted-foreground">Latest from Behind the Barber Chair</p>
          </div>
          
          <div className="latest-blog-card max-w-3xl mx-auto bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 md:p-6 flex flex-col md:flex-row items-center md:items-start gap-4">
              {/* Thumbnail Image (left side on desktop, top on mobile) */}
              {latestPost.featuredImage && (
                <div className="w-full md:w-1/4 shrink-0">
                  <div className="aspect-square w-36 h-36 mx-auto md:mx-0 rounded-md overflow-hidden">
                    <img 
                      src={latestPost.featuredImage} 
                      alt={latestPost.title} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              )}
              
              {/* Content (right side on desktop, bottom on mobile) */}
              <div className="flex-1 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start text-xs text-gray-500 mb-1.5 gap-1">
                  <Clock size={14} />
                  <span>{formattedDate}</span>
                  {latestPost.authorName && <span> • By {latestPost.authorName}</span>}
                </div>
                
                <h3 className="text-lg md:text-xl font-medium mb-2">{latestPost.title}</h3>
                
                {latestPost.excerpt && (
                  <p className="text-gray-600 text-sm md:text-base line-clamp-2 mb-3">
                    {latestPost.excerpt}
                  </p>
                )}
                
                <Link 
                  href={`/blog/${latestPost.slug}`}
                  className="inline-flex items-center text-sm font-medium text-secondary hover:text-primary transition-colors"
                >
                  Read Full Article
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPreview;