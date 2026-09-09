import mongoose, { Schema, Model, Document } from "mongoose";

export interface IProductDocument extends Document {
  name: string;
  slug: string;
  category: string;
  categorySlug: string;
  regularPrice: number;
  salePrice: number;
  discountPercentage: number;
  image: string;
  galleryImages: string[];
  stockQuantity: number;
  inStock: boolean;
  featured: boolean;
  sizes: string[];
  description: string;
  fabric: string;
  fit: string;
  sku: string;
  rating: number;
  reviewsCount: number;
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProductDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    category: { type: String, required: true, index: true, trim: true },
    categorySlug: { type: String, required: true, index: true, lowercase: true, trim: true },
    regularPrice: { type: Number, required: true, min: 0 },
    salePrice: { type: Number, required: true, min: 0 },
    discountPercentage: { type: Number, default: 0, min: 0, max: 100 },
    image: { type: String, required: true, trim: true },
    galleryImages: { type: [String], default: [] },
    stockQuantity: { type: Number, default: 100, min: 0 },
    inStock: { type: Boolean, default: true, index: true },
    featured: { type: Boolean, default: false, index: true },
    sizes: { type: [String], default: ["38", "40", "42", "44"] },
    description: { type: String, default: "" },
    fabric: { type: String, default: "100% Premium Combed Cotton" },
    fit: { type: String, default: "Semi-Slim Fit" },
    sku: { type: String, required: true, trim: true, uppercase: true },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    reviewsCount: { type: Number, default: 0, min: 0 },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: function (_, ret: Record<string, any>) {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// Indexes for high performance queries
ProductSchema.index({ featured: 1, createdAt: -1 });
ProductSchema.index({ categorySlug: 1, inStock: 1, salePrice: 1 });
ProductSchema.index({ name: "text", description: "text", sku: "text" });

export const ProductModel: Model<IProductDocument> =
  mongoose.models.Product || mongoose.model<IProductDocument>("Product", ProductSchema);
