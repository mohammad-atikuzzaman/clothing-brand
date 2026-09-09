import React from "react";
import { getProducts } from "@/actions/product";
import { getCategories } from "@/actions/category";
import { ShopClient } from "@/components/ShopClient";

export const revalidate = 60; // Incremental Static Regeneration every 60s + instant on-demand tag revalidation

export const metadata = {
  title: "Shop All Collections | Izhaan Lifestyle",
  description:
    "Explore the full collection of handcrafted premium Panjabis crafted with combed cotton, royal jacquards, and timeless embroidery. Nationwide Cash on Delivery across Bangladesh.",
};

export default async function ShopPage() {
  const [products, categories] = await Promise.all([
    getProducts(),
    getCategories(),
  ]);

  return <ShopClient initialProducts={products} categories={categories} />;
}

