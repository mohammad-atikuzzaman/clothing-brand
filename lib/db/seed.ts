import { connectToDatabase } from "./mongoose";
import { ProductModel } from "../models/Product";
import { SettingModel } from "../models/Setting";
import { UserModel } from "../models/User";
import { PRODUCTS } from "@/data/products";
import bcrypt from "bcryptjs";

let isSeeded = false;

export async function ensureDatabaseSeeded() {
  if (isSeeded) return;

  await connectToDatabase();

  try {
    // 1. Seed initial admin user if no admin exists
    const adminCount = await UserModel.countDocuments({ role: "admin" });
    if (adminCount === 0) {
      console.log("Seeding default administrative account...");
      const adminEmail = process.env.INITIAL_ADMIN_EMAIL || "admin@izhaan.com";
      const adminPassword = process.env.INITIAL_ADMIN_PASSWORD || "Admin@Izhaan2026!";
      const hashedPassword = await bcrypt.hash(adminPassword, 12);

      await UserModel.findOneAndUpdate(
        { email: adminEmail },
        {
          name: "Izhaan Super Admin",
          email: adminEmail,
          password: hashedPassword,
          role: "admin",
          phone: "+880 1888-299388",
          isBanned: false,
        },
        { upsert: true, new: true }
      );
      console.log(`Successfully initialized admin account: ${adminEmail}`);
    }

    const productCount = await ProductModel.countDocuments();
    if (productCount === 0) {
      console.log("Seeding initial products into MongoDB...");
      const docsToInsert = PRODUCTS.map((p) => {
        const { id, ...rest } = p;
        return {
          ...rest,
          stockQuantity: 100,
          // ensure clean unique slug & sku
          slug: rest.slug || rest.name.toLowerCase().replace(/[^a-z0-9]+/g, "-"),
          sku: rest.sku || `IZH-${Math.floor(100 + Math.random() * 900)}`,
        };
      });

      await ProductModel.insertMany(docsToInsert, { ordered: false });
      console.log(`Successfully seeded ${docsToInsert.length} products.`);
    } else {
      // Ensure existing products have stockQuantity initialized
      await ProductModel.updateMany(
        { stockQuantity: { $exists: false } },
        { $set: { stockQuantity: 100 } }
      );
    }

    const settingCount = await SettingModel.countDocuments();
    if (settingCount === 0) {
      console.log("Seeding default store settings...");
      await SettingModel.create({
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
      });
      console.log("Successfully seeded store settings.");
    }

    isSeeded = true;
  } catch (error: any) {
    if (error?.code === 11000 || error?.name === "MongoBulkWriteError") {
      // Handled: another worker already completed the seed
      isSeeded = true;
      return;
    }
    console.error("Database seeding error:", error);
  }
}
