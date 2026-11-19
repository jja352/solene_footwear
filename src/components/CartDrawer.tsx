import { MessageCircle, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { STORE_CONFIG } from '../config/store';
import { useStore } from '../context/StoreContext';
import { buildCartCheckoutMessage, buildWhatsAppUrl, formatCurrency } from '../utils/whatsapp';
import { ProductImage } from './ProductImage';

export function CartDrawer() {
  const {
    hydratedCart,
    cartCount,
    subtotal,
    discountAmount,
    standardShippingFee,
    isCartOpen,
    setIsCartOpen,
    updateCartQuantity,
    removeFromCart,
  } = useStore();

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isCartOpen) setIsCartOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isCartOpen, setIsCartOpen]);

  if (!isCartOpen) return null;

  const netSubtotal = Math.max(0, subtotal - discountAmount);
  const remainingForFreeShipping = Math.max(0, STORE_CONFIG.freeShippingThreshold - netSubtotal);
  const progressPct = Math.min(100, Math.round((netSubtotal / STORE_CONFIG.freeShippingThreshold) * 100));
  const estimatedTotal = netSubtotal + standardShippingFee;

  const whatsappQuickOrderHref = buildWhatsAppUrl(
    buildCartCheckoutMessage({
      items: hydratedCart.map((item) => ({
        name: item.product.name,
        size: item.size,
        colorName: item.colorName,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        lineTotal: item.lineTotal,
      })),
      subtotal,
      discountAmount,
      shippingFee: standardShippingFee,
      total: estimatedTotal,
    })
  );

  return (
    <div className="fixed inset-0 z-50 flex justify-end" role="dialog" aria-modal="true" aria-label="Shopping bag">
      <div
        className="fixed inset-0 bg-[#2B231D]/40 backdrop-blur-[1px]"
        onClick={() => setIsCartOpen(false)}
        aria-hidden="true"
      />

      <div className="relative z-10 flex h-full w-full max-w-md flex-col bg-[#FAF7F2] shadow-2xl border-l border-[#E2D9CE]">
        <div className="flex items-center justify-between border-b border-[#E2D9CE] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="h-4.5 w-4.5 text-[#5C4332]" aria-hidden="true" />
            <h2 className="font-display text-2xl font-medium text-[#2B231D]">
              Shopping Bag <span className="text-base text-[#6E6359] tabular-nums">({cartCount})</span>
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(false)}
            aria-label="Close shopping bag"
            className="flex h-10 w-10 items-center justify-center text-[#6E6359] hover:text-[#2B231D]"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {hydratedCart.length > 0 && (
          <div className="border-b border-[#EAE1D5] bg-[#F2ECE3] px-6 py-3">
            <p className="text-xs text-[#3D2B1F] tabular-nums">
              {remainingForFreeShipping === 0
                ? 'Complimentary express-ready standard shipping unlocked.'
                : `Add ${formatCurrency(remainingForFreeShipping)} more for complimentary shipping.`}
            </p>
            <div className="mt-2 h-1 w-full bg-[#DFD4C6] overflow-hidden">
              <div
                className="h-full bg-[#5C4332] transition-all duration-300"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
          {hydratedCart.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center py-12">
              <ShoppingBag className="h-10 w-10 text-[#C9B5A0] mb-4" strokeWidth={1.25} aria-hidden="true" />
              <p className="font-display text-2xl text-[#2B231D]">Your bag is empty</p>
              <p className="mt-2 max-w-xs text-sm text-[#6E6359]">
                Explore our handcrafted sneakers, loafers, boots, and heels in warm neutral tones.
              </p>
              <Link
                to="/shoes"
                onClick={() => setIsCartOpen(false)}
                className="mt-6 inline-flex h-10 items-center bg-[#2B231D] px-6 text-xs font-medium tracking-wide text-[#FAF7F2] hover:bg-[#5C4332] transition-colors"
              >
                Explore All Shoes
              </Link>
            </div>
          ) : (
            hydratedCart.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.colorName}`}
                className="flex gap-4 border-b border-[#EAE1D5] pb-5"
              >
                <Link
                  to={`/product/${item.product.slug}`}
                  onClick={() => setIsCartOpen(false)}
                  className="h-20 w-24 shrink-0 overflow-hidden bg-[#F2ECE3] border border-[#E5DDD2]"
                >
                  <ProductImage
                    src={item.product.image}
                    alt={item.product.name}
                    className="h-full w-full object-cover"
                  />
                </Link>

                <div className="flex flex-1 flex-col justify-between min-w-0">
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <Link
                        to={`/product/${item.product.slug}`}
                        onClick={() => setIsCartOpen(false)}
                        className="text-sm font-medium text-[#2B231D] hover:text-[#5C4332] line-clamp-1"
                      >
                        {item.product.name}
                      </Link>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.size, item.colorName)}
                        aria-label={`Remove ${item.product.name}`}
                        className="text-[#6E6359] hover:text-[#2B231D] p-1"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                    <p className="mt-0.5 text-xs text-[#6E6359]">
                      {item.size} · {item.colorName}
                    </p>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <div className="inline-flex items-center border border-[#DFD4C6] bg-[#FAF7F2]">
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.productId, item.size, item.colorName, item.quantity - 1)
                        }
                        aria-label="Decrease quantity"
                        className="flex h-8 w-8 items-center justify-center text-[#2B231D] hover:bg-[#F2ECE3]"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center text-xs font-medium tabular-nums">{item.quantity}</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCartQuantity(item.productId, item.size, item.colorName, item.quantity + 1)
                        }
                        aria-label="Increase quantity"
                        className="flex h-8 w-8 items-center justify-center text-[#2B231D] hover:bg-[#F2ECE3]"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <span className="text-sm font-semibold text-[#2B231D] tabular-nums">
                      {formatCurrency(item.lineTotal)}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {hydratedCart.length > 0 && (
          <div className="border-t border-[#E2D9CE] bg-[#F2ECE3] px-6 py-5 space-y-3">
            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between text-[#6E6359]">
                <span>Subtotal</span>
                <span className="tabular-nums text-[#2B231D]">{formatCurrency(subtotal)}</span>
              </div>
              {discountAmount > 0 && (
                <div className="flex justify-between text-[#5C4332]">
                  <span>Promo Discount</span>
                  <span className="tabular-nums">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between text-[#6E6359]">
                <span>Shipping</span>
                <span className="tabular-nums text-[#2B231D]">
                  {standardShippingFee === 0 ? 'Complimentary' : formatCurrency(standardShippingFee)}
                </span>
              </div>
              <div className="flex justify-between border-t border-[#DFD4C6] pt-2 text-base font-semibold text-[#2B231D]">
                <span>Estimated Total</span>
                <span className="tabular-nums">{formatCurrency(estimatedTotal)}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5 pt-1">
              <Link
                to="/cart"
                onClick={() => setIsCartOpen(false)}
                className="flex h-11 items-center justify-center border border-[#2B231D] text-xs font-medium tracking-wide text-[#2B231D] hover:bg-[#EAE1D5] transition-colors"
              >
                View Bag
              </Link>
              <Link
                to="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="flex h-11 items-center justify-center bg-[#2B231D] text-xs font-medium tracking-wide text-[#FAF7F2] hover:bg-[#5C4332] transition-colors"
              >
                Checkout
              </Link>
            </div>

            <a
              href={whatsappQuickOrderHref}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-10 w-full items-center justify-center gap-2 border border-[#5C4332] bg-[#FAF7F2] text-xs font-medium tracking-wide text-[#5C4332] hover:bg-[#5C4332] hover:text-[#FAF7F2] transition-colors"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>Order Bag via WhatsApp</span>
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
