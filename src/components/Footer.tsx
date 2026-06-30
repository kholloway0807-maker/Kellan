import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-green-dark text-cream">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand */}
          <div className="lg:col-span-2">
            <img src="/assets/logo.svg" alt="Kellan Holloway Lawncare" className="h-10 w-auto mb-3" />
            <p className="text-sm text-cream/70 max-w-xs leading-relaxed">
              Locally owned and operated lawn care serving Bloomington-Normal and all of McLean County, IL.
              Fully insured. Satisfaction guaranteed.
            </p>
            <a
              href="tel:+13095550100"
              className="mt-4 inline-block text-gold font-bold text-lg hover:text-gold-light transition-colors"
              aria-label="Call Kellan Holloway Lawncare"
            >
              (309) 555-0100
            </a>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">Pages</h3>
            <ul className="space-y-2 text-sm text-cream/80">
              {[
                { href: "/", label: "Home" },
                { href: "/services", label: "Services" },
                { href: "/about", label: "About Us" },
                { href: "/contact", label: "Contact" },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} className="hover:text-gold transition-colors">{label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service area */}
          <div>
            <h3 className="text-gold font-semibold text-sm uppercase tracking-widest mb-3">Service Area</h3>
            <ul className="space-y-1 text-sm text-cream/70">
              {["Bloomington", "Normal", "Chenoa", "LeRoy", "Heyworth", "Lexington", "Downs", "McLean County"].map((town) => (
                <li key={town}>{town}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-green-light/30 pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 text-xs text-cream/50">
          <p>© {new Date().getFullYear()} Kellan Holloway Lawncare. All rights reserved.</p>
          <p>Bloomington-Normal, IL · Fully Insured · Licensed</p>
        </div>
      </div>
    </footer>
  );
}
