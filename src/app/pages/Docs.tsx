import { useState, useCallback } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Link, NavLink } from "react-router";
import {
  BookOpen, ChevronRight, ChevronDown, FileText, Download,
  Menu, X, Clock, Calendar, ArrowLeft, ArrowRight, Search, ShoppingCart,
} from "lucide-react";
import { docCategories, type DocArticle, type DocCategory } from "../data/docs-content";
import { SEO } from "../components/SEO";
import { PAGE_META, trackEvent, AnalyticsEvents, handleDownloadClick } from "../lib/analytics";
import Logo from "../../imports/Logo";
import { useCart } from "../context/CartContext";

// ─── PDF Print helper ──────────────────────────────────────────────────────────
function printAsPdf(title: string) {
  const style = document.createElement("style");
  style.id = "print-override";
  style.textContent = `
    @media print {
      body > * { display: none !important; }
      #print-target { display: block !important; }
      #print-target { color: #000 !important; background: #fff !important; font-family: Georgia, serif; max-width: 700px; margin: 0 auto; padding: 40px; }
      #print-target h1, #print-target h2, #print-target h3, #print-target h4 { color: #000 !important; margin-top: 1.5em; }
      #print-target pre { background: #f4f4f4 !important; padding: 12px; border-radius: 4px; overflow-x: auto; font-size: 12px; }
      #print-target code { background: #f4f4f4 !important; padding: 2px 4px; border-radius: 2px; font-size: 13px; }
      #print-target table { border-collapse: collapse; width: 100%; margin: 1em 0; }
      #print-target th, #print-target td { border: 1px solid #ccc; padding: 6px 10px; font-size: 13px; }
      #print-target th { background: #f0f0f0; }
      #print-target blockquote { border-left: 4px solid #ccc; margin: 0; padding-left: 16px; color: #555 !important; }
      #print-target .no-print { display: none !important; }
      @page { margin: 20mm; }
    }
  `;
  document.head.appendChild(style);
  document.title = `Plus Ultra Docs — ${title}`;
  window.print();
  setTimeout(() => {
    document.head.removeChild(style);
  }, 1000);
}

