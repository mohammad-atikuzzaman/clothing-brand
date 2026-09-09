import mongoose, { Schema, Model, Document } from "mongoose";

export type SecurityEventType =
  | "login_failed"
  | "login_success"
  | "rate_limit_exceeded"
  | "ip_banned"
  | "ip_unblocked"
  | "unauthorized_admin_access"
  | "suspicious_request";

export interface ISecurityLogDocument extends Document {
  ip: string;
  eventType: SecurityEventType;
  email?: string;
  details: string;
  userAgent?: string;
  createdAt: Date;
}

const SecurityLogSchema = new Schema<ISecurityLogDocument>(
  {
    ip: {
      type: String,
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      required: true,
      index: true,
    },
    email: {
      type: String,
      default: "",
      index: true,
    },
    details: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      default: "",
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 60 * 60 * 24 * 30, // Auto delete after 30 days (TTL index)
    },
  },
  {
    timestamps: false,
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

SecurityLogSchema.index({ createdAt: -1 });
SecurityLogSchema.index({ ip: 1, createdAt: -1 });

export const SecurityLogModel: Model<ISecurityLogDocument> =
  mongoose.models.SecurityLog ||
  mongoose.model<ISecurityLogDocument>("SecurityLog", SecurityLogSchema);
