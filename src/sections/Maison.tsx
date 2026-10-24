import { Reveal } from '../components/Reveal';
import { asset } from '../lib/asset';

const TENETS = [
  { n: 'I', title: 'Arrive late', text: 'The best tables fill after ten. The clothes are cut for the hours after.' },
  { n: 'II', title: 'Stay longer', text: 'Heavyweight cotton that holds its shape through every course and every toast.' },
  { n: 'III', title: 'Say less', text: 'One script. One seal. Black and cream. Nothing on the cloth that doesn’t need to be.' },
];

export function Maison() {
  return (
    <section id="maison" className="scroll-mt-20 border-t border-sc-line bg-sc-ink">
      <div className="mx-auto grid max-w-7xl items-center gap-16 px-4 py-24 sm:px-8 md:py-32 lg:grid-cols-2">
        <Reveal className="relative mx-auto w-full max-w-md">
          <img
            src={asset('brand/crest.webp')}
            alt="Saint. Clermont Dinner Club crest — SC monogram encircled by St. Tropez · St. Clermont"
            width={1200}
            height={1200}
            loading="lazy"
            className="w-full rounded-full"
          />
        </Reveal>

        <div>
          <Reveal>
            <p className="eyebrow">La Maison</p>
            <h2 className="mt-4 font-serif text-5xl leading-[1.05] sm:text-6xl">
              A dinner club <em className="italic">you can wear.</em>
            </h2>
          </Reveal>
          <Reveal delay={0.08}>
            <p className="mt-8 max-w-xl text-base leading-relaxed text-sc-stone">
              Saint. Clermont began as a table — friends, long nights, a coastline borrowed from St. Tropez and brought
              home to Clermont. The clothing is the uniform of that table: old-world lettering, Riviera ease, and the
              quiet confidence of having a seat reserved.
            </p>
          </Reveal>

          <div className="mt-12 divide-y divide-sc-line border-y border-sc-line">
            {TENETS.map((t, i) => (
              <Reveal key={t.n} delay={0.12 + i * 0.06} className="grid grid-cols-[3rem_1fr] gap-4 py-6">
                <span className="font-serif text-2xl italic text-sc-stone">{t.n}</span>
                <div>
                  <h3 className="font-gothic text-2xl">{t.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-sc-stone">{t.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
