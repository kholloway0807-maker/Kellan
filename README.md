# Saint. Clermont — Dinner Club

Headless Shopify storefront for **Saint. Clermont Clothing**. Black and cream,
blackletter crest, St. Tropez → St. Clermont.

## Stack

- React + Vite + TypeScript, Tailwind CSS
- GSAP ScrollTrigger reveals + Lenis smooth scroll (off under `prefers-reduced-motion`)
- Shopify **Storefront API** for live prices, stock and checkout

## Sections

Hero (script wordmark) · Marquee · Collection (4 tees, size picker, bag) ·
La Maison (story + crest) · Le Menu (the drop as a dinner menu) · The Club (email signup) · Footer

## Connecting Shopify

1. In Shopify admin: **Settings → Apps and sales channels → Develop apps → Create an app**,
   enable **Storefront API** scopes (`unauthenticated_read_product_listings`,
   `unauthenticated_write_checkouts`, `unauthenticated_read_checkouts`), install, and copy the
   **Storefront access token** (it's a public, browser-safe token).
2. Create the products with a **Size** option (S, M, L, XL, XXL) and these handles
   (or edit `handle` in `src/data/products.ts` to match yours):
   - `saint-clermont-script-noir-tee`
   - `saint-clermont-crest-noir-tee`
   - `saint-clermont-script-creme-tee`
   - `saint-clermont-crest-creme-tee`
3. Locally: copy `.env.example` → `.env` and fill in `VITE_SHOPIFY_DOMAIN` and
   `VITE_SHOPIFY_STOREFRONT_TOKEN`.
   For GitHub Pages: add repo **Variables** `SHOPIFY_DOMAIN` and `SHOPIFY_STOREFRONT_TOKEN`.

Once connected, prices and sold-out sizes come from Shopify and **Checkout** sends the bag to
Shopify's hosted checkout. Without credentials the site runs in preview mode (bag works,
checkout is disabled).

## Develop

```bash
npm install
npm run dev
npm run build
```
