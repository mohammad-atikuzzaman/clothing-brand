"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { UploadCloud, Loader2, CheckCircle2, AlertCircle, X, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import { uploadImageToCloudinary } from "@/actions/upload";
import { toast } from "sonner";

interface CloudinaryUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
  folder?: string;
}

export function CloudinaryUpload({
  value,
  onChange,
  label = "Product Image",
}: CloudinaryUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<"file" | "url">("file");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file (JPG, PNG, WEBP).");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds 10MB limit.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    const toastId = toast.loading("Uploading image to Cloudinary...");

    try {
      const res = await uploadImageToCloudinary(formData);

      if (!res.success || !res.url) {
        toast.error(res.error || "Failed to upload image", { id: toastId });
        return;
      }

      onChange(res.url);
      toast.success("Image uploaded to Cloudinary successfully!", { id: toastId });
    } catch (err: any) {
      toast.error(err.message || "Upload failed. Please check your connection.", { id: toastId });
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="block text-neutral-400 font-bold uppercase tracking-wider text-xs">
          {label}
        </label>
        <div className="flex items-center gap-2 text-[10px]">
          <button
            type="button"
            onClick={() => setMode("file")}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === "file"
                ? "bg-[#c19b65] text-black font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Upload File
          </button>
          <button
            type="button"
            onClick={() => setMode("url")}
            className={`px-2 py-0.5 rounded transition-colors ${
              mode === "url"
                ? "bg-[#c19b65] text-black font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Paste URL
          </button>
        </div>
      </div>

      {mode === "file" ? (
        <div>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />

          {value ? (
            <div className="relative flex items-center gap-3 p-3 bg-neutral-900 border border-neutral-800 rounded-xl overflow-hidden">
              <div className="relative w-16 h-20 bg-neutral-800 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-700">
                <Image
                  src={value}
                  alt="Product preview"
                  fill
                  className="object-cover"
                  sizes="64px"
                  unoptimized
                />
              </div>

              <div className="flex-1 min-w-0">
                <span className="text-xs text-white font-medium block truncate">
                  {value}
                </span>
                <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-0.5">
                  <CheckCircle2 className="w-3 h-3" />
                  {value.includes("cloudinary.com") ? "Hosted on Cloudinary" : "External Image"}
                </span>

                <div className="flex items-center gap-2 mt-2">
                  <button
                    type="button"
                    disabled={isUploading}
                    onClick={() => fileInputRef.current?.click()}
                    className="text-[11px] px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-200 transition-colors cursor-pointer"
                  >
                    Change Image
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange("")}
                    className="text-[11px] px-2.5 py-1 rounded bg-red-500/10 hover:bg-red-500/20 text-red-400 transition-colors cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div
              onClick={() => !isUploading && fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-colors ${
                isUploading
                  ? "border-[#c19b65]/50 bg-[#c19b65]/5 cursor-wait"
                  : "border-neutral-800 hover:border-[#c19b65]/60 hover:bg-neutral-900/60 bg-neutral-900/30"
              }`}
            >
              {isUploading ? (
                <div className="flex flex-col items-center justify-center gap-2">
                  <Loader2 className="w-7 h-7 text-[#c19b65] animate-spin" />
                  <span className="text-xs font-semibold text-white">
                    Uploading to Cloudinary via Server Action...
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Optimizing and transforming image
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-1.5">
                  <div className="w-10 h-10 rounded-full bg-neutral-800 text-[#c19b65] flex items-center justify-center mb-1">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-bold text-white">
                    Click or drag image to upload
                  </span>
                  <span className="text-[10px] text-neutral-400">
                    Supports JPG, PNG, WEBP, AVIF up to 10MB
                  </span>
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex gap-2">
          <input
            type="url"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="https://res.cloudinary.com/... or https://..."
            className="flex-1 px-3.5 py-2.5 bg-neutral-900 border border-neutral-800 text-white rounded-lg focus:outline-none focus:border-[#c19b65] text-xs"
          />
          {value && (
            <div className="relative w-11 h-11 rounded bg-neutral-800 overflow-hidden flex-shrink-0 border border-neutral-700">
              <Image
                src={value}
                alt="Preview"
                fill
                className="object-cover"
                sizes="44px"
                unoptimized
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
