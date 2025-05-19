import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { getBlogPosts, type BlogPost } from '../lib/contentful';
import { Skeleton } from './ui/skeleton';
import { DocumentToReactComponents } from '@contentful/rich-text-react-renderer'; 
import { BLOCKS } from '@contentful/rich-text-types';

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

  // Get the first paragraph of content
  const getFirstParagraph = (content: any) => {
    if (!content) return null;

    // Find the first paragraph node
    const firstParagraph = content.content?.find(
      (node: any) => node.nodeType === BLOCKS.PARAGRAPH
    );

    if (firstParagraph) {
      // Process the paragraph using DocumentToReactComponents
      return DocumentToReactComponents({ 
        nodeType: 'document',
        data: {},
        content: [firstParagraph]
      });
    }

    return null;
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

  // Get first paragraph or use excerpt as fallback
  const firstParagraph = latestPost.content ? getFirstParagraph(latestPost.content) : null;
  const displayText = firstParagraph || (latestPost.excerpt ? <p>{latestPost.excerpt}</p> : <p>Check out our latest blog post!</p>);

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
        <div className="my-3">
          <h3 className="text-lg md:text-xl font-semibold">{latestPost.title}</h3>
          <p className="text-sm text-gray-500 mb-2">{formattedDate}</p>
          <div className="text-base mb-3">
            {displayText}
          </div>
          <Link href={`/blog/${latestPost.slug}`} className="inline-flex items-center text-blue-700 hover:text-red-600 font-semibold transition-colors">
            Read more
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default LatestBlogPreview;