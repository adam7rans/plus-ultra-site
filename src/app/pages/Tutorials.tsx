import { useState } from "react";
import type { ReactNode } from "react";
import {
  Play, Clock, BookOpen, Wrench, Shield, Radio,
  ChevronRight, Filter, Video, FileText, Layers,
} from "lucide-react";
import { SEO } from "../components/SEO";
import { PAGE_META, trackEvent, AnalyticsEvents } from "../lib/analytics";

// ─── Data ─────────────────────────────────────────────────────────────────────
type TutorialType = "Video" | "Article" | "Guide";
type TutorialCategory = "All" | "Mesh Networking" | "App Setup" | "Grid-Down" | "Hardware" | "Security" | "Advanced";

interface Tutorial {
  id: string;
  tag: TutorialCategory;
  tagColor: "green" | "amber";
  title: string;
  desc: string;
  duration: string;
  type: TutorialType;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  featured?: boolean;
}

const tutorials: Tutorial[] = [
  {
    id: "t1",
    tag: "App Setup",
    tagColor: "green",
    title: "Complete Setup: First Boot to First Mesh",
    desc: "The definitive walkthrough from download to operational mesh. Covers installation, key generation, identity verification, and forming your first trusted network — everything in one session.",
    duration: "24 min",
    type: "Video",
    difficulty: "Beginner",
    featured: true,
  },
  {
    id: "t2",
    tag: "Mesh Networking",
    tagColor: "green",
    title: "Setting Up Your First Mesh Network",
    desc: "Step-by-step guide to pairing multiple devices and forming a secure offline mesh. Includes proximity pairing, QR exchange, and verifying mesh health.",
    duration: "12 min",
    type: "Video",
    difficulty: "Beginner",
  },
  {
    id: "t3",
    tag: "Grid-Down",
    tagColor: "amber",
    title: "SHTF Protocol Walkthrough",
    desc: "Live demonstration of Plus Ultra maintaining comms during a simulated full infrastructure outage. Shows automatic Grid-Down failover, mesh formation, and emergency beacon activation.",
    duration: "20 min",
    type: "Video",
    difficulty: "Intermediate",
  },
  {
    id: "t4",
    tag: "Hardware",
    tagColor: "amber",
    title: "LoRa Dongle v2 Setup & Configuration",
    desc: "Pair the Plus Ultra LoRa Dongle v2, configure spreading factor and TX power for your terrain, and validate 40km range with the built-in RF diagnostics tool.",
    duration: "15 min",
    type: "Guide",
    difficulty: "Intermediate",
  },
  {
    id: "t5",
    tag: "Security",
    tagColor: "green",
    title: "Node Vetting & Trust Management",
    desc: "How to authorize new members, configure quorum requirements, revoke access, and maintain the cryptographic integrity of your mesh network.",
    duration: "10 min",
    type: "Article",
    difficulty: "Intermediate",
  },
  {
    id: "t6",
    tag: "Advanced",
    tagColor: "green",
    title: "Multi-Hop Routing Optimization",
    desc: "Configure relay nodes, tune spreading factor per link, deploy fixed infrastructure nodes (Pi + LoRa HAT), and optimize message routing for maximum resilience.",
    duration: "18 min",
    type: "Article",
    difficulty: "Advanced",
  },
  {
    id: "t7",
    tag: "Hardware",
    tagColor: "amber",
    title: "Building a Solar-Powered Relay Node",
    desc: "Deploy a Raspberry Pi 4 + LoRa HAT relay node powered entirely by a 30W solar panel and LiFePO4 battery. Achieves 72h+ uptime with no grid power.",
    duration: "35 min",
    type: "Guide",
    difficulty: "Advanced",
  },
  {
    id: "t8",
    tag: "Security",
    tagColor: "green",
    title: "Device Hardening for Grid-Down Scenarios",
    desc: "Encrypt your device, configure duress wipe, test your Faraday bag, disable RF emissions in airplane mode, and prep for seizure-resistant operation.",
    duration: "14 min",
    type: "Article",
    difficulty: "Intermediate",
  },
  {
    id: "t9",
    tag: "App Setup",
    tagColor: "green",
    title: "Offline AI: Setting Up the Local LLM",
    desc: "Download and activate the on-device LLM, configure inference settings for your device's hardware, and explore the tactical reference library included offline.",
    duration: "8 min",
    type: "Video",
    difficulty: "Beginner",
  },
  {
    id: "t10",
    tag: "Grid-Down",
    tagColor: "amber",
    title: "Offline Maps: Download, Configure, Deploy",
    desc: "Pre-download vector map tiles for your region, configure team waypoint sharing, and set up emergency rally point markers before they're needed.",
    duration: "11 min",
    type: "Guide",
    difficulty: "Beginner",
  },
  {
    id: "t11",
    tag: "Mesh Networking",
    tagColor: "green",
    title: "Range Testing & RF Spectrum Analysis",
    desc: "Use the built-in RF diagnostics to scan for interference, run signal strength tests at distance, and validate your mesh topology before deployment.",
    duration: "16 min",
    type: "Video",
    difficulty: "Advanced",
  },
  {
    id: "t12",
    tag: "Advanced",
    tagColor: "green",
    title: "Channel Migration & Emergency Rekey",
    desc: "Step through the full emergency rekey protocol: rotate group channel, issue new symmetric keys to all mesh members, and verify propagation completed.",
    duration: "9 min",
    type: "Article",
    difficulty: "Advanced",
  },
  {
    id: "t13",
    tag: "Mesh Networking",
    tagColor: "green",
    title: "Phone-to-Phone Sync: No WiFi Needed",
    desc: "Set up direct phone-to-phone sync using WiFi Direct and BLE discovery. No router, no internet, no infrastructure — tribe members auto-mesh within 100m. Covers Android setup, permissions, and testing the connection.",
    duration: "8 min",
    type: "Guide",
    difficulty: "Intermediate",
  },
  {
    id: "t14",
    tag: "Grid-Down",
    tagColor: "amber",
    title: "Declaring Grid-Down & Activating PACE",
    desc: "Walk through declaring tribe-wide grid-down status, understanding the five escalation stages, triggering the Infrastructure Failure Checklist, and activating your PACE comms plan for the group.",
    duration: "6 min",
    type: "Guide",
    difficulty: "Beginner",
  },
  {
    id: "t15",
    tag: "App Setup",
    tagColor: "green",
    title: "Running a Tribe Roll Call (Muster)",
    desc: "Initiate a muster, track member responses in real time, record status codes (present, away authorized, injured, need help), and review the accountability board. Covers both lead-initiated and auto-drill musters.",
    duration: "5 min",
    type: "Guide",
    difficulty: "Beginner",
  },
  {
    id: "t16",
    tag: "Grid-Down",
    tagColor: "amber",
    title: "Creating a Bug-Out Plan",
    desc: "Build a complete evacuation plan: assign vehicles, set load priorities, trace patrol routes as bug-out routes, define rally points, and activate the plan to broadcast a tribe-wide alert with live route highlighting on the map.",
    duration: "10 min",
    type: "Guide",
    difficulty: "Intermediate",
  },
  {
    id: "t17",
    tag: "Security",
    tagColor: "green",
    title: "Identity Backup & Key Recovery",
    desc: "Export your cryptographic identity as a QR code, verify the backup is complete, and walk through the recovery process on a new device. Covers what to do if your primary device is lost or destroyed.",
    duration: "7 min",
    type: "Guide",
    difficulty: "Beginner",
  },
  {
    id: "t18",
    tag: "App Setup",
    tagColor: "green",
    title: "Managing Tribe Inventory & Burn Rates",
    desc: "Add assets to tribe inventory, log consumption entries, and interpret the burn rate and days-until-depletion calculations. Covers critical vs. non-critical asset weighting and how depletion status surfaces on the dashboard.",
    duration: "6 min",
    type: "Article",
    difficulty: "Beginner",
  },
  {
    id: "t19",
    tag: "Advanced",
    tagColor: "green",
    title: "Inter-Tribe Federation & Alliances",
    desc: "Create an encrypted federation channel with another tribe, exchange tribe encryption keys, send inter-tribe messages, submit trade proposals, and manage the alliance lifecycle from pending to allied. Requires diplomat role.",
    duration: "12 min",
    type: "Guide",
    difficulty: "Advanced",
  },
  {
    id: "t20",
    tag: "App Setup",
    tagColor: "green",
    title: "Running a Governance Vote",
    desc: "Create a proposal, configure the governance model (council / direct democracy / hybrid), open the discussion period, cast votes, and interpret quorum and early-pass detection. Covers all three governance models side by side.",
    duration: "5 min",
    type: "Article",
    difficulty: "Intermediate",
  },
];

