import type { Metadata } from "next";
import { CtaStrip } from "@/components/CtaStrip";

export const metadata: Metadata = {
  title: "About Kellan Holloway | Local Lawn Care Bloomington IL",
  description:
    "Learn about Kellan Holloway Lawncare — a locally owned lawn care business serving Bloomington-Normal and McLean County, IL. Our story, our values, and our commitment to the community.",
};

const values = [
  {
    title: "Honesty",
    body: "We give you a straight quote, show up when we say we will, and never upsell services you don't need.",
  },
  {
    title: "Quality",
    body: "Every lawn gets the same attention to detail, whether it's your first cut or your fiftieth.",
  },
  {
    title: "Community",
    body: "Bloomington-Normal is home. We sponsor local youth sports, shop local, and hire local.",
  },
  {
    title: "Reliability",
    body: "A consistent schedule matters. If something comes up, we communicate — always.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-hero-gradient py-20" aria-labelledby="about-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <p className="text-xs font-semibold uppercase tracking-widest text-gold mb-3">Our Story</p>
          <h1 id="about-heading" className="text-4xl font-extrabold text-cream sm:text-5xl max-w-2xl">
            A Bloomington Kid Who Loves a Perfect Lawn
          </h1>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-cream" aria-labelledby="story-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2 items-center">
            {/* Photo placeholder */}
            <div
              className="rounded-2xl bg-green/10 border-2 border-dashed border-green/30 flex items-center justify-center h-80 lg:h-96"
              aria-label="Photo of Kellan Holloway"
              role="img"
            >
              <div className="text-center p-8">
                <div className="text-7xl mb-4" aria-hidden="true">🌿</div>
                <p className="text-green font-semibold">Kellan Holloway</p>
                <p className="text-sm text-gray-500">Owner &amp; Operator</p>
              </div>
            </div>

            {/* Story text */}
            <div>
              <h2 id="story-heading" className="text-2xl font-extrabold text-green mb-4">
                Started with one mower and one neighborhood
              </h2>
              <div className="space-y-4 text-gray-700 leading-relaxed">
                <p>
                  Growing up in Bloomington, I spent summers mowing neighbors&apos; lawns to earn extra money. What started as a side job turned into a genuine passion — there&apos;s something deeply satisfying about a freshly cut, perfectly edged lawn.
                </p>
                <p>
                  After years of learning the craft and understanding what homeowners in central Illinois actually need — turf that handles our hot summers, heavy clay soils, and unpredictable springs — I decided to make it official.
                </p>
                <p>
                  Kellan Holloway Lawncare is a one-crew operation. When you call, you talk to me. When we show up, it&apos;s my team. Every lawn gets my personal attention because my name is on the truck and my reputation is on your front yard.
                </p>
                <p className="font-semibold text-green">
                  I don&apos;t take on more work than I can do well. That&apos;s the Kellan promise.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 bg-green" aria-labelledby="values-heading">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <h2 id="values-heading" className="text-2xl font-extrabold text-cream mb-10 text-center">
            What We Stand For
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-xl bg-green-dark p-6">
                <h3 className="text-gold font-bold text-lg mb-2">{v.title}</h3>
                <p className="text-cream/70 text-sm leading-relaxed">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Credentials */}
      <section className="py-16 bg-cream-dark" aria-labelledby="credentials-heading">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
          <h2 id="credentials-heading" className="text-2xl font-extrabold text-green mb-6">
            Credentials &amp; Commitment
          </h2>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3 text-sm">
            {[
              { icon: "🛡️", label: "Fully Insured", sub: "General liability + equipment" },
              { icon: "📋", label: "Licensed in IL", sub: "Pesticide applicator certified" },
              { icon: "🤝", label: "Satisfaction Guarantee", sub: "We'll make it right, always" },
            ].map((c) => (
              <li key={c.label} className="rounded-xl bg-white border border-cream-dark p-6 shadow-sm">
                <div className="text-3xl mb-2" aria-hidden="true">{c.icon}</div>
                <p className="font-bold text-green">{c.label}</p>
                <p className="text-gray-500 text-xs mt-1">{c.sub}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaStrip
        heading="Ready to work with us?"
        body="Free estimates, no pressure. Just a neighbor who wants your lawn to look great."
      />
    </>
  );
}
