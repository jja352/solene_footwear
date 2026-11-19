import { MessageCircle } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { buildSupportMessage, buildWhatsAppUrl } from '../utils/whatsapp';

export function FloatingWhatsApp() {
  const { pathname } = useLocation();
  const isProductDetail = pathname.startsWith('/product/');
  const href = buildWhatsAppUrl(buildSupportMessage());

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Solenne Concierge on WhatsApp"
      className={`fixed right-4 z-30 inline-flex h-11 items-center gap-2 rounded-full bg-[#3D2B1F] px-3.5 sm:px-4 text-xs font-medium tracking-wide text-[#FAF7F2] shadow-lg transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[#5C4332] ${
        isProductDetail ? 'bottom-18 md:bottom-5' : 'bottom-4 md:bottom-5'
      }`}
    >
      <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="hidden sm:inline whitespace-nowrap">WhatsApp Concierge</span>
    </a>
  );
}
