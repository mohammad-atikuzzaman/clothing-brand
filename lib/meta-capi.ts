import crypto from "crypto";
import { getInternalMetaConfig } from "@/actions/settings";
import { headers, cookies } from "next/headers";

/**
 * SHA-256 hash helper according to Meta's data requirements
 */
function hashString(val: string): string {
  return crypto
    .createHash("sha256")
    .update(val.trim().toLowerCase())
    .digest("hex");
}

export interface MetaCapiEventPayload {
  eventName: "Purchase" | "InitiateCheckout" | "AddToCart" | "ViewContent" | "PageView" | string;
  eventId: string; // Used for deduplication matching client-side fbq eventID
  eventSourceUrl?: string;
  user?: {
    email?: string;
    phone?: string;
    name?: string;
    clientIp?: string;
    userAgent?: string;
  };
  customData?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_category?: string;
    content_ids?: string[];
    content_type?: string;
    contents?: Array<{ id: string; quantity: number; item_price?: number }>;
    num_items?: number;
    order_id?: string;
    [key: string]: any;
  };
}

/**
 * Send an event to Meta Conversions API (CAPI) from server
 * Non-blocking, fails gracefully so it never disrupts store flow
 */
export async function sendMetaCapiEvent(payload: MetaCapiEventPayload): Promise<boolean> {
  try {
    const config = await getInternalMetaConfig();

    if (!config.isEnabled || !config.pixelId || !config.capiToken) {
      // Tracking disabled or missing credentials
      return false;
    }

    // Try to get headers and cookies from incoming request
    let clientIp = payload.user?.clientIp;
    let clientUserAgent = payload.user?.userAgent;
    let fbp: string | undefined;
    let fbc: string | undefined;

    try {
      const reqHeaders = await headers();
      if (!clientIp) {
        clientIp =
          reqHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
          reqHeaders.get("x-real-ip") ||
          "";
      }
      if (!clientUserAgent) {
        clientUserAgent = reqHeaders.get("user-agent") || "";
      }

      const cookieStore = await cookies();
      fbp = cookieStore.get("_fbp")?.value;
      fbc = cookieStore.get("_fbc")?.value;
    } catch {
      // Background or static context where headers/cookies might not be available
    }

    const userData: Record<string, any> = {};

    if (payload.user?.email) {
      userData.em = [hashString(payload.user.email)];
    }

    if (payload.user?.phone) {
      // Normalize phone: remove any non-digit characters except optional leading '+'
      const normalizedPhone = payload.user.phone.replace(/[^\d+]/g, "");
      userData.ph = [hashString(normalizedPhone)];
    }

    if (clientIp) {
      userData.client_ip_address = clientIp;
    }

    if (clientUserAgent) {
      userData.client_user_agent = clientUserAgent;
    }

    if (fbp) {
      userData.fbp = fbp;
    }

    if (fbc) {
      userData.fbc = fbc;
    }

    const eventTime = Math.floor(Date.now() / 1000);

    const body: Record<string, any> = {
      data: [
        {
          event_name: payload.eventName,
          event_time: eventTime,
          event_id: payload.eventId,
          event_source_url:
            payload.eventSourceUrl ||
            process.env.NEXT_PUBLIC_APP_URL ||
            "https://izhaanlifestyle.com",
          action_source: "website",
          user_data: userData,
          custom_data: payload.customData || {},
        },
      ],
    };

    if (config.testEventCode) {
      body.test_event_code = config.testEventCode;
    }

    const endpoint = `https://graph.facebook.com/v19.0/${encodeURIComponent(
      config.pixelId
    )}/events?access_token=${encodeURIComponent(config.capiToken)}`;

    // Asynchronous non-blocking fetch with 4s timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`[Meta CAPI] Event ${payload.eventName} failed:`, errorText);
      return false;
    }

    return true;
  } catch (err: any) {
    console.warn(`[Meta CAPI] Error sending event:`, err.message);
    return false;
  }
}
