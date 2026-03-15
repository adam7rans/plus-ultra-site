import { useState } from "react";
import {
  Shield, Radio, Zap, Lock, Wifi, AlertTriangle, Download, ArrowRight, Github,
  Eye, Code2, GitBranch, CheckCircle, XCircle, Info, Bell, Search, ChevronRight,
  Terminal, Cpu, Map, Activity, Users, Star, ExternalLink, Copy, Check,
  Package, Layers, Circle, Square, Triangle, Hash,
} from "lucide-react";
import Logo from "../../imports/Logo";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function SectionAnchor({ id }: { id: string }) {
  return <div id={id} style={{ scrollMarginTop: "5rem" }} />;
}

function SectionTitle({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-8">
      <span className="text-xs pu-mono tracking-[0.2em] uppercase" style={{ color: "var(--pu-green)" }}>
        {label}
      </span>
      <div className="flex-1 h-px" style={{ backgroundColor: "var(--pu-border)" }} />
    </div>
  );
}

function Token({ name, value }: { name: string; value: string }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(name);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };
  return (
    <button
      onClick={copy}
      className="flex items-center gap-2 px-3 py-1.5 rounded text-xs pu-mono transition-all"
      style={{
        backgroundColor: "var(--pu-surface-2)",
        border: "1px solid var(--pu-border)",
        color: "var(--pu-text-muted)",
      }}
      title={`Copy ${name}`}
    >
      {copied ? <Check size={10} style={{ color: "var(--pu-green)" }} /> : <Copy size={10} />}
      <span>{name}</span>
      <span style={{ color: "var(--pu-text-dim)" }}>{value}</span>
    </button>
  );
}

// ─── Nav sections ─────────────────────────────────────────────────────────────

const sections = [
  { id: "identity",    label: "Brand Identity" },
  { id: "colors",      label: "Color Tokens" },
  { id: "typography",  label: "Typography" },
  { id: "spacing",     label: "Spacing & Layout" },
  { id: "atoms",       label: "Atoms" },
  { id: "molecules",   label: "Molecules" },
  { id: "utilities",   label: "Utilities" },
  { id: "icons",       label: "Iconography" },
  { id: "motion",      label: "Motion" },
  { id: "dodonts",     label: "Do / Don't" },
];

// ─── Color data ───────────────────────────────────────────────────────────────

const colorGroups = [
  {
    title: "Surface Palette",
    tokens: [
      { var: "--pu-bg",        hex: "#080B09", label: "Background" },
      { var: "--pu-surface",   hex: "#0D1210", label: "Surface" },
      { var: "--pu-surface-2", hex: "#131A15", label: "Surface 2" },
      { var: "--pu-surface-3", hex: "#1A2420", label: "Surface 3" },
    ],
  },
  {
    title: "Neon Green",
    tokens: [
      { var: "--pu-green",      hex: "#39FF14", label: "Green" },
      { var: "--pu-green-dim",  hex: "#1DB306", label: "Green Dim" },
      { var: "--pu-green-glow", hex: "rgba(57,255,20,.15)", label: "Green Glow" },
    ],
  },
  {
    title: "Amber",
    tokens: [
      { var: "--pu-amber",      hex: "#FFB800", label: "Amber" },
      { var: "--pu-amber-dim",  hex: "#A37500", label: "Amber Dim" },
      { var: "--pu-amber-glow", hex: "rgba(255,184,0,.15)", label: "Amber Glow" },
    ],
  },
  {
    title: "Text",
    tokens: [
      { var: "--pu-text",       hex: "#D8EAD9", label: "Text" },
      { var: "--pu-text-muted", hex: "#5A7060", label: "Text Muted" },
      { var: "--pu-text-dim",   hex: "#3D5040", label: "Text Dim" },
    ],
  },
  {
    title: "Borders",
    tokens: [
      { var: "--pu-border",        hex: "#1E2E22", label: "Border" },
      { var: "--pu-border-bright", hex: "#2E4432", label: "Border Bright" },
    ],
  },
  {
    title: "Chart / Data",
    tokens: [
      { var: "--chart-1", hex: "#39FF14", label: "Chart 1" },
      { var: "--chart-2", hex: "#FFB800", label: "Chart 2" },
      { var: "--chart-3", hex: "#00C8FF", label: "Chart 3" },
      { var: "--chart-4", hex: "#FF6B35", label: "Chart 4" },
      { var: "--chart-5", hex: "#A855F7", label: "Chart 5" },
    ],
  },
  {
    title: "Semantic",
    tokens: [
      { var: "--destructive", hex: "#FF3B3B", label: "Destructive" },
    ],
  },
];

// ─── Main Page ────────────────────────────────────────────────────────────────

