import mongoose, { Schema, Model, Document } from "mongoose";

export interface IContactMessageDocument extends Document {
  name: string;
  email?: string;
  phone: string;
  company?: string;
  message: string;
  status: "Unread" | "Replied" | "Archived";
  createdAt: Date;
  updatedAt: Date;
}

const ContactMessageSchema = new Schema<IContactMessageDocument>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    phone: { type: String, required: true, trim: true },
    company: { type: String, trim: true },
    message: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ["Unread", "Replied", "Archived"],
      default: "Unread",
      index: true,
    },
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

ContactMessageSchema.index({ createdAt: -1 });

export const ContactMessageModel: Model<IContactMessageDocument> =
  mongoose.models.ContactMessage ||
  mongoose.model<IContactMessageDocument>("ContactMessage", ContactMessageSchema);
