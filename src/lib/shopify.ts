// Shopify Storefront API client. The site runs headless: every product, image,
// price, size and checkout comes from the Shopify store. Without credentials
// the collection shows a "coming soon" state.

const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN as string | undefined;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined;
/** Optional: only show products from this collection handle. */
const COLLECTION = import.meta.env.VITE_SHOPIFY_COLLECTION as string | undefined;
const API_VERSION = '2025-01';

export const shopifyEnabled = Boolean(DOMAIN && TOKEN);

export interface Variant {
  id: string;
  title: string;
  available: boolean;
  price: number;
  options: Record<string, string>;
  image?: string;
}

export interface Product {
  id: string;
  handle: string;
  title: string;
  description: string;
  image?: { url: string; alt: string };
  /** Option names in display order, e.g. ["Size"] or ["Color", "Size"]. */
  options: { name: string; values: string[] }[];
  variants: Variant[];
  currency: string;
}

async function storefront<T>(query: string, variables: Record<string, unknown> = {}): Promise<T> {
  const res = await fetch(`https://${DOMAIN}/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Storefront-Access-Token': TOKEN!,
    },
    body: JSON.stringify({ query, variables }),
  });
  if (!res.ok) throw new Error(`Shopify ${res.status}`);
  const json = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (json.errors?.length) throw new Error(json.errors[0].message);
  return json.data as T;
}

const PRODUCT_FIELDS = `
  id handle title description
  featuredImage { url altText }
  options { name optionValues { name } }
  variants(first: 100) {
    nodes {
      id title availableForSale
      price { amount currencyCode }
      selectedOptions { name value }
      image { url }
    }
  }`;

interface ProductNode {
  id: string;
  handle: string;
  title: string;
  description: string;
  featuredImage: { url: string; altText: string | null } | null;
  options: { name: string; optionValues: { name: string }[] }[];
  variants: {
    nodes: {
      id: string;
      title: string;
      availableForSale: boolean;
      price: { amount: string; currencyCode: string };
      selectedOptions: { name: string; value: string }[];
      image: { url: string } | null;
    }[];
  };
}

function toProduct(n: ProductNode): Product {
  return {
    id: n.id,
    handle: n.handle,
    title: n.title,
    description: n.description,
    image: n.featuredImage ? { url: n.featuredImage.url, alt: n.featuredImage.altText ?? n.title } : undefined,
    // Shopify gives single-variant products a lone "Title" option; hide it.
    options: n.options
      .filter((o) => !(o.name === 'Title' && o.optionValues.length === 1))
      .map((o) => ({ name: o.name, values: o.optionValues.map((v) => v.name) })),
    variants: n.variants.nodes.map((v) => ({
      id: v.id,
      title: v.title,
      available: v.availableForSale,
      price: Number(v.price.amount),
      options: Object.fromEntries(v.selectedOptions.map((o) => [o.name, o.value])),
      image: v.image?.url,
    })),
    currency: n.variants.nodes[0]?.price.currencyCode ?? 'USD',
  };
}

/** Loads the storefront's products (from VITE_SHOPIFY_COLLECTION if set). */
export async function fetchProducts(first = 24): Promise<Product[]> {
  if (COLLECTION) {
    const data = await storefront<{ collection: { products: { nodes: ProductNode[] } } | null }>(
      `query ($handle: String!, $first: Int!) {
        collection(handle: $handle) { products(first: $first) { nodes { ${PRODUCT_FIELDS} } } }
      }`,
      { handle: COLLECTION, first }
    );
    return (data.collection?.products.nodes ?? []).map(toProduct);
  }
  const data = await storefront<{ products: { nodes: ProductNode[] } }>(
    `query ($first: Int!) { products(first: $first, sortKey: CREATED_AT, reverse: true) { nodes { ${PRODUCT_FIELDS} } } }`,
    { first }
  );
  return data.products.nodes.map(toProduct);
}

/** Creates a Shopify cart and returns its hosted checkout URL. */
export async function createCheckout(lines: { merchandiseId: string; quantity: number }[]): Promise<string> {
  const data = await storefront<{
    cartCreate: { cart: { checkoutUrl: string } | null; userErrors: { message: string }[] };
  }>(
    `mutation ($lines: [CartLineInput!]!) {
      cartCreate(input: { lines: $lines }) { cart { checkoutUrl } userErrors { message } }
    }`,
    { lines }
  );
  const { cart, userErrors } = data.cartCreate;
  if (!cart) throw new Error(userErrors[0]?.message ?? 'Could not create cart');
  return cart.checkoutUrl;
}

export function formatPrice(amount: number, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2,
  }).format(amount);
}
