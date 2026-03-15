/**
 * Plus Ultra — Custom Cross-Sell & Upsell Rules
 * ──────────────────────────────────────────────
 * All recommendation logic lives here. No third-party apps needed.
 * Update these maps to add/remove suggestions as the catalog grows.
 */

// ─── Frequently Bought Together (product page cross-sell) ─────────────────────

export interface CrossSellRule {
  /** Bold headline shown above the FBT widget */
  headline: string;
  /** Softer sub-text explaining the recommendation */
  subtext: string;
  /** Ordered list of product IDs to display */
  recommendedIds: string[];
}

/**
 * Key = productId of the page being viewed.
 * Value = cross-sell rule for that page.
 */
export const crossSells: Record<string, CrossSellRule> = {
  "ai-hub-scout": {
    headline: "Complete Your Grid-Down Network",
    subtext:
      "Your AI Hub is the brain — your Tribe needs a nervous system and the power to run it.",
    recommendedIds: ["tribe-comms-bundle", "solar-charger-emp"],
  },
  "ai-hub-tactical": {
    headline: "Complete Your Grid-Down Network",
    subtext:
      "Your AI Hub is the brain — your Tribe needs a nervous system and the power to run it.",
    recommendedIds: ["tribe-comms-bundle", "solar-charger-emp"],
  },
  "ai-hub-command": {
    headline: "Complete Your Grid-Down Network",
    subtext:
      "Your AI Hub is the brain — your Tribe needs a nervous system and the power to run it.",
    recommendedIds: ["tribe-comms-bundle", "solar-charger-emp"],
  },
  "tribe-comms-bundle": {
    headline: "Add the Command Brain",
    subtext:
      "Pair your Tribe's comms with an offline AI oracle to coordinate logistics and answer any survival query.",
    recommendedIds: ["ai-hub-scout", "faraday-bag-phone"],
  },
  "mesh-comm-dongle": {
    headline: "Protect & Extend Your Network",
    subtext:
      "Store nodes safely when dark, and max out range with a purpose-built antenna upgrade.",
    recommendedIds: ["faraday-bag-phone", "antenna-bundle"],
  },
  "pu-lora-dongle-v2": {
    headline: "Get the Most from Your Dongle",
    subtext:
      "Shield your device when offline and unlock extended range for every deployment scenario.",
    recommendedIds: ["antenna-bundle", "faraday-bag-phone"],
  },
  "field-radio-lora": {
    headline: "Field-Ready Power & Range",
    subtext:
      "Keep your radio charged off-grid and extend its range for every terrain type.",
    recommendedIds: ["solar-charger-emp", "antenna-bundle"],
  },
  "solar-charger-emp": {
    headline: "Protect What You're Charging",
    subtext:
      "Faraday bags keep your devices fully dark and EMP-safe when not actively charging.",
    recommendedIds: ["faraday-bag-phone", "faraday-bag-tablet"],
  },
  "comms-starter-bundle": {
    headline: "Scale Up to Command-Level",
    subtext:
      "Add an AI Command Hub to give your Tribe access to an offline oracle and central data server.",
    recommendedIds: ["ai-hub-scout"],
  },
  "faraday-bag-phone": {
    headline: "Pair With Active Comms Gear",
    subtext:
      "Protect your node when dark, and keep your mesh active when it needs to be.",
    recommendedIds: ["pu-lora-dongle-v2", "mesh-comm-dongle"],
  },
};

// ─── Variant Upsell (product page — shown when lower tier selected) ────────────

export interface VariantUpgradeRule {
  /** The variant ID that triggers this suggestion (lower tier) */
  fromVariantId: string;
  /** Index of the variant to upgrade to within the same product */
  toVariantIdx: number;
  /** Short pitch — why upgrade */
  pitch: string;
  /** Formatted price delta string e.g. "+$2,500" */
  priceDelta: string;
}

/**
 * Key = productId.
 * Value = ordered list of upgrade suggestions (from low → high tier).
 */
export const variantUpsells: Record<string, VariantUpgradeRule[]> = {
  "ai-command-hub": [
    {
      fromVariantId: "ai-hub-scout",
      toVariantIdx:  1,
      pitch:
        "Unlock the 70B model — built for complex strategic planning and multi-department logistics.",
      priceDelta: "+$2,500",
    },
    {
      fromVariantId: "ai-hub-tactical",
      toVariantIdx:  2,
      pitch:
        "Upgrade to the Command Edition — 120B reasoning handles full community-scale intelligence.",
      priceDelta: "+$4,000",
    },
  ],
  "mesh-comm-dongle": [
    {
      fromVariantId: "mesh-dongle-mobile",
      toVariantIdx:  1,
      pitch:
        "The Base Station gives your HQ a high-gain antenna for 40km range vs. 15km mobile.",
      priceDelta: "+$60",
    },
    {
      fromVariantId: "mesh-dongle-base",
      toVariantIdx:  2,
      pitch:
        "Go fully autonomous — the Solar Relay Drop-Node deploys anywhere without a power source.",
      priceDelta: "+$120",
    },
  ],
};

// ─── Cart Drawer Upsell (shown inside cart when specific products are present) ──

export interface CartUpsellRule {
  /** If ANY of these product IDs are in the cart, show this suggestion */
  triggerIds: string[];
  /** Product ID to recommend */
  recommendId: string;
  /** Short context line — why this pairs well */
  pitch: string;
}

/**
 * Ordered list — first rule whose trigger fires (and whose product isn't
 * already in the cart) will be shown in the CartDrawer upsell slot.
 */
export const cartUpsells: CartUpsellRule[] = [
  {
    triggerIds:  ["ai-hub-scout", "ai-hub-tactical", "ai-hub-command"],
    recommendId: "tribe-comms-bundle",
    pitch:       "Your Hub needs a nervous system. Equip 4 Tribe members instantly.",
  },
  {
    triggerIds:  ["tribe-comms-bundle"],
    recommendId: "ai-hub-scout",
    pitch:       "Add the offline AI oracle your Tribe comms grid was built for.",
  },
  {
    triggerIds:  ["mesh-comm-dongle", "pu-lora-dongle-v2", "field-radio-lora"],
    recommendId: "faraday-bag-phone",
    pitch:       "Keep your nodes dark and EMP-safe when not transmitting.",
  },
  {
    triggerIds:  ["field-radio-lora"],
    recommendId: "solar-charger-emp",
    pitch:       "Power your Field Radio indefinitely with EMP-hardened solar.",
  },
  {
    triggerIds:  ["comms-starter-bundle"],
    recommendId: "ai-hub-scout",
    pitch:       "Level up — add the AI Command Hub as the brain of your setup.",
  },
  {
    triggerIds:  ["solar-charger-emp"],
    recommendId: "faraday-bag-phone",
    pitch:       "Protect what you're charging. Store devices fully dark when idle.",
  },
];