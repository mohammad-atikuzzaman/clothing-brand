"use client";

import React, { useState, useMemo, useEffect } from "react";
import Image from "next/image";
import {
  Search,
  Plus,
  Edit2,
  Trash2,
  Star,
  CheckCircle2,
  XCircle,
  Package,
  X,
  ExternalLink,
  Sparkles,
} from "lucide-react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  toggleProductStock,
  toggleProductFeatured,
  SerializedProduct,
} from "@/actions/product";
import { formatPrice } from "@/lib/utils";
import { toast } from "sonner";
import Link from "next/link";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";

const CATEGORIES = [
  "Signature Line",
  "Core Classics",
  "Smart Casuals",
  "ZAQWAN",
  "Price 990 - 999",
];

const AVAILABLE_SIZES = ["38", "40", "42", "44", "46", "48"];

export default function AdminProductsPage() {
  const [products, setProducts] = useState<SerializedProduct[]>([]);
  const [loading, setLoading] = useState(true);

  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [stockFilter, setStockFilter] = useState<"All" | "InStock" | "OutOfStock">("All");

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<SerializedProduct | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (err) {
      toast.error("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  // Form states for Add / Edit
  const [formData, setFormData] = useState<{
    name: string;
    slug: string;
    category: string;
    regularPrice: number;
    salePrice: number;
    stockQuantity: number;
    image: string;
    inStock: boolean;
    featured: boolean;
    sizes: string[];
    description: string;
    fabric: string;
    fit: string;
    sku: string;
  }>({
    name: "",
    slug: "",
    category: "Signature Line",
    regularPrice: 2999,
    salePrice: 1799,
    stockQuantity: 100,
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/19e36100-4210-4dc9-ada3-1d7251bc52a5-430x573.jpeg",
    inStock: true,
    featured: false,
    sizes: ["38", "40", "42", "44"],
    description: "Premium cotton Panjabi crafted for comfort and festive elegance.",
    fabric: "100% Combed Cotton Jacquard",
    fit: "Semi-Slim Fit",
    sku: "IZH-P000",
  });

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesCat =
        selectedCategory === "All" ? true : p.category === selectedCategory;
      const matchesStock =
        stockFilter === "All"
          ? true
          : stockFilter === "InStock"
          ? p.inStock
          : !p.inStock;
      const matchesSearch =
        searchQuery.trim() === ""
          ? true
          : p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.sku.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCat && matchesStock && matchesSearch;
    });
  }, [products, selectedCategory, stockFilter, searchQuery]);

  const openAddModal = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      slug: "",
      category: "Signature Line",
      regularPrice: 2999,
      salePrice: 1799,
      stockQuantity: 100,
      image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/19e36100-4210-4dc9-ada3-1d7251bc52a5-430x573.jpeg",
      inStock: true,
      featured: false,
      sizes: ["38", "40", "42", "44"],
      description: "Crafted with superior materials and precision stitching.",
      fabric: "100% Combed Cotton Jacquard",
      fit: "Semi-Slim Fit",
      sku: `IZH-P${Math.floor(100 + Math.random() * 900)}`,
    });
    setIsAddModalOpen(true);
  };

  const openEditModal = (p: SerializedProduct) => {
    setEditingProduct(p);
    setFormData({
      name: p.name,
      slug: p.slug,
      category: p.category,
      regularPrice: p.regularPrice,
      salePrice: p.salePrice,
      stockQuantity: p.stockQuantity ?? 100,
      image: p.image,
      inStock: p.inStock,
      featured: p.featured || false,
      sizes: p.sizes || ["40", "42", "44"],
      description: p.description || "",
      fabric: p.fabric || "Combed Cotton",
      fit: p.fit || "Regular Fit",
      sku: p.sku || `IZH-P${p.id}`,
    });
    setIsAddModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error("Please provide a product title.");
      return;
    }

    const discount =
      formData.regularPrice > formData.salePrice
        ? Math.round(((formData.regularPrice - formData.salePrice) / formData.regularPrice) * 100)
        : 0;

    const slug =
      formData.slug.trim() ||
      formData.name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");

    const categorySlug = formData.category.toLowerCase().replace(/\s+/g, "-");

    try {
      if (editingProduct) {
        const res = await updateProduct(editingProduct.id, {
          name: formData.name,
          slug,
          category: formData.category,
          categorySlug,
          regularPrice: Number(formData.regularPrice),
          salePrice: Number(formData.salePrice),
          discountPercentage: discount,
          stockQuantity: Number(formData.stockQuantity || 100),
          image: formData.image,
          inStock: formData.inStock,
          featured: formData.featured,
          sizes: formData.sizes,
          description: formData.description,
          fabric: formData.fabric,
          fit: formData.fit,
          sku: formData.sku,
        });

        if (!res.success || !res.data) {
          toast.error(res.error || "Failed to update product");
          return;
        }

        setProducts((prev) =>
          prev.map((p) => (p.id === editingProduct.id ? res.data! : p))
        );
        toast.success(`Product "${formData.name}" updated successfully.`);
      } else {
        const res = await createProduct({
          name: formData.name,
          slug,
          category: formData.category,
          categorySlug,
          regularPrice: Number(formData.regularPrice),
          salePrice: Number(formData.salePrice),
          discountPercentage: discount,
          stockQuantity: Number(formData.stockQuantity || 100),
          image: formData.image,
          galleryImages: [formData.image],
          inStock: formData.inStock,
          featured: formData.featured,
          sizes: formData.sizes,
          description: formData.description,
          fabric: formData.fabric,
          fit: formData.fit,
          sku: formData.sku,
          rating: 5,
          reviewsCount: 0,
        });

        if (!res.success || !res.data) {
          toast.error(res.error || "Failed to create product");
          return;
        }

        setProducts((prev) => [res.data!, ...prev]);
        toast.success(`Product "${formData.name}" created successfully.`);
      }

      setIsAddModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || "Failed to save product");
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete "${name}"?`)) {
      try {
        const res = await deleteProduct(id);
        if (!res.success) {
          toast.error(res.error || "Failed to delete product");
          return;
        }
        setProducts((prev) => prev.filter((p) => p.id !== id));
        toast.success(`Product "${name}" deleted.`);
      } catch (err: any) {
        toast.error(err.message || "Failed to delete product");
      }
    }
  };

  const toggleStock = async (id: string) => {
    try {
      const res = await toggleProductStock(id);
      if (!res.success) {
        toast.error(res.error || "Failed to toggle stock");
        return;
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, inStock: res.inStock! } : p))
      );
      toast.success("Stock status updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle stock");
    }
  };

  const toggleFeatured = async (id: string) => {
    try {
      const res = await toggleProductFeatured(id);
      if (!res.success) {
        toast.error(res.error || "Failed to toggle featured");
        return;
      }
      setProducts((prev) =>
        prev.map((p) => (p.id === id ? { ...p, featured: res.featured! } : p))
      );
      toast.success("Featured status updated");
    } catch (err: any) {
      toast.error(err.message || "Failed to toggle featured");
    }
  };

  const toggleSizeSelection = (size: string) => {
    setFormData((prev) => {
      const exists = prev.sizes.includes(size);
      return {
        ...prev,
        sizes: exists
          ? prev.sizes.filter((s) => s !== size)
          : [...prev.sizes, size].sort(),
      };
    });
  };

  return (
    <div className="space-y-6">
      {/* Header and Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider font-serif">
            Products & Catalog Management
          </h2>
          <p className="text-xs text-neutral-400">
            Add new Panjabis, edit retail prices, manage stock availability, and highlight featured collections.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c19b65] hover:bg-[#d5ad74] text-black font-semibold text-xs transition-colors shadow-md shadow-[#c19b65]/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Panjabi</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#131722] p-4 rounded-xl border border-neutral-800/80 space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-neutral-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products by name or SKU..."
              className="w-full pl-10 pr-4 py-2 bg-neutral-900/80 border border-neutral-800 text-xs text-white rounded-lg focus:outline-none focus:border-[#c19b65] transition-colors"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="bg-neutral-900/80 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c19b65]"
          >
            <option value="All">All Categories ({products.length})</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Stock Filter */}
          <select
            value={stockFilter}
            onChange={(e) => setStockFilter(e.target.value as any)}
            className="bg-neutral-900/80 border border-neutral-800 text-xs text-white rounded-lg px-3 py-2 focus:outline-none focus:border-[#c19b65]"
          >
            <option value="All">All Stock Status</option>
            <option value="InStock">In Stock Only</option>
            <option value="OutOfStock">Out of Stock Only</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-[#131722] rounded-xl border border-neutral-800/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-neutral-300">
            <thead className="bg-[#0f121a] text-neutral-400 uppercase font-semibold text-[10px] tracking-wider border-b border-neutral-800">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Product</th>
                <th className="py-3.5 px-4">Category & SKU</th>
                <th className="py-3.5 px-4">Pricing</th>
                <th className="py-3.5 px-4">Sizes</th>
                <th className="py-3.5 px-4 text-center">Stock</th>
                <th className="py-3.5 px-4 text-center">Featured</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/60">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-neutral-500">
                    No products found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-neutral-800/30 transition-colors"
                  >
                    {/* Thumbnail & Title */}
                    <td className="py-3.5 px-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-14 rounded-md bg-neutral-800 overflow-hidden flex-shrink-0 border border-neutral-700/50">
                          <Image
                            src={product.image}
                            alt={product.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div>
                          <span className="font-semibold text-white block">
                            {product.name}
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            {product.fabric || "Combed Cotton"}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category & SKU */}
                    <td className="py-3.5 px-4">
                      <span className="text-neutral-200 block font-medium">
                        {product.category}
                      </span>
                      <span className="text-[10px] text-neutral-500 block">
                        SKU: {product.sku || "N/A"}
                      </span>
                    </td>

                    {/* Pricing */}
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-white text-sm">
                        {formatPrice(product.salePrice)}
                      </div>
                      {product.regularPrice > product.salePrice && (
                        <div className="text-[11px] text-neutral-500 line-through">
                          {formatPrice(product.regularPrice)}
                        </div>
                      )}
                    </td>

                    {/* Sizes */}
                    <td className="py-3.5 px-4">
                      <div className="flex flex-wrap gap-1 max-w-[120px]">
                        {product.sizes?.map((size) => (
                          <span
                            key={size}
                            className="text-[9px] px-1.5 py-0.2 rounded bg-neutral-800 text-neutral-300 font-mono"
                          >
                            {size}
                          </span>
                        ))}
                      </div>
                    </td>

                    {/* Stock Switch */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleStock(product.id)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full cursor-pointer transition-colors ${
                          product.inStock
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-500/20"
                            : "bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500/20"
                        }`}
                        title="Click to toggle stock status"
                      >
                        {product.inStock ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>In Stock</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>Out of Stock</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Featured Star Toggle */}
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => toggleFeatured(product.id)}
                        className={`p-1.5 rounded-lg transition-colors ${
                          product.featured
                            ? "text-[#c19b65] hover:bg-[#c19b65]/20"
                            : "text-neutral-600 hover:text-neutral-400 hover:bg-neutral-800"
                        }`}
                        title="Click to toggle homepage featured"
                      >
                        <Star
                          className={`w-4 h-4 ${
                            product.featured ? "fill-current" : ""
                          }`}
                        />
                      </button>
                    </td>

                    {/* Actions */}
                    <td className="py-3.5 px-4 text-right space-x-1.5">
                      <Link
                        href={`/product/${product.slug}`}
                        target="_blank"
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white inline-block"
                        title="View on store"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>

                      <button
                        onClick={() => openEditModal(product)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-[#c19b65] text-neutral-300 hover:text-black transition-colors"
                        title="Edit Panjabi"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(product.id, product.name)}
                        className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
                        title="Delete Panjabi"
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

      {/* Add / Edit Product Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#161a26] border border-neutral-800 rounded-xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in-50 duration-200">
            {/* Modal Header */}
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c19b65]">
                  {editingProduct ? "Edit Product" : "New Collection"}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {editingProduct ? `Edit ${editingProduct.name}` : "Add New Panjabi"}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form Body */}
            <form onSubmit={handleFormSubmit} className="p-5 overflow-y-auto space-y-4 text-xs">
              {/* Product Title & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Panjabi Title <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Premium Panjabi P-630"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Category <span className="text-red-500">*</span>
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing (Regular Price, Sale Price, Stock, SKU) */}
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Regular Price (৳)
                  </label>
                  <input
                    type="number"
                    value={formData.regularPrice}
                    onChange={(e) =>
                      setFormData({ ...formData, regularPrice: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Sale Price (৳) <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    value={formData.salePrice}
                    onChange={(e) =>
                      setFormData({ ...formData, salePrice: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Stock Units <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min={0}
                    value={formData.stockQuantity}
                    onChange={(e) =>
                      setFormData({ ...formData, stockQuantity: Number(e.target.value) })
                    }
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    SKU Code
                  </label>
                  <input
                    type="text"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                    placeholder="e.g. IZH-P630"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                  />
                </div>
              </div>

              {/* Product Image with Server-Side Cloudinary Upload */}
              <CloudinaryUpload
                label="Product Image (Cloudinary Server-Side Upload)"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />

              {/* Sizes Available */}
              <div>
                <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1.5">
                  Available Sizes
                </label>
                <div className="flex flex-wrap gap-2">
                  {AVAILABLE_SIZES.map((size) => {
                    const isSelected = formData.sizes.includes(size);
                    return (
                      <button
                        type="button"
                        key={size}
                        onClick={() => toggleSizeSelection(size)}
                        className={`w-10 h-8 rounded-md font-bold text-xs transition-colors ${
                          isSelected
                            ? "bg-[#c19b65] text-black shadow-xs"
                            : "bg-neutral-900 text-neutral-400 hover:bg-neutral-800 border border-neutral-800"
                        }`}
                      >
                        {size}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Fabric & Fit */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Fabric Details
                  </label>
                  <input
                    type="text"
                    value={formData.fabric}
                    onChange={(e) => setFormData({ ...formData, fabric: e.target.value })}
                    placeholder="e.g. 100% Combed Cotton Jacquard"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Fit Type
                  </label>
                  <input
                    type="text"
                    value={formData.fit}
                    onChange={(e) => setFormData({ ...formData, fit: e.target.value })}
                    placeholder="e.g. Semi-Slim Fit / Regular Fit"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  Product Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe craftsmanship, collar details, styling instructions..."
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                />
              </div>

              {/* In Stock & Featured Toggles */}
              <div className="flex items-center gap-6 pt-2 border-t border-neutral-800">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                    className="rounded bg-neutral-900 border-neutral-700 text-[#c19b65] focus:ring-[#c19b65]"
                  />
                  <span className="text-neutral-300 font-medium">In Stock (Available for Purchase)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.featured}
                    onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                    className="rounded bg-neutral-900 border-neutral-700 text-[#c19b65] focus:ring-[#c19b65]"
                  />
                  <span className="text-neutral-300 font-medium">Feature on Homepage</span>
                </label>
              </div>

              {/* Form Buttons */}
              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#c19b65] hover:bg-[#d5ad74] text-black font-semibold shadow-md shadow-[#c19b65]/20"
                >
                  {editingProduct ? "Save Changes" : "Create Panjabi"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
