import { useState } from "react";
import { Link } from "react-router";
import { ShoppingCart, ArrowRight, Star, Package, Zap, Check } from "lucide-react";
import { mockProducts, PRODUCT_CATEGORIES, type ProductCategory } from "../data/mock-products";
import { useCart } from "../context/CartContext";
import { SHOPIFY_MOCK_MODE } from "../lib/shopify";
import { SEO } from "../components/SEO";
import { PAGE_META } from "../lib/analytics";

// ─── Badge component ──────────────────────────────────────────────────────────
function Badge({ text, color }: { text: string; color: "green" | "amber" | "red" }) {
  const colors = {
    green: { bg: "rgba(57,255,20,0.12)", text: "var(--pu-green)", border: "rgba(57,255,20,0.3)" },
    amber: { bg: "rgba(255,184,0,0.12)", text: "var(--pu-amber)", border: "rgba(255,184,0,0.3)" },
    red: { bg: "rgba(255,59,59,0.12)", text: "#FF6B6B", border: "rgba(255,59,59,0.3)" },
  };
  const c = colors[color];
  return (
    <span
      className="text-xs pu-mono px-2 py-0.5 rounded"
      style={{ backgroundColor: c.bg, color: c.text, border: `1px solid ${c.border}` }}
    >
      {text}
    </span>
  );
}

// ─── Product Card ─────────────────────────────────────────────────────────────
function ProductCard({ product }: { product: (typeof mockProducts)[number] }) {
  const { addItem, openCart } = useCart();
  const [added, setAdded] = useState(false);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.inStock) return;
    addItem({
      productId: product.id,
      variantId: product.variants?.[0]?.id ?? product.id,
      handle: product.handle,
      title: product.title,
      variantTitle: product.variants?.[0]?.title,
      image: product.images[0],
      price: product.price,
      compareAtPrice: product.compareAtPrice,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <Link
      to={`/store/${product.handle}`}
      className="group relative flex flex-col rounded-xl overflow-hidden transition-all duration-200"
      style={{
        backgroundColor: "var(--pu-surface)",
        border: "1px solid var(--pu-border)",
        textDecoration: "none",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--pu-border-bright)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 40px rgba(0,0,0,0.4)";
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--pu-border)";
        (e.currentTarget as HTMLAnchorElement).style.boxShadow = "none";
        (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
      }}
    >
      {/* Image */}
      <div
        className="relative overflow-hidden"
        style={{ height: "220px", backgroundColor: "var(--pu-surface-2)" }}
      >
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Overlay on hover */}
        <div
          className="absolute inset-0 flex items-end p-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
          style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 60%)" }}
        >
          <button
            onClick={handleQuickAdd}
            disabled={!product.inStock}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm pu-mono transition-all duration-150"
            style={{
              backgroundColor: added ? "var(--pu-green)" : product.inStock ? "rgba(57,255,20,0.15)" : "rgba(255,255,255,0.08)",
              border: `1px solid ${added ? "var(--pu-green)" : product.inStock ? "rgba(57,255,20,0.4)" : "rgba(255,255,255,0.15)"}`,
              color: added ? "#000" : product.inStock ? "var(--pu-green)" : "var(--pu-text-dim)",
              backdropFilter: "blur(8px)",
            }}
          >
            {added ? <Check size={14} /> : <ShoppingCart size={14} />}
            {added ? "Added!" : product.inStock ? "Quick Add" : "Out of Stock"}
          </button>
        </div>

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-3 left-3">
            <Badge text={product.badge} color={product.badgeColor ?? "green"} />
          </div>
        )}

        {/* Out of stock overlay */}
        {!product.inStock && (
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          >
            <span className="text-xs pu-mono px-3 py-1 rounded" style={{ backgroundColor: "rgba(0,0,0,0.8)", color: "#FF6B6B", border: "1px solid rgba(255,59,59,0.3)" }}>
              OUT OF STOCK
            </span>
          </div>
        )}
      </div>

      {/* Card body */}
      <div className="p-4 flex-1 flex flex-col">
        <div className="flex items-center gap-2 mb-1.5">
          <span className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
            {product.category.toUpperCase()}
          </span>
        </div>
        <h3 className="mb-1 line-clamp-2" style={{ fontSize: "1rem", lineHeight: "1.35" }}>
          {product.title}
        </h3>
        <p className="text-xs flex-1 mb-3 line-clamp-2" style={{ color: "var(--pu-text-muted)", lineHeight: "1.6" }}>
          {product.tagline}
        </p>

        {/* Price row */}
        <div className="flex items-center justify-between mt-auto">
          <div className="flex items-center gap-2">
            <span className="pu-mono" style={{ color: "var(--pu-green)", fontSize: "1.15rem", fontWeight: 700 }}>
              ${product.price}
            </span>
            {product.compareAtPrice && (
              <span className="text-sm pu-mono line-through" style={{ color: "var(--pu-text-dim)" }}>
                ${product.compareAtPrice}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1 text-xs pu-mono transition-transform duration-150 group-hover:translate-x-0.5" style={{ color: "var(--pu-text-dim)" }}>
            View <ArrowRight size={11} />
          </div>
        </div>
      </div>
    </Link>
  );
}

