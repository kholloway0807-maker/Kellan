import type { Metadata } from "next";
import Link from "next/link";
import { ServiceCard } from "@/components/ServiceCard";
import { TestimonialCard } from "@/components/TestimonialCard";
import { ContactForm } from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Lawn Care Bloomington-Normal IL | Kellan Holloway Lawncare",
  description:
    "Kellan Holloway Lawncare — Bloomington-Normal's trusted local lawn care crew. Mowing, edging, fertilization, aeration & more. Free estimates. Fully insured.",
};

const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Kellan Holloway Lawncare",
  description:
    "Professional lawn care services in Bloomington-Normal, IL. Serving McLean County with mowing, edging, fertilization, aeration, leaf cleanup and snow removal.",
  url: "https://kellanlawncare.com",
  telephone: "+13095550100",
  email: "kellan@kellanlawncare.com",
  address: {
    "@type": "PostalAddress",
    addressLocality: "Bloomington",
    addressRegion: "IL",
    postalCode: "61701",
    addressCountry: "US",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: 40.4842,
    longitude: -88.9937,
  },
  areaServed: [
    { "@type": "City", name: "Bloomington" },
    { "@type": "City", name: "Normal" },
    { "@type": "City", name: "Chenoa" },
    { "@type": "City", name: "LeRoy" },
    { "@type": "City", name: "Heyworth" },
    { "@type": "City", name: "Lexington" },
    { "@type": "AdministrativeArea", name: "McLean County" },
  ],
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "07:00",
      closes: "18:00",
    },
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: "Saturday",
      opens: "08:00",
      closes: "14:00",
    },
  ],
  priceRange: "$$",
  image: "https://kellanlawncare.com/assets/logo.svg",
  sameAs: [],
};

const services = [
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
      </svg>
    ),
    title: "Lawn Mowing",
    description: "Weekly or bi-weekly mowing with precise cuts, leaving your lawn neat and healthy all season long.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
      </svg>
    ),
    title: "Edging",
    description: "Crisp, clean borders along sidewalks, driveways, and garden beds for that professional finish.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
    ),
    title: "Weed Control",
    description: "Targeted pre- and post-emergent treatments to keep dandelions, crabgrass, and weeds at bay.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: "Fertilization",
    description: "Seasonal fertilization programs tuned to central Illinois soil conditions for thick, green turf.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
      </svg>
    ),
    title: "Aeration & Overseeding",
    description: "Core aeration breaks up compaction, and overseeding fills in thin spots for a lush, full lawn.",
  },
  {
    icon: (
      <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
      </svg>
    ),
    title: "Leaf Cleanup & Snow Removal",
    description: "Fall leaf cleanup and winter snow removal keep your property safe and tidy year-round.",
  },
];

const trustItems = [
  {
    icon: "🏠",
    title: "Locally Owned",
    body: "Born and raised in Bloomington-Normal. This is our community too, and we treat every lawn like it's our own.",
  },
  {
    icon: "🛡️",
    title: "Fully Insured",
    body: "Fully insured for your peace of mind. If anything ever goes wrong, you're covered — period.",
  },
  {
    icon: "📅",
    title: "Reliable Schedule",
    body: "We show up when we say we will, every time. No last-minute cancellations without notice.",
  },
  {
    icon: "✅",
    title: "Satisfaction Guarantee",
    body: "Not happy with the cut? We'll come back and make it right — no questions asked.",
  },
];

const testimonials = [
  {
    quote:
      "Kellan has been mowing our yard all summer and it looks better than ever. He's punctual, professional, and does great work. Highly recommend to anyone in Normal!",
    name: "Sandra H.",
    location: "Normal, IL",
  },
  {
    quote:
      "Got a free estimate within 24 hours and they started the following week. The edging they do is incredible — our neighbors keep asking who does our lawn.",
    name: "Mike T.",
    location: "Bloomington, IL",
  },
  {
    quote:
      "Used Kellan for our fall aeration and overseeding. This spring the lawn came in thicker than it's ever been. Worth every penny.",
    name: "Jennifer P.",
    location: "Heyworth, IL",
  },
];

