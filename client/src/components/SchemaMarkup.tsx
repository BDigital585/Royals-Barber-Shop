import { useEffect } from 'react';

interface SchemaMarkupProps {
  type?: 'website' | 'haircut' | 'appointment';
  haircutName?: string;
  haircutCategory?: string;
  haircutImage?: string;
}

// Type definitions for schema objects
type BaseSchemaType = {
  "@context": string;
  "@type": string;
  name: string;
  image: string;
  url: string;
  telephone: string;
  address: {
    "@type": string;
    streetAddress: string;
    addressLocality: string;
    addressRegion: string;
    postalCode: string;
    addressCountry: string;
  };
  openingHours: string[];
  sameAs: string[];
  priceRange: string;
  paymentAccepted: string;
  description: string;
  [key: string]: any; // Allow additional properties for different schema types
}

/**
 * Component to dynamically add or update schema.org markup for different page types
 * Default is the base LocalBusiness schema, with optional extensions for specific pages
 */
const SchemaMarkup = ({
  type = 'website',
  haircutName,
  haircutCategory,
  haircutImage
}: SchemaMarkupProps) => {
  useEffect(() => {
    // Base LocalBusiness schema always included
    const baseSchema: BaseSchemaType = {
      "@context": "https://schema.org",
      "@type": "Barbershop",
      "name": "Royals Barber Shop",
      "image": "https://www.royalsbatavia.com/logo.png", 
      "url": "https://www.royalsbatavia.com",
      "telephone": "585-536-6576",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "317 Ellicott Street",
        "addressLocality": "Batavia",
        "addressRegion": "NY",
        "postalCode": "14020",
        "addressCountry": "US"
      },
      "openingHours": [
        "Tue 09:00-15:00",
        "Wed 09:00-17:00",
        "Thu 09:00-17:00",
        "Fri 09:00-17:00",
        "Sat 09:00-14:00"
      ],
      "sameAs": [
        "https://www.facebook.com/Royalbarber585",
        "https://www.instagram.com/royalsbarbershop585"
      ],
      "priceRange": "$$",
      "paymentAccepted": "Cash, Credit Card",
      "description": "Royals Barber Shop offers premium men's haircuts, fades, tapers, and facial hair styling in Batavia, NY. Our experienced barbers provide personalized service for all types of men's hairstyles."
    };
    
    let schema: BaseSchemaType = {...baseSchema};
    
    // Add additional schema details based on page type
    if (type === 'haircut' && haircutName && haircutImage) {
      // For haircut detail pages, add a nested 'Service' offering
      schema = {
        ...baseSchema,
        "offers": {
          "@type": "Offer",
          "name": `${haircutName} Haircut Service`,
          "description": `Professional ${haircutName} haircut service at Royals Barbershop in Batavia, NY.`,
          "category": haircutCategory || "Haircut",
          "image": haircutImage
        }
      };
    } else if (type === 'appointment') {
      // For appointment booking pages
      schema = {
        ...baseSchema,
        "potentialAction": {
          "@type": "ReserveAction",
          "target": {
            "@type": "EntryPoint",
            "urlTemplate": "https://royalsbarbershop.setmore.com/",
            "inLanguage": "en-US",
            "actionPlatform": [
              "http://schema.org/DesktopWebPlatform",
              "http://schema.org/IOSPlatform",
              "http://schema.org/AndroidPlatform"
            ]
          },
          "result": {
            "@type": "Reservation",
            "name": "Haircut Appointment Reservation"
          }
        }
      };
    }
    
    // Create or update the schema script tag
    let scriptTag = document.getElementById('schema-markup');
    
    if (!scriptTag) {
      scriptTag = document.createElement('script');
      scriptTag.id = 'schema-markup';
      scriptTag.setAttribute('type', 'application/ld+json');
      document.head.appendChild(scriptTag);
    }
    
    scriptTag.textContent = JSON.stringify(schema);
    
    // Cleanup when component unmounts
    return () => {
      const tag = document.getElementById('schema-markup');
      if (tag && tag.parentNode) {
        tag.parentNode.removeChild(tag);
      }
    };
  }, [type, haircutName, haircutCategory, haircutImage]);
  
  return null; // This component doesn't render anything
};

export default SchemaMarkup;