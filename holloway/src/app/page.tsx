import Image from "next/image";
import {
  ArrowUpRight,
  ChartLineUp,
  CursorClick,
  MapPin,
  Monitor,
  Plus,
} from "@phosphor-icons/react/dist/ssr";

import { SiteNav } from "@/components/site-nav";
import { ClientLogos } from "@/components/client-logos";
import { AuditForm } from "@/components/audit-form";
import { Reveal } from "@/components/reveal";

/*
  HOLLOWAY MARKETING - single landing page.

  Design read: agency landing for non-design-native SMB owners deciding
  whether to hand over their ad budget. Confident, plainspoken, proof-led.
  Deliberately NOT the Awwwards-agency register, because this audience reads
  experimental design as "they will spend my money on themselves."

  Dials: DESIGN_VARIANCE 7 / MOTION_INTENSITY 5 / VISUAL_DENSITY 5

  Layout families, one use each:
    hero            asymmetric split
    logos           inline logo strip
    results         asymmetric stat band
    services        bento grid (4 cells)
    case study      full bleed media with offset copy
    process         sticky pane plus scrolling list
    pricing         two plan comparison plus full width custom row
    testimonials    horizontal scroll snap
    faq             accordion
    contact         copy plus form
    footer          link columns

  Photography is placeholder (picsum seeds), art directed monochrome so the
  image set reads as one system against the single blue accent.
*/

const SHELL = "mx-auto w-full max-w-[1400px] px-5 md:px-8";

const photo = (seed: string, w: number, h: number) =>
  `https://picsum.photos/seed/${seed}/${w}/${h}?grayscale`;

const btnPrimary =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full bg-accent px-6 py-3.5 text-[15px] font-medium text-accent-ink transition-transform duration-200 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]";

const btnSecondary =
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border border-line bg-raised px-6 py-3.5 text-[15px] font-medium text-ink transition-transform duration-200 hover:-translate-y-[1px] active:translate-y-0 active:scale-[0.98]";

/* ------------------------------------------------------------------ hero */

