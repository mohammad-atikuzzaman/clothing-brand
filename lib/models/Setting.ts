import mongoose, { Schema, Model, Document } from "mongoose";

export interface ISettingDocument extends Document {
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
  createdAt: Date;
  updatedAt: Date;
}

const SettingSchema = new Schema<ISettingDocument>(
  {
    storeName: { type: String, default: "Izhaan Lifestyle" },
    tagline: { type: String, default: "Elegance Redefined | Premium Menswear & Panjabi" },
    hotline: { type: String, default: "+880 1888-299388" },
    whatsapp: { type: String, default: "+880 1888-299388" },
    email: { type: String, default: "support@izhaanlifestyle.com" },
    address: { type: String, default: "Level 4, Plot 12, Road 11, Banani, Dhaka-1213, Bangladesh" },
    operatingHours: { type: String, default: "Everyday: 10:00 AM - 10:00 PM (GMT+6)" },
    shippingDhaka: { type: Number, default: 70 },
    shippingOutside: { type: Number, default: 130 },
    bkashNumber: { type: String, default: "01888299388 (Merchant)" },
    facebookUrl: { type: String, default: "https://facebook.com/izhaanlifestyle" },
    instagramUrl: { type: String, default: "https://instagram.com/izhaanlifestyle" },
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

export const SettingModel: Model<ISettingDocument> =
  mongoose.models.Setting || mongoose.model<ISettingDocument>("Setting", SettingSchema);
