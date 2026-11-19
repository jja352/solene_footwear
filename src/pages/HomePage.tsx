import { ArrowRight, Heart, MessageCircle, ShieldCheck, Sparkles, Truck } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import {
  ATELIER_STORY_IMAGE,
  HERO_CAMPAIGN_IMAGE,
  MEN_CATEGORIES,
  PRODUCTS,
  SHOPPING_SECTIONS,
  WOMEN_CATEGORIES,
  categoryToSlug,
  getDiscountPercentage,
} from '../data/catalog';
import { usePageMeta } from '../hooks/usePageMeta';
import { ShoppingSectionKey } from '../types/shop';
import { buildSupportMessage, buildWhatsAppUrl } from '../utils/whatsapp';

export function HomePage() {
  usePageMeta({
    title: 'Solenne – Luxury Sneakers & Handcrafted Footwear',
    description:
      'Discover handcrafted men’s and women’s sneakers, loafers, boots, and heels in dusty woody, sand, and warm walnut tones priced in PKR.',
  });

  const [activeSection, setActiveSection] = useState<ShoppingSectionKey>('newArrival');

  const sectionProducts = useMemo(() => {
    if (activeSection === 'discounted') {
      return PRODUCTS.filter((p) => getDiscountPercentage(p) > 0).slice(0, 6);
    }
    return PRODUCTS.filter((p) => p.sections.includes(activeSection)).slice(0, 6);
  }, [activeSection]);

  const currentSectionMeta = SHOPPING_SECTIONS.find((s) => s.key === activeSection) ?? SHOPPING_SECTIONS[0];

  return (
    <div className="bg-[#EFE5DA] text-[#2E2119]">
      {/* 1. Storefront Dusty Woody Split Hero */}
      <section className="border-b border-[#D8C7B6] bg-gradient-to-b from-[#EFE5DA] to-[#EAE0D3]">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-stretch">
            <div className="flex flex-col justify-between lg:col-span-5 py-2">
              <div className="space-y-6">
                <p className="text-xs font-medium tracking-[0.18em] uppercase text-[#6B4A37]">
                  Crafted with Quiet Care · Men &amp; Women
                </p>
                <h1 className="font-display text-4xl sm:text-5xl lg:text-[3.5rem] font-medium leading-[1.08] tracking-tight text-[#2E2119] text-balance">
                  Shoes made to walk beside your warmest days.
                </h1>
                <p className="max-w-md text-base leading-relaxed text-[#615045]">
                  From unhurried morning walks and family gatherings to cherished evenings—every pair is gently lasted
                  in dusty cedar, warm walnut, sand, and cream so your feet feel held, rested, and effortlessly poised.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Link
                    to="/women"
                    className="inline-flex h-11 items-center gap-2 bg-[#4A3224] px-6 text-xs font-medium tracking-wide text-[#F6EFE7] hover:bg-[#342117] transition-colors whitespace-nowrap"
                  >
                    <span>Shop Women</span>
                    <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                  <Link
                    to="/men"
                    className="inline-flex h-11 items-center gap-2 border border-[#4A3224] bg-[#F6EFE7]/60 px-6 text-xs font-medium tracking-wide text-[#2E2119] hover:bg-[#E2D3C3] transition-colors whitespace-nowrap"
                  >
                    <span>Shop Men</span>
                  </Link>
                  <Link
                    to="/shoes"
                    className="inline-flex h-11 items-center px-3 text-xs font-medium tracking-wide text-[#6B4A37] hover:text-[#2E2119] underline underline-offset-4 whitespace-nowrap"
                  >
                    All 42 Silhouettes
                  </Link>
                </div>
              </div>

              <div className="mt-10 hidden lg:flex items-center gap-5 border-t border-[#D8C7B6] pt-6 text-xs text-[#615045]">
                <span>18 Men’s Styles</span>
                <span aria-hidden="true">·</span>
                <span>21 Women’s Styles</span>
                <span aria-hidden="true">·</span>
                <span>Prices in Pakistani PKR</span>
              </div>
            </div>

            <div className="lg:col-span-7">
              <div className="relative aspect-[16/9] lg:aspect-auto lg:h-full min-h-[280px] overflow-hidden bg-[#DFD0BF] border border-[#CEBBA7]">
                <ProductImage
                  src={HERO_CAMPAIGN_IMAGE}
                  alt="Solenne cream leather sneakers and dusty walnut suede loafers on travertine blocks"
                  loading="eager"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* 4-column craft & service strip below hero */}
          <div className="mt-12 grid grid-cols-1 gap-6 border-t border-[#D8C7B6] pt-8 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: Truck,
                title: 'Complimentary Delivery',
                copy: 'Free nationwide courier on every order above PKR 15,000.',
              },
              {
                icon: Sparkles,
                title: 'Soft Woody Suede & Calfskin',
                copy: 'Supple drum-dyed hides that soften kindly with every wear.',
              },
              {
                icon: MessageCircle,
                title: 'Personal WhatsApp Care',
                copy: 'Warm, one-on-one sizing advice and effortless order confirmation.',
              },
              {
                icon: ShieldCheck,
                title: '30-Day Gentle Exchanges',
                copy: 'Easy size swaps and thoughtful after-care from our studio.',
              },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-3.5">
                <item.icon className="mt-0.5 h-4.5 w-4.5 shrink-0 text-[#6B4A37]" strokeWidth={1.6} aria-hidden="true" />
                <div>
                  <h2 className="font-sans text-sm font-semibold text-[#2E2119]">{item.title}</h2>
                  <p className="mt-1 text-xs leading-relaxed text-[#615045]">{item.copy}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 2. Dual Department Showcase (Men's & Women's Collections) */}
      <section className="border-b border-[#D8C7B6] bg-[#E5D7C8]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between mb-8">
            <div>
              <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#6B4A37]">For Him &amp; For Her</p>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl font-medium text-[#2E2119]">
                Wardrobes Shaped Around Real Life
              </h2>
            </div>
            <Link
              to="/shoes"
              className="text-xs font-medium tracking-wide text-[#6B4A37] hover:text-[#2E2119] underline underline-offset-4 whitespace-nowrap"
            >
              Browse Full Catalog
            </Link>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Men's Card */}
            <div className="bg-[#F5EEE6] border border-[#D4C2B0] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-[#E5D7C8] mb-6 border border-[#DFD0BF]">
                  <ProductImage
                    src="/src/assets/images/men_sneaker_cream_1795088473558.jpg"
                    alt="Men's minimalist cream and dusty taupe sneakers"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-3xl font-medium text-[#2E2119]">Men’s Collection</h3>
                  <span className="text-xs text-[#615045] tabular-nums">{MEN_CATEGORIES.length} Categories</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#615045]">
                  Cushioned runners and weekend sneakers, unlined walnut suede loafers, classic Oxfords, Chelsea boots,
                  and relaxed resort slides crafted to age gracefully.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-[#6B4A37]">
                  {['Running Shoes', 'Casual Sneakers', 'Loafers', 'Oxford Shoes', 'Chelsea Boots', 'Slides'].map(
                    (cat) => (
                      <Link
                        key={cat}
                        to={`/men/${categoryToSlug(cat)}`}
                        className="hover:text-[#2E2119] underline underline-offset-4"
                      >
                        {cat}
                      </Link>
                    )
                  )}
                </div>
              </div>
              <div className="mt-7 pt-5 border-t border-[#E0D2C3]">
                <Link
                  to="/men"
                  className="inline-flex h-10 items-center gap-2 bg-[#4A3224] px-5 text-xs font-medium tracking-wide text-[#F6EFE7] hover:bg-[#342117] transition-colors"
                >
                  <span>Explore Men’s Collection</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Women's Card */}
            <div className="bg-[#F5EEE6] border border-[#D4C2B0] p-6 sm:p-8 flex flex-col justify-between">
              <div>
                <div className="aspect-[16/10] overflow-hidden bg-[#E5D7C8] mb-6 border border-[#DFD0BF]">
                  <ProductImage
                    src="/src/assets/images/women_sneaker_nude_1795088474884.jpg"
                    alt="Women's blush nude and cream platform sneakers"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex items-baseline justify-between gap-4">
                  <h3 className="font-display text-3xl font-medium text-[#2E2119]">Women’s Collection</h3>
                  <span className="text-xs text-[#615045] tabular-nums">{WOMEN_CATEGORIES.length} Categories</span>
                </div>
                <p className="mt-2 text-sm leading-relaxed text-[#615045]">
                  Cloud-light platform sneakers, butter-soft lambskin ballet flats, sculpted cedar block heels,
                  stilettos, wedges, and camel suede boots.
                </p>
                <div className="mt-5 flex flex-wrap gap-x-3 gap-y-1.5 text-xs text-[#6B4A37]">
                  {['Platform Sneakers', 'Ballet Flats', 'Block Heels', 'Stilettos', 'Ankle Boots', 'Sandals'].map(
                    (cat) => (
                      <Link
                        key={cat}
                        to={`/women/${categoryToSlug(cat)}`}
                        className="hover:text-[#2E2119] underline underline-offset-4"
                      >
                        {cat}
                      </Link>
                    )
                  )}
                </div>
              </div>
              <div className="mt-7 pt-5 border-t border-[#E0D2C3]">
                <Link
                  to="/women"
                  className="inline-flex h-10 items-center gap-2 bg-[#4A3224] px-5 text-xs font-medium tracking-wide text-[#F6EFE7] hover:bg-[#342117] transition-colors"
                >
                  <span>Explore Women’s Collection</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Curated Shopping Sections Explorer */}
      <section className="border-b border-[#D8C7B6] bg-[#EFE5DA]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-xs font-medium tracking-[0.16em] uppercase text-[#6B4A37]">Curated With Love</p>
              <h2 className="mt-1 font-display text-3xl sm:text-4xl font-medium text-[#2E2119]">
                {currentSectionMeta.label}
              </h2>
              <p className="mt-1 text-sm text-[#615045]">{currentSectionMeta.subtitle}</p>
            </div>
            <Link
              to={`/shoes?section=${activeSection}`}
              className="inline-flex items-center gap-1.5 text-xs font-medium tracking-wide text-[#6B4A37] hover:text-[#2E2119] underline underline-offset-4 whitespace-nowrap"
            >
              <span>View all in {currentSectionMeta.label}</span>
              <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
            </Link>
          </div>

          <div
            role="tablist"
            aria-label="Shopping sections"
            className="mt-7 flex items-center gap-1.5 overflow-x-auto bg-[#E2D3C3] p-1.5 border border-[#D4C2B0]"
          >
            {SHOPPING_SECTIONS.map((sec) => {
              const active = activeSection === sec.key;
              return (
                <button
                  key={sec.key}
                  role="tab"
                  aria-selected={active}
                  type="button"
                  onClick={() => setActiveSection(sec.key)}
                  className={`h-9 shrink-0 px-3.5 text-xs font-medium transition-colors whitespace-nowrap ${
                    active
                      ? 'bg-[#4A3224] text-[#F6EFE7] shadow-xs'
                      : 'text-[#5A473C] hover:text-[#2E2119]'
                  }`}
                >
                  {sec.label}
                </button>
              );
            })}
          </div>

          <div className="mt-8 grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
            {sectionProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* 4. Affectionate Atelier Story & Client Reflections */}
      <section className="bg-[#E5D7C8]">
        <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center">
            <div className="lg:col-span-6">
              <div className="aspect-[4/3] overflow-hidden bg-[#DFD0BF] border border-[#CEBBA7]">
                <ProductImage
                  src={ATELIER_STORY_IMAGE}
                  alt="Artisan hands shaping cream calfskin and dusty suede leather on a wooden shoe last"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>

            <div className="lg:col-span-6 space-y-5">
              <p className="inline-flex items-center gap-2 text-xs font-medium tracking-[0.16em] uppercase text-[#6B4A37]">
                <Heart className="h-3.5 w-3.5" aria-hidden="true" />
                <span>From Our Hands to Yours</span>
              </p>
              <h2 className="font-display text-3xl sm:text-4xl font-medium leading-tight text-[#2E2119] text-balance">
                A gentler way of making shoes—built for comfort you can feel at first step.
              </h2>
              <p className="text-sm sm:text-base leading-relaxed text-[#5A473C]">
                We believe footwear should never ask you to suffer for elegance. Every Solenne pair is softly cushioned
                along the arch, lined in breathable natural leather, and finished in dusty woody earth tones that carry
                warmth from dawn errands to late dinners with the people you love.
              </p>

              {/* Attributable Client Notes */}
              <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                <blockquote className="border border-[#D4C2B0] bg-[#F5EEE6] p-4">
                  <p className="text-xs leading-relaxed text-[#2E2119]">
                    “Wore the Sorbonne Block Heels through an entire family wedding in Lahore—zero pinching, and the
                    dusty taupe suede matched every outfit.”
                  </p>
                  <footer className="mt-2.5 text-[11px] font-medium text-[#6B4A37]">
                    Ayesha Tariq · Architect, Lahore
                  </footer>
                </blockquote>
                <blockquote className="border border-[#D4C2B0] bg-[#F5EEE6] p-4">
                  <p className="text-xs leading-relaxed text-[#2E2119]">
                    “Ordered the Como Suede Loafers on WhatsApp in 2 minutes. The fit advice was spot-on and they felt
                    broken-in out of the box.”
                  </p>
                  <footer className="mt-2.5 text-[11px] font-medium text-[#6B4A37]">
                    Hamza Siddiqui · Product Lead, Islamabad
                  </footer>
                </blockquote>
              </div>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <Link
                  to="/about"
                  className="inline-flex h-11 items-center bg-[#4A3224] px-6 text-xs font-medium tracking-wide text-[#F6EFE7] hover:bg-[#342117] transition-colors"
                >
                  Read Our Story
                </Link>
                <a
                  href={buildWhatsAppUrl(buildSupportMessage('Personal Sizing & Styling Advice'))}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex h-11 items-center gap-2 border border-[#4A3224] bg-[#F5EEE6] px-5 text-xs font-medium tracking-wide text-[#4A3224] hover:bg-[#4A3224] hover:text-[#F6EFE7] transition-colors"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Talk to Our Fit Team</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
