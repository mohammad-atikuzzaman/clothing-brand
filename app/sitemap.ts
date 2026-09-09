import type { MetadataRoute } from "next";
import { connectToDatabase } from "@/lib/db/mongoose";
import { ProductModel } from "@/lib/models/Product";
import { getCategories } from "@/actions/category";

export const revalidate = 3600; // revalidate sitemap every hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://izhaanlifestyle.com";

  // 1. Static Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/shop`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/contact-us`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${baseUrl}/payment-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${baseUrl}/dmca`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // 2. Dynamic Category Pages from Database
  const categories = await getCategories();
  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${baseUrl}/product-category/${cat.slug}`,
    lastModified: cat.updatedAt ? new Date(cat.updatedAt) : new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // 3. Product Pages from Database
  let productPages: MetadataRoute.Sitemap = [];
  try {
    await connectToDatabase();
    const products = await ProductModel.find({}, "slug updatedAt")
      .lean()
      .exec();

    productPages = products.map((p) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.updatedAt ? new Date(p.updatedAt) : new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    }));
  } catch (error) {
    console.error("Error generating product sitemap:", error);
  }

  return [...staticPages, ...categoryPages, ...productPages];
}
