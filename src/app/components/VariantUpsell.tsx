/**
 * VariantUpsell
 * ─────────────
 * Appears just below the variant selector on product detail pages.
 * When the user has a lower-tier variant selected, this amber bar suggests
 * upgrading to the next tier with a one-click "Upgrade" action.
 */

import { TrendingUp, X } from "lucide-react";
import { useState } from "react";
import { variantUpsells } from "../data/recommendations";
import type { MockProduct } from "../data/mock-products";
import { trackEvent } from "../lib/analytics";

interface Props {
  product: MockProduct;
  selectedVariantIdx: number;
  onSelectVariant: (idx: number) => void;
}

export function VariantUpsell({ product, selectedVariantIdx, onSelectVariant }: Props) {
  const [dismissed, setDismissed] = useState(false);

  const rules = variantUpsells[product.id];
  if (!rules || dismissed) return null;

  const selectedVariant = product.variants?.[selectedVariantIdx];
  if (!selectedVariant) return null;

  const rule = rules.find((r) => r.fromVariantId === selectedVariant.id);
  if (!rule) return null;

  const targetVariant = product.variants?.[rule.toVariantIdx];
  if (!targetVariant) return null;

  const handleUpgrade = () => {
    onSelectVariant(rule.toVariantIdx);
    trackEvent("variant_upgrade_accepted", {
      product: product.title,
      from: selectedVariant.title,
      to: targetVariant.title,
    });
  };

  return (
    <div
      className="flex items-start gap-3 px-4 py-3 rounded-xl mb-5"
      style={{
        backgroundColor: "rgba(255,184,0,0.06)",
        border: "1px solid rgba(255,184,0,0.25)",
      }}
    >
      <TrendingUp
        size={15}
        className="flex-shrink-0 mt-0.5"
        style={{ color: "var(--pu-amber)" }}
      />

      <div className="flex-1 min-w-0">
        <p className="text-xs pu-mono mb-1" style={{ color: "var(--pu-amber)" }}>
          UPGRADE AVAILABLE — {rule.priceDelta}
        </p>
        <p className="text-xs" style={{ color: "var(--pu-text-muted)", lineHeight: "1.5" }}>
          {rule.pitch}
        </p>
        <button
          onClick={handleUpgrade}
          className="mt-2 px-3 py-1.5 rounded-lg text-xs pu-mono transition-all duration-150"
          style={{
            backgroundColor: "rgba(255,184,0,0.15)",
            color: "var(--pu-amber)",
            border: "1px solid rgba(255,184,0,0.3)",
          }}
          onMouseEnter={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = "rgba(255,184,0,0.25)";
          }}
          onMouseLeave={(e) => {
            const el = e.currentTarget as HTMLButtonElement;
            el.style.backgroundColor = "rgba(255,184,0,0.15)";
          }}
        >
          Switch to {targetVariant.title.split(" — ")[0]} →
        </button>
      </div>

      <button
        onClick={() => setDismissed(true)}
        className="flex-shrink-0 p-0.5 transition-opacity hover:opacity-100"
        style={{ color: "var(--pu-text-dim)", opacity: 0.5 }}
        aria-label="Dismiss upgrade suggestion"
      >
        <X size={13} />
      </button>
    </div>
  );
}
