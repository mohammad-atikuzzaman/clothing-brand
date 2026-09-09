import mongoose, { Schema, Model, Document } from "mongoose";

export interface ICategoryDocument extends Document {
  name: string;
  slug: string;
  image: string;
  tagline: string;
  description: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategoryDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, index: true, lowercase: true, trim: true },
    image: { type: String, default: "", trim: true },
    tagline: { type: String, default: "", trim: true },
    description: { type: String, default: "", trim: true },
    order: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
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

CategorySchema.index({ order: 1, createdAt: 1 });

export const CategoryModel: Model<ICategoryDocument> =
  mongoose.models.Category || mongoose.model<ICategoryDocument>("Category", CategorySchema);
