import { ArrowRight, Search, X } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { PRODUCTS, getEffectivePrice } from '../data/catalog';
import { formatCurrency } from '../utils/whatsapp';
import { ProductImage } from './ProductImage';

export function SearchOverlay() {
  const { isSearchOpen, setIsSearchOpen } = useStore();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isSearchOpen) {
      window.setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSearchOpen) setIsSearchOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isSearchOpen, setIsSearchOpen]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return PRODUCTS.slice(0, 6);
    return PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.department.toLowerCase().includes(q) ||
        p.upperMaterial.toLowerCase().includes(q) ||
        p.colors.some((c) => c.name.toLowerCase().includes(q))
    ).slice(0, 8);
  }, [query]);

  if (!isSearchOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearchOpen(false);
    navigate(`/shoes${query.trim() ? `?q=${encodeURIComponent(query.trim())}` : ''}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center pt-14 sm:pt-20 px-4"
      role="dialog"
      aria-modal="true"
      aria-label="Search footwear catalog"
    >
      <div
        className="fixed inset-0 bg-[#2B231D]/45 backdrop-blur-[1px]"
        onClick={() => setIsSearchOpen(false)}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-2xl bg-[#FAF7F2] border border-[#DFD4C6] shadow-2xl">
        <form onSubmit={handleSubmit} className="flex items-center border-b border-[#E2D9CE] px-4 py-3.5 gap-3">
          <Search className="h-5 w-5 text-[#6E6359] shrink-0" aria-hidden="true" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search sneakers, loafers, Chelsea boots, nude heels..."
            className="w-full bg-transparent text-sm sm:text-base text-[#2B231D] placeholder:text-[#6E6359] focus:outline-none"
          />
          <button
            type="button"
            onClick={() => setIsSearchOpen(false)}
            aria-label="Close search"
            className="flex h-9 w-9 items-center justify-center text-[#6E6359] hover:text-[#2B231D]"
          >
            <X className="h-5 w-5" />
          </button>
        </form>

        <div className="max-h-[65vh] overflow-y-auto p-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium tracking-wider uppercase text-[#6E6359]">
              {query.trim() ? `Matches (${results.length})` : 'Popular Silhouettes'}
            </span>
            <button
              type="button"
              onClick={handleSubmit}
              className="inline-flex items-center gap-1 text-xs font-medium text-[#5C4332] hover:text-[#2B231D]"
            >
              <span>View all results</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>

          {results.length === 0 ? (
            <div className="py-10 text-center">
              <p className="text-sm text-[#6E6359]">No footwear matched "{query}". Try "loafer", "boot", or "sandal".</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/product/${product.slug}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="flex items-center gap-3 p-2 border border-transparent hover:border-[#E2D9CE] hover:bg-[#F2ECE3] transition-colors"
                >
                  <div className="h-14 w-16 shrink-0 overflow-hidden bg-[#F2ECE3]">
                    <ProductImage src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-[#6E6359]">
                      {product.department === 'men' ? 'Men' : 'Women'} · {product.category}
                    </p>
                    <p className="text-sm font-medium text-[#2B231D] truncate">{product.name}</p>
                    <p className="text-xs font-semibold text-[#5C4332] tabular-nums">
                      {formatCurrency(getEffectivePrice(product))}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
