// Product catalogue mirrored from the NOVA Shopify store (novaly.us).
// Images are the back-print designs cropped from the brand lookbook.

export interface Product {
  id: string;
  name: string;
  motif: string; // the design phrase
  price: string;
  coords: string;
  image: string;
  /** Live Shopify product page. */
  href: string;
  blurb: string;
}

const STORE = 'https://novaly.us/products';

export const PRODUCTS: Product[] = [
  {
    id: 'hoodie',
    name: 'Take The Risk Hoodie',
    motif: 'TAKE THE RISK',
    price: '$44',
    coords: '37.7335° N, 119.6376° W',
    image: `${import.meta.env.BASE_URL}products/hoodie.jpg`,
    href: `${STORE}/nova-take-the-risk-hoodie`,
    blurb: 'Garment-dyed lightweight fleece. 100% ring-spun cotton, worn-in from the first wear.',
  },
  {
    id: 'crewneck',
    name: 'Create Your Legacy Crewneck',
    motif: 'CREATE YOUR LEGACY',
    price: '$43',
    coords: '38.8927° N, -77.0230° W',
    image: `${import.meta.env.BASE_URL}products/crewneck.jpg`,
    href: `${STORE}/unisex-garment-dyed-sweatshirt`,
    blurb: 'Vintage-washed, relaxed fit. The soft, structured crewneck for every day.',
  },
  {
    id: 'tee',
    name: 'Leap Of Faith Tee',
    motif: 'LEAP OF FAITH',
    price: '$28',
    coords: '27.9881° N, 86.9250° E',
    image: `${import.meta.env.BASE_URL}products/tee.jpg`,
    href: `${STORE}/unisex-garment-dyed-heavyweight-t-shirt-1`,
    blurb: 'Heavyweight, structured, breathable. The tee that anchors the collection.',
  },
];
