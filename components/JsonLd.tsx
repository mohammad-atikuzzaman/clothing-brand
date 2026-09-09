import React from "react";

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Izhaan Lifestyle",
    url: "https://izhaanlifestyle.com",
    logo: "https://izhaanlifestyle.com/favicon.png",
    description:
      "Izhaan Lifestyle - Luxury Menswear and Designer Panjabis in Bangladesh.",
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+880 1888-299388",
      contactType: "Customer Support",
      areaServed: "BD",
      availableLanguage: ["Bengali", "English"],
    },
    sameAs: [
      "https://facebook.com/izhaanlifestyle",
      "https://instagram.com/izhaanlifestyle",
    ],
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Izhaan Lifestyle",
    url: "https://izhaanlifestyle.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://izhaanlifestyle.com/shop?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface ProductJsonLdProps {
  name: string;
  description: string;
  image: string;
  sku: string;
  price: number;
  regularPrice?: number;
  inStock: boolean;
  slug: string;
  rating?: number;
  reviewsCount?: number;
}

export function ProductJsonLd({
  name,
  description,
  image,
  sku,
  price,
  inStock,
  slug,
  rating = 5,
  reviewsCount = 0,
}: ProductJsonLdProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description: description || `${name} - Crafted with premium combed cotton by Izhaan Lifestyle.`,
    image: [image],
    sku: sku || slug,
    brand: {
      "@type": "Brand",
      name: "Izhaan Lifestyle",
    },
    offers: {
      "@type": "Offer",
      url: `https://izhaanlifestyle.com/product/${slug}`,
      priceCurrency: "BDT",
      price: price,
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Izhaan Lifestyle",
      },
    },
    ...(reviewsCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: rating,
            reviewCount: reviewsCount,
          },
        }
      : {}),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: item.href.startsWith("http")
        ? item.href
        : `https://izhaanlifestyle.com${item.href}`,
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
