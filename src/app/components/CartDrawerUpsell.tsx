/**
 * CartDrawerUpsell
 * ─────────────────
 * Shown inside the CartDrawer footer, just above the Checkout button.
 * Evaluates the cart contents against the cartUpsells rules and surfaces
 * the highest-priority recommendation that isn't already in the cart.
 * One-click "Add +" to instantly add the item without leaving the drawer.
 */

import { useState } from "react";
import { Link } from "react-router";
import { Plus, Check, Zap } from "lucide-react";
import { mockProducts } from "../data/mock-products";
import { cartUpsells } from "../data/recommendations";
import { useCart, type CartItem } from "../context/CartContext";
import { trackEvent, AnalyticsEvents } from "../lib/analytics";

interface Props {
  cartItems: CartItem[];
}

export function CartDrawerUpsell({ cartItems }: Props) {
  const { addItem, closeCart } = useCart();
  const [addedId, setAddedId] = useState<string | null>(null);

  const cartProductIds = new Set(cartItems.map((i) => i.productId));

  // Find the first rule that fires and whose recommendation isn't in cart
  const activeRule = cartUpsells.find(
    (rule) =>
      rule.triggerIds.some((id) => cartProductIds.has(id)) &&
      !cartProductIds.has(rule.recommendId)
  );

  if (!activeRule) return null;

  const recommended = mockProducts.find((p) => p.id === activeRule.recommendId);
  if (!recommended || !recommended.inStock) return null;

  const handleAdd = () => {
    addItem({
      productId: recommended.id,
      variantId: recommended.variants?.[0]?.id ?? recommended.id,
      handle: recommended.handle,
      title: recommended.title,
      variantTitle: recommended.variants?.[0]?.title,
      image: recommended.images[0],
      price: recommended.price,
      compareAtPrice: recommended.compareAtPrice,
      quantity: 1,
    });
    trackEvent(AnalyticsEvents.ADD_TO_CART, {
      product: recommended.title,
      price: recommended.price,
      quantity: 1,
      source: "cart_drawer_upsell",
    });
    setAddedId(recommended.id);
    setTimeout(() => setAddedId(null), 2500);
  };

  const isAdded = addedId === recommended.id;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: "1px solid rgba(57,255,20,0.18)",
        background: "linear-gradient(135deg, rgba(57,255,20,0.04) 0%, transparent 70%)",
      }}
    >
      {/* Label bar */}
      <div
        className="flex items-center gap-1.5 px-3 py-1.5"
        style={{ borderBottom: "1px solid var(--pu-border)", backgroundColor: "rgba(57,255,20,0.05)" }}
      >
        <Zap size={10} style={{ color: "var(--pu-green)" }} />
        <p className="text-xs pu-mono tracking-widest uppercase" style={{ color: "var(--pu-green)" }}>
          Pairs Well With Your Order
        </p>
      </div>

      <div className="flex items-center gap-3 p-3">
        {/* Product image — clickable to PDP */}
        <Link
          to={`/store/${recommended.handle}`}
          onClick={closeCart}
          className="flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden"
          style={{ border: "1px solid var(--pu-border)" }}
        >
          <img
            src={recommended.images[0]}
            alt={recommended.title}
            className="w-full h-full object-cover"
          />
        </Link>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <Link
            to={`/store/${recommended.handle}`}
            onClick={closeCart}
            className="text-xs leading-tight line-clamp-2 hover:underline block mb-1"
            style={{ color: "var(--pu-text)" }}
          >
            {recommended.title}
          </Link>
          <p className="text-xs" style={{ color: "var(--pu-text-dim)", lineHeight: "1.4" }}>
            {activeRule.pitch}
          </p>
        </div>

        {/* Price + Add button */}
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="text-sm pu-mono" style={{ color: "var(--pu-green)", fontWeight: 700 }}>
            ${recommended.price}
          </span>
          <button
            onClick={handleAdd}
            disabled={isAdded}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg pu-mono text-xs transition-all duration-200"
            style={{
              backgroundColor: isAdded
                ? "var(--pu-green-dim)"
                : "var(--pu-green)",
              color: "#000",
              fontWeight: 700,
              boxShadow: isAdded ? "none" : "0 0 10px rgba(57,255,20,0.2)",
            }}
            onMouseEnter={(e) => {
              if (isAdded) return;
              const el = e.currentTarget as HTMLButtonElement;
              el.style.backgroundColor = "#4dff26";
              el.style.boxShadow = "0 0 16px rgba(57,255,20,0.4)";
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement;
              el.style.backgroundColor = isAdded ? "var(--pu-green-dim)" : "var(--pu-green)";
              el.style.boxShadow = isAdded ? "none" : "0 0 10px rgba(57,255,20,0.2)";
            }}
          >
            {isAdded ? <><Check size={11} /> Added</> : <><Plus size={11} /> Add</>}
          </button>
        </div>
      </div>
    </div>
  );
}
