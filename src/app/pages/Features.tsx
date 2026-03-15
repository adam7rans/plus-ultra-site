import { useState } from "react";
import {
  Wifi, Radio, Shield, Map, Brain, Bluetooth, Lock, Users,
  ArrowRight, Check, Cpu, Zap, Signal, GitBranch, ChevronRight,
} from "lucide-react";
import { SEO } from "../components/SEO";
import { PAGE_META } from "../lib/analytics";

// ─── Shared types ──────────────────────────────────────────────────────────────
type Mode = "grid-up" | "grid-down";

// ─── Diagram: Trust Chain ─────────────────────────────────────────────────────
function TrustChainDiagram() {
  const nodes = [
    { id: "YOUR KEY", hash: "0xA3F2…", level: "Root" },
    { id: "ALPHA-1", hash: "0xB7C1…", level: "L1" },
    { id: "BRAVO-3", hash: "0xD4E9…", level: "L2" },
  ];
  return (
    <div
      className="rounded-xl p-5 overflow-x-auto"
      style={{ backgroundColor: "#050A07", border: "1px solid var(--pu-border-bright)" }}
    >
      <div className="text-xs pu-mono mb-4" style={{ color: "var(--pu-text-dim)" }}>
        // TRUST_CHAIN_DIAGRAM
      </div>
      <div className="flex items-center gap-0 min-w-max">
        {nodes.map((node, i) => (
          <div key={node.id} className="flex items-center">
            <div
              className="flex flex-col items-center p-3 rounded-lg"
              style={{
                backgroundColor: i === 0 ? "rgba(57,255,20,0.12)" : "var(--pu-surface-2)",
                border: `1px solid ${i === 0 ? "rgba(57,255,20,0.4)" : "var(--pu-border-bright)"}`,
                minWidth: "110px",
              }}
            >
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center mb-2"
                style={{ backgroundColor: i === 0 ? "var(--pu-green)" : "var(--pu-surface-3)", color: i === 0 ? "#000" : "var(--pu-green)" }}
              >
                <Shield size={14} />
              </div>
              <div className="text-xs pu-mono" style={{ color: i === 0 ? "var(--pu-green)" : "var(--pu-text)" }}>
                {node.id}
              </div>
              <div className="text-xs pu-mono mt-0.5" style={{ color: "var(--pu-text-dim)" }}>
                {node.hash}
              </div>
              <div
                className="mt-2 px-1.5 py-0.5 rounded text-xs pu-mono"
                style={{
                  backgroundColor: "var(--pu-surface-3)",
                  color: i === 0 ? "var(--pu-green)" : "var(--pu-text-muted)",
                }}
              >
                {node.level}
              </div>
            </div>
            {i < nodes.length - 1 && (
              <div className="flex flex-col items-center mx-2">
                <div className="text-xs pu-mono mb-1" style={{ color: "var(--pu-green)", fontSize: "9px" }}>
                  SIGNS
                </div>
                <div className="flex items-center gap-1">
                  <div style={{ width: "32px", height: "1px", backgroundColor: "var(--pu-green)", opacity: 0.5 }} />
                  <ArrowRight size={10} style={{ color: "var(--pu-green)" }} />
                </div>
                <div className="text-xs pu-mono mt-1" style={{ color: "var(--pu-text-dim)", fontSize: "9px" }}>
                  Ed25519
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      <div
        className="mt-4 flex items-center gap-2 px-3 py-2 rounded text-xs pu-mono"
        style={{ backgroundColor: "var(--pu-green-glow)", color: "var(--pu-green)" }}
      >
        <Check size={12} />
        Trust propagates cryptographically — no central authority required
      </div>
    </div>
  );
}

// ─── Diagram: Mesh Topology ───────────────────────────────────────────────────
function MeshTopologyDiagram() {
  const nodePositions = [
    { x: 50, y: 20, label: "BASE", you: false, lora: false },
    { x: 20, y: 50, label: "ALPHA", you: false, lora: true },
    { x: 50, y: 50, label: "YOU", you: true, lora: false },
    { x: 80, y: 50, label: "BRAVO", you: false, lora: false },
    { x: 35, y: 80, label: "CHARLIE", you: false, lora: true },
    { x: 65, y: 80, label: "DELTA", you: false, lora: false },
  ];
  const links = [
    { from: 0, to: 1, type: "lora" },
    { from: 0, to: 2, type: "bt" },
    { from: 0, to: 3, type: "lora" },
    { from: 1, to: 4, type: "bt" },
    { from: 2, to: 3, type: "bt" },
    { from: 2, to: 4, type: "bt" },
    { from: 3, to: 5, type: "bt" },
    { from: 4, to: 5, type: "bt" },
  ];
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "#050A07", border: "1px solid var(--pu-border-bright)" }}
    >
      <div className="text-xs pu-mono mb-3" style={{ color: "var(--pu-text-dim)" }}>
        // MESH_TOPOLOGY · 6 NODES ACTIVE
      </div>
      <div className="relative" style={{ height: "200px" }}>
        <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
          {/* Links */}
          {links.map((link, i) => {
            const from = nodePositions[link.from];
            const to = nodePositions[link.to];
            return (
              <line
                key={i}
                x1={from.x} y1={from.y}
                x2={to.x} y2={to.y}
                stroke={link.type === "lora" ? "rgba(255,184,0,0.4)" : "rgba(57,255,20,0.35)"}
                strokeWidth={link.type === "lora" ? "0.5" : "0.4"}
                strokeDasharray={link.type === "lora" ? "2 1.5" : "0"}
              />
            );
          })}
          {/* Nodes */}
          {nodePositions.map((node, i) => (
            <g key={i}>
              <circle
                cx={node.x}
                cy={node.y}
                r={node.you ? 4.5 : 3}
                fill={node.you ? "var(--pu-green)" : node.lora ? "rgba(255,184,0,0.3)" : "rgba(57,255,20,0.25)"}
                stroke={node.you ? "var(--pu-green)" : node.lora ? "var(--pu-amber)" : "var(--pu-green)"}
                strokeWidth="0.5"
              />
              {node.you && (
                <circle cx={node.x} cy={node.y} r={7} fill="none"
                  stroke="rgba(57,255,20,0.2)" strokeWidth="0.5" />
              )}
              <text
                x={node.x}
                y={node.y + (node.you ? 8.5 : 7)}
                textAnchor="middle"
                fontSize="3.5"
                fill={node.you ? "var(--pu-green)" : "var(--pu-text-dim)"}
                fontFamily="monospace"
              >
                {node.label}
              </text>
            </g>
          ))}
        </svg>
      </div>
      {/* Legend */}
      <div className="flex items-center gap-6 mt-3">
        <div className="flex items-center gap-1.5 text-xs pu-mono" style={{ color: "var(--pu-green)" }}>
          <div style={{ width: "16px", height: "1px", backgroundColor: "rgba(57,255,20,0.6)" }} />
          BT-LE
        </div>
        <div className="flex items-center gap-1.5 text-xs pu-mono" style={{ color: "var(--pu-amber)" }}>
          <div style={{ width: "16px", height: "1px", backgroundColor: "rgba(255,184,0,0.6)", borderTop: "1px dashed rgba(255,184,0,0.6)" }} />
          LoRa
        </div>
        <div className="flex items-center gap-1.5 text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: "var(--pu-green)", boxShadow: "0 0 4px var(--pu-green)" }} />
          Your Node
        </div>
      </div>
    </div>
  );
}

// ─── Diagram: Local LLM ───────────────────────────────────────────────────────
function LocalLLMDiagram() {
  return (
    <div
      className="rounded-xl p-5"
      style={{ backgroundColor: "#050A07", border: "1px solid var(--pu-border-bright)" }}
    >
      <div className="text-xs pu-mono mb-4" style={{ color: "var(--pu-text-dim)" }}>
        // LOCAL_INFERENCE_PIPELINE
      </div>
      {/* Device wrapper */}
      <div
        className="rounded-lg p-4"
        style={{ border: "1px dashed rgba(57,255,20,0.25)", backgroundColor: "rgba(57,255,20,0.02)" }}
      >
        <div className="text-xs pu-mono mb-3 flex items-center gap-2" style={{ color: "var(--pu-green)" }}>
          <Cpu size={10} />
          YOUR DEVICE (on-device only)
        </div>
        <div className="space-y-2">
          {[
            { label: "Input Layer", sub: "Query tokenization", color: "var(--pu-green)" },
            { label: "Transformer Blocks", sub: "3B params · INT8 quantized", color: "var(--pu-text-muted)" },
            { label: "Output Layer", sub: "Token sampling + decode", color: "var(--pu-amber)" },
          ].map((layer, i) => (
            <div key={i} className="flex items-center gap-3">
              <div
                className="flex-1 px-3 py-2 rounded text-xs pu-mono"
                style={{
                  backgroundColor: "var(--pu-surface-2)",
                  border: `1px solid ${i === 0 ? "rgba(57,255,20,0.3)" : i === 2 ? "rgba(255,184,0,0.3)" : "var(--pu-border)"}`,
                  color: layer.color,
                }}
              >
                {layer.label}
                <span className="ml-2" style={{ color: "var(--pu-text-dim)", fontSize: "10px" }}>
                  // {layer.sub}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* No cloud indicators */}
      <div className="flex gap-3 mt-4">
        {["✗ No Cloud API", "✗ No Internet", "✗ No Telemetry", "✓ Runs Offline"].map((item) => (
          <span
            key={item}
            className="text-xs pu-mono px-2 py-1 rounded"
            style={{
              backgroundColor: item.startsWith("✓") ? "var(--pu-green-glow)" : "var(--pu-surface-2)",
              color: item.startsWith("✓") ? "var(--pu-green)" : "var(--pu-text-dim)",
              border: `1px solid ${item.startsWith("✓") ? "rgba(57,255,20,0.2)" : "var(--pu-border)"}`,
            }}
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Grid-Up Features ─────────────────────────────────────────────────────────
function GridUpContent() {
  const features = [
    {
      icon: <Users size={20} />,
      color: "var(--pu-green)",
      glow: "var(--pu-green-glow)",
      tag: "TRUST",
      title: "Community Vetting System",
      desc: "Every member is individually authorized via a cryptographic trust chain. No unknown actors can participate — each node must be manually vouched for by an existing trusted member.",
      bullets: [
        "Curve25519 keypair per device — identity is hardware-bound",
        "Multi-signature vetting sessions with configurable quorum",
        "Ed25519 signed vetting certificates broadcast to the mesh",
        "Instant revocation with automatic mesh-wide propagation",
      ],
      diagram: <TrustChainDiagram />,
    },
    {
      icon: <Lock size={20} />,
      color: "var(--pu-green)",
      glow: "var(--pu-green-glow)",
      tag: "ENCRYPTION",
      title: "Zero-Knowledge Encrypted Channels",
      desc: "End-to-end encryption using Signal Protocol's Double Ratchet. Messages are encrypted on your device before they touch any network — no server ever sees plaintext.",
      bullets: [
        "X3DH key exchange for perfect forward secrecy",
        "AES-256-GCM message encryption with AEAD authentication",
        "Double Ratchet algorithm — break-in recovery on every message",
        "Private keys stored in hardware secure enclave",
      ],
      diagram: null,
    },
    {
      icon: <Map size={20} />,
      color: "var(--pu-amber)",
      glow: "var(--pu-amber-glow)",
      tag: "PLANNING",
      title: "Operational Planning Tools",
      desc: "Pre-position your team, establish rendezvous points, and coordinate operations before infrastructure fails — when planning still has internet support.",
      bullets: [
        "Shared encrypted map overlays with team-visible waypoints",
        "Mission planning templates with AES-encrypted export",
        "Resource inventory and logistics tracking",
        "Automated SHTF protocol activation triggers",
      ],
      diagram: null,
    },
  ];

  return (
    <div className="space-y-10">
      {features.map((f, i) => (
        <div
          key={f.title}
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--pu-border)", backgroundColor: "var(--pu-surface)" }}
        >
          {/* Header */}
          <div
            className="flex items-start gap-4 p-6 pb-5"
            style={{ borderBottom: f.diagram ? "1px solid var(--pu-border)" : "none" }}
          >
            <div
              className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: f.glow, color: f.color }}
            >
              {f.icon}
            </div>
            <div className="flex-1">
              <div className="text-xs pu-mono mb-1" style={{ color: f.color }}>
                // {f.tag}
              </div>
              <h3 className="mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: "var(--pu-text-muted)", lineHeight: "1.7" }}>
                {f.desc}
              </p>
            </div>
          </div>
          {/* Bullets + diagram */}
          <div className={`p-6 pt-5 ${f.diagram ? "grid lg:grid-cols-2 gap-6" : ""}`}>
            <ul className="space-y-2.5">
              {f.bullets.map((b) => (
                <li key={b} className="flex items-start gap-2.5 text-sm" style={{ color: "var(--pu-text-muted)" }}>
                  <Check size={14} style={{ color: f.color, flexShrink: 0, marginTop: 2 }} />
                  {b}
                </li>
              ))}
            </ul>
            {f.diagram && <div>{f.diagram}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Grid-Down Features ───────────────────────────────────────────────────────
function GridDownContent() {
  const features = [
    {
      icon: <Radio size={20} />,
      color: "var(--pu-amber)",
      glow: "var(--pu-amber-glow)",
      tag: "MESH RADIO",
      title: "Bluetooth LE + LoRa Mesh Networking",
      desc: "When internet and cell towers go dark, Plus Ultra forms a self-healing peer-to-peer radio mesh. Messages hop between devices up to 7 times to reach their destination — no infrastructure required.",
      stats: [
        { val: "40km+", label: "LoRa line-of-sight range" },
        { val: "400m", label: "BT-LE open-terrain range" },
        { val: "7", label: "Max mesh hops" },
        { val: "<120ms", label: "Hop latency" },
      ],
      diagram: <MeshTopologyDiagram />,
    },
    {
      icon: <Brain size={20} />,
      color: "var(--pu-green)",
      glow: "var(--pu-green-glow)",
      tag: "LOCAL AI",
      title: "On-Device Local LLM",
      desc: "A 3B-parameter language model runs entirely on your device for tactical decision support, protocol lookup, and field medicine reference — no internet, no cloud, no data leaving your hands.",
      stats: [
        { val: "3B", label: "Model parameters" },
        { val: "INT8", label: "Quantization (2.4GB)" },
        { val: "0 bytes", label: "Data sent off-device" },
        { val: "~8 tok/s", label: "Inference speed (avg device)" },
      ],
      diagram: <LocalLLMDiagram />,
    },
    {
      icon: <Map size={20} />,
      color: "var(--pu-amber)",
      glow: "var(--pu-amber-glow)",
      tag: "NAVIGATION",
      title: "Offline Tactical Maps",
      desc: "Pre-downloaded vector maps with mesh node overlay, real-time position sharing between trusted nodes, and mission-critical waypoint synchronization — all without GPS infrastructure.",
      stats: [
        { val: "100%", label: "Offline operation" },
        { val: "OpenStreetMap", label: "Base map data" },
        { val: "±5m", label: "Relative positioning accuracy" },
        { val: "2m/tile", label: "Max resolution available" },
      ],
      diagram: null,
    },
  ];

  return (
    <div className="space-y-10">
      {features.map((f) => (
        <div
          key={f.title}
          className="rounded-xl overflow-hidden"
          style={{ border: "1px solid var(--pu-border)", backgroundColor: "var(--pu-surface)" }}
        >
          {/* Header */}
          <div
            className="flex items-start gap-4 p-6 pb-5"
            style={{ borderBottom: "1px solid var(--pu-border)" }}
          >
            <div
              className="flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: f.glow, color: f.color }}
            >
              {f.icon}
            </div>
            <div className="flex-1">
              <div className="text-xs pu-mono mb-1" style={{ color: f.color }}>
                // {f.tag}
              </div>
              <h3 className="mb-2">{f.title}</h3>
              <p className="text-sm" style={{ color: "var(--pu-text-muted)", lineHeight: "1.7" }}>
                {f.desc}
              </p>
            </div>
          </div>
          {/* Stats + diagram */}
          <div className={`p-6 pt-5 ${f.diagram ? "grid lg:grid-cols-2 gap-6 items-start" : ""}`}>
            <div className="grid grid-cols-2 gap-3">
              {f.stats.map((s) => (
                <div
                  key={s.label}
                  className="p-3 rounded-lg"
                  style={{ backgroundColor: "var(--pu-surface-2)", border: "1px solid var(--pu-border)" }}
                >
                  <div className="pu-mono" style={{ color: f.color, fontSize: "1.2rem", fontWeight: 700 }}>
                    {s.val}
                  </div>
                  <div className="text-xs pu-mono mt-0.5" style={{ color: "var(--pu-text-muted)" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
            {f.diagram && <div>{f.diagram}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Comparison Table ─────────────────────────────────────────────────────────
function ComparisonTable() {
  const rows = [
    { feature: "Communication range", up: "Global (internet)", down: "40km+ mesh" },
    { feature: "Encryption", up: "E2E AES-256-GCM", down: "E2E AES-256-GCM" },
    { feature: "Infrastructure dependency", up: "Internet required", down: "Zero" },
    { feature: "AI assistant", up: "Cloud + on-device", down: "On-device only" },
    { feature: "Map data", up: "Live + offline cache", down: "Offline only" },
    { feature: "Message latency", up: "<100ms", down: "40–500ms (mesh hops)" },
    { feature: "Node vetting", up: "Full vetting suite", down: "Local trust cache" },
    { feature: "Battery impact", up: "Low", down: "Medium (radio active)" },
  ];

  return (
    <div className="mt-16">
      <div className="text-center mb-8">
        <div
          className="inline-block px-3 py-1 rounded text-xs pu-mono tracking-widest uppercase mb-3"
          style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-text-muted)", border: "1px solid var(--pu-border)" }}
        >
          Comparison
        </div>
        <h2>
          Grid-Up vs{" "}
          <span style={{ color: "var(--pu-amber)", textShadow: "0 0 20px rgba(255,184,0,0.3)" }}>Grid-Down</span>
        </h2>
      </div>
      <div
        className="rounded-xl overflow-hidden"
        style={{ border: "1px solid var(--pu-border)" }}
      >
        <div
          className="grid grid-cols-3 px-5 py-3 text-xs pu-mono tracking-wider"
          style={{ backgroundColor: "var(--pu-surface-2)", borderBottom: "1px solid var(--pu-border)" }}
        >
          <span style={{ color: "var(--pu-text-dim)" }}>FEATURE</span>
          <span style={{ color: "var(--pu-green)" }}>⬆ GRID-UP</span>
          <span style={{ color: "var(--pu-amber)" }}>⬇ GRID-DOWN</span>
        </div>
        {rows.map((row, i) => (
          <div
            key={row.feature}
            className="grid grid-cols-3 px-5 py-3 text-sm"
            style={{
              backgroundColor: i % 2 === 0 ? "var(--pu-surface)" : "var(--pu-bg)",
              borderBottom: i < rows.length - 1 ? "1px solid var(--pu-border)" : "none",
            }}
          >
            <span className="pu-mono text-xs" style={{ color: "var(--pu-text-muted)" }}>{row.feature}</span>
            <span className="text-xs" style={{ color: "var(--pu-text)" }}>{row.up}</span>
            <span className="text-xs" style={{ color: "var(--pu-text)" }}>{row.down}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export function Features() {
  const [mode, setMode] = useState<Mode>("grid-up");

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--pu-bg)" }}>
      <SEO
        title={PAGE_META.features.title}
        description={PAGE_META.features.description}
        keywords={PAGE_META.features.keywords}
        path={PAGE_META.features.path}
      />
      {/* Grid bg */}
      <div className="fixed inset-0 pu-grid-bg opacity-20 pointer-events-none" style={{ zIndex: 0 }} />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        {/* Page header */}
        <div className="text-center mb-12">
          <div
            className="inline-block px-3 py-1 rounded text-xs pu-mono tracking-widest uppercase mb-4"
            style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-green)", border: "1px solid var(--pu-border)" }}
          >
            Capabilities
          </div>
          <h1 className="mb-4">
            Built for the{" "}
            <span style={{ color: "var(--pu-green)", textShadow: "0 0 30px rgba(57,255,20,0.4)" }}>
              Worst Case.
            </span>
          </h1>
          <p className="max-w-xl mx-auto" style={{ color: "var(--pu-text-muted)", fontSize: "1rem" }}>
            Plus Ultra operates in two distinct protocol modes. Select a mode to explore its specific capabilities.
          </p>
        </div>

        {/* Mode toggle */}
        <div className="flex justify-center mb-12">
          <div
            className="flex p-1 rounded-xl"
            style={{ backgroundColor: "var(--pu-surface)", border: "1px solid var(--pu-border)" }}
          >
            <button
              onClick={() => setMode("grid-up")}
              className="flex items-center gap-2.5 px-5 py-3 rounded-lg text-sm pu-mono transition-all duration-200"
              style={{
                backgroundColor: mode === "grid-up" ? "var(--pu-surface-2)" : "transparent",
                color: mode === "grid-up" ? "var(--pu-green)" : "var(--pu-text-muted)",
                border: mode === "grid-up" ? "1px solid rgba(57,255,20,0.3)" : "1px solid transparent",
                boxShadow: mode === "grid-up" ? "0 0 16px rgba(57,255,20,0.08)" : "none",
              }}
            >
              <Wifi size={16} />
              GRID-UP PROTOCOLS
            </button>
            <button
              onClick={() => setMode("grid-down")}
              className="flex items-center gap-2.5 px-5 py-3 rounded-lg text-sm pu-mono transition-all duration-200"
              style={{
                backgroundColor: mode === "grid-down" ? "var(--pu-surface-2)" : "transparent",
                color: mode === "grid-down" ? "var(--pu-amber)" : "var(--pu-text-muted)",
                border: mode === "grid-down" ? "1px solid rgba(255,184,0,0.3)" : "1px solid transparent",
                boxShadow: mode === "grid-down" ? "0 0 16px rgba(255,184,0,0.08)" : "none",
              }}
            >
              <Radio size={16} />
              GRID-DOWN PROTOCOLS
            </button>
          </div>
        </div>

        {/* Mode banner */}
        <div
          className="flex items-center gap-3 px-5 py-3 rounded-xl mb-8 text-sm pu-mono"
          style={{
            backgroundColor: mode === "grid-up" ? "rgba(57,255,20,0.05)" : "rgba(255,184,0,0.05)",
            border: `1px solid ${mode === "grid-up" ? "rgba(57,255,20,0.2)" : "rgba(255,184,0,0.2)"}`,
            color: mode === "grid-up" ? "var(--pu-green)" : "var(--pu-amber)",
          }}
        >
          <div
            className="w-2 h-2 rounded-full animate-pulse"
            style={{ backgroundColor: mode === "grid-up" ? "var(--pu-green)" : "var(--pu-amber)" }}
          />
          {mode === "grid-up"
            ? "GRID-UP MODE — Standard internet infrastructure available. Full feature set enabled."
            : "GRID-DOWN MODE — Zero infrastructure dependency. Mesh radio active. Survival protocols engaged."}
        </div>

        {/* Feature content */}
        {mode === "grid-up" ? <GridUpContent /> : <GridDownContent />}

        {/* Comparison table */}
        <ComparisonTable />
      </div>
    </div>
  );
}