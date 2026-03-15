// Mock product catalog — mirrors the shape of ShopifyProduct so the UI
// works identically whether Shopify is connected or not.

export interface ProductSpec {
  label: string;
  value: string;
}

export interface MockVariant {
  id: string;
  title: string;
  price: number;
  compareAtPrice?: number;
  available: boolean;
}

export interface MockProduct {
  id: string;
  handle: string;
  title: string;
  tagline: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  category: "Hardware" | "EMP Protection" | "Power" | "Bundles" | "Computing";
  tags: string[];
  inStock: boolean;
  badge?: string;
  badgeColor?: "green" | "amber" | "red";
  specs: ProductSpec[];
  variants?: MockVariant[];
  compatible?: string;
}

export const mockProducts: MockProduct[] = [
  {
    id: "pu-lora-dongle-v2",
    handle: "pu-lora-dongle-v2",
    title: "Plus Ultra LoRa Dongle v2",
    tagline: "Extend your mesh range to 40km+",
    description:
      "The official Plus Ultra LoRa Dongle v2 plugs directly into your phone via USB-C (or Lightning adapter) and instantly enables long-range mesh networking. Uses the 915 MHz ISM band in the US (868 MHz EU variant available). Works with the Plus Ultra app out-of-the-box — no configuration required for standard deployments. Spreading factor configurable from SF7 (urban, fast) to SF12 (40km+ range, emergency).",
    price: 89,
    images: [
      "https://images.unsplash.com/photo-1603899122911-27c0cb85824a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1617597302482-31500ac8f71d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    category: "Hardware",
    tags: ["LoRa", "mesh", "radio", "USB-C", "range-extender"],
    inStock: true,
    badge: "BESTSELLER",
    badgeColor: "green",
    specs: [
      { label: "Frequency (US)", value: "915 MHz ISM" },
      { label: "Frequency (EU)", value: "868 MHz ISM" },
      { label: "Max Range (LoS)", value: "40 km" },
      { label: "TX Power", value: "Up to 20 dBm" },
      { label: "Spreading Factor", value: "SF7 – SF12 (configurable)" },
      { label: "Interface", value: "USB-C (Lightning adapter included)" },
      { label: "Antenna", value: "3 dBi flexible (SMA, swappable)" },
      { label: "Dimensions", value: "68 × 18 × 12 mm" },
      { label: "Weight", value: "24 g" },
      { label: "Certifications", value: "FCC, CE, RoHS" },
    ],
    variants: [
      { id: "pu-lora-v2-us", title: "US (915 MHz)", price: 89, available: true },
      { id: "pu-lora-v2-eu", title: "EU (868 MHz)", price: 89, available: true },
    ],
    compatible: "iOS 16+ · Android 10+",
  },
  {
    id: "faraday-bag-phone",
    handle: "faraday-bag-phone",
    title: "Faraday EMP Bag — Phone",
    tagline: "RF-shielded protection for your primary device",
    description:
      "Military-grade Faraday bag blocks all RF emissions including cellular (2G–5G), GPS, Wi-Fi, Bluetooth, and NFC. Double-roll closure with conductive inner lining tested to exceed MIL-STD-461G standards. Compact design fits all phones up to 6.9\". Essential storage for any device you want fully dark when not in active use.",
    price: 28,
    compareAtPrice: 35,
    images: [
      "https://images.unsplash.com/photo-1769430534842-b249cd217ecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1614063733205-a1962ae9f34c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    category: "EMP Protection",
    tags: ["faraday", "EMP", "RF shielding", "OPSEC", "phone"],
    inStock: true,
    badge: "ON SALE",
    badgeColor: "amber",
    specs: [
      { label: "Shielding Standard", value: "MIL-STD-461G (tested)" },
      { label: "RF Attenuation", value: ">60 dB across 100 MHz–6 GHz" },
      { label: "Blocked Frequencies", value: "2G/3G/4G/5G, GPS, Wi-Fi, BT, NFC" },
      { label: "Interior Dimensions", value: "175 × 90 mm" },
      { label: "Material", value: "Nickel-copper fabric, nylon exterior" },
      { label: "Closure", value: "Double-roll seal (2-layer)" },
      { label: "Weight", value: "38 g" },
      { label: "Color", value: "Matte Black" },
    ],
  },
  {
    id: "faraday-bag-tablet",
    handle: "faraday-bag-tablet",
    title: "Faraday EMP Bag — Tablet",
    tagline: "Full RF blackout for tablets and laptops up to 13\"",
    description:
      "Larger Faraday bag for tablets, small laptops, external drives, and document caches. Same MIL-STD-461G-tested shielding as the phone variant. The interior anti-static lining protects sensitive electronics from both RF and electrostatic discharge. Fits up to 13\" laptops and most standard tablets with cases on.",
    price: 44,
    images: [
      "https://images.unsplash.com/photo-1614063733205-a1962ae9f34c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1769430534842-b249cd217ecc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    category: "EMP Protection",
    tags: ["faraday", "EMP", "RF shielding", "laptop", "tablet"],
    inStock: true,
    specs: [
      { label: "Shielding Standard", value: "MIL-STD-461G (tested)" },
      { label: "RF Attenuation", value: ">60 dB across 100 MHz–6 GHz" },
      { label: "Interior Dimensions", value: "365 × 270 mm" },
      { label: "Fits", value: "Up to 13\" laptop, all tablets" },
      { label: "Material", value: "Nickel-copper fabric, nylon exterior" },
      { label: "Closure", value: "Double-roll seal (2-layer)" },
      { label: "Weight", value: "85 g" },
    ],
  },
  {
    id: "solar-charger-emp",
    handle: "solar-charger-emp",
    title: "EMP-Hardened Solar Charger 30W",
    tagline: "Off-grid power — hardened against EMP surge",
    description:
      "30-watt foldable monocrystalline solar panel with a hardened charge controller tested to withstand rapid overvoltage transients consistent with EMP burst profiles. Outputs USB-A and USB-C (45W PD). Charges your Plus Ultra LoRa dongle and phone simultaneously. The charge controller circuitry is housed in a secondary Faraday enclosure inside the unit.",
    price: 119,
    images: [
      "https://images.unsplash.com/photo-1681263576084-e054b2d89903?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    category: "Power",
    tags: ["solar", "power", "EMP hardened", "off-grid", "USB-C"],
    inStock: true,
    badge: "NEW",
    badgeColor: "green",
    specs: [
      { label: "Panel Output", value: "30W peak" },
      { label: "Panel Type", value: "Monocrystalline, 22% efficiency" },
      { label: "USB-A Output", value: "5V / 3A (15W)" },
      { label: "USB-C Output", value: "5V–20V / 45W PD3.0" },
      { label: "Charge Controller", value: "MPPT, Faraday-shielded housing" },
      { label: "Folded Dimensions", value: "280 × 180 × 30 mm" },
      { label: "Open Dimensions", value: "560 × 540 mm" },
      { label: "Weight", value: "820 g" },
      { label: "Operating Temp", value: "-20°C to +60°C" },
    ],
  },
  {
    id: "field-radio-lora",
    handle: "field-radio-lora",
    title: "LoRa Field Radio — Long Range",
    tagline: "Dedicated long-range LoRa radio with 5000mAh battery",
    description:
      "A purpose-built LoRa radio transceiver with a 5000mAh integrated battery, designed for field deployment without a smartphone. Features a 2.4\" e-ink display for message viewing, physical numeric keypad for message entry, and a direct USB-C charge port. Pairs with the Plus Ultra app for full mesh integration when a phone is in range, or operates as a standalone relay node in autonomous mode.",
    price: 249,
    images: [
      "https://images.unsplash.com/photo-1576039848386-e836b8a0f8d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    category: "Hardware",
    tags: ["LoRa", "radio", "standalone", "field", "long-range"],
    inStock: true,
    badge: "PRO",
    badgeColor: "green",
    specs: [
      { label: "Frequency", value: "915 MHz (US) / 868 MHz (EU)" },
      { label: "Max Range", value: "50 km line-of-sight" },
      { label: "TX Power", value: "22 dBm" },
      { label: "Battery", value: "5000 mAh Li-Ion (72h standby)" },
      { label: "Display", value: "2.4\" e-ink, 296 × 128 px" },
      { label: "Input", value: "12-key numeric keypad + 4 function keys" },
      { label: "Waterproofing", value: "IP67" },
      { label: "USB", value: "USB-C (charge + data)" },
      { label: "Antenna", value: "SMA, 5 dBi fiberglass included" },
      { label: "Dimensions", value: "155 × 72 × 32 mm" },
      { label: "Weight", value: "380 g" },
    ],
    variants: [
      { id: "field-radio-us", title: "US (915 MHz)", price: 249, available: true },
      { id: "field-radio-eu", title: "EU (868 MHz)", price: 249, available: false },
    ],
  },
  {
    id: "mesh-relay-node-kit",
    handle: "mesh-relay-node-kit",
    title: "Mesh Relay Node Kit",
    tagline: "Deploy a fixed infrastructure relay — pre-configured",
    description:
      "Everything you need to deploy a permanent base-station relay node. Includes a Raspberry Pi 4B (2GB), Plus Ultra-compatible LoRa HAT (915/868 MHz switchable), pre-flashed SD card with Plus Ultra Node Manager, weatherproof enclosure (IP65), and a 5 dBi omni antenna with 3m coax. Flash once, mount, and forget.",
    price: 189,
    images: [
      "https://images.unsplash.com/photo-1617597302482-31500ac8f71d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    category: "Hardware",
    tags: ["mesh", "relay", "raspberry pi", "infrastructure", "node"],
    inStock: false,
    badge: "OUT OF STOCK",
    badgeColor: "red",
    specs: [
      { label: "Compute", value: "Raspberry Pi 4B, 2GB RAM" },
      { label: "LoRa Module", value: "SX1262-based HAT, 868/915 MHz" },
      { label: "TX Power", value: "Up to 22 dBm" },
      { label: "Storage", value: "32GB A2-class microSD (pre-flashed)" },
      { label: "Enclosure", value: "IP65 weatherproof ABS" },
      { label: "Antenna", value: "5 dBi omni (N-type, 3m coax included)" },
      { label: "Power Input", value: "12–24V DC (solar-compatible)" },
      { label: "Power Draw", value: "3–6W typical" },
      { label: "OS", value: "Raspberry Pi OS Lite + PU Node Manager 1.4" },
    ],
    compatible: "Plus Ultra Node Manager (macOS / Linux / Windows)",
  },
  {
    id: "antenna-bundle",
    handle: "antenna-bundle",
    title: "Tactical Antenna Bundle",
    tagline: "Three antennas for every deployment scenario",
    description:
      "A curated set of three swappable SMA antennas covering the three primary Plus Ultra deployment scenarios: urban short-range (3 dBi flex), standard field (5 dBi fiberglass), and directional point-to-point (9 dBi Yagi). All compatible with the LoRa Dongle v2, Field Radio, and Relay Node Kit. Includes a weatherproof SMA adapter kit (RP-SMA, N-type, BNC).",
    price: 67,
    images: [
      "https://images.unsplash.com/photo-1576039848386-e836b8a0f8d2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    category: "Hardware",
    tags: ["antenna", "SMA", "Yagi", "fiberglass", "range"],
    inStock: true,
    specs: [
      { label: "Included Antennas", value: "3 dBi flex, 5 dBi fiberglass, 9 dBi Yagi" },
      { label: "Connector (all)", value: "SMA male" },
      { label: "Frequency Range", value: "860–960 MHz" },
      { label: "VSWR", value: "<1.5:1 at 915 MHz" },
      { label: "Cable (Yagi)", value: "3m LMR-200 coax included" },
      { label: "Adapter Kit", value: "RP-SMA, N-type, BNC" },
      { label: "Weight", value: "290 g (total bundle)" },
    ],
    compatible: "PU-LoRa-2 · Field Radio · Relay Node Kit",
  },
  {
    id: "comms-starter-bundle",
    handle: "comms-starter-bundle",
    title: "Emergency Comms Starter Bundle",
    tagline: "Everything for two people to go off-grid immediately",
    description:
      "The fastest way to get two people fully operational on the Plus Ultra mesh. Includes 2× LoRa Dongle v2, 2× Faraday Phone Bag, 1× EMP-Hardened Solar Charger, and the Tactical Antenna Bundle — packaged in a custom tactical hard case. Lifetime discount on the Plus Ultra app (both devices). Save $38 vs. buying individually.",
    price: 299,
    compareAtPrice: 337,
    images: [
      "https://images.unsplash.com/photo-1765996796562-ce301df337a0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1603899122911-27c0cb85824a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    category: "Bundles",
    tags: ["bundle", "starter", "two-person", "complete", "gift"],
    inStock: true,
    badge: "SAVE $38",
    badgeColor: "amber",
    specs: [
      { label: "Includes", value: "2× LoRa Dongle v2 (US 915 MHz)" },
      { label: "", value: "2× Faraday Phone Bag" },
      { label: "", value: "1× EMP-Hardened Solar Charger 30W" },
      { label: "", value: "1× Tactical Antenna Bundle" },
      { label: "Case", value: "Custom foam-insert hard case (IP54)" },
      { label: "Case Dimensions", value: "340 × 260 × 120 mm" },
      { label: "App License", value: "Lifetime discount code (×2)" },
      { label: "Savings", value: "$38 vs. individual pricing" },
    ],
  },

  // ── AI Command Hub — Scout Edition (30B) ─────────────────────────────────
  {
    id: "ai-hub-scout",
    handle: "ai-hub-scout",
    title: "AI Command Hub — Scout Edition (30B)",
    tagline: "Rapid triage intelligence — offline LLM for individual operators and small teams",
    description:
      "The Scout Edition is the entry-level Plus Ultra AI Command Hub, purpose-built for individual operators and small teams. Running a 30B parameter open-source LLM entirely locally, it delivers fast query response times ideal for triage decisions, survival lookups, and medical reference — all without internet.\n\nBuilt into a military-grade, waterproof hardshell case with an integrated Faraday cage, this system is 100% EMP-proof. Connect your phone locally via the Plus Ultra app to query the AI and coordinate your group securely. No cloud. No servers. No compromise.",
    price: 2499,
    compareAtPrice: 2799,
    images: [
      "https://images.unsplash.com/photo-1637252166739-b47f8875f304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1744640326166-433469d102f2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    category: "Computing",
    tags: ["AI", "LLM", "EMP-proof", "offline AI", "30B", "scout", "grid-down", "faraday"],
    inStock: true,
    badge: "PRE-ORDER",
    badgeColor: "amber",
    specs: [
      { label: "Compute Tier",    value: "Scout — 30B parameter LLM" },
      { label: "Response Speed",  value: "Fast (optimised for triage queries)" },
      { label: "Enclosure",       value: "Military-grade waterproof hardshell (IP67)" },
      { label: "EMP Protection",  value: "Integrated Faraday cage (MIL-STD-461G tested)" },
      { label: "AI Engine",       value: "Open-source LLM (fully local, zero internet)" },
      { label: "Local Storage",   value: "Pre-loaded survival docs, medical manuals, offline maps" },
      { label: "Connectivity",    value: "Wi-Fi 6 LAN (air-gapped), USB-C × 3, Ethernet" },
      { label: "App Integration", value: "Plus Ultra mobile app — local mesh LLM queries" },
      { label: "Power Input",     value: "AC mains, USB-C PD 140W, or direct solar input" },
      { label: "Operating Temp",  value: "-20°C to +55°C" },
      { label: "Dimensions",      value: "480 × 360 × 180 mm (case closed)" },
      { label: "Weight",          value: "6.2 kg" },
    ],
    compatible: "Plus Ultra App v2.0+ (iOS & Android)",
  },

  // ── AI Command Hub — Tactical Edition (70B) ──────────────────────────────
  {
    id: "ai-hub-tactical",
    handle: "ai-hub-tactical",
    title: "AI Command Hub — Tactical Edition (70B)",
    tagline: "Strategic planning & multi-department logistics — offline 70B intelligence",
    description:
      "The Tactical Edition steps up to a 70B parameter model, unlocking complex strategic reasoning, multi-department logistics planning, and deeper medical analysis. Built for groups and community leaders who need more than triage — full situation assessment, resource allocation, and contingency planning, all offline.\n\nSame military-grade, waterproof hardshell case with integrated Faraday cage as the Scout. Fully EMP-proof, zero internet required. Pairs with the Plus Ultra app for encrypted local mesh queries across your Tribe.",
    price: 4999,
    compareAtPrice: 5499,
    images: [
      "https://images.unsplash.com/photo-1718607601475-3ff032a2322b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1637252166739-b47f8875f304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    category: "Computing",
    tags: ["AI", "LLM", "EMP-proof", "offline AI", "70B", "tactical", "grid-down", "faraday"],
    inStock: true,
    badge: "PRE-ORDER",
    badgeColor: "amber",
    specs: [
      { label: "Compute Tier",    value: "Tactical — 70B parameter LLM" },
      { label: "Response Speed",  value: "Moderate (optimised for deep reasoning)" },
      { label: "Enclosure",       value: "Military-grade waterproof hardshell (IP67)" },
      { label: "EMP Protection",  value: "Integrated Faraday cage (MIL-STD-461G tested)" },
      { label: "AI Engine",       value: "Open-source LLM (fully local, zero internet)" },
      { label: "Local Storage",   value: "Pre-loaded survival docs, medical manuals, offline maps" },
      { label: "Connectivity",    value: "Wi-Fi 6 LAN (air-gapped), USB-C × 3, Ethernet" },
      { label: "App Integration", value: "Plus Ultra mobile app — local mesh LLM queries" },
      { label: "Power Input",     value: "AC mains, USB-C PD 140W, or direct solar input" },
      { label: "Operating Temp",  value: "-20°C to +55°C" },
      { label: "Dimensions",      value: "480 × 360 × 180 mm (case closed)" },
      { label: "Weight",          value: "7.8 kg" },
    ],
    compatible: "Plus Ultra App v2.0+ (iOS & Android)",
  },

  // ── AI Command Hub — Command Edition (120B) ───────────────────────────────
  {
    id: "ai-hub-command",
    handle: "ai-hub-command",
    title: "AI Command Hub — Command Edition (120B)",
    tagline: "Full community-scale intelligence — 120B reasoning for grid-down operations",
    description:
      "The Command Edition is the apex of the Plus Ultra AI Command Hub lineup. Running a 120B parameter model, it delivers full community-scale intelligence: infrastructure planning, large-group logistics, advanced medical triage, legal and governance reference, and deep cross-domain reasoning — all offline and EMP-proof.\n\nDesigned for community coordinators, prepper network hubs, and serious off-grid operations. This is the brain of an entire Tribe's intelligence network. Pairs with unlimited Plus Ultra mobile app clients for encrypted local mesh LLM queries at scale.",
    price: 8999,
    compareAtPrice: 9999,
    images: [
      "https://images.unsplash.com/photo-1698899114794-faf10237bc85?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1718607601475-3ff032a2322b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    category: "Computing",
    tags: ["AI", "LLM", "EMP-proof", "offline AI", "120B", "command", "grid-down", "faraday"],
    inStock: true,
    badge: "PRE-ORDER",
    badgeColor: "amber",
    specs: [
      { label: "Compute Tier",    value: "Command — 120B parameter LLM" },
      { label: "Response Speed",  value: "Extended (full community-scale reasoning)" },
      { label: "Enclosure",       value: "Military-grade waterproof hardshell (IP67)" },
      { label: "EMP Protection",  value: "Integrated Faraday cage (MIL-STD-461G tested)" },
      { label: "AI Engine",       value: "Open-source LLM (fully local, zero internet)" },
      { label: "Local Storage",   value: "Pre-loaded survival docs, medical manuals, offline maps" },
      { label: "Connectivity",    value: "Wi-Fi 6 LAN (air-gapped), USB-C × 3, Ethernet" },
      { label: "App Integration", value: "Plus Ultra mobile app — unlimited local mesh clients" },
      { label: "Power Input",     value: "AC mains, USB-C PD 140W, or direct solar input" },
      { label: "Operating Temp",  value: "-20°C to +55°C" },
      { label: "Dimensions",      value: "480 × 360 × 180 mm (case closed)" },
      { label: "Weight",          value: "9.8 kg" },
    ],
    compatible: "Plus Ultra App v2.0+ (iOS & Android)",
  },

  // ── Long-Range Mesh Comm Dongle ───────────────────────────────────────────
  {
    id: "mesh-comm-dongle",
    handle: "mesh-comm-dongle",
    title: "Plus Ultra Long-Range Mesh Comm Dongle",
    tagline: "Turn any phone into a tactical mesh radio — no cell towers required",
    description:
      "Cell towers are the most vulnerable point of failure in modern society. When the telecommunications grid collapses, the Plus Ultra Mesh Dongle ensures your Tribe stays connected.\n\nUsing LoRa (Long Range) radio frequencies, these dongles create a localized, decentralized mesh network with no internet dependency. Simply plug the dongle into your smartphone or Plus Ultra AI Hub, and instantly send encrypted text messages, location data, and Tribal alerts over kilometers of distance. Every dongle acts as a node — the more Tribe members using them, the stronger and wider your communication net becomes.\n\nAvailable in three form factors: a compact USB-C mobile node for individual operators, a high-gain base station for HQ relay, and a fully autonomous solar relay drop-node you can mount anywhere to dramatically expand the perimeter.",
    price: 99,
    images: [
      "https://images.unsplash.com/photo-1615427393402-8dec5c104760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1603899122911-27c0cb85824a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    category: "Hardware",
    tags: ["LoRa", "mesh", "USB-C", "comms", "dongle", "radio", "grid-down", "solar relay"],
    inStock: true,
    badge: "NEW",
    badgeColor: "green",
    specs: [
      { label: "Radio Technology",  value: "LoRa (Long Range), 915 MHz (US) / 868 MHz (EU)" },
      { label: "Max Range",         value: "Up to 15 km (Mobile) / 40 km (Base) / 60 km (Drop-Node, LoS)" },
      { label: "TX Power",          value: "Up to 20 dBm" },
      { label: "Encryption",        value: "AES-256 end-to-end via Plus Ultra app" },
      { label: "Data Types",        value: "Encrypted text, GPS coordinates, Tribal alerts" },
      { label: "Mesh Healing",      value: "Automatic — network reroutes as nodes join/leave" },
      { label: "App Integration",   value: "Plug-and-play with Plus Ultra app" },
      { label: "Solar Relay Power", value: "Integrated 3000mAh + 5W mini solar panel (Drop-Node)" },
      { label: "Interface",         value: "USB-C (Mobile & Base) / Standalone (Drop-Node)" },
      { label: "Certifications",    value: "FCC, CE, RoHS" },
    ],
    variants: [
      { id: "mesh-dongle-mobile", title: "Mobile Node — USB-C Smartphone Dongle", price: 99,  available: true },
      { id: "mesh-dongle-base",   title: "Base Station Node — High-Gain Antenna",  price: 159, available: true },
      { id: "mesh-dongle-solar",  title: "Solar Relay Drop-Node — Standalone",     price: 279, available: true },
    ],
    compatible: "iOS 16+ · Android 10+ · Plus Ultra AI Command Hub",
  },

  // ── Tribe Comms Bundle (4× Mobile Mesh Dongles) ───────────────────────────
  {
    id: "tribe-comms-bundle",
    handle: "tribe-comms-bundle",
    title: "Tribe Comms Bundle — 4× Mobile Mesh Dongles",
    tagline: "Equip four Tribe members with instant off-grid comms — 15% saved",
    description:
      "The Plus Ultra AI Hub is your brain, but your Tribe needs a nervous system. The Tribe Comms Bundle equips four members with our USB-C Mobile Mesh Dongles — turning dead smartphones into off-grid tactical radios in seconds.\n\nEach dongle plugs directly into any iOS or Android device via USB-C and routes encrypted text and GPS data back to the Command Hub via LoRa frequencies. Pre-configured to securely handshake with the Plus Ultra AI Command Hub on first boot. No setup required.\n\nBundle pricing saves you 15% compared to buying four individual Mobile Nodes — the most cost-effective way to mobilize your Tribe's communication grid fast.",
    price: 337,
    compareAtPrice: 396,
    images: [
      "https://images.unsplash.com/photo-1758775212970-30458a9df7ae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
      "https://images.unsplash.com/photo-1615427393402-8dec5c104760?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&w=800",
    ],
    category: "Bundles",
    tags: ["bundle", "mesh", "LoRa", "comms", "tribe", "USB-C", "4-pack", "grid-down"],
    inStock: true,
    badge: "SAVE 15%",
    badgeColor: "amber",
    specs: [
      { label: "Includes",       value: "4× Mobile Mesh Dongle (USB-C)" },
      { label: "Radio Tech",     value: "LoRa 915 MHz (US) / 868 MHz (EU)" },
      { label: "Max Range each", value: "Up to 15 km (line-of-sight)" },
      { label: "Encryption",     value: "AES-256 end-to-end via Plus Ultra app" },
      { label: "Hub Sync",       value: "Auto-handshake with AI Command Hub" },
      { label: "Compatibility",  value: "iOS 16+ · Android 10+ (USB-C)" },
      { label: "Savings",        value: "$59 vs. 4× individual Mobile Nodes" },
      { label: "Certifications", value: "FCC, CE, RoHS" },
    ],
    compatible: "iOS 16+ · Android 10+ · Plus Ultra AI Command Hub",
  },
];

export const PRODUCT_CATEGORIES = ["All", "Hardware", "EMP Protection", "Power", "Computing", "Bundles"] as const;
export type ProductCategory = (typeof PRODUCT_CATEGORIES)[number];
