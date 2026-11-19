import { Heart, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getEffectivePrice } from '../data/catalog';
import { formatCurrency } from '../utils/whatsapp';
import { ProductImage } from './ProductImage';

export function WishlistDrawer() {
  const { wishlistProducts, isWishlistOpen, setIsWishlistOpen, toggleWishlist, addToCart } = useStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isWishlistOpen) setIsWishlistOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isWishlistOpen, setIsWishlistOpen]);

  if (!isWishlistOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Saved wishlist">
      <div
        className="fixed inset-0 bg-[#2B231D]/40 backdrop-blur-[1px]"
        onClick={() => setIsWishlistOpen(false)}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#FAF7F2] shadow-2xl border-l border-[#E2D9CE]">
        <div className="flex items-center justify-between border-b border-[#E2D9CE] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <Heart className="h-4.5 w-4.5 text-[#5C4332]" aria-hidden="true" />
            <h2 className="font-display text-2xl font-medium text-[#2B231D]">
              Saved Items <span className="text-base text-[#6E6359] tabular-nums">({wishlistProducts.length})</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsWishlistOpen(false)}
            aria-label="Close wishlist"
            className="flex h-10 w-10 items-center justify-center text-[#6E6359] hover:text-[#2B231D]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {wishlistProducts.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <Heart className="h-10 w-10 text-[#C9B5A0] mb-4" strokeWidth={1.25} aria-hidden="true" />
              <p className="font-display text-2xl text-[#2B231D]">No saved silhouettes yet</p>
              <p className="mt-2 max-w-xs text-sm text-[#6E6359]">
                Tap the heart icon on any sneaker, loafer, boot, or heel to curate your personal edit.
              </p>
              <Link
                to="/shoes"
                onClick={() => setIsWishlistOpen(false)}
                className="mt-6 inline-flex h-10 items-center bg-[#2B231D] px-6 text-xs font-medium tracking-wide text-[#FAF7F2] hover:bg-[#5C4332] transition-colors"
              >
                Browse Collections
              </Link>
            </div>
          ) : (
            wishlistProducts.map((product) => {
              const price = getEffectivePrice(product);
              const defaultSize = product.sizes[Math.floor(product.sizes.length / 2)] || product.sizes[0];
              const defaultColor = product.colors[0]?.name || 'Cream';

              return (
                <div key={product.id} className="flex gap-4 border-b border-[#EAE1D5] pb-5">
                  <Link
                    to={`/product/${product.slug}`}
                    onClick={() => setIsWishlistOpen(false)}
                    className="h-20 w-24 shrink-0 overflow-hidden bg-[#F2ECE3] border border-[#E5DDD2]"
                  >
                    <ProductImage src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/product/${product.slug}`}
                          onClick={() => setIsWishlistOpen(false)}
                          className="text-sm font-medium text-[#2B231D] hover:text-[#5C4332] line-clamp-1"
                        >
                          {product.name}
                        </Link>
                        <button
                          type="button"
                          onClick={() => toggleWishlist(product.id)}
                          aria-label={`Remove ${product.name} from wishlist`}
                          className="text-[#6E6359] hover:text-[#2B231D] p-1"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="mt-0.5 text-xs text-[#6E6359]">
                        {product.department === 'men' ? 'Men' : 'Women'} · {product.category}
                      </p>
                      <p className="mt-1 text-sm font-semibold text-[#2B231D] tabular-nums">{formatCurrency(price)}</p>
                    </div>

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setIsWishlistOpen(false);
                          addToCart(product.id, defaultSize, defaultColor, 1, true);
                        }}
                        className="inline-flex h-9 items-center gap-1.5 bg-[#2B231D] px-3.5 text-xs font-medium text-[#FAF7F2] hover:bg-[#5C4332] transition-colors"
                      >
                        <ShoppingBag className="h-3.5 w-3.5" aria-hidden="true" />
                        <span>Move to Bag</span>
                      </button>
                      <Link
                        to={`/product/${product.slug}`}
                        onClick={() => setIsWishlistOpen(false)}
                        className="inline-flex h-9 items-center border border-[#DFD4C6] px-3 text-xs font-medium text-[#2B231D] hover:bg-[#F2ECE3]"
                      >
                        Select Size
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
