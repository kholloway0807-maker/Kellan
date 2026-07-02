import { useState } from 'react';
import { Reveal } from '../components/Reveal';

const FAQS = [
  {
    q: 'How does garment dyeing affect the fit?',
    a: 'Garment dyeing causes a small, intentional amount of shrinkage and relaxing of the fabric. Our sizing accounts for this — each piece is pre-washed so what you order is what you get.',
  },
  {
    q: 'Will the color fade over time?',
    a: 'Yes — intentionally. Garment-dyed pieces develop a beautiful faded patina with wear and washing. It adds character, not damage. Wash cold, inside-out to slow the fade if you prefer.',
  },
  {
    q: 'How many pieces can I take per order?',
    a: 'No limits. Order as many as you want — we batch ship everything in 1–2 business days.',
  },
  {
    q: 'Will NOVA make me more productive?',
    a: "We can't promise that. But wearing something you're proud of never hurts.",
  },
  {
    q: 'How many washes does the garment last?',
    a: '100% ring-spun cotton is built for longevity. With proper cold-wash care, these pieces hold their structure and color far beyond what fast-fashion alternatives offer.',
  },
];

function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-nova-border last:border-0">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-semibold text-nova-ink hover:text-nova-muted transition-colors"
      >
        {q}
        <span className={`shrink-0 transition-transform duration-200 ${open ? 'rotate-45' : ''}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </span>
      </button>
      {open && (
        <p className="pb-5 text-sm leading-relaxed text-nova-muted">{a}</p>
      )}
    </div>
  );
}

export function Faq() {
  return (
    <section id="faq" className="bg-nova-cream section-pad">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
          {/* Left */}
          <Reveal>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <p className="eyebrow mb-4">Got Questions?</p>
              <h2 className="text-4xl font-bold leading-tight tracking-tight text-nova-ink sm:text-5xl">
                Frequently<br />Asked<br />Questions
              </h2>
              <p className="mt-5 text-base leading-relaxed text-nova-muted">
                Everything you need to know about NOVA. Can't find your answer?{' '}
                <a href="mailto:hello@novaly.us" className="underline hover:text-nova-ink">
                  Reach out.
                </a>
              </p>
            </div>
          </Reveal>

          {/* Right */}
          <Reveal delay={0.1}>
            <div>
              {FAQS.map((f) => (
                <FaqItem key={f.q} q={f.q} a={f.a} />
              ))}
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
