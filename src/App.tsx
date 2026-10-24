import { CartProvider } from './components/Cart';
import { CartDrawer } from './components/CartDrawer';
import { Navbar } from './components/Navbar';
import { Hero } from './sections/Hero';
import { Marquee } from './sections/Marquee';
import { Collection } from './sections/Collection';
import { Maison } from './sections/Maison';
import { Menu } from './sections/Menu';
import { Club, Footer } from './sections/Club';
import { useLenis } from './hooks/useLenis';
import { useReducedMotion } from './hooks/useReducedMotion';

export default function App() {
  const reduced = useReducedMotion();
  // Smooth scroll only when motion is allowed; native scroll otherwise.
  useLenis(!reduced);

  return (
    <CartProvider>
      <div className="grain relative min-h-screen bg-sc-black">
        <Navbar />
        <main>
          <Hero />
          <Marquee />
          <Collection />
          <Maison />
          <Menu />
          <Club />
        </main>
        <Footer />
        <CartDrawer />
      </div>
    </CartProvider>
  );
}
