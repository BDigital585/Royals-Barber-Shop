import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link, useRoute, useLocation } from 'wouter';
import { getBlogPostBySlug } from '../lib/contentful';
import { cn } from '../lib/utils';
import { Skeleton } from '../components/ui/skeleton';
import { Button } from '../components/ui/button';
import { ChevronLeft, Share2, Facebook, Twitter, Linkedin, Link2, Copy } from 'lucide-react';
import MetaTags from '../components/MetaTags';
import SchemaMarkup from '../components/SchemaMarkup';
import { useMobile } from '../hooks/use-mobile';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';
import { BLOCKS, INLINES, MARKS } from '@contentful/rich-text-types';
import Layout from '../components/Layout';

// Share Button Component
function ShareButtons({ title, url, excerpt, className = "" }: { 
  title: string; 
  url: string; 
  excerpt?: string; 
  className?: string; 
}) {
  const [copied, setCopied] = useState(false);
  
  const shareData = {
    title: title,
    text: excerpt || `Check out this article from Royals Barber Shop: ${title}`,
    url: url
  };

  const handleShare = async () => {
    if (navigator.share && navigator.canShare?.(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback to copying URL
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.log('Error copying to clipboard:', err);
    }
  };

  const encodedTitle = encodeURIComponent(title);
  const encodedUrl = encodeURIComponent(url);
  const encodedText = encodeURIComponent(excerpt || `Check out this article from Royals Barber Shop: ${title}`);

  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="text-sm font-medium text-gray-600">Share:</span>
      
      {/* Native share button (mobile) */}
      {typeof navigator !== 'undefined' && navigator.share && (
        <Button
          variant="outline"
          size="sm"
          onClick={handleShare}
          className="flex items-center gap-2 hover:bg-gray-50"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </Button>
      )}
      
      {/* Social media sharing buttons */}
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          className="p-2 bg-blue-600 text-white hover:bg-blue-700 border-blue-600 hover:border-blue-700"
          onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`, '_blank')}
        >
          <Facebook className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="p-2 bg-sky-500 text-white hover:bg-sky-600 border-sky-500 hover:border-sky-600"
          onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`, '_blank')}
        >
          <Twitter className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="p-2 bg-blue-700 text-white hover:bg-blue-800 border-blue-700 hover:border-blue-800"
          onClick={() => window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`, '_blank')}
        >
          <Linkedin className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="p-2 bg-blue-600 text-white hover:bg-blue-700 border-blue-600 hover:border-blue-700"
          onClick={handleCopyLink}
        >
          {copied ? (
            <span className="text-white text-xs font-medium">Copied!</span>
          ) : (
            <Link2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
}

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
              loading="lazy"
              decoding="async"
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
            title={`${post.title} | Behind the Barber Chair - Royals Barber Shop`}
            description={post.excerpt || `Dive into ${post.title} - authentic barbershop wisdom from Royals Barber Shop.`}
            imageUrl={post.featuredImage}
            type="article"
            url={`${typeof window !== 'undefined' ? window.location.origin : ''}/blog/${post.slug}`}
          />
        )}
        <SchemaMarkup />
        
        <div className="mb-8">
          <Link href="/blog">
            <Button variant="ghost" className="mb-4 pl-0 hover:pl-2 transition-all">
              <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blogs
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
              <Button>Return to Blogs</Button>
            </Link>
          </div>
        ) : (
          // Content when blog post is available
          <article className="max-w-3xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-bold mb-3">{post.title}</h1>
            
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
              <p className="text-gray-500">
                {formattedDate}
                {post.authorName && <span> • By <span className="font-medium">{post.authorName}</span></span>}
              </p>
              
              {/* Share buttons at top */}
              <ShareButtons 
                title={post.title}
                url={`${window.location.origin}/blog/${post.slug}`}
                excerpt={post.excerpt}
                className="flex-wrap"
              />
            </div>
            
            {post.featuredImage && (
              <div className="mb-8 rounded-lg overflow-hidden">
                <img 
                  src={post.featuredImage} 
                  alt={post.title} 
                  className="w-full h-auto" 
                  loading="lazy"
                  decoding="async"
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
            
            {/* Share buttons at bottom */}
            <div className="mt-12 py-6 border-t border-gray-200">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
                <ShareButtons 
                  title={post.title}
                  url={`${window.location.origin}/blog/${post.slug}`}
                  excerpt={post.excerpt}
                  className="flex-wrap"
                />
                
                <Link href="/blog">
                  <Button className="bg-blue-600 text-white hover:bg-blue-700 hover:translate-x-1 transition-all">
                    <ChevronLeft className="mr-2 h-4 w-4" /> Back to Blogs
                  </Button>
                </Link>
              </div>
            </div>
          </article>
        )}
      </div>
    </Layout>
  );
}