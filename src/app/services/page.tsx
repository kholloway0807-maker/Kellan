import type { Metadata } from "next";
import Link from "next/link";
import { Check } from "lucide-react";
import { CtaStrip } from "@/components/CtaStrip";

export const metadata: Metadata = {
  title: "Lawn Care Services & Pricing | Bloomington-Normal IL",
  description:
    "View all lawn care services and pricing from Kellan Holloway Lawncare. Mowing, edging, fertilization, aeration & more. Basic, Standard, and Premium packages for McLean County homeowners.",
};

const highlightStyles = {
  card: "border-gold bg-green text-cream shadow-xl scale-105",
  heading: "text-gold",
  price: "text-cream",
  desc: "text-cream/70",
  feature: "text-cream/80",
  featureIcon: "text-gold",
  cta: "bg-gold text-green hover:bg-gold-light",
};

const defaultStyles = {
  card: "border-cream-dark bg-white shadow-sm",
  heading: "text-green",
  price: "text-gray-800",
  desc: "text-gray-500",
  feature: "text-gray-700",
  featureIcon: "text-green",
  cta: "border-2 border-green text-green hover:bg-green hover:text-cream",
};

const packages = [
  {
    name: "Basic",
    price: "Starting at $45/visit",
    description: "Perfect for homeowners who want reliable, consistent mowing without the hassle.",
    features: [
      "Weekly or bi-weekly mowing",
      "Clippings blown off hardscapes",
      "Perimeter trim around obstacles",
      "Scheduling text reminders",
    ],
    highlight: false,
  },
  {
    name: "Standard",
    price: "Starting at $75/visit",
    description: "Our most popular package — everything in Basic plus edging and blowing for a polished look.",
    features: [
      "Everything in Basic",
      "Sidewalk & driveway edging",
      "Bed edging (1x/month)",
      "Gutter blow-off",
      "Priority scheduling",
    ],
    highlight: true,
  },
  {
    name: "Premium",
    price: "Custom quote",
    description: "The full treatment. Ideal for homeowners who want a perfect, showcase lawn all season.",
    features: [
      "Everything in Standard",
      "Weed control treatments",
      "Seasonal fertilization (4x/year)",
      "Spring aeration & overseeding",
      "Fall leaf cleanup (2 visits)",
      "Dedicated point of contact",
    ],
    highlight: false,
  },
];

const additionalServices = [
  { name: "Spring Cleanup", desc: "Debris removal, bed cleanup, and first mow of the season." },
  { name: "Fall Leaf Removal", desc: "Thorough leaf cleanup and haul-away before the first frost." },
  { name: "Core Aeration", desc: "Improves drainage, reduces compaction, promotes root growth." },
  { name: "Overseeding", desc: "Fills thin or bare spots for a lush, uniform lawn." },
  { name: "Weed Control", desc: "Pre- and post-emergent herbicide programs." },
  { name: "Fertilization Program", desc: "4-step seasonal fertilization tailored to Illinois soils." },
  { name: "Snow Removal", desc: "Residential driveway and walkway clearing. Seasonal contracts available." },
  { name: "Free Estimates", desc: "No commitment — we'll come out and give you a price with no pressure." },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient py-20" aria-labelledby="services-page-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">What We Offer</p>
          <h1 id="services-page-heading" className="text-4xl font-extrabold text-cream sm:text-5xl mb-4">
            Services &amp; Pricing
          </h1>
          <p className="text-cream/70 max-w-xl mx-auto text-lg">
            Honest pricing, no hidden fees. Every package includes a satisfaction guarantee.
          </p>
        </div>
      </section>

      {/* Pricing packages */}
      <section className="py-20 bg-cream" aria-labelledby="packages-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="packages-heading" className="sr-only">Service Packages</h2>
          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {packages.map((pkg) => {
              const s = pkg.highlight ? highlightStyles : defaultStyles;
              return (
                <div
                  key={pkg.name}
                  className={`relative rounded-2xl border p-8 flex flex-col ${s.card}`}
                >
                  {pkg.highlight && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gold px-4 py-1 text-xs font-bold text-green uppercase tracking-widest">
                      Most Popular
                    </span>
                  )}
                  <h3 className={`text-2xl font-extrabold mb-1 ${s.heading}`}>{pkg.name}</h3>
                  <p className={`text-lg font-semibold mb-3 ${s.price}`}>{pkg.price}</p>
                  <p className={`text-sm leading-relaxed mb-6 ${s.desc}`}>{pkg.description}</p>
                  <ul className="space-y-2 mb-8 flex-1" aria-label={`${pkg.name} package features`}>
                    {pkg.features.map((f) => (
                      <li key={f} className={`flex items-start gap-2 text-sm ${s.feature}`}>
                        <Check className={`h-5 w-5 flex-shrink-0 mt-0.5 ${s.featureIcon}`} aria-hidden="true" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link
                    href="/contact"
                    className={`block w-full rounded-lg py-3 text-center text-sm font-bold transition-colors ${s.cta}`}
                  >
                    Get a Quote
                  </Link>
                </div>
              );
            })}
          </div>
          <p className="text-center text-xs text-gray-500 mt-6">
            Prices vary based on lot size and condition. All quotes are free with no obligation.
          </p>
        </div>
      </section>

      {/* Additional services grid */}
      <section className="py-16 bg-cream-dark" aria-labelledby="additional-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <h2 id="additional-heading" className="text-2xl font-extrabold text-green mb-2">
              Additional &amp; Seasonal Services
            </h2>
            <p className="text-gray-600 text-sm">À la carte services available to all customers.</p>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {additionalServices.map((s) => (
              <div key={s.name} className="rounded-xl bg-white border border-cream-dark p-5 shadow-sm">
                <h3 className="font-bold text-green mb-1">{s.name}</h3>
                <p className="text-sm text-gray-600">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CtaStrip
        heading="Ready to get started?"
        body="Free estimates — no obligation. We respond within 24 hours."
      />
    </>
  );
}
