/**
 * FrequentlyBoughtTogether
 * ──────────────────────────
 * Amazon-style "Frequently Bought Together" cross-sell widget.
 * Rendered on product detail pages just below the Add-to-Cart CTA.
 *
 * - Shows the current product + 1-2 recommended add-ons
 * - Each add-on has a checkbox (checked by default, toggleable)
 * - Displays combined price & one-click "Add Bundle to Cart" action
 * - Items already in the cart are skipped / shown as "In cart"
 */

import { useState, useMemo } from "react";
import { Link } from "react-router";
import { ShoppingCart, Plus, Check } from "lucide-react";
import { mockProducts, type MockProduct } from "../data/mock-products";
import { crossSells } from "../data/recommendations";
import { useCart } from "../context/CartContext";
import { trackEvent, AnalyticsEvents } from "../lib/analytics";

interface Props {
  currentProduct: MockProduct;
}

export function FrequentlyBoughtTogether({ currentProduct }: Props) {
  const { addItem, items: cartItems } = useCart();

  // Look up cross-sell rule for this product
  const rule = crossSells[currentProduct.id];
  if (!rule) return null;

  // Resolve recommended product objects (skip if not found in catalog)
  const recommendedProducts = useMemo(
    () =>
      rule.recommendedIds
        .map((id) => mockProducts.find((p) => p.id === id))
        .filter((p): p is MockProduct => !!p && p.inStock),
    [rule.recommendedIds]
  );

  if (recommendedProducts.length === 0) return null;

  // Per-recommendation checked state (checked = will be added to cart)
  const [checked, setChecked] = useState<Record<string, boolean>>(
    () =>
      Object.fromEntries(
        recommendedProducts.map((p) => [p.id, true])
      )
  );

  // Determine which items are already in cart
  const cartProductIds = new Set(cartItems.map((i) => i.productId));

  const toggleCheck = (id: string) =>
    setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  // Calculate combined total
  const addOnTotal = recommendedProducts
    .filter((p) => checked[p.id] && !cartProductIds.has(p.id))
    .reduce((sum, p) => sum + p.price, 0);

  const bundleTotal = currentProduct.price + addOnTotal;

  const [addedState, setAddedState] = useState<"idle" | "added">("idle");

  const handleAddBundle = () => {
    const toAdd = recommendedProducts.filter(
      (p) => checked[p.id] && !cartProductIds.has(p.id)
    );
    toAdd.forEach((p) => {
      addItem({
        productId: p.id,
        variantId: p.variants?.[0]?.id ?? p.id,
        handle: p.handle,
        title: p.title,
        variantTitle: p.variants?.[0]?.title,
        image: p.images[0],
        price: p.price,
        compareAtPrice: p.compareAtPrice,
        quantity: 1,
      });
      trackEvent(AnalyticsEvents.ADD_TO_CART, {
        product: p.title,
        price: p.price,
        quantity: 1,
        source: "frequently_bought_together",
      });
    });

    setAddedState("added");
    setTimeout(() => setAddedState("idle"), 2200);
  };

  const checkedCount = recommendedProducts.filter(
    (p) => checked[p.id] && !cartProductIds.has(p.id)
  ).length;

  return (
    <div
      className="rounded-2xl overflow-hidden mt-6"
      style={{
        border: "1px solid rgba(57,255,20,0.18)",
        background:
          "linear-gradient(135deg, rgba(57,255,20,0.03) 0%, rgba(0,0,0,0) 60%), var(--pu-surface-2)",
      }}
    >
      {/* Header */}
      <div
        className="px-5 py-3.5 flex items-center gap-2"
        style={{ borderBottom: "1px solid var(--pu-border)" }}
      >
        <span
          className="w-2 h-2 rounded-full animate-pulse"
          style={{ backgroundColor: "var(--pu-green)", boxShadow: "0 0 6px var(--pu-green)" }}
        />
        <p
          className="pu-mono text-xs tracking-widest uppercase"
          style={{ color: "var(--pu-green)" }}
        >
          {rule.headline}
        </p>
      </div>

      <div className="px-5 py-4">
        <p className="text-xs mb-4" style={{ color: "var(--pu-text-muted)", lineHeight: "1.6" }}>
          {rule.subtext}
        </p>

        {/* Product row — current + add-ons */}
        <div className="flex flex-col gap-3">
          {/* Current product (anchor — not toggleable) */}
          <FBTProductRow
            product={currentProduct}
            checked
            disabled
            inCart={cartProductIds.has(currentProduct.id)}
            label="This item"
          />

          {recommendedProducts.map((p, i) => (
            <div key={p.id}>
              {/* Plus connector */}
              <div className="flex items-center gap-2 mb-3">
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--pu-border)" }} />
                <Plus
                  size={12}
                  style={{ color: "var(--pu-green)", flexShrink: 0 }}
                />
                <div className="flex-1 h-px" style={{ backgroundColor: "var(--pu-border)" }} />
              </div>
              <FBTProductRow
                product={p}
                checked={cartProductIds.has(p.id) ? true : checked[p.id]}
                disabled={cartProductIds.has(p.id)}
                inCart={cartProductIds.has(p.id)}
                label={`Add-on ${i + 1}`}
                onToggle={() => !cartProductIds.has(p.id) && toggleCheck(p.id)}
              />
            </div>
          ))}
        </div>

        {/* Price summary */}
        <div
          className="flex items-center justify-between mt-4 pt-4"
          style={{ borderTop: "1px solid var(--pu-border)" }}
        >
          <div>
            <p className="text-xs pu-mono" style={{ color: "var(--pu-text-muted)" }}>
              Bundle total
            </p>
            <p
              className="pu-mono"
              style={{ color: "var(--pu-green)", fontSize: "1.3rem", fontWeight: 700 }}
            >
              ${bundleTotal.toFixed(0)}
            </p>
          </div>
          <button
            onClick={handleAddBundle}
            disabled={checkedCount === 0 || addedState === "added"}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl pu-mono text-xs transition-all duration-200"
            style={{
              backgroundColor:
                addedState === "added"
                  ? "var(--pu-green-dim)"
                  : checkedCount === 0
                  ? "var(--pu-surface)"
                  : "var(--pu-green)",
              color:
                checkedCount === 0
                  ? "var(--pu-text-dim)"
                  : "#000",
              fontWeight: 700,
              boxShadow:
                checkedCount > 0 && addedState !== "added"
                  ? "0 0 16px rgba(57,255,20,0.25)"
                  : "none",
              cursor: checkedCount === 0 ? "not-allowed" : "pointer",
            }}
          >
            {addedState === "added" ? (
              <>
                <Check size={13} /> Added to Cart
              </>
            ) : (
              <>
                <ShoppingCart size={13} />
                {checkedCount > 0
                  ? `Add ${checkedCount} Item${checkedCount > 1 ? "s" : ""} to Cart`
                  : "Select add-ons"}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Inner row ────────────────────────────────────────────────────────────────

interface RowProps {
  product: MockProduct;
  checked: boolean;
  disabled?: boolean;
  inCart: boolean;
  label?: string;
  onToggle?: () => void;
}

function FBTProductRow({ product, checked, disabled, inCart, label, onToggle }: RowProps) {
  return (
    <div className="flex items-center gap-3">
      {/* Checkbox */}
      <button
        onClick={onToggle}
        disabled={disabled}
        className="flex-shrink-0 w-5 h-5 rounded flex items-center justify-center transition-all duration-150"
        style={{
          backgroundColor: checked
            ? inCart
              ? "rgba(57,255,20,0.25)"
              : "var(--pu-green)"
            : "transparent",
          border: checked
            ? inCart
              ? "1px solid rgba(57,255,20,0.4)"
              : "1px solid var(--pu-green)"
            : "1px solid var(--pu-border-bright)",
          cursor: disabled ? "default" : "pointer",
        }}
      >
        {checked && <Check size={11} color={inCart ? "var(--pu-green)" : "#000"} />}
      </button>

      {/* Image */}
      <Link
        to={`/store/${product.handle}`}
        className="flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden transition-opacity duration-150"
        style={{
          border: "1px solid var(--pu-border)",
          opacity: checked ? 1 : 0.4,
        }}
      >
        <img
          src={product.images[0]}
          alt={product.title}
          className="w-full h-full object-cover"
        />
      </Link>

      {/* Details */}
      <div className="flex-1 min-w-0" style={{ opacity: checked ? 1 : 0.4 }}>
        <Link
          to={`/store/${product.handle}`}
          className="text-xs leading-tight line-clamp-1 hover:underline block"
          style={{ color: "var(--pu-text)" }}
        >
          {product.title}
        </Link>
        {label && (
          <p className="text-xs pu-mono mt-0.5" style={{ color: "var(--pu-text-dim)" }}>
            {inCart ? "✓ Already in cart" : label}
          </p>
        )}
      </div>

      {/* Price */}
      <span
        className="flex-shrink-0 pu-mono text-sm"
        style={{
          color: inCart ? "var(--pu-text-dim)" : "var(--pu-green)",
          opacity: checked ? 1 : 0.4,
          textDecoration: inCart ? "line-through" : "none",
        }}
      >
        ${product.price}
      </span>
    </div>
  );
}
