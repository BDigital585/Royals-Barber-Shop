import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useRoute, useLocation } from 'wouter';
import { getBlogPostBySlug } from '../lib/contentful';
import { cn } from '../lib/utils';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { ChevronLeft } from 'lucide-react';
import MetaTags from '../components/MetaTags';
import SchemaMarkup from '../components/SchemaMarkup';
import { useMobile } from '../hooks/use-mobile';

export default function BlogPost() {
  const isMobile = useMobile();
  const [, params] = useRoute('/blog/:slug');
  const [, navigate] = useLocation();
  const slug = params?.slug;
  
  // If no slug is provided, redirect to the blog listing page
  useEffect(() => {
    if (!slug) {
      navigate('/blog');
    }
  }, [slug, navigate]);
  
  // Fetch the blog post from Contentful
  const {
    data: post,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['/api/contentful/blog', slug],
    queryFn: () => getBlogPostBySlug(slug || ''),
    enabled: !!slug // Only run the query if we have a slug
  });

  if (isError) {
    console.error('Error fetching blog post:', error);
  }

  const formattedDate = post?.publishedAt 
    ? new Date(post.publishedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : '';

  return (
    <main className="container mx-auto px-4 py-12">
      {post && (
        <MetaTags 
          title={`${post.title} | Royals Barbershop Blog`}
          description={post.excerpt || `Read about ${post.title} on the Royals Barbershop Blog.`}
          imageUrl={post.featuredImage}
          type="article"
        />
      )}
      <SchemaMarkup />
      
      <div className="mb-8">
        <Link href="/blog">
          <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all">
            <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blog
          </Button>
        </Link>
      </div>
      
      {isLoading ? (
        // Loading state with skeletons
        <div className="max-w-3xl mx-auto">
          <Skeleton className="h-10 w-3/4 mb-4" />
          <Skeleton className="h-6 w-1/3 mb-8" />
          <Skeleton className="h-96 w-full mb-8" />
          <div className="space-y-4">
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-4/5" />
            <Skeleton className="h-6 w-full" />
            <Skeleton className="h-6 w-3/4" />
          </div>
        </div>
      ) : isError || !post ? (
        // Error state or post not found
        <div className="text-center py-12">
          <h3 className="text-xl font-semibold mb-4">Post Not Found</h3>
          <p className="text-gray-600 mb-6">
            Sorry, we couldn't find the blog post you're looking for.
          </p>
          <Link href="/blog">
            <Button>Return to Blog</Button>
          </Link>
        </div>
      ) : (
        // Content when blog post is available
        <article className="max-w-3xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>
          
          <p className="text-gray-500 mb-8">{formattedDate}</p>
          
          {post.featuredImage && (
            <div className="mb-8 rounded-lg overflow-hidden">
              <img 
                src={post.featuredImage} 
                alt={post.title} 
                className="w-full h-auto" 
              />
            </div>
          )}
          
          {post.excerpt && (
            <div className="text-lg font-medium mb-6 text-gray-700 italic">
              {post.excerpt}
            </div>
          )}
          
          <div className="prose prose-lg max-w-none">
            {post.content?.split('\n').map((paragraph, index) => (
              paragraph.trim() ? (
                <p key={index} className="mb-4">{paragraph}</p>
              ) : (
                <br key={index} />
              )
            ))}
          </div>
          
          <div className="mt-12 pt-6 border-t border-gray-200">
            <Link href="/blog">
              <Button variant="outline" className="hover:translate-x-1 transition-all">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blog
              </Button>
            </Link>
          </div>
        </article>
      )}
    </main>
  );
}