const serviceAreaTowns = [
  "Bloomington", "Normal", "Chenoa", "LeRoy", "Heyworth",
  "Lexington", "Downs", "Hudson", "Towanda", "Gridley",
];

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />

      {/* ── HERO ── */}
      <section
        className="relative flex min-h-[90svh] items-center bg-hero-gradient"
        aria-labelledby="hero-heading"
      >
        {/* Subtle grass texture overlay */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(201,168,76,0.15) 2px, rgba(201,168,76,0.15) 3px)",
          }}
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:py-32">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <p className="mb-4 inline-block rounded-full border border-gold/40 bg-gold/10 px-4 py-1 text-xs font-semibold uppercase tracking-widest text-gold">
              Bloomington-Normal, IL · McLean County
            </p>
            <h1 id="hero-heading" className="mb-6 text-4xl font-extrabold leading-tight text-cream sm:text-5xl lg:text-6xl">
              Your Lawn, Done Right —<br />
              <span className="text-gold">Bloomington-Normal&apos;s</span> Trusted Crew
            </h1>
            <p className="mb-8 text-lg text-cream/80 leading-relaxed max-w-xl">
              Locally owned, fully insured lawn care you can count on. Weekly mowing, edging, fertilization, aeration, and more — done by a real neighbor who takes pride in your yard.
            </p>
            {/* Dual CTA */}
            <div className="flex flex-wrap gap-4 items-center">
              <a
                href="#contact"
                className="rounded-lg bg-gold px-8 py-4 text-lg font-bold text-green hover:bg-gold-light transition-colors shadow-lg"
              >
                Get a Free Estimate
              </a>
              <a
                href="tel:+13095550100"
                className="flex items-center gap-2 rounded-lg border-2 border-cream/40 px-6 py-4 text-lg font-semibold text-cream hover:border-gold hover:text-gold transition-colors"
                aria-label="Call us at 309-555-0100"
              >
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                (309) 555-0100
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── TRUST BAR ── */}
      <div className="bg-gold py-4" aria-label="Trust highlights">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <ul className="flex flex-wrap justify-center gap-x-8 gap-y-2 text-sm font-semibold text-green">
            <li className="flex items-center gap-2"><span aria-hidden="true">✓</span> Locally Owned &amp; Operated</li>
            <li className="flex items-center gap-2"><span aria-hidden="true">✓</span> Fully Insured</li>
            <li className="flex items-center gap-2"><span aria-hidden="true">✓</span> Free Estimates</li>
            <li className="flex items-center gap-2"><span aria-hidden="true">✓</span> Satisfaction Guaranteed</li>
            <li className="flex items-center gap-2"><span aria-hidden="true">✓</span> Serving McLean County</li>
          </ul>
        </div>
      </div>

      {/* ── SERVICES ── */}
      <section className="py-20 bg-cream" aria-labelledby="services-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-2">What We Do</p>
            <h2 id="services-heading" className="text-3xl font-extrabold text-green sm:text-4xl">
              Full-Service Lawn Care
            </h2>
            <p className="mt-3 text-gray-600 max-w-xl mx-auto">
              From the first mow of spring to the last leaf of fall, we&apos;ve got every inch of your lawn covered.
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => (
              <ServiceCard key={s.title} icon={s.icon} title={s.title} description={s.description} />
            ))}
          </div>
          <div className="mt-10 text-center">
            <Link
              href="/services"
              className="inline-block rounded-lg border-2 border-green px-6 py-3 text-sm font-bold text-green hover:bg-green hover:text-cream transition-colors"
            >
              See Pricing &amp; Packages →
            </Link>
          </div>
        </div>
      </section>

      {/* ── WHY KELLAN ── */}
      <section className="py-20 bg-green" aria-labelledby="why-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-2">Why Choose Us</p>
            <h2 id="why-heading" className="text-3xl font-extrabold text-cream sm:text-4xl">
              Why Kellan?
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item) => (
              <div key={item.title} className="rounded-xl bg-green-dark p-6 text-center">
                <div className="text-4xl mb-3" aria-hidden="true">{item.icon}</div>
                <h3 className="text-lg font-bold text-gold mb-2">{item.title}</h3>
                <p className="text-sm text-cream/70 leading-relaxed">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-cream-dark" aria-labelledby="testimonials-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="mb-12 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-2">Happy Customers</p>
            <h2 id="testimonials-heading" className="text-3xl font-extrabold text-green sm:text-4xl">
              What McLean County Homeowners Say
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((t) => (
              <TestimonialCard key={t.name} quote={t.quote} name={t.name} location={t.location} />
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICE AREA ── */}
      <section className="py-16 bg-cream" aria-labelledby="area-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-col lg:flex-row items-start gap-12">
            <div className="lg:w-1/2">
              <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-2">Where We Work</p>
              <h2 id="area-heading" className="text-3xl font-extrabold text-green mb-4 sm:text-4xl">
                Proudly Serving McLean County
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                We serve the entire Bloomington-Normal metro area and surrounding McLean County communities. Not sure if you&apos;re in our service area? Give us a call — we&apos;ll figure it out.
              </p>
              <a href="tel:+13095550100" className="text-green font-bold hover:text-gold transition-colors">
                (309) 555-0100
              </a>
            </div>
            <div className="lg:w-1/2">
              <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3" aria-label="Towns we service">
                {serviceAreaTowns.map((town) => (
                  <li key={town} className="flex items-center gap-2 text-sm text-gray-700">
                    <span className="h-2 w-2 rounded-full bg-gold flex-shrink-0" aria-hidden="true" />
                    {town}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs text-gray-500 italic">
                + surrounding McLean County communities
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT / QUOTE FORM ── */}
      <section id="contact" className="py-20 bg-green-dark" aria-labelledby="contact-heading">
        <div className="mx-auto max-w-4xl px-4 sm:px-6">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-2">Get Started</p>
            <h2 id="contact-heading" className="text-3xl font-extrabold text-cream sm:text-4xl">
              Get Your Free Estimate
            </h2>
            <p className="mt-3 text-cream/70 max-w-md mx-auto">
              No commitment. No pressure. Just tell us about your lawn and we&apos;ll reach out within 24 hours.
            </p>
          </div>
          <div className="rounded-2xl bg-cream p-6 sm:p-10 shadow-xl">
            <ContactForm />
          </div>
        </div>
      </section>
    </>
  );
}
