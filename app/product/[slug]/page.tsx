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

  return {
    title: `${product.name} - ৳${product.salePrice} | Izhaan Lifestyle`,
    description: product.description || `Buy ${product.name} crafted with ${product.fabric}. Nationwide Cash on Delivery.`,
    openGraph: {
      title: product.name,
      description: product.description,
      images: [product.image],
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

