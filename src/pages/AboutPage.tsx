import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ProductImage } from '../components/ProductImage';
import { ATELIER_STORY_IMAGE, HERO_CAMPAIGN_IMAGE } from '../data/catalog';
import { usePageMeta } from '../hooks/usePageMeta';

export function AboutPage() {
  usePageMeta({
    title: 'About Us',
    description:
      'Learn about Solenne Footwear—our calm nude-toned design language, Italian leather craft, and small-batch footwear workshops.',
  });

  return (
    <div className="bg-[#FAF7F2]">
      <section className="border-b border-[#E2D9CE] bg-[#F2ECE3]/75">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#5C4332]">The House of Solenne</p>
          <h1 className="mt-2 max-w-3xl font-display text-4xl sm:text-5xl font-medium leading-tight text-[#2B231D] text-balance">
            Restraint in color. Rigor in construction.
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-relaxed text-[#6E6359]">
            Founded as an antidote to seasonal disposable footwear, Solenne creates men’s and women’s shoes exclusively
            within a serene mineral palette—alabaster, blush nude, dune sand, warm taupe, burnished cognac, and deep
            espresso.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-6 aspect-[4/3] overflow-hidden bg-[#F2ECE3] border border-[#E2D9CE]">
            <ProductImage
              src={ATELIER_STORY_IMAGE}
              alt="Master shoemaker working on cream leather upper on a wooden last"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="lg:col-span-6 space-y-5">
            <h2 className="font-display text-3xl font-medium text-[#2B231D]">01. Materials &amp; Tanneries</h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#6E6359]">
              Every hide is sourced from Leather Working Group Gold-rated family tanneries in Tuscany and finished
              without heavy synthetic plastic coatings. Our suede is treated at the drum level for natural water
              repellency, while our performance knit runners weave merino-blend yarns for breathable temperature balance.
            </p>
            <h2 className="font-display text-3xl font-medium text-[#2B231D] pt-2">02. Anatomical Comfort</h2>
            <p className="text-sm sm:text-base leading-relaxed text-[#6E6359]">
              Whether shaping a 95mm evening stiletto or a Goodyear-welted Chelsea boot, we balance heel pitch and
              arch geometry so every pair feels broken-in from the first mile.
            </p>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-8 border-t border-[#E2D9CE] pt-12 md:grid-cols-3">
          {[
            {
              title: '18 Men’s Categories',
              body: 'From carbon-plate runners and basketball high-containment sneakers to wholecut Oxfords and relaxed suede slides.',
            },
            {
              title: '21 Women’s Categories',
              body: 'From 45mm platform sneakers and French lambskin ballet flats to geometric block heels and knee-high boots.',
            },
            {
              title: 'Personal WhatsApp Concierge',
              body: 'Real footwear specialists available directly on WhatsApp for width checks, styling advice, and priority dispatch.',
            },
          ].map((pillar) => (
            <div key={pillar.title} className="border border-[#E2D9CE] bg-[#F2ECE3] p-6">
              <h3 className="font-display text-2xl font-medium text-[#2B231D]">{pillar.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[#6E6359]">{pillar.body}</p>
            </div>
          ))}
        </div>

        <div className="mt-14 aspect-[16/9] max-h-[420px] w-full overflow-hidden border border-[#E2D9CE] bg-[#F2ECE3]">
          <ProductImage
            src={HERO_CAMPAIGN_IMAGE}
            alt="Solenne cream sneakers and taupe suede loafers"
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[#E2D9CE] pt-8">
          <p className="font-display text-2xl text-[#2B231D]">Explore the complete collection.</p>
          <div className="flex gap-3">
            <Link
              to="/women"
              className="inline-flex h-11 items-center gap-2 bg-[#2B231D] px-6 text-xs font-medium tracking-wide text-[#FAF7F2] hover:bg-[#5C4332]"
            >
              <span>Shop Women</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
            <Link
              to="/men"
              className="inline-flex h-11 items-center border border-[#2B231D] px-6 text-xs font-medium tracking-wide text-[#2B231D] hover:bg-[#F2ECE3]"
            >
              <span>Shop Men</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
