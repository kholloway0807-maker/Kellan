# NOVA — Shopify Theme

A custom **Online Store 2.0** theme for **NOVA** (novaly.us). Dark, premium streetwear aesthetic
with an acid-yellow accent, JSON section templates, scroll-reveal motion, variant picker, and a
fully responsive layout. It renders your **live Shopify products, collections, and images**
automatically once installed — nothing is hardcoded.

## Install (import to Shopify)
1. Download `nova-theme.zip`.
2. Shopify Admin → **Online Store → Themes**.
3. **Add theme → Upload zip file** → select `nova-theme.zip`.
4. Click **Customize** to set the hero image, logo, menus, and featured collection.
5. **Publish** when ready (or Preview first).

> Tip: In the theme editor, point the **Featured products** section at a collection
> (e.g. create a "Best Sellers" or "Shop All" collection containing your tees, crewneck,
> and hoodie). If left empty it falls back to *all products*.

## Structure
- `layout/theme.liquid` — base document, header/footer groups
- `templates/*.json` — homepage, product, collection, cart, search, blog, etc.
- `sections/` — hero, marquee, featured products, image-with-text, header, footer, main-* page sections
- `snippets/product-card.liquid` — reusable product card
- `assets/theme.css`, `assets/theme.js` — styling + interactions
- `config/settings_schema.json` — color & font theme settings (editable in Customize)

## Brand defaults
- Background `#0a0a0a` · Text `#f5f5f0` · Accent `#e8ff3a`
- Headlines pull from product copy: *Leap Of Faith*, *Create Your Legacy*, *Take The Risk*
