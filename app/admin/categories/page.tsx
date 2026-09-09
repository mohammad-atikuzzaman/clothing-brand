"use client";

import React, { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Tags,
  Plus,
  Search,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  CheckCircle2,
  XCircle,
  Package,
  Layers,
  ArrowUpDown,
  RefreshCw,
} from "lucide-react";
import {
  SerializedCategory,
  getAllCategoriesAdmin,
  createCategory,
  updateCategory,
  deleteCategory,
  toggleCategoryStatus,
} from "@/actions/category";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";
import { toast } from "sonner";

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<SerializedCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<SerializedCategory | null>(null);
  const [deleteConfirmCat, setDeleteConfirmCat] = useState<SerializedCategory | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    tagline: "",
    description: "",
    image: "",
    order: 0,
    isActive: true,
  });

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await getAllCategoriesAdmin();
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const filteredCategories = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return categories;
    return categories.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.slug.toLowerCase().includes(q) ||
        c.tagline.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  const openAddModal = () => {
    setEditingCategory(null);
    setFormData({
      name: "",
      slug: "",
      tagline: "",
      description: "",
      image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/1-2.webp",
      order: categories.length + 1,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  const openEditModal = (cat: SerializedCategory) => {
    setEditingCategory(cat);
    setFormData({
      name: cat.name,
      slug: cat.slug,
      tagline: cat.tagline || "",
      description: cat.description || "",
      image: cat.image || "",
      order: cat.order || 0,
      isActive: cat.isActive,
    });
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please enter a category title.");
      return;
    }

    try {
      setIsSubmitting(true);
      if (editingCategory) {
        const res = await updateCategory(editingCategory.id, {
          name: formData.name.trim(),
          slug: formData.slug.trim() || undefined,
          tagline: formData.tagline.trim(),
          description: formData.description.trim(),
          image: formData.image,
          order: Number(formData.order),
          isActive: formData.isActive,
        });

        if (!res.success || !res.data) {
          toast.error(res.error || "Failed to update category");
          return;
        }

        setCategories((prev) =>
          prev.map((c) =>
            c.id === editingCategory.id ? { ...res.data!, productCount: c.productCount } : c
          )
        );
        toast.success(`Category "${formData.name}" updated successfully.`);
      } else {
        const res = await createCategory({
          name: formData.name.trim(),
          slug: formData.slug.trim() || undefined,
          tagline: formData.tagline.trim(),
          description: formData.description.trim(),
          image: formData.image,
          order: Number(formData.order),
          isActive: formData.isActive,
        });

        if (!res.success || !res.data) {
          toast.error(res.error || "Failed to create category");
          return;
        }

        setCategories((prev) => [...prev, { ...res.data!, productCount: 0 }]);
        toast.success(`Category "${formData.name}" created successfully.`);
      }

      setIsModalOpen(false);
    } catch {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cat: SerializedCategory) => {
    try {
      const res = await deleteCategory(cat.id);
      if (!res.success) {
        toast.error(res.error || "Failed to delete category");
        return;
      }

      setCategories((prev) => prev.filter((c) => c.id !== cat.id));
      setDeleteConfirmCat(null);
      toast.success(res.message || "Category deleted successfully");
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const handleToggleStatus = async (cat: SerializedCategory) => {
    try {
      const res = await toggleCategoryStatus(cat.id);
      if (res.success) {
        setCategories((prev) =>
          prev.map((c) => (c.id === cat.id ? { ...c, isActive: res.isActive ?? !c.isActive } : c))
        );
        toast.success(
          `Category is now ${res.isActive ? "Visible" : "Hidden"} in customer store.`
        );
      } else {
        toast.error(res.error || "Failed to toggle status");
      }
    } catch {
      toast.error("Network error updating category status");
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-[#161a26] border border-neutral-800 p-6 rounded-xl">
        <div>
          <div className="flex items-center gap-2">
            <Tags className="w-5 h-5 text-[#c19b65]" />
            <h1 className="text-xl font-bold text-white tracking-wide">
              Category & Collection Management
            </h1>
          </div>
          <p className="text-xs text-neutral-400 mt-1">
            Create, customize, and arrange menswear product categories displayed across the website.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={loadCategories}
            className="p-2.5 bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 text-neutral-300 rounded-lg transition-colors cursor-pointer"
            title="Refresh categories"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={openAddModal}
            className="flex items-center gap-2 px-4 py-2.5 bg-[#c19b65] hover:bg-[#b08c55] text-black font-semibold text-xs rounded-lg transition-colors cursor-pointer shadow-lg shadow-[#c19b65]/20"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#161a26] border border-neutral-800 p-4 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 bg-neutral-900 border border-neutral-800 text-neutral-200 text-xs rounded-lg focus:outline-none focus:border-[#c19b65]"
          />
        </div>

        <div className="text-xs text-neutral-400 flex items-center gap-4">
          <span>Total Categories: <strong className="text-white">{categories.length}</strong></span>
          <span>Active: <strong className="text-emerald-400">{categories.filter((c) => c.isActive).length}</strong></span>
        </div>
      </div>

      {/* Category List Table */}
      <div className="bg-[#161a26] border border-neutral-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-neutral-900/80 text-neutral-400 font-bold uppercase tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4 w-16">Image</th>
                <th className="py-3.5 px-4">Category Name</th>
                <th className="py-3.5 px-4">Slug</th>
                <th className="py-3.5 px-4">Tagline</th>
                <th className="py-3.5 px-4 text-center">Products</th>
                <th className="py-3.5 px-4 text-center">Display Order</th>
                <th className="py-3.5 px-4 text-center">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60 font-sans">
              {loading ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-[#c19b65] border-t-transparent rounded-full animate-spin" />
                      <span>Loading categories...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredCategories.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-neutral-500">
                    No categories found matching your query.
                  </td>
                </tr>
              ) : (
                filteredCategories.map((cat) => (
                  <tr key={cat.id} className="hover:bg-neutral-800/40 transition-colors">
                    {/* Thumbnail */}
                    <td className="py-3 px-4">
                      <div className="w-12 h-12 relative rounded-md overflow-hidden bg-neutral-900 border border-neutral-800">
                        {cat.image ? (
                          <Image
                            src={cat.image}
                            alt={cat.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-neutral-600">
                            <Layers className="w-5 h-5" />
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Name */}
                    <td className="py-3 px-4">
                      <span className="font-bold text-white text-sm block">{cat.name}</span>
                      {cat.description && (
                        <p className="text-[11px] text-neutral-400 line-clamp-1 max-w-xs mt-0.5">
                          {cat.description}
                        </p>
                      )}
                    </td>

                    {/* Slug */}
                    <td className="py-3 px-4 text-neutral-400 font-mono text-[11px]">
                      {cat.slug}
                    </td>

                    {/* Tagline */}
                    <td className="py-3 px-4 text-neutral-300">
                      <span className="text-[#c19b65] font-medium text-[11px]">
                        {cat.tagline || "—"}
                      </span>
                    </td>

                    {/* Products Count */}
                    <td className="py-3 px-4 text-center">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-neutral-900 border border-neutral-800 text-neutral-200">
                        <Package className="w-3 h-3 text-[#c19b65]" />
                        <span>{cat.productCount ?? 0}</span>
                      </span>
                    </td>

                    {/* Display Order */}
                    <td className="py-3 px-4 text-center font-mono text-neutral-400">
                      {cat.order}
                    </td>

                    {/* Status Toggle */}
                    <td className="py-3 px-4 text-center">
                      <button
                        onClick={() => handleToggleStatus(cat)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-colors cursor-pointer ${
                          cat.isActive
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 hover:bg-emerald-500/20"
                            : "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20"
                        }`}
                        title="Click to toggle visibility"
                      >
                        {cat.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Active</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Hidden</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3 px-4 text-right space-x-1.5">
                      <Link
                        href={`/product-category/${cat.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white inline-block"
                        title="View Category Page"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-[#c19b65] text-neutral-300 hover:text-black transition-colors cursor-pointer"
                        title="Edit Category"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmCat(cat)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors cursor-pointer"
                        title="Delete Category"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Category Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#161a26] border border-neutral-800 rounded-xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c19b65]">
                  {editingCategory ? "Update Collection" : "New Collection"}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {editingCategory ? `Edit: ${editingCategory.name}` : "Create Category"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleFormSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Category Name */}
              <div>
                <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  Category Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Signature Line, Eid Special"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                />
              </div>

              {/* Slug & Sort Order */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Slug (URL Key)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder="auto-generated from name"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Display Sort Order
                  </label>
                  <input
                    type="number"
                    min={0}
                    value={formData.order}
                    onChange={(e) => setFormData({ ...formData, order: Number(e.target.value) })}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                  />
                </div>
              </div>

              {/* Tagline */}
              <div>
                <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  Tagline / Catchphrase
                </label>
                <input
                  type="text"
                  value={formData.tagline}
                  onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                  placeholder="e.g. Timeless Tradition, Luxury Jacquard Line"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  Category Description
                </label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Brief summary of fabrics, styling, or occasion suitability..."
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                />
              </div>

              {/* Image Upload with Cloudinary */}
              <CloudinaryUpload
                label="Category Cover Banner Image (Cloudinary Server Upload)"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />

              {/* Active Toggle */}
              <div className="flex items-center gap-3 pt-2">
                <input
                  type="checkbox"
                  id="categoryIsActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                  className="w-4 h-4 text-[#c19b65] bg-neutral-900 border-neutral-800 rounded focus:ring-0 cursor-pointer"
                />
                <label htmlFor="categoryIsActive" className="text-neutral-300 font-semibold cursor-pointer">
                  Visible & Active in Customer Store
                </label>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-neutral-900 -mx-5 -mb-5 border-t border-neutral-800 flex justify-end gap-3 mt-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 bg-[#c19b65] hover:bg-[#b08c55] text-black font-bold rounded-lg cursor-pointer transition-colors disabled:opacity-50"
                >
                  {isSubmitting ? "Saving..." : editingCategory ? "Update Category" : "Save Category"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmCat && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#161a26] border border-neutral-800 rounded-xl w-full max-w-md p-6 shadow-2xl text-center space-y-4 animate-in fade-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-bold text-white">Delete Category</h3>
              <p className="text-xs text-neutral-400 mt-1">
                Are you sure you want to permanently delete{" "}
                <strong className="text-white">"{deleteConfirmCat.name}"</strong>?
              </p>
              {deleteConfirmCat.productCount && deleteConfirmCat.productCount > 0 ? (
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs rounded-lg text-left">
                  ⚠️ This category has <strong>{deleteConfirmCat.productCount} products</strong> assigned to it.
                  You must reassign or remove those products before deleting.
                </div>
              ) : null}
            </div>

            <div className="flex justify-center gap-3 pt-2">
              <button
                onClick={() => setDeleteConfirmCat(null)}
                className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmCat)}
                disabled={Boolean(deleteConfirmCat.productCount && deleteConfirmCat.productCount > 0)}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold cursor-pointer transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