// ─── Store hero ───────────────────────────────────────────────────────────────
function StoreHero() {
  return (
    <div
      className="relative overflow-hidden py-14"
      style={{ backgroundColor: "var(--pu-surface)", borderBottom: "1px solid var(--pu-border)" }}
    >
      <div className="absolute inset-0 pu-grid-bg opacity-25 pointer-events-none" />
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 80% at 50% 0%, rgba(57,255,20,0.05) 0%, transparent 70%)" }}
      />
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div>
          <div
            className="inline-flex items-center gap-2 px-3 py-1 rounded text-xs pu-mono tracking-widest uppercase mb-3"
            style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-green)", border: "1px solid var(--pu-border)" }}
          >
            <Package size={11} />
            Hardware Store
          </div>
          <h1 className="mb-2">
            Gear Up.{" "}
            <span style={{ color: "var(--pu-green)", textShadow: "0 0 30px rgba(57,255,20,0.4)" }}>
              Stay Ready.
            </span>
          </h1>
          <p style={{ color: "var(--pu-text-muted)", maxWidth: "480px" }}>
            Purpose-built hardware for Plus Ultra mesh networking — EMP-hardened, field-tested, and shipped within 2–3 days.
          </p>
        </div>
        {/* Trust badges */}
        <div className="flex flex-col gap-2 flex-shrink-0">
          {[
            { icon: <Zap size={12} />, text: "Ships in 2–3 Days" },
            { icon: <Star size={12} />, text: "4.9★ Avg. Rating" },
            { icon: <Check size={12} />, text: "30-Day Returns" },
          ].map((b) => (
            <div key={b.text} className="flex items-center gap-2 text-xs pu-mono" style={{ color: "var(--pu-text-muted)" }}>
              <span style={{ color: "var(--pu-green)" }}>{b.icon}</span>
              {b.text}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function Store() {
  const [activeCategory, setActiveCategory] = useState<ProductCategory>("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc">("featured");

  const filtered = mockProducts
    .filter((p) => activeCategory === "All" || p.category === activeCategory)
    .sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return 0;
    });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--pu-bg)" }}>
      <SEO
        title={PAGE_META.store.title}
        description={PAGE_META.store.description}
        keywords={PAGE_META.store.keywords}
        path={PAGE_META.store.path}
        ogType="website"
      />
      <StoreHero />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter + Sort bar */}
        <div
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8 pb-5"
          style={{ borderBottom: "1px solid var(--pu-border)" }}
        >
          {/* Category tabs */}
          <div className="flex items-center gap-1.5 flex-wrap">
            {PRODUCT_CATEGORIES.map((cat) => (
              <button
                key={cat}
                className="px-3 py-1.5 rounded-lg text-xs pu-mono transition-all duration-150"
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

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="text-xs pu-mono px-3 py-1.5 rounded-lg outline-none"
              style={{
                backgroundColor: "var(--pu-surface-2)",
                color: "var(--pu-text-muted)",
                border: "1px solid var(--pu-border)",
              }}
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
            </select>
          </div>
        </div>

        {/* Mock mode notice */}
        {SHOPIFY_MOCK_MODE && (
          <div
            className="flex items-center gap-3 mb-6 px-4 py-3 rounded-lg text-xs pu-mono"
            style={{
              backgroundColor: "rgba(255,184,0,0.05)",
              border: "1px solid rgba(255,184,0,0.2)",
              color: "var(--pu-amber)",
            }}
          >
            <Zap size={12} />
            Demo mode: Connect Shopify by updating <code className="mx-1 px-1 rounded" style={{ backgroundColor: "rgba(255,184,0,0.1)" }}>src/app/lib/shopify.ts</code> with your store credentials.
          </div>
        )}

        {/* Product grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {filtered.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-20">
            <p className="text-sm pu-mono" style={{ color: "var(--pu-text-dim)" }}>
              No products in this category yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}