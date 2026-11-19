import { ArrowRight, MessageCircle, Minus, Plus, ShoppingBag, Tag, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductImage } from '../components/ProductImage';
import { STORE_CONFIG } from '../config/store';
import { useStore } from '../context/StoreContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildCartCheckoutMessage, buildWhatsAppUrl, formatCurrency } from '../utils/whatsapp';

export function CartPage() {
  usePageMeta({
    title: 'Shopping Bag',
    description: 'Review your selected Solenne footwear silhouettes, apply promotional privileges, and proceed to checkout or WhatsApp ordering.',
  });

  const {
    hydratedCart,
    subtotal,
    promoCode,
    promoError,
    discountAmount,
    standardShippingFee,
    updateCartQuantity,
    removeFromCart,
    applyPromoCode,
    clearPromoCode,
  } = useStore();

  const [codeInput, setCodeInput] = useState(promoCode);
  const netSubtotal = Math.max(0, subtotal - discountAmount);
  const total = netSubtotal + standardShippingFee;

  const handlePromoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    applyPromoCode(codeInput);
  };

  const whatsappBagUrl = buildWhatsAppUrl(
    buildCartCheckoutMessage({
      items: hydratedCart.map((i) => ({
        name: i.product.name,
        size: i.size,
        colorName: i.colorName,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        lineTotal: i.lineTotal,
      })),
      subtotal,
      discountAmount,
      shippingFee: standardShippingFee,
      total,
    })
  );

  return (
    <div className="bg-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="font-display text-4xl sm:text-5xl font-medium text-[#2B231D]">Shopping Bag</h1>
        <p className="mt-2 text-sm text-[#6E6359]">
          Complimentary standard courier shipping applies automatically on orders over{' '}
          {formatCurrency(STORE_CONFIG.freeShippingThreshold)}.
        </p>

        {hydratedCart.length === 0 ? (
          <div className="mt-10 border border-[#E2D9CE] bg-[#F2ECE3] px-6 py-16 text-center">
            <ShoppingBag className="mx-auto h-10 w-10 text-[#C9B5A0] mb-4" strokeWidth={1.25} aria-hidden="true" />
            <h2 className="font-display text-3xl text-[#2B231D]">Your shopping bag is empty</h2>
            <p className="mt-2 max-w-md mx-auto text-sm text-[#6E6359]">
              Browse our Men’s and Women’s collections to add sneakers, loafers, boots, or heels.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Link
                to="/women"
                className="inline-flex h-11 items-center bg-[#2B231D] px-6 text-xs font-medium tracking-wide text-[#FAF7F2] hover:bg-[#5C4332]"
              >
                Shop Women
              </Link>
              <Link
                to="/men"
                className="inline-flex h-11 items-center border border-[#2B231D] px-6 text-xs font-medium tracking-wide text-[#2B231D] hover:bg-[#FAF7F2]"
              >
                Shop Men
              </Link>
            </div>
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            {/* Cart Line Items */}
            <div className="lg:col-span-8 divide-y divide-[#E2D9CE] border-t border-b border-[#E2D9CE]">
              {hydratedCart.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.colorName}`}
                  className="flex flex-col sm:flex-row gap-5 py-6"
                >
                  <Link
                    to={`/product/${item.product.slug}`}
                    className="aspect-[4/3] w-full sm:w-40 shrink-0 overflow-hidden bg-[#F2ECE3] border border-[#E2D9CE]"
                  >
                    <ProductImage src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                  </Link>

                  <div className="flex flex-1 flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-xs text-[#6E6359]">
                          {item.product.department === 'men' ? 'Men' : 'Women'} · {item.product.category}
                        </p>
                        <Link
                          to={`/product/${item.product.slug}`}
                          className="mt-1 block text-lg font-medium text-[#2B231D] hover:text-[#5C4332]"
                        >
                          {item.product.name}
                        </Link>
                        <p className="mt-1 text-xs text-[#6E6359]">
                          Size: <span className="text-[#2B231D] font-medium">{item.size}</span> · Tone:{' '}
                          <span className="text-[#2B231D] font-medium">{item.colorName}</span>
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeFromCart(item.productId, item.size, item.colorName)}
                        aria-label={`Remove ${item.product.name}`}
                        className="flex h-9 w-9 items-center justify-center text-[#6E6359] hover:text-[#2B231D]"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="inline-flex items-center border border-[#DFD4C6] bg-[#FAF7F2]">
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.productId, item.size, item.colorName, item.quantity - 1)
                          }
                          aria-label="Decrease quantity"
                          className="flex h-10 w-10 items-center justify-center text-[#2B231D] hover:bg-[#F2ECE3]"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-10 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                        <button
                          type="button"
                          onClick={() =>
                            updateCartQuantity(item.productId, item.size, item.colorName, item.quantity + 1)
                          }
                          aria-label="Increase quantity"
                          className="flex h-10 w-10 items-center justify-center text-[#2B231D] hover:bg-[#F2ECE3]"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>

                      <div className="text-right tabular-nums">
                        <p className="text-base font-semibold text-[#2B231D]">{formatCurrency(item.lineTotal)}</p>
                        {item.quantity > 1 && (
                          <p className="text-xs text-[#6E6359]">{formatCurrency(item.unitPrice)} each</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Order Summary Card */}
            <aside className="lg:col-span-4 border border-[#E2D9CE] bg-[#F2ECE3] p-6 space-y-6">
              <h2 className="font-display text-2xl font-medium text-[#2B231D]">Order Summary</h2>

              <form onSubmit={handlePromoSubmit} className="space-y-2">
                <label htmlFor="promo-code" className="block text-xs font-medium text-[#5C4332]">
                  Privilege Code (Try <span className="font-semibold">SOLENNE10</span> or{' '}
                  <span className="font-semibold">ATELIER20</span>)
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag
                      className="pointer-events-none absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-[#6E6359]"
                      aria-hidden="true"
                    />
                    <input
                      id="promo-code"
                      type="text"
                      value={codeInput}
                      onChange={(e) => setCodeInput(e.target.value)}
                      placeholder="Enter code"
                      className="h-10 w-full border border-[#DFD4C6] bg-[#FAF7F2] pl-8 pr-3 text-xs uppercase text-[#2B231D]"
                    />
                  </div>
                  {promoCode ? (
                    <button
                      type="button"
                      onClick={() => {
                        clearPromoCode();
                        setCodeInput('');
                      }}
                      className="h-10 border border-[#5C4332] px-3 text-xs font-medium text-[#5C4332]"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="h-10 bg-[#2B231D] px-4 text-xs font-medium text-[#FAF7F2] hover:bg-[#5C4332]"
                    >
                      Apply
                    </button>
                  )}
                </div>
                {promoError && <p className="text-xs text-[#8C3B2B]">{promoError}</p>}
              </form>

              <div className="space-y-2.5 border-t border-[#DFD4C6] pt-4 text-sm">
                <div className="flex justify-between text-[#6E6359]">
                  <span>Subtotal</span>
                  <span className="tabular-nums text-[#2B231D]">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#5C4332]">
                    <span>Discount ({promoCode})</span>
                    <span className="tabular-nums">-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6E6359]">
                  <span>Standard Shipping</span>
                  <span className="tabular-nums text-[#2B231D]">
                    {standardShippingFee === 0 ? 'Complimentary' : formatCurrency(standardShippingFee)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#DFD4C6] pt-3 text-base font-semibold text-[#2B231D]">
                  <span>Estimated Total</span>
                  <span className="tabular-nums">{formatCurrency(total)}</span>
                </div>
              </div>

              <div className="space-y-2.5">
                <Link
                  to="/checkout"
                  className="flex h-11 w-full items-center justify-center gap-2 bg-[#2B231D] text-xs font-medium tracking-wider uppercase text-[#FAF7F2] hover:bg-[#5C4332] transition-colors"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                </Link>
                <a
                  href={whatsappBagUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-full items-center justify-center gap-2 border border-[#5C4332] bg-[#FAF7F2] text-xs font-medium tracking-wide text-[#5C4332] hover:bg-[#5C4332] hover:text-[#FAF7F2] transition-colors"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Direct Order via WhatsApp</span>
                </a>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}