function Hero() {
  return (
    <section id="top" className="border-b border-line">
      {/* content-height hero, so the headline sits directly under the nav
          rather than floating to the middle of the viewport */}
      <div
        className={`${SHELL} grid items-start gap-12 pt-14 pb-20 md:pt-20 lg:grid-cols-12 lg:gap-16 lg:pt-24 lg:pb-28`}
      >
        <div className="lg:col-span-7">
          <Reveal>
            <h1 className="max-w-[13ch] text-4xl font-semibold leading-[1.05] tracking-tighter text-ink md:text-5xl lg:text-6xl">
              Your ads should pay for themselves.
            </h1>
          </Reveal>

          <Reveal delay={0.08}>
            <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-muted md:text-[19px]">
              We run the ads and build the site that turns the clicks into
              booked jobs.
            </p>
          </Reveal>

          <Reveal delay={0.16}>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a href="#contact" className={btnPrimary}>
                Get a free audit
              </a>
              <a href="#pricing" className={btnSecondary}>
                See pricing
              </a>
            </div>
          </Reveal>
        </div>

        {/* offset asset, variance 7. collapses above the fold copy on mobile */}
        <Reveal delay={0.1} className="lg:col-span-5 lg:translate-y-6">
          <div className="relative aspect-[4/5] w-full overflow-hidden rounded-card border border-line bg-sunken">
            <Image
              src={photo("holloway-owner-workshop", 1000, 1250)}
              alt="Owner of a local trades business at work"
              fill
              priority
              unoptimized
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------- logo wall */

function LogoWall() {
  return (
    <section className="border-b border-line py-12">
      <div className={SHELL}>
        <p className="mb-8 text-[14px] text-muted">
          Trusted by
        </p>
        <Reveal>
          <ClientLogos />
        </Reveal>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- results */

/* mock: illustrative figures. Replace with reported account data before launch. */
const SUPPORTING_STATS = [
  { value: "41%", label: "lower cost per lead after the first quarter" },
  { value: "19", label: "local businesses on retainer right now" },
  { value: "11 days", label: "median time from kickoff to first live campaign" },
];

function Results() {
  return (
    <section id="results" className="border-b border-line py-20 md:py-28">
      <div className={`${SHELL} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
        <Reveal className="lg:col-span-5">
          <p className="font-mono text-[64px] font-medium leading-none tracking-tighter text-accent md:text-[88px]">
            {/* mock */}3.8x
          </p>
          <h2 className="mt-6 max-w-[18ch] text-2xl font-semibold leading-tight tracking-tight text-ink md:text-3xl">
            Median return on ad spend across the accounts we manage.
          </h2>
          <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted">
            Measured on tracked revenue, not on impressions or clicks. If an
            account is not clearing its own cost, we say so on the monthly call.
          </p>
        </Reveal>

        <div className="lg:col-span-6 lg:col-start-7">
          <dl className="divide-y divide-line border-t border-line">
            {SUPPORTING_STATS.map((s, i) => (
              <Reveal key={s.value} delay={i * 0.07}>
                <div className="flex items-baseline gap-6 py-7">
                  <dt className="font-mono text-[30px] font-medium leading-none tracking-tight text-ink md:text-[36px]">
                    {/* mock */}
                    {s.value}
                  </dt>
                  <dd className="max-w-[34ch] text-[15px] leading-relaxed text-muted">
                    {s.label}
                  </dd>
                </div>
              </Reveal>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}

/* -------------------------------------------------------------- services */

function Services() {
  return (
    <section id="services" className="border-b border-line py-20 md:py-28">
      <div className={SHELL}>
        <Reveal>
          <h2 className="max-w-[20ch] text-3xl font-semibold leading-tight tracking-tighter text-ink md:text-4xl lg:text-5xl">
            Four things, done properly.
          </h2>
          <p className="mt-5 max-w-[58ch] text-[16px] leading-relaxed text-muted">
            We do not sell strategy decks. Every line below is work that shows
            up in your account or on your site.
          </p>
        </Reveal>

        {/* bento: 4 items, 4 cells, 2+1 then 1+2. No empty cells. */}
        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          <Reveal className="lg:col-span-2">
            <article className="relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-card border border-line p-7">
              <Image
                src={photo("holloway-campaign-desk", 1200, 800)}
                alt="Campaign performance being reviewed on a laptop"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              {/* two layer scrim: the flat floor guarantees WCAG AA for the
                  white text even if the replacement photo is bright, the
                  gradient keeps the top of the tile readable as an image */}
              <div className="absolute inset-0 bg-black/55" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/65 to-transparent" />
              <div className="relative" data-on-media>
                <CursorClick size={22} weight="regular" className="mb-4 text-white" />
                <h3 className="text-[21px] font-semibold tracking-tight text-white">
                  Google and Meta ads
                </h3>
                <p className="mt-2 max-w-[44ch] text-[15px] leading-relaxed text-white/80">
                  Build, run, and cut campaigns weekly. You keep ownership of
                  the ad accounts, always.
                </p>
              </div>
            </article>
          </Reveal>

          <Reveal delay={0.06}>
            <article className="flex h-full min-h-[300px] flex-col justify-end rounded-card border border-line bg-raised p-7">
              <Monitor size={22} weight="regular" className="mb-4 text-accent" />
              <h3 className="text-[21px] font-semibold tracking-tight text-ink">
                Sites that book work
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Fast, plain, and built around the one thing you want a visitor
                to do.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.12}>
            <article className="flex h-full min-h-[300px] flex-col justify-end rounded-card border border-line bg-accent-soft p-7">
              <MapPin size={22} weight="regular" className="mb-4 text-accent" />
              <h3 className="text-[21px] font-semibold tracking-tight text-ink">
                Local search
              </h3>
              <p className="mt-2 text-[15px] leading-relaxed text-muted">
                Google Business Profile, service area pages, and the review flow
                that keeps them coming.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.18} className="lg:col-span-2">
            <article className="relative flex h-full min-h-[300px] flex-col justify-end overflow-hidden rounded-card border border-line p-7">
              <Image
                src={photo("holloway-reporting-table", 1200, 800)}
                alt="Monthly reporting laid out on a table"
                fill
                unoptimized
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover"
              />
              {/* two layer scrim: the flat floor guarantees WCAG AA for the
                  white text even if the replacement photo is bright, the
                  gradient keeps the top of the tile readable as an image */}
              <div className="absolute inset-0 bg-black/55" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/65 to-transparent" />
              <div className="relative" data-on-media>
                <ChartLineUp size={22} weight="regular" className="mb-4 text-white" />
                <h3 className="text-[21px] font-semibold tracking-tight text-white">
                  Tracking and reporting
                </h3>
                <p className="mt-2 max-w-[44ch] text-[15px] leading-relaxed text-white/80">
                  Calls, forms, and booked jobs tied back to the ad that caused
                  them. One page, once a month.
                </p>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------ case study */

function CaseStudy() {
  return (
    <section className="border-b border-line py-20 md:py-28">
      <div className={SHELL}>
        <Reveal>
          <div className="relative aspect-[21/9] w-full overflow-hidden rounded-card border border-line bg-sunken">
            <Image
              src={photo("holloway-reyes-plumbing-van", 1800, 780)}
              alt="Service van outside a customer property"
              fill
              unoptimized
              sizes="100vw"
              className="object-cover"
            />
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-12">
          <Reveal className="lg:col-span-7 lg:col-start-4">
            <h2 className="max-w-[24ch] text-2xl font-semibold leading-tight tracking-tight text-ink md:text-4xl">
              Reyes &amp; Daughters went from six calls a week to thirty one.
            </h2>
            <p className="mt-5 max-w-[62ch] text-[16px] leading-relaxed text-muted">
              They had a site nobody could book through and a campaign paying
              for clicks from three counties away. We rebuilt the booking page,
              tightened the radius to twelve miles, and put call tracking on
              every line. The budget did not change.
            </p>
            <a
              href="#contact"
              className="mt-7 inline-flex items-center gap-1.5 text-[15px] font-medium text-accent transition-transform duration-200 hover:translate-x-[2px]"
            >
              Get a free audit
              <ArrowUpRight size={17} weight="regular" />
            </a>
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- process */

const PROCESS = [
  {
    title: "Audit",
    body: "We go through your ad account, your site, and your Google listing, then send a written list of what is losing money. Free, and yours whether or not you hire us.",
  },
  {
    title: "Rebuild",
    body: "Landing pages, tracking, and campaign structure get fixed before a single new dollar goes out the door. Usually two weeks.",
  },
  {
    title: "Launch",
    body: "Campaigns go live in stages so we can tell which change did what. You get a login to everything on day one.",
  },
  {
    title: "Report",
    body: "One page every month: spend, leads, booked jobs, and what we are changing next. Plus a call if you want one.",
  },
];

function Process() {
  return (
    <section className="border-b border-line py-20 md:py-28">
      <div className={`${SHELL} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-[100px]">
            <Reveal>
              <h2 className="max-w-[16ch] text-3xl font-semibold leading-tight tracking-tighter text-ink md:text-4xl lg:text-5xl">
                How the first ninety days go.
              </h2>
              <p className="mt-5 max-w-[42ch] text-[16px] leading-relaxed text-muted">
                No lock in at any point. If you leave, the accounts and the site
                go with you.
              </p>
            </Reveal>
          </div>
        </div>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="divide-y divide-line border-t border-line">
            {PROCESS.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="py-8">
                  <h3 className="text-[22px] font-semibold tracking-tight text-ink">
                    {p.title}
                  </h3>
                  <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-muted">
                    {p.body}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- pricing */

/* mock: replace with the real rate card before launch. */
const PLANS = [
  {
    name: "Ads management",
    price: "$1,450",
    cadence: "a month",
    summary: "For businesses with a site that already works.",
    features: [
      "Google and Meta campaigns",
      "Weekly optimisation",
      "Call and form tracking",
      "Monthly one page report",
    ],
    featured: false,
  },
  {
    name: "Ads and website",
    price: "$2,300",
    cadence: "a month",
    summary: "For businesses whose site is the bottleneck.",
    features: [
      "Everything in ads management",
      "New site built and hosted",
      "Local search and Google Business Profile",
      "Unlimited page edits",
    ],
    featured: true,
  },
];

function Pricing() {
  return (
    <section id="pricing" className="border-b border-line py-20 md:py-28">
      <div className={SHELL}>
        <Reveal>
          <h2 className="max-w-[22ch] text-3xl font-semibold leading-tight tracking-tighter text-ink md:text-4xl lg:text-5xl">
            Flat monthly fee. No percentage of your spend.
          </h2>
        </Reveal>

        <div className="mt-12 grid gap-4 lg:grid-cols-2">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 0.08}>
              <article
                className={`flex h-full flex-col rounded-card border p-7 md:p-9 ${
                  plan.featured
                    ? "border-accent bg-accent-soft"
                    : "border-line bg-raised"
                }`}
              >
                <h3 className="text-[15px] font-medium text-muted">{plan.name}</h3>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="font-mono text-[44px] font-medium leading-none tracking-tighter text-ink">
                    {plan.price}
                  </span>
                  <span className="text-[15px] text-muted">{plan.cadence}</span>
                </p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted">
                  {plan.summary}
                </p>

                <ul className="mt-7 flex-1 space-y-3.5 border-t border-line pt-7">
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      className="flex items-start gap-2.5 text-[15px] leading-relaxed text-ink"
                    >
                      <Plus
                        size={15}
                        weight="regular"
                        className="mt-1.5 shrink-0 text-accent"
                      />
                      {f}
                    </li>
                  ))}
                </ul>

                <a
                  href="#contact"
                  className={`mt-8 w-full ${plan.featured ? btnPrimary : btnSecondary}`}
                >
                  Get a free audit
                </a>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.1}>
          <div className="mt-4 flex flex-col items-start justify-between gap-5 rounded-card border border-line bg-raised p-7 md:flex-row md:items-center md:p-9">
            <div>
              <h3 className="text-[19px] font-semibold tracking-tight text-ink">
                Multiple locations, or a build with no retainer
              </h3>
              <p className="mt-2 max-w-[64ch] text-[15px] leading-relaxed text-muted">
                Both are fine. Tell us the shape of it and we will quote the
                work, not the hours.
              </p>
            </div>
            <a
              href="#contact"
              className="shrink-0 text-[15px] font-medium text-accent"
            >
              Get a free audit
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------- testimonials */

const QUOTES = [
  {
    quote:
      "They cut our radius to twelve miles and the phone started ringing with people who actually live here.",
    name: "Marisol Ocampo",
    role: "Owner, Reyes & Daughters Plumbing",
    seed: "holloway-quote-marisol",
  },
  {
    quote:
      "First agency that showed me booked appointments instead of impressions. I could finally tell if it was working.",
    name: "Devinder Kaur",
    role: "Managing partner, Halvorsen Dental",
    seed: "holloway-quote-devinder",
  },
  {
    quote:
      "We kept the same budget as last year and did about a third more work off it.",
    name: "Tomas Beckley",
    role: "Owner, Ironbark Roofing",
    seed: "holloway-quote-tomas",
  },
];

function Testimonials() {
  return (
    <section className="border-b border-line py-20 md:py-28">
      <div className={SHELL}>
        <Reveal>
          <h2 className="max-w-[20ch] text-3xl font-semibold leading-tight tracking-tighter text-ink md:text-4xl">
            What the owners say.
          </h2>
        </Reveal>
      </div>

      {/* horizontal scroll snap, so breadth does not turn into a wall of cards */}
      <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:px-8 [scrollbar-width:thin]">
        {QUOTES.map((q, i) => (
          <Reveal
            key={q.name}
            delay={i * 0.07}
            className="w-[300px] shrink-0 snap-start sm:w-[400px]"
          >
            <figure className="flex h-full flex-col justify-between rounded-card border border-line bg-raised p-7">
              <blockquote className="text-[17px] leading-relaxed text-ink">
                {q.quote}
              </blockquote>
              <figcaption className="mt-7 flex items-center gap-3 border-t border-line pt-6">
                <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full bg-sunken">
                  <Image
                    src={photo(q.seed, 120, 120)}
                    alt=""
                    fill
                    unoptimized
                    sizes="40px"
                    className="object-cover"
                  />
                </span>
                <span className="text-[14px] leading-snug">
                  <span className="block font-medium text-ink">{q.name}</span>
                  <span className="block text-muted">{q.role}</span>
                </span>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------- faq */

const FAQS = [
  {
    q: "Who owns the ad accounts and the website?",
    a: "You do, from the first day. We work inside your accounts rather than ours, so nothing is held hostage if you leave.",
  },
  {
    q: "Is there a contract?",
    a: "Month to month with thirty days notice. The first ninety days are where the work is, but you are not tied in for them.",
  },
  {
    q: "What is the minimum ad budget?",
    a: "Around $1,500 a month in media spend. Below that there is not enough data to optimise against, and you are better off with local search alone.",
  },
  {
    q: "Do you work with businesses outside the trades?",
    a: "Yes. Roughly half the accounts we run are dental, legal, and independent retail. The method does not change much.",
  },
  {
    q: "What does the free audit actually include?",
    a: "A written review of your ad account, your site, and your Google listing, with the specific changes we would make and what we would expect them to do.",
  },
];

function Faq() {
  return (
    <section id="faq" className="border-b border-line py-20 md:py-28">
      <div className={`${SHELL} grid gap-10 lg:grid-cols-12`}>
        <Reveal className="lg:col-span-4">
          <h2 className="max-w-[14ch] text-3xl font-semibold leading-tight tracking-tighter text-ink md:text-4xl">
            Questions we get first.
          </h2>
        </Reveal>

        <div className="lg:col-span-7 lg:col-start-6">
          <div className="divide-y divide-line border-t border-b border-line">
            {FAQS.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-[17px] font-medium text-ink [&::-webkit-details-marker]:hidden">
                  {f.q}
                  <Plus
                    size={18}
                    weight="regular"
                    className="mt-1 shrink-0 text-accent transition-transform duration-200 group-open:rotate-45"
                  />
                </summary>
                <p className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-muted">
                  {f.a}
                </p>
              </details>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* --------------------------------------------------------------- contact */

function Contact() {
  return (
    <section id="contact" className="border-b border-line py-20 md:py-28">
      <div className={`${SHELL} grid gap-12 lg:grid-cols-12 lg:gap-16`}>
        <Reveal className="lg:col-span-5">
          <h2 className="max-w-[16ch] text-3xl font-semibold leading-tight tracking-tighter text-ink md:text-4xl lg:text-5xl">
            Find out what your account is wasting.
          </h2>
          <p className="mt-5 max-w-[46ch] text-[16px] leading-relaxed text-muted">
            Send the form and we will go through your ads, your site, and your
            Google listing, then write up what we find. It takes us about an
            hour and costs you nothing.
          </p>
          <p className="mt-8 text-[15px] text-muted">
            Prefer email?{" "}
            <a
              href="mailto:hello@hollowaymarketing.com"
              className="font-medium text-accent"
            >
              hello@hollowaymarketing.com
            </a>
          </p>
        </Reveal>

        <div className="lg:col-span-7">
          <Reveal delay={0.08}>
            <AuditForm />
          </Reveal>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- footer */

function Footer() {
  return (
    <footer className="py-14">
      <div className={`${SHELL} flex flex-col gap-10 md:flex-row md:justify-between`}>
        <div>
          <p className="text-[15px] font-semibold tracking-tight text-ink">
            Holloway <span className="font-normal text-muted">Marketing</span>
          </p>
          <p className="mt-3 max-w-[34ch] text-[14px] leading-relaxed text-muted">
            Ads and websites for local businesses that need the phone to ring.
          </p>
        </div>

        <div className="flex gap-14">
          <div>
            <p className="text-[14px] font-medium text-ink">Company</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a href="#services" className="text-[14px] text-muted hover:text-ink">
                  Services
                </a>
              </li>
              <li>
                <a href="#pricing" className="text-[14px] text-muted hover:text-ink">
                  Pricing
                </a>
              </li>
              <li>
                <a href="#faq" className="text-[14px] text-muted hover:text-ink">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          <div>
            <p className="text-[14px] font-medium text-ink">Contact</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <a
                  href="mailto:hello@hollowaymarketing.com"
                  className="text-[14px] text-muted hover:text-ink"
                >
                  hello@hollowaymarketing.com
                </a>
              </li>
              <li>
                <a href="tel:+13128471928" className="text-[14px] text-muted hover:text-ink">
                  +1 (312) 847-1928
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className={`${SHELL} mt-12 border-t border-line pt-7`}>
        <p className="text-[13px] text-muted">
          &copy; {new Date().getFullYear()} Holloway Marketing
        </p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ page */

export default function Page() {
  return (
    <>
      <SiteNav />
      <main>
        <Hero />
        <LogoWall />
        <Results />
        <Services />
        <CaseStudy />
        <Process />
        <Pricing />
        <Testimonials />
        <Faq />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
