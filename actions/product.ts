"use server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { ProductModel } from "@/lib/models/Product";
import { ensureDatabaseSeeded } from "@/lib/db/seed";
import {
  productSchema,
  updateProductSchema,
  ProductInput,
  UpdateProductInput,
} from "@/lib/validations/product";
import { unstable_cache, updateTag, revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { escapeRegex } from "@/lib/utils";

export interface SerializedProduct {
  id: string;
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  regularPrice: number;
  salePrice: number;
  discountPercentage: number;
  image: string;
  galleryImages: string[];
  stockQuantity: number;
  inStock: boolean;
  featured: boolean;
  sizes: string[];
  description: string;
  fabric: string;
  fit: string;
  sku: string;
  rating: number;
  reviewsCount: number;
  createdAt?: string;
  updatedAt?: string;
}

function serializeProduct(doc: any): SerializedProduct {
  return {
    id: doc._id?.toString() || doc.id || "",
    name: doc.name,
    slug: doc.slug,
    category: doc.category,
    categorySlug: doc.categorySlug,
    regularPrice: Number(doc.regularPrice),
    salePrice: Number(doc.salePrice),
    discountPercentage: Number(doc.discountPercentage || 0),
    image: doc.image,
    galleryImages: Array.isArray(doc.galleryImages) ? doc.galleryImages : [],
    stockQuantity: doc.stockQuantity !== undefined ? Number(doc.stockQuantity) : 100,
    inStock: Boolean(doc.inStock),
    featured: Boolean(doc.featured),
    sizes: Array.isArray(doc.sizes) ? doc.sizes : [],
    description: doc.description || "",
    fabric: doc.fabric || "",
    fit: doc.fit || "",
    sku: doc.sku || "",
    rating: Number(doc.rating || 5),
    reviewsCount: Number(doc.reviewsCount || 0),
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
  };
}

export interface GetProductsParams {
  category?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: "default" | "price-asc" | "price-desc" | "rating" | "latest";
  inStockOnly?: boolean;
  limit?: number;
}

// Low-level fetcher for products
async function fetchProductsFromDb(params?: GetProductsParams): Promise<SerializedProduct[]> {
  await connectToDatabase();

  const query: Record<string, any> = {};

  if (params?.category && params.category !== "All") {
    const escaped = escapeRegex(params.category.trim());
    query.$or = [
      { category: { $regex: new RegExp(`^${escaped}$`, "i") } },
      { categorySlug: params.category.toLowerCase() },
    ];
  }

  if (params?.inStockOnly) {
    query.inStock = true;
  }

  if (params?.minPrice !== undefined || params?.maxPrice !== undefined) {
    query.salePrice = {};
    if (params.minPrice !== undefined) query.salePrice.$gte = params.minPrice;
    if (params.maxPrice !== undefined) query.salePrice.$lte = params.maxPrice;
  }

  if (params?.search && params.search.trim()) {
    const s = escapeRegex(params.search.trim());
    query.$or = [
      { name: { $regex: s, $options: "i" } },
      { sku: { $regex: s, $options: "i" } },
      { category: { $regex: s, $options: "i" } },
    ];
  }

  let sortOption: Record<string, any> = { createdAt: -1 };
  if (params?.sort === "price-asc") sortOption = { salePrice: 1 };
  else if (params?.sort === "price-desc") sortOption = { salePrice: -1 };
  else if (params?.sort === "rating") sortOption = { rating: -1 };
  else if (params?.sort === "latest") sortOption = { createdAt: -1 };

  const limit = params?.limit || 100;

  const docs = await ProductModel.find(query)
    .sort(sortOption)
    .limit(limit)
    .lean()
    .exec();

  return docs.map(serializeProduct);
}

// Module-scoped cached products getter
const getCachedProductsInternal = unstable_cache(
  async (cacheKey: string) => {
    const params = cacheKey ? (JSON.parse(cacheKey) as GetProductsParams) : undefined;
    return fetchProductsFromDb(params);
  },
  ["products-list"],
  { tags: ["products"], revalidate: 60 }
);

export async function getProducts(params?: GetProductsParams): Promise<SerializedProduct[]> {
  const cacheKey = JSON.stringify(params || {});
  return getCachedProductsInternal(cacheKey);
}

// Low-level fetcher for single product by slug
async function fetchProductBySlugFromDb(slug: string): Promise<SerializedProduct | null> {
  await connectToDatabase();

  const doc = await ProductModel.findOne({ slug: slug.toLowerCase() })
    .lean()
    .exec();

  if (!doc) return null;
  return serializeProduct(doc);
}

// Module-scoped cached single product lookup
const getCachedProductBySlugInternal = unstable_cache(
  async (cleanSlug: string) => fetchProductBySlugFromDb(cleanSlug),
  ["product-detail"],
  { tags: ["products"], revalidate: 120 }
);

export async function getProductBySlug(slug: string): Promise<SerializedProduct | null> {
  const cleanSlug = slug.toLowerCase().trim();
  return getCachedProductBySlugInternal(cleanSlug);
}

// Module-scoped cached featured products
const getCachedFeaturedProductsInternal = unstable_cache(
  async (limit: number) => {
    await connectToDatabase();
    const docs = await ProductModel.find({ featured: true })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean()
      .exec();
    return docs.map(serializeProduct);
  },
  ["featured-products"],
  { tags: ["products", "featured-products"], revalidate: 120 }
);

export async function getFeaturedProducts(limit = 8): Promise<SerializedProduct[]> {
  return getCachedFeaturedProductsInternal(limit);
}

// Mutations with Zod Validation & Instant Revalidation
export async function createProduct(input: ProductInput) {
  try {
    await requireAdmin();

    const validated = productSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((i) => i.message).join(", "),
      };
    }

    await connectToDatabase();

    const data = validated.data;
    const generatedSlug =
      data.slug || data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const categorySlug =
      data.categorySlug || data.category.toLowerCase().replace(/[^a-z0-9]+/g, "-");

    const discountPercentage =
      data.regularPrice > data.salePrice
        ? Math.round(((data.regularPrice - data.salePrice) / data.regularPrice) * 100)
        : 0;

    const existing = await ProductModel.findOne({ slug: generatedSlug });
    if (existing) {
      return { success: false, error: "A product with this slug already exists" };
    }

    const newDoc = await ProductModel.create({
      ...data,
      slug: generatedSlug,
      categorySlug,
      discountPercentage,
    });

    // Instant On-Demand Cache Invalidation
    updateTag("products");
    updateTag("featured-products");
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath("/admin/products");

    return {
      success: true,
      data: serializeProduct(newDoc),
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create product",
    };
  }
}