const CATEGORIES: TutorialCategory[] = ["All", "Mesh Networking", "App Setup", "Grid-Down", "Hardware", "Security", "Advanced"];
const TYPES: { label: string; value: TutorialType | "All"; icon: ReactNode }[] = [
  { label: "All Types", value: "All", icon: <Layers size={12} /> },
  { label: "Video", value: "Video", icon: <Video size={12} /> },
  { label: "Article", value: "Article", icon: <FileText size={12} /> },
  { label: "Guide", value: "Guide", icon: <BookOpen size={12} /> },
];

// ─── Sub-components ───────────────────────────────────────────────────────────
function TypeIcon({ type }: { type: TutorialType }) {
  if (type === "Video") return <Video size={16} />;
  if (type === "Article") return <FileText size={16} />;
  return <BookOpen size={16} />;
}

function DifficultyBadge({ level }: { level: Tutorial["difficulty"] }) {
  const colors: Record<Tutorial["difficulty"], { bg: string; text: string }> = {
    Beginner: { bg: "rgba(57,255,20,0.1)", text: "var(--pu-green)" },
    Intermediate: { bg: "rgba(255,184,0,0.1)", text: "var(--pu-amber)" },
    Advanced: { bg: "rgba(255,59,59,0.1)", text: "#FF6B6B" },
  };
  return (
    <span
      className="text-xs pu-mono px-1.5 py-0.5 rounded"
      style={{ backgroundColor: colors[level].bg, color: colors[level].text }}
    >
      {level}
    </span>
  );
}

