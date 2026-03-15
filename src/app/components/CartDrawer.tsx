import { useEffect } from "react";
import { Link } from "react-router";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight, Lock, Shield } from "lucide-react";
import { useCart } from "../context/CartContext";
import { CartDrawerUpsell } from "./CartDrawerUpsell";

export function CartDrawer() {
  const { items, isOpen, closeCart, removeItem, updateQty, subtotal, itemCount } = useCart();

  // Trap scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") closeCart(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [closeCart]);

  const handleCheckout = () => {
    // In production with Shopify: redirect to cart.checkoutUrl from Shopify cart API
    // For now, log and show alert
    alert("Checkout: In production this routes to your Shopify checkout URL or Stripe session.");
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 transition-all duration-300"
        style={{
          backgroundColor: isOpen ? "rgba(0,0,0,0.65)" : "transparent",
          backdropFilter: isOpen ? "blur(4px)" : "none",
          pointerEvents: isOpen ? "auto" : "none",
        }}
        onClick={closeCart}
      />

      {/* Drawer panel */}
      <div
        className="fixed top-0 right-0 bottom-0 z-50 flex flex-col w-full max-w-md transition-transform duration-300 ease-in-out"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          backgroundColor: "var(--pu-surface)",
          borderLeft: "1px solid var(--pu-border)",
          boxShadow: isOpen ? "-20px 0 60px rgba(0,0,0,0.5)" : "none",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-5 py-4 flex-shrink-0"
          style={{ borderBottom: "1px solid var(--pu-border)" }}
        >
          <div className="flex items-center gap-2.5">
            <ShoppingBag size={18} style={{ color: "var(--pu-green)" }} />
            <h3 style={{ fontSize: "1rem", margin: 0 }}>Cart</h3>
            {itemCount > 0 && (
              <span
                className="px-2 py-0.5 rounded-full text-xs pu-mono"
                style={{ backgroundColor: "var(--pu-green)", color: "#000" }}
              >
                {itemCount}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            className="p-1.5 rounded transition-colors"
            style={{ color: "var(--pu-text-muted)" }}
            onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--pu-text)")}
            onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--pu-text-muted)")}
          >
            <X size={18} />
          </button>
        </div>

        {/* Items list */}
        <div className="flex-1 overflow-y-auto py-4 px-5">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center py-16">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mb-4"
                style={{ backgroundColor: "var(--pu-surface-2)", color: "var(--pu-text-dim)" }}
              >
                <ShoppingBag size={24} />
              </div>
              <p className="text-sm pu-mono mb-2" style={{ color: "var(--pu-text-muted)" }}>
                Your cart is empty
              </p>
              <p className="text-xs pu-mono mb-6" style={{ color: "var(--pu-text-dim)" }}>
                Add hardware from the store to get started
              </p>
              <button
                onClick={closeCart}
                className="px-4 py-2 rounded text-xs pu-mono transition-all"
                style={{
                  backgroundColor: "var(--pu-surface-2)",
                  border: "1px solid var(--pu-border-bright)",
                  color: "var(--pu-green)",
                }}
              >
                Browse the Store
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl"
                  style={{ backgroundColor: "var(--pu-surface-2)", border: "1px solid var(--pu-border)" }}
                >
                  {/* Image */}
                  <div
                    className="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden"
                    style={{ border: "1px solid var(--pu-border)" }}
                  >
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <Link
                      to={`/store/${item.handle}`}
                      onClick={closeCart}
                      className="text-sm leading-tight hover:underline line-clamp-2"
                      style={{ color: "var(--pu-text)" }}
                    >
                      {item.title}
                    </Link>
                    {item.variantTitle && item.variantTitle !== "Default Title" && (
                      <p className="text-xs pu-mono mt-0.5" style={{ color: "var(--pu-text-muted)" }}>
                        {item.variantTitle}
                      </p>
                    )}
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-sm pu-mono" style={{ color: "var(--pu-green)" }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>

                      {/* Qty controls */}
                      <div
                        className="flex items-center gap-1 rounded-lg overflow-hidden"
                        style={{ border: "1px solid var(--pu-border)" }}
                      >
                        <button
                          className="w-7 h-7 flex items-center justify-center transition-colors"
                          style={{ color: "var(--pu-text-muted)", backgroundColor: "var(--pu-surface-3)" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--pu-text)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--pu-text-muted)")}
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                        >
                          <Minus size={11} />
                        </button>
                        <span className="w-8 text-center text-xs pu-mono" style={{ color: "var(--pu-text)" }}>
                          {item.quantity}
                        </span>
                        <button
                          className="w-7 h-7 flex items-center justify-center transition-colors"
                          style={{ color: "var(--pu-text-muted)", backgroundColor: "var(--pu-surface-3)" }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--pu-text)")}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--pu-text-muted)")}
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                        >
                          <Plus size={11} />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="self-start p-1 transition-colors"
                    style={{ color: "var(--pu-text-dim)" }}
                    onMouseEnter={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "#FF3B3B")}
                    onMouseLeave={(e) => ((e.currentTarget as HTMLButtonElement).style.color = "var(--pu-text-dim)")}
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            className="flex-shrink-0 p-5 space-y-3"
            style={{ borderTop: "1px solid var(--pu-border)" }}
          >
            {/* Subtotal */}
            <div className="flex items-center justify-between">
              <span className="text-sm pu-mono" style={{ color: "var(--pu-text-muted)" }}>Subtotal</span>
              <span className="pu-mono" style={{ color: "var(--pu-text)", fontWeight: 700 }}>
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <p className="text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
              Shipping calculated at checkout
            </p>

            {/* ── Cart Upsell ── */}
            <CartDrawerUpsell cartItems={items} />

            {/* Checkout CTA */}
            <button
              onClick={handleCheckout}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-lg pu-mono text-sm transition-all duration-200"
              style={{
                backgroundColor: "var(--pu-green)",
                color: "#000",
                fontWeight: 700,
                boxShadow: "0 0 20px rgba(57,255,20,0.3)",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = "#4dff26";
                el.style.boxShadow = "0 0 30px rgba(57,255,20,0.5)";
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement;
                el.style.backgroundColor = "var(--pu-green)";
                el.style.boxShadow = "0 0 20px rgba(57,255,20,0.3)";
              }}
            >
              <Lock size={14} />
              Secure Checkout
              <ArrowRight size={14} />
            </button>

            {/* Trust badges */}
            <div className="flex items-center justify-center gap-4 pt-1">
              <div className="flex items-center gap-1 text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
                <Shield size={10} style={{ color: "var(--pu-green)" }} />
                SSL Secured
              </div>
              <div className="flex items-center gap-1 text-xs pu-mono" style={{ color: "var(--pu-text-dim)" }}>
                <Shield size={10} style={{ color: "var(--pu-green)" }} />
                Ships in 2–3 Days
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}