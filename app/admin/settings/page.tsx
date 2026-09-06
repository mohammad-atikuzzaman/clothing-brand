"use client";

import React, { useState } from "react";
import {
  Settings,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Clock,
  Truck,
  CreditCard,
  Save,
  Share2,
  CheckCircle2,
} from "lucide-react";
import { useAdminStore, StoreSettings } from "@/store/useAdminStore";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const { settings, updateSettings } = useAdminStore();
  const [formData, setFormData] = useState<StoreSettings>(settings);
  const [saving, setSaving] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      updateSettings(formData);
      setSaving(false);
      toast.success("Store settings & contact information updated successfully!");
    }, 400);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Header */}
      <div>
        <h2 className="text-xl font-bold text-white uppercase tracking-wider font-serif">
          Settings & Contact Configuration
        </h2>
        <p className="text-xs text-neutral-400">
          Update your store hotline, customer care hours, shipping rates, bKash merchant details, and showroom address.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Contact Information & Channels */}
        <div className="bg-[#131722] p-5 sm:p-6 rounded-xl border border-neutral-800/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Phone className="w-4 h-4 text-[#c19b65]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Customer Support & Hotlines
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                Hotline Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={formData.hotline}
                  onChange={(e) => setFormData({ ...formData, hotline: e.target.value })}
                  placeholder="01811-496175"
                  className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
                />
              </div>
            </div>

            <div>
              <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                WhatsApp Hotline Number <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.whatsapp}
                onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                placeholder="+8801811496175"
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                Official Support Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="izhaanlifestyle@gmail.com"
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                Customer Care Operating Hours
              </label>
              <input
                type="text"
                value={formData.operatingHours}
                onChange={(e) =>
                  setFormData({ ...formData, operatingHours: e.target.value })
                }
                placeholder="10:00 AM – 10:00 PM (Everyday)"
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
              Physical Showroom / Hub Address
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Uttara / Dakshinkhan, Dhaka, Bangladesh"
              className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
            />
          </div>
        </div>

        {/* Delivery Rates & Payment Details */}
        <div className="bg-[#131722] p-5 sm:p-6 rounded-xl border border-neutral-800/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Truck className="w-4 h-4 text-[#c19b65]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Courier Delivery Rates & Payment Setup
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                Delivery Charge (Inside Dhaka) ৳
              </label>
              <input
                type="number"
                value={formData.shippingDhaka}
                onChange={(e) =>
                  setFormData({ ...formData, shippingDhaka: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                Delivery Charge (Outside Dhaka / 63 Districts) ৳
              </label>
              <input
                type="number"
                value={formData.shippingOutside}
                onChange={(e) =>
                  setFormData({ ...formData, shippingOutside: Number(e.target.value) })
                }
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                bKash Merchant / Personal Payment Account
              </label>
              <input
                type="text"
                value={formData.bkashNumber}
                onChange={(e) => setFormData({ ...formData, bkashNumber: e.target.value })}
                placeholder="01811-496175 (Merchant / Payment)"
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
              />
            </div>
          </div>
        </div>

        {/* Social Media Channels */}
        <div className="bg-[#131722] p-5 sm:p-6 rounded-xl border border-neutral-800/80 shadow-sm space-y-4">
          <div className="flex items-center gap-2 border-b border-neutral-800 pb-3">
            <Share2 className="w-4 h-4 text-[#c19b65]" />
            <h3 className="text-sm font-bold uppercase tracking-wider text-white">
              Official Social Channels
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                Facebook Page URL
              </label>
              <input
                type="url"
                value={formData.facebookUrl}
                onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                placeholder="https://facebook.com/izhaanlifestyle"
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
              />
            </div>

            <div>
              <label className="block text-neutral-400 font-bold uppercase tracking-wider mb-1">
                Instagram Profile URL
              </label>
              <input
                type="url"
                value={formData.instagramUrl}
                onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                placeholder="https://instagram.com/izhaanlifestyle"
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65]"
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-[#c19b65] hover:bg-[#d5ad74] text-black font-bold text-xs uppercase tracking-wider shadow-lg shadow-[#c19b65]/20 transition-all disabled:opacity-50"
          >
            {saving ? (
              <span>Saving...</span>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save All Settings</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