export function Brand() {
  const [activeSection, setActiveSection] = useState("identity");

  const scrollTo = (id: string) => {
    setActiveSection(id);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen"
      style={{ backgroundColor: "var(--pu-bg)", color: "var(--pu-text)" }}
    >
      {/* Page header */}
      <div
        className="border-b"
        style={{ borderColor: "var(--pu-border)", backgroundColor: "var(--pu-surface)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="flex items-center gap-3 mb-3">
            <span
              className="text-xs pu-mono tracking-[0.2em] uppercase px-2 py-1 rounded"
              style={{ backgroundColor: "var(--pu-green-glow)", color: "var(--pu-green)", border: "1px solid rgba(57,255,20,.2)" }}
            >
              Internal
            </span>
            <span className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>v1.0.0</span>
          </div>
          <h1 style={{ color: "var(--pu-text)" }}>Plus Ultra — Design System</h1>
          <p className="mt-2" style={{ color: "var(--pu-text-muted)", maxWidth: "520px" }}>
            The canonical reference for color tokens, typography, component atoms, molecules, utilities, and brand usage rules for the Plus Ultra ecosystem.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex gap-10 items-start">

        {/* ── Sticky Sidebar ── */}
        <aside
          className="hidden lg:block w-48 shrink-0 sticky top-24 self-start"
          style={{ top: "5.5rem" }}
        >
          <nav className="flex flex-col gap-0.5">
            {sections.map((s) => (
              <button
                key={s.id}
                onClick={() => scrollTo(s.id)}
                className="text-left px-3 py-2 rounded text-xs pu-mono tracking-wide transition-all duration-100"
                style={{
                  color: activeSection === s.id ? "var(--pu-green)" : "var(--pu-text-muted)",
                  backgroundColor: activeSection === s.id ? "var(--pu-green-glow)" : "transparent",
                  borderLeft: activeSection === s.id ? "2px solid var(--pu-green)" : "2px solid transparent",
                }}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </aside>

        {/* ── Main content ── */}
        <main className="flex-1 min-w-0 flex flex-col gap-16">

          {/* ━━ BRAND IDENTITY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section>
            <SectionAnchor id="identity" />
            <SectionTitle label="Brand Identity" />

            {/* Logo showcase */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* Dark bg */}
              <div
                className="flex items-center justify-center p-10 rounded-lg"
                style={{ backgroundColor: "#080B09", border: "1px solid var(--pu-border)" }}
              >
                <div style={{ width: "215px", height: "52px", overflow: "visible", position: "relative" }}>
                  <div style={{ transform: "scale(2.5)", transformOrigin: "top left", width: "86px", height: "28px", position: "absolute" }}>
                    <Logo />
                  </div>
                </div>
              </div>
              {/* Surface bg */}
              <div
                className="flex items-center justify-center p-10 rounded-lg"
                style={{ backgroundColor: "var(--pu-surface-3)", border: "1px solid var(--pu-border)" }}
              >
                <div style={{ width: "172px", height: "42px", overflow: "visible", position: "relative" }}>
                  <div style={{ transform: "scale(2)", transformOrigin: "top left", width: "86px", height: "28px", position: "absolute" }}>
                    <Logo />
                  </div>
                </div>
              </div>
            </div>

            {/* Scale specimens */}
            <div
              className="p-6 rounded-lg mb-6"
              style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}
            >
              <p className="text-xs pu-mono mb-5" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.1em" }}>SCALE SPECIMENS</p>
              <div className="flex flex-col gap-5">
                {[
                  { scale: 1, label: "1× — 86 × 28 px" },
                  { scale: 1.5, label: "1.5× — 129 × 42 px" },
                  { scale: 2.5, label: "2.5× — Navbar default" },
                ].map(({ scale, label }) => (
                  <div key={label} className="flex items-center gap-6">
                    <div style={{ width: `${86 * scale}px`, height: `${28 * scale}px`, overflow: "visible", position: "relative", flexShrink: 0 }}>
                      <div style={{ transform: `scale(${scale})`, transformOrigin: "top left", width: "86px", height: "28px", position: "absolute" }}>
                        <Logo />
                      </div>
                    </div>
                    <span className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Voice & tone */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Voice", points: ["Direct, confident", "Never alarmist", "Technical when warranted", "No corporate jargon"] },
                { title: "Tone", points: ["Calm under pressure", "Empowering, not fearful", "Mission-critical focus", "Minimal, purposeful"] },
                { title: "Personality", points: ["Tactical / prepared", "Open / transparent", "Innovative / grounded", "Community-first"] },
              ].map(({ title, points }) => (
                <div key={title} className="p-5 rounded-lg" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
                  <h4 className="mb-3" style={{ color: "var(--pu-green)" }}>{title}</h4>
                  <ul className="flex flex-col gap-1.5">
                    {points.map((p) => (
                      <li key={p} className="flex items-center gap-2 text-sm" style={{ color: "var(--pu-text-muted)" }}>
                        <span style={{ color: "var(--pu-green-dim)", fontSize: "10px" }}>▸</span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </section>

          {/* ━━ COLORS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section>
            <SectionAnchor id="colors" />
            <SectionTitle label="Color Tokens" />

            <div className="flex flex-col gap-8">
              {colorGroups.map((group) => (
                <div key={group.title}>
                  <p className="text-xs pu-mono mb-3 tracking-widest uppercase" style={{ color: "var(--pu-text-dim)" }}>
                    {group.title}
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {group.tokens.map((t) => (
                      <div
                        key={t.var}
                        className="flex items-center gap-3 px-4 py-3 rounded-lg"
                        style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)", minWidth: "220px" }}
                      >
                        <div
                          className="w-8 h-8 rounded-md shrink-0"
                          style={{ backgroundColor: t.hex, border: "1px solid rgba(255,255,255,0.08)" }}
                        />
                        <div>
                          <div className="text-xs pu-mono" style={{ color: "var(--pu-text)" }}>{t.label}</div>
                          <div className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>{t.hex}</div>
                          <div className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)", fontSize: "0.62rem" }}>{t.var}</div>
                        </div>
                        <Token name={t.var} value={t.hex} />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ━━ TYPOGRAPHY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section>
            <SectionAnchor id="typography" />
            <SectionTitle label="Typography" />

            {/* Font families */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="p-6 rounded-lg" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
                <p className="text-xs pu-mono mb-4" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>SANS-SERIF — PRIMARY</p>
                <div style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
                  <div style={{ fontSize: "2rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--pu-text)" }}>Inter</div>
                  <div style={{ fontSize: "1rem", color: "var(--pu-text-muted)", marginTop: "4px" }}>
                    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--pu-text-muted)", marginTop: "4px" }}>
                    0 1 2 3 4 5 6 7 8 9 !@#$%^&*
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[400, 500, 600, 700].map((w) => (
                    <span key={w} className="text-xs px-2 py-1 rounded pu-mono" style={{ fontWeight: w, color: "var(--pu-text-muted)", border: "1px solid var(--pu-border)" }}>
                      {w}
                    </span>
                  ))}
                </div>
              </div>
              <div className="p-6 rounded-lg" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
                <p className="text-xs pu-mono mb-4" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>MONOSPACE — DATA / CODE</p>
                <div className="pu-mono">
                  <div style={{ fontSize: "2rem", fontWeight: 700, color: "var(--pu-green)" }}>Roboto Mono</div>
                  <div style={{ fontSize: "1rem", color: "var(--pu-text-muted)", marginTop: "4px" }}>
                    Aa Bb Cc Dd Ee Ff Gg Hh Ii Jj Kk Ll Mm
                  </div>
                  <div style={{ fontSize: "0.875rem", color: "var(--pu-text-muted)", marginTop: "4px" }}>
                    0 1 2 3 4 5 6 7 8 9 !@#$%^&*
                  </div>
                </div>
                <div className="mt-4 flex flex-wrap gap-2">
                  {[400, 500, 700].map((w) => (
                    <span key={w} className="text-xs px-2 py-1 rounded pu-mono" style={{ fontWeight: w, color: "var(--pu-green)", border: "1px solid var(--pu-border)" }}>
                      {w}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Heading scale */}
            <div className="p-6 rounded-lg mb-4" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
              <p className="text-xs pu-mono mb-6" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>HEADING SCALE</p>
              <div className="flex flex-col gap-5">
                {[
                  { tag: "h1", desc: "clamp(2rem–3.5rem) / 700 / −0.02em", sample: "Grid-Down Ready" },
                  { tag: "h2", desc: "clamp(1.5rem–2.25rem) / 700 / −0.02em", sample: "Tactical Communications" },
                  { tag: "h3", desc: "clamp(1.1rem–1.4rem) / 600", sample: "Encrypted Mesh Network" },
                  { tag: "h4", desc: "1rem / 600 / lh 1.5", sample: "Scout Edition Features" },
                ].map(({ tag, desc, sample }) => (
                  <div key={tag} className="flex items-baseline gap-6 flex-wrap">
                    <span className="text-xs pu-mono w-6 shrink-0" style={{ color: "var(--pu-green)" }}>{tag}</span>
                    <span style={{ fontWeight: tag === "h4" ? 600 : 700, fontSize: tag === "h1" ? "clamp(1.6rem, 3.5vw, 2.4rem)" : tag === "h2" ? "clamp(1.3rem, 2.5vw, 1.75rem)" : tag === "h3" ? "clamp(1rem, 1.8vw, 1.25rem)" : "1rem", letterSpacing: "-0.02em", color: "var(--pu-text)" }}>
                      {sample}
                    </span>
                    <span className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>{desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Body / UI text */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
              <p className="text-xs pu-mono mb-6" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>BODY & UI TEXT</p>
              <div className="flex flex-col gap-4">
                {[
                  { label: "Body / lg", size: "1rem", lh: "1.7", sample: "Encrypted, decentralized communications for when the grid goes dark. Built for those who prepare." },
                  { label: "Body / sm", size: "0.875rem", lh: "1.6", sample: "Encrypted, decentralized communications for when the grid goes dark." },
                  { label: "Caption / mono", size: "0.75rem", lh: "1.5", sample: "SYS_STATUS: OPERATIONAL · NODE_ID: 0x4F2A · UPTIME: 99.97%", mono: true },
                  { label: "Label / overline", size: "0.7rem", lh: "1.5", sample: "SECTION HEADER · TRACKING WIDEST · UPPERCASE", mono: true, upper: true },
                ].map(({ label, size, lh, sample, mono, upper }) => (
                  <div key={label} className="flex gap-4 items-start flex-wrap">
                    <span className="text-xs pu-mono w-28 shrink-0 pt-0.5" style={{ color: "var(--pu-text-dim)" }}>{label}</span>
                    <span style={{
                      fontSize: size, lineHeight: lh, color: "var(--pu-text-muted)",
                      fontFamily: mono ? "'Roboto Mono', monospace" : undefined,
                      textTransform: upper ? "uppercase" : undefined,
                      letterSpacing: upper ? "0.15em" : undefined,
                    }}>
                      {sample}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ━━ SPACING & LAYOUT ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section>
            <SectionAnchor id="spacing" />
            <SectionTitle label="Spacing & Layout" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Spacing scale */}
              <div className="p-6 rounded-lg" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
                <p className="text-xs pu-mono mb-4" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>SPACING SCALE (4 PX BASE)</p>
                <div className="flex flex-col gap-2">
                  {[
                    { step: "1", px: "4px" }, { step: "2", px: "8px" }, { step: "3", px: "12px" },
                    { step: "4", px: "16px" }, { step: "6", px: "24px" }, { step: "8", px: "32px" },
                    { step: "10", px: "40px" }, { step: "12", px: "48px" },
                  ].map(({ step, px }) => (
                    <div key={step} className="flex items-center gap-3">
                      <span className="text-xs pu-mono w-10" style={{ color: "var(--pu-text-dim)" }}>sp-{step}</span>
                      <div style={{ width: px, height: "8px", backgroundColor: "var(--pu-green)", opacity: 0.6, borderRadius: "2px" }} />
                      <span className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>{px}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Border radius */}
              <div className="p-6 rounded-lg" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
                <p className="text-xs pu-mono mb-4" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>BORDER RADIUS</p>
                <div className="flex flex-col gap-4">
                  {[
                    { name: "radius-sm", val: "4px" },
                    { name: "radius-md", val: "6px" },
                    { name: "radius-lg", val: "10px" },
                    { name: "radius-xl", val: "14px" },
                    { name: "full",      val: "9999px" },
                  ].map(({ name, val }) => (
                    <div key={name} className="flex items-center gap-4">
                      <div
                        className="w-12 h-8 shrink-0"
                        style={{
                          backgroundColor: "var(--pu-surface-3)",
                          border: "1px solid var(--pu-border-bright)",
                          borderRadius: val,
                        }}
                      />
                      <span className="text-xs pu-mono" style={{ color: "var(--pu-text-muted)" }}>{name}</span>
                      <span className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>{val}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Container widths */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
              <p className="text-xs pu-mono mb-4" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>CONTAINER / BREAKPOINTS</p>
              <div className="flex flex-col gap-3">
                {[
                  { label: "Mobile  sm", val: "640px",  bar: 16 },
                  { label: "Tablet  md", val: "768px",  bar: 20 },
                  { label: "Desktop lg", val: "1024px", bar: 28 },
                  { label: "Wide    xl", val: "1280px", bar: 38 },
                  { label: "Max   7xl", val: "1280px — max-w-7xl (80rem)", bar: 48 },
                ].map(({ label, val, bar }) => (
                  <div key={label} className="flex items-center gap-4">
                    <span className="text-xs pu-mono w-28 shrink-0" style={{ color: "var(--pu-text-dim)" }}>{label}</span>
                    <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ backgroundColor: "var(--pu-surface-3)" }}>
                      <div style={{ width: `${bar}%`, height: "100%", backgroundColor: "var(--pu-green)", opacity: 0.5, borderRadius: "999px" }} />
                    </div>
                    <span className="text-xs pu-mono" style={{ color: "var(--pu-text-muted)" }}>{val}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ━━ ATOMS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section>
            <SectionAnchor id="atoms" />
            <SectionTitle label="Atoms" />

            {/* Buttons */}
            <div className="p-6 rounded-lg mb-4" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
              <p className="text-xs pu-mono mb-5" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>BUTTONS</p>
              <div className="flex flex-wrap gap-3 mb-5">
                {/* Primary */}
                <button
                  className="px-5 py-2.5 rounded text-sm pu-mono transition-all"
                  style={{ backgroundColor: "var(--pu-green)", color: "#000", fontWeight: 600 }}
                >
                  Primary
                </button>
                {/* Secondary */}
                <button
                  className="px-5 py-2.5 rounded text-sm pu-mono transition-all"
                  style={{ border: "1px solid var(--pu-border-bright)", color: "var(--pu-text-muted)", backgroundColor: "transparent" }}
                >
                  Secondary
                </button>
                {/* Ghost */}
                <button
                  className="px-5 py-2.5 rounded text-sm pu-mono transition-all"
                  style={{ color: "var(--pu-text-muted)", backgroundColor: "transparent" }}
                >
                  Ghost
                </button>
                {/* Amber */}
                <button
                  className="px-5 py-2.5 rounded text-sm pu-mono transition-all"
                  style={{ backgroundColor: "var(--pu-amber)", color: "#000", fontWeight: 600 }}
                >
                  Amber
                </button>
                {/* Destructive */}
                <button
                  className="px-5 py-2.5 rounded text-sm pu-mono transition-all"
                  style={{ backgroundColor: "#FF3B3B", color: "#fff", fontWeight: 500 }}
                >
                  Destructive
                </button>
                {/* Disabled */}
                <button
                  disabled
                  className="px-5 py-2.5 rounded text-sm pu-mono"
                  style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-text-dim)", border: "1px solid var(--pu-border)", cursor: "not-allowed", opacity: 0.5 }}
                >
                  Disabled
                </button>
              </div>

              {/* Sizes */}
              <p className="text-xs pu-mono mb-3" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>SIZES</p>
              <div className="flex flex-wrap items-center gap-3">
                {[
                  { label: "xs", px: "10px 16px", text: "11px" },
                  { label: "sm", px: "8px 20px",  text: "13px" },
                  { label: "md", px: "10px 24px", text: "14px" },
                  { label: "lg", px: "12px 28px", text: "16px" },
                ].map(({ label, px, text }) => (
                  <button
                    key={label}
                    className="rounded pu-mono"
                    style={{ padding: px, fontSize: text, backgroundColor: "var(--pu-surface-2)", border: "1px solid var(--pu-border-bright)", color: "var(--pu-text-muted)" }}
                  >
                    {label.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Badges / Tags */}
            <div className="p-6 rounded-lg mb-4" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
              <p className="text-xs pu-mono mb-4" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>BADGES & TAGS</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { label: "Operational",   bg: "rgba(57,255,20,.1)",   border: "rgba(57,255,20,.3)",  color: "var(--pu-green)" },
                  { label: "Warning",       bg: "rgba(255,184,0,.1)",   border: "rgba(255,184,0,.3)",  color: "var(--pu-amber)" },
                  { label: "Critical",      bg: "rgba(255,59,59,.1)",   border: "rgba(255,59,59,.3)",  color: "#FF3B3B" },
                  { label: "Muted",         bg: "var(--pu-surface-2)",  border: "var(--pu-border)",    color: "var(--pu-text-muted)" },
                  { label: "Info",          bg: "rgba(0,200,255,.08)",  border: "rgba(0,200,255,.25)", color: "#00C8FF" },
                ].map(({ label, bg, border, color }) => (
                  <span
                    key={label}
                    className="text-xs pu-mono px-3 py-1 rounded-full"
                    style={{ backgroundColor: bg, border: `1px solid ${border}`, color }}
                  >
                    {label}
                  </span>
                ))}
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {/* With dot */}
                <span className="flex items-center gap-1.5 text-xs pu-mono px-3 py-1 rounded-full" style={{ backgroundColor: "rgba(57,255,20,.1)", border: "1px solid rgba(57,255,20,.3)", color: "var(--pu-green)" }}>
                  <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--pu-green)" }} />
                  Live
                </span>
                {/* With icon */}
                <span className="flex items-center gap-1.5 text-xs pu-mono px-3 py-1 rounded-full" style={{ backgroundColor: "var(--pu-surface-2)", border: "1px solid var(--pu-border)", color: "var(--pu-text-muted)" }}>
                  <Shield size={10} />
                  End-to-End Encrypted
                </span>
                <span className="flex items-center gap-1.5 text-xs pu-mono px-3 py-1 rounded-full" style={{ backgroundColor: "var(--pu-surface-2)", border: "1px solid var(--pu-border)", color: "var(--pu-text-muted)" }}>
                  <Lock size={10} />
                  No Backdoors
                </span>
              </div>
            </div>

            {/* Inputs */}
            <div className="p-6 rounded-lg mb-4" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
              <p className="text-xs pu-mono mb-4" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>INPUTS</p>
              <div className="flex flex-col gap-3 max-w-sm">
                <input
                  type="text"
                  placeholder="Default input…"
                  className="w-full px-3 py-2.5 rounded text-sm"
                  style={{ backgroundColor: "var(--pu-surface-2)", border: "1px solid var(--pu-border)", color: "var(--pu-text)", outline: "none" }}
                />
                <div className="relative">
                  <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: "var(--pu-text-dim)" }} />
                  <input
                    type="text"
                    placeholder="Search with icon…"
                    className="w-full pl-8 pr-3 py-2.5 rounded text-sm"
                    style={{ backgroundColor: "var(--pu-surface-2)", border: "1px solid var(--pu-border-bright)", color: "var(--pu-text)", outline: "none" }}
                  />
                </div>
                <input
                  type="text"
                  placeholder="Focus state"
                  className="w-full px-3 py-2.5 rounded text-sm"
                  style={{ backgroundColor: "var(--pu-surface-2)", border: "1px solid var(--pu-green)", color: "var(--pu-text)", outline: "none", boxShadow: "0 0 0 2px var(--pu-green-glow)" }}
                />
                <input
                  disabled
                  type="text"
                  placeholder="Disabled"
                  className="w-full px-3 py-2.5 rounded text-sm"
                  style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)", color: "var(--pu-text-dim)", cursor: "not-allowed", opacity: 0.5 }}
                />
              </div>
            </div>

            {/* Surface levels */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
              <p className="text-xs pu-mono mb-4" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>SURFACE ELEVATION LEVELS</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { name: "bg",        color: "#080B09",  label: "pu-bg" },
                  { name: "surface",   color: "#0D1210",  label: "pu-surface" },
                  { name: "surface-2", color: "#131A15",  label: "pu-surface-2" },
                  { name: "surface-3", color: "#1A2420",  label: "pu-surface-3" },
                ].map(({ color, label }) => (
                  <div
                    key={label}
                    className="flex flex-col items-center justify-center p-4 rounded-lg"
                    style={{ backgroundColor: color, border: "1px solid var(--pu-border-bright)", minWidth: "110px", minHeight: "80px" }}
                  >
                    <span className="text-xs pu-mono" style={{ color: "var(--pu-text-muted)" }}>{label}</span>
                    <span className="text-xs pu-mono mt-1" style={{ color: "var(--pu-text-dim)", fontSize: "0.6rem" }}>{color}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ━━ MOLECULES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section>
            <SectionAnchor id="molecules" />
            <SectionTitle label="Molecules" />

            {/* Alerts */}
            <div className="p-6 rounded-lg mb-4" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
              <p className="text-xs pu-mono mb-4" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>ALERTS / NOTIFICATIONS</p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: <CheckCircle size={15} />, title: "Operational", msg: "All systems nominal. Mesh network active on 3 nodes.", bg: "rgba(57,255,20,.06)", border: "rgba(57,255,20,.2)", color: "var(--pu-green)" },
                  { icon: <AlertTriangle size={15} />, title: "Warning", msg: "Node 0x3A9C has not responded in 120s.", bg: "rgba(255,184,0,.06)", border: "rgba(255,184,0,.2)", color: "var(--pu-amber)" },
                  { icon: <XCircle size={15} />, title: "Critical", msg: "Encrypted tunnel failed. Attempting reconnect…", bg: "rgba(255,59,59,.06)", border: "rgba(255,59,59,.2)", color: "#FF3B3B" },
                  { icon: <Info size={15} />, title: "Info", msg: "Firmware update available: v1.1.2", bg: "rgba(0,200,255,.06)", border: "rgba(0,200,255,.2)", color: "#00C8FF" },
                ].map(({ icon, title, msg, bg, border, color }) => (
                  <div
                    key={title}
                    className="flex items-start gap-3 px-4 py-3 rounded-lg"
                    style={{ backgroundColor: bg, border: `1px solid ${border}` }}
                  >
                    <span style={{ color, marginTop: "1px" }}>{icon}</span>
                    <div>
                      <span className="text-xs pu-mono" style={{ color }}>{title}</span>
                      <p className="text-sm mt-0.5" style={{ color: "var(--pu-text-muted)", lineHeight: 1.5 }}>{msg}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Product card */}
            <div className="p-6 rounded-lg mb-4" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
              <p className="text-xs pu-mono mb-4" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>PRODUCT CARD</p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { name: "Scout Edition", price: "$3.99/mo", badge: "Entry", accent: "var(--pu-green)", badgeBg: "rgba(57,255,20,.08)", badgeBorder: "rgba(57,255,20,.25)" },
                  { name: "Tactical Edition", price: "$8.99/mo", badge: "Popular", accent: "var(--pu-amber)", badgeBg: "rgba(255,184,0,.08)", badgeBorder: "rgba(255,184,0,.25)" },
                  { name: "Command Edition", price: "$24.99/mo", badge: "Pro", accent: "#00C8FF", badgeBg: "rgba(0,200,255,.08)", badgeBorder: "rgba(0,200,255,.2)" },
                ].map(({ name, price, badge, accent, badgeBg, badgeBorder }) => (
                  <div
                    key={name}
                    className="p-5 rounded-lg flex flex-col gap-3"
                    style={{ backgroundColor: "var(--pu-surface-2)", border: `1px solid var(--pu-border)` }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className="text-xs pu-mono px-2 py-0.5 rounded"
                        style={{ backgroundColor: badgeBg, border: `1px solid ${badgeBorder}`, color: accent }}
                      >
                        {badge}
                      </span>
                      <Terminal size={14} style={{ color: accent }} />
                    </div>
                    <div>
                      <h4 style={{ color: "var(--pu-text)" }}>{name}</h4>
                      <p className="text-xs pu-mono mt-1" style={{ color: accent }}>{price}</p>
                    </div>
                    <button
                      className="w-full py-2 rounded text-xs pu-mono mt-auto"
                      style={{ backgroundColor: accent, color: "#000", fontWeight: 600 }}
                    >
                      Add to Cart
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature list item */}
            <div className="p-6 rounded-lg" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
              <p className="text-xs pu-mono mb-4" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>FEATURE LIST ITEM</p>
              <div className="flex flex-col gap-3">
                {[
                  { icon: <Radio size={16} />, label: "LoRa Mesh Protocol", desc: "Off-grid comms up to 10km" },
                  { icon: <Shield size={16} />, label: "AES-256 Encryption", desc: "Military-grade end-to-end" },
                  { icon: <Wifi size={16} />, label: "Peer-to-Peer Relay", desc: "No central servers required" },
                ].map(({ icon, label, desc }) => (
                  <div key={label} className="flex items-start gap-4 px-4 py-3 rounded-lg" style={{ backgroundColor: "var(--pu-surface-2)", border: "1px solid var(--pu-border)" }}>
                    <div className="w-8 h-8 rounded flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: "var(--pu-green-glow)", color: "var(--pu-green)" }}>
                      {icon}
                    </div>
                    <div>
                      <div className="text-sm" style={{ color: "var(--pu-text)" }}>{label}</div>
                      <div className="text-xs pu-mono mt-0.5" style={{ color: "var(--pu-text-muted)" }}>{desc}</div>
                    </div>
                    <ChevronRight size={14} className="ml-auto mt-1 shrink-0" style={{ color: "var(--pu-text-dim)" }} />
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ━━ UTILITIES ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section>
            <SectionAnchor id="utilities" />
            <SectionTitle label="Utilities" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* pu-glow-green */}
              <div className="p-5 rounded-lg flex flex-col gap-2" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
                <code className="text-xs pu-mono" style={{ color: "var(--pu-green)" }}>.pu-glow-green</code>
                <div
                  className="p-4 rounded flex items-center justify-center pu-glow-green"
                  style={{ backgroundColor: "var(--pu-surface-2)", border: "1px solid var(--pu-border-bright)", color: "var(--pu-green)" }}
                >
                  <Shield size={20} />
                </div>
                <p className="text-xs" style={{ color: "var(--pu-text-dim)" }}>Neon green radial glow shadow — used on hero icons, CTAs</p>
              </div>

              {/* pu-glow-amber */}
              <div className="p-5 rounded-lg flex flex-col gap-2" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
                <code className="text-xs pu-mono" style={{ color: "var(--pu-amber)" }}>.pu-glow-amber</code>
                <div
                  className="p-4 rounded flex items-center justify-center pu-glow-amber"
                  style={{ backgroundColor: "var(--pu-surface-2)", border: "1px solid var(--pu-border-bright)", color: "var(--pu-amber)" }}
                >
                  <AlertTriangle size={20} />
                </div>
                <p className="text-xs" style={{ color: "var(--pu-text-dim)" }}>Amber radial glow — used for warnings, urgent states</p>
              </div>

              {/* pu-grid-bg */}
              <div className="p-5 rounded-lg flex flex-col gap-2" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
                <code className="text-xs pu-mono" style={{ color: "var(--pu-text-muted)" }}>.pu-grid-bg</code>
                <div
                  className="p-6 rounded pu-grid-bg flex items-center justify-center"
                  style={{ height: "80px", border: "1px solid var(--pu-border)" }}
                >
                  <span className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>40px tactical grid</span>
                </div>
                <p className="text-xs" style={{ color: "var(--pu-text-dim)" }}>Used on hero sections and section backgrounds</p>
              </div>

              {/* pu-scanline */}
              <div className="p-5 rounded-lg flex flex-col gap-2" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
                <code className="text-xs pu-mono" style={{ color: "var(--pu-text-muted)" }}>.pu-scanline</code>
                <div
                  className="p-6 rounded pu-scanline flex items-center justify-center"
                  style={{ height: "80px", border: "1px solid var(--pu-border)", backgroundColor: "var(--pu-surface-2)" }}
                >
                  <span className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>CRT scanline overlay</span>
                </div>
                <p className="text-xs" style={{ color: "var(--pu-text-dim)" }}>Subtle CRT texture overlay for terminal-feel surfaces</p>
              </div>

              {/* pu-mono */}
              <div className="p-5 rounded-lg flex flex-col gap-2 md:col-span-2" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
                <code className="text-xs pu-mono" style={{ color: "var(--pu-text-muted)" }}>.pu-mono</code>
                <div className="flex flex-wrap gap-3">
                  <span className="pu-mono text-sm" style={{ color: "var(--pu-green)" }}>SYS_STATUS: ONLINE</span>
                  <span className="pu-mono text-sm" style={{ color: "var(--pu-amber)" }}>NODE_ID: 0x4F2A</span>
                  <span className="pu-mono text-sm" style={{ color: "var(--pu-text-muted)" }}>UPTIME: 99.97%</span>
                  <span className="pu-mono text-sm" style={{ color: "#00C8FF" }}>v1.0.0-stable</span>
                </div>
                <p className="text-xs" style={{ color: "var(--pu-text-dim)" }}>Roboto Mono — used for all data labels, status indicators, nav links, version numbers</p>
              </div>
            </div>
          </section>

          {/* ━━ ICONOGRAPHY ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section>
            <SectionAnchor id="icons" />
            <SectionTitle label="Iconography" />

            <div className="p-6 rounded-lg" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
              <p className="text-xs pu-mono mb-2" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>LUCIDE-REACT — PROJECT ICONS</p>
              <p className="text-xs mb-5" style={{ color: "var(--pu-text-dim)" }}>All icons at 16px default. Use <code className="pu-mono">size=&#123;16&#125;</code> or <code className="pu-mono">size=&#123;20&#125;</code> consistently.</p>
              <div className="flex flex-wrap gap-3">
                {[
                  { icon: <Shield size={18} />, name: "Shield" },
                  { icon: <Radio size={18} />, name: "Radio" },
                  { icon: <Zap size={18} />, name: "Zap" },
                  { icon: <Lock size={18} />, name: "Lock" },
                  { icon: <Wifi size={18} />, name: "Wifi" },
                  { icon: <AlertTriangle size={18} />, name: "AlertTriangle" },
                  { icon: <Download size={18} />, name: "Download" },
                  { icon: <ArrowRight size={18} />, name: "ArrowRight" },
                  { icon: <Github size={18} />, name: "Github" },
                  { icon: <Eye size={18} />, name: "Eye" },
                  { icon: <Code2 size={18} />, name: "Code2" },
                  { icon: <GitBranch size={18} />, name: "GitBranch" },
                  { icon: <Terminal size={18} />, name: "Terminal" },
                  { icon: <Cpu size={18} />, name: "Cpu" },
                  { icon: <Map size={18} />, name: "Map" },
                  { icon: <Activity size={18} />, name: "Activity" },
                  { icon: <Users size={18} />, name: "Users" },
                  { icon: <Star size={18} />, name: "Star" },
                  { icon: <ExternalLink size={18} />, name: "ExternalLink" },
                  { icon: <Package size={18} />, name: "Package" },
                  { icon: <Layers size={18} />, name: "Layers" },
                  { icon: <Bell size={18} />, name: "Bell" },
                  { icon: <Hash size={18} />, name: "Hash" },
                  { icon: <Search size={18} />, name: "Search" },
                  { icon: <ChevronRight size={18} />, name: "ChevronRight" },
                  { icon: <CheckCircle size={18} />, name: "CheckCircle" },
                  { icon: <XCircle size={18} />, name: "XCircle" },
                  { icon: <Info size={18} />, name: "Info" },
                  { icon: <Copy size={18} />, name: "Copy" },
                ].map(({ icon, name }) => (
                  <div
                    key={name}
                    className="flex flex-col items-center gap-2 p-3 rounded-lg"
                    style={{ backgroundColor: "var(--pu-surface-2)", border: "1px solid var(--pu-border)", minWidth: "72px" }}
                  >
                    <span style={{ color: "var(--pu-text-muted)" }}>{icon}</span>
                    <span className="text-xs pu-mono text-center" style={{ color: "var(--pu-text-dim)", fontSize: "0.6rem" }}>{name}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* ━━ MOTION ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section>
            <SectionAnchor id="motion" />
            <SectionTitle label="Motion" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Pulse */}
              <div className="p-6 rounded-lg" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
                <p className="text-xs pu-mono mb-4" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>PULSE — animate-pulse</p>
                <div className="flex items-center gap-3">
                  <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--pu-green)" }} />
                  <span className="text-sm pu-mono" style={{ color: "var(--pu-green)" }}>GRID-DOWN READY</span>
                </div>
                <div className="flex items-center gap-3 mt-3">
                  <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: "var(--pu-amber)" }} />
                  <span className="text-sm pu-mono" style={{ color: "var(--pu-amber)" }}>SIGNAL DEGRADED</span>
                </div>
                <p className="text-xs mt-4" style={{ color: "var(--pu-text-dim)" }}>Used on live status indicators and hero status badge</p>
              </div>

              {/* Transitions */}
              <div className="p-6 rounded-lg" style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}>
                <p className="text-xs pu-mono mb-4" style={{ color: "var(--pu-text-dim)", letterSpacing: "0.12em" }}>TRANSITION TOKENS</p>
                <div className="flex flex-col gap-3">
                  {[
                    { token: "duration-100", label: "100ms — hover micro-interactions" },
                    { token: "duration-150", label: "150ms — nav links, buttons" },
                    { token: "duration-200", label: "200ms — drawer, modal open" },
                    { token: "duration-300", label: "300ms — page transitions" },
                  ].map(({ token, label }) => (
                    <div key={token} className="flex items-center gap-3">
                      <code className="text-xs pu-mono w-28 shrink-0" style={{ color: "var(--pu-green)" }}>{token}</code>
                      <span className="text-xs" style={{ color: "var(--pu-text-muted)" }}>{label}</span>
                    </div>
                  ))}
                </div>
                <p className="text-xs mt-4" style={{ color: "var(--pu-text-dim)" }}>Easing: <code className="pu-mono">ease</code> default · <code className="pu-mono">ease-out</code> for exits</p>
              </div>
            </div>
          </section>

          {/* ━━ DO / DON'T ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
          <section>
            <SectionAnchor id="dodonts" />
            <SectionTitle label="Do / Don't" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* DO column */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle size={14} style={{ color: "var(--pu-green)" }} />
                  <span className="text-xs pu-mono tracking-widest uppercase" style={{ color: "var(--pu-green)" }}>Do</span>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { title: "Use neon green for primary actions", preview: <button className="px-4 py-2 rounded text-xs pu-mono" style={{ backgroundColor: "var(--pu-green)", color: "#000", fontWeight: 600 }}>Deploy Node</button> },
                    { title: "Use Roboto Mono for all data & labels", preview: <span className="text-sm pu-mono" style={{ color: "var(--pu-green)" }}>SYS_STATUS: OK</span> },
                    { title: "Use --pu-text-muted for body copy", preview: <p className="text-xs" style={{ color: "var(--pu-text-muted)" }}>Encrypted comms for emergency preparedness.</p> },
                    { title: "Logo on dark or surface backgrounds only", preview: <div className="px-4 py-2 rounded" style={{ backgroundColor: "#080B09", display: "inline-block" }}><div style={{ width: "86px", height: "28px", overflow: "visible", position: "relative" }}><Logo /></div></div> },
                  ].map(({ title, preview }) => (
                    <div
                      key={title}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: "rgba(57,255,20,.04)", border: "1px solid rgba(57,255,20,.15)" }}
                    >
                      <p className="text-xs mb-3" style={{ color: "var(--pu-text-muted)" }}>{title}</p>
                      <div>{preview}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DON'T column */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <XCircle size={14} style={{ color: "#FF3B3B" }} />
                  <span className="text-xs pu-mono tracking-widest uppercase" style={{ color: "#FF3B3B" }}>Don't</span>
                </div>
                <div className="flex flex-col gap-3">
                  {[
                    { title: "Don't use green on green text", preview: <button className="px-4 py-2 rounded text-xs pu-mono" style={{ backgroundColor: "var(--pu-green)", color: "var(--pu-green-dim)", fontWeight: 600 }}>Illegible</button> },
                    { title: "Don't use Inter for data / status labels", preview: <span className="text-sm" style={{ color: "var(--pu-text-muted)", fontFamily: "Inter" }}>SYS_STATUS: WRONG FONT</span> },
                    { title: "Don't use --pu-text for body copy (too bright)", preview: <p className="text-xs" style={{ color: "var(--pu-text)" }}>Overly bright for long-form reading.</p> },
                    { title: "Don't place logo on light or colored backgrounds", preview: <div className="px-4 py-2 rounded" style={{ backgroundColor: "#39FF14", display: "inline-block" }}><div style={{ width: "86px", height: "28px", overflow: "visible", position: "relative" }}><Logo /></div></div> },
                  ].map(({ title, preview }) => (
                    <div
                      key={title}
                      className="p-4 rounded-lg"
                      style={{ backgroundColor: "rgba(255,59,59,.04)", border: "1px solid rgba(255,59,59,.15)" }}
                    >
                      <p className="text-xs mb-3" style={{ color: "var(--pu-text-muted)" }}>{title}</p>
                      <div>{preview}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

        </main>
      </div>
    </div>
  );
}
