"use client";

import React, { useState, useEffect } from "react";
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
  Activity,
  Eye,
  EyeOff,
  Radio,
  ExternalLink,
} from "lucide-react";
import { getAdminStoreSettings, updateStoreSettings, SerializedSettings } from "@/actions/settings";
import { toast } from "sonner";

export default function AdminSettingsPage() {
  const [formData, setFormData] = useState<SerializedSettings>({
    storeName: "Izhaan Lifestyle",
    tagline: "Elegance Redefined | Premium Menswear & Panjabi",
    hotline: "+880 1888-299388",
    whatsapp: "+880 1888-299388",
    email: "support@izhaanlifestyle.com",
    address: "Level 4, Plot 12, Road 11, Banani, Dhaka-1213, Bangladesh",
    operatingHours: "Everyday: 10:00 AM - 10:00 PM (GMT+6)",
    shippingDhaka: 70,
    shippingOutside: 130,
    bkashNumber: "01888299388 (Merchant)",
    facebookUrl: "https://facebook.com/izhaanlifestyle",
    instagramUrl: "https://instagram.com/izhaanlifestyle",
    metaPixelId: "",
    metaCapiToken: "",
    metaTestEventCode: "",
    metaDomainVerification: "",
    isMetaTrackingEnabled: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showToken, setShowToken] = useState(false);

  useEffect(() => {
    getAdminStoreSettings()
      .then((data) => {
        setFormData(data);
      })
      .catch((err) => {
        toast.error("Failed to load settings");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await updateStoreSettings(formData);
      if (!res.success) {
        toast.error(res.error || "Failed to update settings");
        return;
      }
      toast.success("Store settings & contact information updated successfully!");
    } catch (err: any) {
      toast.error(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
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

        {/* Meta (Facebook & Instagram) Ads & Tracking */}
        <div className="bg-[#131722] p-5 sm:p-6 rounded-xl border border-neutral-800/80 shadow-sm space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-neutral-800 pb-3">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#1877F2]" />
              <div>
                <h3 className="text-sm font-bold uppercase tracking-wider text-white">
                  Meta Ads & Pixel Integration
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Client-side Meta Pixel & Server-Side Conversions API (CAPI) configuration
                </p>
              </div>
            </div>

            {/* Enable/Disable Toggle */}
            <label className="inline-flex items-center cursor-pointer gap-2.5 bg-neutral-900/90 border border-neutral-800 px-3 py-1.5 rounded-lg">
              <input
                type="checkbox"
                checked={formData.isMetaTrackingEnabled ?? true}
                onChange={(e) =>
                  setFormData({ ...formData, isMetaTrackingEnabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="relative w-8 h-4 bg-neutral-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#1877F2]"></div>
              <span className="text-xs font-semibold text-neutral-300">
                {formData.isMetaTrackingEnabled ? "Tracking Active" : "Tracking Disabled"}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            {/* Pixel ID */}
            <div>
              <label className="block text-neutral-300 font-bold uppercase tracking-wider mb-1">
                Meta Pixel ID / Dataset ID
              </label>
              <input
                type="text"
                value={formData.metaPixelId || ""}
                onChange={(e) => setFormData({ ...formData, metaPixelId: e.target.value })}
                placeholder="e.g. 182736459012345"
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#1877F2] font-mono"
              />
              <p className="text-[10px] text-neutral-500 mt-1">
                Found in Meta Events Manager &rarr; Settings &rarr; Pixel ID.
              </p>
            </div>

            {/* Test Event Code */}
            <div>
              <label className="block text-neutral-300 font-bold uppercase tracking-wider mb-1">
                Test Event Code (Optional)
              </label>
              <input
                type="text"
                value={formData.metaTestEventCode || ""}
                onChange={(e) => setFormData({ ...formData, metaTestEventCode: e.target.value })}
                placeholder="e.g. TEST12345 (Leave empty in production)"
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#1877F2] font-mono"
              />
              <p className="text-[10px] text-neutral-500 mt-1">
                Use only when verifying events in Meta "Test Events" tab.
              </p>
            </div>

            {/* Conversions API Access Token */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between mb-1">
                <label className="block text-neutral-300 font-bold uppercase tracking-wider">
                  Conversions API (CAPI) Access Token
                </label>
                <button
                  type="button"
                  onClick={() => setShowToken(!showToken)}
                  className="text-neutral-400 hover:text-white flex items-center gap-1 text-[11px]"
                >
                  {showToken ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                  <span>{showToken ? "Hide" : "Show"}</span>
                </button>
              </div>
              <input
                type={showToken ? "text" : "password"}
                value={formData.metaCapiToken || ""}
                onChange={(e) => setFormData({ ...formData, metaCapiToken: e.target.value })}
                placeholder="EAAGm0PX4ZC8... (Generate in Events Manager -> Settings -> Conversions API)"
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#1877F2] font-mono text-xs"
              />
              <p className="text-[10px] text-neutral-500 mt-1">
                Stored safely on the server. Never exposed to website visitors. Bypasses ad-blockers and iOS 14.5 restrictions.
              </p>
            </div>

            {/* Meta Domain Verification */}
            <div className="sm:col-span-2">
              <label className="block text-neutral-300 font-bold uppercase tracking-wider mb-1">
                Meta Domain Verification Code (Meta-tag content)
              </label>
              <input
                type="text"
                value={formData.metaDomainVerification || ""}
                onChange={(e) =>
                  setFormData({ ...formData, metaDomainVerification: e.target.value })
                }
                placeholder='e.g. 1a2b3c4d5e6f... (The content value from <meta name="facebook-domain-verification" content="..." />)'
                className="w-full px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#1877F2] font-mono text-xs"
              />
              <p className="text-[10px] text-neutral-500 mt-1">
                Used to verify domain ownership in Meta Business Settings &rarr; Brand Safety &rarr; Domains.
              </p>
            </div>
          </div>

          {/* Dynamic Catalog Feed Info Banner */}
          <div className="p-3 bg-neutral-900/60 rounded-lg border border-neutral-800 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-neutral-300">
              <Radio className="w-4 h-4 text-emerald-400" />
              <span>
                Meta Catalog RSS/XML Feed:{" "}
                <code className="bg-black/50 text-[#c19b65] px-1.5 py-0.5 rounded font-mono">
                  /api/catalog/feed.xml
                </code>
              </span>
            </div>
            <a
              href="/api/catalog/feed.xml"
              target="_blank"
              rel="noreferrer"
              className="text-neutral-400 hover:text-white inline-flex items-center gap-1 text-[11px] underline"
            >
              <span>View Feed</span>
              <ExternalLink className="w-3 h-3" />
            </a>
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
