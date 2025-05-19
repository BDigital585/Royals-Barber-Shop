import React, { useEffect, useState } from 'react';
import { getRoyalsBodyContent } from '@/lib/contentful';
import { documentToReactComponents } from '@contentful/rich-text-react-renderer';

/**
 * Component to display content from the Contentful "Royals Body" model
 * Automatically fetches and renders the content
 */
const RoyalsBodyContent: React.FC = () => {
  const [content, setContent] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const data = await getRoyalsBodyContent();
        if (data && data.content) {
          setContent(data.content);
        }
      } catch (error) {
        console.error('Error fetching Royals Body content:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  if (loading) {
    return null; // Don't show anything while loading
  }

  if (!content) {
    return null; // If no content is found, don't render the section
  }

  return (
    <section className="royals-body-content py-6 px-4 bg-white">
      <div className="container mx-auto max-w-3xl">
        {documentToReactComponents(content)}
      </div>
    </section>
  );
};

export default RoyalsBodyContent;