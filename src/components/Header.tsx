import { Heart, Menu, Search, ShoppingBag, X } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { useStore } from '../context/StoreContext';

export function Header() {
  const { cartCount, wishlistIds, setIsCartOpen, setIsWishlistOpen, setIsSearchOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `whitespace-nowrap shrink-0 text-sm transition-colors py-1 border-b ${
      isActive
        ? 'text-[#2B231D] font-medium border-[#5C4332]'
        : 'text-[#6E6359] border-transparent hover:text-[#2B231D] hover:border-[#C9B5A0]'
    }`;

  return (
    <header className="sticky top-0 z-40 border-b border-[#D8C7B6] bg-[#F4EDE4]/95 backdrop-blur-sm">
      <div className="mx-auto flex h-14 md:h-16 max-w-7xl items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Zone 1: Single-element wordmark */}
        <Link
          to="/"
          onClick={() => setMobileMenuOpen(false)}
          className="font-display text-2xl font-semibold tracking-tight text-[#2E2119] whitespace-nowrap shrink-0"
        >
          Solenne
        </Link>

        {/* Zone 2: 5 concise single-line navigation links */}
        <nav aria-label="Primary navigation" className="hidden md:flex items-center gap-7">
          <NavLink to="/men" className={navLinkClass}>
            Men
          </NavLink>
          <NavLink to="/women" className={navLinkClass}>
            Women
          </NavLink>
          <NavLink to="/shoes" className={navLinkClass}>
            All Shoes
          </NavLink>
          <NavLink to="/about" className={navLinkClass}>
            About
          </NavLink>
          <NavLink to="/contact" className={navLinkClass}>
            Contact
          </NavLink>
        </nav>

        {/* Zone 3: Search, Wishlist, and Primary Bag Action */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setIsSearchOpen(true)}
            aria-label="Search shoes"
            className="flex h-10 w-10 items-center justify-center text-[#2E2119] hover:text-[#6B4A37] transition-colors"
          >
            <Search className="h-4.5 w-4.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsWishlistOpen(true)}
            aria-label={`Saved wishlist (${wishlistIds.length})`}
            className="relative flex h-10 w-10 items-center justify-center text-[#2E2119] hover:text-[#6B4A37] transition-colors"
          >
            <Heart className="h-4.5 w-4.5" />
            {wishlistIds.length > 0 && (
              <span className="absolute top-1.5 right-1 text-[10px] font-semibold tabular-nums text-[#6B4A37]">
                {wishlistIds.length}
              </span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            aria-label={`Open shopping bag (${cartCount} items)`}
            className="flex h-10 items-center gap-2 bg-[#4A3224] px-4 text-xs font-medium tracking-wide text-[#F6EFE7] hover:bg-[#342117] transition-colors whitespace-nowrap shrink-0"
          >
            <ShoppingBag className="h-4 w-4" aria-hidden="true" />
            <span className="tabular-nums">Bag ({cartCount})</span>
          </button>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((prev) => !prev)}
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={mobileMenuOpen}
            className="flex md:hidden h-10 w-10 items-center justify-center text-[#2B231D]"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <nav
          aria-label="Mobile navigation"
          className="md:hidden border-t border-[#E2D9CE] bg-[#FAF7F2] px-4 py-5 space-y-1"
        >
          {[
            { to: '/', label: 'Home' },
            { to: '/men', label: "Men's Collection" },
            { to: '/women', label: "Women's Collection" },
            { to: '/shoes', label: 'All Shoes' },
            { to: '/cart', label: `Shopping Bag (${cartCount})` },
            { to: '/checkout', label: 'Checkout' },
            { to: '/about', label: 'About Us' },
            { to: '/contact', label: 'Contact Us' },
            { to: '/faq', label: 'FAQ' },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setMobileMenuOpen(false)}
              className="flex h-11 items-center justify-between border-b border-[#EAE1D5] text-sm font-medium text-[#2B231D] hover:text-[#5C4332]"
            >
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
