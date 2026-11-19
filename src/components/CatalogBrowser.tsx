import { Search, SlidersHorizontal, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import {
  MEN_CATEGORIES,
  PRODUCTS,
  SHOPPING_SECTIONS,
  WOMEN_CATEGORIES,
  getAllAvailableColors,
  getAllAvailableSizes,
  getDiscountPercentage,
  getEffectivePrice,
} from '../data/catalog';
import { Department, ShoppingSectionKey } from '../types/shop';
import { ProductCard } from './ProductCard';

interface CatalogBrowserProps {
  lockedDepartment?: Department;
  initialCategory?: string;
  initialQuery?: string;
  initialSection?: ShoppingSectionKey | 'all';
}

type PriceBucket = 'all' | 'under-14000' | '14000-22000' | '22000-plus';
type SortOption = 'featured' | 'price-asc' | 'price-desc' | 'discount' | 'rating';

export function CatalogBrowser({
  lockedDepartment,
  initialCategory = 'All',
  initialQuery = '',
  initialSection = 'all',
}: CatalogBrowserProps) {
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [department, setDepartment] = useState<'all' | Department>(lockedDepartment ?? 'all');
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [selectedSize, setSelectedSize] = useState<string>('All');
  const [selectedColor, setSelectedColor] = useState<string>('All');
  const [priceBucket, setPriceBucket] = useState<PriceBucket>('all');
  const [selectedSection, setSelectedSection] = useState<ShoppingSectionKey | 'all'>(initialSection);
  const [onlyDiscounted, setOnlyDiscounted] = useState(false);
  const [sortBy, setSortBy] = useState<SortOption>('featured');
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    setDepartment(lockedDepartment ?? 'all');
  }, [lockedDepartment]);

  useEffect(() => {
    setSelectedCategory(initialCategory);
  }, [initialCategory]);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    setSelectedSection(initialSection);
  }, [initialSection]);

  const categoryOptions = useMemo(() => {
    if (department === 'men') return MEN_CATEGORIES;
    if (department === 'women') return WOMEN_CATEGORIES;
    return Array.from(new Set([...MEN_CATEGORIES, ...WOMEN_CATEGORIES]));
  }, [department]);

  const departmentScopedProducts = useMemo(() => {
    if (department === 'all') return PRODUCTS;
    return PRODUCTS.filter((p) => p.department === department);
  }, [department]);

  const availableColors = useMemo(() => getAllAvailableColors(departmentScopedProducts), [departmentScopedProducts]);
  const availableSizes = useMemo(() => getAllAvailableSizes(departmentScopedProducts), [departmentScopedProducts]);

  const filteredProducts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();

    const matches = departmentScopedProducts.filter((product) => {
      if (q) {
        const textMatch =
          product.name.toLowerCase().includes(q) ||
          product.category.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.upperMaterial.toLowerCase().includes(q) ||
          product.colors.some((c) => c.name.toLowerCase().includes(q));
        if (!textMatch) return false;
      }

      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }

      if (selectedSize !== 'All' && !product.sizes.includes(selectedSize)) {
        return false;
      }

      if (selectedColor !== 'All' && !product.colors.some((c) => c.name === selectedColor)) {
        return false;
      }

      const price = getEffectivePrice(product);
      if (priceBucket === 'under-14000' && price >= 14000) return false;
      if (priceBucket === '14000-22000' && (price < 14000 || price > 22000)) return false;
      if (priceBucket === '22000-plus' && price <= 22000) return false;

      if (onlyDiscounted && getDiscountPercentage(product) === 0) {
        return false;
      }

      if (selectedSection !== 'all' && !product.sections.includes(selectedSection)) {
        return false;
      }

      return true;
    });

    const sorted = [...matches];
    if (sortBy === 'price-asc') {
      sorted.sort((a, b) => getEffectivePrice(a) - getEffectivePrice(b));
    } else if (sortBy === 'price-desc') {
      sorted.sort((a, b) => getEffectivePrice(b) - getEffectivePrice(a));
    } else if (sortBy === 'discount') {
      sorted.sort((a, b) => getDiscountPercentage(b) - getDiscountPercentage(a));
    } else if (sortBy === 'rating') {
      sorted.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    }
    return sorted;
  }, [
    departmentScopedProducts,
    searchQuery,
    selectedCategory,
    selectedSize,
    selectedColor,
    priceBucket,
    onlyDiscounted,
    selectedSection,
    sortBy,
  ]);

  const activeFilterCount =
    (searchQuery.trim() ? 1 : 0) +
    (!lockedDepartment && department !== 'all' ? 1 : 0) +
    (selectedCategory !== 'All' ? 1 : 0) +
    (selectedSize !== 'All' ? 1 : 0) +
    (selectedColor !== 'All' ? 1 : 0) +
    (priceBucket !== 'all' ? 1 : 0) +
    (selectedSection !== 'all' ? 1 : 0) +
    (onlyDiscounted ? 1 : 0);

  const resetAllFilters = () => {
    setSearchQuery('');
    if (!lockedDepartment) setDepartment('all');
    setSelectedCategory('All');
    setSelectedSize('All');
    setSelectedColor('All');
    setPriceBucket('all');
    setSelectedSection('all');
    setOnlyDiscounted(false);
    setSortBy('featured');
  };

  const filterSidebarContent = (
    <div className="space-y-7">
      {!lockedDepartment && (
        <div>
          <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-[#5C4332] mb-3">Department</h3>
          <div className="grid grid-cols-3 gap-1.5 bg-[#F2ECE3] p-1">
            {[
              { id: 'all', label: 'All' },
              { id: 'men', label: 'Men' },
              { id: 'women', label: 'Women' },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setDepartment(opt.id as 'all' | Department);
                  setSelectedCategory('All');
                }}
                className={`h-9 text-xs font-medium transition-colors ${
                  department === opt.id ? 'bg-[#FAF7F2] text-[#2B231D] shadow-xs' : 'text-[#6E6359] hover:text-[#2B231D]'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-[#5C4332] mb-3">
          Collection Edit
        </h3>
        <select
          aria-label="Filter by collection edit"
          value={selectedSection}
          onChange={(e) => setSelectedSection(e.target.value as ShoppingSectionKey | 'all')}
          className="h-10 w-full border border-[#DFD4C6] bg-[#FAF7F2] px-3 text-sm text-[#2B231D]"
        >
          <option value="all">All Editions</option>
          {SHOPPING_SECTIONS.map((s) => (
            <option key={s.key} value={s.key}>
              {s.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-[#5C4332] mb-3">Category</h3>
        <div className="max-h-60 overflow-y-auto space-y-1 pr-1">
          <button
            type="button"
            onClick={() => setSelectedCategory('All')}
            className={`w-full text-left px-2.5 py-1.5 text-sm transition-colors ${
              selectedCategory === 'All'
                ? 'bg-[#2B231D] text-[#FAF7F2] font-medium'
                : 'text-[#6E6359] hover:text-[#2B231D] hover:bg-[#F2ECE3]'
            }`}
          >
            All Categories
          </button>
          {categoryOptions.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setSelectedCategory(cat)}
              className={`w-full text-left px-2.5 py-1.5 text-sm transition-colors ${
                selectedCategory === cat
                  ? 'bg-[#2B231D] text-[#FAF7F2] font-medium'
                  : 'text-[#6E6359] hover:text-[#2B231D] hover:bg-[#F2ECE3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-[#5C4332] mb-3">Size</h3>
        <div className="grid grid-cols-3 gap-1.5">
          <button
            type="button"
            onClick={() => setSelectedSize('All')}
            className={`h-9 border text-xs font-medium transition-colors ${
              selectedSize === 'All'
                ? 'border-[#2B231D] bg-[#2B231D] text-[#FAF7F2]'
                : 'border-[#DFD4C6] text-[#2B231D] hover:bg-[#F2ECE3]'
            }`}
          >
            All
          </button>
          {availableSizes.map((size) => (
            <button
              key={size}
              type="button"
              onClick={() => setSelectedSize(size === selectedSize ? 'All' : size)}
              className={`h-9 border text-xs font-medium tabular-nums transition-colors ${
                selectedSize === size
                  ? 'border-[#2B231D] bg-[#2B231D] text-[#FAF7F2]'
                  : 'border-[#DFD4C6] text-[#2B231D] hover:bg-[#F2ECE3]'
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-[#5C4332] mb-3">Tone / Color</h3>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setSelectedColor('All')}
            className={`h-9 px-3 border text-xs font-medium transition-colors ${
              selectedColor === 'All'
                ? 'border-[#2B231D] bg-[#2B231D] text-[#FAF7F2]'
                : 'border-[#DFD4C6] text-[#2B231D] hover:bg-[#F2ECE3]'
            }`}
          >
            All Tones
          </button>
          {availableColors.map((color) => (
            <button
              key={color.name}
              type="button"
              onClick={() => setSelectedColor(color.name === selectedColor ? 'All' : color.name)}
              title={color.name}
              className={`inline-flex h-9 items-center gap-2 border px-2.5 text-xs transition-colors ${
                selectedColor === color.name
                  ? 'border-[#2B231D] bg-[#F2ECE3] font-medium text-[#2B231D]'
                  : 'border-[#DFD4C6] text-[#6E6359] hover:text-[#2B231D]'
              }`}
            >
              <span
                className="h-3 w-3 rounded-full border border-[#C9B5A0]"
                style={{ backgroundColor: color.hex }}
              />
              <span>{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-[#5C4332] mb-3">Price Range</h3>
        <div className="space-y-1.5">
          {[
            { id: 'all', label: 'All Prices' },
            { id: 'under-14000', label: 'Under PKR 14,000' },
            { id: '14000-22000', label: 'PKR 14,000 – PKR 22,000' },
            { id: '22000-plus', label: 'PKR 22,000 & Above' },
          ].map((bucket) => (
            <button
              key={bucket.id}
              type="button"
              onClick={() => setPriceBucket(bucket.id as PriceBucket)}
              className={`w-full text-left px-2.5 py-1.5 text-sm transition-colors ${
                priceBucket === bucket.id
                  ? 'bg-[#2B231D] text-[#FAF7F2] font-medium'
                  : 'text-[#6E6359] hover:text-[#2B231D] hover:bg-[#F2ECE3]'
              }`}
            >
              {bucket.label}
            </button>
          ))}
        </div>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer pt-1">
        <input
          type="checkbox"
          checked={onlyDiscounted}
          onChange={(e) => setOnlyDiscounted(e.target.checked)}
          className="h-4 w-4 accent-[#5C4332]"
        />
        <span className="text-sm text-[#2B231D]">Discounted items only</span>
      </label>

      {activeFilterCount > 0 && (
        <button
          type="button"
          onClick={resetAllFilters}
          className="w-full h-10 border border-[#5C4332] text-xs font-medium tracking-wide text-[#5C4332] hover:bg-[#5C4332] hover:text-[#FAF7F2] transition-colors"
        >
          Reset Filters ({activeFilterCount})
        </button>
      )}
    </div>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Top Control Bar: Search, Mobile Filter Toggle, Count, Sort */}
      <div className="flex flex-col gap-4 border-b border-[#E2D9CE] pb-6 md:flex-row md:items-center md:justify-between">
        <div className="relative flex-1 max-w-md">
          <Search
            className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#6E6359]"
            aria-hidden="true"
          />
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by shoe, style, leather, or color..."
            aria-label="Filter shoes by keyword"
            className="h-11 w-full border border-[#DFD4C6] bg-[#FAF7F2] pl-10 pr-4 text-sm text-[#2B231D] placeholder:text-[#6E6359]"
          />
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => setMobileFiltersOpen(true)}
            className="inline-flex lg:hidden h-10 items-center gap-2 border border-[#DFD4C6] bg-[#F2ECE3] px-4 text-xs font-medium text-[#2B231D]"
          >
            <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>

          <p className="text-xs text-[#6E6359] tabular-nums">
            Showing <strong className="font-semibold text-[#2B231D]">{filteredProducts.length}</strong> silhouettes
          </p>

          <div className="flex items-center gap-2">
            <label htmlFor="catalog-sort" className="text-xs text-[#6E6359] whitespace-nowrap">
              Sort by
            </label>
            <select
              id="catalog-sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="h-10 border border-[#DFD4C6] bg-[#FAF7F2] px-3 text-xs font-medium text-[#2B231D]"
            >
              <option value="featured">Curated Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="discount">Biggest Savings</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Quick Scroll Strip */}
      <div className="flex items-center gap-2 overflow-x-auto py-4 border-b border-[#EAE1D5]">
        <button
          type="button"
          onClick={() => setSelectedCategory('All')}
          className={`h-9 shrink-0 px-3.5 text-xs font-medium transition-colors whitespace-nowrap ${
            selectedCategory === 'All'
              ? 'bg-[#2B231D] text-[#FAF7F2]'
              : 'bg-[#F2ECE3] text-[#6E6359] hover:text-[#2B231D]'
          }`}
        >
          All ({departmentScopedProducts.length})
        </button>
        {categoryOptions.map((cat) => (
          <button
            key={cat}
            type="button"
            onClick={() => setSelectedCategory(cat)}
            className={`h-9 shrink-0 px-3.5 text-xs font-medium transition-colors whitespace-nowrap ${
              selectedCategory === cat
                ? 'bg-[#2B231D] text-[#FAF7F2]'
                : 'bg-[#F2ECE3] text-[#6E6359] hover:text-[#2B231D]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="mt-8 flex gap-10">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block w-64 shrink-0" aria-label="Catalog filters">
          {filterSidebarContent}
        </aside>

        {/* Product Grid */}
        <div className="flex-1 min-w-0">
          {filteredProducts.length === 0 ? (
            <div className="border border-[#E2D9CE] bg-[#F2ECE3] px-6 py-16 text-center">
              <p className="font-display text-3xl text-[#2B231D]">No footwear matches your filters</p>
              <p className="mt-2 text-sm text-[#6E6359]">
                Try broadening your size, tone, or price criteria to explore our full archive.
              </p>
              <button
                type="button"
                onClick={resetAllFilters}
                className="mt-6 inline-flex h-10 items-center bg-[#2B231D] px-6 text-xs font-medium tracking-wide text-[#FAF7F2] hover:bg-[#5C4332]"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 xl:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden" role="dialog" aria-modal="true" aria-label="Filter options">
          <div
            className="fixed inset-0 bg-[#2B231D]/45"
            onClick={() => setMobileFiltersOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 flex h-full w-full max-w-xs flex-col bg-[#FAF7F2] shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2D9CE] px-5 py-4">
              <span className="font-display text-2xl font-medium text-[#2B231D]">Filter Collection</span>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="Close filters"
                className="flex h-10 w-10 items-center justify-center text-[#2B231D]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">{filterSidebarContent}</div>
            <div className="border-t border-[#E2D9CE] p-4 bg-[#F2ECE3]">
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="h-11 w-full bg-[#2B231D] text-xs font-medium tracking-wide text-[#FAF7F2]"
              >
                View {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
