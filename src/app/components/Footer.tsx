import { Link } from "react-router";
import { Github, Shield, ExternalLink, Lock, Code2 } from "lucide-react";
import Logo from "../../imports/Logo";

const footerLinks = {
  Product: [
    { label: "Features", to: "/features" },
    { label: "Store", to: "/store" },
    { label: "Tutorials", to: "/tutorials" },
  ],
  Resources: [
    { label: "Documentation", to: "/docs" },
    { label: "Grid-Down Protocols", to: "/docs" },
    { label: "Mesh Setup Guide", to: "/tutorials" },
    { label: "Design System", to: "/brand" },
  ],
  Legal: [
    { label: "Privacy Policy", to: "/" },
    { label: "Terms of Use", to: "/" },
    { label: "Export Control Notice", to: "/" },
  ],
};

// Custom SVG icons for socials not in lucide
function XIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622L18.244 2.25zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
    </svg>
  );
}

function FacebookIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.883v2.286h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z" />
    </svg>
  );
}

function TikTokIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" />
    </svg>
  );
}

const socialLinks = [
  { href: "https://x.com", label: "X (Twitter)", icon: <XIcon size={15} /> },
  { href: "https://facebook.com", label: "Facebook", icon: <FacebookIcon size={15} /> },
  { href: "https://tiktok.com", label: "TikTok", icon: <TikTokIcon size={15} /> },
];

export function Footer({ isCard = false }: { isCard?: boolean }) {
  return (
    <footer
      className={isCard ? "" : "border-t"}
      style={{
        borderColor: "var(--pu-border)",
        backgroundColor: isCard ? "transparent" : "var(--pu-surface)",
        position: "relative",
      }}
    >
      {/* Full-bleed line aligned with the logo's horizontal star rays.
          pt-12 = 48px above logo, rays at (17.132/27.8875)×84 ≈ 52px into logo → 100px total */}
      <div style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: "100px",
        height: "1px",
        backgroundColor: "var(--pu-border)",
        pointerEvents: "none",
      }} />

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">

        {/* Logo row */}
        <Link to="/" className="flex items-center">
          <div style={{ width: "258px", height: "84px", overflow: "hidden", position: "relative", flexShrink: 0 }}>
            <div style={{ transform: "scale(3)", transformOrigin: "top left", width: "86px", height: "28px", position: "absolute", top: 0, left: 0 }}>
              <Logo />
            </div>
          </div>
        </Link>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12 pb-12 pt-10">

          {/* Brand — col-span-2 */}
          <div className="lg:col-span-2">
            <p
              className="text-sm leading-relaxed mb-4"
              style={{ color: "var(--pu-text-muted)", maxWidth: "280px" }}
            >
              Encrypted, decentralized communications for when the grid goes dark. Built for those who prepare.
            </p>
            <div className="flex flex-col gap-2">
              {[
                { icon: <Shield size={12} />, label: "End-to-End Encrypted" },
                { icon: <Code2 size={12} />,  label: "100% Open Source" },
                { icon: <Lock size={12} />,   label: "No Backdoors" },
              ].map(({ icon, label }) => (
                <div
                  key={label}
                  className="flex items-center gap-2 px-3 py-2 rounded text-xs pu-mono"
                  style={{
                    backgroundColor: "var(--pu-surface-2)",
                    border: "1px solid var(--pu-border)",
                    color: "var(--pu-text-muted)",
                    width: "fit-content",
                  }}
                >
                  <span style={{ color: "var(--pu-green)", display: "flex", alignItems: "center" }}>{icon}</span>
                  <span>{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product links — col 3 */}
          <div>
            <h4
              className="text-xs pu-mono tracking-widest uppercase mb-4"
              style={{ color: "var(--pu-green)", letterSpacing: "0.15em" }}
            >
              Product
            </h4>
            <ul className="space-y-3">
              {footerLinks.Product.map((link) => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    className="text-sm transition-colors duration-150"
                    style={{ color: "var(--pu-text-muted)" }}
                    onMouseEnter={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-text)")
                    }
                    onMouseLeave={(e) =>
                      ((e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-text-muted)")
                    }
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources + Legal — col-span-2 */}
          <div className="lg:col-span-2 flex flex-col">
            {/* Resources & Legal side by side */}
            <div className="grid grid-cols-2 gap-8">
              {(["Resources", "Legal"] as const).map((category) => (
                <div key={category}>
                  <h4
                    className="text-xs pu-mono tracking-widest uppercase mb-4"
                    style={{ color: "var(--pu-green)", letterSpacing: "0.15em" }}
                  >
                    {category}
                  </h4>
                  <ul className="space-y-3">
                    {footerLinks[category].map((link) => (
                      <li key={link.label}>
                        <Link
                          to={link.to}
                          className="text-sm transition-colors duration-150"
                          style={{ color: "var(--pu-text-muted)" }}
                          onMouseEnter={(e) =>
                            ((e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-text)")
                          }
                          onMouseLeave={(e) =>
                            ((e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-text-muted)")
                          }
                        >
                          {link.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* Bottom bar — single row: version | socials+github | copyright */}
      <div style={{ borderColor: "var(--pu-border)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between gap-4">

          {/* Left: version */}
          <p className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)", flexShrink: 0 }}>
            v1.0.0-stable
          </p>

          {/* Center: socials + divider + GitHub pill */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ href, label, icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition-colors duration-150"
                style={{ color: "var(--pu-text-muted)" }}
                onMouseEnter={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-text)")
                }
                onMouseLeave={(e) =>
                  ((e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-text-muted)")
                }
              >
                {icon}
              </a>
            ))}

            <span style={{ width: "1px", height: "16px", backgroundColor: "var(--pu-border)", display: "block" }} />

            <a
              href="https://github.com/adam7rans/plus-ultra"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded text-xs pu-mono transition-all duration-150"
              style={{
                backgroundColor: "rgba(57,255,20,0.05)",
                border: "1px solid rgba(57,255,20,0.3)",
                color: "var(--pu-green)",
                textDecoration: "none",
                whiteSpace: "nowrap",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.backgroundColor = "rgba(57,255,20,0.1)";
                el.style.borderColor = "rgba(57,255,20,0.55)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLAnchorElement;
                el.style.backgroundColor = "rgba(57,255,20,0.05)";
                el.style.borderColor = "rgba(57,255,20,0.3)";
              }}
            >
              <Github size={13} style={{ flexShrink: 0 }} />
              <span>github.com/adam7rans/plus-ultra</span>
              <ExternalLink size={11} style={{ flexShrink: 0, opacity: 0.7 }} />
            </a>
          </div>

          {/* Right: copyright */}
          <p className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)", flexShrink: 0 }}>
            © 2026 Plus Ultra. All rights reserved.
          </p>

        </div>
      </div>
    </footer>
  );
}