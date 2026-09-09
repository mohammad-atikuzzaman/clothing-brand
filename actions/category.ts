"use server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { CategoryModel } from "@/lib/models/Category";
import { ProductModel } from "@/lib/models/Product";
import { CATEGORIES } from "@/data/products";
import {
  categorySchema,
  updateCategorySchema,
  CategoryInput,
  UpdateCategoryInput,
} from "@/lib/validations/category";
import { unstable_cache, updateTag, revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export interface SerializedCategory {
  id: string;
  name: string;
  slug: string;
  image: string;
  tagline: string;
  description: string;
  order: number;
  isActive: boolean;
  productCount?: number;
  createdAt?: string;
  updatedAt?: string;
}

function serializeCategory(doc: any, productCount?: number): SerializedCategory {
  return {
    id: doc._id?.toString() || doc.id || "",
    name: doc.name,
    slug: doc.slug,
    image: doc.image || "",
    tagline: doc.tagline || "",
    description: doc.description || "",
    order: Number(doc.order ?? 0),
    isActive: Boolean(doc.isActive ?? true),
    productCount: productCount !== undefined ? productCount : undefined,
    createdAt: doc.createdAt ? new Date(doc.createdAt).toISOString() : undefined,
    updatedAt: doc.updatedAt ? new Date(doc.updatedAt).toISOString() : undefined,
  };
}

// Seed default initial categories from data/products.ts if collection is empty
async function ensureCategoriesSeeded() {
  const count = await CategoryModel.countDocuments();
  if (count === 0) {
    const docs = CATEGORIES.map((cat, index) => ({
      name: cat.name,
      slug: cat.slug,
      image: cat.image,
      tagline: cat.tagline,
      description: cat.description,
      order: index + 1,
      isActive: true,
    }));
    await CategoryModel.insertMany(docs, { ordered: false });
  }
}

// Low-level fetcher for active public categories
async function fetchActiveCategoriesFromDb(): Promise<SerializedCategory[]> {
  await connectToDatabase();
  await ensureCategoriesSeeded();

  const docs = await CategoryModel.find({ isActive: true })
    .sort({ order: 1, createdAt: 1 })
    .lean()
    .exec();

  return docs.map((d) => serializeCategory(d));
}

// Module-scoped cached categories getter
const getCachedCategoriesInternal = unstable_cache(
  fetchActiveCategoriesFromDb,
  ["categories-list"],
  { tags: ["categories"], revalidate: 120 }
);

export async function getCategories(): Promise<SerializedCategory[]> {
  return getCachedCategoriesInternal();
}

// Low-level fetcher for category by slug
async function fetchCategoryBySlugFromDb(slug: string): Promise<SerializedCategory | null> {
  await connectToDatabase();
  await ensureCategoriesSeeded();

  const cleanSlug = slug.toLowerCase().trim();
  const doc = await CategoryModel.findOne({ slug: cleanSlug }).lean().exec();
  if (!doc) return null;

  return serializeCategory(doc);
}

// Module-scoped cached single category lookup
const getCachedCategoryBySlugInternal = unstable_cache(
  async (cleanSlug: string) => fetchCategoryBySlugFromDb(cleanSlug),
  ["category-detail"],
  { tags: ["categories"], revalidate: 120 }
);

export async function getCategoryBySlug(slug: string): Promise<SerializedCategory | null> {
  const cleanSlug = slug.toLowerCase().trim();
  return getCachedCategoryBySlugInternal(cleanSlug);
}

// Admin: Get all categories with dynamic live product counts
export async function getAllCategoriesAdmin(): Promise<SerializedCategory[]> {
  await requireAdmin();
  await connectToDatabase();
  await ensureCategoriesSeeded();

  const [categories, products] = await Promise.all([
    CategoryModel.find().sort({ order: 1, createdAt: 1 }).lean().exec(),
    ProductModel.aggregate([
      { $group: { _id: "$category", count: { $sum: 1 } } },
    ]),
  ]);

  const countMap = new Map<string, number>();
  products.forEach((p) => {
    if (p._id) countMap.set(p._id.toLowerCase(), p.count);
  });

  return categories.map((cat) => {
    const pCount = countMap.get(cat.name.toLowerCase()) || 0;
    return serializeCategory(cat, pCount);
  });
}

// Admin: Create a new category with Zod validation
export async function createCategory(input: CategoryInput) {
  try {
    await requireAdmin();

    const validated = categorySchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((i) => i.message).join(", "),
      };
    }

    await connectToDatabase();
    const data = validated.data;

    const slug =
      data.slug?.trim() ||
      data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    // Check slug and name uniqueness
    const existing = await CategoryModel.findOne({
      $or: [{ slug }, { name: { $regex: new RegExp(`^${data.name.trim()}$`, "i") } }],
    });

    if (existing) {
      return {
        success: false,
        error: "A category with this name or slug already exists.",
      };
    }

    const newCategory = await CategoryModel.create({
      ...data,
      slug,
    });

    // Invalidate caches instantly
    updateTag("categories");
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");

    return {
      success: true,
      data: serializeCategory(newCategory),
    };
  } catch (error: any) {
    console.error("Create category error:", error);
    return {
      success: false,
      error: "Failed to create category. Please check inputs and try again.",
    };
  }
}

