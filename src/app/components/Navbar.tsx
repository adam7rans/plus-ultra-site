import { useState, useEffect, useRef } from "react";
import { Link, NavLink } from "react-router";
import { Menu, X, ShoppingCart } from "lucide-react";
import Logo from "../../imports/Logo";
import { useCart } from "../context/CartContext";
import { handleDownloadClick } from "../lib/analytics";

const navLinks = [
  { to: "/features", label: "Features" },
  { to: "/docs", label: "Docs" },
  { to: "/tutorials", label: "Tutorials" },
  { to: "/store", label: "Store" },
];

type NavState = "top" | "hidden" | "island";

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { itemCount, toggleCart } = useCart();
  const [navState, setNavState] = useState<NavState>("top");
  const lastScrollY = useRef(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const diff = y - lastScrollY.current;

        if (y < 80) {
          setNavState("top");
        } else if (diff > 4) {
          // Scrolling down → hide
          setNavState("hidden");
        } else if (diff < -4) {
          // Scrolling up → island
          setNavState("island");
        }

        lastScrollY.current = y;
        ticking.current = false;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHidden = navState === "hidden";
  const isIsland = navState === "island";

  return (
    <header
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        // Slide up when hidden, stay in place otherwise
        transform: isHidden ? "translateY(-115%)" : "translateY(0)",
        opacity: isHidden ? 0 : 1,
        transition: "transform 0.35s cubic-bezier(0.4,0,0.2,1), opacity 0.25s ease",
        pointerEvents: isHidden ? "none" : "auto",
        // Island: add top gap + side inset via padding
        padding: isIsland ? "10px 1rem 0" : "0",
      }}
    >
      {/* Island shell — morphs between full-bar and floating pill */}
      <div
        style={{
          maxWidth: isIsland ? "1100px" : "none",
          margin: isIsland ? "0 auto" : "0",
          borderRadius: isIsland ? "14px" : "0",
          backgroundColor: isIsland
            ? "rgba(13, 18, 16, 0.92)"
            : "transparent",
          backdropFilter: isIsland ? "blur(20px)" : "none",
          WebkitBackdropFilter: isIsland ? "blur(20px)" : "none",
          border: isIsland ? "1px solid var(--pu-border)" : "1px solid transparent",
          boxShadow: isIsland
            ? "0 8px 32px rgba(0,0,0,0.45), 0 0 0 1px rgba(57,255,20,0.04)"
            : "none",
          transition:
            "border-radius 0.35s ease, background-color 0.35s ease, box-shadow 0.35s ease, max-width 0.35s ease",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center select-none"
              onClick={() => setMobileOpen(false)}
            >
              <div style={{ width: "215px", height: "52px", overflow: "visible", position: "relative", flexShrink: 0 }}>
                <div style={{ transform: "scale(2.5)", transformOrigin: "top left", width: "86px", height: "28px", position: "absolute", top: 0, left: 0 }}>
                  <Logo />
                </div>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  className={({ isActive }) =>
                    `px-4 py-2 rounded-t text-sm transition-colors duration-200 pu-mono tracking-wide border-b-2 ${
                      isActive
                        ? "text-[var(--pu-green)] bg-[var(--pu-green-glow)] border-b-[var(--pu-green)]"
                        : "text-[var(--pu-text)] border-b-transparent hover:border-b-[var(--pu-green-dim)]"
                    }`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* CTA Buttons + Cart */}
            <div className="hidden md:flex items-center gap-3">
              <a
                href="#download"
                className="flex items-center gap-2 px-4 py-2 rounded text-sm transition-all duration-150"
                style={{
                  border: "1px solid var(--pu-border)",
                  color: "var(--pu-text)",
                  backgroundColor: "var(--pu-surface-2)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--pu-green-dim)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-text)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--pu-border)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-text)";
                }}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = handleDownloadClick("ios", "navbar");
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                iOS
              </a>
              <a
                href="#download"
                className="flex items-center gap-2 px-4 py-2 rounded text-sm font-medium transition-all duration-150"
                style={{
                  border: "1px solid var(--pu-border)",
                  color: "var(--pu-text)",
                  backgroundColor: "var(--pu-surface-2)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--pu-green-dim)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-text)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--pu-border)";
                  (e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-text)";
                }}
                onClick={(e) => {
                  e.preventDefault();
                  window.location.href = handleDownloadClick("android", "navbar");
                }}
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C14.15 1.23 13.11 1 12 1c-1.11 0-2.15.23-3.09.63L7.43.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.3 1.3C6.34 3.13 5 5.21 5 7.6v.4h14v-.4c0-2.39-1.34-4.47-3.47-5.44zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
                </svg>
                Android
              </a>

              {/* Cart button */}
              <button
                onClick={toggleCart}
                className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150"
                style={{
                  backgroundColor: "var(--pu-surface-2)",
                  border: "1px solid var(--pu-border)",
                  color: "var(--pu-text)",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--pu-green-dim)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--pu-green)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--pu-border)";
                  (e.currentTarget as HTMLButtonElement).style.color = "var(--pu-text)";
                }}
              >
                <ShoppingCart size={16} />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center text-xs pu-mono"
                    style={{ backgroundColor: "var(--pu-green)", color: "#000", fontSize: "9px", fontWeight: 700 }}
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
            </div>

            {/* Mobile: Cart + Hamburger */}
            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={toggleCart}
                className="relative p-2 rounded transition-colors"
                style={{ color: "var(--pu-text)" }}
              >
                <ShoppingCart size={20} />
                {itemCount > 0 && (
                  <span
                    className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "var(--pu-green)", color: "#000", fontSize: "9px", fontWeight: 700 }}
                  >
                    {itemCount > 9 ? "9+" : itemCount}
                  </span>
                )}
              </button>
              <button
                className="p-2 rounded transition-colors"
                style={{ color: "var(--pu-text)" }}
                onClick={() => setMobileOpen((v) => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div
            className="md:hidden border-t px-4 py-4 flex flex-col gap-2"
            style={{
              borderColor: "var(--pu-border)",
              backgroundColor: "rgba(8, 11, 9, 0.98)",
              borderRadius: isIsland ? "0 0 14px 14px" : "0",
            }}
          >
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `px-4 py-3 rounded text-sm pu-mono tracking-wide transition-all ${
                    isActive
                      ? "text-[var(--pu-green)] bg-[var(--pu-green-glow)]"
                      : "text-[var(--pu-text-muted)] hover:text-[var(--pu-text)]"
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <div className="flex gap-3 mt-3 pt-3" style={{ borderTop: "1px solid var(--pu-border)" }}>
              <a
                href="#download"
                className="flex-1 text-center py-3 rounded text-sm pu-mono"
                style={{
                  border: "1px solid var(--pu-border-bright)",
                  color: "var(--pu-text-muted)",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  window.location.href = handleDownloadClick("ios", "navbar_mobile");
                }}
              >
                iOS App
              </a>
              <a
                href="#download"
                className="flex-1 text-center py-3 rounded text-sm font-medium pu-mono"
                style={{
                  backgroundColor: "var(--pu-green)",
                  color: "#000",
                }}
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  window.location.href = handleDownloadClick("android", "navbar_mobile");
                }}
              >
                Android App
              </a>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}