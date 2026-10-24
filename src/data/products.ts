// Drop 01 catalogue. Prices are fallbacks; live prices, stock and variant IDs
// come from Shopify by `handle` when the store is connected (see lib/shopify.ts).

export type Print = 'script' | 'crest';
export type Colorway = 'noir' | 'creme';

export interface Product {
  id: string;
  /** Shopify product handle (the URL slug of the product in your store). */
  handle: string;
  name: string;
  /** Menu-style course label used in the "Le Menu" section. */
  course: string;
  print: Print;
  colorway: Colorway;
  price: number;
  blurb: string;
}

export const PRODUCTS: Product[] = [
  {
    id: 'script-noir',
    handle: 'saint-clermont-script-noir-tee',
    name: 'Script Tee — Noir',
    course: 'Entrée',
    print: 'script',
    colorway: 'noir',
    price: 48,
    blurb: 'Distressed Saint. Clermont script across the chest. 280gsm heavyweight cotton, boxy cut.',
  },
  {
    id: 'crest-noir',
    handle: 'saint-clermont-crest-noir-tee',
    name: 'Crest Tee — Noir',
    course: 'Plat Principal',
    print: 'crest',
    colorway: 'noir',
    price: 48,
    blurb: 'The SC Dinner Club seal, printed large. Garment-dyed black, dropped shoulder.',
  },
  {
    id: 'script-creme',
    handle: 'saint-clermont-script-creme-tee',
    name: 'Script Tee — Crème',
    course: 'Fromage',
    print: 'script',
    colorway: 'creme',
    price: 48,
    blurb: 'Bone-cream ground, black script. Made for linen trousers and long lunches.',
  },
  {
    id: 'crest-creme',
    handle: 'saint-clermont-crest-creme-tee',
    name: 'Crest Tee — Crème',
    course: 'Dessert',
    print: 'crest',
    colorway: 'creme',
    price: 48,
    blurb: 'The seal in ink black on cream. Heavyweight, pre-shrunk, softened with every wash.',
  },
];

export const SIZES = ['S', 'M', 'L', 'XL', 'XXL'] as const;
export type Size = (typeof SIZES)[number];

export const asset = (path: string) => `${import.meta.env.BASE_URL}${path}`;
