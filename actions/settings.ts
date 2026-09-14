"use server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { SettingModel } from "@/lib/models/Setting";
import { ensureDatabaseSeeded } from "@/lib/db/seed";
import { storeSettingsSchema, StoreSettingsInput } from "@/lib/validations/settings";
import { unstable_cache, updateTag, revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";

export interface SerializedSettings {
  storeName: string;
  tagline: string;
  hotline: string;
  whatsapp: string;
  email: string;
  address: string;
  operatingHours: string;
  shippingDhaka: number;
  shippingOutside: number;
  bkashNumber: string;
  facebookUrl: string;
  instagramUrl: string;
  metaPixelId?: string;
  metaCapiToken?: string;
  metaTestEventCode?: string;
  metaDomainVerification?: string;
  isMetaTrackingEnabled?: boolean;
}

const DEFAULT_SETTINGS: SerializedSettings = {
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
};

async function fetchSettingsFromDb(): Promise<SerializedSettings> {
  await ensureDatabaseSeeded();
  await connectToDatabase();

  const doc = await SettingModel.findOne().lean().exec();
  if (!doc) return DEFAULT_SETTINGS;

  return {
    storeName: doc.storeName || DEFAULT_SETTINGS.storeName,
    tagline: doc.tagline || DEFAULT_SETTINGS.tagline,
    hotline: doc.hotline || DEFAULT_SETTINGS.hotline,
    whatsapp: doc.whatsapp || DEFAULT_SETTINGS.whatsapp,
    email: doc.email || DEFAULT_SETTINGS.email,
    address: doc.address || DEFAULT_SETTINGS.address,
    operatingHours: doc.operatingHours || DEFAULT_SETTINGS.operatingHours,
    shippingDhaka: Number(doc.shippingDhaka ?? 70),
    shippingOutside: Number(doc.shippingOutside ?? 130),
    bkashNumber: doc.bkashNumber || DEFAULT_SETTINGS.bkashNumber,
    facebookUrl: doc.facebookUrl || DEFAULT_SETTINGS.facebookUrl,
    instagramUrl: doc.instagramUrl || DEFAULT_SETTINGS.instagramUrl,
    metaPixelId: doc.metaPixelId || "",
    // Note: metaCapiToken is excluded from public fetch for security
    metaCapiToken: "",
    metaTestEventCode: doc.metaTestEventCode || "",
    metaDomainVerification: doc.metaDomainVerification || "",
    isMetaTrackingEnabled: doc.isMetaTrackingEnabled ?? true,
  };
}

export async function getStoreSettings(): Promise<SerializedSettings> {
  const cachedFn = unstable_cache(
    fetchSettingsFromDb,
    ["store-settings"],
    { tags: ["store-settings"], revalidate: 300 }
  );

  return cachedFn();
}

/**
 * Admin-only settings getter including sensitive tokens
 */
export async function getAdminStoreSettings(): Promise<SerializedSettings> {
  await requireAdmin();
  await ensureDatabaseSeeded();
  await connectToDatabase();

  const doc = await SettingModel.findOne().lean().exec();
  if (!doc) return DEFAULT_SETTINGS;

  return {
    storeName: doc.storeName || DEFAULT_SETTINGS.storeName,
    tagline: doc.tagline || DEFAULT_SETTINGS.tagline,
    hotline: doc.hotline || DEFAULT_SETTINGS.hotline,
    whatsapp: doc.whatsapp || DEFAULT_SETTINGS.whatsapp,
    email: doc.email || DEFAULT_SETTINGS.email,
    address: doc.address || DEFAULT_SETTINGS.address,
    operatingHours: doc.operatingHours || DEFAULT_SETTINGS.operatingHours,
    shippingDhaka: Number(doc.shippingDhaka ?? 70),
    shippingOutside: Number(doc.shippingOutside ?? 130),
    bkashNumber: doc.bkashNumber || DEFAULT_SETTINGS.bkashNumber,
    facebookUrl: doc.facebookUrl || DEFAULT_SETTINGS.facebookUrl,
    instagramUrl: doc.instagramUrl || DEFAULT_SETTINGS.instagramUrl,
    metaPixelId: doc.metaPixelId || "",
    metaCapiToken: doc.metaCapiToken || "",
    metaTestEventCode: doc.metaTestEventCode || "",
    metaDomainVerification: doc.metaDomainVerification || "",
    isMetaTrackingEnabled: doc.isMetaTrackingEnabled ?? true,
  };
}

/**
 * Server-only internal accessor for Meta Conversions API
 */
export async function getInternalMetaConfig() {
  await ensureDatabaseSeeded();
  await connectToDatabase();

  const doc = await SettingModel.findOne().lean().exec();
  return {
    pixelId: doc?.metaPixelId || "",
    capiToken: doc?.metaCapiToken || "",
    testEventCode: doc?.metaTestEventCode || "",
    isEnabled: doc?.isMetaTrackingEnabled ?? true,
    domainVerification: doc?.metaDomainVerification || "",
  };
}

export async function updateStoreSettings(input: StoreSettingsInput) {
  try {
    await requireAdmin();

    const validated = storeSettingsSchema.safeParse(input);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((i) => i.message).join(", "),
      };
    }

    await connectToDatabase();

    const updated = await SettingModel.findOneAndUpdate(
      {},
      validated.data,
      { new: true, upsert: true, setDefaultsOnInsert: true }
    )
      .lean()
      .exec();

    // Invalidate cached settings immediately
    updateTag("store-settings");
    revalidatePath("/");
    revalidatePath("/checkout");
    revalidatePath("/contact-us");
    revalidatePath("/admin/settings");

    return {
      success: true,
      data: updated,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to update store settings",
    };
  }
}
