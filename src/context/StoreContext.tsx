import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { STORE_CONFIG } from '../config/store';
import { getEffectivePrice, getProductById } from '../data/catalog';
import { CartItem, OrderRecord, Product } from '../types/shop';

interface HydratedCartItem extends CartItem {
  product: Product;
  unitPrice: number;
  lineTotal: number;
}

interface StoreContextValue {
  cart: CartItem[];
  hydratedCart: HydratedCartItem[];
  cartCount: number;
  subtotal: number;
  promoCode: string;
  promoError: string;
  discountAmount: number;
  standardShippingFee: number;
  wishlistIds: string[];
  wishlistProducts: Product[];
  isCartOpen: boolean;
  isWishlistOpen: boolean;
  isSearchOpen: boolean;
  toastMessage: string | null;
  lastOrder: OrderRecord | null;
  setIsCartOpen: (open: boolean) => void;
  setIsWishlistOpen: (open: boolean) => void;
  setIsSearchOpen: (open: boolean) => void;
  addToCart: (productId: string, size: string, colorName: string, quantity?: number, openDrawer?: boolean) => void;
  updateCartQuantity: (productId: string, size: string, colorName: string, quantity: number) => void;
  removeFromCart: (productId: string, size: string, colorName: string) => void;
  clearCart: () => void;
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  applyPromoCode: (code: string) => boolean;
  clearPromoCode: () => void;
  recordOrder: (order: OrderRecord) => void;
  showToast: (message: string) => void;
}

const StoreContext = createContext<StoreContextValue | undefined>(undefined);

const STORAGE_KEYS = {
  cart: 'solenne_cart_v1',
  wishlist: 'solenne_wishlist_v1',
  promo: 'solenne_promo_v1',
  lastOrder: 'solenne_last_order_v1',
};

