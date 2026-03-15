import { Link } from "react-router";
import { Shield, Radio, Users, ChevronRight, Zap, Lock, Wifi, AlertTriangle, Download, ArrowRight, Github, Eye, Code2, GitBranch } from "lucide-react";
import { ContourMapBackground } from "../components/ContourMapBackground";

// ─── Section: Hero ────────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section
      className="relative -mt-16"
      style={{ backgroundColor: "var(--pu-bg)" }}
    >
      {/* Contour map background — extends 64px behind the navbar */}
      <ContourMapBackground opacity={0.4} />
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(57,255,20,0.06) 0%, transparent 70%)",
          zIndex: 1,
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24 md:pt-44 md:pb-32" style={{ zIndex: 2 }}>
        <div className="text-center max-w-4xl mx-auto">
          {/* Status badge */}
          <div className="flex justify-center mb-6">
            <span
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs pu-mono tracking-wider uppercase"
              style={{
                backgroundColor: "var(--pu-surface-2)",
                border: "1px solid var(--pu-border-bright)",
                color: "var(--pu-green)",
              }}
            >
              <span
                className="w-2 h-2 rounded-full animate-pulse"
                style={{ backgroundColor: "var(--pu-green)" }}
              />
              Grid-Down Ready · Encrypted · 100% Open Source
            </span>
          </div>

          {/* Headline */}
          <h1
            className="mb-6"
            style={{ color: "var(--pu-text)", letterSpacing: "-0.03em" }}
          >
            When the Grid Goes Dark,{" "}
            <br />
            <span
              style={{
                color: "var(--pu-green)",
                textShadow: "0 0 30px rgba(57,255,20,0.4)",
              }}
            >
              Stay Connected.
            </span>
          </h1>

          {/* Sub-headline */}
          <p
            className="mx-auto mb-10 max-w-2xl"
            style={{
              color: "var(--pu-text-muted)",
              fontSize: "1.15rem",
              lineHeight: "1.75",
            }}
          >
            Plus Ultra is the encrypted, mesh-networked communication platform built for infrastructure failures, EMP events, and off-grid operations.
            <br />
            No cell towers. No internet. No compromises.
          </p>

          {/* CTA buttons */}
          <div id="download" className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <a
              href="https://apps.apple.com"
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center gap-3 px-6 py-4 rounded-lg w-full sm:w-auto justify-center transition-all duration-200"
              style={{
                backgroundColor: "var(--pu-surface-2)",
                border: "1px solid var(--pu-border-bright)",
                color: "var(--pu-text)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--pu-green-dim)";
                el.style.backgroundColor = "var(--pu-surface-3)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--pu-border-bright)";
                el.style.backgroundColor = "var(--pu-surface-2)";
              }}
            >
              <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor" style={{ color: "var(--pu-text)" }}>
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs" style={{ color: "var(--pu-text-muted)" }}>Get it on</div>
                <div className="text-sm font-semibold">App Store</div>
              </div>
            </a>

            <a
              href="https://play.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-6 py-4 rounded-lg w-full sm:w-auto justify-center transition-all duration-200"
              style={{
                backgroundColor: "var(--pu-surface-2)",
                border: "1px solid var(--pu-border-bright)",
                color: "var(--pu-text)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--pu-green-dim)";
                el.style.backgroundColor = "var(--pu-surface-3)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--pu-border-bright)";
                el.style.backgroundColor = "var(--pu-surface-2)";
              }}
            >
              <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style={{ color: "var(--pu-text)" }}>
                <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C14.15 1.23 13.11 1 12 1c-1.11 0-2.15.23-3.09.63L7.43.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.3 1.3C6.34 3.13 5 5.21 5 7.6v.4h14v-.4c0-2.39-1.34-4.47-3.47-5.44zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
              </svg>
              <div className="text-left">
                <div className="text-xs" style={{ color: "var(--pu-text-muted)" }}>Get it on</div>
                <div className="text-sm font-semibold">Google Play</div>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Stats Band ──────────────────────────────────────────────────────
