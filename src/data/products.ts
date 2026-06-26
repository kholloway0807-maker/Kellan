// Product catalogue mirrored from the live NOVA Shopify store (novaly.us).
//
// Images point at the store's Shopify CDN, so they stay in sync with the
// catalogue and load straight from Shopify's edge for visitors. Each colour
// carries its real per-size variant IDs, which power one-tap Shopify checkout
// permalinks (`/cart/<variantId>:<qty>`) — so a click here lands in the real
// NOVA cart with the exact size/colour pre-loaded. No backend required.

const CDN =
  'https://cdn.shopify.com/s/files/1/0801/0950/2487/files';

const STORE = 'https://novaly.us/products';

/** Shopify cart permalink — adds the variant and drops the visitor at checkout. */
export const checkoutUrl = (variantId: string, qty = 1) =>
  `https://novaly.us/cart/${variantId}:${qty}`;

export interface SizeOption {
  size: string;
  variantId: string;
}

export interface ColorOption {
  /** Display name, e.g. "True Navy". */
  name: string;
  /** Swatch fill (approximate garment-dyed colour). */
  swatch: string;
  /** Front-of-garment hero shot. */
  front: string;
  /** Back-print shot (where the NOVA motif lives). */
  back: string;
  /** "From" price for this colourway, in USD. */
  price: number;
  sizes: SizeOption[];
}

export interface Product {
  id: string;
  name: string;
  /** The design phrase printed on the back. */
  motif: string;
  /** Coordinates that anchor the piece's story. */
  coords: string;
  /** Short hook shown under the title. */
  blurb: string;
  /** Spec line for the detail rail. */
  detail: string;
  /** Live Shopify product page (full gallery + reviews). */
  href: string;
  colors: ColorOption[];
}

const SIZES_TEE = ['S', 'M', 'L', 'XL', '2XL'];
const SIZES_FULL = ['S', 'M', 'L', 'XL', '2XL', '3XL'];

const tee = (ids: string[]): SizeOption[] =>
  SIZES_TEE.map((size, i) => ({ size, variantId: ids[i] }));
const full = (ids: string[]): SizeOption[] =>
  SIZES_FULL.map((size, i) => ({ size, variantId: ids[i] }));

