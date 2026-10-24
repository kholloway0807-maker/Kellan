# Saint. Clermont — Dinner Club

Headless Shopify storefront for **Saint. Clermont Clothing**. Black and cream,
blackletter crest, St. Tropez → St. Clermont.

## Stack

- React + Vite + TypeScript, Tailwind CSS
- GSAP ScrollTrigger reveals + Lenis smooth scroll (off under `prefers-reduced-motion`)
- Shopify **Storefront API** for live prices, stock and checkout

## Sections

Hero (script wordmark) · Marquee · Collection (live from Shopify, option picker, bag) ·
La Maison (story + crest) · Le Menu (live products as a dinner menu, hidden until products exist) · The Club (email signup) · Footer

## Connecting Shopify

1. In Shopify admin: **Settings → Apps and sales channels → Develop apps → Create an app**,
   enable **Storefront API** scopes (`unauthenticated_read_product_listings`,
   `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`), install, and copy the
   **Storefront access token** (it's a public, browser-safe token).
2. Add products in Shopify as usual (photos, description, price, Size/Color options) and make
   them available to the app's sales channel. The site shows the newest products automatically.
   To show only one collection, set `VITE_SHOPIFY_COLLECTION` to its handle.
3. Locally: copy `.env.example` → `.env` and fill in `VITE_SHOPIFY_DOMAIN` and
   `VITE_SHOPIFY_STOREFRONT_TOKEN`.
   For GitHub Pages: add repo **Variables** `SHOPIFY_DOMAIN` and `SHOPIFY_STOREFRONT_TOKEN`.

Once connected, products, images, prices and sold-out options come from Shopify and **Checkout**
sends the bag to Shopify's hosted checkout. Without credentials the collection shows a
"Coming Soon" state pointing to the Club signup.

## Develop

```bash
npm install
npm run dev
npm run build
```
