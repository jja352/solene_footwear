import { useEffect } from 'react';
import { BrowserRouter, Route, Routes, useLocation } from 'react-router-dom';
import { CartDrawer } from './components/CartDrawer';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Footer } from './components/Footer';
import { Header } from './components/Header';
import { SearchOverlay } from './components/SearchOverlay';
import { WishlistDrawer } from './components/WishlistDrawer';
import { StoreProvider, useStore } from './context/StoreContext';
import { AboutPage } from './pages/AboutPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { CollectionPage } from './pages/CollectionPage';
import { ContactPage } from './pages/ContactPage';
import { FaqPage } from './pages/FaqPage';
import { HomePage } from './pages/HomePage';
import { ProductDetailPage } from './pages/ProductDetailPage';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function ToastBanner() {
  const { toastMessage } = useStore();
  if (!toastMessage) return null;
  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-18 left-1/2 z-50 -translate-x-1/2 bg-[#2B231D] px-5 py-2.5 text-xs font-medium tracking-wide text-[#FAF7F2] shadow-xl"
    >
      {toastMessage}
    </div>
  );
}

function AppShell() {
  return (
    <div className="flex min-h-screen flex-col bg-[#FAF7F2] text-[#2B231D]">
      <ScrollToTop />
      <Header />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/men" element={<CollectionPage mode="men" />} />
          <Route path="/men/:categorySlug" element={<CollectionPage mode="men" />} />
          <Route path="/women" element={<CollectionPage mode="women" />} />
          <Route path="/women/:categorySlug" element={<CollectionPage mode="women" />} />
          <Route path="/shoes" element={<CollectionPage mode="all" />} />
          <Route path="/product/:slug" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faq" element={<FaqPage />} />
          <Route path="*" element={<HomePage />} />
        </Routes>
      </main>
      <Footer />
      <CartDrawer />
      <WishlistDrawer />
      <SearchOverlay />
      <FloatingWhatsApp />
      <ToastBanner />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <StoreProvider>
        <AppShell />
      </StoreProvider>
    </BrowserRouter>
  );
}
