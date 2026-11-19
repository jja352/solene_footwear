import { CheckCircle2, MessageCircle, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ProductImage } from '../components/ProductImage';
import { STORE_CONFIG } from '../config/store';
import { useStore } from '../context/StoreContext';
import { usePageMeta } from '../hooks/usePageMeta';
import { CheckoutFormData, OrderRecord } from '../types/shop';
import { buildCartCheckoutMessage, buildWhatsAppUrl, formatCurrency } from '../utils/whatsapp';

export function CheckoutPage() {
  usePageMeta({
    title: 'Checkout',
    description: 'Complete your Solenne Footwear order with standard or express delivery and direct WhatsApp confirmation.',
  });

  const { hydratedCart, subtotal, discountAmount, standardShippingFee, clearCart, recordOrder, lastOrder } =
    useStore();

  const [form, setForm] = useState<CheckoutFormData>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: 'Pakistan',
    deliveryMethod: 'standard',
    paymentMethod: 'whatsapp',
    notes: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CheckoutFormData, string>>>({});
  const [confirmedOrder, setConfirmedOrder] = useState<OrderRecord | null>(null);

  const shippingFee =
    hydratedCart.length === 0
      ? 0
      : form.deliveryMethod === 'express'
        ? STORE_CONFIG.expressShippingFee
        : standardShippingFee;

  const netSubtotal = Math.max(0, subtotal - discountAmount);
  const total = netSubtotal + shippingFee;

  const updateField = <K extends keyof CheckoutFormData>(field: K, value: CheckoutFormData[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validate = (): boolean => {
    const nextErrors: Partial<Record<keyof CheckoutFormData, string>> = {};
    if (!form.fullName.trim() || form.fullName.trim().length < 2) {
      nextErrors.fullName = 'Please enter your full name.';
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = 'Please enter a valid email address.';
    }
    if (!form.phone.trim() || form.phone.replace(/\D/g, '').length < 7) {
      nextErrors.phone = 'Please enter a valid phone or WhatsApp number.';
    }
    if (!form.address.trim() || form.address.trim().length < 5) {
      nextErrors.address = 'Please enter your street address.';
    }
    if (!form.city.trim()) {
      nextErrors.city = 'Please enter your city.';
    }
    if (!form.postalCode.trim()) {
      nextErrors.postalCode = 'Please enter your postal or ZIP code.';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (hydratedCart.length === 0 || !validate()) return;

    const orderNumber = `SLN-${Math.floor(100000 + Math.random() * 900000)}`;
    const orderItems = hydratedCart.map((i) => ({
      name: i.product.name,
      sku: i.product.sku,
      size: i.size,
      colorName: i.colorName,
      quantity: i.quantity,
      unitPrice: i.unitPrice,
      lineTotal: i.lineTotal,
      image: i.product.image,
    }));

    const whatsappMessage = buildCartCheckoutMessage({
      orderNumber,
      items: orderItems,
      subtotal,
      discountAmount,
      shippingFee,
      total,
      customer: form,
    });
    const whatsappUrl = buildWhatsAppUrl(whatsappMessage);

    const newOrder: OrderRecord = {
      orderNumber,
      createdAt: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      items: orderItems,
      subtotal,
      discountAmount,
      shippingFee,
      total,
      customer: form,
      whatsappUrl,
    };

    recordOrder(newOrder);
    setConfirmedOrder(newOrder);
    clearCart();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (confirmedOrder) {
    return (
      <div className="bg-[#FAF7F2]">
        <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
          <div className="border border-[#E2D9CE] bg-[#F2ECE3] p-8 sm:p-10 space-y-6">
            <div className="flex items-start gap-4">
              <CheckCircle2 className="h-8 w-8 shrink-0 text-[#5C4332]" aria-hidden="true" />
              <div>
                <p className="text-xs font-medium tracking-wider uppercase text-[#5C4332]">Order Confirmed</p>
                <h1 className="mt-1 font-display text-3xl sm:text-4xl font-medium text-[#2B231D]">
                  Order #{confirmedOrder.orderNumber} — Preparing Shipment
                </h1>
                <p className="mt-2 text-sm text-[#6E6359]">
                  Thank you, {confirmedOrder.customer.fullName}. Send your pre-filled confirmation on WhatsApp to
                  connect directly with our dispatch concierge.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={confirmedOrder.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-11 items-center gap-2 bg-[#5C4332] px-6 text-xs font-medium tracking-wide text-[#FAF7F2] hover:bg-[#3D2B1F] transition-colors"
              >
                <MessageCircle className="h-4 w-4" aria-hidden="true" />
                <span>Send Order Summary via WhatsApp</span>
              </a>
              <Link
                to="/shoes"
                className="inline-flex h-11 items-center border border-[#2B231D] px-6 text-xs font-medium tracking-wide text-[#2B231D] hover:bg-[#FAF7F2]"
              >
                Continue Browsing
              </Link>
            </div>

            <div className="border-t border-[#DFD4C6] pt-6 space-y-4">
              <h2 className="font-sans text-xs font-semibold tracking-wider uppercase text-[#5C4332]">Receipt Summary</h2>
              <div className="divide-y divide-[#DFD4C6]">
                {confirmedOrder.items.map((item, idx) => (
                  <div key={`${item.sku}-${idx}`} className="flex items-center justify-between py-3 text-sm">
                    <div>
                      <p className="font-medium text-[#2B231D]">
                        {item.name} × {item.quantity}
                      </p>
                      <p className="text-xs text-[#6E6359]">
                        Size {item.size} · {item.colorName}
                      </p>
                    </div>
                    <span className="font-medium text-[#2B231D] tabular-nums">{formatCurrency(item.lineTotal)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t border-[#DFD4C6] pt-3 space-y-1.5 text-sm tabular-nums">
                <div className="flex justify-between text-[#6E6359]">
                  <span>Subtotal</span>
                  <span>{formatCurrency(confirmedOrder.subtotal)}</span>
                </div>
                {confirmedOrder.discountAmount > 0 && (
                  <div className="flex justify-between text-[#5C4332]">
                    <span>Discount</span>
                    <span>-{formatCurrency(confirmedOrder.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6E6359]">
                  <span>Shipping</span>
                  <span>
                    {confirmedOrder.shippingFee === 0 ? 'Complimentary' : formatCurrency(confirmedOrder.shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between font-semibold text-base text-[#2B231D] pt-1">
                  <span>Total</span>
                  <span>{formatCurrency(confirmedOrder.total)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#FAF7F2]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between border-b border-[#E2D9CE] pb-6">
          <div>
            <h1 className="font-display text-4xl sm:text-5xl font-medium text-[#2B231D]">Checkout</h1>
            <p className="mt-1 text-sm text-[#6E6359]">
              Complete your shipping details below and dispatch via WhatsApp or Cash / Card on Delivery.
            </p>
          </div>
          {lastOrder && hydratedCart.length === 0 && (
            <p className="text-xs text-[#5C4332]">
              Recent order: #{lastOrder.orderNumber} ({lastOrder.createdAt})
            </p>
          )}
        </div>

        {hydratedCart.length === 0 ? (
          <div className="mt-10 border border-[#E2D9CE] bg-[#F2ECE3] px-6 py-16 text-center">
            <h2 className="font-display text-3xl text-[#2B231D]">No items ready for checkout</h2>
            <p className="mt-2 text-sm text-[#6E6359]">Add at least one pair of shoes to your bag before checking out.</p>
            <Link
              to="/shoes"
              className="mt-6 inline-flex h-11 items-center bg-[#2B231D] px-6 text-xs font-medium tracking-wide text-[#FAF7F2]"
            >
              Browse All Shoes
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
            {/* Left: Customer & Delivery Form */}
            <div className="lg:col-span-7 space-y-8">
              <section className="space-y-4">
                <h2 className="font-display text-2xl font-medium text-[#2B231D]">1. Client Information</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="fullName" className="block text-xs font-medium text-[#5C4332] mb-1.5">
                      Full Name *
                    </label>
                    <input
                      id="fullName"
                      type="text"
                      value={form.fullName}
                      onChange={(e) => updateField('fullName', e.target.value)}
                      placeholder="Claire Beaumont"
                      className="h-11 w-full border border-[#DFD4C6] bg-[#FAF7F2] px-3.5 text-sm text-[#2B231D]"
                    />
                    {errors.fullName && <p className="mt-1 text-xs text-[#8C3B2B]">{errors.fullName}</p>}
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-xs font-medium text-[#5C4332] mb-1.5">
                      Email Address *
                    </label>
                    <input
                      id="email"
                      type="email"
                      value={form.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="claire@example.com"
                      className="h-11 w-full border border-[#DFD4C6] bg-[#FAF7F2] px-3.5 text-sm text-[#2B231D]"
                    />
                    {errors.email && <p className="mt-1 text-xs text-[#8C3B2B]">{errors.email}</p>}
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-xs font-medium text-[#5C4332] mb-1.5">
                      Phone / WhatsApp Number *
                    </label>
                    <input
                      id="phone"
                      type="tel"
                      value={form.phone}
                      onChange={(e) => updateField('phone', e.target.value)}
                      placeholder="+92 300 1234567"
                      className="h-11 w-full border border-[#DFD4C6] bg-[#FAF7F2] px-3.5 text-sm text-[#2B231D]"
                    />
                    {errors.phone && <p className="mt-1 text-xs text-[#8C3B2B]">{errors.phone}</p>}
                  </div>
                </div>
              </section>

              <section className="space-y-4 border-t border-[#E2D9CE] pt-6">
                <h2 className="font-display text-2xl font-medium text-[#2B231D]">2. Shipping Address</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="address" className="block text-xs font-medium text-[#5C4332] mb-1.5">
                      Street Address *
                    </label>
                    <input
                      id="address"
                      type="text"
                      value={form.address}
                      onChange={(e) => updateField('address', e.target.value)}
                      placeholder="24-C Main Boulevard, Gulberg III"
                      className="h-11 w-full border border-[#DFD4C6] bg-[#FAF7F2] px-3.5 text-sm text-[#2B231D]"
                    />
                    {errors.address && <p className="mt-1 text-xs text-[#8C3B2B]">{errors.address}</p>}
                  </div>

                  <div>
                    <label htmlFor="city" className="block text-xs font-medium text-[#5C4332] mb-1.5">
                      City *
                    </label>
                    <input
                      id="city"
                      type="text"
                      value={form.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="Lahore"
                      className="h-11 w-full border border-[#DFD4C6] bg-[#FAF7F2] px-3.5 text-sm text-[#2B231D]"
                    />
                    {errors.city && <p className="mt-1 text-xs text-[#8C3B2B]">{errors.city}</p>}
                  </div>

                  <div>
                    <label htmlFor="postalCode" className="block text-xs font-medium text-[#5C4332] mb-1.5">
                      Postal / ZIP Code *
                    </label>
                    <input
                      id="postalCode"
                      type="text"
                      value={form.postalCode}
                      onChange={(e) => updateField('postalCode', e.target.value)}
                      placeholder="54660"
                      className="h-11 w-full border border-[#DFD4C6] bg-[#FAF7F2] px-3.5 text-sm text-[#2B231D]"
                    />
                    {errors.postalCode && <p className="mt-1 text-xs text-[#8C3B2B]">{errors.postalCode}</p>}
                  </div>

                  <div className="sm:col-span-2">
                    <label htmlFor="country" className="block text-xs font-medium text-[#5C4332] mb-1.5">
                      Country / Region
                    </label>
                    <input
                      id="country"
                      type="text"
                      value={form.country}
                      onChange={(e) => updateField('country', e.target.value)}
                      className="h-11 w-full border border-[#DFD4C6] bg-[#FAF7F2] px-3.5 text-sm text-[#2B231D]"
                    />
                  </div>
                </div>
              </section>

              <section className="space-y-4 border-t border-[#E2D9CE] pt-6">
                <h2 className="font-display text-2xl font-medium text-[#2B231D]">3. Delivery &amp; Payment</h2>
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => updateField('deliveryMethod', 'standard')}
                    className={`border p-4 text-left transition-colors ${
                      form.deliveryMethod === 'standard'
                        ? 'border-[#2B231D] bg-[#F2ECE3]'
                        : 'border-[#DFD4C6] bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex justify-between text-sm font-medium text-[#2B231D]">
                      <span>Standard Courier</span>
                      <span className="tabular-nums">
                        {standardShippingFee === 0 ? 'Free' : formatCurrency(standardShippingFee)}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[#6E6359]">3–5 business days · Free over PKR 15,000</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => updateField('deliveryMethod', 'express')}
                    className={`border p-4 text-left transition-colors ${
                      form.deliveryMethod === 'express'
                        ? 'border-[#2B231D] bg-[#F2ECE3]'
                        : 'border-[#DFD4C6] bg-[#FAF7F2]'
                    }`}
                  >
                    <div className="flex justify-between text-sm font-medium text-[#2B231D]">
                      <span>Express Air Courier</span>
                      <span className="tabular-nums">{formatCurrency(STORE_CONFIG.expressShippingFee)}</span>
                    </div>
                    <p className="mt-1 text-xs text-[#6E6359]">1–2 business days · Priority dispatch</p>
                  </button>
                </div>

                <div className="space-y-2 pt-2">
                  {[
                    {
                      id: 'whatsapp',
                      title: 'WhatsApp Concierge Instant Order',
                      desc: 'Confirm availability & receive a private payment link via WhatsApp.',
                    },
                    {
                      id: 'cod',
                      title: 'Cash on Delivery (COD)',
                      desc: 'Pay in cash when your boxed Solenne order arrives at your door.',
                    },
                    {
                      id: 'card_on_delivery',
                      title: 'Card on Delivery',
                      desc: 'Tap or swipe via portable courier terminal upon inspection.',
                    },
                  ].map((pm) => (
                    <label
                      key={pm.id}
                      className={`flex items-start gap-3 border p-3.5 cursor-pointer transition-colors ${
                        form.paymentMethod === pm.id
                          ? 'border-[#2B231D] bg-[#F2ECE3]'
                          : 'border-[#DFD4C6] bg-[#FAF7F2]'
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={form.paymentMethod === pm.id}
                        onChange={() => updateField('paymentMethod', pm.id as CheckoutFormData['paymentMethod'])}
                        className="mt-1 accent-[#5C4332]"
                      />
                      <div>
                        <span className="block text-sm font-medium text-[#2B231D]">{pm.title}</span>
                        <span className="block text-xs text-[#6E6359]">{pm.desc}</span>
                      </div>
                    </label>
                  ))}
                </div>

                <div>
                  <label htmlFor="notes" className="block text-xs font-medium text-[#5C4332] mb-1.5">
                    Delivery or Gift Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={form.notes}
                    onChange={(e) => updateField('notes', e.target.value)}
                    placeholder="Gate code, preferred delivery window, or complimentary gift card message..."
                    className="w-full border border-[#DFD4C6] bg-[#FAF7F2] p-3.5 text-sm text-[#2B231D]"
                  />
                </div>
              </section>
            </div>

            {/* Right: Sticky Summary & Place Order */}
            <aside className="lg:col-span-5 lg:sticky lg:top-24 border border-[#E2D9CE] bg-[#F2ECE3] p-6 space-y-5">
              <h2 className="font-display text-2xl font-medium text-[#2B231D]">Your Selection</h2>

              <div className="divide-y divide-[#DFD4C6] max-h-72 overflow-y-auto pr-1">
                {hydratedCart.map((item) => (
                  <div
                    key={`${item.productId}-${item.size}-${item.colorName}`}
                    className="flex items-center gap-3.5 py-3"
                  >
                    <div className="h-14 w-16 shrink-0 overflow-hidden bg-[#FAF7F2] border border-[#DFD4C6]">
                      <ProductImage src={item.product.image} alt={item.product.name} className="h-full w-full object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-[#2B231D] truncate">{item.product.name}</p>
                      <p className="text-xs text-[#6E6359]">
                        {item.size} · {item.colorName} × {item.quantity}
                      </p>
                    </div>
                    <span className="text-sm font-semibold text-[#2B231D] tabular-nums">
                      {formatCurrency(item.lineTotal)}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-[#DFD4C6] pt-4 space-y-2 text-sm tabular-nums">
                <div className="flex justify-between text-[#6E6359]">
                  <span>Subtotal</span>
                  <span className="text-[#2B231D]">{formatCurrency(subtotal)}</span>
                </div>
                {discountAmount > 0 && (
                  <div className="flex justify-between text-[#5C4332]">
                    <span>Promo Discount</span>
                    <span>-{formatCurrency(discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-[#6E6359]">
                  <span>Shipping</span>
                  <span className="text-[#2B231D]">
                    {shippingFee === 0 ? 'Complimentary' : formatCurrency(shippingFee)}
                  </span>
                </div>
                <div className="flex justify-between border-t border-[#DFD4C6] pt-3 text-lg font-semibold text-[#2B231D]">
                  <span>Total Due</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>

              <button
                type="submit"
                className="flex h-12 w-full items-center justify-center gap-2 bg-[#2B231D] text-xs font-medium tracking-wider uppercase text-[#FAF7F2] hover:bg-[#5C4332] transition-colors"
              >
                <span>Confirm Order &amp; Prepare WhatsApp</span>
              </button>

              <p className="flex items-center justify-center gap-1.5 text-xs text-[#6E6359]">
                <ShieldCheck className="h-4 w-4 text-[#5C4332]" aria-hidden="true" />
                <span>30-day complimentary size exchange guaranteed.</span>
              </p>
            </aside>
          </form>
        )}
      </div>
    </div>
  );
}
