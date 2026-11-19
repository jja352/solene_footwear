import { Heart, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore } from '../context/StoreContext';
import { getDiscountPercentage, getEffectivePrice } from '../data/catalog';
import { Product } from '../types/shop';
import { formatCurrency } from '../utils/whatsapp';
import { ProductImage } from './ProductImage';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart, toggleWishlist, isWishlisted } = useStore();
  const wishlisted = isWishlisted(product.id);
  const discountPct = getDiscountPercentage(product);
  const effectivePrice = getEffectivePrice(product);

  const subtleTag =
    discountPct > 0
      ? `Save ${discountPct}%`
      : product.sections.includes('newArrival')
        ? 'New Arrival'
        : product.sections.includes('exclusive')
          ? 'Limited Run'
          : null;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const defaultSize = product.sizes[Math.floor(product.sizes.length / 2)] || product.sizes[0];
    const defaultColor = product.colors[0]?.name || 'Cream';
    addToCart(product.id, defaultSize, defaultColor, 1, true);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <article className="group flex flex-col bg-[#FAF7F2] transition-transform duration-200 hover:-translate-y-0.5">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-sm bg-[#F2ECE3] border border-[#E5DDD2]">
        <Link to={`/product/${product.slug}`} className="block h-full w-full" aria-label={`View ${product.name}`}>
          <ProductImage
            src={product.image}
            alt={`${product.name} in ${product.colors[0]?.name ?? 'neutral tone'}`}
            className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
          />
        </Link>

        {subtleTag && (
          <span className="pointer-events-none absolute top-3 left-3 text-[11px] font-medium tracking-wider uppercase text-[#3D2B1F] bg-[#FAF7F2]/90 px-2 py-0.5">
            {subtleTag}
          </span>
        )}

        <button
          type="button"
          onClick={handleWishlist}
          aria-label={wishlisted ? `Remove ${product.name} from wishlist` : `Save ${product.name} to wishlist`}
          aria-pressed={wishlisted}
          className="absolute top-2.5 right-2.5 flex h-10 w-10 items-center justify-center rounded-full bg-[#FAF7F2]/90 text-[#2B231D] transition-colors hover:bg-[#FAF7F2]"
        >
          <Heart className={`h-4 w-4 ${wishlisted ? 'fill-[#5C4332] text-[#5C4332]' : 'text-[#2B231D]'}`} />
        </button>

        <button
          type="button"
          onClick={handleQuickAdd}
          disabled={product.stock <= 0}
          className="absolute right-3 bottom-3 flex h-10 items-center gap-1.5 bg-[#2B231D] px-3.5 text-xs font-medium tracking-wide text-[#FAF7F2] opacity-100 md:opacity-0 md:group-hover:opacity-100 md:focus-visible:opacity-100 transition-opacity duration-200 hover:bg-[#5C4332] disabled:opacity-50 whitespace-nowrap"
        >
          <Plus className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{product.stock > 0 ? 'Quick Add' : 'Sold Out'}</span>
        </button>
      </div>

      <div className="pt-3.5 flex flex-col gap-1">
        <div className="flex items-center justify-between gap-2 text-xs text-[#6E6359]">
          <span className="truncate">
            {product.department === 'men' ? 'Men' : 'Women'} · {product.category}
          </span>
          <div className="flex items-center gap-1.5 shrink-0" aria-label="Available colors">
            {product.colors.slice(0, 3).map((c) => (
              <span
                key={c.name}
                title={c.name}
                className="h-2.5 w-2.5 rounded-full border border-[#C9B5A0]"
                style={{ backgroundColor: c.hex }}
              />
            ))}
          </div>
        </div>

        <Link
          to={`/product/${product.slug}`}
          className="text-base font-medium text-[#2B231D] hover:text-[#5C4332] transition-colors line-clamp-1"
        >
          {product.name}
        </Link>

        <div className="flex items-baseline gap-2 pt-0.5 tabular-nums">
          <span className="text-[15px] font-semibold text-[#2B231D]">{formatCurrency(effectivePrice)}</span>
          {discountPct > 0 && (
            <span className="text-xs text-[#6E6359] line-through">{formatCurrency(product.price)}</span>
          )}
        </div>
      </div>
    </article>
  );
}
