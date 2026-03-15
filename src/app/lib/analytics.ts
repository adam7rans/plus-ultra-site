// ─────────────────────────────────────────────────────────────────────────────
// Plus Ultra — Analytics & Attribution
//
// PRIVACY PHILOSOPHY:
//   We use Plausible Analytics — cookieless, GDPR/CCPA compliant, no PII
//   collected, no cross-site tracking. Consistent with our "Nothing to Hide"
//   open-source commitment.
//
// SETUP (2 steps):
//   1. Create a free account at https://plausible.io
//   2. Set PLAUSIBLE_DOMAIN below to your registered domain (e.g. "plusultra.app")
//   3. Set ANALYTICS_ENABLED = true
//
// ATTRIBUTION SETUP:
//   Replace APP_STORE_ID and PLAY_STORE_ID with your real store IDs.
//   For advanced attribution (AppsFlyer / Branch.io), replace the link
//   generators below with your SDK-provided deep links.
// ─────────────────────────────────────────────────────────────────────────────

// ─── Configuration ────────────────────────────────────────────────────────────
export const ANALYTICS_ENABLED = false;               // ← set true in production
export const PLAUSIBLE_DOMAIN   = "plusultra.app";    // ← your Plausible domain
export const SITE_URL           = "https://plusultra.app"; // ← canonical base URL

// App store IDs — replace with real ones
const APP_STORE_ID   = "000000000";  // ← Apple App Store numeric ID
const PLAY_STORE_PKG = "app.plusultra"; // ← Android package name

// ─── Types ────────────────────────────────────────────────────────────────────
declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: { props?: Record<string, string | number>; callback?: () => void }
    ) => void;
  }
}

// ─── Event Tracking ───────────────────────────────────────────────────────────
/**
 * Track a custom event in Plausible.
 * In development mode, events are logged to the console instead.
 *
 * @example
 * trackEvent("Download Click", { platform: "ios", source: "navbar" });
 */
export function trackEvent(
  eventName: string,
  props?: Record<string, string | number>
): void {
  if (import.meta.env?.DEV) {
    console.log(`[Analytics] ${eventName}`, props ?? {});
  }
  if (ANALYTICS_ENABLED && typeof window !== "undefined" && window.plausible) {
    window.plausible(eventName, { props });
  }
}

// ─── Pre-defined events (keeps naming consistent across the codebase) ─────────
export const AnalyticsEvents = {
  DOWNLOAD_IOS:     "Download Click",
  DOWNLOAD_ANDROID: "Download Click",
  ADD_TO_CART:      "Add to Cart",
  BEGIN_CHECKOUT:   "Begin Checkout",
  DOCS_PDF:         "Docs PDF Download",
  TUTORIAL_START:   "Tutorial Start",
  GITHUB_CLICK:     "GitHub Click",
} as const;

// ─── Attribution link generators ─────────────────────────────────────────────
/**
 * Returns the App Store link with campaign attribution for a given source.
 * `source` examples: "navbar", "hero", "footer"
 *
 * In production, swap these for your Branch.io or AppsFlyer smart links:
 * https://branch.io  |  https://appsflyer.com
 */
export function getIosLink(source: string): string {
  return (
    `https://apps.apple.com/app/id${APP_STORE_ID}` +
    `?pt=000000&ct=${encodeURIComponent(source)}&mt=8`
  );
}

/**
 * Returns the Play Store link with UTM attribution for a given source.
 */
export function getAndroidLink(source: string): string {
  const referrer = encodeURIComponent(
    `utm_source=website&utm_medium=${source}&utm_campaign=app_download`
  );
  return (
    `https://play.google.com/store/apps/details?id=${PLAY_STORE_PKG}` +
    `&referrer=${referrer}`
  );
}

/**
 * Call this on every download button click.
 * Tracks the event AND returns the attributed deep link.
 */
export function handleDownloadClick(
  platform: "ios" | "android",
  source: string
): string {
  trackEvent(AnalyticsEvents.DOWNLOAD_IOS, { platform, source });
  return platform === "ios" ? getIosLink(source) : getAndroidLink(source);
}

// ─── SEO / Page metadata constants ───────────────────────────────────────────
export const DEFAULT_OG_IMAGE =
  "https://images.unsplash.com/photo-1703635499934-33a8fd14dbf4?w=1200&h=630&fit=crop";

export const PAGE_META = {
  home: {
    title: "Plus Ultra — Offline Survival & Prepper Community App",
    description:
      "The open-source platform for emergency preparedness. AES-256 encrypted mesh networking, offline AI, and cryptographic community vetting — all on your phone. Works when everything else fails.",
    keywords:
      "offline survival app, prepper community platform, grid down communications, mesh networking app, emergency preparedness app, bluetooth mesh, LoRa radio app, SHTF app, EMP protection",
    path: "/",
  },
  features: {
    title: "Features — Grid-Up & Grid-Down Protocols | Plus Ultra",
    description:
      "Explore Plus Ultra's full capability set: AES-256-GCM encryption, Bluetooth LE + LoRa mesh networking up to 40km, on-device AI, offline tactical maps, and cryptographic trust chains.",
    keywords:
      "LoRa mesh networking, bluetooth mesh app, offline maps, AES encryption app, local LLM, grid down communications, mesh radio app",
    path: "/features",
  },
  docs: {
    title: "Documentation — Plus Ultra Technical Reference",
    description:
      "Technical documentation for Plus Ultra: installation guides, mesh hardware setup, node vetting protocols, encryption architecture, and OPSEC best practices for grid-down scenarios.",
    keywords:
      "plus ultra documentation, mesh networking guide, LoRa setup, faraday bag guide, prepper tech docs, OPSEC guide",
    path: "/docs",
  },
  tutorials: {
    title: "Tutorials — Learn to Operate Plus Ultra",
    description:
      "Step-by-step video and text guides: set up your first mesh network, configure LoRa hardware, run SHTF protocols, harden your device, and master node vetting.",
    keywords:
      "mesh network tutorial, LoRa dongle setup, SHTF protocol, prepper tutorial, grid down tutorial, offline comms guide",
    path: "/tutorials",
  },
  store: {
    title: "Gear Store — EMP Bags, LoRa Hardware & More | Plus Ultra",
    description:
      "Purpose-built hardware for Plus Ultra mesh networking. EMP-hardened Faraday bags, LoRa range extenders, solar chargers, field radios. Ships in 2–3 days.",
    keywords:
      "faraday bag, EMP bag, LoRa dongle, mesh radio hardware, survival gear, prepper hardware, off-grid communication hardware",
    path: "/store",
  },
} as const;