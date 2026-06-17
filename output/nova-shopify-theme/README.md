# NOVA — Shopify Theme

A custom Shopify theme for **NOVA** (novaly.us), designed with the `ui-ux-pro-max` skill.

## Design System
- **Style:** Exaggerated Minimalism (oversized type, extreme negative space, pure black/white)
- **Fonts:** Anton (display) + Epilogue (body) — the "Gen Z Brutal" pairing for streetwear
- **Colors:** `#000000` background / `#FFFFFF` foreground / hairline rules
- **Landing pattern:** Feature-Rich Showcase (Hero → Marquee → Product grid → Values → CTA)

## How your products appear
The theme uses **live Liquid loops** — it does NOT hardcode products. On your store it
automatically pulls every product, image, price, and variant from your catalog:
- Homepage featured grid: `collections.all.products`
- Product pages: full image gallery + variant selectors
- Collection / search / cart: all dynamic

So your 3 current drops (Take The Risk Hoodie, Create Your Legacy Crewneck,
Leap Of Faith Tee) and any future products show up with zero edits.

## Install (Online Store → Themes)
1. In Shopify admin go to **Online Store → Themes**
2. Click **Add theme → Upload zip file**
3. Select `nova-shopify-theme.zip`
4. Click **Publish** (or **Customize** to preview first)

## Structure
```
layout/theme.liquid          Main shell (fonts, header, footer)
templates/                   index, product, collection, cart, search, 404, page, blog…
templates/customers/         login, register, account, order, addresses…
sections/                    header, footer
snippets/product-card.liquid Reusable product tile
assets/theme.css             Full design system
assets/theme.js              Variant selector + gallery + mobile nav
config/                      settings_schema.json, settings_data.json
locales/en.default.json      Strings
```

## Notes
- Theme has no hardcoded images, so it stays in sync with your store.
- To change the hero headline, edit `templates/index.liquid`.
- Free-shipping banner text lives in `templates/product.liquid` (`.pdp__meta`).
