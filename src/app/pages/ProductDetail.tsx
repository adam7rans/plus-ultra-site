import { useState } from "react";
import { useParams, Link } from "react-router";
import {
  ArrowLeft, ShoppingCart, Check, ChevronDown, ChevronUp,
  Zap, Truck, RotateCcw, Lock,
} from "lucide-react";
import { mockProducts } from "../data/mock-products";
import { useCart } from "../context/CartContext";
import { SEO, buildProductStructuredData } from "../components/SEO";
import { trackEvent, AnalyticsEvents } from "../lib/analytics";
import { FrequentlyBoughtTogether } from "../components/FrequentlyBoughtTogether";
import { VariantUpsell } from "../components/VariantUpsell";

// ─── Image gallery ────────────────────────────────────────────────────────────
function ImageGallery({ images, title }: { images: string[]; title: string }) {
  const [active, setActive] = useState(0);

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div
        className="relative rounded-2xl overflow-hidden"
        style={{
          backgroundColor: "var(--pu-surface-2)",
          border: "1px solid var(--pu-border-bright)",
          aspectRatio: "4/3",
        }}
      >
        <img
          src={images[active]}
          alt={title}
          className="w-full h-full object-cover"
        />
        {/* Subtle vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at center, transparent 60%, rgba(0,0,0,0.3) 100%)" }}
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className="flex-shrink-0 rounded-lg overflow-hidden transition-all duration-150"
              style={{
                width: "72px",
                height: "56px",
                border: i === active ? "2px solid var(--pu-green)" : "1px solid var(--pu-border)",
                opacity: i === active ? 1 : 0.5,
              }}
            >
              <img src={img} alt={`${title} ${i + 1}`} className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Spec accordion ───────────────────────────────────────────────────────────
function SpecsAccordion({ specs }: { specs: { label: string; value: string }[] }) {
  const [open, setOpen] = useState(true);
  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{ border: "1px solid var(--pu-border)" }}
    >
      <button
        className="w-full flex items-center justify-between px-5 py-3.5 text-sm pu-mono"
        style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-text)" }}
        onClick={() => setOpen(!open)}
      >
        <span style={{ color: "var(--pu-green)" }}>Technical Specifications</span>
        {open ? <ChevronUp size={14} style={{ color: "var(--pu-text-dim)" }} /> : <ChevronDown size={14} style={{ color: "var(--pu-text-dim)" }} />}
      </button>
      {open && (
        <div>
          {specs.map((spec, i) => (
            <div
              key={i}
              className="grid grid-cols-2 px-5 py-2.5 text-sm"
              style={{
                backgroundColor: i % 2 === 0 ? "var(--pu-surface)" : "var(--pu-bg)",
                borderTop: "1px solid var(--pu-border)",
              }}
            >
              <span className="pu-mono text-xs" style={{ color: "var(--pu-text-muted)" }}>{spec.label}</span>
              <span className="text-xs" style={{ color: "var(--pu-text)" }}>{spec.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export function ProductDetail() {
  const { handle } = useParams<{ handle: string }>();
  const { addItem } = useCart();

  const product = mockProducts.find((p) => p.handle === handle);

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center" style={{ backgroundColor: "var(--pu-bg)" }}>
        <p className="pu-mono mb-4" style={{ color: "var(--pu-text-muted)" }}>Product not found.</p>
        <Link to="/store" className="text-sm pu-mono" style={{ color: "var(--pu-green)" }}>← Back to Store</Link>
      </div>
    );
  }

  const [selectedVariantIdx, setSelectedVariantIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [addedState, setAddedState] = useState<"idle" | "added">("idle");

  const selectedVariant = product.variants?.[selectedVariantIdx];
  const effectivePrice = selectedVariant?.price ?? product.price;
  const isAvailable = product.inStock && (selectedVariant?.available ?? true);

  const handleAddToCart = () => {
    if (!isAvailable) return;
    addItem({
      productId: product.id,
      variantId: selectedVariant?.id ?? product.id,
      handle: product.handle,
      title: product.title,
      variantTitle: selectedVariant?.title,
      image: product.images[0],
      price: effectivePrice,
      compareAtPrice: product.compareAtPrice,
      quantity,
    });
    trackEvent(AnalyticsEvents.ADD_TO_CART, {
      product: product.title,
      price: effectivePrice,
      quantity,
    });
    setAddedState("added");
    setTimeout(() => setAddedState("idle"), 2000);
  };

  const related = mockProducts.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 3);

  const productStructuredData = buildProductStructuredData({
    title: product.title,
    description: product.description,
    price: effectivePrice,
    compareAtPrice: product.compareAtPrice,
    images: product.images,
    inStock: product.inStock,
    handle: product.handle,
  });

  return (
    <div className="min-h-screen" style={{ backgroundColor: "var(--pu-bg)" }}>
      <SEO
        title={`${product.title} | Plus Ultra Store`}
        description={`${product.tagline} — ${product.description.slice(0, 140)}...`}
        path={`/store/${product.handle}`}
        ogType="product"
        ogImage={product.images[0]}
        price={effectivePrice}
        structuredData={productStructuredData}
      />
      {/* Breadcrumb */}
      <div
        className="sticky top-16 z-10 border-b"
        style={{ backgroundColor: "rgba(8,11,9,0.95)", backdropFilter: "blur(12px)", borderColor: "var(--pu-border)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs pu-mono">
          <Link to="/store" className="flex items-center gap-1.5 transition-colors" style={{ color: "var(--pu-text-muted)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-text)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-text-muted)")}
          >
            <ArrowLeft size={12} />
            Store
          </Link>
          <span style={{ color: "var(--pu-text-dim)" }}>/</span>
          <span style={{ color: "var(--pu-text-muted)" }}>{product.category}</span>
          <span style={{ color: "var(--pu-text-dim)" }}>/</span>
          <span style={{ color: "var(--pu-text)" }}>{product.title}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Main product area */}
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-14 mb-16">
          {/* Left: Images — sticky so gallery stays visible while scrolling */}
          <div style={{ position: "sticky", top: "7rem", alignSelf: "start" }}>
            <ImageGallery images={product.images} title={product.title} />
          </div>

          {/* Right: Info + purchase */}
          <div>
            {/* Category + badges */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span
                className="text-xs pu-mono tracking-widest uppercase px-2 py-1 rounded"
                style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-text-muted)", border: "1px solid var(--pu-border)" }}
              >
                {product.category}
              </span>
              {product.badge && (
                <span
                  className="text-xs pu-mono px-2 py-1 rounded"
                  style={{
                    backgroundColor: product.badgeColor === "green" ? "rgba(57,255,20,0.12)" : product.badgeColor === "amber" ? "rgba(255,184,0,0.12)" : "rgba(255,59,59,0.12)",
                    color: product.badgeColor === "green" ? "var(--pu-green)" : product.badgeColor === "amber" ? "var(--pu-amber)" : "#FF6B6B",
                    border: `1px solid ${product.badgeColor === "green" ? "rgba(57,255,20,0.3)" : product.badgeColor === "amber" ? "rgba(255,184,0,0.3)" : "rgba(255,59,59,0.3)"}`,
                  }}
                >
                  {product.badge}
                </span>
              )}
            </div>

            {/* Title */}
            <h1 className="mb-2">{product.title}</h1>
            <p className="mb-5" style={{ color: "var(--pu-green)", fontSize: "1rem" }}>
              {product.tagline}
            </p>

            {/* Description */}
            <p className="mb-6 text-sm" style={{ color: "var(--pu-text-muted)", lineHeight: "1.75" }}>
              {product.description}
            </p>

            {/* Compatibility */}
            {product.compatible && (
              <div
                className="flex items-center gap-2 mb-5 px-3 py-2 rounded-lg text-xs pu-mono"
                style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-text-muted)", border: "1px solid var(--pu-border)" }}
              >
                <Zap size={11} style={{ color: "var(--pu-green)" }} />
                Compatible: {product.compatible}
              </div>
            )}

            {/* Variant selector */}
            {product.variants && product.variants.length > 0 && (
              <div className="mb-4">
                <p className="text-xs pu-mono mb-2" style={{ color: "var(--pu-text-muted)" }}>
                  VARIANT
                </p>
                <div className="flex gap-2 flex-wrap">
                  {product.variants.map((v, i) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVariantIdx(i)}
                      disabled={!v.available}
                      className="px-4 py-2 rounded-lg text-sm pu-mono transition-all duration-150"
                      style={{
                        backgroundColor: i === selectedVariantIdx ? "var(--pu-surface-2)" : "transparent",
                        color: !v.available ? "var(--pu-text-dim)" : i === selectedVariantIdx ? "var(--pu-green)" : "var(--pu-text-muted)",
                        border: i === selectedVariantIdx ? "1px solid rgba(57,255,20,0.4)" : "1px solid var(--pu-border)",
                        opacity: !v.available ? 0.5 : 1,
                        textDecoration: !v.available ? "line-through" : "none",
                      }}
                    >
                      {v.title}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Variant Upsell ── */}
            <VariantUpsell
              product={product}
              selectedVariantIdx={selectedVariantIdx}
              onSelectVariant={setSelectedVariantIdx}
            />

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-6">
              <span className="pu-mono" style={{ color: "var(--pu-green)", fontSize: "2rem", fontWeight: 700 }}>
                ${effectivePrice}
              </span>
              {selectedVariant?.compareAtPrice ? (
                <>
                  <span className="text-lg pu-mono line-through" style={{ color: "var(--pu-text-dim)" }}>
                    ${selectedVariant.compareAtPrice}
                  </span>
                  <span
                    className="text-sm pu-mono px-2 py-0.5 rounded"
                    style={{ backgroundColor: "rgba(255,184,0,0.12)", color: "var(--pu-amber)" }}
                  >
                    Save ${selectedVariant.compareAtPrice - effectivePrice}
                  </span>
                </>
              ) : product.compareAtPrice ? (
                <>
                  <span className="text-lg pu-mono line-through" style={{ color: "var(--pu-text-dim)" }}>
                    ${product.compareAtPrice}
                  </span>
                  <span
                    className="text-sm pu-mono px-2 py-0.5 rounded"
                    style={{ backgroundColor: "rgba(255,184,0,0.12)", color: "var(--pu-amber)" }}
                  >
                    Save ${product.compareAtPrice - effectivePrice}
                  </span>
                </>
              ) : null}
            </div>

            {/* Quantity selector */}
            <div className="flex items-center gap-4 mb-5">
              <div
                className="flex items-center rounded-lg overflow-hidden"
                style={{ border: "1px solid var(--pu-border-bright)" }}
              >
                <button
                  className="w-10 h-10 flex items-center justify-center transition-colors"
                  style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-text-muted)" }}
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  −
                </button>
                <span
                  className="w-12 text-center text-sm pu-mono"
                  style={{ color: "var(--pu-text)", backgroundColor: "var(--pu-surface)" }}
                >
                  {quantity}
                </span>
                <button
                  className="w-10 h-10 flex items-center justify-center transition-colors"
                  style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-text-muted)" }}
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              <span className="text-xs pu-mono" style={{ color: product.inStock ? "var(--pu-green)" : "#FF6B6B" }}>
                {product.inStock ? "● In Stock" : "● Out of Stock"}
              </span>
            </div>

            {/* Add to Cart CTA */}
            <button
              onClick={handleAddToCart}
              disabled={!isAvailable}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-xl pu-mono text-sm transition-all duration-200 mb-3"
              style={{
                backgroundColor: addedState === "added" ? "var(--pu-green-dim)" : isAvailable ? "var(--pu-green)" : "var(--pu-surface-2)",
                color: isAvailable ? "#000" : "var(--pu-text-dim)",
                fontWeight: 700,
                boxShadow: isAvailable ? "0 0 24px rgba(57,255,20,0.25)" : "none",
                cursor: isAvailable ? "pointer" : "not-allowed",
              }}
              onMouseEnter={(e) => {
                if (!isAvailable) return;
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = "#4dff26";
                el.style.boxShadow = "0 0 36px rgba(57,255,20,0.45)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = addedState === "added" ? "var(--pu-green-dim)" : isAvailable ? "var(--pu-green)" : "var(--pu-surface-2)";
                el.style.boxShadow = isAvailable ? "0 0 24px rgba(57,255,20,0.25)" : "none";
              }}
            >
              {addedState === "added" ? (
                <><Check size={16} /> Added to Cart</>
              ) : (
                <><ShoppingCart size={16} /> {isAvailable ? `Add to Cart — $${(effectivePrice * quantity).toFixed(2)}` : "Out of Stock"}</>
              )}
            </button>

            {/* Trust signals */}
            <div
              className="grid grid-cols-3 gap-3 p-4 rounded-xl"
              style={{ backgroundColor: "var(--pu-surface-2)", border: "1px solid var(--pu-border)" }}
            >
              {[
                { icon: <Lock size={13} />, label: "Secure Checkout" },
                { icon: <Truck size={13} />, label: "Ships 2–3 Days" },
                { icon: <RotateCcw size={13} />, label: "30-Day Returns" },
              ].map((t) => (
                <div key={t.label} className="flex flex-col items-center gap-1.5 text-center">
                  <span style={{ color: "var(--pu-green)" }}>{t.icon}</span>
                  <span className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)", lineHeight: "1.3" }}>{t.label}</span>
                </div>
              ))}
            </div>

            {/* ── Frequently Bought Together ── */}
            <FrequentlyBoughtTogether currentProduct={product} />
          </div>
        </div>

        {/* Specs accordion */}
        {product.specs.length > 0 && (
          <div className="mb-16 max-w-3xl">
            <SpecsAccordion specs={product.specs} />
          </div>
        )}

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 style={{ fontSize: "1.5rem" }}>
                Related{" "}
                <span style={{ color: "var(--pu-green)" }}>Gear</span>
              </h2>
              <Link
                to="/store"
                className="flex items-center gap-1 text-sm pu-mono transition-colors"
                style={{ color: "var(--pu-text-muted)" }}
                onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-green)")}
                onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "var(--pu-text-muted)")}
              >
                View all <ArrowLeft size={12} style={{ transform: "rotate(180deg)" }} />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/store/${p.handle}`}
                  className="group flex gap-4 p-4 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: "var(--pu-surface)",
                    border: "1px solid var(--pu-border)",
                    textDecoration: "none",
                  }}
                  onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--pu-border-bright)")}
                  onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.borderColor = "var(--pu-border)")}
                >
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0" style={{ border: "1px solid var(--pu-border)" }}>
                    <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm line-clamp-2 mb-1" style={{ color: "var(--pu-text)" }}>{p.title}</p>
                    <p className="text-sm pu-mono" style={{ color: "var(--pu-green)" }}>${p.price}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}