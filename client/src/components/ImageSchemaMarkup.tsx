import React from 'react';

interface ImageSchemaMarkupProps {
  imageUrl: string;
  description: string;
}

/**
 * Component to add Schema.org ImageObject markup for individual haircut images
 * This improves image SEO and indexing in search engines
 */
const ImageSchemaMarkup: React.FC<ImageSchemaMarkupProps> = ({ imageUrl, description }) => {
  // Create a full URL for the image, assuming domain is royalsbatavia.com
  const fullImageUrl = imageUrl.startsWith('http') 
    ? imageUrl 
    : `https://www.royalsbatavia.com${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
  
  // Create the schema object
  const imageSchema = {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": fullImageUrl,
    "description": description,
    "author": {
      "@type": "Organization",
      "name": "Royals Barbershop"
    },
    "copyrightHolder": {
      "@type": "Organization",
      "name": "Royals Barbershop"
    }
  };
  
  // Convert to JSON string with proper formatting
  const schemaString = JSON.stringify(imageSchema, null, 2);
  
  return (
    <script 
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: schemaString }}
    />
  );
};

export default ImageSchemaMarkup;