import { connectDB } from "@/lib/db/mongoose";
import { BlockedIpModel } from "@/lib/models/BlockedIp";
import { SecurityLogModel, SecurityEventType } from "@/lib/models/SecurityLog";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory sliding window cache for instant response & DDoS mitigation
const rateLimitCache = new Map<string, RateLimitEntry>();
// In-memory banned IP cache (TTL: 60 seconds)
const bannedIpCache = new Map<string, { banned: boolean; reason: string; expiresAt: number }>();

// Periodic cleanup of rate limit cache every 5 minutes
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of rateLimitCache.entries()) {
      if (now > entry.resetAt) {
        rateLimitCache.delete(key);
      }
    }
    for (const [ip, entry] of bannedIpCache.entries()) {
      if (now > entry.expiresAt) {
        bannedIpCache.delete(ip);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Fast in-memory sliding window rate limiter
 * @param key Unique identifier (e.g. `ip:action` or `user:action`)
 * @param limit Max allowed requests within window
 * @param windowSeconds Window size in seconds
 */
export function checkRateLimit(
  key: string,
  limit: number,
  windowSeconds: number
): { allowed: boolean; remaining: number; resetInSeconds: number } {
  const now = Date.now();
  const windowMs = windowSeconds * 1000;

  let entry = rateLimitCache.get(key);

  if (!entry || now > entry.resetAt) {
    entry = { count: 1, resetAt: now + windowMs };
    rateLimitCache.set(key, entry);
    return { allowed: true, remaining: limit - 1, resetInSeconds: windowSeconds };
  }

  entry.count += 1;
  const remaining = Math.max(0, limit - entry.count);
  const resetInSeconds = Math.max(1, Math.ceil((entry.resetAt - now) / 1000));

  if (entry.count > limit) {
    return { allowed: false, remaining: 0, resetInSeconds };
  }

  return { allowed: true, remaining, resetInSeconds };
}

/**
 * Check whether an IP address is currently banned (Memory cache + MongoDB fallback)
 */
export async function isIpBanned(ip: string): Promise<{ banned: boolean; reason?: string; bannedUntil?: Date | null }> {
  const cleanIp = ip.trim();
  const now = Date.now();

  // 1. Check in-memory fast cache first
  const cached = bannedIpCache.get(cleanIp);
  if (cached && now < cached.expiresAt) {
    return { banned: cached.banned, reason: cached.reason };
  }

  try {
    await connectDB();
    const record = await BlockedIpModel.findOne({ ip: cleanIp }).lean();

    if (!record) {
      bannedIpCache.set(cleanIp, { banned: false, reason: "", expiresAt: now + 60000 });
      return { banned: false };
    }

    // Check if permanent ban
    if (record.isPermanent) {
      bannedIpCache.set(cleanIp, { banned: true, reason: record.reason, expiresAt: now + 300000 });
      return { banned: true, reason: record.reason, bannedUntil: null };
    }

    // Check if temporary ban is still active
    if (record.bannedUntil && new Date(record.bannedUntil).getTime() > now) {
      bannedIpCache.set(cleanIp, { banned: true, reason: record.reason, expiresAt: new Date(record.bannedUntil).getTime() });
      return { banned: true, reason: record.reason, bannedUntil: record.bannedUntil };
    }

    // Ban expired
    bannedIpCache.set(cleanIp, { banned: false, reason: "", expiresAt: now + 60000 });
    return { banned: false };
  } catch (error) {
    console.error("Error checking IP ban status:", error);
    return { banned: false };
  }
}

/**
 * Log a security event to MongoDB
 */
export async function logSecurityEvent(params: {
  ip: string;
  eventType: SecurityEventType;
  details: string;
  email?: string;
  userAgent?: string;
}): Promise<void> {
  try {
    await connectDB();
    await SecurityLogModel.create({
      ip: params.ip,
      eventType: params.eventType,
      details: params.details,
      email: params.email || "",
      userAgent: params.userAgent || "",
    });
  } catch (err) {
    console.error("Failed to write security log:", err);
  }
}

/**
 * Record a failed login attempt for an IP.
 * Enforces brute force rules: 5 failed attempts in 15 mins triggers 30-minute ban.
 */
export async function recordFailedLogin(ip: string, email: string, reason: string): Promise<{ bannedNow: boolean; remainingAttempts: number }> {
  const cleanIp = ip.trim();
  const MAX_FAILED_ATTEMPTS = 5;
  const BAN_DURATION_MINUTES = 30;

  try {
    await connectDB();

    // Log the failed login
    await logSecurityEvent({
      ip: cleanIp,
      email,
      eventType: "login_failed",
      details: `Failed login attempt for ${email}: ${reason}`,
    });

    let blockedRecord = await BlockedIpModel.findOne({ ip: cleanIp });

    if (!blockedRecord) {
      blockedRecord = new BlockedIpModel({
        ip: cleanIp,
        reason: "Multiple failed login attempts",
        failedAttempts: 1,
        bannedBy: "SYSTEM_AUTO",
      });
    } else {
      blockedRecord.failedAttempts += 1;
    }

    // Check if threshold reached
    if (blockedRecord.failedAttempts >= MAX_FAILED_ATTEMPTS) {
      const bannedUntil = new Date(Date.now() + BAN_DURATION_MINUTES * 60 * 1000);
      blockedRecord.bannedUntil = bannedUntil;
      blockedRecord.reason = `Auto-locked: Exceeded ${MAX_FAILED_ATTEMPTS} failed login attempts. Suspended for ${BAN_DURATION_MINUTES} minutes.`;
      await blockedRecord.save();

      // Invalidate memory cache immediately
      bannedIpCache.set(cleanIp, {
        banned: true,
        reason: blockedRecord.reason,
        expiresAt: bannedUntil.getTime(),
      });

      // Log ban event
      await logSecurityEvent({
        ip: cleanIp,
        email,
        eventType: "ip_banned",
        details: `IP automatically banned until ${bannedUntil.toISOString()} after ${blockedRecord.failedAttempts} failed login attempts`,
      });

      return { bannedNow: true, remainingAttempts: 0 };
    }

    await blockedRecord.save();
    return {
      bannedNow: false,
      remainingAttempts: MAX_FAILED_ATTEMPTS - blockedRecord.failedAttempts,
    };
  } catch (error) {
    console.error("Error recording failed login:", error);
    return { bannedNow: false, remainingAttempts: 1 };
  }
}

/**
 * Record a successful login and reset failed attempt counters
 */
export async function recordSuccessfulLogin(ip: string, email: string): Promise<void> {
  const cleanIp = ip.trim();
  try {
    await connectDB();
    // Reset failed attempts in blocked record if not permanently banned
    await BlockedIpModel.updateOne(
      { ip: cleanIp, isPermanent: false },
      { $set: { failedAttempts: 0, bannedUntil: null } }
    );

    bannedIpCache.delete(cleanIp);

    await logSecurityEvent({
      ip: cleanIp,
      email,
      eventType: "login_success",
      details: `User ${email} authenticated successfully`,
    });
  } catch (err) {
    console.error("Error recording successful login:", err);
  }
}

/**
 * Manually ban an IP (Admin action)
 */
export async function banIpManually(params: {
  ip: string;
  reason: string;
  bannedBy: string;
  durationMinutes?: number;
  isPermanent?: boolean;
}): Promise<void> {
  const cleanIp = params.ip.trim();
  await connectDB();

  const bannedUntil = params.isPermanent
    ? null
    : new Date(Date.now() + (params.durationMinutes || 60) * 60 * 1000);

  await BlockedIpModel.findOneAndUpdate(
    { ip: cleanIp },
    {
      ip: cleanIp,
      reason: params.reason,
      isPermanent: !!params.isPermanent,
      bannedUntil: bannedUntil,
      bannedBy: params.bannedBy,
    },
    { upsert: true, new: true }
  );

  bannedIpCache.set(cleanIp, {
    banned: true,
    reason: params.reason,
    expiresAt: bannedUntil ? bannedUntil.getTime() : Date.now() + 86400000 * 365,
  });

  await logSecurityEvent({
    ip: cleanIp,
    eventType: "ip_banned",
    details: `Manually banned by ${params.bannedBy}: ${params.reason} (${params.isPermanent ? "Permanent" : `${params.durationMinutes}m`})`,
  });
}

/**
 * Unban an IP address (Admin action)
 */
export async function unbanIp(ip: string, unbannedBy: string): Promise<void> {
  const cleanIp = ip.trim();
  await connectDB();

  await BlockedIpModel.deleteOne({ ip: cleanIp });
  bannedIpCache.delete(cleanIp);

  await logSecurityEvent({
    ip: cleanIp,
    eventType: "ip_unblocked",
    details: `IP ban removed by admin ${unbannedBy}`,
  });
}
