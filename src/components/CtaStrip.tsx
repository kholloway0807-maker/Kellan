import Link from "next/link";

interface Props {
  heading: string;
  body: string;
}

export function CtaStrip({ heading, body }: Props) {
  return (
    <section className="bg-gold py-14">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 text-center">
        <h2 className="text-2xl font-extrabold text-green mb-3">{heading}</h2>
        <p className="text-green/80 mb-6">{body}</p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/contact"
            className="rounded-lg bg-green px-8 py-4 font-bold text-cream hover:bg-green-dark transition-colors"
          >
            Get a Free Estimate
          </Link>
          <a
            href="tel:+13095550100"
            className="rounded-lg border-2 border-green px-8 py-4 font-bold text-green hover:bg-green hover:text-cream transition-colors"
            aria-label="Call 309-555-0100"
          >
            (309) 555-0100
          </a>
        </div>
      </div>
    </section>
  );
}
