import { STORE_CONFIG } from '../config/store';
import { CheckoutFormData } from '../types/shop';

export function formatCurrency(amount: number): string {
  return `PKR ${Math.round(amount).toLocaleString('en-PK')}`;
}

export function buildWhatsAppUrl(message: string): string {
  const cleanNumber = STORE_CONFIG.whatsappNumber;
  return `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`;
}

export function buildProductOrderMessage(params: {
  productName: string;
  sku: string;
  department: string;
  category: string;
  size: string;
  colorName: string;
  quantity: number;
  unitPrice: number;
  customerName?: string;
  customerPhone?: string;
  customerNote?: string;
}): string {
  const total = params.unitPrice * params.quantity;
  const lines = [
    `Hello ${STORE_CONFIG.fullBrandName}, I would like to order:`,
    ``,
    `*Product:* ${params.productName}`,
    `*SKU:* ${params.sku}`,
    `*Collection:* ${params.department === 'men' ? "Men's" : "Women's"} · ${params.category}`,
    `*Size:* ${params.size}`,
    `*Color:* ${params.colorName}`,
    `*Quantity:* ${params.quantity}`,
    `*Unit Price:* ${formatCurrency(params.unitPrice)}`,
    `*Total Price:* ${formatCurrency(total)}`,
  ];

  if (params.customerName || params.customerPhone || params.customerNote) {
    lines.push(``, `*Customer Details:*`);
    if (params.customerName) lines.push(`Name: ${params.customerName}`);
    if (params.customerPhone) lines.push(`Phone: ${params.customerPhone}`);
    if (params.customerNote) lines.push(`Note: ${params.customerNote}`);
  } else {
    lines.push(``, `Please confirm availability and delivery timeline.`);
  }

  return lines.join('\n');
}

export function buildCartCheckoutMessage(params: {
  orderNumber?: string;
  items: Array<{
    name: string;
    size: string;
    colorName: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }>;
  subtotal: number;
  discountAmount: number;
  shippingFee: number;
  total: number;
  customer?: Partial<CheckoutFormData>;
}): string {
  const lines = [
    `Hello ${STORE_CONFIG.fullBrandName}, I would like to place an order${params.orderNumber ? ` (${params.orderNumber})` : ''}:`,
    ``,
    `*Order Items:*`,
  ];

  params.items.forEach((item, index) => {
    lines.push(
      `${index + 1}. ${item.name} — Size ${item.size}, ${item.colorName} × ${item.quantity} (${formatCurrency(item.lineTotal)})`
    );
  });

  lines.push(``, `*Order Summary:*`);
  lines.push(`Subtotal: ${formatCurrency(params.subtotal)}`);
  if (params.discountAmount > 0) {
    lines.push(`Promo Discount: -${formatCurrency(params.discountAmount)}`);
  }
  lines.push(`Shipping: ${params.shippingFee === 0 ? 'Complimentary' : formatCurrency(params.shippingFee)}`);
  lines.push(`*Total Payable:* ${formatCurrency(params.total)}`);

  if (params.customer && (params.customer.fullName || params.customer.phone || params.customer.address)) {
    lines.push(``, `*Delivery Details:*`);
    if (params.customer.fullName) lines.push(`Name: ${params.customer.fullName}`);
    if (params.customer.phone) lines.push(`Phone: ${params.customer.phone}`);
    if (params.customer.email) lines.push(`Email: ${params.customer.email}`);
    if (params.customer.address) {
      lines.push(
        `Address: ${params.customer.address}${params.customer.city ? `, ${params.customer.city}` : ''}${
          params.customer.postalCode ? ` ${params.customer.postalCode}` : ''
        }${params.customer.country ? `, ${params.customer.country}` : ''}`
      );
    }
    if (params.customer.deliveryMethod) {
      lines.push(`Shipping Method: ${params.customer.deliveryMethod === 'express' ? 'Express Courier (1-2 days)' : 'Standard Courier (3-5 days)'}`);
    }
    if (params.customer.paymentMethod) {
      const paymentLabels = {
        whatsapp: 'WhatsApp Concierge Payment Link',
        cod: 'Cash on Delivery',
        card_on_delivery: 'Card on Delivery',
      };
      lines.push(`Payment Preference: ${paymentLabels[params.customer.paymentMethod]}`);
    }
    if (params.customer.notes) {
      lines.push(`Notes: ${params.customer.notes}`);
    }
  }

  return lines.join('\n');
}

export function buildSupportMessage(topic?: string): string {
  if (topic) {
    return `Hello ${STORE_CONFIG.fullBrandName} Concierge, I need assistance regarding: ${topic}.`;
  }
  return `Hello ${STORE_CONFIG.fullBrandName} Concierge, I would like sizing or styling advice for your footwear collection.`;
}