function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => readStorage<CartItem[]>(STORAGE_KEYS.cart, []));
  const [wishlistIds, setWishlistIds] = useState<string[]>(() => readStorage<string[]>(STORAGE_KEYS.wishlist, []));
  const [promoCode, setPromoCode] = useState<string>(() => readStorage<string>(STORAGE_KEYS.promo, ''));
  const [promoError, setPromoError] = useState<string>('');
  const [lastOrder, setLastOrder] = useState<OrderRecord | null>(() =>
    readStorage<OrderRecord | null>(STORAGE_KEYS.lastOrder, null)
  );

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.cart, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.wishlist, JSON.stringify(wishlistIds));
    } catch {
      // Ignore storage quota errors
    }
  }, [wishlistIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.promo, JSON.stringify(promoCode));
    } catch {
      // Ignore storage quota errors
    }
  }, [promoCode]);

  const showToast = useCallback((message: string) => {
    setToastMessage(message);
  }, []);

  useEffect(() => {
    if (!toastMessage) return;
    const timer = window.setTimeout(() => setToastMessage(null), 2800);
    return () => window.clearTimeout(timer);
  }, [toastMessage]);

  const hydratedCart = useMemo<HydratedCartItem[]>(() => {
    return cart
      .map((item) => {
        const product = getProductById(item.productId);
        if (!product) return null;
        const unitPrice = getEffectivePrice(product);
        return {
          ...item,
          product,
          unitPrice,
          lineTotal: Number((unitPrice * item.quantity).toFixed(2)),
        };
      })
      .filter((x): x is HydratedCartItem => x !== null);
  }, [cart]);

  const cartCount = useMemo(() => hydratedCart.reduce((sum, item) => sum + item.quantity, 0), [hydratedCart]);

  const subtotal = useMemo(
    () => Number(hydratedCart.reduce((sum, item) => sum + item.lineTotal, 0).toFixed(2)),
    [hydratedCart]
  );

  const discountAmount = useMemo(() => {
    if (!promoCode || subtotal <= 0) return 0;
    const normalized = promoCode.trim().toUpperCase();
    if (normalized === 'SOLENNE10') {
      return Number((subtotal * (STORE_CONFIG.promoCodes.SOLENNE10.value / 100)).toFixed(2));
    }
    if (normalized === 'ATELIER20' && subtotal >= STORE_CONFIG.promoCodes.ATELIER20.minSubtotal) {
      return STORE_CONFIG.promoCodes.ATELIER20.value;
    }
    return 0;
  }, [promoCode, subtotal]);

  const standardShippingFee = useMemo(() => {
    if (subtotal === 0) return 0;
    return subtotal - discountAmount >= STORE_CONFIG.freeShippingThreshold ? 0 : STORE_CONFIG.standardShippingFee;
  }, [subtotal, discountAmount]);

  const wishlistProducts = useMemo(
    () => wishlistIds.map((id) => getProductById(id)).filter((p): p is Product => Boolean(p)),
    [wishlistIds]
  );

  const addToCart = useCallback(
    (productId: string, size: string, colorName: string, quantity = 1, openDrawer = true) => {
      const product = getProductById(productId);
      if (!product || product.stock <= 0) return;
      const safeQty = Math.max(1, Math.min(quantity, product.stock));

      setCart((prev) => {
        const existingIndex = prev.findIndex(
          (item) => item.productId === productId && item.size === size && item.colorName === colorName
        );
        if (existingIndex >= 0) {
          const updated = [...prev];
          const nextQty = Math.min(updated[existingIndex].quantity + safeQty, product.stock);
          updated[existingIndex] = { ...updated[existingIndex], quantity: nextQty };
          return updated;
        }
        return [...prev, { productId, size, colorName, quantity: safeQty }];
      });

      if (openDrawer) {
        setIsCartOpen(true);
      } else {
        showToast(`Added ${product.name} (${size}) to your bag`);
      }
    },
    [showToast]
  );

  const updateCartQuantity = useCallback((productId: string, size: string, colorName: string, quantity: number) => {
    const product = getProductById(productId);
    if (!product) return;

    if (quantity <= 0) {
      setCart((prev) =>
        prev.filter((item) => !(item.productId === productId && item.size === size && item.colorName === colorName))
      );
      return;
    }

    const clamped = Math.min(quantity, product.stock);
    setCart((prev) =>
      prev.map((item) =>
        item.productId === productId && item.size === size && item.colorName === colorName
          ? { ...item, quantity: clamped }
          : item
      )
    );
  }, []);

  const removeFromCart = useCallback((productId: string, size: string, colorName: string) => {
    setCart((prev) =>
      prev.filter((item) => !(item.productId === productId && item.size === size && item.colorName === colorName))
    );
  }, []);

  const clearCart = useCallback(() => {
    setCart([]);
    setPromoCode('');
    setPromoError('');
  }, []);

  const toggleWishlist = useCallback(
    (productId: string) => {
      const product = getProductById(productId);
      setWishlistIds((prev) => {
        const exists = prev.includes(productId);
        const next = exists ? prev.filter((id) => id !== productId) : [productId, ...prev];
        if (product) {
          showToast(exists ? `Removed ${product.name} from saved items` : `Saved ${product.name} to wishlist`);
        }
        return next;
      });
    },
    [showToast]
  );

  const isWishlisted = useCallback((productId: string) => wishlistIds.includes(productId), [wishlistIds]);

  const applyPromoCode = useCallback(
    (rawCode: string): boolean => {
      const code = rawCode.trim().toUpperCase();
      if (!code) {
        setPromoError('Please enter a promo code.');
        return false;
      }
      if (code === 'SOLENNE10') {
        setPromoCode('SOLENNE10');
        setPromoError('');
        showToast('Applied SOLENNE10 (10% off)');
        return true;
      }
      if (code === 'ATELIER20') {
        if (subtotal < STORE_CONFIG.promoCodes.ATELIER20.minSubtotal) {
          setPromoError(
            `ATELIER20 requires a minimum subtotal of PKR ${STORE_CONFIG.promoCodes.ATELIER20.minSubtotal.toLocaleString('en-PK')}.`
          );
          return false;
        }
        setPromoCode('ATELIER20');
        setPromoError('');
        showToast('Applied ATELIER20 (PKR 2,000 off)');
        return true;
      }
      setPromoError('Code not recognized. Try SOLENNE10 or ATELIER20.');
      return false;
    },
    [subtotal, showToast]
  );

  const clearPromoCode = useCallback(() => {
    setPromoCode('');
    setPromoError('');
  }, []);

  const recordOrder = useCallback((order: OrderRecord) => {
    setLastOrder(order);
    try {
      localStorage.setItem(STORAGE_KEYS.lastOrder, JSON.stringify(order));
    } catch {
      // Ignore storage error
    }
  }, []);

  const value: StoreContextValue = {
    cart,
    hydratedCart,
    cartCount,
    subtotal,
    promoCode,
    promoError,
    discountAmount,
    standardShippingFee,
    wishlistIds,
    wishlistProducts,
    isCartOpen,
    isWishlistOpen,
    isSearchOpen,
    toastMessage,
    lastOrder,
    setIsCartOpen,
    setIsWishlistOpen,
    setIsSearchOpen,
    addToCart,
    updateCartQuantity,
    removeFromCart,
    clearCart,
    toggleWishlist,
    isWishlisted,
    applyPromoCode,
    clearPromoCode,
    recordOrder,
    showToast,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) {
    throw new Error('useStore must be used inside StoreProvider');
  }
  return ctx;
}
