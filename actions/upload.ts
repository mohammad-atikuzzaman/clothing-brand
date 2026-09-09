"use server";

import { cloudinary } from "@/lib/cloudinary";
import { requireAdmin } from "@/lib/auth";

export interface UploadResult {
  success: boolean;
  url?: string;
  publicId?: string;
  error?: string;
}

export async function uploadImageToCloudinary(formData: FormData): Promise<UploadResult> {
  try {
    await requireAdmin();

    const file = formData.get("file") as File | null;

    if (!file || file.size === 0) {
      return { success: false, error: "No image file provided" };
    }

    // Validate mime type
    if (!file.type.startsWith("image/")) {
      return { success: false, error: "Only image files (JPG, PNG, WEBP, AVIF) are allowed" };
    }

    // Max 10MB limit
    const MAX_SIZE = 10 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      return { success: false, error: "Image size must be less than 10MB" };
    }

    // Check Cloudinary configuration
    if (
      !process.env.CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return {
        success: false,
        error:
          "Cloudinary credentials are not set. Please add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET in your .env.local file.",
      };
    }

    // Convert to buffer then base64 for reliable upload
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Data = `data:${file.type};base64,${buffer.toString("base64")}`;

    const uploadResponse = await cloudinary.uploader.upload(base64Data, {
      folder: "clothing_brand/products",
      resource_type: "image",
      transformation: [
        { quality: "auto:good", fetch_format: "auto" },
      ],
    });

    return {
      success: true,
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
    };
  } catch (error: any) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: error.message || "Failed to upload image to Cloudinary",
    };
  }
}

export async function deleteImageFromCloudinary(publicId: string): Promise<{ success: boolean; error?: string }> {
  try {
    await requireAdmin();
    if (!publicId) return { success: false, error: "Public ID is required" };
    await cloudinary.uploader.destroy(publicId);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to delete image" };
  }
}
