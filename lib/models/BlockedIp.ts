import mongoose, { Schema, Model, Document } from "mongoose";

export interface IBlockedIpDocument extends Document {
  ip: string;
  reason: string;
  failedAttempts: number;
  bannedUntil?: Date | null;
  isPermanent: boolean;
  bannedBy: string; // 'SYSTEM_AUTO' or admin email
  createdAt: Date;
  updatedAt: Date;
}

const BlockedIpSchema = new Schema<IBlockedIpDocument>(
  {
    ip: {
      type: String,
      required: [true, "IP address is required"],
      unique: true,
      trim: true,
      index: true,
    },
    reason: {
      type: String,
      required: [true, "Ban reason is required"],
      default: "Suspicious activity detected",
    },
    failedAttempts: {
      type: Number,
      default: 1,
    },
    bannedUntil: {
      type: Date,
      default: null,
      index: true,
    },
    isPermanent: {
      type: Boolean,
      default: false,
      index: true,
    },
    bannedBy: {
      type: String,
      default: "SYSTEM_AUTO",
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

BlockedIpSchema.index({ ip: 1, isPermanent: 1, bannedUntil: 1 });

export const BlockedIpModel: Model<IBlockedIpDocument> =
  mongoose.models.BlockedIp ||
  mongoose.model<IBlockedIpDocument>("BlockedIp", BlockedIpSchema);
