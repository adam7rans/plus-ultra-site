import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router";
import { Helmet } from "react-helmet-async";
import {
  ANALYTICS_ENABLED, PLAUSIBLE_DOMAIN,
  trackEvent, AnalyticsEvents,
} from "../lib/analytics";
import { BarChart2, X, Activity, ExternalLink } from "lucide-react";

// ─────────────────────────────────────────────────────────────────────────────
// Analytics Script Injector
// Injects the Plausible script into <head> when ANALYTICS_ENABLED = true.
// Tracks SPA route changes automatically.
// ─────────────────────────────────────────────────────────────────────────────
export function AnalyticsProvider() {
  const location = useLocation();
  const prevPath = useRef<string>("");

  // Track SPA page navigations for Plausible
  useEffect(() => {
    if (!ANALYTICS_ENABLED) return;
    if (prevPath.current && prevPath.current !== location.pathname) {
      // Plausible tracks navigation via its own history listener,
      // but this ensures manual pushState navigations are captured.
      if (window.plausible) {
        window.plausible("pageview");
      }
    }
    prevPath.current = location.pathname;
  }, [location.pathname]);

  if (!ANALYTICS_ENABLED) return null;

  return (
    <Helmet>
      <script
        defer
        data-domain={PLAUSIBLE_DOMAIN}
        src="https://plausible.io/js/script.tagged-events.js"
      />
    </Helmet>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Dev-mode Analytics Monitor
// A floating panel visible in development only, showing real-time events
// as they're fired so the marketing team can validate tracking during QA.
// Hidden in production builds.
// ─────────────────────────────────────────────────────────────────────────────
interface FiredEvent {
  id: number;
  name: string;
  props: Record<string, string | number>;
  ts: string;
}

let eventCounter = 0;
const eventListeners: Set<(e: FiredEvent) => void> = new Set();

// Patch trackEvent so the monitor can observe it
const _origTrackEvent = trackEvent;

/** Emits events to the dev monitor panel */
export function trackEventWithMonitor(
  name: string,
  props?: Record<string, string | number>
) {
  _origTrackEvent(name, props);
  const event: FiredEvent = {
    id: ++eventCounter,
    name,
    props: props ?? {},
    ts: new Date().toLocaleTimeString(),
  };
  eventListeners.forEach((cb) => cb(event));
}

export function AnalyticsDevMonitor() {
  const [events, setEvents] = useState<FiredEvent[]>([]);
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  // Only render in dev
  if (!(import.meta.env?.DEV ?? true)) return null;

  useEffect(() => {
    const handler = (e: FiredEvent) => {
      setEvents((prev) => [e, ...prev].slice(0, 30));
    };
    eventListeners.add(handler);
    return () => { eventListeners.delete(handler); };
  }, []);

  return (
    <div
      className="fixed bottom-4 left-4 z-[9999] flex flex-col"
      style={{ maxWidth: "360px" }}
    >
      {/* Toggle button */}
      <button
        onClick={() => { setOpen(!open); setMinimized(false); }}
        className="self-start flex items-center gap-2 px-3 py-2 rounded-lg text-xs pu-mono transition-all"
        style={{
          backgroundColor: "rgba(8,11,9,0.95)",
          border: "1px solid rgba(57,255,20,0.4)",
          color: "var(--pu-green)",
          boxShadow: "0 0 12px rgba(57,255,20,0.15)",
        }}
      >
        <Activity size={12} />
        Analytics Monitor
        {events.length > 0 && (
          <span
            className="px-1.5 py-0.5 rounded"
            style={{ backgroundColor: "var(--pu-green)", color: "#000", fontSize: "9px" }}
          >
            {events.length}
          </span>
        )}
        <span
          className="ml-1 px-1.5 py-0.5 rounded"
          style={{ backgroundColor: "rgba(255,184,0,0.15)", color: "var(--pu-amber)", fontSize: "9px" }}
        >
          DEV
        </span>
      </button>

      {/* Panel */}
      {open && !minimized && (
        <div
          className="mt-2 rounded-xl overflow-hidden"
          style={{
            backgroundColor: "rgba(8,11,9,0.97)",
            border: "1px solid var(--pu-border-bright)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6)",
            backdropFilter: "blur(12px)",
          }}
        >
          {/* Panel header */}
          <div
            className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid var(--pu-border)" }}
          >
            <div className="flex items-center gap-2">
              <BarChart2 size={13} style={{ color: "var(--pu-green)" }} />
              <span className="text-xs pu-mono" style={{ color: "var(--pu-text)" }}>
                Event Monitor
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
                {ANALYTICS_ENABLED ? "● LIVE" : "○ MOCK"}
              </span>
              <button onClick={() => setOpen(false)} style={{ color: "var(--pu-text-dim)" }}>
                <X size={13} />
              </button>
            </div>
          </div>

          {/* Plausible setup status */}
          <div className="px-4 py-3" style={{ borderBottom: "1px solid var(--pu-border)" }}>
            <div className="flex items-center gap-2 mb-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: ANALYTICS_ENABLED ? "var(--pu-green)" : "var(--pu-amber)" }}
              />
              <span className="text-xs pu-mono" style={{ color: ANALYTICS_ENABLED ? "var(--pu-green)" : "var(--pu-amber)" }}>
                Plausible: {ANALYTICS_ENABLED ? "Connected" : "Demo Mode"}
              </span>
            </div>
            {!ANALYTICS_ENABLED && (
              <p className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)", lineHeight: "1.5" }}>
                Set <code style={{ color: "var(--pu-green)" }}>ANALYTICS_ENABLED = true</code> in{" "}
                <code style={{ color: "var(--pu-green)" }}>lib/analytics.ts</code> to go live.
              </p>
            )}
            <a
              href="https://plausible.io"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-1.5 flex items-center gap-1 text-xs pu-mono transition-colors"
              style={{ color: "var(--pu-text-dim)" }}
              onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-green)")}
              onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-text-dim)")}
            >
              <ExternalLink size={10} />
              Open Plausible Dashboard
            </a>
          </div>

          {/* Event log */}
          <div style={{ maxHeight: "240px", overflowY: "auto" }}>
            {events.length === 0 ? (
              <div className="px-4 py-6 text-center">
                <p className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
                  No events yet — interact with the page to see tracking fire.
                </p>
              </div>
            ) : (
              events.map((ev) => (
                <div
                  key={ev.id}
                  className="px-4 py-2.5"
                  style={{ borderBottom: "1px solid var(--pu-border)" }}
                >
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs pu-mono" style={{ color: "var(--pu-green)" }}>
                      {ev.name}
                    </span>
                    <span className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)", fontSize: "10px" }}>
                      {ev.ts}
                    </span>
                  </div>
                  {Object.keys(ev.props).length > 0 && (
                    <div className="text-xs pu-mono" style={{ color: "var(--pu-text-muted)", fontSize: "10px" }}>
                      {JSON.stringify(ev.props)}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Tracked events reference */}
          <div className="px-4 py-3" style={{ borderTop: "1px solid var(--pu-border)" }}>
            <p className="text-xs pu-mono mb-2" style={{ color: "var(--pu-text-dim)" }}>
              Configured events:
            </p>
            <div className="flex flex-wrap gap-1">
              {Object.values(AnalyticsEvents).filter((v, i, a) => a.indexOf(v) === i).map((ev) => (
                <span
                  key={ev}
                  className="text-xs pu-mono px-1.5 py-0.5 rounded"
                  style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-text-dim)", border: "1px solid var(--pu-border)" }}
                >
                  {ev}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}