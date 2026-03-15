// ─────────────────────────────────────────────────────────────────────────────
// Plus Ultra — Shopify Storefront API Client
//
// HOW TO CONNECT REAL SHOPIFY:
//   1. In your Shopify admin go to: Apps → Develop Apps → Create an app
//   2. Under "API credentials" enable the Storefront API and add scopes:
//      `unauthenticated_read_product_listings`, `unauthenticated_write_checkouts`
//   3. Replace the two constants below with your real values.
//   4. Set SHOPIFY_MOCK_MODE = false to start fetching live data.
// ─────────────────────────────────────────────────────────────────────────────

export const SHOPIFY_STORE_DOMAIN = "your-store.myshopify.com"; // ← replace
export const SHOPIFY_STOREFRONT_TOKEN = "YOUR_STOREFRONT_ACCESS_TOKEN"; // ← replace
export const SHOPIFY_MOCK_MODE = true; // ← set to false when credentials are ready

const STOREFRONT_API_URL = `https://${SHOPIFY_STORE_DOMAIN}/api/2024-01/graphql.json`;

// ─── Types (mirrors Shopify Storefront API shape) ────────────────────────────
export interface ShopifyMoneyV2 {
  amount: string;
  currencyCode: string;
}

export interface ShopifyProductVariant {
  id: string;
  title: string;
  price: ShopifyMoneyV2;
  compareAtPrice: ShopifyMoneyV2 | null;
  availableForSale: boolean;
  quantityAvailable: number;
}

export interface ShopifyProduct {
  id: string;
  handle: string;
  title: string;
  description: string;
  descriptionHtml: string;
  tags: string[];
  productType: string;
  images: { nodes: { url: string; altText: string | null }[] };
  variants: { nodes: ShopifyProductVariant[] };
  priceRange: {
    minVariantPrice: ShopifyMoneyV2;
    maxVariantPrice: ShopifyMoneyV2;
  };
  metafields?: { key: string; value: string }[];
}

export interface ShopifyCart {
  id: string;
  checkoutUrl: string;
  lines: {
    nodes: {
      id: string;
      quantity: number;
      merchandise: { id: string; title: string; product: { title: string; handle: string }; price: ShopifyMoneyV2; image: { url: string } | null };
    }[];
  };
  cost: {
    subtotalAmount: ShopifyMoneyV2;
    totalAmount: ShopifyMoneyV2;
  };
}

// ─── GraphQL fetcher ─────────────────────────────────────────────────────────
async function shopifyFetch<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
  const res = await fetch(STOREFRONT_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!res.ok) throw new Error(`Shopify API error: ${res.status}`);
  const { data, errors } = await res.json();
  if (errors) throw new Error(errors[0].message);
  return data as T;
}

// ─── Queries ─────────────────────────────────────────────────────────────────
const PRODUCT_FIELDS = `
  id handle title description descriptionHtml tags productType
  images(first: 6) { nodes { url altText } }
  priceRange {
    minVariantPrice { amount currencyCode }
    maxVariantPrice { amount currencyCode }
  }
  variants(first: 10) {
    nodes {
      id title availableForSale quantityAvailable
      price { amount currencyCode }
      compareAtPrice { amount currencyCode }
    }
  }
`;

export async function getProducts(first = 20): Promise<ShopifyProduct[]> {
  const data = await shopifyFetch<{ products: { nodes: ShopifyProduct[] } }>(
    `query GetProducts($first: Int!) {
      products(first: $first, sortKey: TITLE) {
        nodes { ${PRODUCT_FIELDS} }
      }
    }`,
    { first }
  );
  return data.products.nodes;
}

export async function getProduct(handle: string): Promise<ShopifyProduct | null> {
  const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>(
    `query GetProduct($handle: String!) {
      productByHandle(handle: $handle) { ${PRODUCT_FIELDS} }
    }`,
    { handle }
  );
  return data.productByHandle;
}

export async function createCart(variantId: string, quantity: number): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>(
    `mutation CartCreate($variantId: ID!, $quantity: Int!) {
      cartCreate(input: {
        lines: [{ merchandiseId: $variantId, quantity: $quantity }]
      }) {
        cart {
          id checkoutUrl
          lines(first: 20) {
            nodes {
              id quantity
              merchandise {
                ... on ProductVariant {
                  id title price { amount currencyCode }
                  image { url }
                  product { title handle }
                }
              }
            }
          }
          cost {
            subtotalAmount { amount currencyCode }
            totalAmount { amount currencyCode }
          }
        }
      }
    }`,
    { variantId, quantity }
  );
  return data.cartCreate.cart;
}

export async function addCartLines(cartId: string, variantId: string, quantity: number): Promise<ShopifyCart> {
  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>(
    `mutation CartLinesAdd($cartId: ID!, $variantId: ID!, $quantity: Int!) {
      cartLinesAdd(cartId: $cartId, lines: [{ merchandiseId: $variantId, quantity: $quantity }]) {
        cart {
          id checkoutUrl
          lines(first: 20) {
            nodes {
              id quantity
              merchandise {
                ... on ProductVariant {
                  id title price { amount currencyCode }
                  image { url }
                  product { title handle }
                }
              }
            }
          }
          cost {
            subtotalAmount { amount currencyCode }
            totalAmount { amount currencyCode }
          }
        }
      }
    }`,
    { cartId, variantId, quantity }
  );
  return data.cartLinesAdd.cart;
}