// Admin: Update existing category
export async function updateCategory(id: string, input: UpdateCategoryInput) {
  try {
    await requireAdmin();

    const validated = updateCategorySchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((i) => i.message).join(", "),
      };
    }

    await connectToDatabase();
    const existing = await CategoryModel.findById(id);
    if (!existing) {
      return { success: false, error: "Category not found." };
    }

    const data: Record<string, any> = { ...validated.data };

    if (data.name && !data.slug) {
      data.slug = data.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
    }

    // If slug or name changed, check uniqueness with other categories
    if (data.slug && data.slug !== existing.slug) {
      const slugConflict = await CategoryModel.findOne({
        slug: data.slug,
        _id: { $ne: id },
      });
      if (slugConflict) {
        return { success: false, error: "Another category is already using this slug." };
      }
    }

    const oldName = existing.name;
    const newName = data.name || existing.name;
    const newSlug = data.slug || existing.slug;

    const updated = await CategoryModel.findByIdAndUpdate(id, data, { new: true });
    if (!updated) {
      return { success: false, error: "Category not found." };
    }

    // Maintain Data Integrity: Update all linked products if category name or slug changed
    if (oldName !== newName || existing.slug !== newSlug) {
      await ProductModel.updateMany(
        { category: oldName },
        { category: newName, categorySlug: newSlug }
      );
      updateTag("products");
    }

    // Invalidate caches instantly
    updateTag("categories");
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath(`/product-category/${existing.slug}`);
    revalidatePath(`/product-category/${newSlug}`);
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");

    return {
      success: true,
      data: serializeCategory(updated),
    };
  } catch (error: any) {
    console.error("Update category error:", error);
    return {
      success: false,
      error: "Failed to update category.",
    };
  }
}

// Admin: Delete category with safety dependency checks
export async function deleteCategory(id: string) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const category = await CategoryModel.findById(id);
    if (!category) {
      return { success: false, error: "Category not found." };
    }

    // Prevent deletion if active products belong to this category
    const productCount = await ProductModel.countDocuments({ category: category.name });
    if (productCount > 0) {
      return {
        success: false,
        error: `Cannot delete "${category.name}". There are ${productCount} product(s) assigned to it. Please reassign or delete the products first.`,
      };
    }

    await CategoryModel.findByIdAndDelete(id);

    // Invalidate caches instantly
    updateTag("categories");
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/categories");
    revalidatePath("/admin/products");

    return {
      success: true,
      message: `Category "${category.name}" was deleted successfully.`,
    };
  } catch (error: any) {
    console.error("Delete category error:", error);
    return {
      success: false,
      error: "Failed to delete category.",
    };
  }
}

// Admin: Toggle active status
export async function toggleCategoryStatus(id: string) {
  try {
    await requireAdmin();
    await connectToDatabase();

    const category = await CategoryModel.findById(id);
    if (!category) {
      return { success: false, error: "Category not found." };
    }

    category.isActive = !category.isActive;
    await category.save();

    updateTag("categories");
    revalidatePath("/");
    revalidatePath("/shop");
    revalidatePath("/admin/categories");

    return {
      success: true,
      isActive: category.isActive,
    };
  } catch (error: any) {
    return {
      success: false,
      error: "Failed to toggle category status.",
    };
  }
}
