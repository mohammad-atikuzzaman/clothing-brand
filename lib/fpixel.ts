// Client-side Meta Pixel Utilities

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
    _fbq?: (...args: any[]) => void;
  }
}

/**
 * Track standard page view
 */
export const pageview = (eventId?: string) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (eventId) {
      window.fbq("track", "PageView", {}, { eventID: eventId });
    } else {
      window.fbq("track", "PageView");
    }
  }
};

/**
 * Track standard or custom events with optional deduplication eventID
 */
export const trackEvent = (
  eventName: string,
  options: Record<string, any> = {},
  eventId?: string
) => {
  if (typeof window !== "undefined" && typeof window.fbq === "function") {
    if (eventId) {
      window.fbq("track", eventName, options, { eventID: eventId });
    } else {
      window.fbq("track", eventName, options);
    }
  }
};
