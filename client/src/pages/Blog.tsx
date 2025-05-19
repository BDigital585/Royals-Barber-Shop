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
      <div className="container mx-auto px-4 py-6 md:py-12 mt-16 md:mt-20">
        <MetaTags 
          title="Behind the Barber Chair | Royals Barbershop" 
          description="Dive into authentic barbershop culture with unfiltered insights, style talk, and real wisdom from Royals Barbershop in Batavia, NY."
        />
        <SchemaMarkup />
        
        <section className="blog-header mb-6 md:mb-8">
          <div className="border-l-4 border-primary pl-3 md:pl-4 py-1">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading text-primary mb-2 leading-tight">
              Behind the <span className="inline-block">Barber Chair</span>
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mb-1 max-w-xl">
              Unfiltered insights and barbershop wisdom—straight from Royals.
            </p>
          </div>
        </section>
      
        {isLoading ? (
          // Loading state with skeletons
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden h-[300px] md:h-[350px]">
                <Skeleton className="h-32 md:h-48 w-full" />
                <CardHeader className="p-3 md:p-4">
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-3 w-full" />
                  <Skeleton className="h-3 w-2/3 mt-1" />
                </CardHeader>
                <CardFooter className="p-3">
                  <Skeleton className="h-8 w-24" />
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : isError ? (
          // Error state
          <div className="text-center py-8">
            <h3 className="text-xl font-semibold mb-4">Oops! Something went wrong</h3>
            <p className="text-gray-600 mb-6">We're having trouble loading the blog posts. Please try again later.</p>
            <Button onClick={() => window.location.reload()}>Refresh Page</Button>
          </div>
        ) : blogPosts && blogPosts.length > 0 ? (
          // Content when blog posts are available
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {blogPosts.map((post: BlogPost) => (
              <BlogPostCard key={post.id} post={post} />
            ))}
          </div>
        ) : (
          // Empty state when no blog posts are found
          <div className="text-center py-8">
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
    month: 'short', // Use abbreviated month format for mobile
    day: 'numeric'
  });

  return (
    <div className="blog-card border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white h-full flex flex-col">
      {post.featuredImage && (
        <div className="h-32 md:h-40 overflow-hidden relative">
          <img 
            src={post.featuredImage} 
            alt={post.title} 
            className="w-full h-full object-cover transition-transform duration-500 hover:scale-105" 
          />
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-gradient-to-t from-[#111] to-transparent"></div>
        </div>
      )}
      
      <div className="p-3 md:p-4 flex flex-col flex-grow">
        <div className="text-xs md:text-sm text-gray-500 mb-1">
          {formattedDate}
          {post.authorName && <span className="hidden md:inline"> • By {post.authorName}</span>}
        </div>
        
        <h2 className="text-base md:text-lg font-bold text-gray-900 mb-2 line-clamp-2">{post.title}</h2>
        
        {post.excerpt && (
          <p className="text-xs md:text-sm text-gray-600 line-clamp-2 md:line-clamp-3 mb-3">{post.excerpt}</p>
        )}
        
        <Link 
          href={`/blog/${post.slug}`} 
          className="mt-auto inline-flex items-center text-xs md:text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          Read More
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 md:h-4 md:w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </div>
  );
}