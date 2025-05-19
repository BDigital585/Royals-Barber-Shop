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
    <section className="latest-blog-preview py-6 px-4 bg-white text-black">
      <div className="container mx-auto max-w-3xl">
        <h2 className="text-xl md:text-2xl font-heading mb-2 pb-2">Latest From Our Blog</h2>
        <div className="my-3 flex flex-row gap-3">
          {latestPost.featuredImage && (
            <div className="flex-shrink-0">
              <img 
                src={latestPost.featuredImage} 
                alt={latestPost.title} 
                className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-md shadow-sm"
              />
            </div>
          )}
          <div className="flex-grow">
            <h3 className="text-lg md:text-xl font-semibold">{latestPost.title}</h3>
            <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
            <p className="text-xs sm:text-sm md:text-base mb-2 md:mb-3 line-clamp-3">
              {displayText}
            </p>
            <Link 
              href={`/blog/${latestPost.slug}`} 
              className="inline-flex items-center text-blue-700 hover:text-red-600 font-semibold transition-colors"
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            >
              Read more
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPreview;