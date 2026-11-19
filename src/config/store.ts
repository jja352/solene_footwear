export const STORE_CONFIG = {
  brandName: 'Solenne',
  fullBrandName: 'Solenne Footwear',
  tagline: 'Handcrafted footwear shaped with quiet care in dusty woody and natural tones.',
  whatsappNumber: (import.meta.env.VITE_WHATSAPP_NUMBER as string | undefined)?.replace(/\D/g, '') || '923001234567',
  supportEmail: 'concierge@solennefootwear.com',
  supportPhone: '+92 300 123 4567',
  showroomAddress: '24-C MM Alam Road, Gulberg III, Lahore, Pakistan',
  showroomHours: 'Mon – Sat: 11:00 AM – 9:00 PM · Sun: 1:00 PM – 7:00 PM',
  freeShippingThreshold: 15000,
  standardShippingFee: 350,
  expressShippingFee: 750,
  promoCodes: {
    SOLENNE10: { type: 'percent' as const, value: 10, label: '10% Welcome Privilege' },
    ATELIER20: { type: 'fixed' as const, value: 2000, minSubtotal: 15000, label: 'PKR 2,000 Atelier Credit' },
  },
};