function StatsBand() {
  const stats = [
    { val: "256-bit", label: "AES Encryption" },
    { val: "0",       label: "Central Servers" },
    { val: "40km+",   label: "Mesh Range" },
    { val: "128-bit", label: "Elliptic Curve Keys" },
  ];

  return (
    <div
      className="relative w-full"
      style={{
        backgroundColor: "var(--pu-surface)",
        borderTop: "1px solid var(--pu-border)",
        borderBottom: "1px solid var(--pu-border)",
      }}
    >
      {/* subtle scanline overlay */}
      <div className="absolute inset-0 pu-scanline pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4">
          {stats.map((stat, i) => (
            <div
              key={stat.label}
              className="flex flex-col items-center justify-center py-8 px-6"
              style={{
                borderRight: i < stats.length - 1 ? "1px solid var(--pu-border)" : "1px solid var(--pu-border)",
                borderLeft: i === 0 ? "1px solid var(--pu-border)" : "none",
              }}
            >
              <span
                className="pu-mono"
                style={{
                  color: "var(--pu-text)",
                  fontSize: "clamp(1.25rem, 2.5vw, 1.65rem)",
                  fontWeight: 700,
                  letterSpacing: "-0.01em",
                }}
              >
                {stat.val}
              </span>
              <span
                className="pu-mono tracking-wider uppercase mt-1.5"
                style={{
                  color: "#6b7280",
                  fontSize: "0.65rem",
                  letterSpacing: "0.12em",
                }}
              >
                {stat.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Section: App Mockup ──────────────────────────────────────────────────────
function MockupSection() {
  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: "var(--pu-surface)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 80% at 50% 50%, rgba(57,255,20,0.04) 0%, transparent 70%)",
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left: Text */}
          <div>
            <div
              className="inline-block px-3 py-1 rounded text-xs pu-mono tracking-widest uppercase mb-4"
              style={{
                backgroundColor: "var(--pu-green-glow)",
                color: "var(--pu-green)",
                border: "1px solid rgba(57,255,20,0.2)",
              }}
            >
              The Platform
            </div>
            <h2 className="mb-4">
              Two Modes.{" "}
              <span style={{ color: "var(--pu-green)" }}>One Mission.</span>
            </h2>
            <p className="mb-8">
              Plus Ultra operates seamlessly in both Grid-Up (standard internet) and Grid-Down (offline mesh) environments. When infrastructure fails, your network doesn't.
            </p>
            <div className="space-y-4">
              {[
                {
                  icon: <Wifi size={18} />,
                  color: "var(--pu-green)",
                  title: "Grid-Up Mode",
                  desc: "Encrypted channels over existing internet. Zero-knowledge architecture. No metadata leakage.",
                },
                {
                  icon: <Radio size={18} />,
                  color: "var(--pu-amber)",
                  title: "Grid-Down Mode",
                  desc: "Bluetooth/LoRa mesh networking. No cell towers, no Wi-Fi required. Works in total blackout.",
                },
                {
                  icon: <Lock size={18} />,
                  color: "var(--pu-green)",
                  title: "Always Encrypted",
                  desc: "End-to-end AES-256 encryption. Your keys never leave your device.",
                },
              ].map((item) => (
                <div
                  key={item.title}
                  className="flex gap-4 p-4 rounded-lg"
                  style={{
                    backgroundColor: "var(--pu-surface-2)",
                    border: "1px solid var(--pu-border)",
                  }}
                >
                  <div
                    className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded"
                    style={{
                      backgroundColor: item.color === "var(--pu-green)" ? "var(--pu-green-glow)" : "var(--pu-amber-glow)",
                      color: item.color,
                    }}
                  >
                    {item.icon}
                  </div>
                  <div>
                    <div className="text-sm font-semibold mb-1 pu-mono" style={{ color: "var(--pu-text)" }}>
                      {item.title}
                    </div>
                    <div className="text-sm" style={{ color: "var(--pu-text-muted)" }}>
                      {item.desc}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <Link
              to="/features"
              className="inline-flex items-center gap-2 mt-8 text-sm pu-mono transition-colors"
              style={{ color: "var(--pu-green)" }}
            >
              View all features <ArrowRight size={14} />
            </Link>
          </div>

          {/* Right: App mockup */}
          <div className="flex justify-center">
            <div
              className="relative w-72 rounded-3xl overflow-hidden"
              style={{
                border: "1px solid var(--pu-border-bright)",
                boxShadow: "0 0 60px rgba(57,255,20,0.12), 0 0 120px rgba(57,255,20,0.04)",
                backgroundColor: "var(--pu-surface-2)",
              }}
            >
              {/* Phone notch */}
              <div
                className="relative"
                style={{
                  background: "linear-gradient(135deg, var(--pu-surface-2) 0%, var(--pu-bg) 100%)",
                }}
              >
                {/* Status bar */}
                <div
                  className="flex items-center justify-between px-6 pt-4 pb-2 text-xs pu-mono"
                  style={{ color: "var(--pu-text-muted)" }}
                >
                  <span>09:41</span>
                  <div
                    className="w-16 h-4 rounded-full"
                    style={{ backgroundColor: "var(--pu-surface-3)" }}
                  />
                  <span style={{ color: "var(--pu-green)" }}>●●●</span>
                </div>

                {/* App content mockup */}
                <div className="px-4 pb-4">
                  {/* Header */}
                  <div
                    className="flex items-center justify-between mb-4 p-3 rounded-lg"
                    style={{ backgroundColor: "var(--pu-surface-3)" }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded flex items-center justify-center"
                        style={{ backgroundColor: "var(--pu-green)" }}
                      >
                        <Zap size={12} color="#000" />
                      </div>
                      <span className="text-xs pu-mono" style={{ color: "var(--pu-text)" }}>
                        PLUS ULTRA
                      </span>
                    </div>
                    <div
                      className="px-2 py-0.5 rounded text-xs pu-mono"
                      style={{ backgroundColor: "var(--pu-green-glow)", color: "var(--pu-green)" }}
                    >
                      MESH ACTIVE
                    </div>
                  </div>

                  {/* Map/radar mockup */}
                  <div
                    className="relative rounded-lg overflow-hidden mb-3"
                    style={{
                      backgroundColor: "#050A07",
                      border: "1px solid var(--pu-border)",
                      height: "160px",
                    }}
                  >
                    {/* Radar rings */}
                    {[40, 65, 90, 115, 140].map((r, i) => (
                      <div
                        key={r}
                        className="absolute rounded-full border"
                        style={{
                          width: r * 2 + "px",
                          height: r * 2 + "px",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          borderColor: `rgba(57,255,20,${0.06 + i * 0.03})`,
                        }}
                      />
                    ))}
                    {/* Radar sweep line */}
                    <div
                      className="absolute w-0.5 origin-bottom"
                      style={{
                        height: "50%",
                        bottom: "50%",
                        left: "50%",
                        transform: "translateX(-50%) rotate(45deg)",
                        background: "linear-gradient(to top, var(--pu-green), transparent)",
                        opacity: 0.7,
                      }}
                    />
                    {/* Node dots */}
                    {[
                      { top: "30%", left: "65%", color: "var(--pu-green)" },
                      { top: "60%", left: "30%", color: "var(--pu-green)" },
                      { top: "45%", left: "75%", color: "var(--pu-amber)" },
                      { top: "20%", left: "40%", color: "var(--pu-green)" },
                    ].map((dot, i) => (
                      <div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                          top: dot.top,
                          left: dot.left,
                          backgroundColor: dot.color,
                          boxShadow: `0 0 6px ${dot.color}`,
                        }}
                      />
                    ))}
                    {/* Center dot - user */}
                    <div
                      className="absolute w-3 h-3 rounded-full"
                      style={{
                        top: "50%",
                        left: "50%",
                        transform: "translate(-50%, -50%)",
                        backgroundColor: "var(--pu-green)",
                        boxShadow: "0 0 12px rgba(57,255,20,0.8)",
                      }}
                    />
                    {/* Label */}
                    <div
                      className="absolute bottom-2 left-3 text-xs pu-mono"
                      style={{ color: "var(--pu-green-dim)" }}
                    >
                      4 NODES ACTIVE
                    </div>
                  </div>

                  {/* Chat messages mockup */}
                  <div className="space-y-2 mb-3">
                    {[
                      { from: "ALPHA-1", msg: "Route Alpha secured", align: "left", mine: false },
                      { from: "YOU", msg: "Confirmed. Moving to grid B3", align: "right", mine: true },
                      { from: "BRAVO-7", msg: "ETA 12 mins", align: "left", mine: false },
                    ].map((m, i) => (
                      <div key={i} className={`flex ${m.mine ? "justify-end" : "justify-start"}`}>
                        <div
                          className="px-2.5 py-1.5 rounded-lg max-w-[80%]"
                          style={{
                            backgroundColor: m.mine ? "var(--pu-green-glow)" : "var(--pu-surface-3)",
                            border: m.mine ? "1px solid rgba(57,255,20,0.3)" : "1px solid var(--pu-border)",
                          }}
                        >
                          {!m.mine && (
                            <div className="text-xs pu-mono mb-0.5" style={{ color: "var(--pu-green)" }}>
                              {m.from}
                            </div>
                          )}
                          <div className="text-xs" style={{ color: "var(--pu-text)" }}>
                            {m.msg}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input bar */}
                  <div
                    className="flex items-center gap-2 p-2 rounded-lg"
                    style={{
                      backgroundColor: "var(--pu-surface-3)",
                      border: "1px solid var(--pu-border)",
                    }}
                  >
                    <Lock size={10} style={{ color: "var(--pu-green)", flexShrink: 0 }} />
                    <div className="flex-1 text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
                      Encrypted message…
                    </div>
                    <div
                      className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0"
                      style={{ backgroundColor: "var(--pu-green)" }}
                    >
                      <ArrowRight size={10} color="#000" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Open Source ─────────────────────────────────────────────────────
function OpenSourceSection() {
  const auditLines = [
    { prompt: "$", cmd: "git clone https://github.com/adam7rans/plus-ultra", out: null },
    { prompt: ">", cmd: null, out: "Cloning into 'plus-ultra'... done." },
    { prompt: "$", cmd: "grep -r 'analytics\\|telemetry\\|tracking' ./src", out: null },
    { prompt: ">", cmd: null, out: "No matches found." },
    { prompt: "$", cmd: "grep -r 'backdoor\\|keylogger\\|exfil' ./src", out: null },
    { prompt: ">", cmd: null, out: "No matches found." },
    { prompt: "$", cmd: "cat LICENSE", out: null },
    { prompt: ">", cmd: null, out: "GNU General Public License v3.0 — Full source, forever." },
  ];

  const pillars = [
    {
      icon: <Eye size={20} />,
      color: "var(--pu-green)",
      glow: "var(--pu-green-glow)",
      title: "Fully Auditable",
      desc: "Every line of code is public. Security researchers, skeptics, and contributors can inspect, fork, or audit the entire codebase at any time.",
    },
    {
      icon: <Code2 size={20} />,
      color: "var(--pu-green)",
      glow: "var(--pu-green-glow)",
      title: "No Backdoors. Ever.",
      desc: "There are no hidden APIs, no secret data pipelines, no government keys, and no telemetry. If it's not in the repo, it doesn't exist in the app.",
    },
    {
      icon: <GitBranch size={20} />,
      color: "var(--pu-amber)",
      glow: "var(--pu-amber-glow)",
      title: "Community-Verified",
      desc: "Releases are reproducibly built and hash-verified. You can compile from source yourself and confirm your binary matches ours — byte for byte.",
    },
  ];

  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: "var(--pu-surface)" }}
    >
      {/* Subtle contour overlay */}
      <ContourMapBackground opacity={0.15} />
      {/* Amber glow bottom-right */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: 0,
          right: 0,
          width: "40%",
          height: "60%",
          background: "radial-gradient(ellipse at bottom right, rgba(255,184,0,0.05) 0%, transparent 70%)",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs pu-mono tracking-widest uppercase mb-4"
            style={{
              backgroundColor: "var(--pu-surface-2)",
              color: "var(--pu-green)",
              border: "1px solid rgba(57,255,20,0.2)",
            }}
          >
            <Github size={12} />
            Open Source
          </div>
          <h2 className="mb-4">
            Nothing to{" "}
            <span style={{ color: "var(--pu-green)", textShadow: "0 0 20px rgba(57,255,20,0.4)" }}>
              Hide.
            </span>
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: "var(--pu-text-muted)", fontSize: "1rem" }}>
            Plus Ultra is fully open source under the GPL v3 license. The entire codebase is public — no proprietary blobs, no closed modules, no exceptions.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 items-start">
          {/* Terminal audit log */}
          <div
            className="rounded-xl overflow-hidden"
            style={{
              border: "1px solid var(--pu-border-bright)",
              backgroundColor: "#050A07",
              boxShadow: "0 0 40px rgba(57,255,20,0.06)",
            }}
          >
            {/* Title bar */}
            <div
              className="flex items-center gap-2 px-4 py-3 border-b"
              style={{ borderColor: "var(--pu-border)", backgroundColor: "var(--pu-surface-2)" }}
            >
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FF5F56" }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#FFBD2E" }} />
              <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "#27C93F" }} />
              <span className="ml-3 text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
                security-audit.sh
              </span>
            </div>
            {/* Terminal lines */}
            <div className="p-5 space-y-1.5">
              {auditLines.map((line, i) => (
                <div key={i} className="flex gap-2 text-xs pu-mono leading-relaxed">
                  <span style={{ color: line.out ? "var(--pu-text-dim)" : "var(--pu-green)", flexShrink: 0 }}>
                    {line.prompt}
                  </span>
                  {line.cmd && (
                    <span style={{ color: "var(--pu-text)" }}>{line.cmd}</span>
                  )}
                  {line.out && (
                    <span style={{ color: line.out.startsWith("No matches") ? "var(--pu-green)" : "var(--pu-text-muted)" }}>
                      {line.out}
                    </span>
                  )}
                </div>
              ))}
              {/* Blinking cursor */}
              <div className="flex gap-2 text-xs pu-mono">
                <span style={{ color: "var(--pu-green)" }}>$</span>
                <span
                  className="w-2 h-4 inline-block"
                  style={{
                    backgroundColor: "var(--pu-green)",
                    animation: "pulse 1s step-end infinite",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Pillars + CTA */}
          <div className="flex flex-col gap-5">
            {pillars.map((p) => (
              <div
                key={p.title}
                className="flex gap-4 p-5 rounded-xl"
                style={{
                  backgroundColor: "var(--pu-surface-2)",
                  border: "1px solid var(--pu-border)",
                }}
              >
                <div
                  className="flex-shrink-0 flex items-center justify-center w-10 h-10 rounded-lg"
                  style={{ backgroundColor: p.glow, color: p.color }}
                >
                  {p.icon}
                </div>
                <div>
                  <div className="text-sm pu-mono mb-1" style={{ color: p.color }}>
                    {p.title}
                  </div>
                  <div className="text-sm" style={{ color: "var(--pu-text-muted)", lineHeight: "1.65" }}>
                    {p.desc}
                  </div>
                </div>
              </div>
            ))}

            {/* GitHub CTA */}
            <a
              href="https://github.com/adam7rans/plus-ultra"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 px-6 py-4 rounded-xl transition-all duration-200 pu-mono"
              style={{
                backgroundColor: "var(--pu-surface-2)",
                border: "1px solid var(--pu-border-bright)",
                color: "var(--pu-text)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--pu-green-dim)";
                el.style.backgroundColor = "var(--pu-surface-3)";
                el.style.boxShadow = "0 0 20px rgba(57,255,20,0.08)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.borderColor = "var(--pu-border-bright)";
                el.style.backgroundColor = "var(--pu-surface-2)";
                el.style.boxShadow = "none";
              }}
            >
              <Github size={18} style={{ color: "var(--pu-green)" }} />
              <span className="text-sm">
                View Source on GitHub
              </span>
              <span
                className="ml-auto text-xs px-2 py-0.5 rounded"
                style={{ backgroundColor: "var(--pu-green-glow)", color: "var(--pu-green)" }}
              >
                adam7rans/plus-ultra
              </span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── Section: Thesis / 3-Column Problem ───────────────────────────────────────
const thesisData = [
  {
    icon: <AlertTriangle size={24} />,
    accentColor: "var(--pu-amber)",
    glowColor: "var(--pu-amber-glow)",
    tag: "THREAT",
    title: "Grid Vulnerability",
    description:
      "Modern infrastructure is fragile. A single EMP event, cyberattack, or natural disaster can take down cell towers, internet backbones, and power grids across entire regions—silencing conventional communications in seconds.",
    stat: "99.9%",
    statLabel: "of comms rely on centralized infra",
  },
  {
    icon: <Users size={24} />,
    accentColor: "var(--pu-green)",
    glowColor: "var(--pu-green-glow)",
    tag: "SOLUTION",
    title: "Community Vetting",
    description:
      "Plus Ultra uses a cryptographic trust chain for node verification. Every node in your mesh must be manually authorized, ensuring your network contains only verified, trusted contacts — no infiltration, no spoofing.",
    stat: "Zero",
    statLabel: "unknown nodes on your mesh",
  },
  {
    icon: <Radio size={24} />,
    accentColor: "var(--pu-green)",
    glowColor: "var(--pu-green-glow)",
    tag: "CAPABILITY",
    title: "Offline Communications",
    description:
      "Bluetooth LE mesh + LoRa radio integration allows messages to hop between devices over 40km with no internet required. Your group stays coordinated whether you're in a blackout, a faraday cage, or the deep wilderness.",
    stat: "40km+",
    statLabel: "range without cell or Wi-Fi",
  },
];

function ThesisSection() {
  return (
    <section
      className="py-20 relative"
      style={{ backgroundColor: "var(--pu-bg)" }}
    >
      <ContourMapBackground opacity={0.15} />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-14">
          <div
            className="inline-block px-3 py-1 rounded text-xs pu-mono tracking-widest uppercase mb-4"
            style={{
              backgroundColor: "var(--pu-surface-2)",
              color: "var(--pu-text-muted)",
              border: "1px solid var(--pu-border)",
            }}
          >
            Why Plus Ultra
          </div>
          <h2 className="mb-4">
            The Grid is{" "}
            <span style={{ color: "var(--pu-amber)", textShadow: "0 0 20px rgba(255,184,0,0.3)" }}>
              Already Failing.
            </span>
          </h2>
          <p
            className="max-w-2xl mx-auto"
            style={{ color: "var(--pu-text-muted)", fontSize: "1rem" }}
          >
            Infrastructure dependencies create catastrophic single points of failure. Plus Ultra was engineered from day one to operate without them.
          </p>
        </div>

        {/* 3-column grid */}
        <div className="grid md:grid-cols-3 gap-6">
          {thesisData.map((item) => (
            <div
              key={item.title}
              className="relative rounded-xl p-6 flex flex-col"
              style={{
                backgroundColor: "var(--pu-surface)",
                border: "1px solid var(--pu-border)",
              }}
            >
              {/* Tag */}
              <div className="flex items-center justify-between mb-4">
                <span
                  className="text-xs pu-mono tracking-widest"
                  style={{ color: item.accentColor }}
                >
                  // {item.tag}
                </span>
                <div
                  className="flex items-center justify-center w-10 h-10 rounded-lg"
                  style={{
                    backgroundColor: item.glowColor,
                    color: item.accentColor,
                  }}
                >
                  {item.icon}
                </div>
              </div>

              {/* Title */}
              <h3 className="mb-3">{item.title}</h3>

              {/* Description */}
              <p className="text-sm flex-1 mb-6" style={{ color: "var(--pu-text-muted)", lineHeight: "1.7" }}>
                {item.description}
              </p>

              {/* Stat */}
              <div
                className="pt-4 mt-auto"
                style={{ borderTop: "1px solid var(--pu-border)" }}
              >
                <div
                  className="pu-mono"
                  style={{ color: item.accentColor, fontSize: "1.5rem", fontWeight: 700 }}
                >
                  {item.stat}
                </div>
                <div className="text-xs pu-mono mt-0.5" style={{ color: "var(--pu-text-muted)" }}>
                  {item.statLabel}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Final CTA ───────────────────────────────────────────────────────
function CtaSection() {
  return (
    <section
      className="relative py-20 overflow-hidden"
      style={{ backgroundColor: "var(--pu-bg)" }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 70% 80% at 50% 100%, rgba(57,255,20,0.06) 0%, transparent 70%)",
        }}
      />
      <div className="relative max-w-3xl mx-auto px-4 sm:px-6 text-center">
        <div
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg mb-6 pu-mono text-xs tracking-widest"
          style={{
            backgroundColor: "var(--pu-surface-2)",
            border: "1px solid var(--pu-border-bright)",
            color: "var(--pu-text-muted)",
          }}
        >
          <Download size={12} style={{ color: "var(--pu-green)" }} />
          FREE TO DOWNLOAD · NO SUBSCRIPTION FOR CORE FEATURES
        </div>
        <h2 className="mb-4">
          Prepare Before You{" "}
          <span style={{ color: "var(--pu-green)", textShadow: "0 0 20px rgba(57,255,20,0.4)" }}>
            Need To.
          </span>
        </h2>
        <p className="mb-10" style={{ color: "var(--pu-text-muted)", fontSize: "1rem" }}>
          Join 50,000+ prepared citizens, first responders, and security professionals who trust Plus Ultra when it matters most.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://apps.apple.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 rounded-lg w-full sm:w-auto justify-center transition-all duration-200"
            style={{
              backgroundColor: "var(--pu-surface-2)",
              border: "1px solid var(--pu-border-bright)",
              color: "var(--pu-text)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "var(--pu-green-dim)";
              el.style.backgroundColor = "var(--pu-surface-3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "var(--pu-border-bright)";
              el.style.backgroundColor = "var(--pu-surface-2)";
            }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            <div className="text-left">
              <div className="text-xs" style={{ color: "var(--pu-text-muted)" }}>Get it on</div>
              <div className="text-sm font-semibold">App Store</div>
            </div>
          </a>
          <a
            href="https://play.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-6 py-4 rounded-lg w-full sm:w-auto justify-center transition-all duration-200"
            style={{
              backgroundColor: "var(--pu-surface-2)",
              border: "1px solid var(--pu-border-bright)",
              color: "var(--pu-text)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "var(--pu-green-dim)";
              el.style.backgroundColor = "var(--pu-surface-3)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLAnchorElement;
              el.style.borderColor = "var(--pu-border-bright)";
              el.style.backgroundColor = "var(--pu-surface-2)";
            }}
          >
            <svg viewBox="0 0 24 24" width="22" height="22" fill="currentColor" style={{ color: "var(--pu-text)" }}>
              <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C14.15 1.23 13.11 1 12 1c-1.11 0-2.15.23-3.09.63L7.43.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.3 1.3C6.34 3.13 5 5.21 5 7.6v.4h14v-.4c0-2.39-1.34-4.47-3.47-5.44zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
            </svg>
            <div className="text-left">
              <div className="text-xs" style={{ color: "var(--pu-text-muted)" }}>Get it on</div>
              <div className="text-sm font-semibold">Google Play</div>
            </div>
          </a>
        </div>
        <div className="mt-8 flex items-center justify-center gap-2">
          <Shield size={14} style={{ color: "var(--pu-text-muted)" }} />
          <span className="text-xs pu-mono" style={{ color: "var(--pu-text-muted)" }}>
            No accounts required for offline mesh mode
          </span>
        </div>
      </div>
    </section>
  );
}

// ─── Home Page ────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <>
      <HeroSection />
      <StatsBand />
      <MockupSection />
      <ThesisSection />
      <OpenSourceSection />
      <CtaSection />
    </>
  );
}