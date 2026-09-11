import { getProductBySlug, getProducts } from "@/actions/product";
import { notFound } from "next/navigation";
import { ProductDetailClient } from "./ProductDetailClient";
import { ProductJsonLd, BreadcrumbJsonLd } from "@/components/JsonLd";

export const revalidate = 120; // Cache for 2 minutes + instant on-demand tag revalidation

export async function generateStaticParams() {
  const products = await getProducts({ limit: 50 });
  return products.map((p) => ({
    slug: p.slug,
  }));
}

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    return {
      title: "Product Not Found | Izhaan Lifestyle",
      description: "The requested Panjabi could not be found.",
    };
  }

  // Collect primary image and gallery images without duplicates
  const rawImages = [product.image, ...(product.galleryImages || [])].filter(
    (img): img is string => Boolean(img && img.trim())
  );
  const uniqueImages = Array.from(new Set(rawImages));

  const ogImages =
    uniqueImages.length > 0
      ? uniqueImages.map((imgUrl, index) => ({
          url: imgUrl,
          width: 800,
          height: 1067,
          alt: `${product.name} - View ${index + 1} | Izhaan Lifestyle`,
        }))
      : [
          {
            url: "/og-image.jpg",
            width: 1200,
            height: 630,
            alt: product.name,
          },
        ];

  const shareTitle = `${product.name} - ৳${Number(product.salePrice).toLocaleString("en-BD")}`;
  const shareDesc =
    product.description ||
    `Buy ${product.name} crafted with ${product.fabric || "Premium Cotton"}. Nationwide Cash on Delivery across Bangladesh. Available at Izhaan Lifestyle.`;

  return {
    title: `${shareTitle} | Izhaan Lifestyle`,
    description: shareDesc,
    openGraph: {
      type: "website",
      url: `/product/${product.slug}`,
      siteName: "Izhaan Lifestyle",
      title: `${shareTitle} | Izhaan Lifestyle`,
      description: shareDesc,
      images: ogImages,
    },
    twitter: {
      card: "summary_large_image",
      title: `${shareTitle} | Izhaan Lifestyle`,
      description: shareDesc,
      images: uniqueImages.length > 0 ? uniqueImages : ["/og-image.jpg"],
    },
  };
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);

  if (!product) {
    notFound();
  }

  // Fetch related products in the same category
  const categoryProducts = await getProducts({
    category: product.category,
    limit: 5,
  });

  const relatedProducts = categoryProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <>
      <ProductJsonLd
        name={product.name}
        description={product.description}
        image={product.image}
        sku={product.sku}
        price={product.salePrice}
        regularPrice={product.regularPrice}
        inStock={product.inStock}
        slug={product.slug}
        rating={product.rating}
        reviewsCount={product.reviewsCount}
      />
      <BreadcrumbJsonLd
        items={[
          { label: "Home", href: "/" },
          { label: "Shop", href: "/shop" },
          { label: product.category, href: `/product-category/${product.categorySlug}` },
          { label: product.name, href: `/product/${product.slug}` },
        ]}
      />
      <ProductDetailClient
        product={product}
        relatedProducts={relatedProducts}
      />
    </>
  );
}

