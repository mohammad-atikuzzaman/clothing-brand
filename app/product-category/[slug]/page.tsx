import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { ProductCard } from "@/components/ProductCard";
import { getProducts } from "@/actions/product";
import { getCategories, getCategoryBySlug } from "@/actions/category";
import { ArrowLeft } from "lucide-react";

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 120; // 2 minutes ISR cache

export async function generateStaticParams() {
  const categories = await getCategories();
  return categories.map((category) => ({
    slug: category.slug,
  }));
}

export async function generateMetadata({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) return { title: "Category Not Found | Izhaan Lifestyle" };

  const title = `${category.name} | Izhaan Lifestyle Panjabi`;
  const description =
    category.description ||
    `Explore exclusive ${category.name} premium Panjabi collection at Izhaan Lifestyle. Nationwide Cash on Delivery.`;
  const image = category.image || "/og-image.jpg";

  return {
    title,
    description,
    openGraph: {
      type: "website",
      url: `/product-category/${category.slug}`,
      siteName: "Izhaan Lifestyle",
      title,
      description,
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: `${category.name} - Izhaan Lifestyle`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const products = await getProducts({ category: category.name });

  return (
    <div className="bg-white min-h-screen">
      {/* Category Hero Banner */}
      <div className="relative bg-[#161616] text-white py-14 sm:py-20 border-b border-neutral-800 overflow-hidden">
        {category.image && (
          <div
            className="absolute inset-0 opacity-20 bg-cover bg-center"
            style={{ backgroundImage: `url(${category.image})` }}
          />
        )}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {category.tagline && (
            <span className="text-[11px] font-bold text-[#c19b65] uppercase tracking-[0.25em] block mb-2">
              {category.tagline}
            </span>
          )}
          <h1 className="text-3xl sm:text-5xl font-serif font-bold uppercase tracking-wide">
            {category.name}
          </h1>
          {category.description && (
            <p className="text-xs sm:text-sm text-neutral-300 mt-3 max-w-xl mx-auto leading-relaxed">
              {category.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/shop" },
            { label: category.name },
          ]}
        />

        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-neutral-200 pb-4 mb-8">
          <span className="text-xs text-neutral-500">
            Showing <strong className="text-neutral-900">{products.length}</strong> Panjabi styles in {category.name}
          </span>
          <Link
            href="/shop"
            className="flex items-center gap-1.5 text-xs text-neutral-600 hover:text-[#c19b65] font-semibold transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Collections</span>
          </Link>
        </div>

        {/* Products Grid */}
        {products.length === 0 ? (
          <div className="text-center py-16 bg-neutral-50 rounded-xs">
            <p className="text-xs text-neutral-500">No products available in this category yet.</p>
            <Link
              href="/shop"
              className="mt-4 inline-block bg-[#161616] text-white px-5 py-2 text-xs font-semibold uppercase tracking-wider rounded-xs"
            >
              Browse Shop
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
