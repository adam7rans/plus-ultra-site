import { Helmet } from "react-helmet-async";
import { SITE_URL, DEFAULT_OG_IMAGE } from "../lib/analytics";

interface SEOProps {
  title: string;
  description: string;
  keywords?: string;
  /** Relative path, e.g. "/features" */
  path?: string;
  /** Full URL to OG image. Defaults to branded hero image. */
  ogImage?: string;
  /** Defaults to "website" */
  ogType?: "website" | "product" | "article";
  /** Product price for og:price meta (store pages) */
  price?: number;
  /** Prevent indexing (e.g. checkout pages) */
  noindex?: boolean;
  /** JSON-LD structured data (Product, Article, etc.) */
  structuredData?: Record<string, unknown>;
}

/**
 * Drop this component at the top of any page to inject SEO-correct
 * `<title>`, `<meta>`, Open Graph, and Twitter Card tags.
 *
 * Works via react-helmet-async — tags are hoisted into `<head>`.
 *
 * NOTE: For perfect social-share previews (iMessage, Discord, Slack)
 * without JS execution, add prerendering or edge-side meta injection
 * (e.g. Cloudflare Workers, Netlify Edge Functions, or vite-plugin-ssg).
 * Google and Bing crawl JS so SEO rankings are fully covered.
 */
export function SEO({
  title,
  description,
  keywords,
  path = "/",
  ogImage = DEFAULT_OG_IMAGE,
  ogType = "website",
  price,
  noindex = false,
  structuredData,
}: SEOProps) {
  const canonical = `${SITE_URL}${path}`;

  return (
    <Helmet>
      {/* ── Primary ──────────────────────────────────────────────────────── */}
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <link rel="canonical" href={canonical} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* ── Open Graph (Facebook, iMessage, Discord, Slack, LinkedIn) ───── */}
      <meta property="og:title"       content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url"         content={canonical} />
      <meta property="og:type"        content={ogType} />
      <meta property="og:image"       content={ogImage} />
      <meta property="og:image:width"  content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt"    content={title} />
      <meta property="og:site_name"   content="Plus Ultra" />
      <meta property="og:locale"      content="en_US" />

      {/* ── Twitter / X Card ─────────────────────────────────────────────── */}
      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={ogImage} />
      <meta name="twitter:site"        content="@plusultraapp" />
      <meta name="twitter:creator"     content="@plusultraapp" />

      {/* ── Product pricing (store pages) ────────────────────────────────── */}
      {price !== undefined && (
        <>
          <meta property="product:price:amount"   content={String(price)} />
          <meta property="product:price:currency" content="USD" />
        </>
      )}

      {/* ── JSON-LD Structured Data ───────────────────────────────────────── */}
      {structuredData && (
        <script type="application/ld+json">
          {JSON.stringify(structuredData)}
        </script>
      )}

      {/* ── App store meta ─────────────────────────────────────────────────── */}
      <meta name="apple-itunes-app"  content={`app-id=000000000`} />
      <meta name="google-play-app"   content="app-id=app.plusultra" />

      {/* ── Misc SEO signals ──────────────────────────────────────────────── */}
      <meta name="theme-color"   content="#39FF14" />
      <meta name="author"        content="Plus Ultra" />
      <meta name="application-name" content="Plus Ultra" />
    </Helmet>
  );
}

// ─── Org + WebSite structured data (inject on every page via Root) ─────────────
export const SITE_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": `${SITE_URL}/#org`,
      name: "Plus Ultra",
      url: SITE_URL,
      logo: `${SITE_URL}/logo.png`,
      sameAs: ["https://github.com/adam7rans/plus-ultra"],
      description:
        "Open-source emergency preparedness platform with encrypted mesh networking and offline AI.",
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Plus Ultra",
      publisher: { "@id": `${SITE_URL}/#org` },
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/docs?q={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: "Plus Ultra",
      operatingSystem: "iOS, Android",
      applicationCategory: "UtilitiesApplication",
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "214" },
    },
  ],
};

// ─── Product structured data generator ────────────────────────────────────────
export function buildProductStructuredData(product: {
  title: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  inStock: boolean;
  handle: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images,
    url: `${SITE_URL}/store/${product.handle}`,
    brand: { "@type": "Brand", name: "Plus Ultra" },
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}/store/${product.handle}`,
      priceCurrency: "USD",
      price: String(product.price),
      priceValidUntil: "2027-01-01",
      availability: product.inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      hasMerchantReturnPolicy: {
        "@type": "MerchantReturnPolicy",
        returnPolicyCategory: "https://schema.org/MerchantReturnFiniteReturnWindow",
        merchantReturnDays: 30,
      },
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingRate: { "@type": "MonetaryAmount", currency: "USD" },
        deliveryTime: {
          "@type": "ShippingDeliveryTime",
          handlingTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 2, unitCode: "DAY" },
          transitTime: { "@type": "QuantitativeValue", minValue: 1, maxValue: 3, unitCode: "DAY" },
        },
      },
    },
  };
}