export const PRODUCTS: Product[] = [
  {
    id: 'hoodie',
    name: 'Take The Risk Hoodie',
    motif: 'TAKE THE RISK',
    coords: '37.7335° N, 119.6376° W',
    blurb: 'The flagship. Garment-dyed lightweight fleece that wears in from day one.',
    detail: '100% ring-spun cotton · 6.4 oz · OEKO-TEX certified',
    href: `${STORE}/nova-take-the-risk-hoodie`,
    colors: [
      {
        name: 'Black',
        swatch: '#1c1c1e',
        front: `${CDN}/unisex-garment-dyed-lightweight-fleece-hooded-sweatshirt-i-comfort-colors-1467-black-front-6a230822dd435.jpg?v=1780680791`,
        back: `${CDN}/unisex-garment-dyed-lightweight-fleece-hooded-sweatshirt-i-comfort-colors-1467-black-back-6a230822dff49.jpg?v=1780680791`,
        price: 46,
        sizes: full([
          '45193287401495', '45193287434263', '45193287467031',
          '45193287499799', '45193287532567', '45193287565335',
        ]),
      },
      {
        name: 'Pepper',
        swatch: '#8a8178',
        front: `${CDN}/unisex-garment-dyed-lightweight-fleece-hooded-sweatshirt-i-comfort-colors-1467-pepper-front-6a230822df1bc.jpg?v=1780680791`,
        back: `${CDN}/unisex-garment-dyed-lightweight-fleece-hooded-sweatshirt-i-comfort-colors-1467-pepper-back-6a230822e00de.jpg?v=1780680791`,
        price: 44,
        sizes: full([
          '45193287598103', '45193287630871', '45193287663639',
          '45193287696407', '45193287729175', '45193287761943',
        ]),
      },
      {
        name: 'Grey',
        swatch: '#9a9b97',
        front: `${CDN}/unisex-garment-dyed-lightweight-fleece-hooded-sweatshirt-i-comfort-colors-1467-grey-front-6a230822df13b.jpg?v=1780680791`,
        back: `${CDN}/unisex-garment-dyed-lightweight-fleece-hooded-sweatshirt-i-comfort-colors-1467-grey-back-6a230822e006d.jpg?v=1780680791`,
        price: 44,
        sizes: full([
          '45193287794711', '45193287827479', '45193287860247',
          '45193287893015', '45193287925783', '45193287958551',
        ]),
      },
      {
        name: 'Blue Jean',
        swatch: '#6f829c',
        front: `${CDN}/unisex-garment-dyed-lightweight-fleece-hooded-sweatshirt-i-comfort-colors-1467-blue-jean-front-6a230822df091.jpg?v=1780680791`,
        back: `${CDN}/unisex-garment-dyed-lightweight-fleece-hooded-sweatshirt-i-comfort-colors-1467-blue-jean-back-6a230822dfff7.jpg?v=1780680791`,
        price: 44,
        sizes: full([
          '45193287991319', '45193288024087', '45193288056855',
          '45193288089623', '45193288122391', '45193288155159',
        ]),
      },
    ],
  },
  {
    id: 'crewneck',
    name: 'Create Your Legacy Crewneck',
    motif: 'CREATE YOUR LEGACY',
    coords: '38.8927° N, 77.0230° W',
    blurb: 'Heavyweight 9.5 oz fleece, vintage-washed. The soft, structured everyday.',
    detail: '80% cotton / 20% poly · 9.5 oz · garment-dyed',
    href: `${STORE}/unisex-garment-dyed-sweatshirt`,
    colors: [
      {
        name: 'True Navy',
        swatch: '#2c3142',
        front: `${CDN}/unisex-garment-dyed-sweatshirt-true-navy-front-6a2306ebbe690.jpg?v=1780680450`,
        back: `${CDN}/unisex-garment-dyed-sweatshirt-true-navy-back-6a2306ebbf7bb.jpg?v=1780680451`,
        price: 43,
        sizes: full([
          '45193252110359', '45193252143127', '45193252175895',
          '45193252208663', '45193252241431', '45193252274199',
        ]),
      },
      {
        name: 'Pepper',
        swatch: '#8a8178',
        front: `${CDN}/unisex-garment-dyed-sweatshirt-pepper-front-6a2306ebbe5ed.jpg?v=1780680451`,
        back: `${CDN}/unisex-garment-dyed-sweatshirt-pepper-back-6a2306ebbf722.jpg?v=1780680451`,
        price: 43,
        sizes: full([
          '45193252306967', '45193252339735', '45193252372503',
          '45193252405271', '45193252438039', '45193252470807',
        ]),
      },
      {
        name: 'Blue Jean',
        swatch: '#6f829c',
        front: `${CDN}/unisex-garment-dyed-sweatshirt-blue-jean-front-6a2306ebbd885.jpg?v=1780680450`,
        back: `${CDN}/unisex-garment-dyed-sweatshirt-blue-jean-back-6a2306ebbf5c8.jpg?v=1780680450`,
        price: 43,
        sizes: full([
          '45193252503575', '45193252536343', '45193252569111',
          '45193252601879', '45193252634647', '45193252667415',
        ]),
      },
      {
        name: 'Grey',
        swatch: '#9a9b97',
        front: `${CDN}/unisex-garment-dyed-sweatshirt-grey-front-6a2306ebbe4aa.jpg?v=1780680451`,
        back: `${CDN}/unisex-garment-dyed-sweatshirt-grey-back-6a2306ebbf694.jpg?v=1780680451`,
        price: 43,
        sizes: full([
          '45193252700183', '45193252732951', '45193252765719',
          '45193252798487', '45193252831255', '45193252864023',
        ]),
      },
    ],
  },
  {
    id: 'tee',
    name: 'Leap Of Faith Tee',
    motif: 'LEAP OF FAITH',
    coords: '27.9881° N, 86.9250° E',
    blurb: 'Thick, structured, breathable. The heavyweight tee that anchors the line.',
    detail: '100% ring-spun cotton · 6.1 oz · relaxed fit',
    href: `${STORE}/unisex-garment-dyed-heavyweight-t-shirt-1`,
    colors: [
      {
        name: 'Black',
        swatch: '#1c1c1e',
        front: `${CDN}/unisex-garment-dyed-heavyweight-t-shirt-black-front-6a2304ca53b22.jpg?v=1780679900`,
        back: `${CDN}/unisex-garment-dyed-heavyweight-t-shirt-black-back-6a2304ca556f5.jpg?v=1780679899`,
        price: 28,
        sizes: tee([
          '45193241067543', '45193241100311', '45193241133079',
          '45193241165847', '45193241198615',
        ]),
      },
      {
        name: 'Navy',
        swatch: '#2c3142',
        front: `${CDN}/unisex-garment-dyed-heavyweight-t-shirt-navy-front-6a2304ca54838.jpg?v=1780679900`,
        back: `${CDN}/unisex-garment-dyed-heavyweight-t-shirt-navy-back-6a2304ca5588c.jpg?v=1780679900`,
        price: 28,
        sizes: tee([
          '45193241231383', '45193241264151', '45193241296919',
          '45193241329687', '45193241362455',
        ]),
      },
      {
        name: 'Grey',
        swatch: '#9a9b97',
        front: `${CDN}/unisex-garment-dyed-heavyweight-t-shirt-grey-front-6a2304ca54701.jpg?v=1780679900`,
        back: `${CDN}/unisex-garment-dyed-heavyweight-t-shirt-grey-back-6a2304ca557f0.jpg?v=1780679900`,
        price: 28,
        sizes: tee([
          '45193241395223', '45193241427991', '45193241460759',
          '45193241493527', '45193241526295',
        ]),
      },
    ],
  },
];
