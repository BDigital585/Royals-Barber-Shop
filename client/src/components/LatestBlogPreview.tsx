import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { getBlogPosts, type BlogPost } from '../lib/contentful';
import { Skeleton } from './ui/skeleton';

const LatestBlogPreview = () => {
  // Fetch blog posts from Contentful
  const {
    data: blogPosts,
    isLoading,
    isError
  } = useQuery({
    queryKey: ['/api/contentful/blog'],
    queryFn: getBlogPosts
  });

  // Get only the most recent blog post
  const latestPost = blogPosts && blogPosts.length > 0 ? blogPosts[0] : null;

  // Simple function to extract text from the first paragraph
  const getFirstParagraphText = (content: any) => {
    try {
      if (!content || !content.content) return null;
      
      // Find the first paragraph
      const paragraph = content.content.find(
        (node: any) => node.nodeType === 'paragraph'
      );
      
      if (paragraph && paragraph.content && paragraph.content[0]) {
        return paragraph.content[0].value || '';
      }
      
      return null;
    } catch (error) {
      console.error('Error parsing blog content:', error);
      return null;
    }
  };

  if (isLoading) {
    return (
      <div className="latest-blog-preview py-6 px-4">
        <div className="container mx-auto max-w-3xl">
          <Skeleton className="h-8 w-3/4 mb-4" />
          <Skeleton className="h-20 w-full mb-4" />
          <Skeleton className="h-8 w-1/3" />
        </div>
      </div>
    );
  }

  if (isError || !latestPost) {
    return null; // Don't show anything if there's an error or no posts
  }

  // Get text content
  let displayText = 'Check out our latest blog post!';
  
  if (latestPost.excerpt && latestPost.excerpt.trim() !== '') {
    displayText = latestPost.excerpt;
  } else if (latestPost.content) {
    const paragraphText = getFirstParagraphText(latestPost.content);
    if (paragraphText) {
      displayText = paragraphText;
    }
  }

  // Format the date nicely
  const formattedDate = new Date(latestPost.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <section className="latest-blog-preview py-8 px-4 bg-white text-black">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center mb-6">
          <div className="h-[3px] w-12 bg-secondary mr-4"></div>
          <h2 className="text-xl md:text-2xl font-heading font-bold uppercase tracking-wide">Latest From Our Blog</h2>
          <div className="h-[3px] flex-grow bg-gradient-to-r from-secondary to-transparent ml-4"></div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 bg-gradient-to-br from-white to-gray-50 rounded-lg shadow-md overflow-hidden border border-gray-100">
          {latestPost.featuredImage && (
            <div className="flex-shrink-0 sm:w-1/3 relative">
              <div className="absolute top-0 left-0 w-full h-full bg-black/10 z-10"></div>
              <div className="absolute top-0 left-0 w-2 h-full bg-secondary z-20"></div>
              <img 
                src={latestPost.featuredImage} 
                alt={latestPost.title} 
                className="w-full h-48 sm:h-full object-cover"
              />
            </div>
          )}
          <div className="flex-grow p-5">
            <div className="flex justify-between items-start mb-2">
              <span className="text-xs font-semibold text-secondary uppercase tracking-wider px-2 py-1 bg-black/5 rounded">Latest Article</span>
              <p className="text-sm text-gray-500">{formattedDate}</p>
            </div>
            <h3 className="text-lg md:text-xl font-bold mb-2">{latestPost.title}</h3>
            <p className="text-sm md:text-base mb-4 line-clamp-3 text-gray-700">
              {displayText}
            </p>
            <div className="flex justify-between items-center mt-4">
              <Link 
                href={`/blog/${latestPost.slug}`} 
                className="flex items-center justify-center gap-2 text-white bg-primary hover:bg-black/80 font-medium px-5 py-2.5 rounded-md transition-all duration-300 shadow-sm hover:shadow"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                Read Full Article
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Link>
              <Link 
                href="/blog" 
                className="text-sm text-secondary hover:text-black font-medium transition-colors"
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
                View All Posts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPreview;