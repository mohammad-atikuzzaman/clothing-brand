"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  Plus,
  Edit2,
  Trash2,
  ExternalLink,
  Layers,
  X,
  Sparkles,
  Megaphone,
} from "lucide-react";
import { useAdminStore, BannerSlide } from "@/store/useAdminStore";
import { toast } from "sonner";
import { CloudinaryUpload } from "@/components/CloudinaryUpload";

export default function AdminContentPage() {
  const { banners, addBanner, updateBanner, deleteBanner, settings, updateSettings } =
    useAdminStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<BannerSlide | null>(null);

  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    discount: "",
    buttonText: "SHOP NOW",
    link: "/shop",
    image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/Izhaan-web-Banner-1.webp",
  });

  // Store announcement
  const [announcement, setAnnouncement] = useState(
    "FREE NATIONWIDE DELIVERY ON ORDERS OVER ৳3,000 • CASH ON DELIVERY AVAILABLE"
  );

  const openAddModal = () => {
    setEditingBanner(null);
    setFormData({
      title: "MENS PREMIUM COLLECTION",
      subtitle: "WEAR THE HERITAGE. OWN THE TREND.",
      discount: "FLAT 50% OFF",
      buttonText: "SHOP NOW",
      link: "/shop",
      image: "https://izhaanlifestyle.com/wp-content/uploads/2025/12/Izhaan-web-Banner-1.webp",
    });
    setIsModalOpen(true);
  };

  const openEditModal = (b: BannerSlide) => {
    setEditingBanner(b);
    setFormData({
      title: b.title,
      subtitle: b.subtitle,
      discount: b.discount,
      buttonText: b.buttonText,
      link: b.link,
      image: b.image,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.image.trim()) {
      toast.error("Please provide both title and banner image URL.");
      return;
    }

    if (editingBanner) {
      updateBanner(editingBanner.id, formData);
      toast.success("Banner updated successfully.");
    } else {
      addBanner(formData);
      toast.success("New banner slide added to hero carousel.");
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string, title: string) => {
    if (banners.length <= 1) {
      toast.error("At least one banner slide is required for the store.");
      return;
    }
    if (confirm(`Delete banner slide "${title}"?`)) {
      deleteBanner(id);
      toast.success("Banner removed.");
    }
  };

  const handleSaveAnnouncement = () => {
    toast.success("Announcement bar updated successfully.");
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-white uppercase tracking-wider font-serif">
            Banners & Storefront Content
          </h2>
          <p className="text-xs text-neutral-400">
            Control hero carousel sliders, promotional announcement texts, and campaign highlights.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#c19b65] hover:bg-[#d5ad74] text-black font-semibold text-xs transition-colors shadow-md shadow-[#c19b65]/20 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Hero Banner</span>
        </button>
      </div>

      {/* Hero Banners List */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-white flex items-center gap-2">
          <Layers className="w-4 h-4 text-[#c19b65]" />
          <span>Active Hero Banners ({banners.length})</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {banners.map((banner, index) => (
            <div
              key={banner.id}
              className="bg-[#131722] rounded-xl border border-neutral-800/80 overflow-hidden shadow-sm group flex flex-col justify-between"
            >
              {/* Banner Image Preview */}
              <div className="relative aspect-[1900/550] bg-neutral-900 overflow-hidden border-b border-neutral-800">
                <Image
                  src={banner.image}
                  alt={banner.title}
                  fill
                  className="object-cover group-hover:scale-102 transition-transform duration-500"
                  unoptimized
                />
                <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-black/70 backdrop-blur-xs text-[#c19b65] font-bold text-[10px] tracking-wider uppercase border border-neutral-800">
                  Slide {index + 1}
                </div>
              </div>

              {/* Banner Meta Info */}
              <div className="p-4 space-y-2 flex-1">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] text-[#c19b65] font-bold uppercase tracking-widest block">
                      {banner.discount || "PROMOTIONAL"}
                    </span>
                    <h4 className="text-base font-bold text-white font-serif">
                      {banner.title}
                    </h4>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      {banner.subtitle}
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-neutral-400 flex items-center gap-2">
                  <span className="text-neutral-500">Links to:</span>
                  <span className="text-neutral-300 font-mono bg-neutral-900 px-2 py-0.5 rounded border border-neutral-800">
                    {banner.link}
                  </span>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div className="p-3 border-t border-neutral-800 bg-[#0f121a] flex items-center justify-between">
                <span className="text-[11px] text-neutral-500">
                  Button: &quot;{banner.buttonText}&quot;
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => openEditModal(banner)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-[#c19b65] text-neutral-300 hover:text-black transition-colors"
                    title="Edit Slide"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id, banner.title)}
                    className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-500/20 text-neutral-400 hover:text-red-400 transition-colors"
                    title="Delete Slide"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top Announcement Bar Manager */}
      <div className="bg-[#131722] p-5 sm:p-6 rounded-xl border border-neutral-800/80 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Megaphone className="w-4 h-4 text-[#c19b65]" />
          <h3 className="text-sm font-bold uppercase tracking-wider text-white">
            Promotional Announcement Bar
          </h3>
        </div>
        <p className="text-xs text-neutral-400">
          This message is shown to prospective buyers to encourage higher cart totals.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={announcement}
            onChange={(e) => setAnnouncement(e.target.value)}
            className="flex-1 px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-xs text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
          />
          <button
            onClick={handleSaveAnnouncement}
            className="px-5 py-2.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-semibold text-xs transition-colors border border-neutral-700/50"
          >
            Save Announcement
          </button>
        </div>
      </div>

      {/* Add / Edit Banner Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-xs">
          <div className="bg-[#161a26] border border-neutral-800 rounded-xl w-full max-w-xl flex flex-col shadow-2xl overflow-hidden animate-in fade-in-50 duration-200">
            <div className="p-5 border-b border-neutral-800 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#c19b65]">
                  Hero Slider
                </span>
                <h3 className="text-lg font-bold text-white">
                  {editingBanner ? "Edit Banner Slide" : "Add New Banner Slide"}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  Main Headline / Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. MENS PREMIUM COLLECTION"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                />
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  Subtitle
                </label>
                <input
                  type="text"
                  value={formData.subtitle}
                  onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                  placeholder="e.g. WEAR THE HERITAGE. OWN THE TREND."
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Discount Badge / Promo Tag
                  </label>
                  <input
                    type="text"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    placeholder="e.g. FLAT 50% OFF / EXCLUSIVE LINE"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                  />
                </div>

                <div>
                  <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                    Button Text
                  </label>
                  <input
                    type="text"
                    value={formData.buttonText}
                    onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                    placeholder="e.g. SHOP NOW"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                  Target Destination Link
                </label>
                <input
                  type="text"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  placeholder="/shop or /product-category/signature-line"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                />
              </div>

              <CloudinaryUpload
                label="Banner Image (1900 x 550 recommended, Cloudinary Upload)"
                value={formData.image}
                onChange={(url) => setFormData({ ...formData, image: url })}
              />

              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-white font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg bg-[#c19b65] hover:bg-[#d5ad74] text-black font-semibold"
                >
                  {editingBanner ? "Save Changes" : "Add Banner"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