export async function updateProduct(id: string, input: UpdateProductInput) {
  try {
    await requireAdmin();

    const validated = updateProductSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((i) => i.message).join(", "),
      };
    }

    await connectToDatabase();

    const existing = await ProductModel.findById(id).lean().exec();
    if (!existing) {
      return { success: false, error: "Product not found" };
    }

    const data: Record<string, any> = { ...validated.data };

    // Accurately recalculate discount percentage if either price is modified
    const regPrice = data.regularPrice !== undefined ? data.regularPrice : existing.regularPrice;
    const sPrice = data.salePrice !== undefined ? data.salePrice : existing.salePrice;
    if (regPrice !== undefined && sPrice !== undefined) {
      data.discountPercentage =
        regPrice > sPrice ? Math.round(((regPrice - sPrice) / regPrice) * 100) : 0;
    }

    const updated = await ProductModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    })
      .lean()
      .exec();

    if (!updated) {
      return { success: false, error: "Product not found" };
    }

    const serialized = serializeProduct(updated);

    // Instant On-Demand Cache Invalidation
    updateTag("products");
    updateTag("featured-products");
    updateTag(`product-${serialized.slug}`);
    revalidatePath("/shop");
    revalidatePath(`/product/${serialized.slug}`);
    revalidatePath("/");
    revalidatePath("/admin/products");

    return { success: true, data: serialized };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update product",
    };
  }
}

export async function deleteProduct(id: string) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const deleted = await ProductModel.findByIdAndDelete(id).lean().exec();

    if (!deleted) {
      return { success: false, error: "Product not found" };
    }

    updateTag("products");
    updateTag("featured-products");
    if (deleted.slug) updateTag(`product-${deleted.slug}`);
    revalidatePath("/shop");
    revalidatePath("/");
    revalidatePath("/admin/products");

    return { success: true, message: "Product deleted successfully" };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete product" };
  }
}

export async function toggleProductStock(id: string) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const product = await ProductModel.findById(id);
    if (!product) return { success: false, error: "Product not found" };

    product.inStock = !product.inStock;
    await product.save();

    updateTag("products");
    updateTag(`product-${product.slug}`);
    revalidatePath("/shop");
    revalidatePath("/admin/products");

    return { success: true, inStock: product.inStock };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to toggle stock" };
  }
}

export async function toggleProductFeatured(id: string) {
  try {
    await requireAdmin();
    await connectToDatabase();
    const product = await ProductModel.findById(id);
    if (!product) return { success: false, error: "Product not found" };

    product.featured = !product.featured;
    await product.save();

    updateTag("products");
    updateTag("featured-products");
    revalidatePath("/");
    revalidatePath("/admin/products");

    return { success: true, featured: product.featured };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to toggle featured" };
  }
}