// ─── Featured Tutorial ────────────────────────────────────────────────────────
function FeaturedTutorial({ tutorial }: { tutorial: Tutorial }) {
  return (
    <div
      className="relative rounded-2xl overflow-hidden mb-10 cursor-pointer group"
      style={{
        backgroundColor: "var(--pu-surface)",
        border: "1px solid var(--pu-border-bright)",
        boxShadow: "0 0 40px rgba(57,255,20,0.05)",
      }}
    >
      {/* Glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 60% 80% at 0% 50%, rgba(57,255,20,0.05) 0%, transparent 60%)" }}
      />
      <div className="relative grid md:grid-cols-5 gap-0">
        {/* Thumbnail */}
        <div
          className="md:col-span-2 flex items-center justify-center relative"
          style={{
            backgroundColor: "#050A07",
            minHeight: "220px",
            borderRight: "1px solid var(--pu-border)",
          }}
        >
          <div className="absolute inset-0 pu-grid-bg opacity-30" />
          <div
            className="relative z-10 w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110"
            style={{
              backgroundColor: "var(--pu-green-glow)",
              border: "1px solid rgba(57,255,20,0.4)",
              boxShadow: "0 0 40px rgba(57,255,20,0.2)",
              color: "var(--pu-green)",
            }}
          >
            <Play size={32} />
          </div>
          <div
            className="absolute top-3 left-3 px-2 py-1 rounded text-xs pu-mono"
            style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-green)", border: "1px solid rgba(57,255,20,0.3)" }}
          >
            FEATURED
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3 p-7 flex flex-col justify-center">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-xs pu-mono tracking-wider"
              style={{ color: tutorial.tagColor === "green" ? "var(--pu-green)" : "var(--pu-amber)" }}
            >
              {tutorial.tag.toUpperCase()}
            </span>
            <DifficultyBadge level={tutorial.difficulty} />
            <span
              className="text-xs pu-mono px-2 py-0.5 rounded flex items-center gap-1"
              style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-text-muted)", border: "1px solid var(--pu-border)" }}
            >
              <TypeIcon type={tutorial.type} />
              {tutorial.type}
            </span>
          </div>
          <h2 className="mb-3">{tutorial.title}</h2>
          <p className="mb-5" style={{ color: "var(--pu-text-muted)", fontSize: "0.95rem" }}>
            {tutorial.desc}
          </p>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
              <Clock size={12} />
              {tutorial.duration}
            </div>
            <button
              className="flex items-center gap-2 text-sm pu-mono transition-colors"
              style={{ color: "var(--pu-green)" }}
            >
              Start Tutorial <ChevronRight size={14} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Tutorial Card ────────────────────────────────────────────────────────────
