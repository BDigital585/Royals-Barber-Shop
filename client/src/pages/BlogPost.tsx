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
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import Layout from '../components/Layout';

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
    
  // Rich text rendering options for Contentful
  const renderOptions = {
    renderMark: {
      [MARKS.BOLD]: (text: React.ReactNode) => <strong className="font-bold">{text}</strong>,
      [MARKS.ITALIC]: (text: React.ReactNode) => <em className="italic">{text}</em>,
      [MARKS.UNDERLINE]: (text: React.ReactNode) => <span className="underline">{text}</span>,
      [MARKS.CODE]: (text: React.ReactNode) => <code className="bg-gray-100 p-1 rounded font-mono text-sm">{text}</code>,
    },
    renderNode: {
      [BLOCKS.PARAGRAPH]: (node: any, children: React.ReactNode) => <p className="text-gray-700 leading-relaxed mb-4">{children}</p>,
      [BLOCKS.HEADING_1]: (node: any, children: React.ReactNode) => <h1 className="text-3xl font-bold mt-8 mb-4">{children}</h1>,
      [BLOCKS.HEADING_2]: (node: any, children: React.ReactNode) => <h2 className="text-2xl font-bold mt-6 mb-3">{children}</h2>,
      [BLOCKS.HEADING_3]: (node: any, children: React.ReactNode) => <h3 className="text-xl font-bold mt-5 mb-2">{children}</h3>,
      [BLOCKS.HEADING_4]: (node: any, children: React.ReactNode) => <h4 className="text-lg font-bold mt-4 mb-2">{children}</h4>,
      [BLOCKS.HEADING_5]: (node: any, children: React.ReactNode) => <h5 className="text-base font-bold mt-3 mb-1">{children}</h5>,
      [BLOCKS.HEADING_6]: (node: any, children: React.ReactNode) => <h6 className="text-sm font-bold mt-3 mb-1">{children}</h6>,
      [BLOCKS.UL_LIST]: (node: any, children: React.ReactNode) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
      [BLOCKS.OL_LIST]: (node: any, children: React.ReactNode) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
      [BLOCKS.LIST_ITEM]: (node: any, children: React.ReactNode) => <li className="mb-1">{children}</li>,
      [BLOCKS.QUOTE]: (node: any, children: React.ReactNode) => (
        <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4">{children}</blockquote>
      ),
      [BLOCKS.HR]: () => <hr className="my-6 border-t border-gray-300" />,
      [BLOCKS.EMBEDDED_ASSET]: (node: any) => {
        const { title, description, file } = node.data.target.fields;
        const imageUrl = file?.url || '';
        return (
          <figure className="my-6">
            <img 
              src={imageUrl.startsWith('//') ? `https:${imageUrl}` : imageUrl}
              alt={description || title || "Blog image"} 
              className="mx-auto rounded-md shadow-md max-w-full"
            />
            {title && <figcaption className="text-center text-sm text-gray-500 mt-2">{title}</figcaption>}
          </figure>
        );
      },
      [INLINES.HYPERLINK]: (node: any, children: React.ReactNode) => (
        <a href={node.data.uri} className="text-secondary hover:underline" target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      ),
    },
  };

  // Render rich text content from Contentful
  function renderBlogContent(content: any) {
    if (!content) return <p className="text-gray-500 italic">No content available</p>;
    try {
      return documentToReactComponents(content, renderOptions);
    } catch (error) {
      console.error("Error rendering rich text:", error);
      return <p className="text-red-500">Error rendering content</p>;
    }
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        {post && (
          <MetaTags 
            title={`${post.title} | Behind the Barber Chair - Royals Barbershop`}
            description={post.excerpt || `Dive into ${post.title} - authentic barbershop wisdom from Royals Barbershop.`}
            imageUrl={post.featuredImage}
            type="article"
          />
        )}
        <SchemaMarkup />
        
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Barber Wisdom
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
            
            <p className="text-gray-500 mb-8">
              {formattedDate}
              {post.authorName && <span> • By <span className="font-medium">{post.authorName}</span></span>}
            </p>
            
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
              {renderBlogContent(post.content)}
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
      </div>
    </Layout>
  );
}