// ─── Markdown renderer ─────────────────────────────────────────────────────────
function DocMarkdown({ content }: { content: string }) {
  return (
    <div className="doc-markdown">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 style={{ color: "var(--pu-text)", borderBottom: "1px solid var(--pu-border)", paddingBottom: "0.5em", marginBottom: "1em", marginTop: "0" }}>
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ color: "var(--pu-text)", marginTop: "2em", marginBottom: "0.75em", paddingTop: "0.5em" }}>
              {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ color: "var(--pu-text)", marginTop: "1.5em", marginBottom: "0.5em" }}>
              {children}
            </h3>
          ),
          h4: ({ children }) => (
            <h4 style={{ color: "var(--pu-green)", fontFamily: "'Roboto Mono', monospace", fontSize: "0.9rem", marginTop: "1em", marginBottom: "0.4em" }}>
              {children}
            </h4>
          ),
          p: ({ children }) => (
            <p style={{ color: "var(--pu-text-muted)", lineHeight: "1.8", marginBottom: "1em" }}>
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul style={{ color: "var(--pu-text-muted)", marginBottom: "1em", paddingLeft: "1.5em", lineHeight: "1.8" }}>
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol style={{ color: "var(--pu-text-muted)", marginBottom: "1em", paddingLeft: "1.5em", lineHeight: "1.8" }}>
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: "0.4em" }}>{children}</li>
          ),
          code: ({ children, className }) => {
            const isBlock = className?.startsWith("language-");
            if (isBlock) {
              return (
                <code style={{ display: "block", color: "var(--pu-green)", fontFamily: "'Roboto Mono', monospace", fontSize: "0.8rem" }}>
                  {children}
                </code>
              );
            }
            return (
              <code
                style={{
                  backgroundColor: "var(--pu-surface-2)",
                  color: "var(--pu-green)",
                  padding: "2px 6px",
                  borderRadius: "4px",
                  fontFamily: "'Roboto Mono', monospace",
                  fontSize: "0.85em",
                  border: "1px solid var(--pu-border)",
                }}
              >
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre
              style={{
                backgroundColor: "#050A07",
                border: "1px solid var(--pu-border-bright)",
                borderRadius: "8px",
                padding: "16px",
                overflow: "auto",
                marginBottom: "1.25em",
                fontSize: "0.8rem",
                lineHeight: "1.65",
              }}
            >
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div style={{ overflowX: "auto", marginBottom: "1.25em" }}>
              <table
                style={{
                  width: "100%",
                  borderCollapse: "collapse",
                  fontSize: "0.875rem",
                }}
              >
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead style={{ backgroundColor: "var(--pu-surface-2)" }}>{children}</thead>
          ),
          th: ({ children }) => (
            <th
              style={{
                padding: "8px 12px",
                textAlign: "left",
                color: "var(--pu-green)",
                fontFamily: "'Roboto Mono', monospace",
                fontSize: "0.8rem",
                border: "1px solid var(--pu-border)",
                fontWeight: 600,
              }}
            >
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td
              style={{
                padding: "8px 12px",
                color: "var(--pu-text-muted)",
                border: "1px solid var(--pu-border)",
                fontSize: "0.875rem",
              }}
            >
              {children}
            </td>
          ),
          tr: ({ children }) => (
            <tr style={{ borderBottom: "1px solid var(--pu-border)" }}>{children}</tr>
          ),
          blockquote: ({ children }) => (
            <blockquote
              style={{
                borderLeft: "3px solid var(--pu-amber)",
                paddingLeft: "16px",
                margin: "1em 0",
                backgroundColor: "rgba(255,184,0,0.05)",
                borderRadius: "0 6px 6px 0",
                padding: "12px 16px",
              }}
            >
              {children}
            </blockquote>
          ),
          a: ({ children, href }) => (
            <a href={href} style={{ color: "var(--pu-green)", textDecoration: "underline", textUnderlineOffset: "3px" }}>
              {children}
            </a>
          ),
          strong: ({ children }) => (
            <strong style={{ color: "var(--pu-text)", fontWeight: 600 }}>{children}</strong>
          ),
          hr: () => (
            <hr style={{ borderColor: "var(--pu-border)", margin: "2em 0" }} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

// ─── Docs Navbar ─────────────────────────────────────────────────────────────

const DOC_NAV_LINKS = [
  { to: "/features", label: "Features" },
  { to: "/docs",     label: "Docs" },
  { to: "/tutorials",label: "Tutorials" },
  { to: "/store",    label: "Store" },
];

function DocsNavbar() {
  const { itemCount, toggleCart } = useCart();

  return (
    <header
      style={{
        position: "fixed",
        top: 0, left: 0, right: 0,
        zIndex: 50,
        height: "64px",
        backgroundColor: "rgba(8,11,9,0.98)",
        backdropFilter: "blur(12px)",
        WebkitBackdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--pu-border)",
      }}
    >
      <div className="max-w-full w-full px-4 sm:px-6 lg:px-8 flex items-center justify-between h-full">
        {/* Logo */}
        <Link to="/" className="flex items-center select-none -ml-4">
          <div style={{ width: "215px", height: "52px", overflow: "visible", position: "relative", flexShrink: 0 }}>
            <div style={{ transform: "scale(2.5)", transformOrigin: "top left", width: "86px", height: "28px", position: "absolute", top: 0, left: 0 }}>
              <Logo />
            </div>
          </div>
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-1">
          {DOC_NAV_LINKS.map((link) => (
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

        {/* Right: iOS · Android · Cart */}
        <div className="hidden md:flex items-center gap-3">
          {/* iOS */}
          <a
            href="#download"
            className="flex items-center gap-2 px-4 py-2 rounded text-sm transition-all duration-150"
            style={{ border: "1px solid var(--pu-border)", color: "var(--pu-text)", backgroundColor: "var(--pu-surface-2)" }}
            onClick={(e) => { e.preventDefault(); window.location.href = handleDownloadClick("ios", "docs-navbar"); }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--pu-green-dim)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--pu-border)"; }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
            iOS
          </a>
          {/* Android */}
          <a
            href="#download"
            className="flex items-center gap-2 px-4 py-2 rounded text-sm transition-all duration-150"
            style={{ border: "1px solid var(--pu-border)", color: "var(--pu-text)", backgroundColor: "var(--pu-surface-2)" }}
            onClick={(e) => { e.preventDefault(); window.location.href = handleDownloadClick("android", "docs-navbar"); }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--pu-green-dim)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--pu-border)"; }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
              <path d="M6 18c0 .55.45 1 1 1h1v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h2v3.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5V19h1c.55 0 1-.45 1-1V8H6v10zM3.5 8C2.67 8 2 8.67 2 9.5v7c0 .83.67 1.5 1.5 1.5S5 17.33 5 16.5v-7C5 8.67 4.33 8 3.5 8zm17 0c-.83 0-1.5.67-1.5 1.5v7c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5v-7c0-.83-.67-1.5-1.5-1.5zm-4.97-5.84l1.3-1.3c.2-.2.2-.51 0-.71-.2-.2-.51-.2-.71 0l-1.48 1.48C14.15 1.23 13.11 1 12 1c-1.11 0-2.15.23-3.09.63L7.43.15c-.2-.2-.51-.2-.71 0-.2.2-.2.51 0 .71l1.3 1.3C6.34 3.13 5 5.21 5 7.6v.4h14v-.4c0-2.39-1.34-4.47-3.47-5.44zM10 5H9V4h1v1zm5 0h-1V4h1v1z"/>
            </svg>
            Android
          </a>
          {/* Cart */}
          <button
            onClick={toggleCart}
            className="relative flex items-center justify-center w-9 h-9 rounded-lg transition-all duration-150"
            style={{ backgroundColor: "var(--pu-surface-2)", border: "1px solid var(--pu-border)", color: "var(--pu-text)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--pu-green-dim)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.borderColor = "var(--pu-border)"; }}
          >
            <ShoppingCart size={16} />
            {itemCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[10px] pu-mono font-bold"
                style={{ backgroundColor: "var(--pu-green)", color: "#000" }}
              >
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
interface SidebarProps {
  activeCategory: string;
  activeArticle: string;
  onSelect: (catId: string, artId: string) => void;
  onClose?: () => void;
}

function Sidebar({ activeCategory, activeArticle, onSelect, onClose }: SidebarProps) {
  const [collapsed, setCollapsed] = useState<Set<string>>(new Set());

  const toggleCategory = (id: string) => {
    setCollapsed((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col">
      {/* Sidebar header */}
      <div
        className="flex items-center justify-between px-4 flex-shrink-0 h-14"
        style={{ borderBottom: "1px solid var(--pu-border)" }}
      >
        <div className="flex items-center gap-2">
          <BookOpen size={14} style={{ color: "var(--pu-green)" }} />
          <span className="text-xs pu-mono tracking-widest uppercase" style={{ color: "var(--pu-text-muted)" }}>
            Documentation
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} style={{ color: "var(--pu-text-muted)" }}>
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav tree */}
      <nav className="flex-1 overflow-y-auto py-3">
        {docCategories.map((cat) => {
          const isOpen = !collapsed.has(cat.id);
          const accentColor = cat.accentColor === "green" ? "var(--pu-green)" : "var(--pu-amber)";
          return (
            <div key={cat.id} className="mb-1">
              {/* Category header */}
              <button
                className="w-full flex items-center justify-between px-4 py-2.5 text-left transition-colors"
                onClick={() => toggleCategory(cat.id)}
                style={{ color: "var(--pu-text)" }}
              >
                <span className="text-xs pu-mono tracking-widest uppercase">
                  {cat.label}
                </span>
                <ChevronDown
                  size={12}
                  style={{
                    transform: isOpen ? "rotate(0deg)" : "rotate(-90deg)",
                    transition: "transform 0.2s",
                    color: "var(--pu-text-dim)",
                  }}
                />
              </button>
              {/* Articles */}
              {isOpen && (
                <div className="ml-4 border-l" style={{ borderColor: "var(--pu-border)" }}>
                  {cat.articles.map((art) => {
                    const isActive = activeCategory === cat.id && activeArticle === art.id;
                    return (
                      <button
                        key={art.id}
                        className="w-full flex items-center gap-2 pl-4 pr-3 py-2 text-left text-sm transition-all"
                        style={{
                          backgroundColor: isActive ? "var(--pu-surface-2)" : "transparent",
                          color: isActive ? "var(--pu-text)" : "var(--pu-text-muted)",
                          borderLeft: isActive ? `2px solid ${accentColor}` : "2px solid transparent",
                          marginLeft: "-1px",
                        }}
                        onClick={() => {
                          onSelect(cat.id, art.id);
                          onClose?.();
                        }}
                      >
                        <FileText size={12} style={{ flexShrink: 0, color: isActive ? accentColor : "var(--pu-text-dim)" }} />
                        <span style={{ lineHeight: "1.4", fontSize: "0.82rem" }}>{art.title}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Sidebar footer */}
      <div
        className="px-4 py-3 flex-shrink-0"
        style={{ borderTop: "1px solid var(--pu-border)" }}
      >
        <p className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
          v1.0.0-stable · GPL v3
        </p>
      </div>
    </div>
  );
}

// ─── Main Docs Page ───────────────────────────────────────────────────────────
export function Docs() {
  const [activeCatId, setActiveCatId] = useState(docCategories[0].id);
  const [activeArtId, setActiveArtId] = useState(docCategories[0].articles[0].id);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Flatten for prev/next navigation
  const allArticles = docCategories.flatMap((cat) =>
    cat.articles.map((art) => ({ catId: cat.id, artId: art.id, title: art.title }))
  );
  const currentIndex = allArticles.findIndex(
    (a) => a.catId === activeCatId && a.artId === activeArtId
  );
  const prevArticle = currentIndex > 0 ? allArticles[currentIndex - 1] : null;
  const nextArticle = currentIndex < allArticles.length - 1 ? allArticles[currentIndex + 1] : null;

  const activeCategory = docCategories.find((c) => c.id === activeCatId)!;
  const activeArticle = activeCategory.articles.find((a) => a.id === activeArtId)!;

  const handleSelect = useCallback((catId: string, artId: string) => {
    setActiveCatId(catId);
    setActiveArtId(artId);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const accentColor = activeCategory.accentColor === "green" ? "var(--pu-green)" : "var(--pu-amber)";

  const handlePdf = () => {
    trackEvent(AnalyticsEvents.DOCS_PDF, { article: activeArticle.title });
    printAsPdf(activeArticle.title);
  };

  return (
    <div className="min-h-screen flex pt-16" style={{ backgroundColor: "var(--pu-bg)" }}>
      <DocsNavbar />
      <SEO
        title={`${activeArticle.title} — Docs | Plus Ultra`}
        description={activeArticle.content.replace(/[#*`>\[\]]/g, "").trim().slice(0, 160)}
        keywords={PAGE_META.docs.keywords}
        path={`/docs`}
      />
      {/* ── Desktop Sidebar ── */}
      <aside
        className="hidden lg:flex flex-col w-64 xl:w-72 flex-shrink-0 sticky top-16 h-[calc(100vh-4rem)] overflow-hidden"
        style={{ borderRight: "1px solid var(--pu-border)", backgroundColor: "var(--pu-surface)" }}
      >
        <Sidebar
          activeCategory={activeCatId}
          activeArticle={activeArtId}
          onSelect={handleSelect}
        />
      </aside>

      {/* ── Mobile Sidebar Overlay ── */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex">
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div
            className="relative z-10 w-72 h-full flex flex-col"
            style={{ backgroundColor: "var(--pu-surface)", borderRight: "1px solid var(--pu-border)" }}
          >
            <Sidebar
              activeCategory={activeCatId}
              activeArticle={activeArtId}
              onSelect={handleSelect}
              onClose={() => setMobileSidebarOpen(false)}
            />
          </div>
        </div>
      )}

      {/* ── Main Content ── */}
      <main className="flex-1 min-w-0">
        {/* Top bar (mobile + desktop) */}
        <div
          className="sticky top-16 z-30 flex items-center gap-3 px-4 sm:px-8 h-14"
          style={{
            backgroundColor: "rgba(8,11,9,0.95)",
            backdropFilter: "blur(12px)",
            borderBottom: "1px solid var(--pu-border)",
          }}
        >
          {/* Mobile menu button */}
          <button
            className="lg:hidden flex items-center gap-2 text-xs pu-mono py-1.5 px-3 rounded"
            style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-text-muted)", border: "1px solid var(--pu-border)" }}
            onClick={() => setMobileSidebarOpen(true)}
          >
            <Menu size={14} />
            Contents
          </button>

          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
            <span>Docs</span>
            <ChevronRight size={10} />
            <span style={{ color: accentColor }}>{activeCategory.label}</span>
            <ChevronRight size={10} />
            <span style={{ color: "var(--pu-text-muted)" }}>{activeArticle.title}</span>
          </div>

          {/* PDF download */}
          <button
            className="ml-auto flex items-center gap-2 text-xs pu-mono py-1.5 px-3 rounded transition-all no-print"
            style={{
              backgroundColor: "var(--pu-surface-2)",
              color: "var(--pu-text-muted)",
              border: "1px solid var(--pu-border)",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "var(--pu-green-dim)";
              el.style.color = "var(--pu-green)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.borderColor = "var(--pu-border)";
              el.style.color = "var(--pu-text-muted)";
            }}
            onClick={() => handlePdf()}
          >
            <Download size={12} />
            Save as PDF
          </button>
        </div>

        {/* Article content */}
        <div className="max-w-3xl mx-auto px-4 sm:px-8 py-10" id="print-target">
          {/* Article meta */}
          <div
            className="flex flex-wrap items-center gap-4 mb-8 pb-6 no-print"
            style={{ borderBottom: "1px solid var(--pu-border)" }}
          >
            <span
              className="text-xs pu-mono tracking-widest uppercase px-2 py-1 rounded"
              style={{
                backgroundColor: activeCategory.accentColor === "green" ? "var(--pu-green-glow)" : "var(--pu-amber-glow)",
                color: accentColor,
                border: `1px solid ${activeCategory.accentColor === "green" ? "rgba(57,255,20,0.2)" : "rgba(255,184,0,0.2)"}`,
              }}
            >
              {activeCategory.tag}
            </span>
            <div className="flex items-center gap-1.5 text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
              <Clock size={11} />
              {activeArticle.readingTime}
            </div>
            <div className="flex items-center gap-1.5 text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
              <Calendar size={11} />
              Updated {activeArticle.lastUpdated}
            </div>
          </div>

          {/* Rendered markdown */}
          <DocMarkdown content={activeArticle.content} />

          {/* Prev / Next navigation */}
          <div
            className="flex items-center justify-between gap-4 mt-12 pt-6 no-print"
            style={{ borderTop: "1px solid var(--pu-border)" }}
          >
            {prevArticle ? (
              <button
                className="flex items-center gap-2 text-sm transition-colors text-left"
                style={{ color: "var(--pu-text-muted)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--pu-text)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--pu-text-muted)")}
                onClick={() => handleSelect(prevArticle.catId, prevArticle.artId)}
              >
                <ArrowLeft size={14} style={{ flexShrink: 0 }} />
                <div>
                  <div className="text-xs pu-mono mb-0.5" style={{ color: "var(--pu-text-dim)" }}>Previous</div>
                  <div>{prevArticle.title}</div>
                </div>
              </button>
            ) : <div />}

            {nextArticle ? (
              <button
                className="flex items-center gap-2 text-sm transition-colors text-right"
                style={{ color: "var(--pu-text-muted)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--pu-text)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--pu-text-muted)")}
                onClick={() => handleSelect(nextArticle.catId, nextArticle.artId)}
              >
                <div>
                  <div className="text-xs pu-mono mb-0.5" style={{ color: "var(--pu-text-dim)" }}>Next</div>
                  <div>{nextArticle.title}</div>
                </div>
                <ArrowRight size={14} style={{ flexShrink: 0 }} />
              </button>
            ) : <div />}
          </div>
        </div>
      </main>
    </div>
  );
}