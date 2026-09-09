"use server";

import { requireAdmin } from "@/lib/auth";
import { connectDB } from "@/lib/db/mongoose";
import { BlockedIpModel } from "@/lib/models/BlockedIp";
import { SecurityLogModel } from "@/lib/models/SecurityLog";
import { banIpManually, unbanIp } from "@/lib/security";
import { blockIpSchema, BlockIpInput } from "@/lib/validations/auth";

export interface BlockedIpItem {
  id: string;
  ip: string;
  reason: string;
  failedAttempts: number;
  bannedUntil: string | null;
  isPermanent: boolean;
  bannedBy: string;
  createdAt: string;
}

export interface SecurityLogItem {
  id: string;
  ip: string;
  eventType: string;
  email?: string;
  details: string;
  userAgent?: string;
  createdAt: string;
}

/**
 * Server Action: Get all currently blocked IPs (Admin only)
 */
export async function getBlockedIpsAction(): Promise<{
  success: boolean;
  data: BlockedIpItem[];
  error?: string;
}> {
  try {
    await requireAdmin();
    await connectDB();

    const records = await BlockedIpModel.find().sort({ createdAt: -1 }).lean();

    const data: BlockedIpItem[] = records.map((r: any) => ({
      id: r._id.toString(),
      ip: r.ip,
      reason: r.reason,
      failedAttempts: r.failedAttempts,
      bannedUntil: r.bannedUntil ? new Date(r.bannedUntil).toISOString() : null,
      isPermanent: !!r.isPermanent,
      bannedBy: r.bannedBy,
      createdAt: new Date(r.createdAt).toISOString(),
    }));

    return { success: true, data };
  } catch (error: any) {
    return { success: false, data: [], error: error.message || "Unauthorized access" };
  }
}

/**
 * Server Action: Unblock an IP address (Admin only)
 */
export async function unblockIpAction(ip: string): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await requireAdmin();
    await unbanIp(ip, admin.email);
    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to unblock IP" };
  }
}

/**
 * Server Action: Manually block an IP address (Admin only)
 */
export async function manuallyBlockIpAction(
  input: BlockIpInput
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = await requireAdmin();
    const parsed = blockIpSchema.safeParse(input);
    if (!parsed.success) {
      return { success: false, error: "Invalid IP block parameters" };
    }

    const { ip, reason, durationMinutes, isPermanent } = parsed.data;

    await banIpManually({
      ip,
      reason,
      bannedBy: admin.email,
      durationMinutes,
      isPermanent,
    });

    return { success: true };
  } catch (error: any) {
    return { success: false, error: error.message || "Failed to block IP" };
  }
}

/**
 * Server Action: Get recent security logs (Admin only)
 */
export async function getSecurityLogsAction(
  limit: number = 50
): Promise<{ success: boolean; data: SecurityLogItem[]; error?: string }> {
  try {
    await requireAdmin();
    await connectDB();

    const logs = await SecurityLogModel.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const data: SecurityLogItem[] = logs.map((l: any) => ({
      id: l._id.toString(),
      ip: l.ip,
      eventType: l.eventType,
      email: l.email || "",
      details: l.details,
      userAgent: l.userAgent || "",
      createdAt: new Date(l.createdAt).toISOString(),
    }));

    return { success: true, data };
  } catch (error: any) {
    return { success: false, data: [], error: error.message || "Unauthorized access" };
  }
}
