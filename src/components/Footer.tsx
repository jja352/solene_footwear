import { MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { STORE_CONFIG } from '../config/store';
import { categoryToSlug } from '../data/catalog';
import { buildSupportMessage, buildWhatsAppUrl } from '../utils/whatsapp';

export function Footer() {
  const whatsappHref = buildWhatsAppUrl(buildSupportMessage());

  return (
    <footer className="border-t border-[#D8C7B6] bg-[#DFD0BF] text-[#2E2119]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link to="/" className="font-display text-2xl font-semibold tracking-tight text-[#2E2119]">
              Solenne
            </Link>
            <p className="max-w-xs text-sm leading-relaxed text-[#5A473C]">
              Architectural footwear house crafting men’s and women’s sneakers, loafers, boots, and heels with care in
              dusty woody, sand, and walnut tones.
            </p>
            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-10 items-center gap-2 border border-[#4A3224] bg-[#F5EEE6]/70 px-4 text-xs font-medium tracking-wide text-[#4A3224] hover:bg-[#4A3224] hover:text-[#F6EFE7] transition-colors"
            >
              <MessageCircle className="h-4 w-4" aria-hidden="true" />
              <span>WhatsApp Concierge</span>
            </a>
          </div>

          <div>
            <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-[#5C4332] mb-4">
              Men’s Highlights
            </h3>
            <ul className="space-y-2.5 text-sm text-[#6E6359]">
              <li>
                <Link to="/men" className="hover:text-[#2B231D] transition-colors">
                  All Men’s Shoes
                </Link>
              </li>
              {['Running Shoes', 'Casual Sneakers', 'Loafers', 'Oxford Shoes', 'Chelsea Boots', 'Slides'].map((cat) => (
                <li key={cat}>
                  <Link to={`/men/${categoryToSlug(cat)}`} className="hover:text-[#2B231D] transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-[#5C4332] mb-4">
              Women’s Highlights
            </h3>
            <ul className="space-y-2.5 text-sm text-[#6E6359]">
              <li>
                <Link to="/women" className="hover:text-[#2B231D] transition-colors">
                  All Women’s Shoes
                </Link>
              </li>
              {['Platform Sneakers', 'Ballet Flats', 'Block Heels', 'Stilettos', 'Ankle Boots', 'Sandals'].map((cat) => (
                <li key={cat}>
                  <Link to={`/women/${categoryToSlug(cat)}`} className="hover:text-[#2B231D] transition-colors">
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-sans text-xs font-semibold tracking-wider uppercase text-[#5C4332] mb-4">
              House &amp; Client Care
            </h3>
            <ul className="space-y-2.5 text-sm text-[#6E6359]">
              <li>
                <Link to="/shoes" className="hover:text-[#2B231D] transition-colors">
                  All Footwear Catalog
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#2B231D] transition-colors">
                  Shopping Bag
                </Link>
              </li>
              <li>
                <Link to="/checkout" className="hover:text-[#2B231D] transition-colors">
                  Checkout
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-[#2B231D] transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#2B231D] transition-colors">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-[#2B231D] transition-colors">
                  FAQ &amp; Sizing Guide
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-[#DFD4C6] pt-6 text-xs text-[#6E6359] sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} {STORE_CONFIG.fullBrandName}. All rights reserved.</p>
          <p>{STORE_CONFIG.showroomAddress} · {STORE_CONFIG.supportEmail}</p>
        </div>
      </div>
    </footer>
  );
}
