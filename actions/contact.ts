"use server";

import { connectToDatabase } from "@/lib/db/mongoose";
import { ContactMessageModel } from "@/lib/models/ContactMessage";
import { contactMessageSchema, ContactMessageInput } from "@/lib/validations/contact";
import { revalidatePath } from "next/cache";
import { requireAdmin, getClientIp } from "@/lib/auth";
import { isIpBanned, checkRateLimit } from "@/lib/security";

export interface SerializedContactMessage {
  id: string;
  name: string;
  email?: string;
  phone: string;
  company?: string;
  message: string;
  status: "Unread" | "Replied" | "Archived";
  createdAt: string;
}

export async function submitContactMessage(rawInput: ContactMessageInput) {
  try {
    const ip = await getClientIp();

    // 1. IP Ban check
    const banStatus = await isIpBanned(ip);
    if (banStatus.banned) {
      return {
        success: false,
        error: "Your network IP has been restricted.",
      };
    }

    // 2. Anti-spam rate limiting: max 5 messages per 10 minutes per IP
    const rateLimit = checkRateLimit(`contact:${ip}`, 5, 600);
    if (!rateLimit.allowed) {
      return {
        success: false,
        error: "Too many contact messages submitted. Please try again later.",
      };
    }

    const validated = contactMessageSchema.safeParse(rawInput);
    if (!validated.success) {
      return {
        success: false,
        error: validated.error.issues.map((i) => i.message).join(", "),
      };
    }

    await connectToDatabase();

    const created = await ContactMessageModel.create(validated.data);

    revalidatePath("/admin/messages");

    return {
      success: true,
      data: {
        id: created._id.toString(),
        name: created.name,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      error: "Failed to submit message. Please try again later.",
    };
  }
}

export async function getContactMessages(): Promise<SerializedContactMessage[]> {
  try {
    await requireAdmin();
    await connectToDatabase();
    const docs = await ContactMessageModel.find()
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return docs.map((d: any) => ({
      id: d._id.toString(),
      name: d.name,
      email: d.email || "",
      phone: d.phone,
      company: d.company || "",
      message: d.message,
      status: d.status,
      createdAt: new Date(d.createdAt).toISOString(),
    }));
  } catch (error) {
    console.error("Failed to get messages:", error);
    return [];
  }
}

export async function updateMessageStatus(
  id: string,
  status: "Unread" | "Replied" | "Archived"
) {
  try {
    await requireAdmin();
    await connectToDatabase();
    await ContactMessageModel.findByIdAndUpdate(id, { status });
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error: any) {
    console.error("Update message status error:", error);
    return { success: false, error: "Failed to update message status" };
  }
}

export async function deleteContactMessage(id: string) {
  try {
    await requireAdmin();
    await connectToDatabase();
    await ContactMessageModel.findByIdAndDelete(id);
    revalidatePath("/admin/messages");
    return { success: true };
  } catch (error: any) {
    console.error("Delete contact message error:", error);
    return { success: false, error: "Failed to delete message" };
  }
}
