import { Link, useParams, useSearchParams } from 'react-router-dom';
import { CatalogBrowser } from '../components/CatalogBrowser';
import { MEN_CATEGORIES, WOMEN_CATEGORIES, slugToCategory } from '../data/catalog';
import { usePageMeta } from '../hooks/usePageMeta';
import { Department, ShoppingSectionKey } from '../types/shop';

interface CollectionPageProps {
  mode: 'men' | 'women' | 'all';
}

export function CollectionPage({ mode }: CollectionPageProps) {
  const { categorySlug } = useParams<{ categorySlug?: string }>();
  const [searchParams] = useSearchParams();

  const lockedDepartment: Department | undefined = mode === 'all' ? undefined : mode;
  const resolvedCategory = categorySlug ? slugToCategory(categorySlug, lockedDepartment) ?? 'All' : 'All';
  const initialQuery = searchParams.get('q') ?? '';
  const initialSection = (searchParams.get('section') as ShoppingSectionKey | null) ?? 'all';

  const headingTitle =
    mode === 'men'
      ? resolvedCategory !== 'All'
        ? `Men’s ${resolvedCategory}`
        : 'Men’s Footwear Collection'
      : mode === 'women'
        ? resolvedCategory !== 'All'
          ? `Women’s ${resolvedCategory}`
          : 'Women’s Footwear Collection'
        : 'All Footwear & Sneakers';

  const descriptionText =
    mode === 'men'
      ? `Explore ${MEN_CATEGORIES.length} handcrafted men’s footwear categories—from running shoes and casual sneakers to Italian suede loafers, Oxfords, and Chelsea boots.`
      : mode === 'women'
        ? `Explore ${WOMEN_CATEGORIES.length} luxury women’s footwear categories—from platform sneakers and lambskin ballet flats to block heels, stilettos, and knee-high boots.`
        : 'Browse our complete luxury collection of men’s and women’s sneakers, formal silhouettes, boots, heels, and everyday comfort footwear.';

  usePageMeta({
    title: headingTitle,
    description: descriptionText,
  });

  return (
    <div className="bg-[#FAF7F2]">
      <section className="border-b border-[#E2D9CE] bg-[#F2ECE3]/75">
        <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-[#6E6359] mb-4">
            <Link to="/" className="hover:text-[#2B231D]">
              Home
            </Link>
            <span aria-hidden="true">/</span>
            {mode === 'all' ? (
              <span className="text-[#2B231D]">All Shoes</span>
            ) : (
              <>
                <Link to={`/${mode}`} className="hover:text-[#2B231D]">
                  {mode === 'men' ? "Men's Collection" : "Women's Collection"}
                </Link>
                {resolvedCategory !== 'All' && (
                  <>
                    <span aria-hidden="true">/</span>
                    <span className="text-[#2B231D]">{resolvedCategory}</span>
                  </>
                )}
              </>
            )}
          </nav>

          <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <h1 className="font-display text-3xl sm:text-5xl font-medium text-[#2B231D] text-balance">
                {headingTitle}
              </h1>
              <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[#6E6359]">{descriptionText}</p>
            </div>
            {mode !== 'all' && (
              <Link
                to={mode === 'men' ? '/women' : '/men'}
                className="text-xs font-medium tracking-wide text-[#5C4332] hover:text-[#2B231D] underline underline-offset-4 whitespace-nowrap"
              >
                Switch to {mode === 'men' ? "Women's Collection" : "Men's Collection"}
              </Link>
            )}
          </div>
        </div>
      </section>

      <CatalogBrowser
        lockedDepartment={lockedDepartment}
        initialCategory={resolvedCategory}
        initialQuery={initialQuery}
        initialSection={initialSection}
      />
    </div>
  );
}
