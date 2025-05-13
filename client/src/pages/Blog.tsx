import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { getBlogPosts, type BlogPost } from '../lib/contentful';
import { cn } from '../lib/utils';
import { Skeleton } from '../components/ui/skeleton';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import MetaTags from '../components/MetaTags';
import SchemaMarkup from '../components/SchemaMarkup';
import { useMobile } from '../hooks/use-mobile';
import Layout from '../components/Layout';

export default function Blog() {
  const isMobile = useMobile();
  
  // Fetch blog posts from Contentful
  const {
    data: blogPosts,
    isLoading,
    isError,
    error
  } = useQuery({
    queryKey: ['/api/contentful/blog'],
    queryFn: getBlogPosts
  });

  if (isError) {
    console.error('Error fetching blog posts:', error);
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <MetaTags 
          title="Behind the Barber Chair | Royals Barbershop" 
          description="Dive into authentic barbershop culture with unfiltered insights, style talk, and real wisdom from Royals Barbershop in Batavia, NY."
        />
        <SchemaMarkup />
        
        <section className="blog-header mb-8">
          <h1 className="blog-title">Behind the Barber Chair</h1>
          <p className="blog-subtitle">
            Unfiltered insights, culture talk, and real barbershop wisdom—straight from Royals.
          </p>
        </section>
      
        {isLoading ? (
          // Loading state with skeletons
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden h-[400px]">
                <Skeleton className="h-48 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3 mt-1" />
                </CardHeader>
                <CardFooter>
                  <Skeleton className="h-10 w-32" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : isError ? (
          // Error state
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-4">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6">We're having trouble loading the blog posts. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
        ) : blogPosts && blogPosts.length > 0 ? (
          // Content when blog posts are available
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogPosts.map((post: BlogPost) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          // Empty state when no blog posts are found
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">No Blog Posts Found</h3>
            <p className="text-gray-600">
              We're working on creating great content. Check back soon!
            </p>
          </div>
        )}
      </div>
    </Layout>
  );
}

// BlogPostCard component for displaying individual blog post previews
function BlogPostCard({ post }: { post: BlogPost }) {
  const formattedDate = new Date(post.publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="blog-card">
      {post.featuredImage && (
        <div className="h-48 overflow-hidden -mx-5 -mt-5 mb-4 relative">
          <img 
            src={post.featuredImage} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          />
          <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#111] to-transparent"></div>
        </div>
      )}
      
      <div className="blog-card-date">
        {formattedDate}
        {post.authorName && <span> • By {post.authorName}</span>}
      </div>
      
      <h2>{post.title}</h2>
      
      {post.excerpt && (
        <p className="line-clamp-3">{post.excerpt}</p>
      )}
      
      <Link href={`/blog/${post.slug}`} className="blog-card-read-more">
        Read More
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </Link>
    </div>
  );
}