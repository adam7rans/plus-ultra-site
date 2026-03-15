import { Link } from "react-router";
import { AlertTriangle } from "lucide-react";

export function NotFound() {
  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center text-center px-4"
      style={{ backgroundColor: "var(--pu-bg)" }}
    >
      <AlertTriangle size={40} style={{ color: "var(--pu-amber)", marginBottom: "1.5rem" }} />
      <div
        className="pu-mono mb-2"
        style={{ color: "var(--pu-green)", fontSize: "4rem", fontWeight: 700, lineHeight: 1 }}
      >
        404
      </div>
      <h2 className="mb-3">Signal Lost</h2>
      <p className="mb-8 max-w-sm" style={{ color: "var(--pu-text-muted)" }}>
        This route doesn't exist. The node you're looking for may be offline.
      </p>
      <Link
        to="/"
        className="px-6 py-3 rounded text-sm pu-mono font-semibold transition-all"
        style={{
          backgroundColor: "var(--pu-green)",
          color: "#000",
          boxShadow: "0 0 16px rgba(57,255,20,0.3)",
        }}
      >
        RETURN TO BASE
      </Link>
    </div>
  );
}
