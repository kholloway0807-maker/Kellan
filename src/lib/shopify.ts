// Shopify Storefront API client. The site runs headless: product content lives
// in src/data/products.ts, while live variant IDs, prices, stock and checkout
// come from Shopify. Without credentials the site runs in preview mode.

const DOMAIN = import.meta.env.VITE_SHOPIFY_DOMAIN as string | undefined;
const TOKEN = import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN as string | undefined;
const API_VERSION = '2025-01';

export const shopifyEnabled = Boolean(DOMAIN && TOKEN);

export interface LiveVariant {
  id: string;
  available: boolean;
  price: number;
}

/** productHandle -> size -> variant */
export type VariantMap = Record<string, Record<string, LiveVariant>>;

async function storefront<T>(query: string, variables: Record<string, unknown>): Promise<T> {
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

interface ProductNode {
  variants: {
    nodes: {
      id: string;
      availableForSale: boolean;
      price: { amount: string };
      selectedOptions: { name: string; value: string }[];
    }[];
  };
}

/** Fetches every variant for the given product handles, keyed by Size option. */
export async function fetchVariants(handles: string[]): Promise<VariantMap> {
  const fields = `variants(first: 50) { nodes { id availableForSale price { amount } selectedOptions { name value } } }`;
  const query = `query (${handles.map((_, i) => `$h${i}: String!`).join(', ')}) {
    ${handles.map((_, i) => `p${i}: product(handle: $h${i}) { ${fields} }`).join('\n')}
  }`;
  const vars = Object.fromEntries(handles.map((h, i) => [`h${i}`, h]));
  const data = await storefront<Record<string, ProductNode | null>>(query, vars);

  const map: VariantMap = {};
  handles.forEach((handle, i) => {
    const product = data[`p${i}`];
    if (!product) return;
    map[handle] = {};
    for (const v of product.variants.nodes) {
      const size = v.selectedOptions.find((o) => o.name.toLowerCase() === 'size')?.value ?? 'Default';
      map[handle][size.toUpperCase()] = { id: v.id, available: v.availableForSale, price: Number(v.price.amount) };
    }
  });
  return map;
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