function TutorialCard({ tutorial }: { tutorial: Tutorial }) {
  const accentColor = tutorial.tagColor === "green" ? "var(--pu-green)" : "var(--pu-amber)";
  const accentGlow = tutorial.tagColor === "green" ? "var(--pu-green-glow)" : "var(--pu-amber-glow)";
  const accentBorder = tutorial.tagColor === "green" ? "var(--pu-green-dim)" : "var(--pu-amber-dim)";

  return (
    <div
      className="group flex flex-col rounded-xl overflow-hidden cursor-pointer transition-all duration-200"
      style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = accentBorder;
        (e.currentTarget as HTMLDivElement).style.boxShadow = `0 0 20px rgba(57,255,20,0.04)`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLDivElement).style.borderColor = "var(--pu-border)";
        (e.currentTarget as HTMLDivElement).style.boxShadow = "none";
      }}
    >
      {/* Thumbnail area */}
      <div
        className="relative flex items-center justify-center flex-shrink-0"
        style={{ backgroundColor: "#050A07", height: "110px", borderBottom: "1px solid var(--pu-border)" }}
      >
        <div className="absolute inset-0 pu-grid-bg opacity-20" />
        <div
          className="relative z-10 w-11 h-11 rounded-full flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
          style={{ backgroundColor: accentGlow, border: `1px solid ${accentColor}30`, color: accentColor }}
        >
          <TypeIcon type={tutorial.type} />
        </div>
        {/* Type badge */}
        <div
          className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded text-xs pu-mono"
          style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-text-dim)", border: "1px solid var(--pu-border)" }}
        >
          {tutorial.type}
        </div>
      </div>

      {/* Card body */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-2 flex-wrap">
          <span className="text-xs pu-mono tracking-wider" style={{ color: accentColor }}>
            {tutorial.tag.toUpperCase()}
          </span>
          <DifficultyBadge level={tutorial.difficulty} />
        </div>
        <h3 className="mb-2" style={{ fontSize: "1rem" }}>{tutorial.title}</h3>
        <p className="text-xs flex-1 mb-4" style={{ color: "var(--pu-text-muted)", lineHeight: "1.65" }}>
          {tutorial.desc}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
            <Clock size={11} />
            <span>{tutorial.duration}</span>
          </div>
          <div
            className="flex items-center gap-1 text-xs pu-mono opacity-0 group-hover:opacity-100 transition-opacity"
            style={{ color: accentColor }}
          >
            View <ChevronRight size={11} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function Tutorials() {
  const [activeCategory, setActiveCategory] = useState<TutorialCategory>("All");
  const [activeType, setActiveType] = useState<TutorialType | "All">("All");

  const featured = tutorials.find((t) => t.featured)!;

  const filtered = tutorials.filter((t) => {
    if (t.featured) return false;
    const catMatch = activeCategory === "All" || t.tag === activeCategory;
    const typeMatch = activeType === "All" || t.type === activeType;
    return catMatch && typeMatch;
  });

  const totalShown = filtered.length;

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--pu-bg)" }}>
      <SEO
        title={PAGE_META.tutorials.title}
        description={PAGE_META.tutorials.description}
        keywords={PAGE_META.tutorials.keywords}
        path={PAGE_META.tutorials.path}
      />
      {/* Grid bg */}
      <div className="fixed inset-0 pu-grid-bg opacity-15 pointer-events-none" style={{ zIndex: 0 }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Page header */}
        <div className="max-w-2xl mb-12">
          <div
            className="inline-block px-3 py-1 rounded text-xs pu-mono tracking-widest uppercase mb-4"
            style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-green)", border: "1px solid var(--pu-border)" }}
          >
            Tutorials
          </div>
          <h1 className="mb-4">
            Learn to{" "}
            <span style={{ color: "var(--pu-green)", textShadow: "0 0 30px rgba(57,255,20,0.4)" }}>
              Operate.
            </span>
          </h1>
          <p style={{ color: "var(--pu-text-muted)", fontSize: "1rem" }}>
            Step-by-step video and text guides covering every aspect of Plus Ultra — from first install to advanced mesh optimization.
          </p>
        </div>

        {/* Featured */}
        <FeaturedTutorial tutorial={featured} />

        {/* Filters */}
        <div
          className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-6 pb-5"
          style={{ borderBottom: "1px solid var(--pu-border)" }}
        >
          {/* Category tabs */}
          <div className="flex items-center gap-1 flex-wrap">
            <Filter size={12} style={{ color: "var(--pu-text-dim)", marginRight: 4 }} />
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="px-3 py-1.5 rounded text-xs pu-mono transition-all"
                style={{
                  backgroundColor: activeCategory === cat ? "var(--pu-surface-2)" : "transparent",
                  color: activeCategory === cat ? "var(--pu-green)" : "var(--pu-text-muted)",
                  border: activeCategory === cat ? "1px solid rgba(57,255,20,0.3)" : "1px solid transparent",
                }}
                onClick={() => setActiveCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Type filter */}
          <div className="flex items-center gap-1">
            {TYPES.map((t) => (
              <button
                key={t.value}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded text-xs pu-mono transition-all"
                style={{
                  backgroundColor: activeType === t.value ? "var(--pu-surface-2)" : "transparent",
                  color: activeType === t.value ? "var(--pu-text)" : "var(--pu-text-dim)",
                  border: activeType === t.value ? "1px solid var(--pu-border-bright)" : "1px solid transparent",
                }}
                onClick={() => setActiveType(t.value)}
              >
                {t.icon}
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results count */}
        <div className="flex items-center gap-2 mb-5">
          <span className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
            {totalShown} {totalShown === 1 ? "tutorial" : "tutorials"}
          </span>
          {(activeCategory !== "All" || activeType !== "All") && (
            <button
              className="text-xs pu-mono transition-colors"
              style={{ color: "var(--pu-text-dim)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--pu-green)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--pu-text-dim)")}
              onClick={() => { setActiveCategory("All"); setActiveType("All"); }}
            >
              · Clear filters ×
            </button>
          )}
        </div>

        {/* Tutorial grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filtered.map((t) => (
              <TutorialCard key={t.id} tutorial={t} />
            ))}
          </div>
        ) : (
          <div
            className="text-center py-20 rounded-xl"
            style={{ border: "1px dashed var(--pu-border)", color: "var(--pu-text-dim)" }}
          >
            <Radio size={32} className="mx-auto mb-3 opacity-40" />
            <p className="text-sm pu-mono">No tutorials match the current filters.</p>
            <button
              className="mt-3 text-xs pu-mono transition-colors"
              style={{ color: "var(--pu-green)" }}
              onClick={() => { setActiveCategory("All"); setActiveType("All"); }}
            >
              Reset filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}