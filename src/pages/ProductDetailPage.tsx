import { Check, ChevronDown, Heart, MessageCircle, Minus, Plus, Ruler, ShoppingBag, Star, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ProductCard } from '../components/ProductCard';
import { ProductImage } from '../components/ProductImage';
import { useStore } from '../context/StoreContext';
import {
  PRODUCTS,
  categoryToSlug,
  getDiscountPercentage,
  getEffectivePrice,
  getProductBySlug,
} from '../data/catalog';
import { usePageMeta } from '../hooks/usePageMeta';
import { buildProductOrderMessage, buildWhatsAppUrl, formatCurrency } from '../utils/whatsapp';

export function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = useMemo(() => (slug ? getProductBySlug(slug) : undefined), [slug]);
  const { addToCart, toggleWishlist, isWishlisted } = useStore();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [customerNote, setCustomerNote] = useState('');
  const [sizeError, setSizeError] = useState('');
  const [sizeGuideOpen, setSizeGuideOpen] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<'materials' | 'shipping'>('materials');

  useEffect(() => {
    if (!product) return;
    setSelectedImageIndex(0);
    setSelectedSize(product.sizes[Math.floor(product.sizes.length / 2)] || product.sizes[0]);
    setSelectedColor(product.colors[0]?.name || 'Cream');
    setQuantity(1);
    setSizeError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product]);

  usePageMeta({
    title: product ? product.name : 'Shoe Not Found',
    description: product
      ? product.description
      : 'Explore handcrafted men’s and women’s footwear from Solenne.',
  });

  if (!product) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="font-display text-4xl font-medium text-[#2B231D]">Silhouette not found</h1>
        <p className="mt-3 text-sm text-[#6E6359]">
          This style may have moved to our seasonal archive. Explore our full collection below.
        </p>
        <Link
          to="/shoes"
          className="mt-6 inline-flex h-11 items-center bg-[#2B231D] px-6 text-xs font-medium tracking-wide text-[#FAF7F2]"
        >
          Browse All Shoes
        </Link>
      </div>
    );
  }

  const effectivePrice = getEffectivePrice(product);
  const discountPct = getDiscountPercentage(product);
  const wishlisted = isWishlisted(product.id);
  const images = product.gallery.length > 0 ? product.gallery : [product.image];

  const stockLabel =
    product.stock <= 0
      ? 'Out of Stock'
      : product.stock <= 5
        ? `Low Stock · Only ${product.stock} left`
        : `In Stock · Ready to ship`;

  const handleAddToCart = () => {
    if (!selectedSize) {
      setSizeError('Please choose a shoe size before adding to your bag.');
      return;
    }
    setSizeError('');
    addToCart(product.id, selectedSize, selectedColor, quantity, true);
  };

  const whatsappDirectOrderUrl = buildWhatsAppUrl(
    buildProductOrderMessage({
      productName: product.name,
      sku: product.sku,
      department: product.department,
      category: product.category,
      size: selectedSize || product.sizes[0],
      colorName: selectedColor,
      quantity,
      unitPrice: effectivePrice,
      customerNote: customerNote.trim() || undefined,
    })
  );

  const relatedProducts = PRODUCTS.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.department === product.department)
  ).slice(0, 3);

  return (
    <div className="bg-[#FAF7F2] pb-20 md:pb-12">
      <div className="mx-auto max-w-7xl px-4 pt-6 pb-16 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-2 text-xs text-[#6E6359] mb-8">
          <Link to="/" className="hover:text-[#2B231D]">
            Home
          </Link>
          <span aria-hidden="true">/</span>
          <Link to={`/${product.department}`} className="hover:text-[#2B231D]">
            {product.department === 'men' ? "Men's Collection" : "Women's Collection"}
          </Link>
          <span aria-hidden="true">/</span>
          <Link
            to={`/${product.department}/${categoryToSlug(product.category)}`}
            className="hover:text-[#2B231D]"
          >
            {product.category}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-[#2B231D]">{product.name}</span>
        </nav>

        {/* Contiguous Sticky Gallery + Sticky Purchase Module */}
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          {/* Left: Gallery */}
          <div className="lg:col-span-7 lg:sticky lg:top-24 space-y-4">
            <div className="aspect-[4/3] w-full overflow-hidden bg-[#F2ECE3] border border-[#E2D9CE]">
              <ProductImage
                src={images[selectedImageIndex] || product.image}
                alt={`${product.name} — view ${selectedImageIndex + 1}`}
                loading="eager"
                className="h-full w-full object-cover"
              />
            </div>

            {images.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {images.map((img, idx) => (
                  <button
                    key={`${img}-${idx}`}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={`aspect-[4/3] overflow-hidden border transition-colors ${
                      selectedImageIndex === idx ? 'border-[#2B231D]' : 'border-[#E2D9CE] opacity-75 hover:opacity-100'
                    }`}
                  >
                    <ProductImage src={img} alt={`${product.name} thumbnail ${idx + 1}`} className="h-full w-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Contiguous Purchase Module */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-6">
            <div>
              <div className="flex items-center justify-between gap-2 text-xs text-[#6E6359]">
                <span>
                  {product.department === 'men' ? "Men's" : "Women's"} · {product.category} · {product.sku}
                </span>
                <span className="inline-flex items-center gap-1 text-[#2B231D] tabular-nums">
                  <Star className="h-3.5 w-3.5 fill-[#5C4332] text-[#5C4332]" aria-hidden="true" />
                  {product.rating.toFixed(1)} ({product.reviewCount})
                </span>
              </div>

              <h1 className="mt-2 font-display text-3xl sm:text-4xl font-medium text-[#2B231D] text-balance">
                {product.name}
              </h1>

              <div className="mt-3 flex items-baseline gap-3 tabular-nums">
                <span className="text-2xl font-semibold text-[#2B231D]">{formatCurrency(effectivePrice)}</span>
                {discountPct > 0 && (
                  <>
                    <span className="text-base text-[#6E6359] line-through">{formatCurrency(product.price)}</span>
                    <span className="text-xs font-medium text-[#5C4332]">Save {discountPct}%</span>
                  </>
                )}
              </div>

              <p className="mt-2 text-xs font-medium text-[#5C4332]">{stockLabel}</p>
            </div>

            <p className="text-sm leading-relaxed text-[#6E6359]">{product.description}</p>

            {/* Color Selection */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-medium uppercase tracking-wider text-[#5C4332]">Tone</span>
                <span className="text-[#2B231D] font-medium">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {product.colors.map((color) => {
                  const active = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      type="button"
                      onClick={() => setSelectedColor(color.name)}
                      className={`inline-flex h-10 items-center gap-2 border px-3 text-xs transition-colors ${
                        active
                          ? 'border-[#2B231D] bg-[#F2ECE3] font-medium text-[#2B231D]'
                          : 'border-[#DFD4C6] text-[#6E6359] hover:text-[#2B231D]'
                      }`}
                    >
                      <span
                        className="h-3.5 w-3.5 rounded-full border border-[#C9B5A0]"
                        style={{ backgroundColor: color.hex }}
                      />
                      <span>{color.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex items-center justify-between text-xs mb-2.5">
                <span className="font-medium uppercase tracking-wider text-[#5C4332]">Select Size</span>
                <button
                  type="button"
                  onClick={() => setSizeGuideOpen(true)}
                  className="inline-flex items-center gap-1 text-[#5C4332] hover:text-[#2B231D] underline underline-offset-4"
                >
                  <Ruler className="h-3.5 w-3.5" aria-hidden="true" />
                  <span>Size Guide</span>
                </button>
              </div>
              <div className="grid grid-cols-3 gap-2">
                {product.sizes.map((size) => {
                  const active = selectedSize === size;
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => {
                        setSelectedSize(size);
                        setSizeError('');
                      }}
                      className={`h-11 border text-xs font-medium tabular-nums transition-colors ${
                        active
                          ? 'border-[#2B231D] bg-[#2B231D] text-[#FAF7F2]'
                          : 'border-[#DFD4C6] text-[#2B231D] hover:bg-[#F2ECE3]'
                      }`}
                    >
                      {size}
                    </button>
                  );
                })}
              </div>
              {sizeError && <p className="mt-2 text-xs text-[#8C3B2B]">{sizeError}</p>}
            </div>

            {/* Quantity & Primary Actions */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center gap-3">
                <div className="inline-flex h-12 items-center border border-[#DFD4C6] bg-[#FAF7F2]">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                    className="flex h-full w-11 items-center justify-center text-[#2B231D] hover:bg-[#F2ECE3]"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-10 text-center text-sm font-medium tabular-nums">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                    aria-label="Increase quantity"
                    className="flex h-full w-11 items-center justify-center text-[#2B231D] hover:bg-[#F2ECE3]"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  className="flex h-12 flex-1 items-center justify-center gap-2 bg-[#2B231D] px-6 text-xs font-medium tracking-wider uppercase text-[#FAF7F2] hover:bg-[#5C4332] transition-colors disabled:opacity-50"
                >
                  <ShoppingBag className="h-4 w-4" aria-hidden="true" />
                  <span>{product.stock > 0 ? 'Add to Bag' : 'Out of Stock'}</span>
                </button>

                <button
                  type="button"
                  onClick={() => toggleWishlist(product.id)}
                  aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
                  className="flex h-12 w-12 shrink-0 items-center justify-center border border-[#DFD4C6] text-[#2B231D] hover:bg-[#F2ECE3]"
                >
                  <Heart className={`h-4.5 w-4.5 ${wishlisted ? 'fill-[#5C4332] text-[#5C4332]' : ''}`} />
                </button>
              </div>

              {/* Direct WhatsApp Ordering */}
              <div className="border border-[#DFD4C6] bg-[#F2ECE3] p-4 space-y-2.5">
                <label htmlFor="wa-note" className="block text-xs font-medium text-[#3D2B1F]">
                  Optional note for WhatsApp order (e.g., wide-fit request or gift wrap)
                </label>
                <input
                  id="wa-note"
                  type="text"
                  value={customerNote}
                  onChange={(e) => setCustomerNote(e.target.value)}
                  placeholder="Optional sizing or delivery note..."
                  className="h-10 w-full border border-[#DFD4C6] bg-[#FAF7F2] px-3 text-xs text-[#2B231D] placeholder:text-[#6E6359]"
                />
                <a
                  href={whatsappDirectOrderUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-11 w-full items-center justify-center gap-2 bg-[#5C4332] px-4 text-xs font-medium tracking-wide text-[#FAF7F2] hover:bg-[#3D2B1F] transition-colors"
                >
                  <MessageCircle className="h-4 w-4" aria-hidden="true" />
                  <span>Order Directly via WhatsApp ({formatCurrency(effectivePrice * quantity)})</span>
                </a>
              </div>
            </div>

            {/* Materials & Shipping Accordions */}
            <div className="border-t border-[#E2D9CE] divide-y divide-[#E2D9CE]">
              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'materials' ? 'shipping' : 'materials')}
                  className="flex w-full items-center justify-between py-4 text-left text-xs font-semibold tracking-wider uppercase text-[#2B231D]"
                >
                  <span>Materials &amp; Construction</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${openAccordion === 'materials' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openAccordion === 'materials' && (
                  <dl className="pb-4 space-y-2 text-xs text-[#6E6359]">
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#2B231D] font-medium">Upper</dt>
                      <dd className="text-right">{product.upperMaterial}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#2B231D] font-medium">Lining</dt>
                      <dd className="text-right">{product.liningMaterial}</dd>
                    </div>
                    <div className="flex justify-between gap-4">
                      <dt className="text-[#2B231D] font-medium">Sole / Heel</dt>
                      <dd className="text-right tabular-nums">{product.soleHeight}</dd>
                    </div>
                    <p className="pt-1 leading-relaxed">{product.craftsmanshipNotes}</p>
                  </dl>
                )}
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => setOpenAccordion(openAccordion === 'shipping' ? 'materials' : 'shipping')}
                  className="flex w-full items-center justify-between py-4 text-left text-xs font-semibold tracking-wider uppercase text-[#2B231D]"
                >
                  <span>Shipping &amp; 30-Day Exchanges</span>
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${openAccordion === 'shipping' ? 'rotate-180' : ''}`}
                  />
                </button>
                {openAccordion === 'shipping' && (
                  <ul className="pb-4 space-y-2 text-xs text-[#6E6359]">
                    <li className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 mt-0.5 text-[#5C4332] shrink-0" />
                      <span>Complimentary standard shipping on orders over PKR 15,000 (3–5 business days).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 mt-0.5 text-[#5C4332] shrink-0" />
                      <span>Includes cotton dust bag and spare waxed laces where applicable.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="h-3.5 w-3.5 mt-0.5 text-[#5C4332] shrink-0" />
                      <span>Complimentary size exchanges within 30 days of delivery.</span>
                    </li>
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Related Footwear */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 border-t border-[#E2D9CE] pt-12">
            <h2 className="font-display text-3xl font-medium text-[#2B231D] mb-8">Complementary Silhouettes</h2>
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {relatedProducts.map((rel) => (
                <ProductCard key={rel.id} product={rel} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Mobile Sticky Bottom Buy Bar (compact <= 64px) */}
      <div className="fixed inset-x-0 bottom-0 z-20 flex md:hidden items-center justify-between gap-3 border-t border-[#E2D9CE] bg-[#FAF7F2]/95 px-4 py-2.5 backdrop-blur-sm">
        <div className="min-w-0">
          <p className="text-xs font-medium text-[#2B231D] truncate">{product.name}</p>
          <p className="text-xs font-semibold text-[#5C4332] tabular-nums">
            {formatCurrency(effectivePrice)} · {selectedSize}
          </p>
        </div>
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={product.stock <= 0}
          className="h-10 shrink-0 bg-[#2B231D] px-5 text-xs font-medium text-[#FAF7F2]"
        >
          Add to Bag
        </button>
      </div>

      {/* Size Guide Modal */}
      {sizeGuideOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          role="dialog"
          aria-modal="true"
          aria-label="Footwear Size Guide"
        >
          <div
            className="fixed inset-0 bg-[#2B231D]/45"
            onClick={() => setSizeGuideOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 w-full max-w-lg bg-[#FAF7F2] border border-[#DFD4C6] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E2D9CE] pb-3 mb-4">
              <h2 className="font-display text-2xl font-medium text-[#2B231D]">Solenne Size Conversion</h2>
              <button
                type="button"
                onClick={() => setSizeGuideOpen(false)}
                aria-label="Close size guide"
                className="flex h-9 w-9 items-center justify-center text-[#6E6359] hover:text-[#2B231D]"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-[#6E6359] mb-4">
              Our shoes run true to standard US/EU sizing. If you are between sizes in pointed heels or boots, size up
              half a step.
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs tabular-nums border-collapse">
                <thead>
                  <tr className="border-b border-[#DFD4C6] text-[#5C4332]">
                    <th className="py-2 pr-4 font-semibold">Department</th>
                    <th className="py-2 pr-4 font-semibold">US</th>
                    <th className="py-2 pr-4 font-semibold">EU</th>
                    <th className="py-2 pr-4 font-semibold">UK</th>
                    <th className="py-2 font-semibold">Foot Length (cm)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EAE1D5] text-[#2B231D]">
                  <tr>
                    <td className="py-2 pr-4">Women</td>
                    <td className="py-2 pr-4">US 6</td>
                    <td className="py-2 pr-4">36–37</td>
                    <td className="py-2 pr-4">4</td>
                    <td className="py-2">23.0 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Women</td>
                    <td className="py-2 pr-4">US 8</td>
                    <td className="py-2 pr-4">38–39</td>
                    <td className="py-2 pr-4">6</td>
                    <td className="py-2">24.6 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Men</td>
                    <td className="py-2 pr-4">US 9</td>
                    <td className="py-2 pr-4">42</td>
                    <td className="py-2 pr-4">8</td>
                    <td className="py-2">26.8 cm</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4">Men</td>
                    <td className="py-2 pr-4">US 11</td>
                    <td className="py-2 pr-4">44</td>
                    <td className="py-2 pr-4">10</td>
                    <td className="py-2">28.4 cm</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
